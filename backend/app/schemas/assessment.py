from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AssessmentQuestionItem(BaseModel):
    id: str
    type: str = "mcq"
    question: str
    options: Optional[List[str]] = None
    correctAnswer: Any
    explanation: str
    conceptTested: str

class GenerateAssessmentRequest(BaseModel):
    lesson_id: str
    topic: str
    concepts: List[str]
    level: str = "intermediate"
    count: int = 5

class SubmitAssessmentRequest(BaseModel):
    lesson_id: str
    lesson_title: str
    subject: str
    overall_score: int
    concept_mastery: List[Dict[str, Any]]
    strong_areas: List[str]
    needs_improvement: List[str]
    teacher_feedback: str
    recommended_next_steps: List[str]

class NotesResponse(BaseModel):
    title: str
    overview: str
    key_concepts: List[Dict[str, Any]]
    formulas_and_definitions: List[Dict[str, str]]
    common_mistakes: List[Dict[str, str]]
    summary: str

class FlashcardItem(BaseModel):
    id: str
    question: str
    answer: str
    concept: str
    difficulty: str = "medium"

class FlashcardsResponse(BaseModel):
    cards: List[FlashcardItem]

class ConceptMapNode(BaseModel):
    id: str
    label: str
    description: str
    category: str
    connections: List[str]

class ConceptMapResponse(BaseModel):
    central_topic: str
    nodes: List[ConceptMapNode]
