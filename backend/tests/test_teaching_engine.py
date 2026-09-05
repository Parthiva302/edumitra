import pytest
from app.services.evaluator import evaluate_student_response
from app.services.teaching_engine import answer_student_interruption
from app.services.misconception_detector import detect_pedagogical_misconception

def test_evaluate_correct_response():
    res = evaluate_student_response(
        concept="Ohm's Law",
        question="What happens to current if voltage increases and resistance is fixed?",
        student_answer="The current increases proportionally because I = V / R.",
        expected_answer="Current increases directly proportional to voltage"
    )
    assert res is not None
    assert "is_correct" in res
    assert res["is_correct"] is True
    assert res["score"] >= 70

def test_evaluate_misconception_response():
    res = evaluate_student_response(
        concept="Ohm's Law",
        question="If resistance goes up, why does current decrease?",
        student_answer="Because resistance pushes more electrons faster.",
        expected_answer="Resistance opposes flow, reducing current"
    )
    assert res is not None
    assert "is_correct" in res
    # Should diagnose misconception and provide remediation
    assert "remediation_analogy" in res or "feedback" in res

def test_answer_student_interruption():
    res = answer_student_interruption(
        lesson_title="Ohm's Law",
        current_concept="Resistance",
        student_question="Can you explain this in Hindi?",
        language="hinglish"
    )
    assert res is not None
    assert "answer_text" in res
    assert len(res["answer_text"]) > 10
