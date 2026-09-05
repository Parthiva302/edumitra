# EduMitra — Personal AI Teacher
> **Next-Generation Adaptive AI Pedagogical Platform with Grounded RAG, Subject-Aware Visualizations, and Dynamic Scene-Based Video Teaching**

Built from scratch for the AI Innovation Hackathon.

---

## 📖 Overview & Product Philosophy

Most AI educational tools are simply chatbots with a persona. **EduMitra** is fundamentally different: it is an authentic, full-stack **Personal AI Teacher** built upon an adaptive teaching loop:

```
UNDERSTAND ➔ PLAN ➔ EXPLAIN ➔ DEMONSTRATE ➔ QUESTION ➔ EVALUATE 
     ➔ ADAPT ➔ RE-EXPLAIN ➔ VERIFY ➔ CONTINUE ➔ ASSESS ➔ RECOMMEND
```

EduMitra generates personalized, dynamic lessons with real-time subject-aware visuals, active formative questioning, deep misconception diagnosis, and long-term student memory.

---

## 🎯 Two Primary Learning Modes

### 1. Mode A — Learn From My Material (Grounded RAG)
- **Supported Formats**: PDF, DOCX, PPTX, TXT.
- **Processing Pipeline**:
  1. Secure upload to Supabase Storage.
  2. Text & structural extraction (chapters, headings, definitions) using PyMuPDF and python-docx.
  3. Semantic chunking with document metadata preservation.
  4. Vector embeddings generated via Google `text-embedding-004` (768 dimensions).
  5. Vector storage and similarity indexing in PostgreSQL using `pgvector`.
  6. Grounded lesson planning & RAG question answering with citation references.
  7. Strict hallucination control: clearly identifies when information is sourced from the uploaded document vs. general knowledge.

### 2. Mode B — Learn Any Topic
- Learner requests any topic (e.g., *"Postman API Testing"*, *"Quantum Mechanics"*, *"Newton's Laws for Class 8"*).
- System scopes prerequisites, determines depth, generates a structured pedagogical sequence, and synthesizes interactive visualizations and assessments.

---

## 🧠 Core Pedagogical & Technical Architecture

```
                                    +------------------------------+
                                    |       Client Frontend        |
                                    |  React 19 + Vite + Tailwind  |
                                    +--------------+---------------+
                                                   |
                                            Express Proxy
                                          (port 5173 /api)
                                                   |
                                                   v
+-----------------------+           +------------------------------+           +-----------------------+
|  Google Gemini 2.5    |<--------->|       FastAPI Backend        |<--------->|  Supabase PostgreSQL  |
|  - Lesson Planning    |           |       (port 8000)            |           |  - Auth & Profiles    |
|  - Scene Narration    |           |  - Document Extraction       |           |  - pgvector (768-dim) |
|  - Evaluation Engine  |           |  - Semantic Chunker          |           |  - Storage Buckets    |
|  - Embeddings (004)   |           |  - Teaching Orchestration    |           |  - Row Level Security |
+-----------------------+           +------------------------------+           +-----------------------+
```

### 1. Subject-Aware Visual Engine
EduMitra includes 10 interactive, domain-specific visualizers dynamically driven by lesson scene plans:
1. **API & REST Flow** (`ApiWorkflowVisual.tsx`): Postman requests, headers, methods, status codes, and JSON responses.
2. **Water-Pipe Analogy** (`WaterPipeAnalogy.tsx`): Intuitive fluid dynamics analogy for electricity, networking, and queues.
3. **Circuit Simulator** (`CircuitSimulator.tsx`): Voltage, current, resistor, switch simulation.
4. **Physics Simulator** (`PhysicsSimulator.tsx`): Kinematics, forces, gravity, and trajectory plots.
5. **Chemistry Visual** (`ChemistryVisual.tsx`): Molecular bonds and reaction balancing.
6. **Biology Diagram** (`BiologyDiagram.tsx`): Cellular anatomy and physiological systems.
7. **Math Visualizer** (`MathVisualizer.tsx`): Coordinate plots and step-by-step calculus/algebra derivations.
8. **Code Runner** (`CodeRunnerVisual.tsx`): Real-time code execution with line-by-line syntax tracing.
9. **History Timeline** (`HistoryTimelineVisual.tsx`): Chronological eras, relationships, and events.
10. **Concept Card Visual** (`ConceptCardVisual.tsx`): Multi-level hierarchy cards and memory anchors.

### 2. Live AI-Scene-Driven Teaching Video Studio
- In-browser synthesized teaching video presentation generated directly from AI scene choreography (Teacher Intro ➔ Visual Model ➔ Explanation ➔ Diagnostic Check ➔ Summary).
- Synchronized Web Speech API audio with real boundary-driven avatar lip-sync, animated emotion states, and dynamic on-screen shot text overlays.
- Dynamic auto-advance pacing that automatically flows through teaching shots and pauses for active learner participation at formative question checkpoints.

### 3. Misconception Detection & Adaptive Remediation
- Rather than basic string comparison, answers are evaluated for conceptual grasp, partial credit, and underlying misconceptions.
- If a misconception is detected, EduMitra automatically branches:
  1. Explains the concept using an alternate analogy (e.g., technical -> real-world analogy).
  2. Switches the visualizer to an intuitive model (e.g., water-pipe model).
  3. Re-evaluates understanding with a targeted diagnostic question before progressing.

### 4. Comprehensive Post-Lesson Ecosystem
- **Structured Study Notes**: Key takeaways, definitions, and formulas.
- **Interactive Flashcards**: Spaced repetition cards generated from weak points.
- **Interactive Concept Map**: Visual branching dependency tree of learned concepts.
- **Adaptive Final Assessment**: Formative scoring, mastery breakdown, and next-topic recommendations.

---

## 🗄️ Database Schema & Security (Supabase)

All tables strictly enforce **Row Level Security (RLS)** to guarantee total user data isolation:
- `profiles`: Learner identity, education level, preferred language, and mastery.
- `materials`: Uploaded documents, metadata, processing status, and storage paths.
- `document_chunks`: Extracted text chunks with `embedding vector(768)`.
- `lessons`: Lesson plans, target duration (5m, 20m, 60m, 7d), and source mode.
- `lesson_steps`: Individual pedagogical steps, narration scripts, and visual scene plans.
- `questions`: Formative and diagnostic questions.
- `student_answers`: Evaluated answers, detected misconceptions, and scores.
- `concept_mastery`: Dynamic skill tree tracking learner proficiency.
- `lesson_notes`, `flashcards`, `learning_paths`, `learning_history`: Persistent learning artifacts.

Vector retrieval utilizes a custom PostgreSQL function (`match_document_chunks`) performing cosine similarity search filtered by `user_id` and `material_id`.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key
- Supabase Project URL & Service Role Key

### 1. Environment Configuration
Copy the configuration template and populate your keys:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004
FASTAPI_URL=http://127.0.0.1:8000
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
FastAPI server will start at `http://127.0.0.1:8000` (Interactive Swagger docs at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
From the root directory:
```bash
npm install
npm run dev
```
Full-stack EduMitra web application will launch at `http://localhost:5173`.

---

## 🧪 Verification & Automated Testing

Run the end-to-end platform verification suite covering all 8 pedagogical and RAG flows:
```bash
backend\venv\Scripts\python.exe backend\test_complete_platform.py
```

### Test Coverage:
1. **Health Check**: Validates Supabase and Gemini connectivity.
2. **Authentication**: Real Supabase token issuance and profile initialization.
3. **Lesson Creation**: Topic scoping, pedagogical steps, and visual engine mapping.
4. **Video Scene Planner**: Multi-scene generation with synchronized durations and narration.
5. **Evaluation Engine**: Semantic answer grading, misconception detection, and remediation.
6. **Live Q&A Interruption**: In-lesson contextual student inquiry handling.
7. **Post-Lesson Artifacts**: Synthesis of notes, flashcards, concept map, and assessments.
8. **Document RAG Pipeline**: Ingestion, vector embedding, similarity retrieval, and grounded citations.

---

## 🛡️ License & Compliance
This project was developed strictly adhering to academic integrity standards, real-world data isolation principles, and zero-mock AI architectures for educational empowerment.
