import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("edumitra.visual_planner")

def plan_subject_visual(
    subject: str,
    concept: str,
    step_title: str,
    explanation: str
) -> Dict[str, Any]:
    """Determine the optimal visual type and structured parameters for a concept based on its subject"""
    s = (subject or "").lower()
    c = (concept or "").lower()
    e = (explanation or "").lower()

    # 1. Physics / Circuits / Mechanics
    if "circuit" in s or "ohm" in c or "voltage" in e or "current" in e or "resistor" in e:
        return {
            "visual_type": "circuit_simulation",
            "visual_data": {
                "initialVoltage": 12,
                "initialResistance": 20,
                "showAmmeter": True,
                "showVoltmeter": True,
                "label": f"Circuit Model: {concept}",
                "component": "Resistor and DC Power Supply"
            }
        }
    elif "physics" in s or "force" in c or "newton" in c or "motion" in c or "gravity" in e or "velocity" in e or "acceleration" in e:
        return {
            "visual_type": "physics_simulation",
            "visual_data": {
                "simulationType": "free_body_vector" if "vector" in e or "force" in c else "motion_kinematics",
                "mass": 5,
                "appliedForce": 25,
                "frictionCoefficient": 0.2,
                "gravity": 9.8,
                "forces": [
                    {"name": "Applied Force (F_app)", "magnitude": 25, "direction": 0, "color": "#4F7CAC"},
                    {"name": "Friction Force (f_k)", "magnitude": 9.8, "direction": 180, "color": "#B76565"},
                    {"name": "Normal Force (N)", "magnitude": 49, "direction": 90, "color": "#5B9A7A"},
                    {"name": "Gravity Force (W)", "magnitude": 49, "direction": 270, "color": "#C58B3A"}
                ],
                "concept": concept
            }
        }

    # 2. Mathematics / Calculus / Algebra
    elif "math" in s or "calculus" in s or "algebra" in s or "equation" in c or "function" in c or "derivative" in e or "integral" in e or "graph" in e:
        return {
            "visual_type": "math_equation",
            "visual_data": {
                "equation": "f(x) = x^2 - 4x + 3" if "quad" in c else "\\frac{d}{dx}[\\sin(x)] = \\cos(x)" if "trig" in c else "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
                "title": f"Mathematical Model: {concept}",
                "graphType": "coordinate_curve",
                "domain": [-5, 5],
                "range": [-5, 10],
                "steps": [
                    {"step": "1. Identify variables and coefficients", "math": "a=1, b=-4, c=3"},
                    {"step": "2. Calculate critical points & vertex", "math": "x_{v} = -b/(2a) = 2"},
                    {"step": "3. Evaluate function value at vertex", "math": "f(2) = 2^2 - 4(2) + 3 = -1"},
                    {"step": "4. Determine roots", "math": "(x-1)(x-3) = 0 \\implies x=1, 3"}
                ]
            }
        }

    # 3. Biology / Medicine / Genetics
    elif "bio" in s or "cell" in c or "photosynthesis" in c or "dna" in c or "respiration" in e or "organ" in e or "gene" in e:
        return {
            "visual_type": "biology_diagram",
            "visual_data": {
                "diagramType": "photosynthesis_cycle" if "photo" in c or "plant" in e else "cell_organelles" if "cell" in c else "dna_helix",
                "title": f"Biological Pathway: {concept}",
                "keyStructures": [
                    {"name": "Chloroplast / Stroma", "function": "Light-independent Calvin cycle site", "color": "#5B9A7A"},
                    {"name": "Thylakoid Membrane", "function": "Light-dependent ATP/NADPH generation", "color": "#4F7CAC"},
                    {"name": "CO2 Input & RuBisCO", "function": "Carbon fixation catalyst", "color": "#C58B3A"},
                    {"name": "Glucose (C6H12O6)", "function": "Synthesized energy molecule", "color": "#8D9AA6"}
                ],
                "equation": "6CO_2 + 6H_2O + \\text{Light} \\xrightarrow{} C_6H_{12}O_6 + 6O_2"
            }
        }

    # 4. Computer Science / Programming
    elif "prog" in s or "code" in s or "python" in c or "algorithm" in c or "recursion" in c or "javascript" in c or "data structure" in s:
        return {
            "visual_type": "code_runner",
            "visual_data": {
                "language": "python",
                "title": f"Interactive Execution: {concept}",
                "code": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# Test execution\nresult = factorial(5)\nprint(f'5! = {result}')",
                "executionSteps": [
                    {"line": 1, "explanation": "Function defined with base condition check"},
                    {"line": 6, "explanation": "Call stack frame created: factorial(5)"},
                    {"line": 4, "explanation": "Recursive call: 5 * factorial(4)"},
                    {"line": 4, "explanation": "Stack unwinds to return 120"},
                    {"line": 7, "explanation": "Output generated to console: 5! = 120"}
                ],
                "consoleOutput": "5! = 120"
            }
        }

    # 5. Chemistry
    elif "chem" in s or "reaction" in c or "molecule" in c or "acid" in c or "bond" in e:
        return {
            "visual_type": "chemistry_visual",
            "visual_data": {
                "title": f"Chemical Reaction: {concept}",
                "reactionType": "molecular_mechanism",
                "reactants": ["2H_2 (g)", "O_2 (g)"],
                "products": ["2H_2O (l)"],
                "enthalpy": "\\Delta H = -572 \\text{ kJ/mol} \\text{ (Exothermic)}",
                "bonding": "Covalent polar bonds with 104.5° bond angle",
                "molecules": [
                    {"name": "Hydrogen Gas (H2)", "atoms": ["H", "H"], "color": "#4F7CAC"},
                    {"name": "Oxygen Gas (O2)", "atoms": ["O", "O"], "color": "#B76565"},
                    {"name": "Water (H2O)", "atoms": ["H", "O", "H"], "color": "#5B9A7A"}
                ]
            }
        }

    # 6. API / Postman / Web Development / HTTP
    elif "api" in s or "postman" in s or "http" in c or "rest" in c or "endpoint" in e or "request" in e or "json" in e or "postman" in c:
        return {
            "visual_type": "api_workflow",
            "visual_data": {
                "title": f"API Architecture & HTTP Workflow: {concept}",
                "method": "POST" if "post" in c or "create" in e else "PUT" if "put" in c or "update" in e else "DELETE" if "delete" in c else "GET",
                "endpoint": "https://api.edumitra.edu/v1/students/courses",
                "headers": {
                    "Authorization": "Bearer token_edumitra_auth",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "requestBody": "{\n  \"studentId\": \"std_402\",\n  \"course\": \"API Testing Mastery\",\n  \"action\": \"enroll\"\n}",
                "statusCode": 201 if "post" in c else 200,
                "statusText": "201 Created" if "post" in c else "200 OK",
                "responseBody": "{\n  \"success\": true,\n  \"message\": \"Request processed successfully\",\n  \"data\": {\n    \"enrollmentId\": \"enr_8832\",\n    \"status\": \"confirmed\"\n  }\n}",
                "workflowSteps": [
                    {"step": "Client Setup", "detail": "Constructs HTTP request with method, endpoint & headers"},
                    {"step": "Authorization", "detail": "Attaches Bearer token in request header"},
                    {"step": "Server Processing", "detail": "Validates JSON payload & executes business logic"},
                    {"step": "HTTP Response", "detail": "Returns status code (200/201) and parsed JSON response"}
                ]
            }
        }

    # 7. History / Geography / Social Sciences
    elif "history" in s or "timeline" in c or "war" in c or "century" in e or "revolution" in c or "geography" in s:
        return {
            "visual_type": "timeline",
            "visual_data": {
                "title": f"Chronological Progression: {concept}",
                "events": [
                    {"year": "Stage 1", "title": "Antecedent Conditions", "description": "Key factors and foundational context."},
                    {"year": "Stage 2", "title": "Trigger Event", "description": "Catalyst initiating transformative shift."},
                    {"year": "Stage 3", "title": "Institutional Transformation", "description": "Core conflict, reform, or structural development."},
                    {"year": "Stage 4", "title": "Long-Term Legacy", "description": "Enduring pedagogical & societal impacts."}
                ]
            }
        }

    # 8. General Concept Card Fallback
    else:
        return {
            "visual_type": "concept_card",
            "visual_data": {
                "title": concept or step_title or "Subject Principles",
                "formula": "",
                "unit": "",
                "points": [
                    "Fundamental principle & definition",
                    "Underlying operational mechanism",
                    "Real-world application and significance",
                    "Key distinction to remember"
                ]
            }
        }
