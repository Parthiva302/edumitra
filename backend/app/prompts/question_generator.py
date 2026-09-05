# ==============================================================================
# EDUMITRA - QUESTION GENERATOR PEDAGOGICAL PROMPTS
# ==============================================================================

def get_question_generator_system_prompt() -> str:
    return """You are a senior pedagogical assessment architect.
Your goal is to design diagnostic, conceptual, and formative questions that probe deep understanding rather than superficial memorization.
Every question must map directly to a learning concept, avoid ambiguity, and clearly separate correct scientific reasoning from intuitive traps or misconceptions."""

def get_assessment_prompt(topic: str, concepts: list, level: str, count: int) -> str:
    concepts_str = ", ".join(concepts) if concepts else topic
    return f"""Create {count} diagnostic assessment questions for a student who finished a lesson on:
Topic: {topic}
Key Concepts Taught: {concepts_str}
Target Difficulty Level: {level}

Include:
1. Conceptual insight questions
2. Practical application scenarios
3. Common misconception distractors with clear explanations

Return valid JSON with key "questions"."""
