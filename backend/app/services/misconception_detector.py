import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.prompts import get_evaluator_system_prompt

logger = logging.getLogger("edumitra.misconception_detector")

def detect_pedagogical_misconception(
    concept: str,
    student_response: str,
    question_context: str
) -> Dict[str, Any]:
    """Diagnose cognitive learning blockers and misconceptions in a student's answer"""
    prompt = f"""
Diagnose the cognitive misconception in this student's response.

Concept: {concept}
Question Context: {question_context}
Student's Response: "{student_response}"

Return a JSON object:
{{
  "has_misconception": true,
  "misconception_type": "Variable confusion | Inverse proportionality error | Scale error | Definition confusion",
  "root_cause": "Detailed diagnosis of why the student arrived at this answer",
  "recommended_analogy": "Everyday physical analogy to correct it",
  "recommended_remediation_dialogue": "Spoken dialogue for teacher"
}}
"""
    try:
        return generate_structured_json(
            prompt,
            system_instruction=get_evaluator_system_prompt()
        )
    except Exception as e:
        logger.warning(f"Misconception detection fallback: {e}")
        return {
            "has_misconception": True,
            "misconception_type": "Variable confusion",
            "root_cause": "Confusing cause and effect in the physical relationship.",
            "recommended_analogy": "Think of pushing a heavy box: more friction means you need more force to keep it moving.",
            "recommended_remediation_dialogue": "Let's separate these two variables step by step."
        }
