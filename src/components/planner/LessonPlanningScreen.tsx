import React, { useState, useEffect } from 'react';
import { LessonPlan } from '../../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers, 
  BookOpen,
  Loader2
} from 'lucide-react';

interface LessonPlanningScreenProps {
  lessonPlan: LessonPlan;
  onStartTeaching: () => void;
}

export const LessonPlanningScreen: React.FC<LessonPlanningScreenProps> = ({
  lessonPlan,
  onStartTeaching
}) => {
  const [completedChecklistCount, setCompletedChecklistCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  const checklistItems = [
    "Analyzing document & syllabus scope",
    "Extracting core conceptual milestones",
    "Calibrating to student baseline level",
    "Structuring step-by-step pedagogical sequence",
    "Generating intuitive real-world analogies",
    "Configuring interactive checkpoint questions",
    "Loading subject-aware visual models & simulations",
    "Optimizing pacing for target session duration"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedChecklistCount(prev => {
        if (prev >= checklistItems.length) {
          clearInterval(interval);
          setIsReady(true);
          return checklistItems.length;
        }
        return prev + 1;
      });
    }, 240);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="lesson-planning-screen" className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
          Pedagogical Architecture
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">
          Preparing Your Lesson Plan
        </h1>
        <p className="text-xs md:text-sm text-[#61707C]">
          EduMitra is indexing your concepts, configuring interactive visual models, and setting up adaptive checks.
        </p>
      </div>

      {/* Preparation Progress Checklist */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4F7CAC]" />
            <h2 className="font-semibold text-[#17232D] text-sm">Teacher Preparation Checklist</h2>
          </div>
          <span className="text-xs font-mono text-[#4F7CAC] font-medium">
            {completedChecklistCount} / {checklistItems.length} Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklistItems.map((item, idx) => {
            const isDone = idx < completedChecklistCount;
            const isCurrent = idx === completedChecklistCount;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs transition-all duration-150 ${
                  isDone
                    ? 'bg-[#F3F7FA] border-[#DCE4EC] text-[#17232D] shadow-[0_1px_2px_rgba(23,35,45,0.02)]'
                    : isCurrent
                    ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] shadow-[0_1px_2px_rgba(79,124,172,0.1)]'
                    : 'bg-white border-[#DCE4EC] text-[#8D9AA6]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#5B9A7A] shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#4F7CAC] animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-[#CBD6E2] shrink-0" />
                )}
                <span className="truncate">{item}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Lesson Syllabus Overview */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-6 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE4EC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-medium">
                {lessonPlan.subject}
              </span>
              <span className="text-xs text-[#8D9AA6]">•</span>
              <span className="text-xs text-[#61707C]">Level: {lessonPlan.level}</span>
            </div>
            <h2 className="text-xl font-semibold text-[#17232D] tracking-tight mt-1.5">{lessonPlan.title}</h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#61707C]">
            <div className="flex items-center gap-1.5 bg-[#F3F7FA] px-2.5 py-1.5 rounded-md border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
              <Clock className="w-3.5 h-3.5 text-[#61707C]" />
              <span>{lessonPlan.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F3F7FA] px-2.5 py-1.5 rounded-md border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
              <Layers className="w-3.5 h-3.5 text-[#61707C]" />
              <span>{lessonPlan.steps.length} Steps</span>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#61707C] font-medium block">
            Pedagogical Sequence:
          </span>

          {lessonPlan.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-[0_1px_2px_rgba(23,35,45,0.02)]"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-white text-[#17232D] border border-[#DCE4EC] font-mono font-medium flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
                  {step.stepNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[#17232D] text-xs md:text-sm">{step.title}</h3>
                    {step.quickCheck && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF1E2] text-[#6F5A35] font-mono border border-[#F0E2CD]">
                        Interactive Check
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#61707C] mt-0.5">Concept: {step.concept}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-white border border-[#DCE4EC] text-[#61707C] font-mono text-[11px]">
                  {step.estimatedMinutes} min
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#DCE4EC] text-[#17232D] font-mono text-[11px]">
                  {step.visualType.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Start Teaching Button */}
        <div className="pt-2">
          <button
            id="start-teaching-btn"
            disabled={!isReady}
            onClick={onStartTeaching}
            className={`w-full py-3 px-6 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
              isReady
                ? 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40'
                : 'bg-[#F3F7FA] text-[#8D9AA6] border border-[#DCE4EC] cursor-not-allowed'
            }`}
          >
            <span>Enter Virtual Classroom</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
