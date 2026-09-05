// EduMitra Speech Synthesis and Voice Controller

interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceType?: 'female' | 'male';
  teacherId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onBoundary?: (word: string, charIndex: number) => void;
  onStateChange?: (isSpeaking: boolean) => void;
}

const TEACHER_VOICE_PROFILES: Record<string, { voiceType: 'female' | 'male'; defaultPitch: number; defaultRate: number; nameKeywords: string[] }> = {
  priya: {
    voiceType: 'female',
    defaultPitch: 1.14,
    defaultRate: 1.0,
    nameKeywords: ['priya', 'swara', 'heera', 'neerja', 'kalpana', 'veena', 'zira', 'samantha', 'female']
  },
  marcus: {
    voiceType: 'male',
    defaultPitch: 0.88,
    defaultRate: 0.96,
    nameKeywords: ['marcus', 'ravi', 'mohan', 'david', 'george', 'guy', 'mark', 'male']
  },
  aditi: {
    voiceType: 'female',
    defaultPitch: 1.06,
    defaultRate: 1.02,
    nameKeywords: ['aditi', 'shruti', 'veena', 'samantha', 'zira', 'female']
  },
  david: {
    voiceType: 'male',
    defaultPitch: 0.82,
    defaultRate: 0.90,
    nameKeywords: ['david', 'george', 'guy', 'richard', 'male']
  }
};

class TeacherSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private onBoundaryCallback: ((word: string, charIndex: number) => void) | null = null;
  private onStateChangeCallback: ((isSpeaking: boolean) => void) | null = null;
  private boundaryListeners: Set<(word: string, charIndex: number) => void> = new Set();
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public speak(text: string, options: SpeakOptions = {}): void {
    if (!this.synth) {
      if (options.onStart) options.onStart();
      if (options.onEnd) setTimeout(options.onEnd, Math.min(text.length * 50, 4000));
      return;
    }

    this.stop();

    // Clean text of markdown or special characters for speech
    const cleanText = text
      .replace(/[*_~`#\[\]\(\)]/g, ' ')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      .replace(/\\Omega/g, 'Ohms')
      .replace(/\\times/g, 'multiplied by')
      .replace(/\\rho/g, 'rho')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    const teacherProfile = options.teacherId ? TEACHER_VOICE_PROFILES[options.teacherId] : null;
    const targetVoiceType = options.voiceType || teacherProfile?.voiceType || 'female';

    utterance.rate = options.rate ?? teacherProfile?.defaultRate ?? 1.0;
    utterance.pitch = options.pitch ?? teacherProfile?.defaultPitch ?? (targetVoiceType === 'female' ? 1.1 : 0.88);
    utterance.volume = options.volume ?? 1.0;

    // Pick best available browser voice
    const voices = this.getAvailableVoices();
    const langCode = (options.lang || 'en').toLowerCase();
    const isFemale = targetVoiceType === 'female';

    const isVoiceFemale = (v: SpeechSynthesisVoice): boolean => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('zira') || name.includes('samantha') || 
             name.includes('heera') || name.includes('swara') || name.includes('kalpana') ||
             name.includes('veena') || name.includes('shruti') || name.includes('neerja') ||
             name.includes('catherine') || name.includes('karen') || name.includes('susan') ||
             name.includes('victoria') || name.includes('fiona');
    };

    const isVoiceMale = (v: SpeechSynthesisVoice): boolean => {
      const name = v.name.toLowerCase();
      return name.includes('male') || name.includes('david') || name.includes('george') || 
             name.includes('guy') || name.includes('ravi') || name.includes('mohan') ||
             name.includes('mark') || name.includes('richard') || name.includes('daniel');
    };

    let matchedVoice: SpeechSynthesisVoice | undefined;

    // 1. Language-specific matching
    const matchingLangVoices = voices.filter(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();

      if (langCode === 'te') {
        return vLang.startsWith('te') || vName.includes('telugu');
      }
      if (langCode === 'hi' || langCode === 'hinglish') {
        return vLang.startsWith('hi') || vName.includes('hindi') || (langCode === 'hinglish' && vLang === 'en-in');
      }
      if (langCode === 'ta') {
        return vLang.startsWith('ta') || vName.includes('tamil');
      }
      if (langCode === 'bn') {
        return vLang.startsWith('bn') || vName.includes('bengali') || vName.includes('bangla');
      }
      if (langCode === 'mr') {
        return vLang.startsWith('mr') || vName.includes('marathi');
      }
      if (langCode === 'gu') {
        return vLang.startsWith('gu') || vName.includes('gujarati');
      }
      if (langCode === 'kn') {
        return vLang.startsWith('kn') || vName.includes('kannada');
      }
      if (langCode === 'es') {
        return vLang.startsWith('es') || vName.includes('spanish');
      }
      if (langCode === 'fr') {
        return vLang.startsWith('fr') || vName.includes('french');
      }
      if (langCode === 'de') {
        return vLang.startsWith('de') || vName.includes('german');
      }
      return vLang.startsWith('en');
    });

    if (matchingLangVoices.length > 0) {
      // Find within matching language matching teacher gender
      matchedVoice = matchingLangVoices.find(v => isFemale ? isVoiceFemale(v) : isVoiceMale(v));
      if (!matchedVoice) {
        // Find teacher preferred keyword
        if (teacherProfile) {
          matchedVoice = matchingLangVoices.find(v => 
            teacherProfile.nameKeywords.some(kw => v.name.toLowerCase().includes(kw))
          );
        }
      }
      // If no gender match within language, take first matching language voice
      if (!matchedVoice) {
        matchedVoice = matchingLangVoices[0];
      }
    }

    // 2. Fallbacks if specific language voice not installed on OS
    if (!matchedVoice && voices.length > 0) {
      // If asking for Telugu or Indian regional language and not installed, use Indian English voice with matching gender
      if (['te', 'hi', 'hinglish', 'ta', 'bn', 'mr', 'gu', 'kn'].includes(langCode)) {
        const indianVoices = voices.filter(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
        matchedVoice = indianVoices.find(v => isFemale ? isVoiceFemale(v) : isVoiceMale(v)) || indianVoices[0];
      }

      // Gender fallback across any English voice
      if (!matchedVoice) {
        matchedVoice = voices.find(v => isFemale ? isVoiceFemale(v) : isVoiceMale(v));
      }

      // Final fallback
      if (!matchedVoice) {
        matchedVoice = voices[0];
      }
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = langCode === 'te' ? 'te-IN' : langCode === 'hi' ? 'hi-IN' : matchedVoice.lang;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      if (options.onStateChange) options.onStateChange(true);
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (options.onStateChange) options.onStateChange(false);
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (options.onStateChange) options.onStateChange(false);
      if (options.onEnd) options.onEnd();
    };

    utterance.onboundary = (event) => {
      const word = cleanText.substring(event.charIndex, event.charIndex + (event.charLength || 6)).trim();
      if (options.onBoundary) {
        options.onBoundary(word, event.charIndex);
      }
      this.boundaryListeners.forEach(listener => {
        try {
          listener(word, event.charIndex);
        } catch {}
      });
    };

    this.synth.speak(utterance);
  }

  public subscribeBoundary(listener: (word: string, charIndex: number) => void): () => void {
    this.boundaryListeners.add(listener);
    return () => this.boundaryListeners.delete(listener);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isSpeakingState = false;
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isSpeakingState = true;
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth?.speaking ?? false);
  }
}

export const speechService = new TeacherSpeechService();

// EduMitra Native Speech-to-Text Recognition Service (Section 67.1)
class TeacherSpeechRecognitionService {
  private recognition: any = null;
  private isListeningState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public start(options: {
    lang?: string;
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (err: any) => void;
    onEnd?: () => void;
  }): boolean {
    if (!this.recognition) return false;

    try {
      this.stop();

      const langCode = options.lang || 'en-US';
      this.recognition.lang = langCode.startsWith('hi') ? 'hi-IN' : langCode.startsWith('te') ? 'te-IN' : 'en-US';

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          options.onResult(finalTranscript, true);
        } else if (interimTranscript) {
          options.onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListeningState = false;
        options.onError?.(event);
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
        options.onEnd?.();
      };

      this.recognition.start();
      this.isListeningState = true;
      return true;
    } catch (e) {
      this.isListeningState = false;
      options.onError?.(e);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListeningState) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListeningState = false;
    }
  }
}

export const speechRecognitionService = new TeacherSpeechRecognitionService();
