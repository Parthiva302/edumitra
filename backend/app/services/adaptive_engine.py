import logging
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("edumitra.adaptive_engine")

# Mastery Thresholds
MASTERY_THRESHOLDS = {
    "NEEDS_REVIEW": (0, 40),
    "LEARNING": (41, 70),
    "GOOD_UNDERSTANDING": (71, 85),
    "MASTERED": (86, 100),
}

DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

def calculate_mastery_level(score: int) -> Tuple[str, str]:
    """
    Given a concept mastery score (0-100), return:
    (status, difficulty_level)
    """
    if score >= 86:
        return "MASTERED", "ADVANCED"
    elif score >= 71:
        return "LEARNING", "INTERMEDIATE"
    elif score >= 41:
        return "LEARNING", "INTERMEDIATE"
    else:
        return "NEEDS_REVIEW", "BEGINNER"

def update_concept_mastery(
    current_score: int,
    is_correct: bool,
    question_difficulty: str = "INTERMEDIATE",
    attempt_count: int = 1
) -> Dict[str, Any]:
    """
    Update concept mastery based on latest evaluation.
    Rewards correct answers based on difficulty, gently penalizes errors.
    """
    diff = question_difficulty.upper()
    weight = 1.2 if diff == "ADVANCED" else 1.0 if diff == "INTERMEDIATE" else 0.8

    if is_correct:
        # Increase score
        delta = round(15 * weight)
        new_score = min(100, current_score + delta)
    else:
        # Decrease score proportionally
        delta = round(12 * (1.0 / weight))
        new_score = max(10, current_score - delta)

    status, new_difficulty = calculate_mastery_level(new_score)

    return {
        "previous_score": current_score,
        "new_score": new_score,
        "delta": new_score - current_score,
        "status": status,
        "difficulty": new_difficulty,
        "mastery_label": get_mastery_label(new_score)
    }

def get_mastery_label(score: int) -> str:
    if score >= 86:
        return "Mastered (86-100)"
    elif score >= 71:
        return "Good Understanding (71-85)"
    elif score >= 41:
        return "Learning (41-70)"
    else:
        return "Needs Significant Support (0-40)"

def get_adaptation_parameters(difficulty: str, learning_style: str = "simple_visual") -> Dict[str, Any]:
    """
    Adapt vocabulary, examples, question difficulty, explanation length, visual complexity, and steps.
    """
    diff = difficulty.upper()
    if diff == "BEGINNER":
        return {
            "difficulty": "BEGINNER",
            "vocabulary_complexity": "simple_everyday",
            "explanation_length": "concise_direct",
            "example_type": "physical_concrete_everyday_analogy",
            "visual_complexity": "intuitive_diagram",
            "target_step_count": 3,
            "tone": "warm_encouraging_reassuring",
            "question_type": "concept_check_mcq"
        }
    elif diff == "ADVANCED":
        return {
            "difficulty": "ADVANCED",
            "vocabulary_complexity": "academic_rigorous",
            "explanation_length": "deep_first_principles",
            "example_type": "edge_case_real_world_system",
            "visual_complexity": "interactive_mathematical_simulation",
            "target_step_count": 6,
            "tone": "intellectually_challenging_inquisitive",
            "question_type": "problem_solving_or_application"
        }
    else: # INTERMEDIATE
        return {
            "difficulty": "INTERMEDIATE",
            "vocabulary_complexity": "clear_standard_technical",
            "explanation_length": "balanced_step_by_step",
            "example_type": "practical_case_study",
            "visual_complexity": "standard_simulation_and_formula",
            "target_step_count": 4,
            "tone": "friendly_focused_pedagogical",
            "question_type": "conceptual_short_answer"
        }
