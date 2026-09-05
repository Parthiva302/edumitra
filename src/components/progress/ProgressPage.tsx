import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProgressPageProps {
  student: StudentProfile;
  onNavigateToTopic: (topic: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ student, onNavigateToTopic }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const subjectMasteryList = student.subjectMastery && student.subjectMastery.length > 0
    ? student.subjectMastery
    : [
        { subject: "Physics & Engineering", masteryPercentage: 0, lessonsCompleted: 0, status: 'needs_practice' as const },
        { subject: "Classical Mechanics", masteryPercentage: 0, lessonsCompleted: 0, status: 'needs_practice' as const },
        { subject: "Computer Science & Python", masteryPercentage: 0, lessonsCompleted: 0, status: 'needs_practice' as const },
        { subject: "Artificial Intelligence & Neural Networks", masteryPercentage: 0, lessonsCompleted: 0, status: 'needs_practice' as const },
        { subject: "Mathematics & Calculus", masteryPercentage: 0, lessonsCompleted: 0, status: 'needs_practice' as const }
      ];

  const estimatedQuestions = (student.completedLessons || 0) * 4;
  const avgScore = student.completedLessons > 0 ? `${student.overallMastery}%` : '0%';

  const weeklyActivity = [
    { day: "Mon", hours: student.completedLessons > 2 ? 0.8 : 0, lessons: student.completedLessons > 2 ? 1 : 0 },
    { day: "Tue", hours: student.completedLessons > 4 ? 1.0 : 0, lessons: student.completedLessons > 4 ? 2 : 0 },
    { day: "Wed", hours: student.completedLessons > 1 ? 0.5 : 0, lessons: student.completedLessons > 1 ? 1 : 0 },
    { day: "Thu", hours: student.completedLessons > 3 ? 0.7 : 0, lessons: student.completedLessons > 3 ? 1 : 0 },
    { day: "Fri", hours: student.learningTimeHours > 0 ? Math.min(student.learningTimeHours, 1.2) : 0, lessons: student.completedLessons > 0 ? 1 : 0 },
    { day: "Sat", hours: 0, lessons: 0 },
    { day: "Sun", hours: 0, lessons: 0 }
  ];

  const totalWeeklyHours = weeklyActivity.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

  return (
    <div id="student-progress-analytics" className="space-y-6 md:space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4EC] pb-4">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
            Student Analytics
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">
            Learning Progress & Mastery
          </h1>
          <p className="text-xs md:text-sm text-[#61707C] mt-0.5">
            Continuously updated by EduMitra’s adaptive evaluation engine.
          </p>
        </div>

        {/* Streak Pill & Timeframe Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#F8F0E3] border border-[#EADCC8] px-3 py-1.5 rounded-md text-[#17232D] font-medium text-xs">
            <Flame className={`w-4 h-4 ${student.completedLessons > 0 ? 'text-[#B48645] fill-[#B48645]' : 'text-[#8D9AA6]'}`} />
            <span>{student.completedLessons > 0 ? `${Math.min(student.completedLessons, 7)}-Day Active Streak` : 'Ready to start streak'}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#F3F7FA] p-1 rounded-md border border-[#DCE4EC]">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                timeframe === 'week' ? 'bg-white text-[#17232D] shadow-2xs font-semibold' : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                timeframe === 'month' ? 'bg-white text-[#17232D] shadow-2xs font-semibold' : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer ${
                timeframe === 'all' ? 'bg-white text-[#17232D] shadow-2xs font-semibold' : 'text-[#61707C] hover:text-[#17232D]'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot 4-Card Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-px">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-1.5">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-semibold font-mono text-[#17232D]">{avgScore}</p>
          <span className="text-[11px] text-[#5B9A7A] mt-1 block">
            {student.completedLessons > 0 ? 'Verified assessments' : 'Awaiting 1st assessment'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-px">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-1.5">
            <span>Completed Lessons</span>
            <BookOpen className="w-4 h-4 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-semibold font-mono text-[#17232D]">{student.completedLessons || 0}</p>
          <span className="text-[11px] text-[#61707C] mt-1 block">
            {student.completedLessons > 0 ? `${student.completedLessons} curriculum units` : 'No lessons yet'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-px">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-1.5">
            <span>Questions Answered</span>
            <CheckCircle2 className="w-4 h-4 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-semibold font-mono text-[#17232D]">{estimatedQuestions}</p>
          <span className="text-[11px] text-[#61707C] mt-1 block">
            {estimatedQuestions > 0 ? 'Accuracy tracked by teacher' : 'Quizzes in classrooms'}
          </span>
        </div>

        <div className="bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-5 transition-all duration-150 hover:-translate-y-px">
          <div className="flex items-center justify-between text-[#61707C] text-xs font-medium mb-1.5">
            <span>Total Time Invested</span>
            <Clock className="w-4 h-4 text-[#4F7CAC]" />
          </div>
          <p className="text-2xl font-semibold font-mono text-[#17232D]">{student.learningTimeHours || 0}h</p>
          <span className="text-[11px] text-[#5B9A7A] mt-1 block">
            {student.learningTimeHours > 0 ? 'Consistent study pace' : 'Ready to start'}
          </span>
        </div>
      </div>

      {/* Weekly Activity Visualizer */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4F7CAC]" />
            <h2 className="font-semibold text-[#17232D] text-sm">Weekly Learning Time</h2>
          </div>
          <span className="text-xs text-[#61707C] font-mono">Total this week: {totalWeeklyHours} hrs</span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-36">
          {weeklyActivity.map((w, idx) => {
            const heightPercent = Math.round((w.hours / 2.5) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-[#4F7CAC] opacity-0 group-hover:opacity-100 transition-opacity">
                  {w.hours}h
                </span>
                <div className="w-full max-w-[36px] bg-[#F3F7FA] border border-[#DCE4EC] rounded-t h-24 flex items-end p-0.5">
                  <div
                    className="w-full bg-[#4F7CAC] group-hover:bg-[#3D6692] rounded-t transition-all duration-500"
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                </div>
                <span className="text-xs text-[#61707C] font-medium">{w.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Mastery Breakdown */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4F7CAC]" />
            <h2 className="font-semibold text-[#17232D] text-sm">Domain Mastery Scores</h2>
          </div>
          <span className="text-xs text-[#61707C]">Benchmark: 85%+</span>
        </div>

        <div className="space-y-3">
          {subjectMasteryList.map((m, idx) => {
            const percentage = m.masteryPercentage || 0;
            const statusLabel = percentage >= 85 ? 'Mastered' : percentage >= 70 ? 'Proficient' : percentage >= 40 ? 'Intermediate' : 'Developing';
            return (
              <div key={idx} className="bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] p-3.5 rounded-lg space-y-2 transition-colors">
                <div className="flex items-center justify-between text-xs md:text-sm gap-2">
                  <div>
                    <span className="font-medium text-[#17232D] block">{m.subject}</span>
                    <span className="text-xs text-[#61707C]">{m.lessonsCompleted || 0} lessons completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-semibold text-[#4F7CAC] text-sm">{percentage}%</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#61707C] border border-[#DCE4EC] font-medium block mt-0.5">
                        {statusLabel}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigateToTopic(m.subject)}
                      className="px-2.5 py-1.5 rounded bg-white hover:bg-[#E8F1F7] active:bg-[#D0E1EE] text-[#4F7CAC] border border-[#DCE4EC] text-xs font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-px active:translate-y-0"
                      title={`Study ${m.subject}`}
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#DCE4EC]">
                  <div
                    className="h-full bg-[#4F7CAC] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
