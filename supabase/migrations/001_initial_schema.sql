-- ==============================================================================
-- EDUMITRA - POSTGRESQL SCHEMA MIGRATION 001
-- Enable Extensions & Core Tables
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles Table (Users / Profiles)
-- Stores educational level, background knowledge, objectives, language, teaching style, depth
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'English',
    education_level TEXT DEFAULT 'Beginner',
    existing_knowledge TEXT DEFAULT 'Beginner',
    learning_goal TEXT DEFAULT 'understand_concept',
    learning_objective TEXT DEFAULT 'understand_concept',
    preferred_teaching_style TEXT DEFAULT 'simple_visual',
    teaching_style TEXT DEFAULT 'simple_visual',
    preferred_depth TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Documents Table
-- Tracks uploaded educational files and their processing pipeline states
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    title TEXT,
    file_type TEXT,
    file_url TEXT,
    file_size BIGINT DEFAULT 0,
    processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'indexed', 'failed', 'ready')),
    total_pages INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility view / table for materials if referenced by existing code
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size TEXT,
    storage_path TEXT,
    title TEXT,
    description TEXT,
    processing_status TEXT DEFAULT 'pending',
    processing_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Document Sections Table
CREATE TABLE IF NOT EXISTS document_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chapter_number INT,
    chapter_title TEXT,
    section_number INT,
    section_title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Document Chunks Table
-- Stores semantic text chunks and 768-dimensional Gemini vector embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    section_id UUID REFERENCES document_sections(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768),
    page_number INT DEFAULT 1,
    chapter TEXT,
    section TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user filtering on document chunks
CREATE INDEX IF NOT EXISTS idx_document_chunks_user_id ON document_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_doc_id ON document_chunks(document_id);

-- 6. Lessons Table
-- Tracks personalized teaching lessons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    title TEXT NOT NULL,
    language TEXT DEFAULT 'English',
    education_level TEXT DEFAULT 'Beginner',
    learner_level TEXT DEFAULT 'Beginner',
    duration_minutes INT DEFAULT 20,
    objective TEXT DEFAULT 'Understand foundational principles',
    learning_objective TEXT DEFAULT 'Understand foundational principles',
    difficulty TEXT DEFAULT 'intermediate',
    status TEXT DEFAULT 'in_progress',
    current_section INT DEFAULT 0,
    current_step INT DEFAULT 0,
    total_steps INT DEFAULT 0,
    progress_percentage INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_user_id ON lessons(user_id);

-- 7. Lesson Sections / Steps Table
-- Stores instructional sections, visualizations, and narration choreography
CREATE TABLE IF NOT EXISTS lesson_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    section_id TEXT,
    concept TEXT NOT NULL,
    explanation TEXT,
    example TEXT,
    visual_type TEXT DEFAULT 'concept_card',
    visual_data JSONB DEFAULT '{}'::jsonb,
    narration TEXT,
    order_index INT DEFAULT 0,
    estimated_duration INT DEFAULT 3,
    question_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility table for lesson_steps
CREATE TABLE IF NOT EXISTS lesson_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    concept TEXT,
    step_type TEXT,
    explanation TEXT,
    visual_type TEXT,
    visual_content JSONB DEFAULT '{}'::jsonb,
    source_reference TEXT,
    difficulty TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Questions Table
-- Stores formative and diagnostic questions mapped directly to concepts
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    lesson_step_id UUID REFERENCES lesson_steps(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    concept TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'mcq',
    question TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    expected_answer TEXT,
    explanation TEXT,
    difficulty TEXT DEFAULT 'intermediate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Student Answers Table
-- Stores student responses, semantic evaluation, and misconception diagnosis
CREATE TABLE IF NOT EXISTS student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    score INT DEFAULT 0,
    correct BOOLEAN DEFAULT FALSE,
    is_correct BOOLEAN DEFAULT FALSE,
    misconception_detected BOOLEAN DEFAULT FALSE,
    misconception TEXT,
    feedback TEXT,
    ai_evaluation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Learning Progress Table
-- Tracks mastery score (0-100) and learning status per concept
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    concept TEXT NOT NULL,
    mastery_score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    incorrect_answers INT DEFAULT 0,
    status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'LEARNING', 'NEEDS_REVIEW', 'MASTERED')),
    last_reviewed TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);

-- Compatibility table for concept_mastery
CREATE TABLE IF NOT EXISTS concept_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    concept TEXT NOT NULL,
    mastery_score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    incorrect_attempts INT DEFAULT 0,
    status TEXT DEFAULT 'learning',
    misconception TEXT,
    last_studied_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Assessments Table
-- Stores post-lesson comprehensive evaluations, strong/weak areas, and next recommendations
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    strong_concepts JSONB DEFAULT '[]'::jsonb,
    weak_concepts JSONB DEFAULT '[]'::jsonb,
    misconceptions JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    next_topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Learning Paths & Items
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    current_item INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_path_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    position INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'locked',
    mastery_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Study Notes & Flashcards
CREATE TABLE IF NOT EXISTS lesson_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    concept TEXT,
    difficulty TEXT,
    reviewed_count INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Learning History
CREATE TABLE IF NOT EXISTS learning_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    topic TEXT,
    action TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
