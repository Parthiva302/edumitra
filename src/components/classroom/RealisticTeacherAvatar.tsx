import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AvatarEmotion, AvatarState, TeacherAvatarId } from '../../types';
import { TEACHER_PERSONAS } from '../../data/mockData';
import { Sparkles, Smile, Brain, HelpCircle, Activity, Heart, Hand } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface RealisticTeacherAvatarProps {
  avatarId: TeacherAvatarId;
  emotion: AvatarEmotion;
  state: AvatarState;
  isSpeaking: boolean;
  teacherAction?: string;
  onAvatarChange?: (id: TeacherAvatarId) => void;
  className?: string;
}

export const RealisticTeacherAvatar: React.FC<RealisticTeacherAvatarProps> = ({
  avatarId,
  emotion,
  state,
  isSpeaking,
  teacherAction = '',
  onAvatarChange,
  className = ''
}) => {
  const [mouthOpenLevel, setMouthOpenLevel] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [headTilt, setHeadTilt] = useState<number>(0);
  const decayTimeoutRef = useRef<any>(null);

  const teacher = useMemo(() => {
    return TEACHER_PERSONAS.find(p => p.id === avatarId) || TEACHER_PERSONAS[0];
  }, [avatarId]);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, Math.random() * 3000 + 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Responsive head micro-movements when speaking, reacting, or gesturing
  useEffect(() => {
    if (teacherAction.includes('points') || teacherAction.includes('pointing')) {
      setHeadTilt(3);
    } else if (teacherAction.includes('welcoming')) {
      setHeadTilt(-1.5);
    } else if (isSpeaking) {
      setHeadTilt((Math.random() - 0.5) * 2.5);
    } else if (emotion === 'curious' || teacherAction.includes('attentive')) {
      setHeadTilt(2.5);
    } else if (emotion === 'patient') {
      setHeadTilt(-2);
    } else {
      setHeadTilt(0);
    }
  }, [isSpeaking, emotion, teacherAction]);

  // Real phonetic boundary-driven lip-sync (Web Speech API word/phoneme boundary events)
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpenLevel(0);
      return;
    }

    const unsubscribe = speechService.subscribeBoundary((word) => {
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
      
      // Calculate dynamic opening amplitude based on vowels and word length
      const hasOpenVowels = /[aouAOU]/.test(word);
      const intensity = hasOpenVowels ? 0.75 + Math.random() * 0.25 : 0.45 + Math.random() * 0.3;
      setMouthOpenLevel(intensity);

      // Smooth phonetic mouth closing decay
      decayTimeoutRef.current = setTimeout(() => {
        setMouthOpenLevel(0.08);
      }, 130);
    });

    return () => {
      unsubscribe();
      if (decayTimeoutRef.current) clearTimeout(decayTimeoutRef.current);
    };
  }, [isSpeaking]);

  const emotionBadge = useMemo(() => {
    switch (emotion) {
      case 'encouraging':
        return { label: 'Encouraging', icon: Smile, color: 'bg-[#EAF4EE] text-[#5B9A7A] border-[#D0E6D8]' };
      case 'curious':
        return { label: 'Attentive', icon: HelpCircle, color: 'bg-[#F8F0E3] text-[#C58B3A] border-[#EADCC8]' };
      case 'patient':
        return { label: 'Patient Guidance', icon: Heart, color: 'bg-[#F7EAEA] text-[#B76565] border-[#ECD1D1]' };
      case 'reassuring':
        return { label: 'Clarifying', icon: Sparkles, color: 'bg-[#E8F1F7] text-[#4F7CAC] border-[#D0E1EE]' };
      case 'thinking':
        return { label: 'Thinking', icon: Brain, color: 'bg-[#F3F7FA] text-[#61707C] border-[#DCE4EC]' };
      default:
        return { label: 'Explaining', icon: Activity, color: 'bg-[#E8F1F7] text-[#4F7CAC] border-[#D0E1EE]' };
    }
  }, [emotion]);

  return (
    <div id="ai-teacher-avatar-card" className={`relative flex flex-col items-center justify-between rounded-2xl bg-white border border-[#DCE4EC] text-[#17232D] shadow-xs p-4 md:p-5 ${className}`}>
      {/* Top Bar: Teacher Identity & Live Status */}
      <div className="w-full flex items-center justify-between z-20 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-[#5B9A7A]' : 'bg-[#8D9AA6]'}`} />
            {isSpeaking && (
              <span className="absolute w-4 h-4 rounded-full bg-[#5B9A7A]/30 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#17232D] text-sm tracking-tight">{teacher.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F3F7FA] text-[#61707C] font-mono border border-[#DCE4EC] font-medium">
                Educator
              </span>
            </div>
            <p className="text-[11px] text-[#61707C] font-normal truncate max-w-[170px]">{teacher.specialty}</p>
          </div>
        </div>

        {/* Emotion Pill */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${emotionBadge.color}`}>
          <emotionBadge.icon className="w-3 h-3" />
          <span>{emotionBadge.label}</span>
        </div>
      </div>

      {/* Center: Clean Educator Video Stream Frame */}
      <div className="relative w-full aspect-[4/4.5] max-w-[320px] rounded-xl overflow-hidden my-auto flex items-center justify-center bg-[#E8EFF5] border border-[#DCE4EC] shadow-inner group">
        <div 
          className="w-full h-full relative transition-transform duration-500 ease-out"
          style={{
            transform: `rotate(${headTilt}deg) scale(${isSpeaking ? 1.015 : 1})`,
            transformOrigin: '50% 75%'
          }}
        >
          <img
            src={teacher.avatarImage}
            alt={teacher.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.99] select-none"
          />

          {/* Realistic Human Eye Blink Overlay */}
          <div 
            className={`absolute inset-0 bg-zinc-900/30 pointer-events-none transition-opacity duration-100 ${
              isBlinking ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
              clipPath: 'polygon(20% 32%, 80% 32%, 80% 48%, 20% 48%)'
            }}
          />

          {/* Dynamic Lip Synchronization Layer */}
          {isSpeaking && (
            <div 
              className="absolute pointer-events-none transition-all duration-100"
              style={{
                top: '56%',
                left: '46%',
                width: '16px',
                height: `${6 + mouthOpenLevel * 8}px`,
                backgroundColor: 'rgba(60, 20, 25, 0.4)',
                borderRadius: '50%',
                filter: 'blur(1px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}

          {/* Live Audio Equalizer Pill */}
          {isSpeaking && (
            <div className="absolute bottom-2.5 left-2.5 flex items-end gap-1 px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm border border-[#DCE4EC] shadow-xs z-30">
              <span className="w-1 h-3 bg-[#4F7CAC] rounded-full animate-audio-bar-1" />
              <span className="w-1 h-4 bg-[#4F7CAC] rounded-full animate-audio-bar-2" />
              <span className="w-1 h-2 bg-[#4F7CAC] rounded-full animate-audio-bar-3" />
              <span className="w-1 h-3.5 bg-[#4F7CAC] rounded-full animate-audio-bar-4" />
              <span className="text-[10px] text-[#61707C] font-mono font-medium ml-1">Speaking</span>
            </div>
          )}

          {/* Listening State */}
          {state === 'listening' && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#C58B3A] text-white text-xs font-semibold shadow-xs animate-pulse z-30">
              <Activity className="w-3.5 h-3.5" />
              <span>Listening to you...</span>
            </div>
          )}

          {/* Thinking State */}
          {state === 'thinking' && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#4F7CAC] text-white text-xs font-semibold shadow-xs animate-pulse z-30">
              <Brain className="w-3.5 h-3.5" />
              <span>Synthesizing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Switcher: Change Teacher Persona */}
      <div className="w-full flex items-center justify-between z-20 mt-3 pt-3 border-t border-[#DCE4EC]">
        <span className="text-[11px] text-[#61707C] font-medium">Select Educator:</span>
        <div className="flex items-center gap-1.5">
          {TEACHER_PERSONAS.map((p) => (
            <button
              key={p.id}
              id={`switch-teacher-${p.id}`}
              onClick={() => onAvatarChange && onAvatarChange(p.id)}
              className={`w-6 h-6 rounded-full overflow-hidden border transition-all cursor-pointer ${
                avatarId === p.id 
                  ? 'border-[#4F7CAC] ring-2 ring-[#D0E1EE] scale-110' 
                  : 'border-[#DCE4EC] opacity-60 hover:opacity-100'
              }`}
              title={`${p.name} (${p.specialty})`}
            >
              <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
