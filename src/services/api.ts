import { 
  UserDataBundle, 
  UploadedMaterial, 
  InProgressLesson, 
  LearningReportData,
  LessonPlan,
  StudentProfile,
  StructuredLessonNotes,
  FlashcardItem,
  ConceptMapData,
  LearningPath
} from '../types';

let authToken: string | null = null;
const TOKEN_KEY = 'edumitra_auth_token';

// Try to load cached token
if (typeof window !== 'undefined') {
  try {
    authToken = localStorage.getItem(TOKEN_KEY);
  } catch {}
}

export const setAuthToken = (token: string) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  }
};

export const formatApiError = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join(', ') || fallback;
  }
  if (typeof data.error === 'string') return data.error;
  if (typeof data.message === 'string') return data.message;
  return fallback;
};

export const clearAuthToken = () => {
  authToken = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
};

export const getAuthToken = () => {
  if (!authToken && typeof window !== 'undefined') {
    try {
      authToken = localStorage.getItem(TOKEN_KEY);
    } catch {}
  }
  return authToken;
};

const getHeaders = (isJson: boolean = true): HeadersInit => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Login failed.');
    }
    setAuthToken(data.token);
    return data;
  },

  register: async (name: string, email: string, password: string, _confirm?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed.');
    }
    setAuthToken(data.token);
    return data;
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {}
    clearAuthToken();
    return true;
  },

  // Progress & Full User Bundle
  getUserData: async (): Promise<UserDataBundle> => {
    const res = await fetch('/api/progress', {
      headers: getHeaders()
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Not authorized');
      }
      throw new Error('Failed to load user bundle');
    }
    return await res.json();
  },

  // Materials & Upload
  uploadMaterial: async (file: File): Promise<UploadedMaterial> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please log in or sign up first to upload learning materials.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/materials/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(formatApiError(err, 'Failed to upload document'));
    }
    return await res.json();
  },

  addMaterial: async (material: UploadedMaterial) => {
    return material;
  },

  deleteMaterial: async (materialId: string) => {
    const res = await fetch(`/api/materials/${materialId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // Lesson Generation & Progression
  createLesson: async (params: {
    topic: string;
    materialId?: string;
    documentText?: string;
    level: string;
    goal: string;
    language: string;
    duration: string;
    style: string;
    depth?: string;
  }): Promise<LessonPlan> => {
    const res = await fetch('/api/lessons/create', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        topic: params.topic,
        material_id: params.materialId,
        document_text: params.documentText,
        level: params.level,
        goal: params.goal,
        language: params.language,
        duration: params.duration,
        style: params.style,
        depth: params.depth
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate lesson plan');
    }
    return await res.json();
  },

  generateVideoScenePlan: async (params: {
    lessonId: string;
    title: string;
    subject: string;
    steps: any[];
    language?: string;
  }) => {
    const res = await fetch('/api/video/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: params.lessonId,
        title: params.title,
        subject: params.subject,
        steps: params.steps,
        language: params.language || 'hinglish'
      })
    });
    if (!res.ok) throw new Error('Failed to generate video scene plan');
    return await res.json();
  },

  saveLessonProgress: async (progress: InProgressLesson) => {
    const res = await fetch('/api/lessons/progress', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: progress.id,
        current_step_index: progress.currentStepIndex,
        total_steps: progress.totalSteps,
        current_concept: progress.currentConcept,
        progress_percentage: progress.progressPercentage,
        steps: progress.steps
      })
    });
    return res.ok;
  },

  // Questions & Real-Time Classroom Evaluation
  evaluateAnswer: async (params: {
    lessonId?: string;
    concept: string;
    question: string;
    studentAnswer: string;
    expectedAnswer?: string;
    language?: string;
  }) => {
    const res = await fetch('/api/questions/evaluate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: params.lessonId,
        concept: params.concept,
        question: params.question,
        student_answer: params.studentAnswer,
        expected_answer: params.expectedAnswer,
        language: params.language || 'hinglish'
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Evaluation error');
    }
    return await res.json();
  },

  askTeacher: async (params: {
    lessonId?: string;
    concept: string;
    question: string;
    language?: string;
  }) => {
    const res = await fetch('/api/questions/ask-teacher', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: params.lessonId,
        concept: params.concept,
        question: params.question,
        language: params.language || 'hinglish'
      })
    });
    if (!res.ok) {
      throw new Error('Teacher query error');
    }
    return await res.json();
  },

  // Post-Lesson Assessments & Study Resources
  generateAssessment: async (params: {
    lessonId: string;
    topic: string;
    concepts: string[];
    level?: string;
    count?: number;
  }) => {
    const res = await fetch('/api/assessment/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: params.lessonId,
        topic: params.topic,
        concepts: params.concepts,
        level: params.level || 'intermediate',
        count: params.count || 5
      })
    });
    if (!res.ok) throw new Error('Failed to generate assessment');
    return await res.json();
  },

  recordAssessment: async (report: LearningReportData): Promise<UserDataBundle> => {
    await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        lesson_id: report.lessonId,
        lesson_title: report.lessonTitle,
        subject: report.subject,
        overall_score: report.overallScore,
        concept_mastery: report.conceptMastery,
        strong_areas: report.strongAreas,
        needs_improvement: report.needsImprovement,
        teacher_feedback: report.teacherFeedback,
        recommended_next_steps: report.recommendedNextSteps
      })
    });
    return await api.getUserData();
  },

  generateNotes: async (topic: string, concepts: string[], lessonId?: string): Promise<StructuredLessonNotes> => {
    const res = await fetch('/api/notes/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, concepts, lesson_id: lessonId })
    });
    if (!res.ok) throw new Error('Failed to generate notes');
    return await res.json();
  },

  generateFlashcards: async (topic: string, concepts: string[], lessonId?: string): Promise<{ cards: FlashcardItem[] }> => {
    const res = await fetch('/api/flashcards/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, concepts, lesson_id: lessonId })
    });
    if (!res.ok) throw new Error('Failed to generate flashcards');
    return await res.json();
  },

  generateConceptMap: async (topic: string, concepts: string[]): Promise<ConceptMapData> => {
    const res = await fetch('/api/concept-map/generate', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, concepts })
    });
    if (!res.ok) throw new Error('Failed to generate concept map');
    return await res.json();
  },

  // Learning Path
  getLearningPath: async (): Promise<LearningPath> => {
    const res = await fetch('/api/learning-path', {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch learning path');
    return await res.json();
  },

  toggleMilestone: async (nodeId: string) => {
    const res = await fetch('/api/learning-path/toggle-milestone', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ node_id: nodeId })
    });
    return res.ok;
  },

  // Profile
  updateProfile: async (data: Partial<StudentProfile>) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        full_name: data.name,
        preferred_language: data.preferredLanguage,
        education_level: data.educationLevel,
        learning_goal: data.learningGoal,
        preferred_teaching_style: data.teachingStyle
      })
    });
    return await res.json();
  }
};
