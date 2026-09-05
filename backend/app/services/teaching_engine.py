import logging
from typing import Dict, Any, Optional
from app.services.gemini import generate_text, generate_structured_json
from app.services.evaluator import evaluate_student_response
from app.services.prompts import get_teaching_engine_system_prompt

logger = logging.getLogger("edumitra.teaching_engine")

def answer_student_interruption(
    lesson_title: str,
    current_concept: str,
    student_question: str,
    language: str = "hinglish",
    teaching_style: str = "simple_visual"
) -> Dict[str, Any]:
    """
    Handle live student interruptions, follow-up questions, and requests during classroom teaching:
    ('Why?', 'Give me another example', 'Explain in Hindi', 'What does this mean?', etc.)
    """
    prompt = f"""
You are the AI Teacher currently teaching a student in a virtual classroom.

Current Lesson: {lesson_title}
Current Concept: {current_concept}
Student Interruption / Question: "{student_question}"
Teaching Style: {teaching_style}
Preferred Language: {language}

Instructions:
1. Answer the student's question directly, clearly, warmly, and concisely (2-4 sentences).
2. Connect the answer directly to the concept ({current_concept}).
3. Use a clear analogy or concrete example if requested.
4. If the student asked in Hindi or requested Hindi ('Hindi me samjhao'), reply in natural conversational Hinglish/Hindi.
5. End with a gentle, encouraging transition back to the lesson flow.

Format:
Return a valid JSON object:
{{
  "answer_text": "Spoken response of the teacher...",
  "suggested_visual_action": "highlight_formula | show_analogy | none",
  "follow_up_prompt": "Optional brief checkpoint question"
}}
"""
    try:
        res = generate_structured_json(
            prompt,
            system_instruction=get_teaching_engine_system_prompt()
        )
        return res
    except Exception as e:
        logger.error(f"Error answering student interruption: {e}")
        return {
            "answer_text": f"That's a wonderful question about {current_concept}! In simple terms, this principle governs how the system balances itself under different conditions. Let's keep this intuition in mind as we continue.",
            "suggested_visual_action": "none",
            "follow_up_prompt": None
        }
