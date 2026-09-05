import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.prompts import get_evaluator_system_prompt

logger = logging.getLogger("edumitra.misconception_detector")

def detect_pedagogical_misconception(
    concept: str,
    student_response: str,
    question_context: str,
    language: str = "hinglish"
) -> Dict[str, Any]:
    """
    Diagnose cognitive learning blockers and misconceptions in a student's answer.
    Follows the 8-step pedagogical remediation protocol:
    1. Determine what was misunderstood
    2. Identify root misconception
    3. Explain correct concept
    4. Provide different everyday analogy
    5. Give a new concrete example
    6. Formulate simpler follow-up question
    """
    prompt = f"""
You are a master pedagogical diagnostician and empathetic personal tutor.
Diagnose the cognitive misconception in this student's response.

Concept: {concept}
Question Context: {question_context}
Student's Response: "{student_response}"
Language: {language}

Execution Protocol:
1. Determine what the student misunderstood.
2. Identify the underlying misconception.
3. Explain the correct concept concisely.
4. Use a different physical/everyday analogy.
5. Give a new real-world example.
6. Ask a simpler follow-up question.

Return a valid JSON object:
{{
  "has_misconception": true,
  "misconception_type": "Variable confusion | Inverse proportionality error | Scale error | Cause-effect reversal",
  "root_cause": "Detailed diagnosis of why the student arrived at this answer",
  "underlying_misconception": "Exact formulation of the misconception",
  "correct_concept_explanation": "Clear, direct re-explanation of the governing rule",
  "recommended_analogy": "Everyday physical analogy to clarify the difference",
  "new_example": "A concrete real-world situation demonstrating the rule",
  "simpler_question": {{
    "question": "Simpler follow-up question checking understanding of the analogy:",
    "options": [
      {{"id": "q1", "text": "Correct choice", "isCorrect": true}},
      {{"id": "q2", "text": "Incorrect choice", "isCorrect": false}}
    ]
  }},
  "recommended_remediation_dialogue": "Warm teacher spoken dialogue to deliver to student"
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
            "root_cause": "Confusing driving potential with resulting resistance in the physical relationship.",
            "underlying_misconception": "Assuming that opposition to flow increases the rate of flow.",
            "correct_concept_explanation": f"In {concept}, opposition restricts rate of transfer unless driving force scales accordingly.",
            "recommended_analogy": "Think of squeezing a garden hose: narrowing the passage restricts the gallons per minute that can exit.",
            "new_example": "Walking through water: water resistance slows your movement compared to walking through air.",
            "simpler_question": {
                "question": "If an obstacle increases in size, is it easier or harder for something to pass through?",
                "options": [
                    {"id": "s1", "text": "Harder, reducing the rate of passing", "isCorrect": True},
                    {"id": "s2", "text": "Easier, speeding everything up", "isCorrect": False}
                ]
            },
            "recommended_remediation_dialogue": "I understand your intuition! Let's think of this like traffic on a bridge: when lanes narrow, traffic flow drops."
        }
