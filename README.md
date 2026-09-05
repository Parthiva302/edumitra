# EduMitra — Personal AI Teacher Platform
> **Next-Generation Adaptive AI Pedagogical Platform with Grounded RAG, Subject-Aware Visualizations, and Dynamic Scene-Based Video Teaching**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase pgvector](https://img.shields.io/badge/Database-Supabase_pgvector-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📑 Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [Key Features](#3-key-features)
4. [System Architecture](#4-system-architecture)
5. [AI/ML Models Used](#5-aiml-models-used)
6. [RAG Implementation](#6-rag-implementation)
7. [Prompt & Agent Architecture](#7-prompt--agent-architecture)
8. [Personalization Approach](#8-personalization-approach)
9. [Assessment Methodology](#9-assessment-methodology)
10. [Multilingual Implementation](#10-multilingual-implementation)
11. [Voice Implementation](#11-voice-implementation)
12. [Avatar & Video Generation Approach](#12-avatar--video-generation-approach)
13. [APIs & Third-Party Services](#13-apis--third-party-services)
14. [Setup Instructions](#14-setup-instructions)
15. [Deployment Instructions](#15-deployment-instructions)
16. [Known Limitations](#16-known-limitations)
---

## 1. Problem Statement

Most modern educational technology platforms suffer from fundamental pedagogical deficiencies:

1. **The "Chatbot Disguised as a Teacher" Trap**: Existing AI learning tools are essentially generic conversational chatbots (e.g. standard ChatGPT wrappers). They deliver massive textual monologues without checking whether the learner understands, lacks prerequisite knowledge, or is overwhelmed.
2. **Passive PDF Q&A**: Conventional RAG systems act merely as semantic search engines answering queries from documents. They do not teach, structure a curriculum, or facilitate progressive cognitive mastery.
3. **Absence of Misconception Diagnosis**: Standard grading engines rely on simplistic keyword checks or binary "Right/Wrong" evaluations. They fail to identify *why* a student answered incorrectly, failing to diagnose underlying conceptual errors (such as confusing inverse proportionality with direct proportionality).
4. **Static Monolithic Video Generation**: Existing video generators attempt to generate 10-to-20 minute videos as single opaque video files. These videos are non-interactive, prohibit live student interruption, cannot adapt dynamically mid-stream to student confusion, and take minutes or hours to render.
5. **One-Size-Fits-All Pacing**: Content is not adapted to student time constraints (e.g., needing a 5-minute pre-exam flash recap vs. a 60-minute first-principles derivation) or linguistic background (e.g., understanding concepts in Hinglish or Telugu while studying English textbooks).

---

## 2. Solution Overview

**EduMitra** is engineered from first principles as an authentic **Personal AI Teacher** rather than a chatbot. It is anchored in an active, cognitive pedagogical loop:

```
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                         THE ACTIVE PEDAGOGICAL LOOP                             │
  │                                                                                 │
  │   UNDERSTAND ──► PLAN ──► EXPLAIN ──► DEMONSTRATE ──► QUESTION ──► EVALUATE     │
  │                                                                         │       │
  │      ┌──────────────────────────────────────────────────────────────────┘       │
  │      ▼                                                                          │
  │   [Correct?] ──► YES ──► ADAPT (Increase Difficulty) ──► CONTINUE               │
  │      │                                                                          │
  │      └──► NO  ──► DETECT MISCONCEPTION ──► RE-EXPLAIN (Analogy) ──► RETRY       │
  │                                                                         │       │
  │      ┌──────────────────────────────────────────────────────────────────┘       │
  │      ▼                                                                          │
  │   COMPLETE ──► COMPREHENSIVE ASSESSMENT ──► ADAPTIVE LEARNING PATH              │
  └─────────────────────────────────────────────────────────────────────────────────┘
```

Instead of passive video streaming, EduMitra choreographs lessons into interactive scenes. An AI teacher avatar narrates concepts using natural synchronized speech, switches between 10 interactive visual simulation engines (circuits, fluid models, kinematic graphs, code tracing), periodically halts playback to verify understanding with Bloom's taxonomy questions, and dynamically rewrites its teaching strategy when misconceptions arise.

---

## 3. Key Features

- **Pedagogical State Machine**: Deterministic 9-state teaching engine (`UNDERSTAND`, `PLAN`, `EXPLAIN`, `DEMONSTRATE`, `QUESTION`, `EVALUATE`, `ADAPT`, `CONTINUE`, `COMPLETE`).
- **Grounded 768-Dim RAG**: Ingests PDFs, Word DOCX, PowerPoint PPTX, and text notes. Uses Google `text-embedding-004` and PostgreSQL `pgvector` with strict multi-tenant Row Level Security (RLS).
- **8-Step Cognitive Remediation**: Isolates root-cause misconceptions, swaps technical definitions for real-world physical metaphors (e.g., water pipe constriction for electrical resistance), and re-evaluates before progressing.
- **Subject-Aware Visual Engine (10 Simulators)**:
  - *Physics/Circuits*: Real-time Ohm's Law circuit simulator with live electron animation.
  - *Analogy Models*: Fluid dynamics water-pipe simulation for voltage/current/resistance.
  - *Mechanics*: Kinematics projectile simulator with parabolic trajectory tracing.
  - *Computer Science*: Interactive Postman-style REST API workbench and step-by-step code execution tracer.
  - *Natural Sciences*: Molecular chemistry bond balancer and zoomable SVG biology cell anatomy.
  - *Mathematics*: KaTeX-rendered step-by-step formula derivations and function graphing.
  - *Humanities*: Interactive chronological history timelines.
- **Scene-Based Interactive Video Studio**: Asynchronous scene choreography with dynamic on-screen shot text, word-boundary lip-sync, and automatic question pauses.
- **Time-Based Adaptive Depth**: 5-minute flash summaries, 20-minute core lessons, 60-minute practical labs, and 7-day structured revision plans.
- **Multilingual Support**: Decoupled document language from teaching language (supports English, Hindi, Hinglish, Telugu, Tamil, etc.).
- **Long-Term Memory & Learning Analytics**: Dynamic mastery scoring (0-100), automated study notes, spaced-repetition flashcards, and interactive concept dependency maps.
- **Turnkey Judge Demo Mode**: 1-click evaluation flow designed specifically for hackathon evaluation.

---

## 4. System Architecture

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

### Architecture Components & Workflow
1. **Frontend Layer (React 19 + TypeScript)**: Built with Vite, Tailwind CSS, Lucide icons, KaTeX LaTeX math rendering, and Web Speech API audio-visual synchronization.
2. **API Gateway / Proxy (Express `server.ts`)**: Serves the Single Page Application and proxies all `/api/*` traffic directly to the FastAPI backend on port 8000.
3. **Backend Service Layer (FastAPI)**: Implements asynchronous Python endpoints for document extraction, vector ingestion, lesson generation, state machine progression, evaluation, and background video job tracking.
4. **AI Intelligence Layer (Google Gemini 2.5 Flash)**: Primary LLM orchestrator handling semantic document chunking, lesson planning, question generation, answer evaluation, and cognitive misconception detection.
5. **Database & Vector Store (Supabase PostgreSQL + pgvector)**: Stores relational application data (users, profiles, lessons, sections, progress, assessments) and performs cosine similarity vector searches via PostgreSQL RPC functions.

---

## 5. AI/ML Models Used

| Model | Purpose | Dimensions / Context | Rationale |
| :--- | :--- | :--- | :--- |
| **`gemini-2.5-flash`** | Primary LLM Orchestrator | 1,000,000+ tokens context | Ultra-fast inference latency (~500ms), robust JSON mode adherence, superior pedagogical reasoning, and multi-turn Socratic dialogue capability. |
| **`text-embedding-004`** | Document Vector Embeddings | 768 dimensions | High semantic retrieval density, optimized for technical and academic texts, native integration with Google GenAI SDK. |
| **`veo-2.0-generate-001`** *(Optional/Video)* | High-Fidelity Scene Clips | 16:9 / 1080p | High-aesthetic scene b-roll generation for complex physical demonstrations when video rendering is invoked. |

---

## 6. RAG Implementation

EduMitra enforces a strict, production-ready Retrieval-Augmented Generation pipeline to ground all document-based teaching and prevent hallucinations.

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

### Chunking Strategy
Unlike naive fixed-character splitters that sever formulas or code snippets mid-sentence, EduMitra uses **semantic boundary chunking**:
- Segments at chapter, section, subsection, and paragraph boundaries.
- Preserves document hierarchy and metadata:
  ```json
  {
    "page_number": 42,
    "chapter": "Chapter 4: Electricity",
    "section": "Ohm's Law & Resistance",
    "chunk_index": 17
  }
  ```

### Vector Search PostgreSQL RPC (`match_document_chunks`)
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

## 7. Prompt & Agent Architecture

The backend prompt system is split into specialized, single-responsibility pedagogical modules located in `backend/app/prompts/`:

### 1. `teacher.py` (Teaching Persona & Dialogue Engine)
- Establishes the authoritative yet warm Socratic teacher persona.
- Mandates first-principles reasoning, intuitive analogies before mathematical formulas, and active student engagement.
- Enforces tone and vocabulary adaptation based on the student's education level.

### 2. `lesson_planner.py` (Curriculum & Visual Dispatcher)
- Synthesizes duration-scoped JSON curricula (5m, 20m, 60m, 7d).
- Determines optimal visualizer types (`circuit_simulator`, `water_pipe_analogy`, `physics_simulator`, `api_workflow`, `code_runner`, etc.).
- Allocates precise time budgets per section.

### 3. `evaluator.py` (Semantic Rubric & Partial Credit)
- Evaluates student responses conceptually rather than using literal string matching.
- Returns structured JSON:
  ```json
  {
    "correct": false,
    "score": 35,
    "concept_understood": false,
    "misconception_detected": true,
    "misconception": "Confuses inverse proportionality with direct proportionality",
    "feedback": "You noticed that current changes, but let us look at the direction of change...",
    "recommended_action": "REEXPLAIN",
    "next_difficulty": "BEGINNER"
  }
  ```

### 4. `misconception.py` (8-Step Cognitive Remediation)
- Deconstructs the student's flawed mental model.
- Generates an alternate real-world metaphor (e.g., constricting a garden hose).
- Synthesizes a simplified single-variable diagnostic question to re-establish confidence.

### 5. `question_generator.py` (Bloom's Taxonomy Generator)
- Generates MCQs, conceptual questions, problem-solving prompts, and open-ended "explain in your own words" challenges mapped directly to specific concepts.

---

## 8. Personalization Approach

Before any teaching session starts, EduMitra constructs a multidimensional learner profile:

| Profile Attribute | Configurable Values | Pedagogical Impact |
| :--- | :--- | :--- |
| **Education Level** | Elementary, Middle School, High School, Undergraduate, Professional | Controls vocabulary, prerequisite knowledge assumptions, and formal rigor. |
| **Existing Knowledge** | None / Beginner / Intermediate / Advanced | Skips elementary definitions for advanced learners; reinforces fundamentals for beginners. |
| **Learning Objective** | Exam Preparation, Conceptual Mastery, Quick Overview, Interview Prep | Prioritizes formula derivations, practical problem solving, or architecture trade-offs. |
| **Teaching Style** | Socratic, Analogy-Driven, First Principles, Step-by-Step Practical | Drives prompt style: probing questions vs. physical metaphors vs. code walkthroughs. |
| **Available Duration** | 5 Minutes, 20 Minutes, 60 Minutes, 7 Days | Scopes depth from high-yield flashcards to multi-stage simulation laboratories. |

---

## 9. Assessment Methodology

EduMitra abandons traditional high-stakes testing in favor of **continuous formative assessment**:

1. **In-Lesson Formative Checkpoints**: Every pedagogical section concludes with a diagnostic question checking concept retention.
2. **Adaptive Difficulty Scaling**:
   - `0 – 40` (Needs Review): Re-explain with simpler visual analogy, reduce question cognitive load.
   - `41 – 70` (Learning): Provide guided practice with hints.
   - `71 – 85` (Good Understanding): Introduce multi-step problems.
   - `86 – 100` (Mastered): Elevate to edge cases, synthesis, and transfer learning.
3. **Comprehensive Post-Lesson Assessment (`POST /api/assessment/{lesson_id}`)**:
   - Evaluates overall mastery percentage.
   - Identifies specific **Strong Concepts** and **Weak Concepts**.
   - Logs identified **Misconceptions**.
   - Generates actionable **Recommended Revision** action items.
   - Proposes the **Next Logical Topic** to study.

---

## 10. Multilingual Implementation

EduMitra features a **decoupled language architecture**:
- **Source Material Independence**: The uploaded textbook or notes can be written in English, yet the AI Teacher can deliver explanations in Hindi, Hinglish, Telugu, Tamil, or Spanish.
- **Supported Languages**: English, Hindi (`hi`), Hinglish (`hi-En`), Telugu (`te`), Tamil (`ta`), Kannada (`kn`), Marathi (`mr`), Bengali (`bn`), Spanish (`es`), French (`fr`), German (`de`).
- **Zero-Loss Language Switching**: Students can switch the teaching language dynamically mid-lesson without losing lesson progress, concept mastery scores, or visual simulation states.

---

## 11. Voice Implementation

- **Web Speech API Integration**: Leverages the browser's native speech synthesis engine for zero-latency, high-fidelity vocal delivery.
- **Word-Boundary Lip-Sync**: Uses `SpeechSynthesisUtterance.onboundary` events to drive synchronized avatar mouth movement, blinking cycles, and emotional reactions in real time.
- **Modular Audio Pipeline**: Narration text is generated for every scene by the backend. The architecture allows external high-end TTS providers (ElevenLabs, Google Cloud Text-to-Speech) to be plugged in via environment variables without modifying the core state machine.

---

## 12. Avatar & Video Generation Approach

### Why Scene-Based Video Rather Than Monolithic Files?
Monolithic video rendering (e.g. generating a single 15-minute MP4) takes minutes to render, cannot be interrupted by the student, fails to adapt to student confusion, and prevents live interaction with visual widgets.

EduMitra solves this with an **Asynchronous Scene-Choreographed Studio**:
- Lessons are partitioned into discrete, structured scenes (Teacher Intro, Concept Demonstration, Visual Simulation, Worked Example, Formative Checkpoint, Feedback Adaptation, Summary).
- Each scene is represented as structured JSON:
  ```json
  {
    "scene_id": "scene_02_simulation",
    "title": "Interactive Circuit Demonstration",
    "narration": "Notice how increasing resistance reduces the rate of electron flow...",
    "visual": { "type": "circuit_simulation", "content": { "voltage": 12, "resistance": 20 } },
    "on_screen_text": "Ohm's Law: I = V / R",
    "duration": 15,
    "interaction_required": false
  }
  ```
- **Interactive Checkpoints**: When `interaction_required` is true, video playback pauses automatically, requiring the student to answer the teacher's question before continuing.
- **Asynchronous Video Job API**: Supported via `POST /api/video/generate` and `GET /api/video/{job_id}/status` with automatic failure retries.

---

## 13. APIs and Third-Party Services

| Service | Provider | Role in EduMitra | Credentials Required |
| :--- | :--- | :--- | :--- |
| **Google Gemini 2.5 Flash** | Google AI Studio | Lesson planning, dialogue orchestration, answer evaluation, misconception diagnosis | `GEMINI_API_KEY` |
| **Google text-embedding-004** | Google AI Studio | 768-dimensional document vector embeddings | `GEMINI_API_KEY` |
| **PostgreSQL 15+ & pgvector** | Supabase | Relational data, user authentication, vector cosine similarity search | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Supabase Storage** | Supabase | Secure encrypted storage of uploaded documents | `SUPABASE_SERVICE_ROLE_KEY` |
| **Web Speech API** | Browser Native | Text-to-speech audio synthesis and word-boundary event dispatch | *None (Client Native)* |

---

## 14. Setup Instructions

### Prerequisites
- Node.js (v18.0 or higher)
- Python (v3.10 or higher)
- Supabase account with a new project
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Parthiva302/edumitra.git
cd edumitra
```

### 2. Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```
Edit `.env` with your credentials:
```ini
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
GEMINI_VIDEO_MODEL=veo-2.0-generate-001
FASTAPI_URL=http://127.0.0.1:8000
USE_MOCK_AI=false
```

### 3. Run Supabase Database Migrations
In your Supabase project dashboard, navigate to the **SQL Editor** and run the migration scripts in order:
1. `supabase/migrations/001_initial_schema.sql` (Tables, vector column, foreign keys)
2. `supabase/migrations/002_vector_search.sql` (`match_document_chunks` RPC function)
3. `supabase/migrations/003_rls.sql` (Row Level Security policies)

### 4. Install Backend Dependencies & Start FastAPI
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*The FastAPI backend will start at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### 5. Install Frontend Dependencies & Start Client
Open a second terminal in the project root:
```bash
npm install
npm run dev
```
*The React application will be accessible at `http://localhost:5173`.*

---

## 15. Deployment Instructions

### Production Frontend Build
```bash
npm run build
```
This bundles the React client into `dist/` and builds the Express server into `dist/server.cjs`.

### Running in Production (Node.js Server)
```bash
node dist/server.cjs
```

### Deploying Backend (Docker / Render / Railway / AWS EC2)
Use the provided `Dockerfile` or deploy directly:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Security Checklist
- Set `USE_MOCK_AI=false` in production.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are kept strictly in backend environment secrets and never bundled in client builds.
- Configure CORS origins in `backend/app/main.py` to match your production domain.

---

## 16. Known Limitations

1. **Browser Speech Voice Availability**: The Web Speech API depends on the voices installed on the student's operating system. On some Linux distributions, high-quality multilingual neural voices (e.g. native Telugu or Hindi) may require installing additional TTS voice packs.
2. **Document File Size Limits**: Ingestion is currently optimized for documents under 50MB and 200 pages. For massive textbooks (1,000+ pages), background chunking should be executed via a dedicated worker queue (e.g., Celery/Redis).
3. **Gemini Free-Tier Rate Limits**: When using Google AI Studio free-tier API keys, Google enforces a limit of 15 requests per minute. EduMitra includes automated retry and backoff logic, but high concurrent usage requires a paid billing tier.

---

## 📄 License

Distributed under the MIT License. Developed with pride for the AI Innovation Hackathon.
