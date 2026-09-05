import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List

from app.database.supabase import (
    get_supabase,
    get_user_learning_path,
    create_or_update_learning_path
)
from app.services.learning_path import generate_personalized_learning_path
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/learning-path", tags=["learning_path"])
logger = logging.getLogger("edumitra.api.learning_path")

@router.get("")
def get_student_learning_path(user_id: str = Depends(get_current_user_id)):
    """Fetch the student's current learning path with nodes and unlock status"""
    try:
        supabase = get_supabase()
        path_res = supabase.table("learning_paths").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
        
        if not path_res.data:
            # Generate default path
            default_path = generate_personalized_learning_path("STEM & AI Foundations")
            return default_path

        path_data = path_res.data[0]
        items_res = supabase.table("learning_path_items").select("*").eq("learning_path_id", path_data["id"]).order("position").execute()
        
        nodes = []
        for it in items_res.data:
            nodes.append({
                "id": it.get("id"),
                "title": it.get("title"),
                "status": it.get("status", "locked"),
                "estimatedHours": 3.0,
                "description": it.get("description", ""),
                "subTopics": ["Core Foundations", "Mechanism", "Assessment"]
            })

        return {
            "id": path_data.get("id"),
            "title": path_data.get("title"),
            "category": path_data.get("subject", "STEM"),
            "description": path_data.get("description", ""),
            "nodes": nodes
        }
    except Exception as e:
        logger.error(f"Error fetching learning path: {e}")
        return generate_personalized_learning_path("STEM & AI Foundations")

@router.post("/create")
@router.post("/generate")
def create_custom_learning_path(
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Generate and persist a structured multi-milestone learning roadmap for the student"""
    try:
        topic = payload.get("topic") or payload.get("subject") or "STEM Track"
        level = payload.get("level") or "beginner"
        goal = payload.get("goal") or "understand_concept"

        gen_path = generate_personalized_learning_path(topic, level, goal)
        supabase = get_supabase()

        path_insert = supabase.table("learning_paths").insert({
            "user_id": user_id,
            "title": gen_path.get("title", f"{topic} Mastery Track"),
            "description": gen_path.get("description", ""),
            "subject": topic,
            "current_item": 0
        }).execute()

        if path_insert.data:
            path_id = path_insert.data[0]["id"]
            db_items = []
            for i, n in enumerate(gen_path.get("nodes", [])):
                db_items.append({
                    "learning_path_id": path_id,
                    "user_id": user_id,
                    "position": i + 1,
                    "title": n.get("title", f"Milestone {i+1}"),
                    "description": n.get("description", ""),
                    "status": "in_progress" if i == 0 else "locked",
                    "mastery_score": 0
                })
            if db_items:
                supabase.table("learning_path_items").insert(db_items).execute()

        return gen_path
    except Exception as e:
        logger.error(f"Error generating learning path: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/toggle-milestone")
def toggle_milestone(
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Toggle status of milestone between in_progress and completed"""
    try:
        node_id = payload.get("node_id")
        supabase = get_supabase()
        item = supabase.table("learning_path_items").select("*").eq("id", node_id).eq("user_id", user_id).execute()
        if item.data:
            curr_status = item.data[0].get("status")
            new_status = "completed" if curr_status != "completed" else "in_progress"
            supabase.table("learning_path_items").update({"status": new_status}).eq("id", node_id).execute()
            return {"success": True, "new_status": new_status}
        return {"success": False}
    except Exception as e:
        logger.error(f"Error toggling milestone: {e}")
        return {"success": False}
