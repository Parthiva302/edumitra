import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List, Dict, Any

from app.schemas.lesson import (
    CreateLessonRequest,
    LessonPlanSchema,
    SaveLessonProgressRequest
)
from app.database.supabase import (
    get_supabase,
    upsert_lesson,
    insert_lesson_steps,
    get_user_lessons,
    get_in_progress_lesson,
    record_learning_history
)
from app.services.lesson_planner import generate_personalized_lesson_plan
from app.services.video_generator import generate_video_scene_plan
from app.services.rag_service import search_relevant_chunks
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/lessons", tags=["lessons"])
logger = logging.getLogger("edumitra.api.lessons")

@router.post("/create", response_model=LessonPlanSchema)
def create_lesson(payload: CreateLessonRequest, user_id: str = Depends(get_current_user_id)):
    """Generate a structured personalized pedagogical lesson plan using Gemini & RAG"""
    try:
        topic = payload.topic.strip()
        doc_context = payload.document_text or ""
        
        # If material_id is provided, retrieve relevant grounded context
        if payload.material_id:
            chunks = search_relevant_chunks(topic, user_id, material_id=payload.material_id, top_k=4)
            if chunks:
                doc_context = "\n\n".join(c.get("content", "") for c in chunks)

        # Generate structured lesson plan
        generated_plan = generate_personalized_lesson_plan(
            topic=topic,
            document_text=doc_context,
            level=payload.level,
            goal=payload.goal,
            language=payload.language,
            duration=payload.duration,
            style=payload.style,
            depth=payload.depth or "normal"
        )

        lesson_id = str(uuid.uuid4())
        generated_plan["id"] = lesson_id

        # Generate synchronized instructional video scene choreography
        scene_plan = generate_video_scene_plan(
            lesson_id=lesson_id,
            title=generated_plan.get("title", topic),
            subject=generated_plan.get("subject", "General STEM"),
            steps=generated_plan.get("steps", []),
            language=payload.language
        )
        all_scenes = scene_plan.get("scenes", [])
        generated_plan["scenes"] = all_scenes
        generated_plan["total_duration_seconds"] = scene_plan.get("total_duration_seconds", 60)

        # Attach scenes and totalSceneCount to each step
        for step_idx, step in enumerate(generated_plan.get("steps", [])):
            step_scenes = step.get("scenes")
            if not step_scenes:
                matching = [s for s in all_scenes if s.get("step_index") == step_idx]
                step["scenes"] = matching if matching else []
            step["totalSceneCount"] = len(step.get("scenes", []))
            if step["totalSceneCount"] > 0:
                step["estimatedMinutes"] = round(max(0.5, sum(s.get("duration_seconds", 60) for s in step["scenes"]) / 60.0), 1)

        # Save to database
        lesson_db_record = {
            "id": lesson_id,
            "user_id": user_id,
            "material_id": payload.material_id,
            "topic": topic,
            "subject": generated_plan.get("subject", "General STEM"),
            "chapter": generated_plan.get("category", "Core Concepts"),
            "learning_objective": payload.goal,
            "learner_level": payload.level,
            "language": payload.language,
            "duration_minutes": 20 if "20" in payload.duration else 10 if "10" in payload.duration else 5,
            "teaching_style": payload.style,
            "status": "in_progress",
            "current_step": 0,
            "total_steps": len(generated_plan.get("steps", [])),
            "progress_percentage": 0,
            "started_at": datetime.utcnow().isoformat()
        }
        upsert_lesson(lesson_db_record)

        # Save steps to lesson_steps table
        db_steps = []
        for i, step in enumerate(generated_plan.get("steps", [])):
            step_id = str(uuid.uuid4())
            step["id"] = step_id
            db_steps.append({
                "id": step_id,
                "lesson_id": lesson_id,
                "user_id": user_id,
                "step_number": i + 1,
                "concept": step.get("concept", topic),
                "step_type": "explanation",
                "explanation": step.get("teacherDialogue", ""),
                "visual_type": step.get("visualType", "concept_card"),
                "visual_content": step.get("visualData", {}),
                "source_reference": f"Step {i+1}",
                "difficulty": payload.level
            })
            
        if db_steps:
            insert_lesson_steps(db_steps)

        # Record in learning history
        record_learning_history({
            "user_id": user_id,
            "lesson_id": lesson_id,
            "topic": topic,
            "action": "lesson_started",
            "metadata": {
                "subject": generated_plan.get("subject"),
                "total_steps": len(db_steps),
                "duration": payload.duration
            }
        })

        return generated_plan
    except Exception as e:
        logger.error(f"Error creating lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/in-progress")
def get_active_in_progress_lesson(user_id: str = Depends(get_current_user_id)):
    """Fetch the student's active in-progress lesson for persistent resume"""
    lesson = get_in_progress_lesson(user_id)
    return lesson

@router.post("/progress")
def save_lesson_step_progress(
    payload: SaveLessonProgressRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Save the student's step progress in the classroom for persistent resume across browser sessions"""
    try:
        supabase = get_supabase()
        supabase.table("lessons").update({
            "current_step": payload.current_step_index,
            "total_steps": payload.total_steps,
            "progress_percentage": payload.progress_percentage,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", payload.lesson_id).eq("user_id", user_id).execute()

        return {"success": True, "saved_step": payload.current_step_index}
    except Exception as e:
        logger.error(f"Error saving lesson step progress: {e}")
        return {"success": True}
