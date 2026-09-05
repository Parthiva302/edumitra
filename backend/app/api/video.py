import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List

from app.schemas.video import VideoScenePlan
from app.services.video_generator import generate_video_scene_plan
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/video", tags=["video"])
logger = logging.getLogger("edumitra.api.video")

@router.post("/generate", response_model=VideoScenePlan)
def create_video_scene_plan(
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Generate structured instructional video scene plan following the teacher-visual-demonstration sequence"""
    try:
        lesson_id = payload.get("lesson_id") or "lesson_default"
        title = payload.get("title") or payload.get("topic") or "Foundations"
        subject = payload.get("subject") or payload.get("topic") or "STEM"
        steps = payload.get("steps", [])
        language = payload.get("language") or payload.get("preferred_language") or "hinglish"

        # If individual step or concept is provided instead of steps list
        if not steps and (payload.get("concept") or payload.get("narration")):
            steps = [{
                "title": payload.get("concept", title),
                "concept": payload.get("concept", title),
                "teacherDialogue": payload.get("narration", f"Let us understand {title}."),
                "visualType": payload.get("visual_type", "concept_card"),
                "visualData": payload.get("visual_props", {})
            }]

        plan = generate_video_scene_plan(
            lesson_id=lesson_id,
            title=title,
            subject=subject,
            steps=steps,
            language=language
        )
        return plan
    except Exception as e:
        logger.error(f"Error generating video scene plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))
