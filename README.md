# EduMitra — Personal AI Teacher Platform
> **Next-Generation Adaptive AI Pedagogical Platform with Grounded RAG, Subject-Aware Visualizations, and Dynamic Scene-Based Video Teaching**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase pgvector](https://img.shields.io/badge/Database-Supabase_pgvector-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 1. Overview & Pedagogical Philosophy

Most educational AI systems act merely as **chatbots with a persona** or **PDF question-answer bots**. They produce passive monologues, hallucinate unsourced claims, or simply stream generated scripts without measuring comprehension.

**EduMitra** is fundamentally engineered as an authentic **Personal AI Teacher** built upon an active, cognitive pedagogical loop:

```
  ┌───────────────────────────────────────────────────────────────────────────────┐
  │                           THE ACTIVE TEACHING LOOP                            │
  │                                                                               │
  │   UNDERSTAND ──► PLAN ──► EXPLAIN ──► DEMONSTRATE ──► QUESTION ──► EVALUATE   │
  │                                                                       │       │
  │      ┌────────────────────────────────────────────────────────────────┘       │
  │      ▼                                                                        │
  │   [Correct?] ──► YES ──► ADAPT (Increase Difficulty) ──► CONTINUE             │
  │      │                                                                        │
  │      └──► NO  ──► DETECT MISCONCEPTION ──► RE-EXPLAIN (Analogy) ──► RETRY     │
  │                                                                       │       │
  │      ┌────────────────────────────────────────────────────────────────┘       │
  │      ▼                                                                        │
  │   COMPLETE ──► COMPREHENSIVE ASSESSMENT ──► ADAPTIVE LEARNING PATH            │
  └───────────────────────────────────────────────────────────────────────────────┘
```

The system continuously assesses understanding, diagnoses underlying conceptual fallacies (rather than merely grading right/wrong), switches analogies and visual models dynamically, and guides students towards true mastery.

---

## 🏛️ 2. System Architecture

```
                                    +------------------------------+
                                    |       React 19 Client        |
                                    |  (Tailwind + Lucide + KaTeX) |
                                    +--------------+---------------+
                                                   |
                                            Express Proxy
                                        (Port 5173 ──► /api)
                                                   |
                                                   v
+-----------------------+           +------------------------------+           +-----------------------+
|   Google Gemini 2.5   |<--------->|       FastAPI Backend        |<--------->|  Supabase PostgreSQL  |
|  - gemini-2.5-flash   |   HTTPS   |       (Port 8000)            |   SQL /   |  - Auth & Profiles    |
|  - text-embedding-004 |           |  - Document Extraction       |   REST    |  - pgvector (768-dim) |
|  - Lesson Planner     |           |  - Semantic Chunker          |           |  - Vector Cosine RPC  |
|  - Evaluator & RAG    |           |  - State Machine Engine      |           |  - Row Level Security |
|  - Misconception AI   |           |  - Video Scene Orchestrator  |           |  - Tenant Isolation   |
+-----------------------+           +------------------------------+           +-----------------------+
```

### Backend Directory Structure
```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry & middleware
│   ├── config.py                # Pydantic environment settings
│   ├── api/
│   │   ├── auth.py              # User authentication & registration
│   │   ├── documents.py         # Ingestion, status, chunk counts
│   │   ├── rag.py               # Vector similarity search & grounded Q&A
│   │   ├── lessons.py           # Lesson creation & state advancement
│   │   ├── questions.py         # Formative question evaluation
│   │   ├── assessment.py        # Post-lesson diagnostic assessment
│   │   ├── progress.py          # Mastery scores & learning progress
│   │   ├── students.py          # Learner profile & personalization
│   │   ├── video.py             # Scene video generation & async jobs
│   │   └── learning_path.py     # Multi-stage curriculum path generation
│   ├── services/
│   │   ├── gemini.py            # Unified Google GenAI client (Gemini 2.5 Flash)
│   │   ├── embeddings.py        # Google text-embedding-004 (768-dim)
│   │   ├── document_processor.py# PyMuPDF/docx/pptx extraction & semantic chunking
│   │   ├── rag_service.py       # pgvector similarity search & grounded context
│   │   ├── lesson_planner.py    # Time-scoped & personalized lesson planner
│   │   ├── teaching_engine.py   # 9-state teaching state machine orchestrator
│   │   ├── question_generator.py# Bloom's taxonomy question synthesis
│   │   ├── evaluator.py         # Semantic answer grading & partial credit
│   │   ├── misconception_detector.py # 8-step cognitive remediation protocol
│   │   ├── adaptive_engine.py   # Mastery scoring & difficulty transitions
│   │   ├── visual_planner.py    # Subject-aware interactive visual mapping
│   │   └── video_generator.py   # Multi-scene choreography & job tracking
│   ├── prompts/                 # Specialized pedagogical prompt templates
│   ├── database/                # Supabase client & resilient schema fallback
│   └── schemas/                 # Pydantic v2 validation contracts
├── tests/                       # Pytest test suite (16 test cases)
└── requirements.txt             # Locked Python dependencies
```

---

## 📚 3. Production RAG Pipeline (pgvector 768-dim)

EduMitra implements a strict, enterprise-grade RAG pipeline that prevents hallucinations by grounding all explanations in student-provided materials.

```
UPLOAD DOCUMENT (PDF / DOCX / PPTX / TXT)
                  │
                  ▼
EXTRACT STRUCTURAL TEXT (PyMuPDF / python-docx / python-pptx)
                  │  Preserves: Page Numbers, Chapters, Headings, Code Blocks
                  ▼
SEMANTIC CHUNKING (Boundary-Aware: Chapters, Sections, Paragraphs)
                  │  Preserves Metadata: {page_number, chapter, section, chunk_index}
                  ▼
GENERATE 768-DIM VECTOR EMBEDDINGS (Google text-embedding-004)
                  │
                  ▼
POSTGRESQL + PGVECTOR INDEXING (HNSW / IVFFlat Cosine Similarity)
                  │
                  ▼
SIMILARITY SEARCH VIA RPC (`match_document_chunks`)
                  │  Filters: user_id (Tenant Isolation) + document_id (Optional)
                  ▼
GROUNDED CONTEXT INJECTION (Gemini 2.5 Flash)
                  │
                  ▼
AUTHENTIC TEACHING OUTPUT WITH PRECISE CITATIONS (Page, Chapter, Section)
```

### PostgreSQL Vector Search Function (`match_document_chunks`)
```sql
CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(768),
    user_id uuid,
    document_id uuid DEFAULT NULL,
    top_k int DEFAULT 5,
    similarity_threshold float DEFAULT 0.3
)
RETURNS TABLE (
    id uuid,
    document_id uuid,
    content text,
    page_number int,
    chapter text,
    section text,
    chunk_index int,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.content,
        dc.page_number,
        dc.chapter,
        dc.section,
        dc.chunk_index,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE dc.user_id = match_document_chunks.user_id
      AND (match_document_chunks.document_id IS NULL OR dc.document_id = match_document_chunks.document_id)
      AND (1 - (dc.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY dc.embedding <=> query_embedding ASC
    LIMIT top_k;
END;
$$;
```

---

## 🎯 4. Student Personalization & Time-Based Learning

EduMitra tailors every lesson before teaching begins using multidimensional learner profiles:

| Profile Dimension | Options / Values | Pedagogical Impact |
| :--- | :--- | :--- |
| **Education Level** | Elementary, Middle, High School, Undergraduate, Professional | Tunes vocabulary, prerequisite assumptions, and conceptual abstraction. |
| **Existing Knowledge** | None / Beginner / Intermediate / Advanced | Skips elementary definitions for advanced learners; scaffolds foundations for beginners. |
| **Learning Objective** | Exam Prep, Conceptual Mastery, Quick Overview, Interview Prep | Focuses on formula derivations, problem solving, or architectural trade-offs. |
| **Teaching Style** | Socratic, Analogy-Driven, First Principles, Step-by-Step Practical | Drives prompt style: Socratic inquiry vs. physical metaphors vs. code walkthroughs. |
| **Language** | English, Hindi (हिन्दी), Hinglish, Telugu (తెలుగు), Tamil, etc. | Natural bilingual explanation; sources can be in English while teaching in Hindi. |

### Time-Based Teaching Modes
- **⚡ 5 Minutes (Flash Overview)**: Concentrates exclusively on the highest-priority core mental models. Skips tangential derivations; pairs 1 interactive visual with 1 diagnostic checkpoint.
- **⏱️ 20 Minutes (Core Mastery)**: Complete 5-step curriculum: Concept ➔ Real-World Metaphor ➔ Visual Simulation ➔ Formative Questions ➔ Misconception Resolution.
- **🔬 60 Minutes (Deep Dive & Practical Lab)**: Exhaustive derivations, edge cases, interactive sandbox simulations, code execution, and multi-question diagnostic assessments.
- **📅 7 Days (Curriculum Learning Path)**: Structured day-by-day syllabus with spaced repetition, interleaved topics, flashcards, and cumulative milestone tests.

---

## 🧠 5. AI Teaching State Machine & Misconception Remediation

The teaching engine is governed by a deterministic 9-state machine:

```
[1. UNDERSTAND] ──► Analyzes student goals, RAG context, and prior weak concepts.
[2. PLAN]       ──► Synthesizes structured JSON lesson plan with timing and visual mapping.
[3. EXPLAIN]    ──► Delivers multi-modal teaching narrative tailored to student language.
[4. DEMONSTRATE]──► Triggers subject-aware interactive visualizers (circuits, timelines, code).
[5. QUESTION]   ──► Formative evaluation checkpoint testing underlying causal understanding.
[6. EVALUATE]   ──► Semantic scoring (0-100), partial credit, and misconception isolation.
[7. ADAPT]      ──► If misconception detected: branches to 8-step cognitive remediation.
[8. CONTINUE]   ──► Advances to next pedagogical section upon verified understanding.
[9. COMPLETE]   ──► Synthesizes comprehensive diagnostic assessment and updates mastery graph.
```

### The 8-Step Cognitive Remediation Protocol
When a student answers incorrectly (e.g., answering *"Current increases"* when resistance rises at constant voltage):
1. **Never say merely "Incorrect"**: Validate the student's intuition and identify where their mental model diverged.
2. **Diagnose Underlying Fallacy**: Identifies whether the error is inverse-proportionality confusion, sign error, or prerequisite omission.
3. **Switch Analogies**: Replaces technical definitions with tangible real-world analogies (e.g., switches to the **Water-Pipe constriction model**).
4. **Switch Visualizer**: Activates interactive simulator illustrating the bottleneck in real time.
5. **Formulate Simpler Step**: Asks a targeted, lower-cognitive-load question isolating the single variable.
6. **Re-evaluate**: Verifies the mental model has updated before increasing difficulty.
7. **Reinforce**: Highlights the connection between the analogy and the formal scientific law.
8. **Log to Profile**: Records misconception in `learning_progress` to reinforce during future revision sessions.

---

## 🎨 6. Subject-Aware Visual Engine

EduMitra renders deterministic, interactive simulations dynamically matched to the lesson subject:

| Visualizer Component | Subject Domain | Dynamic Capabilities |
| :--- | :--- | :--- |
| **Circuit Simulator** (`CircuitSimulator.tsx`) | Physics / Electronics | Live interactive circuit with battery voltage slider, resistor controls, switch toggles, dynamic electron flow, and Ohm's law meter ($V = IR, P = VI$). |
| **Water-Pipe Analogy** (`WaterPipeAnalogy.tsx`) | Physics / Metaphors | Fluid dynamics simulation representing voltage as pump pressure, current as gallons/sec, and resistance as pipe constriction. |
| **Physics Kinematics** (`PhysicsSimulator.tsx`) | Mechanics | Gravity, launch angle, initial velocity controls with real-time parabolic trajectory plotting and kinematic formulas ($v = u + at, s = ut + \frac{1}{2}at^2$). |
| **API & REST Flow** (`ApiWorkflowVisual.tsx`) | Computer Science | Interactive Postman-style workbench with Method/Endpoint selection, headers, JSON body payloads, and real-time response status/latencies. |
| **Code Runner Tracing** (`CodeRunnerVisual.tsx`) | Programming | Multi-language syntax highlighting (Python, JS, C++) with step-by-step call stack execution tracing and variable state inspector. |
| **Chemistry Visual** (`ChemistryVisual.tsx`) | Chemistry | 2D/3D molecular bond builder, orbital valence counts, and chemical equation reaction balancer. |
| **Biology Diagram** (`BiologyDiagram.tsx`) | Life Sciences | SVG anatomical diagrams with interactive callout labels, cell organelle zoom, and physiological process workflows. |
| **Math Derivations** (`MathVisualizer.tsx`) | Mathematics | KaTeX LaTeX mathematical typography rendering with step-by-step algebraic derivations and 2D function graphing. |
| **History Timeline** (`HistoryTimelineVisual.tsx`) | Humanities | Chronological timeline cards with era filters, event causality linkages, and primary-source quote cards. |
| **Concept Hierarchy Card** (`ConceptCardVisual.tsx`) | General Disciplines | Multi-tiered conceptual dependency tree illustrating prerequisites, core axioms, and real-world applications. |

---

## 🎬 7. Video Teacher & Scene Architecture

Rather than attempting to generate fragile monolithic video files, EduMitra employs an asynchronous, scene-choreographed presentation studio:

```json
{
  "scenes": [
    {
      "scene_id": "scene_1_intro",
      "title": "Introduction to Electrical Current",
      "narration": "Welcome! Today we are exploring electric current—the actual flow of electrical charge through a conductor.",
      "visual": { "type": "concept_card", "content": { "title": "Electric Current (I)", "unit": "Amperes (A)" } },
      "on_screen_text": "Electric Current: Flow of Charge per Second (I = Q/t)",
      "duration": 12,
      "interaction_required": false
    },
    {
      "scene_id": "scene_2_simulation",
      "title": "Interactive Circuit Demonstration",
      "narration": "Observe how increasing the resistor value constricts electron flow when the battery voltage remains 12 Volts.",
      "visual": { "type": "circuit_simulation", "content": { "voltage": 12, "resistance": 20 } },
      "on_screen_text": "Ohm's Law in Action: Current Decreases as Resistance Increases",
      "duration": 18,
      "interaction_required": false
    },
    {
      "scene_id": "scene_3_checkpoint",
      "title": "Formative Understanding Check",
      "narration": "Let us pause and test your intuition before we proceed.",
      "visual": { "type": "quiz_card", "content": { "concept": "Resistance" } },
      "on_screen_text": "Checkpoint: What happens if resistance doubles?",
      "duration": 10,
      "interaction_required": true
    }
  ]
}
```

### Video Teacher Features
- **Boundary-Synchronized Avatar Lip-Sync**: Synthesizes speech via the Web Speech API with word-boundary listeners, synchronizing mouth movements, eye blinks, and emotional expressions (encouraging, thoughtful, celebratory).
- **Interactive Pauses**: Automatically pauses playback at formative question scenes, prompting the student to answer before progressing.
- **Asynchronous Video Job API**: Supported via `POST /api/video/generate` and `GET /api/video/{job_id}/status` with automatic failure retries.

---

## 🌐 8. Multilingual Teaching Engine

EduMitra decouples the **Source Document Language** from the **Target Teaching Language**:

```
English Textbook PDF ──► Grounded RAG Retrieval ──► Gemini Multilingual Orchestrator ──► Hindi Teaching (हिन्दी)
```

- **Supported Languages**: English, Hindi (`hi`), Hinglish (`hi-En`), Telugu (`te`), Tamil (`ta`), Kannada (`kn`), Marathi (`mr`), Bengali (`bn`), Spanish (`es`), French (`fr`), German (`de`).
- **Dynamic Language Switching**: Learners can switch languages mid-lesson (e.g., English ➔ Hinglish ➔ Telugu) without resetting lesson progression, concept scores, or visual simulation states.

---

## 🔌 9. REST API Specification

| Method | Endpoint | Description | Request Payload / Params | Response Summary |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/documents/upload` | Ingest PDF, DOCX, PPTX, TXT into 768-dim pgvector | `multipart/form-data` (file) | `{ id, filename, total_pages, chunk_count, status }` |
| `GET` | `/api/documents` | List user documents with chunk counts & status | None (Header: Bearer Token) | `Array<{ id, filename, processing_status, ... }>` |
| `GET` | `/api/documents/{id}` | Inspect document processing status & details | Path param: `id` | `{ id, filename, processing_status, chunk_count }` |
| `POST` | `/api/rag/search` | Execute isolated pgvector cosine similarity search | `{ query, top_k?, document_id? }` | `{ results: Array<{ content, page, chapter, similarity }> }` |
| `POST` | `/api/lessons/create` | Generate structured, personalized lesson | `{ topic, document_id?, duration_minutes, education_level, ... }` | `{ id, title, sections, visual_type, duration }` |
| `GET` | `/api/lessons/{id}` | Retrieve lesson plan, current step, and status | Path param: `id` | `{ id, title, current_step, sections, status }` |
| `POST` | `/api/lessons/{id}/next` | Advance 9-state teaching machine | `{ current_step, last_answer_correct? }` | `{ current_state, next_section, narration, visual }` |
| `POST` | `/api/questions/{id}/answer`| Evaluate student answer & detect misconceptions | `{ answer, question_id, concept, expected_answer }` | `{ correct, score, misconception_detected, misconception, feedback, recommended_action }` |
| `POST` | `/api/assessment/{lesson_id}`| Generate comprehensive diagnostic assessment | Path param: `lesson_id` | `{ score, strong_concepts, weak_concepts, misconceptions, recommended_revision, next_topic }` |
| `GET` | `/api/progress` | Retrieve student mastery matrix & skill status | None (Header: Bearer Token) | `Array<{ topic, concept, mastery_score, status }>` |
| `GET` | `/api/profile` | Retrieve personalized learner preferences | None (Header: Bearer Token) | `{ education_level, teaching_style, preferred_language, ... }` |
| `PUT` | `/api/profile` | Update learner profile preferences | `{ education_level, preferred_language, teaching_style }` | Updated profile object |
| `POST` | `/api/video/generate` | Dispatch asynchronous scene video generation | `{ lesson_id, scene_count }` | `{ job_id, status: "processing" }` |
| `GET` | `/api/video/{job_id}/status` | Poll status of asynchronous video job | Path param: `job_id` | `{ job_id, status: "completed" \| "processing", video_url }` |
| `POST` | `/api/learning-path/create`| Synthesize multi-stage mastery curriculum | `{ topic, goal, current_level, target_days }` | `{ path_id, topic, stages: Array<{ title, concepts, days }> }` |

---

## 🏆 10. Judge Demo Mode Walkthrough

A turnkey, 1-click evaluation flow designed specifically for hackathon judges:

1. **Quick Launch**: On the Landing Page, click the prominent **"Judge Demo Mode"** button in the hero section or top navigation bar.
2. **Step 1 — Document Ingestion & RAG Verification**: Automatically seeds a real physics curriculum document (*"Chapter 4: Electric Current, Voltage & Ohm's Law"*), extracts sections, generates 768-dim embeddings, and indexes chunks into PostgreSQL.
3. **Step 2 — Student Personalization**: Configures student persona: *Education Level: Beginner*, *Language: Hinglish*, *Duration: 20 Minutes*, *Teaching Style: Analogy-Driven*.
4. **Step 3 — Structured Lesson Plan**: Displays the 5-step curriculum generated by Gemini: Concept ➔ Water-Pipe Analogy ➔ Interactive Circuit Simulator ➔ Formative Checkpoint ➔ Ohm's Law Formula.
5. **Step 4 — Video Teacher & Avatar Presentation**: Launches virtual classroom with speech synthesis, synchronized lip-sync, and on-screen shot text.
6. **Step 5 — Interactive Simulation**: Engages the interactive **Circuit Simulator** visualizer; judges can adjust battery voltage (12V) and resistance (20Ω) to inspect real-time current readouts.
7. **Step 6 — Active Questioning**: Teacher halts playback and asks: *"If battery voltage remains constant at 12V and resistance increases from 10Ω to 20Ω, what happens to current?"*
8. **Step 7 — Misconception Detection in Action**: Submit the intentional incorrect answer: *"Current increases because there is more resistance."* Watch EduMitra immediately diagnose the inverse-proportionality misconception, switch analogies to the **Water-Pipe model**, and re-teach.
9. **Step 8 — Adaptive Simpler Question**: Teacher asks a simplified single-variable question. Submit the correct answer (*"Current decreases"*). EduMitra elevates mastery and advances to the next section.
10. **Step 9 — Final Assessment & Learning Dashboard**: Review comprehensive diagnostic report: Formative score (85%), strong concepts, diagnosed misconceptions, spaced repetition flashcards, interactive concept map, and recommended next topic (*"Series and Parallel Circuits"*).

---

## ⚙️ 11. Local Setup & Deployment

### Prerequisites
- Node.js (v18.0+)
- Python (v3.10+)
- Supabase Project with `pgvector` enabled
- Google Gemini API Key

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```ini
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
FASTAPI_URL=http://127.0.0.1:8000
USE_MOCK_AI=false
```

### 2. Run Database Migrations
Execute the SQL migration scripts in your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql` (Tables, constraints, vector column)
2. `supabase/migrations/002_vector_search.sql` (`match_document_chunks` RPC function)
3. `supabase/migrations/003_rls.sql` (Row Level Security policies)

### 3. Start Backend Server
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
Backend runs at `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`).

### 4. Start Frontend Client
From the project root:
```bash
npm install
npm run dev
```
Full-stack application will open at `http://localhost:5173`.

---

## 🧪 12. Automated Test Suite

Run the comprehensive pytest suite covering all 16 acceptance criteria:
```bash
cd backend
pytest tests -v
```

Run the complete end-to-end integration test:
```bash
python test_complete_platform.py
```

---

## 🔒 13. Security & Third-Party Disclosures

- **Google Gemini API**: Utilized exclusively for LLM orchestration (`gemini-2.5-flash`) and vector embeddings (`text-embedding-004`). No student data is used to train foundation models.
- **Supabase PostgreSQL**: Enforces Row Level Security (RLS) on all tables; cross-user document retrieval is strictly prevented at the database engine level via `auth.uid()` and `match_document_chunks` user filtering.
- **Zero Client-Side Secret Leakage**: All API keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are kept exclusively on the FastAPI backend; the frontend communicates via secure JWT session tokens.

---

## 📄 14. License

Distributed under the MIT License. Developed with pride for the AI Innovation Hackathon.
