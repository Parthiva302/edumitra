import pytest
from app.services.lesson_planner import generate_personalized_lesson_plan
from app.services.question_generator import generate_assessment_questions, generate_lesson_notes, generate_flashcards, generate_concept_map
from app.services.learning_path import generate_personalized_learning_path

def test_full_lesson_lifecycle():
    # 1. Lesson planning
    plan = generate_personalized_lesson_plan(
        topic="Photosynthesis",
        level="intermediate",
        goal="understand_concept",
        language="hinglish",
        duration="20m"
    )
    assert plan is not None
    assert "steps" in plan
    assert len(plan["steps"]) >= 3

    # Extract concepts
    concepts = [s.get("concept", "Concept") for s in plan["steps"]]

    # 2. Assessment generation
    questions = generate_assessment_questions("Photosynthesis", concepts, count=3)
    assert len(questions) >= 1

    # 3. Notes generation
    notes = generate_lesson_notes("Photosynthesis", concepts)
    assert notes is not None
    assert "title" in notes

    # 4. Flashcards generation
    flashcards = generate_flashcards("Photosynthesis", concepts)
    assert len(flashcards) >= 1

    # 5. Concept map generation
    cmap = generate_concept_map("Photosynthesis", concepts)
    assert "central_topic" in cmap
    assert len(cmap.get("nodes", [])) >= 2

    # 6. Learning path generation
    path = generate_personalized_learning_path("Biology & Photosynthesis")
    assert "nodes" in path
    assert len(path["nodes"]) >= 2
