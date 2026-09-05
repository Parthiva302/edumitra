"""
EduMitra Prompts Package
Exposes unified, structured pedagogical prompt definitions for planning, teaching, evaluation, and misconception diagnosis.
"""

from app.prompts.planner import LESSON_PLANNER_SYSTEM_PROMPT, build_lesson_planning_prompt
from app.prompts.evaluator import EVALUATOR_SYSTEM_PROMPT, build_evaluation_prompt
from app.prompts.misconception import MISCONCEPTION_SYSTEM_PROMPT, build_misconception_prompt
from app.prompts.teacher import TEACHER_SYSTEM_PROMPT, build_student_interruption_prompt

__all__ = [
    "LESSON_PLANNER_SYSTEM_PROMPT",
    "build_lesson_planning_prompt",
    "EVALUATOR_SYSTEM_PROMPT",
    "build_evaluation_prompt",
    "MISCONCEPTION_SYSTEM_PROMPT",
    "build_misconception_prompt",
    "TEACHER_SYSTEM_PROMPT",
    "build_student_interruption_prompt"
]
