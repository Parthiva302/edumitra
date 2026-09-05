from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class QuickCheckOption(BaseModel):
    id: str
    text: str
    isCorrect: bool
    misconceptionExplanation: Optional[str] = None

class QuickCheckSchema(BaseModel):
    id: str
    question: str
    options: List[QuickCheckOption]
    remediationMisconceptionIdentified: str
    remediationAnalogy: str
    remediationDialogue: str
    remediationVisualType: Optional[str] = None
    remediationVisualData: Optional[Dict[str, Any]] = None
    remediationRetryQuestion: Optional[Dict[str, Any]] = None

from app.schemas.video import VideoSceneItem

class LessonStepSchema(BaseModel):
    id: str
    stepNumber: str
    title: str
    concept: str
    estimatedMinutes: float = 2.0
    teacherDialogue: str
    dialogueTranslations: Optional[Dict[str, str]] = None
    subtitles: List[Dict[str, Any]] = []
    visualType: str
    visualData: Dict[str, Any] = {}
    quickCheck: Optional[QuickCheckSchema] = None
    scenes: Optional[List[VideoSceneItem]] = []
    totalSceneCount: Optional[int] = 0

class CreateLessonRequest(BaseModel):
    topic: str
    material_id: Optional[str] = None
    document_text: Optional[str] = None
    level: str = "intermediate"
    goal: str = "understand_concept"
    language: str = "hinglish"
    duration: str = "20m"
    style: str = "simple_visual"
    depth: Optional[str] = "normal"
    teacher_personality: Optional[str] = "friendly_mentor"
    teacher_avatar_id: Optional[str] = "priya"
    exam_target_date: Optional[str] = None
    exam_target_score: Optional[str] = None

class LessonPlanSchema(BaseModel):
    id: str
    title: str
    subject: str
    category: str
    level: str
    language: str
    duration: str
    goal: Optional[str] = None
    style: Optional[str] = None
    steps: List[LessonStepSchema]
    scenes: Optional[List[VideoSceneItem]] = []
    totalEstimatedMinutes: Optional[float] = None
    total_duration_seconds: Optional[int] = None
    created_at: Optional[str] = None

class SaveLessonProgressRequest(BaseModel):
    lesson_id: str
    current_step_index: int
    total_steps: int
    current_concept: str
    progress_percentage: int
    steps: Optional[List[Dict[str, Any]]] = None

class AskTeacherRequest(BaseModel):
    lesson_id: Optional[str] = None
    concept: str
    question: str
    language: str = "hinglish"
    teaching_style: Optional[str] = "simple_visual"
