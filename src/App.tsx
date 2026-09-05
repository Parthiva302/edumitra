import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  AppScreen, 
  LessonPlan, 
  StudentProfile, 
  TeacherAvatarId, 
  LanguageCode, 
  UploadedMaterial, 
  LearningReportData,
  LearningLevel,
  LearningGoal,
  DurationOption,
  TeachingStyle,
  InProgressLesson,
  LearningPath,
  UserDataBundle
} from './types';
import { 
  DEMO_LESSON_PLAN, 
  DEMO_LEARNING_REPORT, 
  DEMO_ASSESSMENT_QUESTIONS,
  DEMO_STUDENT_PROFILE
} from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { getStoredSession, clearStoredSession, AuthUser } from './utils/auth';
import { api } from './services/api';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CreateLessonPage } from './components/create/CreateLessonPage';
import { PersonalizePage } from './components/personalize/PersonalizePage';
import { LessonPlanningScreen } from './components/planner/LessonPlanningScreen';
import { ClassroomPage } from './components/classroom/ClassroomPage';
import { AssessmentPage } from './components/assessment/AssessmentPage';
import { LearningReportPage } from './components/report/LearningReportPage';
import { ProgressPage } from './components/progress/ProgressPage';
import { LearningPathPage } from './components/path/LearningPathPage';
import { MaterialsPage } from './components/materials/MaterialsPage';
import { SettingsPage } from './components/settings/SettingsPage';

const EMPTY_STUDENT_PROFILE: StudentProfile = {
  name: '',
  email: '',
  level: 'intermediate',
  preferredLanguage: 'hinglish',
  selectedAvatar: 'priya',
  overallMastery: 0,
  completedLessons: 0,
  learningTimeHours: 0,
  masteredConceptsCount: 0,
  recentLessons: [],
  voiceSpeed: 1,
  captionsEnabled: true
};

export function App() {
  // Session & Authentication state (persisted across refresh)
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(() => getStoredSession());

  // Navigation screen state - starts on 'landing' if not authenticated, 'dashboard' if authenticated
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const session = getStoredSession();
    return session ? 'dashboard' : 'landing';
  });

  // Core Dynamic Data States (loaded from backend for authenticated user)
  const [student, setStudent] = useState<StudentProfile>(() => {
    const session = getStoredSession();
    if (session) {
      return {
        ...EMPTY_STUDENT_PROFILE,
        name: session.name,
        email: session.email
      };
    }
    return EMPTY_STUDENT_PROFILE;
  });

  const [inProgressLesson, setInProgressLesson] = useState<InProgressLesson | null>(null);
  const [activeLessonPlan, setActiveLessonPlan] = useState<LessonPlan>(DEMO_LESSON_PLAN);
  const [activeReport, setActiveReport] = useState<LearningReportData>(DEMO_LEARNING_REPORT);
  const [assessmentQuestions, setAssessmentQuestions] = useState<any[]>(DEMO_ASSESSMENT_QUESTIONS);
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | undefined>(undefined);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false);
  
  // Customization & Teacher Preferences
  const [selectedAvatarId, setSelectedAvatarId] = useState<TeacherAvatarId>('priya');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hinglish');

  // Draft Creation parameters
  const [draftTopic, setDraftTopic] = useState<string>("Electricity & Ohm's Law");
  const [draftMaterial, setDraftMaterial] = useState<UploadedMaterial | null>(null);

  // Load fresh user data bundle from backend on mount or session change
  useEffect(() => {
    let isMounted = true;
    const loadUserData = async () => {
      const session = getStoredSession();
      if (!session) return;
      setIsLoadingUserData(true);
      try {
        const bundle = await api.getUserData();
        if (bundle && isMounted) {
          if (bundle.profile) setStudent(bundle.profile);
          if (bundle.inProgressLesson !== undefined) setInProgressLesson(bundle.inProgressLesson);
          if (bundle.documents) setMaterials(bundle.documents);
          if (bundle.learningPath) setLearningPath(bundle.learningPath);
        }
      } catch (err) {
        console.error('Failed to load user bundle:', err);
        if (err instanceof Error && (err.message.toLowerCase().includes('authorized') || err.message.toLowerCase().includes('not authenticated'))) {
          clearStoredSession();
          if (isMounted) {
            setSessionUser(null);
            setCurrentScreen('landing');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingUserData(false);
        }
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [sessionUser?.id]);

  const handleAuthSuccess = (user: AuthUser, userData?: UserDataBundle) => {
    setSessionUser(user);
    if (userData) {
      if (userData.profile) setStudent(userData.profile);
      setInProgressLesson(userData.inProgressLesson || null);
      setMaterials(userData.documents || []);
      if (userData.learningPath) setLearningPath(userData.learningPath);
    } else {
      setStudent(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    }
    clearStoredSession();
    setSessionUser(null);
    setStudent(EMPTY_STUDENT_PROFILE);
    setInProgressLesson(null);
    setMaterials([]);
    setCurrentScreen('landing');
  };

  const protectedScreens: AppScreen[] = [
    'dashboard', 
    'create_lesson', 
    'personalize', 
    'lesson_plan', 
    'classroom', 
    'assessment', 
    'learning_report', 
    'progress', 
    'path', 
    'materials', 
    'settings'
  ];

  const handleNavigate = (screen: AppScreen) => {
    if (!sessionUser && protectedScreens.includes(screen)) {
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen(screen);
  };

  // Handlers for Navigation & Lesson Creation flow
  const handleStartNewLesson = () => {
    setCurrentScreen('create_lesson');
  };

  const handleStartWithTopic = (topic: string) => {
    setDraftTopic(topic);
    setDraftMaterial(null);
    setCurrentScreen('personalize');
  };

  const handleStartWithMaterial = (material: UploadedMaterial) => {
    setDraftMaterial(material);
    setDraftTopic(material.name.replace(/\.[^/.]+$/, ''));
    setMaterials(prev => {
      if (prev.some(m => m.id === material.id)) return prev;
      return [material, ...prev];
    });
    api.addMaterial(material).catch(err => console.warn('Could not save material to server:', err));
    setCurrentScreen('personalize');
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    api.deleteMaterial(materialId).catch(err => console.warn('Could not delete material from server:', err));
  };

  const handleGenerateLesson = async (preferences: {
    level: LearningLevel;
    goal: LearningGoal;
    language: LanguageCode;
    duration: DurationOption;
    style: TeachingStyle;
  }) => {
    setSelectedLanguage(preferences.language);
    setIsLoadingUserData(true);

    let generatedPlan: LessonPlan;

    try {
      generatedPlan = await api.createLesson({
        topic: draftTopic,
        materialId: draftMaterial?.id,
        documentText: draftMaterial ? `Document: ${draftMaterial.name}` : undefined,
        level: preferences.level,
        goal: preferences.goal,
        language: preferences.language,
        duration: preferences.duration,
        style: preferences.style
      });
    } catch (err) {
      console.warn('Fallback generating lesson:', err);
      generatedPlan = {
        ...DEMO_LESSON_PLAN,
        title: draftTopic,
        level: preferences.level,
        language: preferences.language,
        duration: preferences.duration
      };
    } finally {
      setIsLoadingUserData(false);
    }

    setActiveLessonPlan(generatedPlan);

    // Save initial in-progress state to backend for persistent resume
    const inProgressData: InProgressLesson = {
      id: generatedPlan.id,
      title: generatedPlan.title,
      subject: generatedPlan.subject,
      category: generatedPlan.category,
      level: generatedPlan.level,
      language: generatedPlan.language,
      duration: generatedPlan.duration,
      currentStepIndex: 0,
      totalSteps: generatedPlan.steps.length,
      currentConcept: generatedPlan.steps[0]?.concept || generatedPlan.title,
      progressPercentage: Math.round((1 / Math.max(1, generatedPlan.steps.length)) * 100),
      updatedAt: new Date().toISOString(),
      steps: generatedPlan.steps
    };
    setInProgressLesson(inProgressData);
    api.saveLessonProgress(inProgressData).catch(err => console.warn('Could not save in-progress state:', err));

    setCurrentScreen('lesson_plan');
  };

  const handleLaunchJudgeDemo = () => {
    // 1. Authenticate Judge Demo Session
    const demoUser: AuthUser = {
      id: 'usr_judge_eval_01',
      name: 'Aryan Verma (Judge Demo)',
      email: 'judge.evaluator@edumitra.ai'
    };
    setSessionUser(demoUser);

    // 2. Configure Student Profile matching Hackathon Judge specifications
    const demoProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      name: 'Aryan Verma (Judge Demo)',
      level: 'beginner',
      preferredLanguage: 'hinglish',
      educationLevel: 'high_school',
      learningGoal: 'understand_concept',
      teachingStyle: 'simple_visual',
      overallMastery: 78,
      completedLessons: 6,
      learningTimeHours: 12.5,
      masteredConceptsCount: 14
    };
    setStudent(demoProfile);
    setSelectedAvatarId('priya');
    setSelectedLanguage('hinglish');

    // 3. Populate Uploaded Textbook Material
    const demoDoc: UploadedMaterial = {
      id: 'doc_judge_physics_01',
      name: 'NCERT Class 10 Physics - Chapter 4: Electricity.pdf',
      title: 'NCERT Class 10 Physics - Chapter 4: Electricity',
      size: '2.4 MB',
      pages: 18,
      uploadedAt: 'Just now',
      type: 'PDF',
      status: 'ready',
      keyConceptsExtracted: ["Ohm's Law", 'Electric Potential & Voltage', 'Resistance & Resistivity', 'Circuit Analogy'],
      summary: 'Foundational physics textbook chapter covering current, potential difference, and circuit behavior.'
    };
    setDraftMaterial(demoDoc);
    setDraftTopic("Electricity & Ohm's Law (Chapter 4)");
    setMaterials(prev => [demoDoc, ...prev.filter(m => m.id !== demoDoc.id)]);

    // 4. Set Active Lesson Plan with Circuit Simulation & Diagnostic Misconception Check
    setActiveLessonPlan(DEMO_LESSON_PLAN);
    setActiveReport(DEMO_LEARNING_REPORT);
    setAssessmentQuestions(DEMO_ASSESSMENT_QUESTIONS);

    // 5. Save in-progress state and transition to classroom
    const inProgressData: InProgressLesson = {
      id: DEMO_LESSON_PLAN.id,
      title: DEMO_LESSON_PLAN.title,
      subject: DEMO_LESSON_PLAN.subject,
      category: DEMO_LESSON_PLAN.category,
      level: DEMO_LESSON_PLAN.level,
      language: DEMO_LESSON_PLAN.language,
      duration: DEMO_LESSON_PLAN.duration,
      currentStepIndex: 0,
      totalSteps: DEMO_LESSON_PLAN.steps.length,
      currentConcept: DEMO_LESSON_PLAN.steps[0]?.concept || DEMO_LESSON_PLAN.title,
      progressPercentage: 20,
      updatedAt: new Date().toISOString(),
      steps: DEMO_LESSON_PLAN.steps
    };
    setInProgressLesson(inProgressData);

    setCurrentScreen('classroom');
  };

  const handleStartClassroom = () => {
    setCurrentScreen('classroom');
  };

  const handleStepProgress = (stepIndex: number) => {
    if (!activeLessonPlan) return;
    const progress: InProgressLesson = {
      id: activeLessonPlan.id,
      title: activeLessonPlan.title,
      subject: activeLessonPlan.subject,
      category: activeLessonPlan.category,
      level: activeLessonPlan.level,
      language: activeLessonPlan.language,
      duration: activeLessonPlan.duration,
      currentStepIndex: stepIndex,
      totalSteps: activeLessonPlan.steps.length,
      currentConcept: activeLessonPlan.steps[stepIndex]?.concept || activeLessonPlan.title,
      progressPercentage: Math.round(((stepIndex + 1) / Math.max(1, activeLessonPlan.steps.length)) * 100),
      updatedAt: new Date().toISOString(),
      steps: activeLessonPlan.steps
    };
    setInProgressLesson(progress);
    api.saveLessonProgress(progress).catch(err => console.warn('Could not save step progress:', err));
  };

  const handleContinueActiveLesson = (savedLesson?: InProgressLesson | null) => {
    const lessonToResume = savedLesson || inProgressLesson;
    if (lessonToResume && lessonToResume.steps && lessonToResume.steps.length > 0) {
      setActiveLessonPlan({
        id: lessonToResume.id,
        title: lessonToResume.title,
        subject: lessonToResume.subject,
        category: lessonToResume.category,
        level: (lessonToResume.level as LearningLevel) || 'Intermediate',
        language: (lessonToResume.language as LanguageCode) || selectedLanguage,
        duration: (lessonToResume.duration as DurationOption) || '15_min',
        steps: lessonToResume.steps
      });
      setCurrentScreen('classroom');
    } else {
      setCurrentScreen('create_lesson');
    }
  };

  const handleCompleteClassroom = async () => {
    setIsLoadingUserData(true);
    try {
      const concepts = activeLessonPlan.steps.map(s => s.concept);
      const res = await api.generateAssessment({
        lessonId: activeLessonPlan.id,
        topic: activeLessonPlan.title,
        concepts,
        level: activeLessonPlan.level,
        count: 4
      });
      if (res.questions && res.questions.length > 0) {
        setAssessmentQuestions(res.questions);
      }
    } catch (err) {
      console.warn('Could not generate dynamic assessment questions:', err);
    } finally {
      setIsLoadingUserData(false);
      setCurrentScreen('assessment');
    }
  };

  const handleAssessmentComplete = async (report: LearningReportData) => {
    setActiveReport(report);
    try {
      const updatedBundle = await api.recordAssessment(report);
      if (updatedBundle && updatedBundle.profile) {
        setStudent(updatedBundle.profile);
        setInProgressLesson(updatedBundle.inProgressLesson || null);
      } else {
        setStudent(prev => ({
          ...prev,
          completedLessons: prev.completedLessons + 1,
          overallMastery: Math.min(Math.round((prev.overallMastery + report.overallScore) / 2), 98),
          masteredConceptsCount: prev.masteredConceptsCount + (report.strongAreas?.length || 1)
        }));
        setInProgressLesson(null);
      }
    } catch (err) {
      console.error('Failed to save assessment to backend:', err);
      setStudent(prev => ({
        ...prev,
        completedLessons: prev.completedLessons + 1,
        overallMastery: Math.min(Math.round((prev.overallMastery + report.overallScore) / 2), 98),
        masteredConceptsCount: prev.masteredConceptsCount + (report.strongAreas?.length || 1)
      }));
      setInProgressLesson(null);
    }
    setCurrentScreen('learning_report');
  };

  const handleSaveProfile = async (newName: string) => {
    setStudent(prev => ({ ...prev, name: newName }));
    setSessionUser(prev => prev ? { ...prev, name: newName } : null);
    try {
      await api.updateProfile({ name: newName });
    } catch (err) {
      console.error('Failed to update profile on backend:', err);
    }
  };

  // Dedicated Public Screens & App Root with Page Transitions
  return (
    <AnimatePresence mode="wait">
      {/* Loading Overlay when syncing user data */}
      {isLoadingUserData && (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-xs flex items-center justify-center font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#4F7CAC] border-t-transparent animate-spin" />
            <span className="text-xs font-medium text-[#61707C]">Syncing your personalized profile...</span>
          </div>
        </div>
      )}

      {currentScreen === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen"
        >
          <LandingPage
            onNavigateLogin={() => setCurrentScreen('login')}
            onNavigateSignUp={() => setCurrentScreen('signup')}
            onLaunchJudgeDemo={handleLaunchJudgeDemo}
          />
        </motion.div>
      )}

      {currentScreen === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen"
        >
          <LoginPage
            onAuthSuccess={handleAuthSuccess}
            onNavigateSignUp={() => setCurrentScreen('signup')}
            onNavigateHome={() => setCurrentScreen('landing')}
          />
        </motion.div>
      )}

      {currentScreen === 'signup' && (
        <motion.div
          key="signup"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen"
        >
          <SignUpPage
            onAuthSuccess={handleAuthSuccess}
            onNavigateLogin={() => setCurrentScreen('login')}
            onNavigateHome={() => setCurrentScreen('landing')}
          />
        </motion.div>
      )}

      {/* Route protection guard for unauthenticated users accessing protected screens */}
      {!sessionUser && protectedScreens.includes(currentScreen) && (
        <motion.div
          key="unauth-fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          <LandingPage
            onNavigateLogin={() => setCurrentScreen('login')}
            onNavigateSignUp={() => setCurrentScreen('signup')}
            onLaunchJudgeDemo={handleLaunchJudgeDemo}
          />
        </motion.div>
      )}

      {/* Full Screen Virtual Classroom Render */}
      {currentScreen === 'classroom' && (
        <motion.div
          key="classroom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          <ClassroomPage
            lessonPlan={activeLessonPlan}
            initialAvatarId={selectedAvatarId}
            initialStepIndex={inProgressLesson?.id === activeLessonPlan.id ? inProgressLesson.currentStepIndex : 0}
            onStepProgress={handleStepProgress}
            onExit={() => setCurrentScreen('dashboard')}
            onCompleteLesson={handleCompleteClassroom}
          />
        </motion.div>
      )}

      {/* Full Screen Assessment */}
      {currentScreen === 'assessment' && (
        <motion.div
          key="assessment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          <AssessmentPage
            lessonTitle={activeLessonPlan.title}
            subject={activeLessonPlan.subject}
            questions={assessmentQuestions}
            onComplete={handleAssessmentComplete}
            onBackToClassroom={() => setCurrentScreen('classroom')}
          />
        </motion.div>
      )}

      {/* Authenticated Dashboard & Educational Workspace */}
      {sessionUser && !['landing', 'login', 'signup', 'classroom', 'assessment'].includes(currentScreen) && (
        <motion.div
          key="app-workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen bg-[#F5F7F8] text-[#17232D] flex flex-col font-sans selection:bg-[#4F7CAC] selection:text-white"
        >
          {/* Global Navigation Bar */}
          <Navbar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            student={student}
            onStartNewLesson={handleStartNewLesson}
            onLogout={handleLogout}
            onLaunchJudgeDemo={handleLaunchJudgeDemo}
          />

          {/* Main View Container with Smooth Transitions */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {currentScreen === 'dashboard' && (
                  <DashboardPage
                    student={student}
                    inProgressLesson={inProgressLesson}
                    onNavigateToUpload={() => setCurrentScreen('create_lesson')}
                    onNavigateToTopic={(topic) => {
                      if (topic) setDraftTopic(topic);
                      setCurrentScreen('personalize');
                    }}
                    onContinueActiveLesson={handleContinueActiveLesson}
                    onReviewLesson={(_lessonId) => {
                      setCurrentScreen('learning_report');
                    }}
                  />
                )}

                {currentScreen === 'create_lesson' && (
                  <CreateLessonPage
                    initialTopic={draftTopic}
                    onStartWithTopic={handleStartWithTopic}
                    onStartWithMaterial={handleStartWithMaterial}
                  />
                )}

                {currentScreen === 'personalize' && (
                  <PersonalizePage
                    topicOrDocumentTitle={draftMaterial ? draftMaterial.name : draftTopic}
                    isDocument={Boolean(draftMaterial)}
                    isGenerating={isLoadingUserData}
                    onBack={() => setCurrentScreen('create_lesson')}
                    onGenerateLesson={handleGenerateLesson}
                  />
                )}

                {currentScreen === 'lesson_plan' && (
                  <LessonPlanningScreen
                    lessonPlan={activeLessonPlan}
                    onStartTeaching={handleStartClassroom}
                  />
                )}

                {currentScreen === 'learning_report' && (
                  <LearningReportPage
                    report={activeReport}
                    onContinueLearning={() => setCurrentScreen('dashboard')}
                    onRetakeLesson={() => setCurrentScreen('classroom')}
                  />
                )}

                {currentScreen === 'progress' && (
                  <ProgressPage
                    student={student}
                    onNavigateToTopic={(topic) => {
                      setDraftTopic(topic);
                      setCurrentScreen('personalize');
                    }}
                  />
                )}

                {currentScreen === 'path' && (
                  <LearningPathPage
                    path={learningPath}
                    onStartLesson={(topic) => {
                      setDraftTopic(topic);
                      setCurrentScreen('personalize');
                    }}
                  />
                )}

                {currentScreen === 'materials' && (
                  <MaterialsPage
                    materials={materials}
                    onUploadNew={() => setCurrentScreen('create_lesson')}
                    onTeachFromMaterial={(mat) => handleStartWithMaterial(mat)}
                    onDeleteMaterial={handleDeleteMaterial}
                  />
                )}

                {currentScreen === 'settings' && (
                  <SettingsPage
                    student={student}
                    selectedAvatarId={selectedAvatarId}
                    defaultLanguage={selectedLanguage}
                    onUpdateAvatar={setSelectedAvatarId}
                    onUpdateLanguage={setSelectedLanguage}
                    onSaveProfile={handleSaveProfile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Global Minimal Footer */}
          <footer className="w-full border-t border-[#DCE4EC] bg-white py-6 px-4 text-xs text-[#61707C] select-none mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#17232D]">EduMitra</span>
                <span className="text-[#B5C1C9]">·</span>
                <span>Your Personal AI Teacher</span>
              </div>
              <div className="text-[#8D9AA6]">
                <span>Learn. Interact. Adapt.</span>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
