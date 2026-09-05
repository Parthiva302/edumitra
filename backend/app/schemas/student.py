from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class StudentProfileCreate(BaseModel):
    name: str
    email: str
    password: str

class StudentLogin(BaseModel):
    email: str
    password: str

class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_language: Optional[str] = None
    education_level: Optional[str] = None
    learning_goal: Optional[str] = None
    preferred_teaching_style: Optional[str] = None

class StudentProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    preferred_language: str = "English"
    education_level: str = "Beginner"
    learning_goal: Optional[str] = None
    preferred_teaching_style: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class DashboardSummaryResponse(BaseModel):
    profile: Dict[str, Any]
    in_progress_lesson: Optional[Dict[str, Any]] = None
    recent_lessons: List[Dict[str, Any]] = []
    materials_count: int = 0
    overall_mastery: int = 0
    mastered_concepts_count: int = 0
    weak_concepts: List[Dict[str, Any]] = []
    learning_streak: int = 1
    total_learning_time_hours: float = 0.0
