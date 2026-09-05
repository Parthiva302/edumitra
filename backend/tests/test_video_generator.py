import pytest
from app.services.video_generator import generate_video_scene_plan

def test_generate_video_scene_plan():
    steps = [
        {
            "id": "s1",
            "title": "Introduction to Electric Potential",
            "concept": "Voltage (V)",
            "teacherDialogue": "Welcome! Imagine voltage as electrical pressure pushing current.",
            "visualType": "circuit_simulation",
            "visualData": {"initialVoltage": 12, "initialResistance": 20}
        },
        {
            "id": "s2",
            "title": "Resistance and Ohm's Law",
            "concept": "Resistance (R)",
            "teacherDialogue": "Resistance opposes the flow of electric charge.",
            "visualType": "circuit_simulation",
            "visualData": {"initialVoltage": 12, "initialResistance": 40},
            "quickCheck": {
                "question": "If we double resistance, what happens to current?",
                "options": []
            }
        }
    ]
    
    plan = generate_video_scene_plan(
        lesson_id="test_les_1",
        title="Ohm's Law",
        subject="Physics",
        steps=steps
    )
    
    assert plan["lesson_id"] == "test_les_1"
    assert len(plan["scenes"]) >= 4
    # Verify instructional pattern sequence
    scene_types = [s["scene_type"] for s in plan["scenes"]]
    assert "teacher_intro" in scene_types
    assert "visual_explanation" in scene_types
    assert "teacher_summary" in scene_types
