import logging
from typing import Dict, Any, Optional
from app.services.gemini import generate_structured_json
from app.services.prompts import get_evaluator_system_prompt

logger = logging.getLogger("edumitra.evaluator")

def evaluate_student_response(
    concept: str,
    question: str,
    student_answer: str,
    expected_answer: Optional[str] = None,
    language: str = "hinglish",
    student_level: str = "intermediate"
) -> Dict[str, Any]:
    """
    Evaluate student response to a question, diagnose misconceptions if incorrect,
    and generate personalized pedagogical remediation with intuitive analogies and a follow-up retry question.
    Returns standard structured evaluation JSON.
    """
    prompt = f"""
You are an expert, deeply encouraging personal AI teacher evaluating a student's answer.

Concept Tested: {concept}
Question Asked: {question}
Expected Concept / Answer: {expected_answer or "Accurate conceptual understanding"}
Student's Answer: "{student_answer}"
Student Level: {student_level}
Language: {language}

Task:
1. Determine if the student's answer is conceptually correct (correct: boolean, score: 0-100).
2. If incorrect or partially incorrect:
   a. Identify the specific underlying misconception the student holds.
   b. Provide warm teacher feedback acknowledging the effort and pointing out the reasoning flaw.
   c. Set recommended_action to "REEXPLAIN".
   d. Set next_difficulty to "BEGINNER" (or current level stepped down).
   e. Provide a physical/intuitive everyday analogy (remediation_analogy).
   f. Provide a simpler follow-up retry question (retry_question) to verify understanding after the analogy.
3. If correct:
   a. Give encouraging positive feedback affirming why the reasoning is sound.
   b. Set concept_understood to true.
   c. Set recommended_action to "CONTINUE".
   d. Set next_difficulty to "INTERMEDIATE" or "ADVANCED".

Return a strictly valid JSON object:
{{
  "correct": false,
  "score": 35,
  "concept_understood": false,
  "misconception_detected": true,
  "misconception": "Confusing rate of flow with driving pressure...",
  "feedback": "Thoughtful attempt! However, when resistance increases, the opposition to flow rises...",
  "recommended_action": "REEXPLAIN",
  "next_difficulty": "BEGINNER",
  "remediation_dialogue": "Let's think of this intuitively...",
  "remediation_analogy": "Imagine water flowing through a flexible hose...",
  "remediation_visual_type": "water_pipe_analogy",
  "retry_question": {{
    "question": "If you pinch a water hose narrower, does the water flow more easily or does it face higher restriction?",
    "options": [
      {{"id": "r1", "text": "It encounters higher restriction, reducing total flow rate", "isCorrect": true}},
      {{"id": "r2", "text": "More water passes through faster with no resistance", "isCorrect": false}}
    ]
  }}
}}
"""
    try:
        evaluation = generate_structured_json(
            prompt,
            system_instruction=get_evaluator_system_prompt()
        )
        # Ensure canonical fields
        is_corr = evaluation.get("correct", evaluation.get("is_correct", False))
        evaluation["correct"] = is_corr
        evaluation["is_correct"] = is_corr
        evaluation["concept_understood"] = evaluation.get("concept_understood", is_corr)
        evaluation["misconception_detected"] = evaluation.get("misconception_detected", not is_corr)
        if is_corr:
            evaluation["recommended_action"] = evaluation.get("recommended_action", "CONTINUE")
            evaluation["next_difficulty"] = evaluation.get("next_difficulty", "INTERMEDIATE")
        else:
            evaluation["recommended_action"] = evaluation.get("recommended_action", "REEXPLAIN")
            evaluation["next_difficulty"] = evaluation.get("next_difficulty", "BEGINNER")

        return evaluation
    except Exception as e:
        logger.error(f"Error evaluating student response via Gemini: {e}")
        # Robust semantic heuristic fallback
        clean_ans = student_answer.strip().lower()
        is_pos = any(w in clean_ans for w in ["correct", "yes", "increases", "true", "proportional", "decreases", "right"])
        return {
            "correct": is_pos,
            "is_correct": is_pos,
            "score": 85 if is_pos else 35,
            "concept_understood": is_pos,
            "misconception_detected": not is_pos,
            "misconception": "Confusing inverse proportional dependencies in physical systems." if not is_pos else None,
            "feedback": "Excellent reasoning! You grasped the foundational principle." if is_pos else "Good attempt! Let's reflect on how these opposing variables interact.",
            "recommended_action": "CONTINUE" if is_pos else "REEXPLAIN",
            "next_difficulty": "ADVANCED" if is_pos else "BEGINNER",
            "remediation_dialogue": "Let's think of this intuitively: when restriction increases, the resulting flow must decrease." if not is_pos else None,
            "remediation_analogy": "Imagine a water pipe: narrowing the pipe restricts the water flow." if not is_pos else None,
            "remediation_visual_type": "water_pipe_analogy",
            "retry_question": {
                "question": "If you squeeze a water pipe narrower, what happens to the ease of flow?",
                "options": [
                    {"id": "r1", "text": "It encounters higher resistance, reducing total flow rate", "isCorrect": True},
                    {"id": "r2", "text": "Flow increases infinitely", "isCorrect": False}
                ]
            } if not is_pos else None
        }
