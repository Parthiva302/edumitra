import logging
from typing import Dict, Any, List, Optional
from app.services.gemini import generate_structured_json
from app.services.prompts import get_edumitra_system_prompt

logger = logging.getLogger("edumitra.question_generator")

def generate_assessment_questions(
    topic: str,
    concepts: List[str],
    level: str = "intermediate",
    count: int = 5
) -> List[Dict[str, Any]]:
    """Generate comprehensive assessment questions covering the taught concepts"""
    concepts_str = ", ".join(concepts) if concepts else topic
    prompt = f"""
Create {count} high-quality assessment questions for a student who just finished a lesson on:
Topic: {topic}
Key Concepts Taught: {concepts_str}
Level: {level}

Include a mix of:
- Conceptual understanding questions
- Multiple choice scenarios
- Problem-solving / calculation or application questions

Return a valid JSON object:
{{
  "questions": [
    {{
      "id": "q1",
      "type": "mcq",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Clear explanation of why this answer is correct and others are incorrect.",
      "conceptTested": "Specific concept name"
    }}
  ]
}}
"""
    try:
        data = generate_structured_json(prompt, system_instruction=get_edumitra_system_prompt())
        return data.get("questions", [])
    except Exception as e:
        logger.error(f"Error generating assessment questions: {e}")
        return [
            {
                "id": "q1",
                "type": "mcq",
                "question": f"What is the fundamental relationship governing {topic}?",
                "options": [
                    "Direct proportionality under standard conditions",
                    "Inverse relationship without constraints",
                    "Unrelated independent quantities",
                    "Zero variance"
                ],
                "correctAnswer": "Direct proportionality under standard conditions",
                "explanation": f"In {topic}, the primary variables scale consistently according to established physical laws.",
                "conceptTested": topic
            }
        ]

def generate_lesson_notes(
    topic: str,
    concepts: List[str],
    document_text: Optional[str] = None
) -> Dict[str, Any]:
    """Generate structured revision notes from the lesson"""
    prompt = f"""
Generate structured revision study notes for the completed lesson on:
Topic: {topic}
Concepts: {', '.join(concepts) if concepts else topic}

Return a valid JSON object:
{{
  "title": "{topic} - Comprehensive Study Notes",
  "overview": "Clear 2-3 paragraph overview of the core principles taught.",
  "key_concepts": [
    {{
      "concept": "Concept Name",
      "summary": "Detailed explanation and operational mechanism.",
      "takeaway": "Key intuition"
    }}
  ],
  "formulas_and_definitions": [
    {{
      "term": "Term or Formula",
      "definition": "Clear formulation and variable descriptions."
    }}
  ],
  "common_mistakes": [
    {{
      "mistake": "Common trap or misconception",
      "correction": "Correct scientific reasoning"
    }}
  ],
  "summary": "Concluding summary for fast revision."
}}
"""
    try:
        return generate_structured_json(prompt, system_instruction="You are a senior pedagogical author.")
    except Exception as e:
        logger.error(f"Error generating lesson notes: {e}")
        return {
            "title": f"{topic} - Study Notes",
            "overview": f"A comprehensive review of the foundational principles of {topic}.",
            "key_concepts": [{"concept": topic, "summary": "Core mechanism and principles.", "takeaway": "Master the direct relationships."}],
            "formulas_and_definitions": [{"term": "Primary Principle", "definition": f"The governing law of {topic}."}],
            "common_mistakes": [{"mistake": "Confusing opposing parameters", "correction": "Check dependencies carefully."}],
            "summary": f"Completed study notes for {topic}."
        }

def generate_flashcards(
    topic: str,
    concepts: List[str]
) -> List[Dict[str, Any]]:
    """Generate revision flashcards from the lesson"""
    prompt = f"""
Generate 6 concise, high-impact revision flashcards for:
Topic: {topic}
Concepts: {', '.join(concepts) if concepts else topic}

Return a valid JSON object:
{{
  "cards": [
    {{
      "id": "card_1",
      "question": "Front of card question or prompt...",
      "answer": "Back of card concise, clear explanation...",
      "concept": "Specific concept name",
      "difficulty": "easy | medium | hard"
    }}
  ]
}}
"""
    try:
        data = generate_structured_json(prompt, system_instruction="You are a memory retention and flashcard specialist.")
        return data.get("cards", [])
    except Exception as e:
        logger.error(f"Error generating flashcards: {e}")
        return [
            {
                "id": "card_1",
                "question": f"What is the primary governing equation or rule in {topic}?",
                "answer": "It defines the direct relationship between driving potential and resulting rate of flow/change.",
                "concept": topic,
                "difficulty": "easy"
            }
        ]

def generate_concept_map(
    topic: str,
    concepts: List[str]
) -> Dict[str, Any]:
    """Generate visual concept map graph data showing relationships between nodes"""
    prompt = f"""
Generate a structured concept map network for:
Topic: {topic}
Concepts: {', '.join(concepts) if concepts else topic}

Return a valid JSON object:
{{
  "central_topic": "{topic}",
  "nodes": [
    {{
      "id": "node_central",
      "label": "{topic}",
      "description": "Central subject anchor",
      "category": "core",
      "connections": ["node_1", "node_2"]
    }},
    {{
      "id": "node_1",
      "label": "Concept 1",
      "description": "Foundational principle",
      "category": "foundation",
      "connections": ["node_3"]
    }},
    {{
      "id": "node_2",
      "label": "Concept 2",
      "description": "Mechanism and application",
      "category": "application",
      "connections": []
    }},
    {{
      "id": "node_3",
      "label": "Concept 3",
      "description": "Advanced extension",
      "category": "advanced",
      "connections": []
    }}
  ]
}}
"""
    try:
        return generate_structured_json(prompt, system_instruction="You are an expert in knowledge graphs and visual knowledge mapping.")
    except Exception as e:
        logger.error(f"Error generating concept map: {e}")
        return {
            "central_topic": topic,
            "nodes": [
                {
                    "id": "node_central",
                    "label": topic,
                    "description": "Central subject principle",
                    "category": "core",
                    "connections": ["node_1", "node_2"]
                },
                {
                    "id": "node_1",
                    "label": "Physical Laws",
                    "description": "Underlying theoretical rules",
                    "category": "foundation",
                    "connections": []
                },
                {
                    "id": "node_2",
                    "label": "Applications",
                    "description": "Practical scenarios",
                    "category": "application",
                    "connections": []
                }
            ]
        }
