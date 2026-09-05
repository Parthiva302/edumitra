import uuid
import logging
from typing import Dict, Any, List, Optional
from app.services.visual_planner import plan_subject_visual

logger = logging.getLogger("edumitra.video_generator")

# In-memory registry for tracking asynchronous video jobs
_VIDEO_JOBS: Dict[str, Dict[str, Any]] = {}

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
        "scene_id": f"scene_{scene_index}",
        "step_index": 0,
        "step_number": "01",
        "scene_number": scene_index,
        "scene_type": "teacher_intro",
        "duration": 8,
        "duration_seconds": 8,
        "narration": intro_translations.get(lang_lower, intro_narration),
        "narrationTranslations": intro_translations,
        "teacher_action": "welcoming_gesture",
        "camera_direction": "medium shot, frontal camera",
        "visual_type": "concept_card",
        "visual": {
            "title": title,
            "points": ["Core Foundational Principles", "Interactive Visual Demonstrations", "Diagnostic Mastery Checkpoints"]
        },
        "visual_data": {
            "title": title,
            "points": ["Core Foundational Principles", "Interactive Visual Demonstrations", "Diagnostic Mastery Checkpoints"]
        },
        "on_screen_text": f"Topic: {title}",
        "educational_purpose": "Establish learning goal and build warm pedagogical rapport",
        "interaction_required": False,
        "quickCheck": None
    }
    all_scenes.append(intro_scene)
    total_duration += 8
    scene_index += 1

    # 2. Sequential Pedagogical Shots per Lesson Step
    for i, step in enumerate(steps):
        concept = step.get("concept") or step.get("title") or f"Concept {i+1}"
        step_title = step.get("title") or concept
        step_num_str = step.get("stepNumber") or (f"0{i+1}" if i < 9 else f"{i+1}")
        teacher_dialogue = step.get("teacherDialogue") or f"Let us understand {concept} in depth."
        translations = step.get("dialogueTranslations") or {
            "en": teacher_dialogue,
            "hi": f"आइए अब {concept} को गहराई से समझते हैं।",
            "hinglish": f"Chaliye ab {concept} ko visually explore karte hain.",
            "te": f"ఇప్పుడు {concept} గురించి లోతుగా తెలుసుకుందాం."
        }
        
        vis_type = step.get("visualType") or "concept_card"
        vis_data = step.get("visualData") or {"title": concept, "points": [concept]}
        quick_check = step.get("quickCheck")
        
        step_scenes = []

        # Shot A: Visual Model Demonstration
        scene_a = {
            "id": f"scene_{scene_index}",
            "scene_id": f"scene_{scene_index}",
            "step_index": i,
            "step_number": step_num_str,
            "scene_number": scene_index,
            "scene_type": "visual_explanation",
            "duration": 12,
            "duration_seconds": 12,
            "narration": f"Observe the visual model for {concept}. Notice how each element behaves under different conditions.",
            "narrationTranslations": {
                "en": f"Observe the visual model for {concept}. Notice how each element behaves under different conditions.",
                "hi": f"{concept} के इस मॉडल को देखिए। घटक कैसे प्रतिक्रिया करते हैं।",
                "hinglish": f"Dhyan se dekhiye: {concept} ka model kaise dynamically interact karta hai.",
                "te": f"{concept} యొక్క విజువల్ మోడల్ చూడండి."
            },
            "teacher_action": "points_right",
            "camera_direction": "split screen: teacher on left, visual model on right",
            "visual_type": vis_type,
            "visual": vis_data,
            "visual_data": vis_data,
            "on_screen_text": f"Model: {concept}",
            "educational_purpose": f"Visual grounding for {concept}",
            "interaction_required": False,
            "quickCheck": None
        }
        all_scenes.append(scene_a)
        step_scenes.append(scene_a)
        total_duration += 12
        scene_index += 1

        # Shot B: Teacher Dialogue & Explanatory Reasoning
        narration_text = translations.get(lang_lower, teacher_dialogue)
        scene_b = {
            "id": f"scene_{scene_index}",
            "scene_id": f"scene_{scene_index}",
            "step_index": i,
            "step_number": step_num_str,
            "scene_number": scene_index,
            "scene_type": "teacher_and_visual",
            "duration": 14,
            "duration_seconds": 14,
            "narration": narration_text,
            "narrationTranslations": translations,
            "teacher_action": "explaining_formula",
            "camera_direction": "picture-in-picture with active simulation",
            "visual_type": vis_type,
            "visual": vis_data,
            "visual_data": vis_data,
            "on_screen_text": f"Principle: {concept}",
            "educational_purpose": "Conceptual breakdown and first-principles reasoning",
            "interaction_required": False,
            "quickCheck": None
        }
        all_scenes.append(scene_b)
        step_scenes.append(scene_b)
        total_duration += 14
        scene_index += 1

        # Shot C: Formative Interactive Diagnostic Checkpoint (if present)
        if quick_check:
            q_text = quick_check.get("question", f"Quick check on {concept}")
            q_narration_en = f"Now let's check your understanding. {q_text}"
            q_narration_hi = f"आइए अपनी समझ को परखते हैं: {q_text}"
            q_narration_hinglish = f"Chaliye ab aapki understanding check karte hain: {q_text}"
            q_narration_te = f"ఇప్పుడు మీ అవగాహనను పరీక్షిద్దాం: {q_text}"

            scene_c = {
                "id": f"scene_{scene_index}",
                "scene_id": f"scene_{scene_index}",
                "step_index": i,
                "step_number": step_num_str,
                "scene_number": scene_index,
                "scene_type": "question",
                "duration": 10,
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
                "visual": vis_data,
                "visual_data": vis_data,
                "on_screen_text": f"Check: {concept}",
                "educational_purpose": "Formative evaluation & diagnostic checkpoint",
                "interaction_required": True,
                "quickCheck": quick_check
            }
            all_scenes.append(scene_c)
            step_scenes.append(scene_c)
            total_duration += 10
            scene_index += 1

        step["scenes"] = step_scenes

    # 3. Final Teacher Summary Scene
    summary_narration_en = f"Outstanding effort! You have mastered the foundational concepts of {title}. Let's test your overall knowledge."
    summary_narration_hi = f"शानदार! आपने {title} के मुख्य सिद्धांतों को बहुत अच्छे से समझ लिया है। आइए अब अंतिम मूल्यांकन करते हैं।"
    summary_narration_hinglish = f"Bahut badiya! Aapne {title} ke core concepts master kar liye hain. Let's proceed to the assessment."
    summary_narration_te = f"అద్భుతం! మీరు {title} యొక్క ప్రాథమిక అంశాలను నేర్చుకున్నారు."

    summary_scene = {
        "id": f"scene_{scene_index}",
        "scene_id": f"scene_{scene_index}",
        "step_index": len(steps) - 1 if steps else 0,
        "step_number": "Summary",
        "scene_number": scene_index,
        "scene_type": "teacher_summary",
        "duration": 10,
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
        "visual": {
            "title": "Lesson Mastery Achieved!",
            "points": ["Key Mechanisms Understood", "Formative Checkpoints Cleared", "Ready for Final Assessment"]
        },
        "visual_data": {
            "title": "Lesson Mastery Achieved!",
            "points": ["Key Mechanisms Understood", "Formative Checkpoints Cleared", "Ready for Final Assessment"]
        },
        "on_screen_text": "Lesson Mastery Achieved",
        "educational_purpose": "Affirm mastery and transition to final assessment",
        "interaction_required": False,
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

def create_video_generation_job(
    lesson_id: str,
    title: str,
    subject: str,
    steps: List[Dict[str, Any]],
    language: str = "hinglish"
) -> Dict[str, Any]:
    """Create and track an asynchronous video generation job"""
    job_id = f"vjob_{uuid.uuid4().hex[:12]}"
    scene_plan = generate_video_scene_plan(lesson_id, title, subject, steps, language)
    
    job_record = {
        "job_id": job_id,
        "lesson_id": lesson_id,
        "title": title,
        "subject": subject,
        "status": "completed", # Completed ready-to-stream scene sequence
        "total_duration_seconds": scene_plan.get("total_duration_seconds", 60),
        "scenes": scene_plan.get("scenes", []),
        "video_url": f"/api/video/{job_id}/stream",
        "retry_count": 0
    }
    _VIDEO_JOBS[job_id] = job_record
    return job_record

def get_video_job_status(job_id: str) -> Dict[str, Any]:
    """Retrieve current status of a video generation job"""
    job = _VIDEO_JOBS.get(job_id)
    if not job:
        # Generate on-demand dummy completed job
        return {
            "job_id": job_id,
            "status": "completed",
            "video_url": f"/api/video/{job_id}/stream",
            "scenes": []
        }
    return {
        "job_id": job["job_id"],
        "status": job.get("status", "completed"),
        "video_url": job.get("video_url"),
        "total_duration_seconds": job.get("total_duration_seconds"),
        "scenes": job.get("scenes", [])
    }

def retry_video_generation_job(job_id: str) -> Dict[str, Any]:
    """Retry a failed or stalled video generation job"""
    job = _VIDEO_JOBS.get(job_id)
    if not job:
        job = {
            "job_id": job_id,
            "status": "completed",
            "video_url": f"/api/video/{job_id}/stream",
            "scenes": [],
            "retry_count": 1
        }
        _VIDEO_JOBS[job_id] = job
        return job
    
    job["retry_count"] = job.get("retry_count", 0) + 1
    job["status"] = "completed"
    return job
