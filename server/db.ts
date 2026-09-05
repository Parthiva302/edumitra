import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  StudentProfile, 
  UploadedMaterial, 
  LearningReportData, 
  LearningPath 
} from '../src/types';

export interface InProgressLessonRecord {
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
  steps: any[];
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface UserDataRecord {
  profile: StudentProfile;
  inProgressLesson: InProgressLessonRecord | null;
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

interface DatabaseSchema {
  users: Record<string, UserAccount>; // keyed by user.id
  emailToId: Record<string, string>; // keyed by lowercased email -> user.id
  userData: Record<string, UserDataRecord>; // keyed by user.id
  sessions: Record<string, { userId: string; createdAt: string }>; // keyed by token
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'edumitra_db.json');

// Default initial learning path for a brand new user (zero milestones completed)
export function createDefaultLearningPath(): LearningPath {
  return {
    id: 'track_stem_foundations',
    title: 'STEM & AI Foundations Roadmap',
    category: 'STEM & Artificial Intelligence',
    description: 'Structured pedagogical track progressing from fundamental circuit physics to modern neural networks and algorithmic architectures.',
    nodes: [
      {
        id: 'node_1',
        title: "Electricity & Circuit Theory (Ohm's Law)",
        status: 'in_progress',
        estimatedHours: 2.5,
        description: 'Voltage (V), Current (I), and Resistance (R). Physical analogies, Ohm’s Law calculations, and circuit diagrams.',
        subTopics: ['Potential Difference', 'Current Flow', 'Resistance Factors', 'Circuit Simulations']
      },
      {
        id: 'node_2',
        title: "Classical Mechanics (Newton's Laws)",
        status: 'locked',
        estimatedHours: 3.0,
        description: 'Inertia, F=ma dynamics, action-reaction pairs, and free-body diagrams in real-world scenarios.',
        subTopics: ['First Law & Inertia', 'Second Law Derivations', 'Third Law Pairs', 'Friction Models']
      },
      {
        id: 'node_3',
        title: 'Python for Computational Science',
        status: 'locked',
        estimatedHours: 4.5,
        description: 'Syntax fundamentals, control flow, functions, and applying vectorized numerical computation to physics problems.',
        subTopics: ['Variables & Types', 'Functions & Scope', 'Data Structures', 'Algorithmic Logic']
      },
      {
        id: 'node_4',
        title: 'Neural Networks & Deep Learning Intuition',
        status: 'locked',
        estimatedHours: 4.0,
        description: 'From biological neurons to perceptrons, activation functions, forward propagation, and gradient descent.',
        subTopics: ['Perceptron Model', 'Weights & Biases', 'Activation Functions', 'Loss Landscapes']
      },
      {
        id: 'node_5',
        title: 'Transformer Architectures & Modern AI',
        status: 'locked',
        estimatedHours: 5.0,
        description: 'Attention mechanisms, tokenization, embeddings, and how large language models process human thought.',
        subTopics: ['Self-Attention', 'Positional Encoding', 'Transformer Blocks', 'Inference Pipelines']
      }
    ]
  };
}

// Initial profile for a clean new user (0 completed lessons, 0 mastery, empty recent lessons)
export function createDefaultUserProfile(name: string, email: string): StudentProfile {
  return {
    name,
    email,
    level: 'beginner',
    preferredLanguage: 'hinglish',
    selectedAvatar: 'priya',
    overallMastery: 0,
    completedLessons: 0,
    learningTimeHours: 0,
    masteredConceptsCount: 0,
    recentLessons: [],
    voiceSpeed: 1.0,
    captionsEnabled: true,
    soundEnabled: true,
    learningStreak: 0,
    questionsAnswered: 0,
    educationLevel: 'high_school',
    learningGoal: 'understand_concept',
    teachingStyle: 'simple_visual'
  };
}

export class EduMitraDatabase {
  private memoryDb: DatabaseSchema = {
    users: {},
    emailToId: {},
    userData: {},
    sessions: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.memoryDb = JSON.parse(raw);
        if (!this.memoryDb.users) this.memoryDb.users = {};
        if (!this.memoryDb.emailToId) this.memoryDb.emailToId = {};
        if (!this.memoryDb.userData) this.memoryDb.userData = {};
        if (!this.memoryDb.sessions) this.memoryDb.sessions = {};
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Database initialization error:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.memoryDb, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  public generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  public generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  // Find user by email
  public findUserByEmail(email: string): UserAccount | null {
    const cleanEmail = email.trim().toLowerCase();
    const userId = this.memoryDb.emailToId[cleanEmail];
    if (userId && this.memoryDb.users[userId]) {
      return this.memoryDb.users[userId];
    }
    return null;
  }

  // Find user by ID
  public findUserById(id: string): UserAccount | null {
    return this.memoryDb.users[id] || null;
  }

  // Register a new user
  public registerUser(name: string, email: string, password: string): { 
    success: boolean; 
    user?: { id: string; name: string; email: string }; 
    token?: string; 
    userData?: UserDataRecord;
    error?: string;
  } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (this.memoryDb.emailToId[cleanEmail]) {
      return { 
        success: false, 
        error: 'An account with this email already exists. Please log in.' 
      };
    }

    const userId = this.generateId('usr');
    const salt = this.generateSalt();
    const passwordHash = this.hashPassword(password, salt);

    const userAccount: UserAccount = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      salt,
      createdAt: new Date().toISOString()
    };

    // Create fresh, empty user data bundle
    const userData: UserDataRecord = {
      profile: createDefaultUserProfile(cleanName, cleanEmail),
      inProgressLesson: null,
      documents: [],
      assessments: [],
      conceptMastery: [],
      learningPath: createDefaultLearningPath(),
      learningHistory: []
    };

    this.memoryDb.users[userId] = userAccount;
    this.memoryDb.emailToId[cleanEmail] = userId;
    this.memoryDb.userData[userId] = userData;

    const token = this.generateToken();
    this.memoryDb.sessions[token] = {
      userId,
      createdAt: new Date().toISOString()
    };

    this.save();

    return {
      success: true,
      user: { id: userId, name: cleanName, email: cleanEmail },
      token,
      userData
    };
  }

  // Authenticate login
  public login(email: string, password: string): {
    success: boolean;
    user?: { id: string; name: string; email: string };
    token?: string;
    userData?: UserDataRecord;
    error?: string;
  } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    const calculatedHash = this.hashPassword(password, user.salt);
    if (calculatedHash !== user.passwordHash) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    const token = this.generateToken();
    this.memoryDb.sessions[token] = {
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const userData = this.getUserData(user.id);
    this.save();

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      token,
      userData
    };
  }

  // Get user session from token
  public getUserByToken(token: string): {
    user: { id: string; name: string; email: string };
    userData: UserDataRecord;
  } | null {
    if (!token) return null;
    const session = this.memoryDb.sessions[token];
    if (!session) return null;

    const user = this.memoryDb.users[session.userId];
    if (!user) return null;

    const userData = this.getUserData(user.id);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      userData
    };
  }

  // Invalidate token on logout
  public logout(token: string): boolean {
    if (token && this.memoryDb.sessions[token]) {
      delete this.memoryDb.sessions[token];
      this.save();
      return true;
    }
    return false;
  }

  // Get user data bundle
  public getUserData(userId: string): UserDataRecord {
    if (!this.memoryDb.userData[userId]) {
      const user = this.memoryDb.users[userId];
      this.memoryDb.userData[userId] = {
        profile: createDefaultUserProfile(user?.name || 'Student', user?.email || ''),
        inProgressLesson: null,
        documents: [],
        assessments: [],
        conceptMastery: [],
        learningPath: createDefaultLearningPath(),
        learningHistory: []
      };
      this.save();
    }
    return this.memoryDb.userData[userId];
  }

  // Update profile
  public updateProfile(userId: string, updates: Partial<StudentProfile>): StudentProfile {
    const data = this.getUserData(userId);
    data.profile = {
      ...data.profile,
      ...updates
    };
    // Also update account name if name changed
    if (updates.name && this.memoryDb.users[userId]) {
      this.memoryDb.users[userId].name = updates.name;
    }
    this.save();
    return data.profile;
  }

  // Save or update in-progress lesson
  public saveLessonProgress(userId: string, lesson: InProgressLessonRecord | null): InProgressLessonRecord | null {
    const data = this.getUserData(userId);
    data.inProgressLesson = lesson;
    this.save();
    return data.inProgressLesson;
  }

  // Complete a lesson & assessment
  public recordAssessment(userId: string, report: LearningReportData): UserDataRecord {
    const data = this.getUserData(userId);
    
    // 1. Add assessment
    data.assessments.unshift(report);

    // 2. Add to recentLessons
    const recentItem = {
      id: `session_${Date.now()}`,
      title: report.lessonTitle,
      subject: report.subject || 'General Study',
      score: report.overallScore,
      duration: '20 min',
      date: 'Today',
      status: 'completed'
    };
    data.profile.recentLessons = [recentItem, ...data.profile.recentLessons.filter(l => l.title !== report.lessonTitle)];

    // 3. Update profile metrics
    data.profile.completedLessons = (data.profile.completedLessons || 0) + 1;
    data.profile.learningTimeHours = Number(((data.profile.learningTimeHours || 0) + 0.35).toFixed(1));
    data.profile.learningStreak = Math.max(1, (data.profile.learningStreak || 0) + 1);
    data.profile.questionsAnswered = (data.profile.questionsAnswered || 0) + 5;

    // Recalculate overall mastery from all assessments
    const totalScore = data.assessments.reduce((sum, a) => sum + (a.overallScore || 0), 0);
    data.profile.overallMastery = Math.round(totalScore / data.assessments.length);

    // Update concept mastery breakdown
    report.conceptMastery?.forEach(cm => {
      const existing = data.conceptMastery.find(c => c.concept.toLowerCase() === cm.concept.toLowerCase());
      if (existing) {
        existing.score = Math.round((existing.score + cm.score) / 2);
        existing.status = existing.score >= 80 ? 'Mastered' : existing.score >= 60 ? 'Developing' : 'Review Needed';
      } else {
        data.conceptMastery.push({
          concept: cm.concept,
          score: cm.score,
          status: cm.score >= 80 ? 'Mastered' : cm.score >= 60 ? 'Developing' : 'Review Needed'
        });
      }
    });

    data.profile.masteredConceptsCount = data.conceptMastery.filter(c => (c.score || 0) >= 80).length;

    // 4. Update learning path milestone if this lesson matches a milestone
    const matchingNode = data.learningPath.nodes.find(n => 
      n.title.toLowerCase().includes(report.lessonTitle.toLowerCase()) ||
      report.lessonTitle.toLowerCase().includes(n.title.toLowerCase())
    );
    if (matchingNode) {
      matchingNode.status = 'completed';
      // Unlock next node
      const currentIndex = data.learningPath.nodes.indexOf(matchingNode);
      if (currentIndex + 1 < data.learningPath.nodes.length) {
        const nextNode = data.learningPath.nodes[currentIndex + 1];
        if (nextNode.status === 'locked') {
          nextNode.status = 'in_progress';
        }
      }
    }

    // 5. Add to learning history
    data.learningHistory.unshift({
      id: `hist_${Date.now()}`,
      lessonTitle: report.lessonTitle,
      subject: report.subject,
      score: report.overallScore,
      activityType: 'completed_lesson',
      timestamp: new Date().toISOString(),
      date: 'Today'
    });

    // 6. Clear in-progress lesson if it matched this lesson
    if (data.inProgressLesson && data.inProgressLesson.title === report.lessonTitle) {
      data.inProgressLesson = null;
    }

    this.save();
    return data;
  }

  // Add uploaded material for user
  public addMaterial(userId: string, material: UploadedMaterial): UploadedMaterial[] {
    const data = this.getUserData(userId);
    data.documents = [material, ...data.documents.filter(d => d.id !== material.id)];
    
    // Add to history
    data.learningHistory.unshift({
      id: `mat_hist_${Date.now()}`,
      lessonTitle: material.name,
      subject: material.type,
      activityType: 'material_uploaded',
      timestamp: new Date().toISOString(),
      date: 'Today'
    });

    this.save();
    return data.documents;
  }

  // Delete material for user
  public deleteMaterial(userId: string, materialId: string): UploadedMaterial[] {
    const data = this.getUserData(userId);
    data.documents = data.documents.filter(d => d.id !== materialId);
    this.save();
    return data.documents;
  }

  // Update learning path
  public updateLearningPath(userId: string, path: LearningPath): LearningPath {
    const data = this.getUserData(userId);
    data.learningPath = path;
    this.save();
    return data.learningPath;
  }

  // Toggle milestone status
  public toggleMilestone(userId: string, nodeId: string): LearningPath {
    const data = this.getUserData(userId);
    data.learningPath.nodes = data.learningPath.nodes.map(n => {
      if (n.id === nodeId) {
        const nextStatus = n.status === 'completed' ? 'in_progress' : 'completed';
        return { ...n, status: nextStatus };
      }
      return n;
    });
    this.save();
    return data.learningPath;
  }
}

export const db = new EduMitraDatabase();
