import React, { useState } from 'react';
import { 
  StudentProfile, 
  RecentLessonItem,
  InProgressLesson 
} from '../../types';
import { 
  Search, 
  Upload, 
  Compass, 
  Play, 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  FileText,
  Sparkles
} from 'lucide-react';

interface DashboardPageProps {
  student: StudentProfile;
  inProgressLesson?: InProgressLesson | null;
  onNavigateToUpload: () => void;
  onNavigateToTopic: (initialTopic?: string) => void;
  onContinueActiveLesson: (lesson?: InProgressLesson | null) => void;
  onReviewLesson: (lessonId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  student,
  inProgressLesson,
  onNavigateToUpload,
  onNavigateToTopic,
  onContinueActiveLesson,
  onReviewLesson
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateToTopic(searchQuery.trim());
    }
  };

  const trendingTopics = [
    "Newton's Laws of Motion",
    "Python from Beginner Level",
    "React for Technical Interviews",
    "Artificial Intelligence & Neural Networks",
    "Electricity & Ohm's Law"
  ];

  return (
    <div id="student-dashboard" className="space-y-8 md:space-y-9 max-w-5xl mx-auto">
      {/* Top Greeting & Search Header */}
      <section className="bg-[#E8F1F7] border border-[#D0E1EE] rounded-xl p-6 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(23,35,45,0.03)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 select-none mb-1.5">
            <span className="text-xs font-medium text-[#61707C] tracking-tight">
              Personalized Learning Workspace
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B9A7A] inline-block shrink-0" />
            <span className="text-xs text-[#4F7CAC] font-medium">Virtual Teacher Online</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">
            Welcome back, {student.name}
          </h1>
          <p className="text-sm text-[#61707C] max-w-2xl leading-relaxed mt-1.5">
            Select an educational document or ask any question to begin an interactive, step-by-step lesson.
          </p>
        </div>

        {/* Search / Topic Prompt Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-3 pt-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#78A6C8] absolute left-3.5 pointer-events-none" />
            <input
              id="dashboard-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn? (e.g., 'Explain Newton's Laws', 'Teach me Python from scratch')..."
              className="w-full bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] focus:border-[#4F7CAC] focus:ring-1 focus:ring-[#4F7CAC]/20 rounded-lg pl-10 pr-28 py-3 text-sm text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-150 shadow-[0_1px_2px_rgba(23,35,45,0.03)]"
            />
            <button
              id="start-teaching-search-btn"
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
            >
              <span>Teach Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-0.5">
            <span className="text-[#8D9AA6] text-[11px] font-medium">Suggested topics:</span>
            {trendingTopics.slice(0, 4).map((topic, idx) => (
              <button
                key={idx}
                id={`suggested-topic-btn-${idx}`}
                type="button"
                onClick={() => onNavigateToTopic(topic)}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#F3F7FA] text-[#4F7CAC] text-xs font-medium border border-[#DCE4EC] hover:border-[#CBD6E2] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_4px_rgba(23,35,45,0.04)] hover:-translate-y-px active:translate-y-0"
              >
                {topic}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Two Primary Learning Methods */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Method 1: Upload Learning Material */}
        <div 
          id="action-upload-material-card"
          onClick={onNavigateToUpload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateToUpload(); }}
          className="group bg-white hover:bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-6 sm:p-7 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.06)] hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] flex items-center justify-center border border-[#D0E1EE] group-hover:bg-[#4F7CAC] group-hover:text-white transition-colors duration-150 shrink-0 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
              <Upload className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#71808C] block mb-1">
                Method 1
              </span>
              <h2 className="text-base font-semibold text-[#17232D] group-hover:text-[#4F7CAC] transition-colors tracking-tight">
                Upload Learning Material
              </h2>
              <p className="text-xs text-[#61707C] mt-1.5 leading-relaxed">
                Upload your PDF textbook, lecture notes, DOCX, or research paper. The teacher indexes the core concepts and builds a structured lesson.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8EEF3] flex items-center justify-between text-xs font-medium text-[#4F7CAC] group-hover:text-[#3E6794]">
            <span className="flex items-center gap-1 group-hover:underline">
              <span>Upload Document & Start</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
            <span className="px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-mono text-[10px]">
              PDF, DOCX, PPTX
            </span>
          </div>
        </div>

        {/* Method 2: Ask a Topic */}
        <div 
          id="action-explore-topic-card"
          onClick={() => onNavigateToTopic()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateToTopic(); }}
          className="group bg-white hover:bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-6 sm:p-7 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.06)] hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] flex items-center justify-center border border-[#D0E1EE] group-hover:bg-[#4F7CAC] group-hover:text-white transition-colors duration-150 shrink-0 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
              <Compass className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#71808C] block mb-1">
                Method 2
              </span>
              <h2 className="text-base font-semibold text-[#17232D] group-hover:text-[#4F7CAC] transition-colors tracking-tight">
                Ask Any Topic
              </h2>
              <p className="text-xs text-[#61707C] mt-1.5 leading-relaxed">
                Enter any concept or syllabus subject. The teacher crafts a personalized curriculum with step-by-step interactive visual models.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8EEF3] flex items-center justify-between text-xs font-medium text-[#4F7CAC] group-hover:text-[#3E6794]">
            <span className="flex items-center gap-1 group-hover:underline">
              <span>Explore Custom Topic</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
            <span className="px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-mono text-[10px]">
              Any Subject
            </span>
          </div>
        </div>
      </section>

      {/* Continue Learning Active Unit */}
      <section className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${inProgressLesson ? 'bg-[#5B9A7A] animate-pulse' : 'bg-[#B5C1C9]'}`} />
            <h2 className="text-sm font-semibold text-[#17232D]">Current In-Progress Lesson</h2>
          </div>
          <span className="text-xs text-[#8D9AA6]">{inProgressLesson ? 'Active Session' : 'Ready to begin'}</span>
        </div>

        {inProgressLesson ? (
          <div className="bg-[#F3F7FA] border border-[#DCE4EC] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#17232D] border border-[#DCE4EC] font-medium">
                  {inProgressLesson.subject || 'General Study'} — {inProgressLesson.category || 'Core'}
                </span>
                <h3 className="font-semibold text-[#17232D] text-sm md:text-base">
                  {inProgressLesson.title}
                </h3>
              </div>
              <p className="text-xs text-[#61707C]">
                Current Section: <span className="text-[#17232D] font-medium">
                  Step {inProgressLesson.currentStepIndex + 1} of {inProgressLesson.totalSteps || inProgressLesson.steps?.length || 5} ({inProgressLesson.currentConcept || 'Concept Intro'})
                </span>
              </p>

              {/* Progress bar */}
              <div className="space-y-1 pt-1 max-w-md">
                <div className="flex justify-between text-[11px] font-mono text-[#61707C]">
                  <span>Progress</span>
                  <span className="font-medium text-[#17232D]">{inProgressLesson.progressPercentage || 0}% Completed</span>
                </div>
                <div className="w-full h-1.5 bg-[#DCE4EC] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4F7CAC] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, inProgressLesson.progressPercentage || 0)}%` }} 
                  />
                </div>
              </div>
            </div>

            <button
              id="continue-active-lesson-btn"
              onClick={() => onContinueActiveLesson(inProgressLesson)}
              className="px-4 py-2 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shrink-0 shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Classroom</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] border border-[#DCE4EC] border-dashed rounded-lg p-6 text-center space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F1F7] text-[#4F7CAC] flex items-center justify-center mx-auto">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#17232D]">No active lesson in progress</p>
              <p className="text-[11px] text-[#61707C] mt-0.5 max-w-md mx-auto">
                Pick a recommended topic above or enter your own concept to start an adaptive, interactive session.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTopic()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F3F7FA] border border-[#DCE4EC] rounded text-xs font-medium text-[#4F7CAC] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start New Lesson</span>
            </button>
          </div>
        )}
      </section>

      {/* Snapshot Performance Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-[1px] shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.05)]">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-2">
            <span>Overall Mastery</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#17232D] tracking-tight">
            {student.overallMastery > 0 ? `${student.overallMastery}%` : '0%'}
          </p>
          <span className="text-[11px] text-[#5B9A7A] font-medium mt-1 block">
            {student.completedLessons > 0 ? 'Consistent progress' : 'Ready to start'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-[1px] shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.05)]">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-2">
            <span>Lessons Completed</span>
            <BookOpen className="w-3.5 h-3.5 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#17232D] tracking-tight">{student.completedLessons || 0}</p>
          <span className="text-[11px] text-[#8D9AA6] mt-1 block">
            {student.completedLessons > 0 ? 'Saved in account' : 'No lessons yet'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-[1px] shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.05)]">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-2">
            <span>Learning Time</span>
            <Clock className="w-3.5 h-3.5 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#17232D] tracking-tight">{student.learningTimeHours || 0}h</p>
          <span className="text-[11px] text-[#8D9AA6] mt-1 block">
            {student.learningTimeHours > 0 ? 'Tracked study time' : 'Start your first hour'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-[1px] shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_12px_rgba(23,35,45,0.05)]">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-2">
            <span>Concepts Mastered</span>
            <Award className="w-3.5 h-3.5 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-bold font-mono text-[#17232D] tracking-tight">{student.masteredConceptsCount || 0}</p>
          <span className="text-[11px] text-[#5B9A7A] font-medium mt-1 block">
            {student.masteredConceptsCount > 0 ? 'Verified by assessment' : 'Unlock with quizzes'}
          </span>
        </div>
      </section>

      {/* Recent Activity List */}
      <section className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
          <h2 className="text-sm font-semibold text-[#17232D]">Recent Learning Sessions</h2>
          <span className="text-xs text-[#61707C] font-mono">{student.recentLessons?.length || 0} total records</span>
        </div>

        {student.recentLessons && student.recentLessons.length > 0 ? (
          <div className="space-y-2.5">
            {student.recentLessons.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#61707C] font-mono border border-[#DCE4EC]">
                      {item.subject}
                    </span>
                    <h3 className="font-medium text-[#17232D] text-xs md:text-sm">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#61707C]">
                    <span>Score: <strong className="text-[#17232D] font-mono font-medium">{item.score}%</strong></span>
                    <span>•</span>
                    <span>{item.duration}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`review-lesson-${item.id}`}
                    onClick={() => onReviewLesson(item.id)}
                    className="px-3 py-1.5 rounded-md bg-white hover:bg-[#E8F1F7] active:bg-[#D0E1EE] text-[#4F7CAC] text-xs font-medium border border-[#DCE4EC] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_4px_rgba(23,35,45,0.04)] hover:-translate-y-px active:translate-y-0"
                  >
                    Review Report
                  </button>
                  <button
                    id={`open-lesson-${item.id}`}
                    onClick={() => onNavigateToTopic(item.title)}
                    className="px-3 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white text-xs font-medium transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_4px_rgba(79,124,172,0.3)] hover:-translate-y-px active:translate-y-0"
                  >
                    Study Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#F8FAFC] border border-[#DCE4EC] border-dashed rounded-lg p-6 text-center space-y-2">
            <p className="text-xs font-medium text-[#17232D]">No completed lessons yet</p>
            <p className="text-[11px] text-[#61707C] max-w-sm mx-auto">
              Your completed lessons, scores, and teacher evaluations will be saved here automatically as you learn.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
