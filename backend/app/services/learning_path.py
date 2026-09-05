import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.prompts import get_edumitra_system_prompt

logger = logging.getLogger("edumitra.learning_path")

def generate_personalized_learning_path(
    subject_or_goal: str,
    level: str = "beginner",
    learning_goal: str = "understand_concept"
) -> Dict[str, Any]:
    """Generate a step-by-step pedagogical roadmap with prerequisite node dependencies"""
    prompt = f"""
Create a structured 5-milestone learning roadmap for a student learning:
Subject / Goal: {subject_or_goal}
Current Level: {level}
Objective: {learning_goal}

Return a valid JSON object:
{{
  "id": "track_generated",
  "title": "{subject_or_goal} Mastery Track",
  "category": "{subject_or_goal}",
  "description": "Structured pedagogical track progressing from first principles to advanced mastery.",
  "nodes": [
    {{
      "id": "node_1",
      "title": "Foundational Milestone",
      "status": "in_progress",
      "estimatedHours": 2.5,
      "description": "Core concepts and initial intuition.",
      "subTopics": ["Subtopic A", "Subtopic B", "Subtopic C"]
    }},
    {{
      "id": "node_2",
      "title": "Intermediate Principles",
      "status": "locked",
      "estimatedHours": 3.0,
      "description": "Practical mechanics and problem solving.",
      "subTopics": ["Subtopic D", "Subtopic E"]
    }},
    {{
      "id": "node_3",
      "title": "Advanced Applications",
      "status": "locked",
      "estimatedHours": 4.0,
      "description": "Real-world systems and complex projects.",
      "subTopics": ["Subtopic F", "Subtopic G"]
    }}
  ]
}}
"""
    try:
        return generate_structured_json(
            prompt,
            system_instruction=get_edumitra_system_prompt()
        )
    except Exception as e:
        logger.error(f"Error generating learning path: {e}")
        return {
            "id": "track_default",
            "title": f"{subject_or_goal} Learning Track",
            "category": subject_or_goal,
            "description": f"Curated curriculum for mastering {subject_or_goal}.",
            "nodes": [
                {
                    "id": "node_1",
                    "title": f"Fundamentals of {subject_or_goal}",
                    "status": "in_progress",
                    "estimatedHours": 2.5,
                    "description": "Foundational principles and initial intuition.",
                    "subTopics": ["Key Principles", "Mechanisms", "First Checks"]
                },
                {
                    "id": "node_2",
                    "title": f"Applications of {subject_or_goal}",
                    "status": "locked",
                    "estimatedHours": 3.5,
                    "description": "Practical scenarios and problem solving.",
                    "subTopics": ["Problem Solving", "Analysis", "Practical Cases"]
                }
            ]
        }
