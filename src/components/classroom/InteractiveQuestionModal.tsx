import React, { useState } from 'react';
import { QuickCheck, QuickCheckOption } from '../../types';
import { HelpCircle, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Brain } from 'lucide-react';
import { api } from '../../services/api';

interface InteractiveQuestionModalProps {
  quickCheck: QuickCheck;
  lessonId?: string;
  concept?: string;
  onCorrectAnswer: () => void;
  onMisconceptionTriggered?: (misconception: string, analogyDialogue: string) => void;
  onShowWaterPipeAnalogy?: () => void;
}

export const InteractiveQuestionModal: React.FC<InteractiveQuestionModalProps> = ({
  quickCheck,
  lessonId,
  concept,
  onCorrectAnswer,
  onMisconceptionTriggered,
  onShowWaterPipeAnalogy
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isMisconceptionState, setIsMisconceptionState] = useState<boolean>(false);
  const [misconceptionData, setMisconceptionData] = useState<{
    explanation?: string;
    analogy: string;
    dialogue: string;
  } | null>(null);

  // Retry state after misconception remediation
  const [retrySelectedId, setRetrySelectedId] = useState<string | null>(null);
  const [retrySubmitted, setRetrySubmitted] = useState<boolean>(false);
  const [retrySuccess, setRetrySuccess] = useState<boolean>(false);

  const handleSelectOption = (option: QuickCheckOption) => {
    if (showFeedback && !isMisconceptionState) return;
    setSelectedOptionId(option.id);
  };

  const handleCheckAnswer = async () => {
    if (!selectedOptionId) return;

    setIsAnalyzing(true);
    const option = quickCheck.options.find(o => o.id === selectedOptionId);
    const selectedText = option?.text || "";

    try {
      // Call backend evaluator
      const evalRes = await api.evaluateAnswer({
        lessonId: lessonId,
        concept: concept || "Core Principle",
        question: quickCheck.question,
        studentAnswer: selectedText,
        expectedAnswer: quickCheck.options.find(o => o.isCorrect)?.text
      });

      setIsAnalyzing(false);
      setShowFeedback(true);

      const isActuallyCorrect = evalRes.is_correct || option?.isCorrect || false;

      if (isActuallyCorrect) {
        setIsMisconceptionState(false);
      } else {
        setIsMisconceptionState(true);
        const misDiag = evalRes.misconception || option?.misconceptionExplanation || quickCheck.remediationMisconceptionIdentified || "Conceptual confusion in direct vs inverse relationship.";
        const analogyText = evalRes.remediation_analogy || quickCheck.remediationAnalogy || "Imagine a water pipe: narrowing the pipe restricts the flow.";
        const dialogueText = evalRes.remediation_dialogue || quickCheck.remediationDialogue || "Let's separate these variables carefully.";

        setMisconceptionData({
          explanation: misDiag,
          analogy: analogyText,
          dialogue: dialogueText
        });

        if (onMisconceptionTriggered) {
          onMisconceptionTriggered(misDiag, dialogueText);
        }

        if (onShowWaterPipeAnalogy) {
          onShowWaterPipeAnalogy();
        }
      }
    } catch (err) {
      // Fallback to local option evaluation
      setIsAnalyzing(false);
      setShowFeedback(true);

      if (option?.isCorrect) {
        setIsMisconceptionState(false);
      } else {
        setIsMisconceptionState(true);
        setMisconceptionData({
          explanation: option?.misconceptionExplanation || quickCheck.remediationMisconceptionIdentified || "Conceptual distinction needed.",
          analogy: quickCheck.remediationAnalogy,
          dialogue: quickCheck.remediationDialogue
        });

        if (onMisconceptionTriggered) {
          onMisconceptionTriggered(
            option?.misconceptionExplanation || quickCheck.remediationMisconceptionIdentified,
            quickCheck.remediationDialogue
          );
        }

        if (onShowWaterPipeAnalogy) {
          onShowWaterPipeAnalogy();
        }
      }
    }
  };

  const handleRetrySubmit = () => {
    if (!retrySelectedId || !quickCheck.remediationRetryQuestion) return;

    const retryOpt = quickCheck.remediationRetryQuestion.options.find(o => o.id === retrySelectedId);
    setRetrySubmitted(true);
    if (retryOpt?.isCorrect) {
      setRetrySuccess(true);
    }
  };

  return (
    <div id="interactive-question-card" className="w-full bg-white border border-[#DCE4EC] rounded-2xl p-5 md:p-6 text-[#17232D] shadow-xs transition-all">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DCE4EC]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F8F0E3] text-[#B48645] border border-[#EADCC8]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#B48645]">
              Interactive Checkpoint
            </span>
            <h4 className="font-bold text-[#17232D] text-base">Quick Understanding Check</h4>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-md bg-[#F3F7FA] text-[#61707C] font-medium border border-[#DCE4EC]">
          Teacher Waiting for Answer
        </span>
      </div>

      {/* Main Question */}
      <div className="my-2">
        <p className="text-base font-semibold text-[#17232D] leading-snug">
          {quickCheck.question}
        </p>
      </div>

      {/* Options List */}
      {!isMisconceptionState && !showFeedback && (
        <div className="space-y-2.5 my-4">
          {quickCheck.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                id={`option-${option.id}`}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] shadow-xs'
                    : 'bg-white border-[#DCE4EC] text-[#61707C] hover:bg-[#F3F7FA] hover:text-[#17232D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                    isSelected ? 'bg-[#4F7CAC] border-[#4F7CAC] text-white' : 'bg-white border-[#CBD6E2] text-[#61707C]'
                  }`}>
                    {option.id.replace('opt_', '').replace('r_', '')}
                  </span>
                  <span className="text-sm font-medium text-[#17232D]">{option.text}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-2">
            <button
              id="submit-quick-check-btn"
              disabled={!selectedOptionId || isAnalyzing}
              onClick={handleCheckAnswer}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                selectedOptionId && !isAnalyzing
                  ? 'bg-[#4F7CAC] hover:bg-[#3E6794] text-white cursor-pointer'
                  : 'bg-[#F3F7FA] text-[#8D9AA6] cursor-not-allowed border border-[#DCE4EC]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 animate-spin text-[#61707C]" />
                  <span>Evaluating answer with AI teacher...</span>
                </>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* State A: Immediate Correct Answer */}
      {showFeedback && !isMisconceptionState && (
        <div className="my-4 p-4 rounded-xl bg-[#EAF4EE] border border-[#CBE3D5] space-y-3">
          <div className="flex items-center gap-2 text-[#5B9A7A] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#5B9A7A] shrink-0" />
            <span>Spot on! That is completely correct.</span>
          </div>
          <p className="text-xs md:text-sm text-[#17232D] leading-relaxed">
            Excellent conceptual intuition! The variables interact according to established scientific principles.
          </p>
          <button
            id="continue-after-correct-btn"
            onClick={onCorrectAnswer}
            className="w-full py-2.5 px-4 rounded-xl bg-[#5B9A7A] hover:bg-[#4A8568] text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Continue to Next Concept</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* State B: Adaptive Misconception Remediation Engine */}
      {isMisconceptionState && (
        <div className="my-4 space-y-4">
          {/* Misconception Diagnostic Badge */}
          <div className="p-3.5 rounded-xl bg-[#F8F0E3] border border-[#EADCC8]">
            <div className="flex items-start gap-2 text-[#B48645] font-bold text-xs md:text-sm mb-1">
              <AlertCircle className="w-4 h-4 text-[#B48645] shrink-0 mt-0.5" />
              <span>AI Teacher Diagnostic: Conceptual Misconception Identified</span>
            </div>
            <p className="text-xs text-[#7A5726] leading-relaxed pl-6">
              {misconceptionData?.explanation}
            </p>
          </div>

          {/* Teacher's Supportive Dialogue & Analogy Card */}
          <div className="p-4 rounded-xl bg-[#E8F1F7] border border-[#D0E1EE] space-y-2">
            <span className="font-bold text-xs text-[#4F7CAC] block">
              Teacher’s Adaptive Analogy & Guidance:
            </span>
            <p className="text-xs md:text-sm text-[#17232D] leading-relaxed italic bg-white p-3 rounded-lg border border-[#DCE4EC] shadow-xs">
              "{misconceptionData?.dialogue}"
            </p>
          </div>

          {/* Follow-up / Retry Question */}
          {quickCheck.remediationRetryQuestion && !retrySuccess && (
            <div className="p-4 rounded-xl bg-[#F3F7FA] border border-[#DCE4EC] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#17232D]">
                <RefreshCw className="w-3.5 h-3.5 text-[#4F7CAC]" />
                <span>Test your new intuition:</span>
              </div>
              <p className="text-sm font-semibold text-[#17232D]">
                {quickCheck.remediationRetryQuestion.question}
              </p>

              <div className="space-y-2">
                {quickCheck.remediationRetryQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    id={`retry-${opt.id}`}
                    onClick={() => {
                      setRetrySelectedId(opt.id);
                      setRetrySubmitted(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      retrySelectedId === opt.id
                        ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] font-semibold'
                        : 'bg-white border-[#DCE4EC] text-[#61707C] hover:bg-[#F3F7FA]'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <button
                id="submit-retry-btn"
                disabled={!retrySelectedId}
                onClick={handleRetrySubmit}
                className="w-full py-2.5 px-3 rounded-lg bg-[#4F7CAC] hover:bg-[#3E6794] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Check Understanding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Successful Retry Celebration */}
          {retrySuccess && (
            <div className="p-4 rounded-xl bg-[#EAF4EE] border border-[#CBE3D5] space-y-3">
              <div className="flex items-center gap-2 text-[#5B9A7A] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#5B9A7A]" />
                <span>Excellent adaptation! You grasped the principle.</span>
              </div>
              <p className="text-xs text-[#17232D]">
                By reflecting on the underlying mechanism, you have corrected the misconception completely.
              </p>
              <button
                id="continue-after-retry-success-btn"
                onClick={onCorrectAnswer}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5B9A7A] hover:bg-[#4A8568] text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Continue Teaching Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
