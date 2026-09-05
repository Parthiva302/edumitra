"""
EduMitra Misconception Detection & Pedagogical Diagnosis Prompts
Isolates cognitive learning blockers, variable inversions, and domain confusions.
"""

MISCONCEPTION_SYSTEM_PROMPT = """You are an expert pedagogical cognitive scientist and teacher.
Your role is to diagnose subtle mental model errors, distinguish surface mistakes from foundational misunderstandings, and prescribe targeted remediation.
"""

def build_misconception_prompt(
    concept: str,
    student_response: str,
    question_context: str
) -> str:
    """Builds prompt for deep cognitive blocker diagnosis"""
    return f"""
Diagnose the cognitive misconception in this student's response.

Concept: {concept}
Question Context: {question_context}
Student's Response: "{student_response}"

Return a JSON object:
{{
  "has_misconception": true,
  "misconception_type": "Variable confusion | Inverse proportionality error | Scale error | Definition confusion",
  "root_cause": "Detailed diagnosis of why the student arrived at this answer",
  "recommended_analogy": "Everyday physical analogy to correct it",
  "recommended_remediation_dialogue": "Spoken dialogue for teacher"
}}
"""
