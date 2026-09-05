import React, { useState } from 'react';
import { 
  LearningLevel, 
  LearningGoal, 
  LanguageCode, 
  DurationOption, 
  TeachingStyle,
  TeacherPersonality,
  TeacherAvatarId
} from '../../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Clock, 
  Target, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  UserCheck,
  Award,
  Calendar
} from 'lucide-react';

interface PersonalizePageProps {
  topicOrDocumentTitle: string;
  isDocument?: boolean;
  isGenerating?: boolean;
  onBack: () => void;
  onGenerateLesson: (preferences: {
    level: LearningLevel;
    goal: LearningGoal;
    language: LanguageCode;
    duration: DurationOption;
    style: TeachingStyle;
    teacherPersonality?: TeacherPersonality;
    teacherAvatarId?: TeacherAvatarId;
    examTargetDate?: string;
    examTargetScore?: string;
  }) => void;
}

export const PersonalizePage: React.FC<PersonalizePageProps> = ({
  topicOrDocumentTitle,
  isDocument = false,
  isGenerating = false,
  onBack,
  onGenerateLesson
}) => {
  const [level, setLevel] = useState<LearningLevel>('beginner');
  const [goal, setGoal] = useState<LearningGoal>('understand_concept');
  const [language, setLanguage] = useState<LanguageCode>('hinglish');
  const [duration, setDuration] = useState<DurationOption>('20m');
  const [style, setStyle] = useState<TeachingStyle>('simple_visual');
  const [teacherPersonality, setTeacherPersonality] = useState<TeacherPersonality>('friendly_mentor');
  const [selectedAvatar, setSelectedAvatar] = useState<TeacherAvatarId>('priya');
  const [examName, setExamName] = useState<string>('Final / Competitive Exam');
  const [examDate, setExamDate] = useState<string>('In 30 Days');
  const [targetScore, setTargetScore] = useState<string>('95%+');

  const personalities: { id: TeacherPersonality; title: string; desc: string; badge: string }[] = [
    { id: 'friendly_mentor', title: 'Friendly Mentor', desc: 'Warm, encouraging, simple relatable analogies, builds confidence.', badge: 'Warm & Encouraging' },
    { id: 'strict_professor', title: 'Strict Professor', desc: 'Academic, precise terminology, rigorous derivations, zero hand-waving.', badge: 'Rigorous & Precise' },
    { id: 'visual_teacher', title: 'Visual Teacher', desc: 'Visual-first, dynamic diagram focus, references on-screen steps.', badge: 'Visual & Animated' },
    { id: 'interview_coach', title: 'Interview Coach', desc: 'Technical interview focus, edge cases, trade-offs, articulation.', badge: 'Tech Interviews' },
    { id: 'patient_beginner', title: 'Patient Beginner Teacher', desc: 'Gentle, slow-paced, breaks down jargon, reassuring repetition.', badge: 'Zero Jargon' },
    { id: 'exam_coach', title: 'Exam Coach', desc: 'High-yield marks, examiner traps, formula mnemonics, time management.', badge: 'High Yield' }
  ];

  const avatars: { id: TeacherAvatarId; name: string; desc: string; voice: string }[] = [
    { id: 'priya', name: 'Priya', desc: 'Empathetic & Clear', voice: 'Natural Indian / Global Voice' },
    { id: 'marcus', name: 'Marcus', desc: 'Analytical & Methodical', voice: 'Deep Academic Tone' },
    { id: 'aditi', name: 'Aditi', desc: 'Enthusiastic & Visual', voice: 'Dynamic Expressive Tone' },
    { id: 'david', name: 'David', desc: 'Engineering & Practical', voice: 'Pragmatic Tech Coach' }
  ];

  const levels: { id: LearningLevel; title: string; desc: string }[] = [
    { id: 'beginner', title: 'Beginner', desc: 'No prior background. Focus on intuitive foundations and relatable analogies.' },
    { id: 'intermediate', title: 'Intermediate', desc: 'Familiar with basics. Standard derivations, models, and problem solving.' },
    { id: 'advanced', title: 'Advanced', desc: 'Deep dive, edge cases, mathematical rigor, and architectural questions.' }
  ];

  const goals: { id: LearningGoal; title: string; desc: string }[] = [
    { id: 'understand_concept', title: 'Understand Concept', desc: 'Build solid intuitive mental models.' },
    { id: 'exam_prep', title: 'Exam Preparation (Section 67.7)', desc: 'High-yield formulas, problem patterns, and review questions.' },
    { id: 'interview_prep', title: 'Interview Preparation', desc: 'Explain concepts clearly and answer conceptual questions.' },
    { id: 'practical_application', title: 'Practical Application', desc: 'Interactive simulators and real-world engineering cases.' },
    { id: 'deep_understanding', title: 'Deep Understanding', desc: 'First-principles proofs and mathematical derivations.' }
  ];

  const languages: { id: LanguageCode; title: string; tag: string }[] = [
    { id: 'hinglish', title: 'Hinglish', tag: 'Natural Hindi + English blend' },
    { id: 'en', title: 'English', tag: 'Clear Global English' },
    { id: 'hi', title: 'हिन्दी (Hindi)', tag: 'Hindi explanations' },
    { id: 'te', title: 'తెలుగు (Telugu)', tag: 'Telugu explanations' }
  ];

  const durations: { id: DurationOption; label: string; tag: string }[] = [
    { id: '5m', label: '5 min', tag: 'Quick Summary' },
    { id: '10m', label: '10 min', tag: 'Core Concepts' },
    { id: '20m', label: '20 min', tag: 'Standard Interactive (Recommended)' },
    { id: '30m', label: '30 min', tag: 'In-Depth' },
    { id: '60m', label: '60 min', tag: 'Comprehensive' }
  ];

  const styles: { id: TeachingStyle; title: string; desc: string }[] = [
    { id: 'simple_visual', title: 'Simple & Visual', desc: 'Diagrams, dynamic animations, and intuitive analogies.' },
    { id: 'example_based', title: 'Example-Based', desc: 'Real-world stories, case studies, and scenarios.' },
    { id: 'interactive', title: 'Interactive with Practice', desc: 'Frequent checkpoints, simulations, and problem solving.' },
    { id: 'detailed', title: 'Detailed & Rigorous', desc: 'Step-by-step mathematical proofs and deep explanations.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateLesson({ 
      level, 
      goal, 
      language, 
      duration, 
      style,
      teacherPersonality,
      teacherAvatarId: selectedAvatar,
      examTargetDate: goal === 'exam_prep' ? examDate : undefined,
      examTargetScore: goal === 'exam_prep' ? targetScore : undefined
    });
  };

  return (
    <div id="personalize-lesson-page" className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#E8F1F7] text-[#4F7CAC] text-xs font-medium border border-[#DCE4EC] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
            Step 2 of 3: Personalization
          </span>
          <h1 className="text-xl md:text-2xl font-semibold text-[#17232D] tracking-tight">
            Configure Your Lesson Parameters
          </h1>
          <p className="text-xs text-[#61707C] mt-0.5">
            Subject: <strong className="text-[#17232D]">{topicOrDocumentTitle}</strong>
          </p>
        </div>

        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Your Learning Level */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 md:p-6 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <Layers className="w-4 h-4 text-[#4F7CAC]" />
            <span>1. Knowledge Level</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {levels.map((lvl) => {
              const isSelected = level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  id={`level-${lvl.id}`}
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3.5 rounded-lg text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                      : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#17232D]">{lvl.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4F7CAC]" />}
                  </div>
                  <p className="text-[11px] text-[#61707C] leading-relaxed">{lvl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Learning Goal */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 md:p-6 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <Target className="w-4 h-4 text-[#4F7CAC]" />
            <span>2. Learning Goal</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {goals.map((g) => {
              const isSelected = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  id={`goal-${g.id}`}
                  onClick={() => setGoal(g.id)}
                  className={`p-3 rounded-lg text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                      : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#17232D]">{g.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7CAC]" />}
                  </div>
                  <p className="text-[11px] text-[#61707C] leading-relaxed">{g.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3 & 4: Teaching Language & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Language */}
          <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
            <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
              <Globe className="w-4 h-4 text-[#4F7CAC]" />
              <span>3. Explanation Language</span>
            </div>
            <div className="space-y-2">
              {languages.map((l) => {
                const isSelected = language === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    id={`lang-${l.id}`}
                    onClick={() => setLanguage(l.id)}
                    className={`w-full p-2.5 rounded-lg text-left border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                        : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs text-[#17232D] block">{l.title}</span>
                      <span className="text-[10px] text-[#61707C]">{l.tag}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4F7CAC] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Duration */}
          <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
            <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
              <Clock className="w-4 h-4 text-[#4F7CAC]" />
              <span>4. Target Duration</span>
            </div>
            <div className="space-y-2">
              {durations.map((d) => {
                const isSelected = duration === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    id={`duration-${d.id}`}
                    onClick={() => setDuration(d.id)}
                    className={`w-full p-2.5 rounded-lg text-left border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                        : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs text-[#17232D] block">{d.label}</span>
                      <span className="text-[10px] text-[#61707C]">{d.tag}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4F7CAC] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Teaching Style */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 md:p-6 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-[#4F7CAC]" />
            <span>5. Teaching Methodology</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styles.map((st) => {
              const isSelected = style === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  id={`style-${st.id}`}
                  onClick={() => setStyle(st.id)}
                  className={`p-3 rounded-lg text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                      : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#17232D]">{st.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7CAC]" />}
                  </div>
                  <p className="text-[11px] text-[#61707C] leading-relaxed">{st.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conditional Section: Exam Preparation Target (Section 67.7) */}
        {goal === 'exam_prep' && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Exam Preparation Target (Section 67.7)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#17232D] block mb-1">Target Exam Name</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. GATE CS, Final Semester, AP Physics"
                  className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-[#17232D] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#17232D] block mb-1">Exam Date / Timeline</label>
                <input
                  type="text"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  placeholder="e.g. In 15 Days, Next Month"
                  className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-[#17232D] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#17232D] block mb-1">Target Score / Rank</label>
                <input
                  type="text"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  placeholder="e.g. 95%+, Top 100"
                  className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-[#17232D] focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 6: AI Teacher Character (Section 67.3) */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 md:p-6 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <UserCheck className="w-4 h-4 text-[#4F7CAC]" />
            <span>6. AI Teacher Character (Section 67.3)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {avatars.map((av) => {
              const isSelected = selectedAvatar === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  id={`avatar-${av.id}`}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-3 rounded-lg text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                      : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#17232D]">{av.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7CAC]" />}
                  </div>
                  <p className="text-[11px] text-[#4F7CAC] font-medium">{av.desc}</p>
                  <p className="text-[10px] text-[#8D9AA6] mt-0.5">{av.voice}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 7: AI Teacher Personality (Section 67.2) */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 md:p-6 space-y-3.5 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-[#4F7CAC]" />
            <span>7. Pedagogical Personality (Section 67.2)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {personalities.map((p) => {
              const isSelected = teacherPersonality === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  id={`personality-${p.id}`}
                  onClick={() => setTeacherPersonality(p.id)}
                  className={`p-3.5 rounded-lg text-left border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] ring-1 ring-[#4F7CAC] shadow-[0_1px_2px_rgba(79,124,172,0.12)]'
                      : 'bg-white border-[#DCE4EC] text-[#61707C] hover:border-[#CBD6E2] hover:bg-[#F3F7FA]/70 shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:-translate-y-px'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#17232D]">{p.title}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7CAC]" />}
                  </div>
                  <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-[#4F7CAC] font-medium mb-1">
                    {p.badge}
                  </span>
                  <p className="text-[11px] text-[#61707C] leading-relaxed">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            id="generate-lesson-btn"
            type="submit"
            disabled={isGenerating}
            className={`w-full py-3 px-6 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_2px_rgba(79,124,172,0.2)] focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40 ${
              isGenerating
                ? 'bg-[#4F7CAC]/80 text-white cursor-wait'
                : 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white cursor-pointer hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Pedagogical Plan & Visual Choreography...</span>
              </div>
            ) : (
              <>
                <span>Start Lesson Experience</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
