import pytest
from app.services.adaptive_engine import (
    calculate_mastery_level,
    update_concept_mastery,
    get_adaptation_parameters
)

def test_mastery_level_thresholds():
    # 0-40: NEEDS_REVIEW, BEGINNER
    status, diff = calculate_mastery_level(30)
    assert status == "NEEDS_REVIEW"
    assert diff == "BEGINNER"

    # 41-70: LEARNING, INTERMEDIATE
    status, diff = calculate_mastery_level(65)
    assert status == "LEARNING"
    assert diff == "INTERMEDIATE"

    # 71-85: LEARNING / GOOD_UNDERSTANDING, INTERMEDIATE
    status, diff = calculate_mastery_level(75)
    assert diff == "INTERMEDIATE"

    # 86-100: MASTERED, ADVANCED
    status, diff = calculate_mastery_level(92)
    assert status == "MASTERED"
    assert diff == "ADVANCED"

def test_adaptive_score_progression():
    # Correct answer on intermediate question increases score
    res = update_concept_mastery(
        current_score=50,
        is_correct=True,
        question_difficulty="INTERMEDIATE"
    )
    assert res["new_score"] > 50
    assert res["delta"] > 0

    # Incorrect answer decreases score and shifts toward beginner
    res_fail = update_concept_mastery(
        current_score=50,
        is_correct=False,
        question_difficulty="INTERMEDIATE"
    )
    assert res_fail["new_score"] < 50
    assert res_fail["delta"] < 0

def test_adaptation_parameters():
    beginner_params = get_adaptation_parameters("BEGINNER")
    assert beginner_params["difficulty"] == "BEGINNER"
    assert "everyday" in beginner_params["vocabulary_complexity"]
    assert beginner_params["target_step_count"] <= 3

    advanced_params = get_adaptation_parameters("ADVANCED")
    assert advanced_params["difficulty"] == "ADVANCED"
    assert "rigorous" in advanced_params["vocabulary_complexity"]
    assert advanced_params["target_step_count"] >= 5
