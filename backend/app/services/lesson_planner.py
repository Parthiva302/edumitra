import json
import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.visual_planner import plan_subject_visual
from app.services.prompts import get_lesson_planner_system_prompt

logger = logging.getLogger("edumitra.lesson_planner")

def generate_personalized_lesson_plan(
    topic: str,
    document_text: Optional[str] = None,
    level: str = "intermediate",
    goal: str = "understand_concept",
    language: str = "hinglish",
    duration: str = "20m",
    style: str = "simple_visual",
    depth: str = "normal"
) -> Dict[str, Any]:
    """Generate a multi-step structured pedagogical lesson plan using Gemini"""
    
    # Adapt number of steps based on duration
    step_count = 3 if duration in ["5m", "5_min"] else 4 if duration in ["10m", "10_min"] else 5 if duration in ["20m", "20_min"] else 6
    
    if document_text:
        doc_context = f"""
STRICT GROUNDING DIRECTIVE (FOLLOW STUDENT DATA ONLY):
The student has uploaded the following study notes/material. You MUST structure the lesson, definitions, formulas, and explanations EXCLUSIVELY from this text. Do NOT hallucinate concepts or topics outside this provided material:

Student Uploaded Material:
{document_text[:6000]}
"""
    else:
        doc_context = ""
    
    prompt = f"""
You are EduMitra, a world-class personal AI teacher.
Create a high-quality, highly engaging, personalized lesson plan for the student.

Topic: {topic}
Student Level: {level}
Learning Goal: {goal}
Preferred Language: {language}
Duration: {duration} (Target approx {step_count} progressive steps)
Teaching Style: {style}
Depth: {depth}{doc_context}

Pedagogical Structure Requirements:
1. Step 1: Introduction & Intuitive Hook (Relate to real life, establish motivation).
2. Step 2: Foundational Mechanism & Subject-Aware Visual Model.
3. Step 3: Deep-Dive / Mathematical Formula / Code / Demonstration with Step-by-Step explanation.
4. Step 4: Interactive Quick Check (Concept check question + Misconception diagnosis + Remediation Analogy + Follow-up retry question).
5. Step 5: Practical Application & Summary.

Visual Types Available:
- "circuit_simulation" (for electrical circuits, Ohm's law, voltage, resistance)
- "physics_simulation" (for mechanics, forces, kinematics, vectors, gravity)
- "math_equation" (for calculus, algebra, graphing, quadratic, derivatives)
- "biology_diagram" (for photosynthesis, cells, DNA, biology)
- "code_runner" (for Python, JS, algorithms, recursion, data structures)
- "chemistry_visual" (for molecules, reactions, bonding)
- "timeline" (for history, chronological stages)
- "concept_card" (for general structured concept cards)

Return a strictly valid JSON object matching this schema:
{{
  "id": "lesson_generated",
  "title": "Clear Lesson Title",
  "subject": "Subject Name (e.g. Physics, Biology, Computer Science, Mathematics, Chemistry, History)",
  "category": "Curriculum Category",
  "level": "{level}",
  "language": "{language}",
  "duration": "{duration}",
  "totalEstimatedMinutes": {15 if step_count == 4 else 20 if step_count == 5 else 25},
  "steps": [
    {{
      "id": "step_1",
      "stepNumber": "01",
      "title": "Engaging Step Title",
      "concept": "Specific concept name",
      "estimatedMinutes": 3.0,
      "teacherDialogue": "Spoken dialogue of the teacher, conversational and direct to student...",
      "dialogueTranslations": {{
        "hi": "Hindi translation of dialogue...",
        "hinglish": "Hinglish translation...",
        "te": "Telugu translation of dialogue...",
        "en": "English translation..."
      }},
      "visualType": "chosen_visual_type",
      "visualData": {{
        "title": "Title",
        "points": ["Key point 1", "Key point 2"]
      }},
      "quickCheck": null
    }},
    {{
      "id": "step_check",
      "stepNumber": "04",
      "title": "Diagnostic Quick Check",
      "concept": "Core Principle Check",
      "estimatedMinutes": 4.0,
      "teacherDialogue": "Now let's test your intuition with a quick scenario.",
      "dialogueTranslations": {{
        "hi": "Hindi translation...",
        "hinglish": "Hinglish translation...",
        "en": "English translation..."
      }},
      "visualType": "chosen_visual_type",
      "visualData": {{}},
      "quickCheck": {{
        "id": "qc_1",
        "question": "Clear conceptual question testing understanding vs common trap?",
        "options": [
          {{"id": "opt_a", "text": "Common misconception option", "isCorrect": false, "misconceptionExplanation": "Why this option is a common trap"}},
          {{"id": "opt_b", "text": "Scientifically correct option", "isCorrect": true}},
          {{"id": "opt_c", "text": "Another incorrect option", "isCorrect": false, "misconceptionExplanation": "Explanation"}}
        ],
        "remediationMisconceptionIdentified": "Diagnosed misconception...",
        "remediationAnalogy": "A physical everyday analogy clarifying the difference...",
        "remediationDialogue": "Patient explanation addressing the misconception directly...",
        "remediationVisualType": "water_pipe_analogy",
        "remediationRetryQuestion": {{
          "question": "Simpler follow-up question to verify understanding after analogy:",
          "options": [
            {{"id": "retry_1", "text": "Correct choice", "isCorrect": true}},
            {{"id": "retry_2", "text": "Incorrect choice", "isCorrect": false}}
          ]
        }}
      }}
    }}
  ]
}}
"""
    try:
        plan = generate_structured_json(
            prompt,
            system_instruction=get_lesson_planner_system_prompt()
        )
        
        # Ensure fallback visualData if empty
        subject = plan.get("subject", "General STEM")
        for i, step in enumerate(plan.get("steps", [])):
            if not step.get("visualData") or not isinstance(step.get("visualData"), dict) or len(step["visualData"]) == 0:
                planned_vis = plan_subject_visual(
                    subject,
                    step.get("concept", topic),
                    step.get("title", f"Step {i+1}"),
                    step.get("teacherDialogue", "")
                )
                step["visualType"] = planned_vis["visual_type"]
                step["visualData"] = planned_vis["visual_data"]
                
        return plan
    except Exception as e:
        logger.error(f"Error generating lesson plan via Gemini: {e}")
        # Build deterministic structured multi-step fallback
        planned_vis = plan_subject_visual("General", topic, topic, topic)
        return {
            "id": f"lesson_{topic.lower().replace(' ', '_')}",
            "title": topic,
            "subject": "STEM & Foundations",
            "category": "Core Curriculum",
            "level": level,
            "language": language,
            "duration": duration,
            "totalEstimatedMinutes": 20,
            "steps": [
                {
                    "id": "step_1",
                    "stepNumber": "01",
                    "title": f"Introduction to {topic}",
                    "concept": f"Foundations of {topic}",
                    "estimatedMinutes": 3.0,
                    "teacherDialogue": f"Welcome! Today we will understand {topic} from first principles with interactive visual models.",
                    "dialogueTranslations": {
                        "en": f"Welcome! Today we will understand {topic} from first principles.",
                        "hi": f"नमस्ते! आज हम {topic} को बुनियादी सिद्धांतों और विजुअल्स के साथ समझेंगे।",
                        "hinglish": f"Hello! Aaj hum {topic} ko deeply samajhenge visual models ke through.",
                        "te": f"స్వాగతం! ఈ రోజు మనం {topic} గురించి ప్రాథమిక సూత్రాలతో నేర్చుకుందాం."
                    },
                    "visualType": planned_vis["visual_type"],
                    "visualData": planned_vis["visual_data"]
                },
                {
                    "id": "step_2",
                    "stepNumber": "02",
                    "title": f"Underlying Mechanism of {topic}",
                    "concept": f"Core Mechanics of {topic}",
                    "estimatedMinutes": 4.5,
                    "teacherDialogue": f"Notice how the variables interact dynamically. Let's observe the behavior step by step.",
                    "dialogueTranslations": {
                        "en": f"Notice how the variables interact dynamically. Let's observe the behavior step by step.",
                        "hi": f"ध्यान से देखिए कि घटक कैसे परस्पर क्रिया करते हैं। आइए इसे चरण-दर-चरण समझें।",
                        "hinglish": f"Dhyan se dekhiye kaise components react karte hain real-time mein.",
                        "te": f"భాగాలు ఎలా పనిచేస్తాయో గమనించండి. దశలవారీగా చూద్దాం."
                    },
                    "visualType": planned_vis["visual_type"],
                    "visualData": planned_vis["visual_data"]
                },
                {
                    "id": "step_3",
                    "stepNumber": "03",
                    "title": f"Interactive Understanding Check",
                    "concept": f"Conceptual Verification of {topic}",
                    "estimatedMinutes": 4.0,
                    "teacherDialogue": f"Now let's test your understanding with a quick checkpoint before moving forward.",
                    "dialogueTranslations": {
                        "en": f"Now let's test your understanding with a quick checkpoint before moving forward.",
                        "hi": f"आगे बढ़ने से पहले आइए एक त्वरित प्रश्न के साथ अपनी समझ की जाँच करें।",
                        "hinglish": f"Ab ek quick question se check karte hain aapka concept kitna clear hua.",
                        "te": f"ముందుకు వెళ్ళే ముందు మీ అవగాహనను పరీక్షిద్దాం."
                    },
                    "visualType": planned_vis["visual_type"],
                    "visualData": planned_vis["visual_data"],
                    "quickCheck": {
                        "question": f"Which statement best describes the fundamental principle of {topic}?",
                        "options": [
                            {
                                "id": "opt_a",
                                "text": f"It defines the balanced relationship between inputs and outputs in {topic}.",
                                "isCorrect": True
                            },
                            {
                                "id": "opt_b",
                                "text": f"It implies variables operate completely independently without constraints.",
                                "isCorrect": False,
                                "misconceptionExplanation": f"Misconception: Assumes variables are independent rather than bound by physical laws."
                            }
                        ],
                        "remediationMisconceptionIdentified": f"Confusing dependent and independent factors in {topic}.",
                        "remediationDialogue": f"Let's think of this intuitively: changing one variable directly adjusts the equilibrium of the system.",
                        "remediationAnalogy": "Like a balanced seesaw: altering one side immediately impacts the other.",
                        "remediationRetryQuestion": {
                            "question": f"If you modify one factor in {topic}, what happens to the equilibrium?",
                            "options": [
                                {"id": "r_1", "text": "The entire system responds to maintain conservation and balance.", "isCorrect": True},
                                {"id": "r_2", "text": "Nothing changes elsewhere.", "isCorrect": False}
                            ]
                        }
                    }
                },
                {
                    "id": "step_4",
                    "stepNumber": "04",
                    "title": f"Practical Application & Summary",
                    "concept": f"Real-World Applications of {topic}",
                    "estimatedMinutes": 3.5,
                    "teacherDialogue": f"Great job! You now understand the core foundations of {topic}. Let's summarize the key takeaways.",
                    "dialogueTranslations": {
                        "en": f"Great job! You now understand the core foundations of {topic}.",
                        "hinglish": f"Superb! Aapne {topic} ke core principles ko deeply samajh liya hai."
                    },
                    "visualType": "concept_card",
                    "visualData": {
                        "title": f"{topic} Takeaways",
                        "points": [
                            "Core principle establishes proportional relationship",
                            "Energy and mass conservation laws are preserved",
                            "Applies directly across real-world systems and exams"
                        ]
                    }
                }
            ]
        }
