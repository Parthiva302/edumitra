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
    language: str = "hinglish"
) -> Dict[str, Any]:
    """
    Evaluate student response to a question, diagnose misconceptions if incorrect,
    and generate personalized pedagogical remediation with intuitive analogies and a follow-up retry question.
    """
    prompt = f"""
You are an expert, deeply encouraging personal AI teacher evaluating a student's answer.

Concept Tested: {concept}
Question Asked: {question}
Expected Concept / Answer: {expected_answer or "Accurate conceptual understanding"}
Student's Answer: "{student_answer}"
Language: {language}

Task:
1. Determine if the student's answer is conceptually correct (is_correct: boolean, score: 0-100).
2. If incorrect or partially incorrect:
   a. Detect the exact misconception the student holds (e.g. confusing voltage with current, confusing mass with weight).
   b. Provide a warm, conversational teacher dialogue acknowledging what was attempted and gently untangling the confusion.
   c. Provide an everyday physical or intuitive analogy (remediation_analogy).
   d. Provide a simpler follow-up retry question (retry_question) to verify understanding.
3. If correct:
   a. Give encouraging positive feedback affirming why the reasoning is sound.

Return a valid JSON object matching this schema:
{{
  "is_correct": true,
  "score": 95,
  "feedback": "Encouraging explanation of why the answer is great or what needs adjusting...",
  "misconception_detected": false,
  "misconception": null,
  "remediation_dialogue": null,
  "remediation_analogy": null,
  "remediation_visual_type": "water_pipe_analogy",
  "retry_question": null
}}
"""
    try:
        evaluation = generate_structured_json(
            prompt,
            system_instruction=get_evaluator_system_prompt()
        )
        return evaluation
    except Exception as e:
        logger.error(f"Error evaluating student response: {e}")
        # Robust fallback heuristic
        clean_ans = student_answer.strip().lower()
        is_pos = any(w in clean_ans for w in ["correct", "yes", "increases", "true", "proportional", "decreases"])
        return {
            "is_correct": is_pos,
            "score": 85 if is_pos else 40,
            "feedback": "Good attempt! Let's reflect on how the fundamental variables interact." if not is_pos else "Excellent reasoning! You grasped the principle.",
            "misconception_detected": not is_pos,
            "misconception": "Incomplete separation of opposing physical variables." if not is_pos else None,
            "remediation_dialogue": "Let's think of this intuitively: when resistance increases, it creates a bottleneck for flow." if not is_pos else None,
            "remediation_analogy": "Imagine a water pipe: narrowing the pipe restricts the water flow." if not is_pos else None,
            "remediation_visual_type": "water_pipe_analogy",
            "retry_question": {
                "question": "If you squeeze a water pipe narrower, does the water flow faster or slower through that restriction?",
                "options": [
                    {"id": "r1", "text": "It encounters higher resistance, restricting overall flow", "isCorrect": True},
                    {"id": "r2", "text": "Flow increases infinitely", "isCorrect": False}
                ]
            } if not is_pos else None
        }
