import pytest
from app.services.embeddings import cosine_similarity
from app.services.visual_planner import plan_subject_visual

def test_cosine_similarity():
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    v3 = [0.0, 1.0, 0.0]
    assert cosine_similarity(v1, v2) == pytest.approx(1.0)
    assert cosine_similarity(v1, v3) == pytest.approx(0.0)

def test_plan_subject_visual_physics():
    vis = plan_subject_visual("Physics", "Ohm's Law", "Voltage", "V = I * R")
    assert vis["visual_type"] == "circuit_simulation"
    assert "initialVoltage" in vis["visual_data"]

def test_plan_subject_visual_biology():
    vis = plan_subject_visual("Biology", "Photosynthesis", "Calvin Cycle", "Chloroplast carbon fixation")
    assert vis["visual_type"] == "biology_diagram"

def test_plan_subject_visual_programming():
    vis = plan_subject_visual("Computer Science", "Recursion", "Factorial", "Call stack frames")
    assert vis["visual_type"] == "code_runner"
