-- EduMitra PostgreSQL Schema Migration 001
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'English',
    education_level TEXT DEFAULT 'Beginner',
    learning_goal TEXT,
    preferred_teaching_style TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Materials Table
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

-- 3. Document Sections Table
CREATE TABLE IF NOT EXISTS document_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chapter_number INT,
    chapter_title TEXT,
    section_number INT,
    section_title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Document Chunks Table
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    section_id UUID REFERENCES document_sections(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chunk_index INT,
    content TEXT NOT NULL,
    embedding JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    subject TEXT,
    chapter TEXT,
    section TEXT,
    learning_objective TEXT,
    learner_level TEXT DEFAULT 'Beginner',
    language TEXT DEFAULT 'English',
    duration_minutes INT DEFAULT 20,
    teaching_style TEXT,
    status TEXT DEFAULT 'not_started',
    current_step INT DEFAULT 0,
    total_steps INT DEFAULT 0,
    progress_percentage INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Lesson Steps Table
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

-- 7. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    lesson_step_id UUID REFERENCES lesson_steps(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    expected_answer TEXT,
    explanation TEXT,
    concept TEXT,
    difficulty TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Student Answers Table
CREATE TABLE IF NOT EXISTS student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN,
    score INT,
    feedback TEXT,
    misconception TEXT,
    ai_evaluation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Concept Mastery Table
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

-- 10. Lesson Notes Table
CREATE TABLE IF NOT EXISTS lesson_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Flashcards Table
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

-- 12. Learning Paths Table
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

-- 13. Learning Path Items Table
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

-- 14. Learning History Table
CREATE TABLE IF NOT EXISTS learning_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    topic TEXT,
    action TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
