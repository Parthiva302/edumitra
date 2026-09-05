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

def _process_answer_evaluation(
    concept: str,
    question_text: str,
    student_answer: str,
    expected_answer: Optional[str],
    language: str,
    lesson_id: Optional[str],
    question_id: Optional[str],
    user_id: str
) -> Dict[str, Any]:
    supabase = get_supabase()
    
    # 1. Evaluate with Gemini diagnostic evaluator
    eval_result = evaluate_student_response(
        concept=concept,
        question=question_text,
        student_answer=student_answer,
        expected_answer=expected_answer,
        language=language
    )

    is_correct = eval_result.get("correct", eval_result.get("is_correct", False))
    score = eval_result.get("score", 85 if is_correct else 35)
    misconception = eval_result.get("misconception")

    # 2. Record answer in student_answers table
    try:
        q_id = question_id or str(uuid.uuid4())
        # Ensure question exists in DB
        try:
            supabase.table("questions").insert({
                "id": q_id,
                "lesson_id": lesson_id or str(uuid.uuid4()),
                "user_id": user_id,
                "question_type": "conceptual",
                "question": question_text,
                "expected_answer": expected_answer or "Accurate understanding",
                "concept": concept
            }).execute()
        except Exception:
            pass

        # Insert student_answer
        ans_record = {
            "question_id": q_id,
            "lesson_id": lesson_id,
            "user_id": user_id,
            "answer": student_answer,
            "score": score,
            "correct": is_correct,
            "is_correct": is_correct,
            "misconception_detected": eval_result.get("misconception_detected", not is_correct),
            "misconception": misconception,
            "feedback": eval_result.get("feedback", ""),
            "ai_evaluation": eval_result
        }
        supabase.table("student_answers").insert(ans_record).execute()
    except Exception as se:
        logger.warning(f"Could not persist student answer: {se}")

    # 3. Update concept_mastery & learning_progress table
    status_str = "MASTERED" if score >= 85 else "LEARNING" if score >= 45 else "NEEDS_REVIEW"
    try:
        existing = supabase.table("learning_progress").select("*").eq("user_id", user_id).eq("concept", concept).execute()
        if existing.data:
            row = existing.data[0]
            prev_score = row.get("mastery_score", 50)
            new_score = round((prev_score + score) / 2)
            supabase.table("learning_progress").update({
                "mastery_score": new_score,
                "attempts": row.get("attempts", 0) + 1,
                "correct_answers": row.get("correct_answers", 0) + (1 if is_correct else 0),
                "incorrect_answers": row.get("incorrect_answers", 0) + (0 if is_correct else 1),
                "status": "MASTERED" if new_score >= 85 else "LEARNING" if new_score >= 45 else "NEEDS_REVIEW",
                "last_reviewed": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", row["id"]).execute()
        else:
            supabase.table("learning_progress").insert({
                "user_id": user_id,
                "lesson_id": lesson_id,
                "topic": concept,
                "concept": concept,
                "mastery_score": score,
                "attempts": 1,
                "correct_answers": 1 if is_correct else 0,
                "incorrect_answers": 0 if is_correct else 1,
                "status": status_str,
                "last_reviewed": datetime.utcnow().isoformat()
            }).execute()
    except Exception:
        # Fallback to concept_mastery table
        try:
            supabase.table("concept_mastery").insert({
                "user_id": user_id,
                "topic": concept,
                "concept": concept,
                "mastery_score": score,
                "status": status_str
            }).execute()
        except Exception:
            pass

    return {
        "correct": is_correct,
        "is_correct": is_correct,
        "score": score,
        "concept_understood": eval_result.get("concept_understood", is_correct),
        "misconception_detected": eval_result.get("misconception_detected", not is_correct),
        "misconception": misconception,
        "feedback": eval_result.get("feedback", ""),
        "recommended_action": eval_result.get("recommended_action", "CONTINUE" if is_correct else "REEXPLAIN"),
        "next_difficulty": eval_result.get("next_difficulty", "ADVANCED" if is_correct else "BEGINNER"),
        "remediation_dialogue": eval_result.get("remediation_dialogue"),
        "remediation_analogy": eval_result.get("remediation_analogy"),
        "remediation_visual_type": eval_result.get("remediation_visual_type", "water_pipe_analogy"),
        "remediation_visual_data": eval_result.get("remediation_visual_data"),
        "retry_question": eval_result.get("retry_question"),
        "mastery_updated_level": status_str
    }

# POST /api/questions/{question_id}/answer
@router.post("/{question_id}/answer")
def answer_question(
    question_id: str,
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Submit student's answer for semantic evaluation, misconception diagnosis, and mastery update"""
    try:
        concept = payload.get("concept", "Target Concept")
        question_text = payload.get("question") or payload.get("question_text", "Concept Check")
        student_ans = payload.get("answer") or payload.get("student_answer", "")
        expected_ans = payload.get("expected_answer")
        language = payload.get("language", "hinglish")
        lesson_id = payload.get("lesson_id")

        return _process_answer_evaluation(
            concept=concept,
            question_text=question_text,
            student_answer=student_ans,
            expected_answer=expected_ans,
            language=language,
            lesson_id=lesson_id,
            question_id=question_id,
            user_id=user_id
        )
    except Exception as e:
        logger.error(f"Error answering question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# POST /api/questions/evaluate (existing frontend endpoint)
@router.post("/evaluate", response_model=EvaluateAnswerResponse)
def evaluate_question_answer(
    payload: EvaluateAnswerRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Evaluate student's answer, detect misconceptions, and generate adaptive remediation"""
    try:
        res = _process_answer_evaluation(
            concept=payload.concept,
            question_text=payload.question,
            student_answer=payload.student_answer,
            expected_answer=payload.expected_answer,
            language=payload.language or "hinglish",
            lesson_id=payload.lesson_id,
            question_id=None,
            user_id=user_id
        )
        return EvaluateAnswerResponse(**res)
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
            language=payload.language or "hinglish",
            teaching_style=payload.teaching_style or "simple_visual"
        )
        return ans
    except Exception as e:
        logger.error(f"Error in ask_teacher_live: {e}")
        return {
            "answer_text": f"Regarding {payload.concept}: remember that this principle balances the underlying forces. Let's observe how the components react.",
            "suggested_visual_action": "none"
        }
