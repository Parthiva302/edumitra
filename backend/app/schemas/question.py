from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class EvaluateAnswerRequest(BaseModel):
    lesson_id: Optional[str] = None
    step_id: Optional[str] = None
    concept: str
    question: str
    student_answer: str
    expected_answer: Optional[str] = None
    question_type: str = "short_answer"
    language: str = "hinglish"

class EvaluateAnswerResponse(BaseModel):
    is_correct: bool
    score: int  # 0 to 100
    feedback: str
    misconception_detected: bool
    misconception: Optional[str] = None
    remediation_dialogue: Optional[str] = None
    remediation_analogy: Optional[str] = None
    remediation_visual_type: Optional[str] = None
    remediation_visual_data: Optional[Dict[str, Any]] = None
    retry_question: Optional[Dict[str, Any]] = None
    mastery_updated_level: Optional[str] = None
