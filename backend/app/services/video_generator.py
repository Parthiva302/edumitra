import uuid
import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.visual_planner import plan_subject_visual

logger = logging.getLogger("edumitra.video_generator")

def generate_video_scene_plan(
    lesson_id: str,
    title: str,
    subject: str,
    steps: List[Dict[str, Any]],
    language: str = "hinglish"
) -> Dict[str, Any]:
    """
    Generate a detailed pedagogical scene plan adhering to the instructional pattern:
    TEACHER INTRO -> SUBJECT VISUAL -> DEMONSTRATION -> TEACHER + VISUAL -> EXPLANATION -> VISUAL DETAIL -> TEACHER SUMMARY -> QUESTION
    Each scene carries on-screen text, teacher action, visual data, duration, and multilingual narration translations.
    """
    all_scenes = []
    scene_index = 1
    total_duration = 0
    lang_lower = (language or "hinglish").lower()

    # 1. Opening Teacher Introduction Scene
    intro_step = steps[0] if steps else {}
    intro_narration = intro_step.get("teacherDialogue") or f"Welcome! Today we will understand {title} from first principles with interactive visual models."
    
    intro_translations = intro_step.get("dialogueTranslations") or {
        "en": f"Welcome! Today we will explore {title} step by step.",
        "hi": f"नमस्ते! आज हम {title} को आसान तरीके से विजुअल्स के साथ समझेंगे।",
        "hinglish": f"Welcome! Aaj hum {title} ko step-by-step intuitive visual models ke sath explore karenge.",
        "te": f"స్వాగతం! ఈ రోజు మనం {title} గురించి వివరంగా నేర్చుకుందాం."
    }

    intro_scene = {
        "id": f"scene_{scene_index}",
        "step_index": 0,
        "step_number": "01",
        "scene_number": scene_index,
        "scene_type": "teacher_intro",
        "duration_seconds": 8,
        "narration": intro_translations.get(lang_lower, intro_narration),
        "narrationTranslations": intro_translations,
        "teacher_action": "welcoming_gesture",
        "camera_direction": "medium shot, frontal camera",
        "visual_type": "concept_card",
        "visual_data": {
            "title": title,
            "points": ["Core Foundational Principles", "Interactive Visual Demonstrations", "Diagnostic Mastery Checkpoints"]
        },
        "on_screen_text": f"Topic: {title}",
        "educational_purpose": "Establish learning goal and build warm pedagogical rapport",
        "quickCheck": None
    }
    all_scenes.append(intro_scene)
    total_duration += 8
    scene_index += 1

    # 2. Main Teaching Steps with Visuals & Demonstrations
    for i, step in enumerate(steps):
        step_title = step.get("title", f"Concept {i+1}")
        concept = step.get("concept", step_title)
        dialogue = step.get("teacherDialogue", "")
        step_translations = step.get("dialogueTranslations") or {}
        vis_type = step.get("visualType") or "concept_card"
        vis_data = step.get("visualData") or plan_subject_visual(subject, concept, step_title, dialogue).get("visual_data", {})
        step_number_str = step.get("stepNumber", f"0{i+1}" if i < 9 else str(i+1))

        step_scenes = []

        # Scene A: Visual demonstration & focus shot
        visual_narration_en = f"Observe the visual model for {concept}. Let us trace the underlying relationship."
        visual_narration_hi = f"{concept} के इस विजुअल मॉडल को ध्यान से देखिए। आइए इसके मुख्य नियमों को समझें।"
        visual_narration_hinglish = f"Dhyan se is visual model ko dekhiye: {concept} kaise behave karta hai, let's observe step by step."
        visual_narration_te = f"{concept} యొక్క విజువల్ మోడల్‌ను గమనించండి."

        scene_a = {
            "id": f"scene_{scene_index}",
            "step_index": i,
            "step_number": step_number_str,
            "scene_number": scene_index,
            "scene_type": "visual_explanation",
            "duration_seconds": 12,
            "narration": visual_narration_hi if lang_lower == "hi" else visual_narration_hinglish if lang_lower == "hinglish" else visual_narration_te if lang_lower == "te" else visual_narration_en,
            "narrationTranslations": {
                "en": visual_narration_en,
                "hi": visual_narration_hi,
                "hinglish": visual_narration_hinglish,
                "te": visual_narration_te
            },
            "teacher_action": "points_right",
            "camera_direction": "split screen: teacher on left (35%), interactive simulation on right (65%)",
            "visual_type": vis_type,
            "visual_data": vis_data,
            "on_screen_text": f"{concept}",
            "educational_purpose": f"Visual grounding for {concept}",
            "quickCheck": None
        }
        all_scenes.append(scene_a)
        step_scenes.append(scene_a)
        total_duration += 12
        scene_index += 1

        # Scene B: Teacher detailed explanation
        chosen_dialogue = step_translations.get(lang_lower) or dialogue or f"Notice how the key variables interact dynamically in {concept}."
        scene_b = {
            "id": f"scene_{scene_index}",
            "step_index": i,
            "step_number": step_number_str,
            "scene_number": scene_index,
            "scene_type": "teacher_and_visual",
            "duration_seconds": 14,
            "narration": chosen_dialogue,
            "narrationTranslations": step_translations or {
                "en": dialogue,
                "hi": dialogue,
                "hinglish": dialogue
            },
            "teacher_action": "explaining_formula",
            "camera_direction": "picture-in-picture teacher frame with active visual",
            "visual_type": vis_type,
            "visual_data": vis_data,
            "on_screen_text": f"Core Principle: {concept}",
            "educational_purpose": "Conceptual breakdown and step-by-step reasoning",
            "quickCheck": None
        }
        all_scenes.append(scene_b)
        step_scenes.append(scene_b)
        total_duration += 14
        scene_index += 1

        # Scene C: Quick check / Question if present on this step
        quick_check = step.get("quickCheck")
        if quick_check:
            q_text = quick_check.get("question", f"How does {concept} behave?")
            q_narration_en = f"Now let's check your intuition. {q_text}"
            q_narration_hi = f"अब अपनी समझ को परखते हैं: {q_text}"
            q_narration_hinglish = f"Chaliye ab aapki understanding check karte hain: {q_text}"
            q_narration_te = f"ఇప్పుడు మీ అవగాహనను తనిఖీ చేద్దాం: {q_text}"

            scene_c = {
                "id": f"scene_{scene_index}",
                "step_index": i,
                "step_number": step_number_str,
                "scene_number": scene_index,
                "scene_type": "question",
                "duration_seconds": 10,
                "narration": q_narration_hi if lang_lower == "hi" else q_narration_hinglish if lang_lower == "hinglish" else q_narration_te if lang_lower == "te" else q_narration_en,
                "narrationTranslations": {
                    "en": q_narration_en,
                    "hi": q_narration_hi,
                    "hinglish": q_narration_hinglish,
                    "te": q_narration_te
                },
                "teacher_action": "attentive_listening",
                "camera_direction": "medium close-up with interactive option overlay",
                "visual_type": vis_type,
                "visual_data": vis_data,
                "on_screen_text": f"Check: {concept}",
                "educational_purpose": "Formative evaluation & diagnostic checkpoint",
                "quickCheck": quick_check
            }
            all_scenes.append(scene_c)
            step_scenes.append(scene_c)
            total_duration += 10
            scene_index += 1

        # Assign step's scenes
        step["scenes"] = step_scenes

    # 3. Final Teacher Summary Scene
    summary_narration_en = f"Outstanding effort! You have mastered the foundational concepts of {title}. Let's test your overall knowledge."
    summary_narration_hi = f"शानदार! आपने {title} के मुख्य सिद्धांतों को बहुत अच्छे से समझ लिया है। आइए अब अंतिम मूल्यांकन करते हैं।"
    summary_narration_hinglish = f"Bahut badiya! Aapne {title} ke core concepts master kar liye hain. Let's proceed to the assessment."
    summary_narration_te = f"అద్భుతం! మీరు {title} యొక్క ప్రాథమిక అంశాలను నేర్చుకున్నారు."

    summary_scene = {
        "id": f"scene_{scene_index}",
        "step_index": len(steps) - 1 if steps else 0,
        "step_number": "Summary",
        "scene_number": scene_index,
        "scene_type": "teacher_summary",
        "duration_seconds": 10,
        "narration": summary_narration_hi if lang_lower == "hi" else summary_narration_hinglish if lang_lower == "hinglish" else summary_narration_te if lang_lower == "te" else summary_narration_en,
        "narrationTranslations": {
            "en": summary_narration_en,
            "hi": summary_narration_hi,
            "hinglish": summary_narration_hinglish,
            "te": summary_narration_te
        },
        "teacher_action": "encouraging_smile",
        "camera_direction": "medium shot, centered",
        "visual_type": "concept_card",
        "visual_data": {
            "title": "Lesson Mastery Achieved!",
            "points": ["Key Mechanisms Understood", "Formative Checkpoints Cleared", "Ready for Final Assessment"]
        },
        "on_screen_text": "Lesson Mastery Achieved",
        "educational_purpose": "Affirm mastery and transition to final assessment",
        "quickCheck": None
    }
    all_scenes.append(summary_scene)
    total_duration += 10

    return {
        "lesson_id": lesson_id,
        "title": title,
        "subject": subject,
        "total_duration_seconds": total_duration,
        "scenes": all_scenes,
        "status": "ready"
    }
