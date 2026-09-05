import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Mic, MicOff, Sparkles, Smile, HelpCircle, Frown } from 'lucide-react';
import { LanguageCode, TeacherPersonality, StudentEmotionState } from '../../types';
import { api } from '../../services/api';
import { speechRecognitionService } from '../../utils/speech';

interface AskTeacherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  currentConcept: string;
  language: LanguageCode;
  teacherPersonality?: TeacherPersonality;
  onTeacherAnswer: (text: string) => void;
  onEmotionDetected?: (state: StudentEmotionState) => void;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: string;
  detectedEmotion?: StudentEmotionState;
}

export const AskTeacherDrawer: React.FC<AskTeacherDrawerProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  currentConcept,
  language,
  teacherPersonality = 'friendly_mentor',
  onTeacherAnswer,
  onEmotionDetected
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [learningState, setLearningState] = useState<StudentEmotionState>('engaged');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'teacher',
      text: `Hello! I am right here with you. If you have any doubt about ${currentConcept || 'this concept'}, or want me to explain in another language, just ask or click the mic to speak!`,
      timestamp: 'Now'
    }
  ]);

  useEffect(() => {
    setSpeechSupported(speechRecognitionService.isSupported());
  }, []);

  // Detect student learning/emotional state from message signals
  const detectLearningState = (text: string): StudentEmotionState => {
    const t = text.toLowerCase();
    if (t.includes("don't understand") || t.includes("lost") || t.includes("confused") || t.includes("not really") || t.includes("why does") || t.includes("kya matlab")) {
      return 'confused';
    }
    if (t.includes("stuck") || t.includes("too hard") || t.includes("impossible") || t.includes("frustrated") || t.includes("give up")) {
      return 'frustrated';
    }
    if (t.includes("got it") || t.includes("clear") || t.includes("makes sense") || t.includes("easy") || t.includes("samajh gaya")) {
      return 'confident';
    }
    if (t.includes("maybe") || t.includes("not sure") || t.includes("i guess") || t.includes("hesitant")) {
      return 'hesitant';
    }
    return 'engaged';
  };

  if (!isOpen) return null;

  const quickQuestions = [
    "Can you explain with a simpler real-world analogy?",
    "Why does this relationship hold in words?",
    "Mujhe ye Hinglish mein samjhao please",
    "What are the practical applications of this?"
  ];

  const handleToggleVoice = () => {
    if (isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      const started = speechRecognitionService.start({
        lang: language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US',
        onResult: (transcript, isFinal) => {
          setQuery(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            handleSend(transcript);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      if (!started) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || isLoading) return;

    if (isListening) {
      speechRecognitionService.stop();
      setIsListening(false);
    }

    const detected = detectLearningState(textToSend);
    setLearningState(detected);
    onEmotionDetected?.(detected);

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedEmotion: detected
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const data = await api.askTeacher({
        lessonId: lessonTitle,
        concept: currentConcept,
        question: textToSend,
        language: language
      });

      const answerText = data.answer_text || data.answer || `Regarding ${currentConcept}: remember that this principle balances the underlying forces. Let's observe how the components react.`;

      const teacherMsg: ChatMessage = {
        id: `teacher_${Date.now()}`,
        sender: 'teacher',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, teacherMsg]);
      onTeacherAnswer(answerText);
    } catch (err) {
      const fallbackText = `Regarding ${currentConcept}: in simple terms, this principle governs how the system balances itself under different conditions. Let's keep this intuition in mind as we continue.`;
      setMessages(prev => [
        ...prev,
        {
          id: `teacher_${Date.now()}`,
          sender: 'teacher',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      onTeacherAnswer(fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ask-teacher-drawer" className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white border-l border-[#DCE4EC] text-[#17232D] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 font-sans">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#DCE4EC] flex items-center justify-between bg-[#F3F7FA]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#17232D] text-sm">Real-Time Voice & Doubt Solver</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EAF4EE] text-[#5B9A7A] font-medium border border-[#D0E6D8]">
                Active
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-[#61707C]">Topic: {currentConcept}</span>
              <span className="text-[11px] text-[#61707C]">•</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                learningState === 'confident' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                learningState === 'confused' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                learningState === 'frustrated' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {learningState.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <button
          id="close-ask-teacher-btn"
          onClick={() => {
            if (isListening) speechRecognitionService.stop();
            onClose();
          }}
          className="p-1.5 rounded-lg text-[#61707C] hover:text-[#17232D] hover:bg-[#E8F1F7] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F5F7F8]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {msg.sender === 'teacher' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-[#4F7CAC]" />
                  <span className="text-[11px] font-semibold text-[#17232D]">AI Teacher</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-[#8D9AA6]" />
                  <span className="text-[11px] font-semibold text-[#61707C]">You</span>
                </>
              )}
              <span className="text-[10px] text-[#8D9AA6]">{msg.timestamp}</span>
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs md:text-sm max-w-[88%] leading-relaxed ${
                msg.sender === 'student'
                  ? 'bg-[#4F7CAC] text-white rounded-br-none shadow-xs'
                  : 'bg-white text-[#17232D] border border-[#DCE4EC] rounded-bl-none shadow-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#61707C] p-3 bg-white rounded-xl w-fit border border-[#DCE4EC] shadow-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4F7CAC]" />
            <span>Formulating explanation...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2.5 bg-white border-t border-[#DCE4EC]">
        <span className="text-[10px] uppercase font-mono text-[#61707C] block mb-1.5 font-semibold">Suggested Questions:</span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] text-left px-2.5 py-1 rounded-md bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] hover:text-[#4F7CAC] border border-[#DCE4EC] transition truncate max-w-full cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-[#DCE4EC] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ask-teacher-input"
            type="text"
            placeholder={isListening ? "Listening to your voice... Speak now!" : "Ask your doubt in any language..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className={`flex-1 border rounded-xl px-3.5 py-2 text-xs md:text-sm text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none focus:border-[#4F7CAC] ${
              isListening ? 'bg-red-50 border-red-300 ring-2 ring-red-200' : 'bg-[#F3F7FA] border-[#DCE4EC] focus:bg-white'
            }`}
          />

          {/* Microphone Voice Input Button */}
          {speechSupported && (
            <button
              type="button"
              id="toggle-voice-recognition-btn"
              onClick={handleToggleVoice}
              disabled={isLoading}
              title={isListening ? "Stop listening" : "Speak your question"}
              className={`p-2.5 rounded-xl transition shadow-xs cursor-pointer ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse shadow-md' 
                  : 'bg-[#E8F1F7] hover:bg-[#D0E1EE] text-[#4F7CAC]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            id="submit-ask-teacher-btn"
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#4F7CAC] hover:bg-[#3E6794] text-white disabled:bg-[#F3F7FA] disabled:text-[#8D9AA6] transition shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
