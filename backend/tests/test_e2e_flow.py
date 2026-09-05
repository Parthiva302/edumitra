import pytest
from app.services.document_processor import extract_text_from_file_bytes, chunk_text, analyze_document_structure
from app.services.embeddings import cosine_similarity
from app.services.gemini import get_embedding
from app.services.rag_service import search_relevant_chunks, generate_grounded_answer
from app.services.lesson_planner import generate_personalized_lesson_plan
from app.services.question_generator import (
    generate_assessment_questions,
    generate_lesson_notes,
    generate_flashcards,
    generate_concept_map
)
from app.services.evaluator import evaluate_student_response
from app.services.misconception_detector import detect_pedagogical_misconception
from app.services.adaptive_engine import calculate_mastery_level, update_concept_mastery, get_adaptation_parameters
from app.services.video_generator import generate_video_scene_plan, create_video_generation_job, get_video_job_status
from app.services.learning_path import generate_personalized_learning_path
from app.services.teaching_engine import advance_teaching_state

def test_full_ai_teacher_end_to_end_loop():
    """
    Validates complete hackathon pedagogical loop:
    PDF/Text -> Chunks -> Embeddings -> pgvector similarity -> RAG Grounding ->
    Personalized Lesson Plan -> Video Scene Choreography -> Question ->
    Semantic Evaluation -> Misconception Diagnosis -> Adaptive Remediation ->
    Progress & Mastery -> Assessment -> Learning Path
    """
    # 1. Document ingestion and semantic chunking
    sample_doc_content = """# Electric Circuits and Ohm's Law
Chapter 4: Principles of Electricity
Section 4.1: Electric Potential and Potential Difference
Electric potential difference between two points is the work done to move a unit positive charge.
Formula: V = W / Q, measured in Volts.

Section 4.2: Ohm's Law
George Simon Ohm determined that current (I) through a conductor is directly proportional to voltage (V)
and inversely proportional to resistance (R) at constant temperature:
Formula: V = I * R
"""
    raw_text = extract_text_from_file_bytes(sample_doc_content.encode("utf-8"), "txt", "Ohm_Law.txt")
    assert "Ohm's Law" in raw_text

    chunks = chunk_text(raw_text)
    assert len(chunks) >= 1

    # 2. Vector Embedding & Cosine Similarity
    v1 = [0.1] * 768
    v2 = [0.1] * 768
    v3 = [-0.1] * 768
    sim_same = cosine_similarity(v1, v2)
    sim_diff = cosine_similarity(v1, v3)
    assert sim_same == pytest.approx(1.0, rel=1e-2)
    assert sim_diff < 0.0

    # 3. Grounded RAG Query Verification
    rag_ans = generate_grounded_answer(
        query="What is the formula for Ohm's Law?",
        user_id="test_student_mock",
        language="English"
    )
    assert "answer" in rag_ans
    assert len(rag_ans["answer"]) > 10

    # 4. Personalized Multi-Step Lesson Plan Generation
    plan = generate_personalized_lesson_plan(
        topic="Ohm's Law & Circuit Theory",
        document_text=sample_doc_content,
        level="beginner",
        goal="understand_concept",
        language="hinglish",
        duration="20m",
        style="simple_visual"
    )
    assert plan is not None
    assert "steps" in plan
    assert len(plan["steps"]) >= 3
    concepts = [s.get("concept", "Concept") for s in plan["steps"]]

    # 5. Video Scene Choreography & Asynchronous Job Tracking
    video_job = create_video_generation_job(
        lesson_id="lesson_e2e_1",
        title="Ohm's Law",
        subject="Physics",
        steps=plan["steps"],
        language="hinglish"
    )
    assert "job_id" in video_job
    assert video_job["status"] == "completed"
    assert len(video_job["scenes"]) >= 3

    job_status = get_video_job_status(video_job["job_id"])
    assert job_status["job_id"] == video_job["job_id"]

    # 6. Teaching State Machine Progression
    state_understand = advance_teaching_state("UNDERSTAND", {"topic": "Ohm's Law"})
    assert state_understand["next_state"] == "PLAN"

    state_explain = advance_teaching_state("EXPLAIN", {"topic": "Ohm's Law", "concept": "Resistance"})
    assert state_explain["next_state"] == "DEMONSTRATE"

    # 7. Semantic Question Evaluation & Misconception Detection
    # Case A: Incorrect answer with common misconception
    eval_incorrect = evaluate_student_response(
        concept="Resistance in Circuits",
        question="What happens to current if resistance increases at fixed voltage?",
        student_answer="Current increases because resistance pushes electrons faster",
        expected_answer="Current decreases because resistance opposes flow",
        language="hinglish"
    )
    assert eval_incorrect["correct"] is False
    assert eval_incorrect["misconception_detected"] is True
    assert eval_incorrect["recommended_action"] == "REEXPLAIN"
    assert eval_incorrect["next_difficulty"] == "BEGINNER"
    assert "remediation_analogy" in eval_incorrect

    # Case B: Correct answer
    eval_correct = evaluate_student_response(
        concept="Resistance in Circuits",
        question="What happens to current if resistance increases at fixed voltage?",
        student_answer="Current decreases because resistance opposes the flow of charge (I = V/R)",
        expected_answer="Current decreases proportionally",
        language="hinglish"
    )
    assert eval_correct["correct"] is True
    assert eval_correct["concept_understood"] is True
    assert eval_correct["score"] >= 70

    # 8. Adaptive Mastery & Difficulty Adaptation
    mastery_eval = update_concept_mastery(
        current_score=50,
        is_correct=False,
        question_difficulty="INTERMEDIATE"
    )
    assert mastery_eval["new_score"] < 50
    assert mastery_eval["difficulty"] in ["BEGINNER", "INTERMEDIATE"]

    mastery_eval_up = update_concept_mastery(
        current_score=75,
        is_correct=True,
        question_difficulty="INTERMEDIATE"
    )
    assert mastery_eval_up["new_score"] > 75

    # 9. Assessment, Notes, Flashcards, Concept Map, and Learning Path
    assessment_qs = generate_assessment_questions("Ohm's Law", concepts[:3], count=3)
    assert len(assessment_qs) >= 1

    notes = generate_lesson_notes("Ohm's Law", concepts[:3])
    assert "title" in notes

    cards = generate_flashcards("Ohm's Law", concepts[:3])
    assert len(cards) >= 1

    cmap = generate_concept_map("Ohm's Law", concepts[:3])
    assert "central_topic" in cmap or "nodes" in cmap

    path = generate_personalized_learning_path("Circuit Physics & STEM")
    assert "nodes" in path
    assert len(path["nodes"]) >= 2
