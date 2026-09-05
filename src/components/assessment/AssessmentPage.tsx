import React, { useState } from 'react';
import { AssessmentQuestion, LearningReportData } from '../../types';
import { DEMO_ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentPageProps {
  lessonTitle: string;
  subject: string;
  questions?: AssessmentQuestion[];
  onComplete: (report: LearningReportData) => void;
  onBackToClassroom: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  lessonTitle,
  subject,
  questions = DEMO_ASSESSMENT_QUESTIONS,
  onComplete,
  onBackToClassroom
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    const conceptMap: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
      if (isCorrect) correctCount++;

      const c = q.conceptTested;
      if (!conceptMap[c]) conceptMap[c] = { total: 0, correct: 0 };
      conceptMap[c].total += 1;
      if (isCorrect) conceptMap[c].correct += 1;
    });

    const overallScore = Math.round((correctCount / totalQuestions) * 100);

    const conceptMastery = Object.entries(conceptMap).map(([concept, data]) => ({
      concept,
      score: Math.round((data.correct / data.total) * 100)
    }));

    const strongAreas = conceptMastery.filter(c => c.score >= 75).map(c => c.concept);
    const needsImprovement = conceptMastery.filter(c => c.score < 75).map(c => c.concept);

    if (strongAreas.length === 0) strongAreas.push("Fundamental Definitions");
    if (needsImprovement.length === 0) needsImprovement.push("Complex Circuit Analysis");

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignored
    }

    const report: LearningReportData = {
      lessonId: 'lesson_completed',
      lessonTitle: lessonTitle,
      subject: subject,
      overallScore: overallScore,
      conceptMastery: conceptMastery,
      strongAreas: strongAreas,
      needsImprovement: needsImprovement,
      teacherFeedback: overallScore >= 80 
        ? "Superb performance! You clearly understood the core physical laws and were able to apply them to circuit calculations."
        : "Good attempt! You demonstrated understanding of fundamental principles. Review resistance and inverse relationships to boost your score further.",
      recommendedNextSteps: [
        `Review concepts: ${needsImprovement.join(', ')}`,
        'Practice 3 numerical circuit problems',
        'Continue to Next Chapter: Electrical Power & Energy (P = VI)'
      ],
      date: 'Today'
    };

    onComplete(report);
  };

  const isCurrentAnswered = Boolean(selectedAnswers[currentQ.id]);
  const isAllAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div id="lesson-assessment-screen" className="min-h-screen bg-[#F3F4EF] text-[#18201B] flex flex-col justify-between p-4 md:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between border-b border-[#DCE2DB] pb-4 mb-6">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#5F6962]">
            End-of-Lesson Assessment
          </span>
          <h1 className="text-xl md:text-2xl font-semibold text-[#18201B] tracking-tight">{lessonTitle}</h1>
        </div>
        <button
          id="back-to-classroom-btn"
          onClick={onBackToClassroom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#F0F1EC] text-[#18201B] text-xs font-medium border border-[#DCE2DB] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Review Classroom</span>
        </button>
      </header>

      {/* Main Question Box */}
      <main className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center my-auto">
        {/* Progress Bar & Question Counter */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5F6962]">
            <span>
              Question <strong className="text-[#18201B] font-mono text-sm">{currentIndex + 1}</strong> of <span className="font-mono">{totalQuestions}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F0F1EC] text-[#18201B] border border-[#DCE2DB] font-mono text-[11px] uppercase">
              {currentQ.type.replace('_', ' ')}
            </span>
          </div>
          <div className="w-full h-2 bg-[#DCE2DB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#315C4B] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-[#DCE2DB] rounded-xl p-6 md:p-8 space-y-6 shadow-[0_1px_3px_rgba(24,32,27,0.04),0_1px_2px_rgba(24,32,27,0.02)]">
          <div>
            <span className="text-xs font-mono text-[#5F6962] font-medium uppercase">
              Concept Tested: {currentQ.conceptTested}
            </span>
            <h2 className="text-lg md:text-xl font-semibold text-[#18201B] mt-1 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          {currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === opt;
                return (
                  <button
                    key={idx}
                    id={`assessment-opt-${idx}`}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-lg border text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0F1EC] border-[#315C4B] text-[#18201B] ring-1 ring-[#315C4B] shadow-[0_1px_2px_rgba(49,92,75,0.12)]'
                        : 'bg-white border-[#DCE2DB] text-[#5F6962] hover:border-[#CBD6E2] hover:text-[#18201B] shadow-[0_1px_2px_rgba(24,32,27,0.02)] hover:-translate-y-px'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-medium border ${
                        isSelected ? 'bg-[#315C4B] border-[#315C4B] text-white' : 'bg-[#F0F1EC] border-[#DCE2DB] text-[#5F6962]'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#315C4B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="max-w-3xl w-full mx-auto mt-6 pt-4 border-t border-[#DCE2DB] flex items-center justify-between">
        <button
          id="assessment-prev-btn"
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium border transition-all duration-150 ${
            currentIndex > 0
              ? 'bg-white hover:bg-[#F0F1EC] text-[#18201B] border-[#DCE2DB] hover:border-[#CBD6E2] cursor-pointer shadow-[0_1px_2px_rgba(24,32,27,0.02)]'
              : 'bg-[#F0F1EC] text-[#89918B] border-[#DCE2DB] cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            id="submit-assessment-btn"
            disabled={!isAllAnswered}
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-150 ${
              isAllAnswered
                ? 'bg-[#315C4B] hover:bg-[#264A3C] active:bg-[#1E3B30] text-white cursor-pointer shadow-[0_1px_2px_rgba(49,92,75,0.2)] hover:shadow-[0_2px_6px_rgba(49,92,75,0.3)] hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-[#EAECE6] text-[#89918B] border border-[#DCE2DB] cursor-not-allowed'
            }`}
          >
            <span>Submit Assessment</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id="assessment-next-btn"
            disabled={!isCurrentAnswered}
            onClick={handleNext}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-md font-medium text-xs md:text-sm transition-all duration-150 ${
              isCurrentAnswered
                ? 'bg-[#315C4B] hover:bg-[#264A3C] active:bg-[#1E3B30] text-white cursor-pointer shadow-[0_1px_2px_rgba(49,92,75,0.2)] hover:shadow-[0_2px_6px_rgba(49,92,75,0.3)] hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-[#EAECE6] text-[#89918B] border border-[#DCE2DB] cursor-not-allowed'
            }`}
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </footer>
    </div>
  );
};
