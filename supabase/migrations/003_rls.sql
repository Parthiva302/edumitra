-- ==============================================================================
-- EDUMITRA - ROW LEVEL SECURITY (RLS) POLICIES MIGRATION 003
-- Enforces Strict Tenant and User Isolation Across All Tables
-- ==============================================================================

-- 1. Enable RLS on All Tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policy
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- 3. Documents & Materials Policy
DROP POLICY IF EXISTS "Users can manage own documents" ON documents;
CREATE POLICY "Users can manage own documents" ON documents
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own materials" ON materials;
CREATE POLICY "Users can manage own materials" ON materials
    FOR ALL USING (auth.uid() = user_id);

-- 4. Document Sections & Chunks (CRITICAL: User isolation prevents cross-student chunk leaks)
DROP POLICY IF EXISTS "Users can manage own sections" ON document_sections;
CREATE POLICY "Users can manage own sections" ON document_sections
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own chunks" ON document_chunks;
CREATE POLICY "Users can manage own chunks" ON document_chunks
    FOR ALL USING (auth.uid() = user_id);

-- 5. Lessons & Lesson Sections
DROP POLICY IF EXISTS "Users can manage own lessons" ON lessons;
CREATE POLICY "Users can manage own lessons" ON lessons
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own lesson sections" ON lesson_sections;
CREATE POLICY "Users can manage own lesson sections" ON lesson_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lessons WHERE lessons.id = lesson_sections.lesson_id AND lessons.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can manage own lesson steps" ON lesson_steps;
CREATE POLICY "Users can manage own lesson steps" ON lesson_steps
    FOR ALL USING (auth.uid() = user_id);

-- 6. Questions & Student Answers
DROP POLICY IF EXISTS "Users can manage own questions" ON questions;
CREATE POLICY "Users can manage own questions" ON questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lessons WHERE lessons.id = questions.lesson_id AND lessons.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can manage own student answers" ON student_answers;
CREATE POLICY "Users can manage own student answers" ON student_answers
    FOR ALL USING (auth.uid() = user_id);

-- 7. Learning Progress, Mastery, Assessments
DROP POLICY IF EXISTS "Users can manage own learning progress" ON learning_progress;
CREATE POLICY "Users can manage own learning progress" ON learning_progress
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own concept mastery" ON concept_mastery;
CREATE POLICY "Users can manage own concept mastery" ON concept_mastery
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own assessments" ON assessments;
CREATE POLICY "Users can manage own assessments" ON assessments
    FOR ALL USING (auth.uid() = user_id);

-- 8. Notes, Flashcards, Paths, History
DROP POLICY IF EXISTS "Users can manage own lesson notes" ON lesson_notes;
CREATE POLICY "Users can manage own lesson notes" ON lesson_notes
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own flashcards" ON flashcards;
CREATE POLICY "Users can manage own flashcards" ON flashcards
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own learning paths" ON learning_paths;
CREATE POLICY "Users can manage own learning paths" ON learning_paths
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own learning path items" ON learning_path_items;
CREATE POLICY "Users can manage own learning path items" ON learning_path_items
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own learning history" ON learning_history;
CREATE POLICY "Users can manage own learning history" ON learning_history
    FOR ALL USING (auth.uid() = user_id);
