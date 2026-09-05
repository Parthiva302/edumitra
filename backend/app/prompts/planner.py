"""
EduMitra Curriculum & Lesson Planning Prompts
Guides the generation of progressive, multi-step pedagogical lesson plans with subject-matched visual models.
"""

LESSON_PLANNER_SYSTEM_PROMPT = """You are EduMitra's Master Curriculum Planner and Pedagogical AI Engine.
You design high-impact, step-by-step educational journeys tailored to the learner's background, goals, time budget, and preferred language.

Pedagogical Core Rules:
1. Progress from foundational intuition to core mechanics, deep dives, interactive checks, and practical synthesis.
2. Pair every step with a subject-aware visual demonstration.
3. Incorporate formative checkpoints that test conceptual intuition, not just rote recall.
4. Provide conversational, warm teacher dialogue with accurate multilingual translations.
"""

def build_lesson_planning_prompt(
    topic: str,
    level: str = "intermediate",
    goal: str = "understand_concept",
    language: str = "hinglish",
    duration: str = "20m",
    style: str = "simple_visual",
    depth: str = "normal",
    document_text: str = "",
    step_count: int = 5
) -> str:
    """Builds the comprehensive lesson planning prompt for Gemini"""
    doc_context = f"\nUser Uploaded Document Excerpt:\n{document_text[:4000]}" if document_text else ""
    
    return f"""
Topic: {topic}
Student Level: {level}
Learning Goal: {goal}
Preferred Language: {language}
Duration: {duration} (Target approx {step_count} progressive steps)
Teaching Style: {style}
Depth: {depth}{doc_context}

Pedagogical Structure Requirements:
1. Step 1: Introduction & Intuitive Hook (Relate to real life, establish motivation).
2. Step 2: Foundational Mechanism & Subject-Aware Visual Model.
3. Step 3: Deep-Dive / Mathematical Formula / Code / Demonstration with Step-by-Step explanation.
4. Step 4: Interactive Quick Check (Concept check question + Misconception diagnosis + Remediation Analogy + Follow-up retry question).
5. Step 5: Practical Application & Summary.

Visual Types Available:
- "circuit_simulation" (for electrical circuits, Ohm's law, voltage, resistance)
- "physics_simulation" (for mechanics, forces, kinematics, vectors, gravity)
- "math_equation" (for calculus, algebra, graphing, quadratic, derivatives)
- "biology_diagram" (for photosynthesis, cells, DNA, biology)
- "code_runner" (for Python, JS, algorithms, recursion, data structures)
- "chemistry_visual" (for molecules, reactions, bonding)
- "timeline" (for history, chronological stages)
- "api_workflow" (for APIs, HTTP methods, client-server architecture)
- "concept_card" (for general structured concept cards)

Return a strictly valid JSON object matching this schema:
{{
  "id": "lesson_generated",
  "title": "Clear Lesson Title",
  "subject": "Subject Name (e.g. Physics, Biology, Computer Science, Mathematics, Chemistry, History)",
  "category": "Curriculum Category",
  "level": "{level}",
  "language": "{language}",
  "duration": "{duration}",
  "totalEstimatedMinutes": {15 if step_count == 4 else 20 if step_count == 5 else 25},
  "steps": [
    {{
      "id": "step_1",
      "stepNumber": "01",
      "title": "Engaging Step Title",
      "concept": "Specific concept name",
      "estimatedMinutes": 3.0,
      "teacherDialogue": "Spoken dialogue of the teacher, conversational and direct to student...",
      "dialogueTranslations": {{
        "hi": "Hindi translation of dialogue...",
        "hinglish": "Hinglish translation...",
        "en": "English translation..."
      }},
      "visualType": "chosen_visual_type",
      "visualData": {{
        "title": "Title",
        "points": ["Key point 1", "Key point 2"]
      }},
      "quickCheck": null
    }}
  ]
}}
"""
