import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List, Dict, Any

from app.schemas.assessment import (
    GenerateAssessmentRequest,
    SubmitAssessmentRequest,
    NotesResponse,
    FlashcardsResponse,
    ConceptMapResponse
)
from app.services.question_generator import (
    generate_assessment_questions,
    generate_lesson_notes,
    generate_flashcards,
    generate_concept_map
)
from app.database.supabase import (
    get_supabase,
    get_user_profile,
    upsert_user_profile,
    record_learning_history
)
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api", tags=["assessment"])
logger = logging.getLogger("edumitra.api.assessment")

@router.post("/assessment/generate")
def create_assessment_quiz(
    payload: GenerateAssessmentRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Generate dynamic post-lesson assessment questions based on taught concepts"""
    try:
        questions = generate_assessment_questions(
            topic=payload.topic,
            concepts=payload.concepts,
            level=payload.level,
            count=payload.count
        )
        return {"questions": questions}
    except Exception as e:
        logger.error(f"Error generating assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assessment/submit")
def submit_assessment_report(
    payload: SubmitAssessmentRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Save assessment report, update lesson status to completed, update user stats & mastery, unlock learning path"""
    try:
        supabase = get_supabase()

        # 1. Update lesson status to completed in lessons table
        if payload.lesson_id:
            try:
                supabase.table("lessons").update({
                    "status": "completed",
                    "progress_percentage": 100,
                    "completed_at": datetime.utcnow().isoformat()
                }).eq("id", payload.lesson_id).eq("user_id", user_id).execute()
            except Exception as le:
                logger.warning(f"Could not update lesson status: {le}")

        # 2. Update concept mastery records
        for cm in payload.concept_mastery:
            concept_name = cm.get("concept", "Core Concept")
            score_val = cm.get("score", payload.overall_score)
            status_str = "Mastered" if score_val >= 80 else "Developing" if score_val >= 60 else "Needs Practice"
            try:
                existing = supabase.table("concept_mastery").select("*").eq("user_id", user_id).eq("concept", concept_name).execute()
                if existing.data:
                    row = existing.data[0]
                    new_score = round((row.get("mastery_score", 50) + score_val) / 2)
                    supabase.table("concept_mastery").update({
                        "mastery_score": new_score,
                        "status": "Mastered" if new_score >= 80 else "Developing" if new_score >= 60 else "Needs Practice",
                        "last_studied_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat()
                    }).eq("id", row["id"]).execute()
                else:
                    supabase.table("concept_mastery").insert({
                        "user_id": user_id,
                        "topic": payload.lesson_title,
                        "concept": concept_name,
                        "mastery_score": score_val,
                        "status": status_str,
                        "last_studied_at": datetime.utcnow().isoformat()
                    }).execute()
            except Exception as me:
                logger.warning(f"Could not update mastery for {concept_name}: {me}")

        # 3. Update student profile aggregates (completed lessons count, overall mastery, learning time)
        profile = get_user_profile(user_id) or {"id": user_id}
        # Fetch all mastery records for accurate overall calculation
        all_mastery = supabase.table("concept_mastery").select("mastery_score").eq("user_id", user_id).execute()
        scores = [r["mastery_score"] for r in all_mastery.data if "mastery_score" in r]
        avg_mastery = round(sum(scores) / max(1, len(scores))) if scores else payload.overall_score

        # 4. Record in learning_history table
        record_learning_history({
            "user_id": user_id,
            "lesson_id": payload.lesson_id,
            "topic": payload.lesson_title,
            "action": "completed_lesson",
            "metadata": {
                "score": payload.overall_score,
                "subject": payload.subject,
                "strong_areas": payload.strong_areas,
                "needs_improvement": payload.needs_improvement
            }
        })

        # 5. Advance learning path milestone if matches
        try:
            paths = supabase.table("learning_paths").select("id").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
            if paths.data:
                path_id = paths.data[0]["id"]
                items = supabase.table("learning_path_items").select("*").eq("learning_path_id", path_id).order("position").execute()
                for i, it in enumerate(items.data):
                    if it.get("status") == "in_progress":
                        # Complete current and unlock next
                        supabase.table("learning_path_items").update({
                            "status": "completed",
                            "mastery_score": payload.overall_score
                        }).eq("id", it["id"]).execute()
                        
                        if i + 1 < len(items.data):
                            next_item = items.data[i + 1]
                            supabase.table("learning_path_items").update({
                                "status": "in_progress"
                            }).eq("id", next_item["id"]).execute()
                        break
        except Exception as lpe:
            logger.warning(f"Could not advance learning path: {lpe}")

        return {
            "success": True,
            "overall_score": payload.overall_score,
            "overall_mastery": avg_mastery,
            "teacher_feedback": payload.teacher_feedback,
            "recommended_next_steps": payload.recommended_next_steps
        }
    except Exception as e:
        logger.error(f"Error submitting assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/notes/generate")
def create_notes(payload: Dict[str, Any], user_id: str = Depends(get_current_user_id)):
    """Generate structured revision notes for a lesson and persist in lesson_notes table"""
    try:
        supabase = get_supabase()
        topic = payload.get("topic") or "Lesson Concept"
        concepts = payload.get("concepts") or [topic]
        lesson_id = payload.get("lesson_id")

        notes = generate_lesson_notes(topic, concepts)
        
        if lesson_id:
            try:
                supabase.table("lesson_notes").insert({
                    "lesson_id": lesson_id,
                    "user_id": user_id,
                    "title": notes.get("title", f"{topic} Notes"),
                    "content": notes.get("overview", "") + "\n\n" + notes.get("summary", "")
                }).execute()
            except Exception as ne:
                logger.warning(f"Could not persist lesson notes: {ne}")

        return notes
    except Exception as e:
        logger.error(f"Error generating notes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/flashcards/generate")
def create_flashcards(payload: Dict[str, Any], user_id: str = Depends(get_current_user_id)):
    """Generate revision flashcards and persist in flashcards table"""
    try:
        supabase = get_supabase()
        topic = payload.get("topic") or "Lesson Concept"
        concepts = payload.get("concepts") or [topic]
        lesson_id = payload.get("lesson_id")

        cards = generate_flashcards(topic, concepts)

        if lesson_id:
            try:
                db_cards = []
                for c in cards:
                    db_cards.append({
                        "lesson_id": lesson_id,
                        "user_id": user_id,
                        "question": c.get("question", ""),
                        "answer": c.get("answer", ""),
                        "concept": c.get("concept", topic),
                        "difficulty": c.get("difficulty", "medium")
                    })
                if db_cards:
                    supabase.table("flashcards").insert(db_cards).execute()
            except Exception as fe:
                logger.warning(f"Could not persist flashcards: {fe}")

        return {"cards": cards}
    except Exception as e:
        logger.error(f"Error generating flashcards: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/concept-map/generate")
def create_concept_map(payload: Dict[str, Any], user_id: str = Depends(get_current_user_id)):
    """Generate interactive knowledge concept map graph"""
    try:
        topic = payload.get("topic") or "Core Subject"
        concepts = payload.get("concepts") or [topic]
        cmap = generate_concept_map(topic, concepts)
        return cmap
    except Exception as e:
        logger.error(f"Error generating concept map: {e}")
        raise HTTPException(status_code=500, detail=str(e))
