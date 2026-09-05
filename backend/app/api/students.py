import logging
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, Dict, Any

from app.schemas.student import StudentProfileCreate, StudentLogin, StudentProfileUpdate, StudentProfileResponse
from app.database.supabase import get_supabase, get_auth_client, get_user_profile, upsert_user_profile
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger("edumitra.api.auth")

@router.post("/register")
def register_student(payload: StudentProfileCreate):
    """Register a new student account using Supabase Auth and create their profile"""
    try:
        auth_client = get_auth_client()
        clean_email = payload.email.lower().strip()
        clean_name = payload.name.strip()

        # 1. Create auth user in Supabase
        auth_res = auth_client.auth.sign_up({
            "email": clean_email,
            "password": payload.password,
            "options": {
                "data": {"full_name": clean_name}
            }
        })

        if not auth_res.user:
            raise HTTPException(status_code=400, detail="Could not create user account.")

        user_id = auth_res.user.id
        access_token = auth_res.session.access_token if auth_res.session else user_id

        # 2. Create profile in profiles table
        profile_data = {
            "id": user_id,
            "full_name": clean_name,
            "email": clean_email,
            "preferred_language": "English",
            "education_level": "Beginner",
            "learning_goal": "understand_concept",
            "preferred_teaching_style": "simple_visual"
        }
        upsert_user_profile(profile_data)

        # 3. Create initial learning path in learning_paths
        try:
            db = get_supabase()
            path_res = db.table("learning_paths").insert({
                "user_id": user_id,
                "title": "STEM & AI Foundations Roadmap",
                "description": "Structured pedagogical track progressing from fundamental circuit physics to modern neural networks.",
                "subject": "STEM & Artificial Intelligence",
                "current_item": 0
            }).execute()
            if path_res.data:
                path_id = path_res.data[0]["id"]
                initial_items = [
                    {"learning_path_id": path_id, "user_id": user_id, "position": 1, "title": "Electricity & Circuit Theory (Ohm's Law)", "description": "Voltage, Current, Resistance calculations.", "status": "in_progress"},
                    {"learning_path_id": path_id, "user_id": user_id, "position": 2, "title": "Classical Mechanics (Newton's Laws)", "description": "Inertia, F=ma dynamics, action-reaction pairs.", "status": "locked"},
                    {"learning_path_id": path_id, "user_id": user_id, "position": 3, "title": "Python for Computational Science", "description": "Syntax fundamentals, algorithmic logic.", "status": "locked"},
                    {"learning_path_id": path_id, "user_id": user_id, "position": 4, "title": "Neural Networks & Deep Learning Intuition", "description": "Perceptrons, activation functions, loss landscapes.", "status": "locked"}
                ]
                db.table("learning_path_items").insert(initial_items).execute()
        except Exception as pe:
            logger.warning(f"Could not create default learning path: {pe}")

        return {
            "success": True,
            "token": access_token,
            "user": {
                "id": user_id,
                "name": clean_name,
                "email": clean_email
            },
            "profile": profile_data
        }
    except Exception as e:
        logger.error(f"Registration error: {e}")
        error_msg = str(e)
        if "already registered" in error_msg or "User already exists" in error_msg:
            raise HTTPException(status_code=400, detail="An account with this email already exists. Please log in.")
        raise HTTPException(status_code=400, detail=error_msg)

@router.post("/login")
def login_student(payload: StudentLogin):
    """Authenticate student credentials using Supabase Auth"""
    try:
        auth_client = get_auth_client()
        clean_email = payload.email.lower().strip()

        auth_res = auth_client.auth.sign_in_with_password({
            "email": clean_email,
            "password": payload.password
        })

        if not auth_res.user:
            raise HTTPException(status_code=401, detail="Incorrect email or password.")

        user_id = auth_res.user.id
        access_token = auth_res.session.access_token if auth_res.session else user_id

        # Fetch profile
        profile = get_user_profile(user_id)
        if not profile:
            full_name = auth_res.user.user_metadata.get("full_name", "Student") if auth_res.user.user_metadata else "Student"
            profile = {
                "id": user_id,
                "full_name": full_name,
                "email": clean_email,
                "preferred_language": "English",
                "education_level": "Beginner"
            }
            upsert_user_profile(profile)

        return {
            "success": True,
            "token": access_token,
            "user": {
                "id": user_id,
                "name": profile.get("full_name", "Student"),
                "email": clean_email
            },
            "profile": profile
        }
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

@router.post("/logout")
def logout_student(user_id: str = Depends(get_current_user_id)):
    """Sign out student and invalidate session"""
    try:
        auth_client = get_auth_client()
        auth_client.auth.sign_out()
        return {"success": True}
    except Exception:
        return {"success": True}

@router.get("/profile")
def get_current_profile(user_id: str = Depends(get_current_user_id)):
    """Fetch profile of authenticated student"""
    profile = get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return profile

@router.put("/profile")
def update_profile(payload: StudentProfileUpdate, user_id: str = Depends(get_current_user_id)):
    """Update profile settings for student"""
    existing = get_user_profile(user_id) or {"id": user_id}
    updates = payload.model_dump(exclude_none=True)
    updated_data = {**existing, **updates}
    saved = upsert_user_profile(updated_data)
    return saved
