export type UserLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningLevel = UserLevel;

export type LearningGoal = 
  | 'understand_concept' 
  | 'exam_prep' 
  | 'interview_prep' 
  | 'practical_application' 
  | 'deep_understanding';

export type LanguageCode = 'en' | 'hi' | 'te' | 'hinglish' | 'es' | 'fr' | 'de';

export type LessonDuration = '5m' | '10m' | '20m' | '30m' | '60m';
export type DurationOption = LessonDuration;

export type TeachingStyle = 'simple_visual' | 'example_based' | 'interactive' | 'detailed';

export type TeacherPersonality = 
  | 'friendly_mentor' 
  | 'strict_professor' 
  | 'visual_teacher' 
  | 'interview_coach' 
  | 'patient_beginner' 
  | 'exam_coach';

export type StudentEmotionState = 
  | 'confident' 
  | 'confused' 
  | 'frustrated' 
  | 'engaged' 
  | 'hesitant' 
  | 'bored' 
  | 'struggling';

export type TeacherAvatarId = 'priya' | 'marcus' | 'aditi' | 'david';

export type AvatarEmotion = 
  | 'confident' 
  | 'curious' 
  | 'encouraging' 
  | 'patient' 
  | 'reassuring' 
  | 'thinking' 
  | 'listening';

export type AvatarState = 'speaking' | 'listening' | 'thinking' | 'idle';

export type VisualType = 
  | 'circuit_simulation' 
  | 'physics_simulation'
  | 'math_equation' 
  | 'biology_diagram' 
  | 'code_runner' 
  | 'chemistry_visual'
  | 'timeline' 
  | 'api_workflow'
  | 'architecture_diagram' 
  | 'water_pipe_analogy'
  | 'concept_card';

export type AppScreen = 
  | 'landing' 
  | 'login'
  | 'signup'
  | 'dashboard' 
  | 'create_lesson' 
  | 'personalize' 
  | 'lesson_plan' 
  | 'classroom' 
  | 'assessment' 
  | 'learning_report' 
  | 'progress' 
  | 'path' 
  | 'materials' 
  | 'settings';

export interface QuickCheckOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionExplanation?: string;
}

export interface QuickCheck {
  id: string;
  question: string;
  options: QuickCheckOption[];
  remediationMisconceptionIdentified: string;
  remediationAnalogy: string;
  remediationDialogue: string;
  remediationVisualType?: VisualType;
  remediationVisualData?: any;
  remediationRetryQuestion?: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
}

export type SceneType = 
  | 'teacher_intro' 
  | 'visual_explanation' 
  | 'teacher_and_visual' 
  | 'demonstration' 
  | 'question' 
  | 'teacher_summary';

export interface VideoSceneItem {
  id: string;
  step_index: number;
  step_number: string;
  scene_number: number;
  scene_type: SceneType;
  duration_seconds: number;
  narration: string;
  narrationTranslations?: Partial<Record<LanguageCode | string, string>>;
  teacher_action: string;
  camera_direction: string;
  visual_type?: VisualType;
  visual_data?: any;
  on_screen_text?: string;
  educational_purpose: string;
  quickCheck?: QuickCheck | null;
}

export interface LessonStep {
  id: string;
  stepNumber: string;
  title: string;
  concept: string;
  estimatedMinutes: number;
  teacherDialogue: string;
  dialogueTranslations?: Partial<Record<LanguageCode | string, string>>;
  subtitles?: { text: string; start: number; end: number }[];
  visualType: VisualType;
  visualData: any;
  quickCheck?: QuickCheck;
  scenes?: VideoSceneItem[];
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  category: string;
  sourceType?: 'topic' | 'document';
  sourceName?: string;
  level: UserLevel;
  goal?: LearningGoal;
  language: LanguageCode;
  duration: LessonDuration;
  style?: TeachingStyle;
  teacherPersonality?: TeacherPersonality;
  teacherAvatarId?: TeacherAvatarId;
  examTargetDate?: string;
  examTargetScore?: string;
  steps: LessonStep[];
  scenes?: VideoSceneItem[];
  totalEstimatedMinutes?: number;
  total_duration_seconds?: number;
  createdAt?: string;
}

export interface HomeworkExercise {
  id: string;
  concept: string;
  taskTitle: string;
  instruction: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  whyAssigned: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'conceptual' | 'short_answer' | 'application' | 'problem_solving';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  conceptTested: string;
}

export interface LearningReportData {
  lessonId: string;
  lessonTitle: string;
  subject: string;
  overallScore: number;
  conceptMastery: { concept: string; score: number }[];
  strongAreas: string[];
  needsImprovement: string[];
  teacherFeedback: string;
  recommendedNextSteps: string[];
  homeworkExercises?: HomeworkExercise[];
  date: string;
}

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  concept: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isKnown?: boolean;
  isDifficult?: boolean;
}

export interface ConceptMapNode {
  id: string;
  label: string;
  description: string;
  category: string;
  connections: string[];
}

export interface ConceptMapData {
  central_topic: string;
  nodes: ConceptMapNode[];
}

export interface StructuredLessonNotes {
  title: string;
  overview: string;
  key_concepts: { concept: string; summary: string; takeaway?: string }[];
  formulas_and_definitions: { term: string; definition: string }[];
  common_mistakes: { mistake: string; correction: string }[];
  summary: string;
}

export interface RecentLessonItem {
  id: string;
  title: string;
  subject: string;
  score: number;
  duration: string;
  date: string;
  status?: string;
}

export interface StudentProfile {
  name: string;
  email?: string;
  level: UserLevel;
  preferredLanguage: LanguageCode;
  selectedAvatar: TeacherAvatarId;
  overallMastery: number;
  completedLessons: number;
  learningTimeHours: number;
  masteredConceptsCount: number;
  recentLessons: RecentLessonItem[];
  voiceSpeed: number;
  voicePitch?: number;
  captionsEnabled: boolean;
  reducedMotion?: boolean;
  fontSize?: 'normal' | 'large';
  volume?: number;
  soundEnabled?: boolean;
  learningStreak?: number;
  questionsAnswered?: number;
  educationLevel?: string;
  learningGoal?: LearningGoal;
  teachingStyle?: TeachingStyle;
}

export interface InProgressLesson {
  id: string;
  title: string;
  subject: string;
  category: string;
  level: string;
  language: string;
  duration: string;
  currentStepIndex: number;
  totalSteps: number;
  currentConcept: string;
  progressPercentage: number;
  lastPosition?: string;
  steps: LessonStep[];
  updatedAt: string;
}

export interface UserDataBundle {
  profile: StudentProfile;
  inProgressLesson: InProgressLesson | null;
  documents: UploadedMaterial[];
  assessments: LearningReportData[];
  conceptMastery: { concept: string; score: number; status?: string }[];
  learningPath: LearningPath;
  learningHistory: {
    id: string;
    lessonTitle: string;
    subject: string;
    score?: number;
    activityType: 'completed_lesson' | 'quiz_attempt' | 'material_uploaded';
    timestamp: string;
    date: string;
  }[];
}

export interface LearningPathNode {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'locked';
  estimatedHours: number;
  description: string;
  subTopics?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  category: string;
  description: string;
  nodes: LearningPathNode[];
}

export interface LearningPathItem {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  score?: number;
  topicsCount: number;
  description: string;
}

export interface UploadedMaterial {
  id: string;
  name: string;
  title?: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'TXT' | 'PAPER';
  size: string;
  pages?: number;
  uploadedAt: string;
  status: 'ready' | 'processing' | 'indexed';
  keyConceptsExtracted?: string[];
  summary?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'txt' | 'paper';
  size: string;
  pages?: number;
  uploadDate: string;
  status: 'ready' | 'processing' | 'indexed';
  conceptsExtracted: string[];
  progress: number;
  summary?: string;
}

export interface TeacherPersona {
  id: TeacherAvatarId;
  name: string;
  role: string;
  specialty: string;
  languages: string[];
  bio: string;
  avatarImage: string;
  accentColor: string;
  voiceType: 'female' | 'male';
}
