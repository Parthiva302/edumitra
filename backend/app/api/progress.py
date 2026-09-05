import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List

from app.database.supabase import (
    get_supabase,
    get_user_profile,
    get_in_progress_lesson,
    get_user_materials,
    get_user_concept_mastery,
    get_user_learning_history
)
from app.services.learning_path import generate_personalized_learning_path
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/progress", tags=["progress"])
logger = logging.getLogger("edumitra.api.progress")

@router.get("")
def get_user_data_bundle(user_id: str = Depends(get_current_user_id)):
    """Fetch complete persistent user data bundle for dashboard and workspace synchronization"""
    try:
        supabase = get_supabase()
        
        # 1. Profile
        raw_profile = get_user_profile(user_id) or {"id": user_id, "full_name": "Student", "email": ""}
        
        # 2. In-Progress Lesson
        raw_in_prog = get_in_progress_lesson(user_id)
        in_progress_bundle = None
        if raw_in_prog:
            steps_data = []
            for st in raw_in_prog.get("lesson_steps", []):
                steps_data.append({
                    "id": st.get("id"),
                    "stepNumber": f"0{st.get('step_number', 1)}",
                    "title": st.get("concept", "Step"),
                    "concept": st.get("concept", "Step"),
                    "estimatedMinutes": 3,
                    "teacherDialogue": st.get("explanation", ""),
                    "visualType": st.get("visual_type", "concept_card"),
                    "visualData": st.get("visual_content", {})
                })
            in_progress_bundle = {
                "id": raw_in_prog.get("id"),
                "title": raw_in_prog.get("topic"),
                "subject": raw_in_prog.get("subject", "General"),
                "category": raw_in_prog.get("chapter", "Core"),
                "level": raw_in_prog.get("learner_level", "beginner"),
                "language": raw_in_prog.get("language", "hinglish"),
                "duration": f"{raw_in_prog.get('duration_minutes', 20)}m",
                "currentStepIndex": raw_in_prog.get("current_step", 0),
                "totalSteps": raw_in_prog.get("total_steps", len(steps_data)),
                "currentConcept": steps_data[raw_in_prog.get("current_step", 0)].get("concept") if steps_data and raw_in_prog.get("current_step", 0) < len(steps_data) else raw_in_prog.get("topic"),
                "progressPercentage": raw_in_prog.get("progress_percentage", 0),
                "updatedAt": raw_in_prog.get("updated_at", ""),
                "steps": steps_data
            }

        # 3. Documents / Materials
        raw_materials = get_user_materials(user_id)
        materials_list = []
        for m in raw_materials:
            materials_list.append({
                "id": m.get("id"),
                "name": m.get("file_name"),
                "title": m.get("title") or m.get("file_name"),
                "type": m.get("file_type") or "PDF",
                "size": m.get("file_size") or "1.5 MB",
                "pages": 10,
                "uploadedAt": m.get("created_at", "Recently"),
                "status": m.get("processing_status", "ready"),
                "keyConceptsExtracted": ["Core Mechanism", "Applications", "Formulas"],
                "summary": m.get("description", "")
            })

        # 4. Concept Mastery
        raw_mastery = get_user_concept_mastery(user_id)
        concept_mastery_list = []
        for cm in raw_mastery:
            concept_mastery_list.append({
                "concept": cm.get("concept"),
                "score": cm.get("mastery_score", 0),
                "status": cm.get("status", "learning")
            })

        # 5. Learning History
        raw_history = get_user_learning_history(user_id)
        learning_history_list = []
        recent_lessons_list = []
        for h in raw_history:
            learning_history_list.append({
                "id": h.get("id"),
                "lessonTitle": h.get("topic", "Lesson"),
                "subject": h.get("metadata", {}).get("subject", "STEM"),
                "score": h.get("metadata", {}).get("score", 85),
                "activityType": h.get("action", "completed_lesson"),
                "timestamp": h.get("created_at", ""),
                "date": "Today"
            })
            if h.get("action") == "completed_lesson":
                recent_lessons_list.append({
                    "id": h.get("lesson_id") or h.get("id"),
                    "title": h.get("topic", "Lesson"),
                    "subject": h.get("metadata", {}).get("subject", "STEM"),
                    "score": h.get("metadata", {}).get("score", 85),
                    "duration": "20 min",
                    "date": "Recently",
                    "status": "completed"
                })

        # Calculate overall mastery and counts
        scores = [cm["score"] for cm in concept_mastery_list if "score" in cm]
        overall_mastery = round(sum(scores) / max(1, len(scores))) if scores else 0
        mastered_count = len([cm for cm in concept_mastery_list if cm["score"] >= 80])
        completed_lessons = len(recent_lessons_list)

        profile_bundle = {
            "name": raw_profile.get("full_name", "Student"),
            "email": raw_profile.get("email", ""),
            "level": raw_profile.get("education_level", "beginner").lower(),
            "preferredLanguage": raw_profile.get("preferred_language", "hinglish").lower(),
            "selectedAvatar": "priya",
            "overallMastery": overall_mastery,
            "completedLessons": completed_lessons,
            "learningTimeHours": round(completed_lessons * 0.35, 1),
            "masteredConceptsCount": mastered_count,
            "recentLessons": recent_lessons_list,
            "voiceSpeed": 1.0,
            "captionsEnabled": True,
            "soundEnabled": True,
            "learningStreak": max(1, completed_lessons),
            "questionsAnswered": completed_lessons * 5,
            "educationLevel": raw_profile.get("education_level", "high_school"),
            "learningGoal": raw_profile.get("learning_goal", "understand_concept"),
            "teachingStyle": raw_profile.get("preferred_teaching_style", "simple_visual")
        }

        # 6. Learning Path
        path_res = supabase.table("learning_paths").select("*").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
        if path_res.data:
            path_row = path_res.data[0]
            items_res = supabase.table("learning_path_items").select("*").eq("learning_path_id", path_row["id"]).order("position").execute()
            nodes = []
            for it in items_res.data:
                nodes.append({
                    "id": it.get("id"),
                    "title": it.get("title"),
                    "status": it.get("status", "locked"),
                    "estimatedHours": 3.0,
                    "description": it.get("description", ""),
                    "subTopics": ["Core Concept", "Formula", "Assessment"]
                })
            learning_path_bundle = {
                "id": path_row.get("id"),
                "title": path_row.get("title"),
                "category": path_row.get("subject", "STEM"),
                "description": path_row.get("description", ""),
                "nodes": nodes
            }
        else:
            learning_path_bundle = generate_personalized_learning_path("STEM & AI Foundations")

        return {
            "profile": profile_bundle,
            "inProgressLesson": in_progress_bundle,
            "documents": materials_list,
            "assessments": [],
            "conceptMastery": concept_mastery_list,
            "learningPath": learning_path_bundle,
            "learningHistory": learning_history_list
        }
    except Exception as e:
        logger.error(f"Error fetching user data bundle: {e}")
        raise HTTPException(status_code=500, detail=str(e))
