import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List

from app.schemas.video import VideoScenePlan
from app.services.video_generator import (
    generate_video_scene_plan,
    create_video_generation_job,
    get_video_job_status,
    retry_video_generation_job
)
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/video", tags=["video"])
logger = logging.getLogger("edumitra.api.video")

@router.post("/generate")
def create_video_scene_plan(
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate scene-based instructional video plan and track asynchronous generation job.
    Adheres to teacher-visual-demonstration-question sequence with modular audio narration.
    """
    try:
        lesson_id = payload.get("lesson_id") or "lesson_default"
        title = payload.get("title") or payload.get("topic") or "Foundations"
        subject = payload.get("subject") or payload.get("topic") or "STEM"
        steps = payload.get("steps", [])
        language = payload.get("language") or payload.get("preferred_language") or "hinglish"

        if not steps and (payload.get("concept") or payload.get("narration")):
            steps = [{
                "title": payload.get("concept", title),
                "concept": payload.get("concept", title),
                "teacherDialogue": payload.get("narration", f"Let us understand {title}."),
                "visualType": payload.get("visual_type", "concept_card"),
                "visualData": payload.get("visual_props", {})
            }]

        job = create_video_generation_job(
            lesson_id=lesson_id,
            title=title,
            subject=subject,
            steps=steps,
            language=language
        )

        # Return both job tracking tokens and scene plan for frontend compatibility
        return {
            "job_id": job["job_id"],
            "status": job["status"],
            "video_url": job.get("video_url"),
            "lesson_id": lesson_id,
            "title": title,
            "subject": subject,
            "total_duration_seconds": job.get("total_duration_seconds", 60),
            "scenes": job.get("scenes", [])
        }
    except Exception as e:
        logger.error(f"Error generating video scene plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{job_id}/status")
def check_video_status(
    job_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Check asynchronous generation status of a video job"""
    try:
        status_info = get_video_job_status(job_id)
        return {
            "job_id": job_id,
            "status": status_info.get("status", "completed"),
            "video_url": status_info.get("video_url"),
            "total_duration_seconds": status_info.get("total_duration_seconds"),
            "scenes_count": len(status_info.get("scenes", []))
        }
    except Exception as e:
        logger.error(f"Error checking video status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{job_id}/retry")
def retry_failed_video(
    job_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Retry a failed or stalled video scene generation job"""
    try:
        return retry_video_generation_job(job_id)
    except Exception as e:
        logger.error(f"Error retrying video job: {e}")
        raise HTTPException(status_code=500, detail=str(e))
