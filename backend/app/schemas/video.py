from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class VideoSceneItem(BaseModel):
    id: Optional[str] = None
    step_index: Optional[int] = 0
    step_number: Optional[str] = "01"
    scene_number: int
    scene_type: str  # teacher_intro, visual_explanation, visual_demonstration, teacher_and_visual, teacher_summary, question
    duration_seconds: int
    narration: str
    narrationTranslations: Optional[Dict[str, str]] = None
    teacher_action: str
    camera_direction: str
    visual_type: Optional[str] = None
    visual_data: Optional[Dict[str, Any]] = None
    on_screen_text: Optional[str] = None
    educational_purpose: str
    quickCheck: Optional[Dict[str, Any]] = None

class VideoScenePlan(BaseModel):
    lesson_id: str
    title: str
    subject: str
    total_duration_seconds: int
    scenes: List[VideoSceneItem]
    status: str = "ready"
