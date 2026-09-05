import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any

from app.schemas.question import EvaluateAnswerRequest, EvaluateAnswerResponse
from app.schemas.lesson import AskTeacherRequest
from app.services.evaluator import evaluate_student_response
from app.services.teaching_engine import answer_student_interruption
from app.database.supabase import (
    get_supabase,
    record_learning_history
)
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/questions", tags=["questions"])
logger = logging.getLogger("edumitra.api.questions")

@router.post("/evaluate", response_model=EvaluateAnswerResponse)
def evaluate_question_answer(
    payload: EvaluateAnswerRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Evaluate student's answer, detect misconceptions, and generate adaptive remediation"""
    try:
        supabase = get_supabase()
        
        # 1. Evaluate with Gemini diagnostic engine
        result = evaluate_student_response(
            concept=payload.concept,
            question=payload.question,
            student_answer=payload.student_answer,
            expected_answer=payload.expected_answer,
            language=payload.language
        )

        is_correct = result.get("is_correct", False)
        score = result.get("score", 70 if is_correct else 30)
        misconception = result.get("misconception")

        # 2. Record answer in student_answers table if lesson_id provided
        if payload.lesson_id:
            try:
                # Ensure a question record exists or insert dummy question
                q_id = str(uuid.uuid4())
                supabase.table("questions").insert({
                    "id": q_id,
                    "lesson_id": payload.lesson_id,
                    "user_id": user_id,
                    "question_type": payload.question_type,
                    "question": payload.question,
                    "expected_answer": payload.expected_answer or "Conceptual accuracy",
                    "concept": payload.concept
                }).execute()

                supabase.table("student_answers").insert({
                    "question_id": q_id,
                    "lesson_id": payload.lesson_id,
                    "user_id": user_id,
                    "answer": payload.student_answer,
                    "is_correct": is_correct,
                    "score": score,
                    "feedback": result.get("feedback", ""),
                    "misconception": misconception,
                    "ai_evaluation": result
                }).execute()
            except Exception as se:
                logger.warning(f"Could not persist student answer: {se}")

        # 3. Update concept_mastery table for student
        try:
            # Check existing mastery for this concept
            existing = supabase.table("concept_mastery").select("*").eq("user_id", user_id).eq("concept", payload.concept).execute()
            if existing.data:
                row = existing.data[0]
                prev_score = row.get("mastery_score", 50)
                new_score = round((prev_score + score) / 2)
                attempts = row.get("attempts", 0) + 1
                corr = row.get("correct_attempts", 0) + (1 if is_correct else 0)
                incorr = row.get("incorrect_attempts", 0) + (0 if is_correct else 1)
                status_str = "Mastered" if new_score >= 80 else "Developing" if new_score >= 60 else "Needs Practice"
                
                supabase.table("concept_mastery").update({
                    "mastery_score": new_score,
                    "attempts": attempts,
                    "correct_attempts": corr,
                    "incorrect_attempts": incorr,
                    "status": status_str,
                    "misconception": misconception if not is_correct else None,
                    "last_studied_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }).eq("id", row["id"]).execute()
            else:
                status_str = "Mastered" if score >= 80 else "Developing" if score >= 60 else "Needs Practice"
                supabase.table("concept_mastery").insert({
                    "user_id": user_id,
                    "topic": payload.concept,
                    "concept": payload.concept,
                    "mastery_score": score,
                    "attempts": 1,
                    "correct_attempts": 1 if is_correct else 0,
                    "incorrect_attempts": 0 if is_correct else 1,
                    "status": status_str,
                    "misconception": misconception if not is_correct else None,
                    "last_studied_at": datetime.utcnow().isoformat()
                }).execute()
        except Exception as me:
            logger.warning(f"Could not update concept mastery: {me}")

        return EvaluateAnswerResponse(
            is_correct=is_correct,
            score=score,
            feedback=result.get("feedback", ""),
            misconception_detected=result.get("misconception_detected", False),
            misconception=misconception,
            remediation_dialogue=result.get("remediation_dialogue"),
            remediation_analogy=result.get("remediation_analogy"),
            remediation_visual_type=result.get("remediation_visual_type", "water_pipe_analogy"),
            remediation_visual_data=result.get("remediation_visual_data"),
            retry_question=result.get("retry_question"),
            mastery_updated_level=status_str if 'status_str' in locals() else ("Mastered" if is_correct else "Needs Practice")
        )
    except Exception as e:
        logger.error(f"Error in evaluate_question_answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask-teacher")
def ask_teacher_live(
    payload: AskTeacherRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Handle live student questions and interruptions during teaching"""
    try:
        ans = answer_student_interruption(
            lesson_title=payload.lesson_id or "Current Subject",
            current_concept=payload.concept,
            student_question=payload.question,
            language=payload.language,
            teaching_style=payload.teaching_style or "simple_visual"
        )
        return ans
    except Exception as e:
        logger.error(f"Error in ask_teacher_live: {e}")
        return {
            "answer_text": f"Regarding {payload.concept}: remember that this principle balances the underlying forces. Let's observe how the components react.",
            "suggested_visual_action": "none"
        }
