import logging
from enum import Enum
from typing import Dict, Any, Optional, List
from app.services.gemini import generate_text, generate_structured_json
from app.services.evaluator import evaluate_student_response
from app.services.misconception_detector import detect_pedagogical_misconception
from app.services.adaptive_engine import update_concept_mastery, get_adaptation_parameters
from app.services.visual_planner import plan_subject_visual
from app.services.prompts import get_teaching_engine_system_prompt

logger = logging.getLogger("edumitra.teaching_engine")

class TeachingState(str, Enum):
    UNDERSTAND = "UNDERSTAND"
    PLAN = "PLAN"
    EXPLAIN = "EXPLAIN"
    DEMONSTRATE = "DEMONSTRATE"
    QUESTION = "QUESTION"
    EVALUATE = "EVALUATE"
    ADAPT = "ADAPT"
    CONTINUE = "CONTINUE"
    COMPLETE = "COMPLETE"

def advance_teaching_state(
    current_state: str,
    lesson_context: Dict[str, Any],
    student_answer: Optional[str] = None,
    mastery_score: int = 50,
    language: str = "hinglish"
) -> Dict[str, Any]:
    """
    Core state machine driver for pedagogical loop:
    UNDERSTAND -> PLAN -> EXPLAIN -> DEMONSTRATE -> QUESTION -> EVALUATE -> ADAPT -> CONTINUE -> COMPLETE
    """
    state_str = (current_state or "UNDERSTAND").upper()
    topic = lesson_context.get("topic", "Educational Concept")
    concept = lesson_context.get("concept", topic)
    difficulty = lesson_context.get("difficulty", "INTERMEDIATE")

    # 1. State: UNDERSTAND
    if state_str == TeachingState.UNDERSTAND:
        return {
            "current_state": TeachingState.UNDERSTAND.value,
            "next_state": TeachingState.PLAN.value,
            "teacher_dialogue": f"Welcome! Today we are exploring {topic}. I will personalize our journey to ensure deep, intuitive understanding.",
            "action": "Assess student level and initialize lesson parameters",
            "visual_type": "concept_card",
            "visual_data": {"title": topic, "points": ["Identify background knowledge", "Map learning objectives", "Formulate teaching strategy"]}
        }

    # 2. State: PLAN
    elif state_str == TeachingState.PLAN:
        return {
            "current_state": TeachingState.PLAN.value,
            "next_state": TeachingState.EXPLAIN.value,
            "teacher_dialogue": f"Here is our pedagogical plan for {topic}. We will start with first principles, observe real-time visual behavior, and verify with interactive checkpoints.",
            "action": "Lesson structured into progressive sections",
            "visual_type": "timeline",
            "visual_data": {"title": f"{topic} Roadmap", "points": ["1. Core Definition", "2. Dynamic Demonstration", "3. Checkpoint & Adaptation"]}
        }

    # 3. State: EXPLAIN
    elif state_str == TeachingState.EXPLAIN:
        # Generate targeted explanation
        prompt = f"""
Explain the concept '{concept}' for a student at level '{difficulty}'.
Subject/Topic: {topic}
Language: {language}

Provide:
1. Intuitive everyday hook.
2. Clear foundational principle.
3. Keep conversational, warm, and 3-4 sentences.
"""
        dialogue = generate_text(prompt, system_instruction=get_teaching_engine_system_prompt())
        planned_vis = plan_subject_visual(topic, concept, "Concept Explanation", dialogue)

        return {
            "current_state": TeachingState.EXPLAIN.value,
            "next_state": TeachingState.DEMONSTRATE.value,
            "teacher_dialogue": dialogue,
            "action": "Teacher conceptual explanation delivered",
            "visual_type": planned_vis.get("visual_type", "concept_card"),
            "visual_data": planned_vis.get("visual_data", {})
        }

    # 4. State: DEMONSTRATE
    elif state_str == TeachingState.DEMONSTRATE:
        planned_vis = plan_subject_visual(topic, concept, "Live Model Demonstration", "Dynamic simulation")
        demo_text = f"Notice how the variables interact dynamically in this model. When one element changes, observe how the system balances itself."
        if language == "hindi":
            demo_text = f"इस विजुअल मॉडल को ध्यान से देखिए। जब एक वेरिएबल बदलता है, तो पूरा सिस्टम कैसे प्रतिक्रिया करता है।"
        elif language == "hinglish":
            demo_text = f"Visual model ko dhyan se dekhiye: jab ek variable change hota hai, to complete system kaise react karta hai."

        return {
            "current_state": TeachingState.DEMONSTRATE.value,
            "next_state": TeachingState.QUESTION.value,
            "teacher_dialogue": demo_text,
            "action": "Visual simulation demonstration active",
            "visual_type": planned_vis.get("visual_type", "concept_card"),
            "visual_data": planned_vis.get("visual_data", {})
        }

    # 5. State: QUESTION
    elif state_str == TeachingState.QUESTION:
        params = get_adaptation_parameters(difficulty)
        # Generate targeted checkpoint question
        return {
            "current_state": TeachingState.QUESTION.value,
            "next_state": TeachingState.EVALUATE.value,
            "teacher_dialogue": f"Now let's check your intuition. Look at this scenario and tell me what you expect to happen.",
            "question": {
                "concept": concept,
                "question": f"In {concept}, if the primary driving parameter increases while external constraints remain fixed, how does the system respond?",
                "question_type": params.get("question_type", "mcq"),
                "options": [
                    {"id": "opt_a", "text": "It responds proportionally to restore equilibrium.", "is_correct": True},
                    {"id": "opt_b", "text": "It decreases inversely to zero.", "is_correct": False, "misconception": "Inverse relationship confusion"},
                    {"id": "opt_c", "text": "Nothing changes elsewhere in the system.", "is_correct": False, "misconception": "Isolation assumption"}
                ],
                "expected_answer": "It responds proportionally to restore equilibrium."
            },
            "action": "Awaiting student response"
        }

    # 6. State: EVALUATE & ADAPT
    elif state_str in [TeachingState.EVALUATE, TeachingState.ADAPT]:
        if not student_answer:
            return {
                "current_state": TeachingState.QUESTION.value,
                "next_state": TeachingState.EVALUATE.value,
                "teacher_dialogue": "Please share your answer or thought process so we can evaluate together.",
                "action": "Awaiting student input"
            }

        # Perform semantic evaluation
        eval_res = evaluate_student_response(
            concept=concept,
            question=lesson_context.get("question_text", f"Fundamental relationship in {concept}"),
            student_answer=student_answer,
            expected_answer=lesson_context.get("expected_answer"),
            language=language
        )

        is_correct = eval_res.get("is_correct", False)
        
        # Adaptive Mastery Update
        mastery_update = update_concept_mastery(
            current_score=mastery_score,
            is_correct=is_correct,
            question_difficulty=difficulty
        )

        if is_correct:
            # Correct: Progress to CONTINUE
            return {
                "current_state": TeachingState.EVALUATE.value,
                "next_state": TeachingState.CONTINUE.value,
                "is_correct": True,
                "score": eval_res.get("score", 90),
                "teacher_dialogue": f"Excellent reasoning! {eval_res.get('feedback', 'You clearly grasped the foundational mechanism.')} You are ready for the next level.",
                "concept_understood": True,
                "misconception_detected": False,
                "mastery": mastery_update,
                "action": "Mastery verified. Advancing difficulty."
            }
        else:
            # Incorrect: Trigger Misconception Remediation & ADAPT
            misconception = eval_res.get("misconception") or "Confusing variable dependencies"
            analogy = eval_res.get("remediation_analogy") or "Like a bottleneck on a busy highway: when lanes narrow, traffic flow drops."
            dialogue = eval_res.get("remediation_dialogue") or f"Let's look at this differently. {analogy}"

            return {
                "current_state": TeachingState.ADAPT.value,
                "next_state": TeachingState.QUESTION.value, # Ask simpler question
                "is_correct": False,
                "score": eval_res.get("score", 35),
                "misconception_detected": True,
                "misconception": misconception,
                "teacher_dialogue": dialogue,
                "remediation_analogy": analogy,
                "visual_type": eval_res.get("remediation_visual_type", "water_pipe_analogy"),
                "visual_data": eval_res.get("remediation_visual_data", {}),
                "retry_question": eval_res.get("retry_question"),
                "mastery": mastery_update,
                "action": "Misconception diagnosed. Teaching alternative analogy and simpler check."
            }

    # 7. State: CONTINUE
    elif state_str == TeachingState.CONTINUE:
        is_last = lesson_context.get("is_last_step", False)
        if is_last:
            return {
                "current_state": TeachingState.CONTINUE.value,
                "next_state": TeachingState.COMPLETE.value,
                "teacher_dialogue": f"Outstanding effort! You have completed all key sections of {topic}. Let's summarize and begin our final assessment.",
                "action": "All sections mastered. Ready for assessment."
            }
        else:
            return {
                "current_state": TeachingState.CONTINUE.value,
                "next_state": TeachingState.EXPLAIN.value,
                "teacher_dialogue": f"Great progress! Let's move to the next concept in our lesson.",
                "action": "Proceeding to next section"
            }

    # 8. State: COMPLETE
    else:
        return {
            "current_state": TeachingState.COMPLETE.value,
            "next_state": TeachingState.COMPLETE.value,
            "teacher_dialogue": f"Congratulations! You have completed the lesson on {topic}. Let's review your final learning profile and next steps.",
            "action": "Lesson complete"
        }

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
