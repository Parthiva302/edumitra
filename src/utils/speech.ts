// EduMitra Speech Synthesis and Voice Controller

class TeacherSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private onBoundaryCallback: ((word: string, charIndex: number) => void) | null = null;
  private onStateChangeCallback: ((isSpeaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(
    text: string, 
    options: {
      lang?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceType?: 'female' | 'male';
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (word: string, charIndex: number) => void;
      onStateChange?: (isSpeaking: boolean) => void;
    } = {}
  ): void {
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

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    // Pick best available browser voice
    const voices = this.synth.getVoices();
    const langCode = (options.lang || 'en').toLowerCase();

    let matchedVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();

      if (langCode === 'hi' || langCode === 'hinglish') {
        return vLang.startsWith('hi') || vName.includes('hindi') || (langCode === 'hinglish' && vLang === 'en-in');
      }
      if (langCode === 'te') {
        return vLang.startsWith('te') || vName.includes('telugu');
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

    if (!matchedVoice && voices.length > 0) {
      // Fallback 1: Try Indian English if asking for Hinglish or Indian regional language
      if (['hi', 'hinglish', 'te', 'ta', 'bn', 'mr', 'gu', 'kn'].includes(langCode)) {
        matchedVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
      }
      // Fallback 2: Gender-specific voice preference
      if (!matchedVoice) {
        matchedVoice = voices.find(v => 
          options.voiceType === 'female' 
            ? v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female') || v.name.includes('Natural')
            : v.name.includes('Male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Guy')
        ) || voices[0];
      }
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
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
