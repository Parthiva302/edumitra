import React, { useState, useEffect } from 'react';
import { 
  LearningReportData,
  StructuredLessonNotes,
  FlashcardItem,
  ConceptMapData
} from '../../types';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Check, 
  Brain,
  FileText,
  CreditCard,
  Network,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';

interface LearningReportPageProps {
  report: LearningReportData;
  onContinueLearning: () => void;
  onRetakeLesson?: () => void;
}

export const LearningReportPage: React.FC<LearningReportPageProps> = ({
  report,
  onContinueLearning,
  onRetakeLesson
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'notes' | 'flashcards' | 'concept_map'>('analytics');
  
  // Dynamic Study Artifacts state
  const [notes, setNotes] = useState<StructuredLessonNotes | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [conceptMap, setConceptMap] = useState<ConceptMapData | null>(null);
  const [loadingArtifacts, setLoadingArtifacts] = useState<boolean>(false);

  // Flashcard interactive state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownCards, setKnownCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const loadStudyArtifacts = async () => {
      setLoadingArtifacts(true);
      const concepts = report.conceptMastery?.map(c => c.concept) || [report.lessonTitle];
      try {
        const [notesRes, flashcardsRes, mapRes] = await Promise.all([
          api.generateNotes(report.lessonTitle, concepts, report.lessonId).catch(() => null),
          api.generateFlashcards(report.lessonTitle, concepts, report.lessonId).catch(() => null),
          api.generateConceptMap(report.lessonTitle, concepts).catch(() => null)
        ]);
        if (isMounted) {
          if (notesRes) setNotes(notesRes);
          if (flashcardsRes?.cards) setFlashcards(flashcardsRes.cards);
          if (mapRes) setConceptMap(mapRes);
        }
      } catch (err) {
        console.warn('Could not generate post-lesson resources:', err);
      } finally {
        if (isMounted) setLoadingArtifacts(false);
      }
    };

    loadStudyArtifacts();
    return () => { isMounted = false; };
  }, [report.lessonTitle, report.lessonId]);

  const activeFlashcard = flashcards[currentCardIndex] || {
    id: 'f1',
    question: `What is the core principle of ${report.lessonTitle}?`,
    answer: `It establishes the fundamental relationship between potential and reaction rate.`,
    concept: report.lessonTitle
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex(Math.max(0, flashcards.length - 1));
    }
  };

  const handleMarkKnown = (cardId: string) => {
    setKnownCards(prev => ({ ...prev, [cardId]: true }));
    handleNextCard();
  };

  return (
    <div id="learning-report-page" className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE4EC] pb-4">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
            Post-Lesson Mastery Center
          </span>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">Your Learning Report</h1>
          <p className="text-xs md:text-sm text-[#61707C] mt-0.5">Lesson: <span className="text-[#17232D] font-medium">{report.lessonTitle}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {onRetakeLesson && (
            <button
              id="retake-lesson-btn"
              onClick={onRetakeLesson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#F3F7FA] text-[#17232D] text-xs font-medium border border-[#DCE4EC] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Lesson</span>
            </button>
          )}
          <button
            id="continue-learning-btn"
            onClick={onContinueLearning}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4F7CAC] hover:bg-[#3E6794] text-white font-medium text-xs md:text-sm transition-colors cursor-pointer"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar for Analytics, Notes, Flashcards, Concept Map */}
      <div className="flex items-center gap-1.5 p-1 bg-[#E8EFF5] rounded-xl border border-[#DCE4EC]">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-white text-[#17232D] shadow-xs'
              : 'text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Mastery & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-white text-[#17232D] shadow-xs'
              : 'text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Structured Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-white text-[#17232D] shadow-xs'
              : 'text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Flashcards ({flashcards.length || 6})</span>
        </button>

        <button
          onClick={() => setActiveTab('concept_map')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'concept_map'
              ? 'bg-white text-[#17232D] shadow-xs'
              : 'text-[#61707C] hover:text-[#17232D]'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Concept Map</span>
        </button>
      </div>

      {/* Tab 1: Analytics & Report */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Hero Score Banner & Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Big Score Card */}
            <div className="md:col-span-4 bg-white border border-[#DCE4EC] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="p-2.5 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] mb-3">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-mono tracking-wider text-[#61707C] font-medium">Overall Assessment Score</span>
              <div className="text-4xl md:text-5xl font-semibold font-mono text-[#17232D] my-2">
                {report.overallScore}%
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#F3F7FA] text-[#17232D] font-medium border border-[#DCE4EC]">
                {report.overallScore >= 80 ? 'Proficient Mastery' : 'Foundation Solid'}
              </span>
            </div>

            {/* AI Teacher Feedback Card */}
            <div className="md:col-span-8 bg-white border border-[#DCE4EC] rounded-xl p-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#4F7CAC] font-semibold text-xs uppercase font-mono">
                  <Brain className="w-4 h-4" />
                  <span>AI Teacher Personalized Feedback</span>
                </div>
                <p className="text-xs md:text-sm text-[#17232D] leading-relaxed italic bg-[#F3F7FA] p-4 rounded-lg border border-[#DCE4EC]">
                  "{report.teacherFeedback}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#DCE4EC] text-xs text-[#61707C]">
                <span>Teacher: Dr. Priya Sharma</span>
                <span>Evaluated: {report.date}</span>
              </div>
            </div>
          </div>

          {/* Concept Mastery Breakdown */}
          <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DCE4EC] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4F7CAC]" />
                <h2 className="font-semibold text-[#17232D] text-sm">Concept Mastery Breakdown</h2>
              </div>
              <span className="text-xs text-[#61707C]">Benchmark: 80%+</span>
            </div>

            <div className="space-y-3">
              {report.conceptMastery.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#17232D]">{item.concept}</span>
                    <span className="font-mono text-[#4F7CAC]">{item.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F3F7FA] rounded-full overflow-hidden border border-[#DCE4EC]">
                    <div
                      className="h-full bg-[#4F7CAC] rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong Areas vs Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#5B9A7A] font-semibold text-sm pb-2 border-b border-[#DCE4EC]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Areas Mastered</span>
              </div>
              <div className="space-y-2">
                {report.strongAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-[#17232D] bg-[#EAF4EE] border border-[#D0E6D8] p-2.5 rounded-lg">
                    <Check className="w-4 h-4 text-[#5B9A7A] shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#DCE4EC] rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#C58B3A] font-semibold text-sm pb-2 border-b border-[#DCE4EC]">
                <AlertCircle className="w-4 h-4" />
                <span>Recommended Focus Areas</span>
              </div>
              <div className="space-y-2">
                {report.needsImprovement.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-[#17232D] bg-[#F8F0E3] border border-[#EADCC8] p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58B3A] shrink-0 ml-1" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Structured Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#4F7CAC]">
              Generated Study Guide
            </span>
            <h2 className="text-xl font-bold text-[#17232D] tracking-tight mt-1">
              {notes?.title || `${report.lessonTitle} Notes`}
            </h2>
            <p className="text-xs md:text-sm text-[#61707C] mt-2 leading-relaxed">
              {notes?.overview || `Comprehensive conceptual notes synthesized directly from your lesson.`}
            </p>
          </div>

          {/* Key Concepts List */}
          {notes?.key_concepts && notes.key_concepts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#17232D] border-b border-[#DCE4EC] pb-2">
                Core Conceptual Derivations
              </h3>
              <div className="space-y-2.5">
                {notes.key_concepts.map((kc, i) => (
                  <div key={i} className="p-3.5 bg-[#F3F7FA] rounded-lg border border-[#DCE4EC] space-y-1">
                    <span className="text-xs font-bold text-[#4F7CAC] block">{kc.concept}</span>
                    <p className="text-xs text-[#17232D] leading-relaxed">{kc.summary}</p>
                    {kc.takeaway && (
                      <span className="text-[11px] font-mono text-[#5B9A7A] block mt-1 font-semibold">
                        💡 Key takeaway: {kc.takeaway}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulas & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#DCE4EC] space-y-2">
              <span className="text-xs font-bold text-[#17232D] block">Key Definitions & Formulas</span>
              <div className="space-y-2 text-xs">
                {notes?.formulas_and_definitions?.map((fd, i) => (
                  <div key={i} className="bg-white p-2.5 rounded border border-[#DCE4EC]">
                    <span className="font-mono font-bold text-[#4F7CAC] block">{fd.term}</span>
                    <span className="text-[#61707C] text-[11px]">{fd.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#DCE4EC] space-y-2">
              <span className="text-xs font-bold text-[#B76565] block">Common Misconceptions to Avoid</span>
              <div className="space-y-2 text-xs">
                {notes?.common_mistakes?.map((cm, i) => (
                  <div key={i} className="bg-white p-2.5 rounded border border-[#ECD1D1]">
                    <span className="font-semibold text-[#B76565] block text-[11px]">⚠️ {cm.mistake}</span>
                    <span className="text-[#5B9A7A] text-[11px] block mt-0.5">✓ {cm.correction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-[#61707C]">
              Card {currentCardIndex + 1} of {flashcards.length || 1}
            </span>
            <p className="text-xs text-[#61707C]">Click the card to flip and test your active recall.</p>
          </div>

          {/* 3D Flip Card Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg mx-auto aspect-[16/10] min-h-[220px] rounded-2xl bg-white border-2 border-[#DCE4EC] hover:border-[#4F7CAC] p-6 flex flex-col justify-between items-center text-center shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg group select-none"
          >
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#61707C]">
              <span className="px-2 py-0.5 rounded bg-[#F3F7FA] text-[#4F7CAC] font-bold">
                {activeFlashcard.concept}
              </span>
              <span className="text-[#8D9AA6] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Answer Side' : 'Question Side'}</span>
              </span>
            </div>

            <div className="my-auto px-4">
              {!isFlipped ? (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-mono text-[#4F7CAC] font-bold tracking-wider block">Question:</span>
                  <p className="text-base md:text-lg font-bold text-[#17232D] leading-snug">
                    {activeFlashcard.question}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-mono text-[#5B9A7A] font-bold tracking-wider block">Explanation:</span>
                  <p className="text-sm md:text-base font-semibold text-[#17232D] leading-relaxed bg-[#EAF4EE] p-3 rounded-xl border border-[#D0E6D8]">
                    {activeFlashcard.answer}
                  </p>
                </div>
              )}
            </div>

            <span className="text-[10px] text-[#8D9AA6]">Click anywhere to flip</span>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevCard}
              className="p-2.5 rounded-xl bg-white border border-[#DCE4EC] hover:bg-[#F3F7FA] text-[#17232D] transition shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleMarkKnown(activeFlashcard.id)}
              className="px-4 py-2 rounded-xl bg-[#5B9A7A] hover:bg-[#488265] text-white font-semibold text-xs transition shadow-xs cursor-pointer"
            >
              ✓ Mark Mastered
            </button>

            <button
              onClick={handleNextCard}
              className="p-2.5 rounded-xl bg-white border border-[#DCE4EC] hover:bg-[#F3F7FA] text-[#17232D] transition shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Concept Map */}
      {activeTab === 'concept_map' && (
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#4F7CAC]">
              Visual Knowledge Graph
            </span>
            <h2 className="text-xl font-bold text-[#17232D] tracking-tight mt-1">
              {conceptMap?.central_topic || report.lessonTitle} Concept Network
            </h2>
            <p className="text-xs text-[#61707C]">Relationships and conceptual hierarchy mapped from your lesson.</p>
          </div>

          {/* Visual Interactive Map Grid */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#F5F7F8] to-[#E8EFF5] border border-[#DCE4EC] min-h-[300px] flex flex-col items-center justify-center gap-6">
            {/* Central Node */}
            <div className="p-4 rounded-2xl bg-[#4F7CAC] text-white text-center shadow-md max-w-xs border-2 border-white">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-80">Central Anchor</span>
              <h4 className="text-sm font-bold tracking-tight">{conceptMap?.central_topic || report.lessonTitle}</h4>
            </div>

            {/* Branching Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              {conceptMap?.nodes?.map((node, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-[#DCE4EC] shadow-xs text-center space-y-1 hover:border-[#4F7CAC] transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#E8F1F7] text-[#4F7CAC] font-bold uppercase">
                    {node.category}
                  </span>
                  <h5 className="text-xs font-bold text-[#17232D]">{node.label}</h5>
                  <p className="text-[10px] text-[#61707C] leading-snug">{node.description}</p>
                </div>
              )) || (
                <div className="col-span-3 text-center text-xs text-[#61707C]">
                  Synthesizing concept connections...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
