-- EduMitra Row Level Security (RLS) Policies Migration 003

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Materials: Users can manage own materials
CREATE POLICY "Users can manage own materials" ON materials
    FOR ALL USING (auth.uid() = user_id);

-- Document sections & chunks
CREATE POLICY "Users can manage own sections" ON document_sections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chunks" ON document_chunks
    FOR ALL USING (auth.uid() = user_id);

-- Lessons & Lesson Steps
CREATE POLICY "Users can manage own lessons" ON lessons
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson steps" ON lesson_steps
    FOR ALL USING (auth.uid() = user_id);

-- Questions & Student Answers
CREATE POLICY "Users can manage own questions" ON questions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own student answers" ON student_answers
    FOR ALL USING (auth.uid() = user_id);

-- Mastery, Notes, Flashcards, Paths, History
CREATE POLICY "Users can manage own concept mastery" ON concept_mastery
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson notes" ON lesson_notes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own flashcards" ON flashcards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning paths" ON learning_paths
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning path items" ON learning_path_items
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning history" ON learning_history
    FOR ALL USING (auth.uid() = user_id);
