import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LessonPlan, 
  LanguageCode, 
  AvatarEmotion, 
  AvatarState, 
  TeacherAvatarId, 
  VisualType,
  VideoSceneItem
} from '../../types';
import { RealisticTeacherAvatar } from './RealisticTeacherAvatar';
import { TeachingVisual } from './TeachingVisual';
import { ClassroomTopBar } from './ClassroomTopBar';
import { ClassroomBottomBar } from './ClassroomBottomBar';
import { InteractiveQuestionModal } from './InteractiveQuestionModal';
import { AskTeacherDrawer } from './AskTeacherDrawer';
import { speechService } from '../../utils/speech';
import { TEACHER_PERSONAS } from '../../data/mockData';
import { Film, Sparkles, CheckCircle2 } from 'lucide-react';

interface ClassroomPageProps {
  lessonPlan: LessonPlan;
  initialAvatarId?: TeacherAvatarId;
  initialStepIndex?: number;
  onExit: () => void;
  onCompleteLesson: () => void;
  onStepProgress?: (stepIndex: number) => void;
}

export const ClassroomPage: React.FC<ClassroomPageProps> = ({
  lessonPlan,
  initialAvatarId = 'priya',
  initialStepIndex = 0,
  onExit,
  onCompleteLesson,
  onStepProgress
}) => {
  // 1. Derive or use enriched AI-generated scene sequence
  const scenes: VideoSceneItem[] = useMemo(() => {
    if (lessonPlan.scenes && lessonPlan.scenes.length > 0) {
      return lessonPlan.scenes;
    }

    // Fallback: Synthesize complete multi-shot scene sequence from steps
    const derived: VideoSceneItem[] = [];
    let sNum = 1;

    // Opening hook scene
    derived.push({
      id: 'scene_intro',
      step_index: 0,
      step_number: '01',
      scene_number: sNum++,
      scene_type: 'teacher_intro',
      duration_seconds: 8,
      narration: `Welcome! Today we will explore ${lessonPlan.title} from first principles with interactive visual models.`,
      narrationTranslations: {
        en: `Welcome! Today we will explore ${lessonPlan.title} step by step.`,
        hi: `नमस्ते! आज हम ${lessonPlan.title} को आसान तरीके से विजुअल्स के साथ समझेंगे।`,
        hinglish: `Welcome! Aaj hum ${lessonPlan.title} ko step-by-step visual models ke sath samjhenge.`
      },
      teacher_action: 'welcoming_gesture',
      camera_direction: 'medium shot, frontal camera',
      visual_type: 'concept_card',
      visual_data: {
        title: lessonPlan.title,
        points: ['Foundational Concepts', 'Interactive Demonstrations', 'Formative Checkpoints']
      },
      on_screen_text: `Topic: ${lessonPlan.title}`,
      educational_purpose: 'Establish learning goal and warm pedagogical rapport',
      quickCheck: null
    });

    // Step-by-step shots
    lessonPlan.steps.forEach((st, idx) => {
      const stepNumStr = st.stepNumber || (idx < 9 ? `0${idx + 1}` : `${idx + 1}`);

      // Shot A: Visual focus & model demonstration
      derived.push({
        id: `scene_${st.id}_visual`,
        step_index: idx,
        step_number: stepNumStr,
        scene_number: sNum++,
        scene_type: 'visual_explanation',
        duration_seconds: 12,
        narration: `Observe the visual model for ${st.concept}. Let's trace how the fundamental components behave.`,
        narrationTranslations: {
          en: `Observe the visual model for ${st.concept}. Let's trace how the fundamental components behave.`,
          hi: `${st.concept} के इस विजुअल मॉडल को ध्यान से देखिए।`,
          hinglish: `Dhyan se dekhiye: ${st.concept} ka visual model kaise react karta hai.`
        },
        teacher_action: 'points_right',
        camera_direction: 'split screen: teacher on left, visual model on right',
        visual_type: st.visualType,
        visual_data: st.visualData,
        on_screen_text: st.concept,
        educational_purpose: `Visual grounding for ${st.concept}`,
        quickCheck: null
      });

      // Shot B: Teacher detailed explanation
      derived.push({
        id: `scene_${st.id}_explain`,
        step_index: idx,
        step_number: stepNumStr,
        scene_number: sNum++,
        scene_type: 'teacher_and_visual',
        duration_seconds: 14,
        narration: st.teacherDialogue,
        narrationTranslations: st.dialogueTranslations,
        teacher_action: 'explaining_formula',
        camera_direction: 'picture-in-picture with active simulation',
        visual_type: st.visualType,
        visual_data: st.visualData,
        on_screen_text: `Principle: ${st.concept}`,
        educational_purpose: 'Conceptual breakdown and first-principles reasoning',
        quickCheck: null
      });

      // Shot C: Interactive check (if present on this step)
      if (st.quickCheck) {
        derived.push({
          id: `scene_${st.id}_check`,
          step_index: idx,
          step_number: stepNumStr,
          scene_number: sNum++,
          scene_type: 'question',
          duration_seconds: 10,
          narration: `Now let's check your understanding. ${st.quickCheck.question}`,
          narrationTranslations: {
            en: `Now let's check your understanding. ${st.quickCheck.question}`,
            hi: `आइए अपनी समझ को परखते हैं: ${st.quickCheck.question}`,
            hinglish: `Chaliye ab aapki understanding check karte hain: ${st.quickCheck.question}`
          },
          teacher_action: 'attentive_listening',
          camera_direction: 'medium close-up with interactive option overlay',
          visual_type: st.visualType,
          visual_data: st.visualData,
          on_screen_text: `Check: ${st.concept}`,
          educational_purpose: 'Formative diagnostic evaluation',
          quickCheck: st.quickCheck
        });
      }
    });

    // Summary scene
    derived.push({
      id: 'scene_summary',
      step_index: Math.max(0, lessonPlan.steps.length - 1),
      step_number: 'Summary',
      scene_number: sNum++,
      scene_type: 'teacher_summary',
      duration_seconds: 10,
      narration: `Outstanding effort! You have grasped the foundational concepts of ${lessonPlan.title}. Let's proceed to the assessment.`,
      narrationTranslations: {
        en: `Outstanding effort! You have grasped the foundational concepts of ${lessonPlan.title}. Let's proceed to the assessment.`,
        hi: `शानदार! आपने ${lessonPlan.title} के मुख्य सिद्धांतों को बहुत अच्छे से समझ लिया है।`,
        hinglish: `Bahut badiya! Aapne ${lessonPlan.title} ke core concepts master kar liye hain.`
      },
      teacher_action: 'encouraging_smile',
      camera_direction: 'medium shot, centered',
      visual_type: 'concept_card',
      visual_data: {
        title: 'Lesson Mastery Achieved!',
        points: ['Core Mechanisms Mastered', 'Interactive Checkpoints Cleared', 'Ready for Assessment']
      },
      on_screen_text: 'Lesson Mastery Achieved',
      educational_purpose: 'Affirm mastery and transition to final assessment',
      quickCheck: null
    });

    return derived;
  }, [lessonPlan]);

  // Scene state
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(() => {
    if (initialStepIndex > 0) {
      const matchIdx = scenes.findIndex(s => s.step_index === initialStepIndex);
      return matchIdx >= 0 ? matchIdx : 0;
    }
    return 0;
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(lessonPlan.language || 'hinglish');
  const [selectedAvatarId, setSelectedAvatarId] = useState<TeacherAvatarId>(initialAvatarId);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState<boolean>(true);
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');
  const [isAskTeacherOpen, setIsAskTeacherOpen] = useState<boolean>(false);

  // Active visual override during misconception remediation
  const [activeVisualOverride, setActiveVisualOverride] = useState<VisualType | null>(null);
  const [quickCheckPassed, setQuickCheckPassed] = useState<boolean>(false);

  const autoAdvanceTimerRef = useRef<any>(null);

  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const currentStepIndex = currentScene.step_index;
  const currentStep = lessonPlan.steps[currentStepIndex] || lessonPlan.steps[0];
  const teacherPersona = TEACHER_PERSONAS.find(p => p.id === selectedAvatarId) || TEACHER_PERSONAS[0];

  // Derive dialogue for current scene in chosen language
  const currentDialogue = 
    currentScene.narrationTranslations?.[currentLanguage] || 
    currentStep.dialogueTranslations?.[currentLanguage] || 
    currentScene.narration || 
    currentStep.teacherDialogue;

  // Derive avatar emotion from scene type and teacher action
  const avatarEmotion: AvatarEmotion = useMemo(() => {
    if (currentScene.scene_type === 'question') return 'curious';
    if (currentScene.scene_type === 'teacher_summary') return 'encouraging';
    if (currentScene.teacher_action?.includes('welcoming')) return 'encouraging';
    if (currentScene.teacher_action?.includes('attentive')) return 'curious';
    if (currentScene.teacher_action?.includes('points')) return 'confident';
    return 'confident';
  }, [currentScene]);

  // Notify parent of step progress
  useEffect(() => {
    onStepProgress?.(currentStepIndex);
  }, [currentStepIndex]);

  // Execute speech & auto-advance orchestration whenever scene or language changes
  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    setActiveVisualOverride(null);
    setQuickCheckPassed(false);

    const onSceneSpeechComplete = () => {
      // Auto-advance only if enabled, not on a question scene, and not on the last scene
      if (currentScene.scene_type !== 'question' && currentSceneIndex < scenes.length - 1) {
        if (autoAdvanceEnabled) {
          autoAdvanceTimerRef.current = setTimeout(() => {
            setCurrentSceneIndex(prev => Math.min(prev + 1, scenes.length - 1));
          }, 1200);
        }
      }
    };

    if (!isMuted) {
      triggerSpeech(currentDialogue, onSceneSpeechComplete);
    } else {
      setCurrentSubtitleText(currentDialogue);
      if (currentScene.scene_type !== 'question' && autoAdvanceEnabled && currentSceneIndex < scenes.length - 1) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          setCurrentSceneIndex(prev => Math.min(prev + 1, scenes.length - 1));
        }, (currentScene.duration_seconds || 8) * 1000);
      }
    }

    return () => {
      speechService.stop();
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [currentSceneIndex, currentLanguage, autoAdvanceEnabled]);

  const triggerSpeech = (text: string, onFinish?: () => void) => {
    if (isMuted) {
      setCurrentSubtitleText(text);
      if (onFinish) onFinish();
      return;
    }

    setCurrentSubtitleText(text);
    setAvatarState('speaking');

    speechService.speak(text, {
      lang: currentLanguage === 'hi' ? 'hi' : currentLanguage === 'te' ? 'te' : currentLanguage === 'hinglish' ? 'hinglish' : 'en',
      rate: playbackSpeed,
      voiceType: teacherPersona.voiceType,
      onStart: () => {
        setIsSpeaking(true);
        setAvatarState('speaking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setAvatarState('idle');
        if (onFinish) onFinish();
      },
      onStateChange: (speaking) => {
        setIsSpeaking(speaking);
        if (!speaking) setAvatarState('idle');
      }
    });
  };

  const handleTogglePlay = () => {
    if (isSpeaking) {
      speechService.pause();
      setIsSpeaking(false);
      setAvatarState('idle');
    } else {
      if (speechService.isSpeaking()) {
        speechService.resume();
        setIsSpeaking(true);
        setAvatarState('speaking');
      } else {
        triggerSpeech(currentDialogue);
      }
    }
  };

  const handleReplay = () => {
    triggerSpeech(currentDialogue);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      speechService.stop();
      setIsSpeaking(false);
      setAvatarState('idle');
      setIsMuted(true);
    } else {
      setIsMuted(false);
      triggerSpeech(currentDialogue);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (isSpeaking) {
      speechService.stop();
      triggerSpeech(currentDialogue);
    }
  };

  // Misconception handler triggered from InteractiveQuestionModal
  const handleMisconceptionTriggered = (misconception: string, analogyDialogue: string) => {
    setActiveVisualOverride('water_pipe_analogy');
    triggerSpeech(analogyDialogue);
  };

  const handleCorrectAnswer = () => {
    setQuickCheckPassed(true);
    const praise = "Excellent reasoning! You grasped the principle accurately. Let's continue.";
    triggerSpeech(praise, () => {
      if (autoAdvanceEnabled && currentSceneIndex < scenes.length - 1) {
        setTimeout(() => {
          setCurrentSceneIndex(prev => prev + 1);
        }, 1200);
      }
    });
  };

  const handleTeacherAnswerFromDrawer = (answerText: string) => {
    triggerSpeech(answerText);
  };

  const isQuestionScene = currentScene.scene_type === 'question' || Boolean(currentScene.quickCheck);
  const canGoNext = !isQuestionScene || quickCheckPassed;
  const isLastScene = currentSceneIndex === scenes.length - 1;

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    }
  };

  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  const activeVisualType = activeVisualOverride || currentScene.visual_type || currentStep.visualType;
  const activeVisualData = currentScene.visual_data || currentStep.visualData;

  return (
    <div id="ai-teacher-virtual-classroom" className="fixed inset-0 z-50 bg-[#F5F7F8] text-[#17232D] flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <ClassroomTopBar
        lessonTitle={lessonPlan.title}
        subject={lessonPlan.subject}
        currentStepIndex={currentStepIndex}
        totalSteps={lessonPlan.steps.length}
        currentConcept={currentStep.concept}
        currentSceneIndex={currentSceneIndex}
        totalScenes={scenes.length}
        sceneType={currentScene.scene_type}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onExit={onExit}
      />

      {/* Main Classroom Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 overflow-y-auto">
        {/* Left Column: Animated AI Teacher Avatar with Real-Time Lip-Sync */}
        <div className="lg:col-span-5 h-[340px] lg:h-full flex flex-col">
          <RealisticTeacherAvatar
            avatarId={selectedAvatarId}
            emotion={avatarEmotion}
            state={avatarState}
            isSpeaking={isSpeaking}
            teacherAction={currentScene.teacher_action}
            onAvatarChange={setSelectedAvatarId}
            className="flex-1 w-full"
          />
        </div>

        {/* Right Column: AI Scene Visual Stage & Question Modal */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-[380px] lg:h-full relative">
          {/* Active Visual Model Stage */}
          <div className="flex-1 min-h-[320px] relative rounded-2xl overflow-hidden border border-[#DCE4EC] bg-white shadow-xs flex flex-col">
            {/* On-Screen Text Card Overlay (Shot Title) */}
            {currentScene.on_screen_text && (
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-[#DCE4EC] shadow-xs text-xs font-semibold text-[#17232D] animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="w-2 h-2 rounded-full bg-[#4F7CAC] animate-pulse" />
                <span className="text-[#61707C] font-mono text-[11px]">Shot {currentSceneIndex + 1}:</span>
                <span>{currentScene.on_screen_text}</span>
              </div>
            )}

            <TeachingVisual
              type={activeVisualType}
              data={activeVisualData}
              className="h-full w-full"
            />
          </div>

          {/* Interactive Checkpoint Modal (Pauses auto-flow at question scenes) */}
          {(currentScene.quickCheck || (currentScene.scene_type === 'question' && currentStep.quickCheck)) && (
            <div className="w-full">
              <InteractiveQuestionModal
                quickCheck={currentScene.quickCheck || currentStep.quickCheck!}
                lessonId={lessonPlan.id}
                concept={currentStep.concept}
                onCorrectAnswer={handleCorrectAnswer}
                onMisconceptionTriggered={handleMisconceptionTriggered}
                onShowWaterPipeAnalogy={() => setActiveVisualOverride('water_pipe_analogy')}
              />
            </div>
          )}
        </div>
      </main>

      {/* Classroom Bottom Control Bar & Auto-Flow Controls */}
      <ClassroomBottomBar
        currentSubtitle={currentSubtitleText}
        isPlaying={isSpeaking}
        onTogglePlay={handleTogglePlay}
        onReplay={handleReplay}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        playbackSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
        captionsEnabled={captionsEnabled}
        onToggleCaptions={() => setCaptionsEnabled(!captionsEnabled)}
        autoAdvanceEnabled={autoAdvanceEnabled}
        onToggleAutoAdvance={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onOpenAskTeacher={() => setIsAskTeacherOpen(true)}
        canGoPrevious={currentSceneIndex > 0}
        canGoNext={canGoNext}
        onPreviousScene={handlePreviousScene}
        onNextScene={handleNextScene}
        isLastScene={isLastScene}
        onStartAssessment={onCompleteLesson}
      />

      {/* Live Ask Teacher Doubt Solver Drawer */}
      {isAskTeacherOpen && (
        <AskTeacherDrawer
          lessonId={lessonPlan.id}
          lessonTitle={lessonPlan.title}
          currentConcept={currentStep.concept}
          currentLanguage={currentLanguage}
          onTeacherAnswer={handleTeacherAnswerFromDrawer}
          onClose={() => setIsAskTeacherOpen(false)}
        />
      )}
    </div>
  );
};
