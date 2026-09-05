import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Subtitles, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface ClassroomBottomBarProps {
  currentSubtitle: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  captionsEnabled: boolean;
  onToggleCaptions: () => void;
  autoAdvanceEnabled: boolean;
  onToggleAutoAdvance: () => void;
  onOpenAskTeacher: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPreviousScene: () => void;
  onNextScene: () => void;
  isLastScene: boolean;
  onStartAssessment: () => void;
}

export const ClassroomBottomBar: React.FC<ClassroomBottomBarProps> = ({
  currentSubtitle,
  isPlaying,
  onTogglePlay,
  onReplay,
  isMuted,
  onToggleMute,
  playbackSpeed,
  onSpeedChange,
  captionsEnabled,
  onToggleCaptions,
  autoAdvanceEnabled,
  onToggleAutoAdvance,
  onOpenAskTeacher,
  canGoPrevious,
  canGoNext,
  onPreviousScene,
  onNextScene,
  isLastScene,
  onStartAssessment
}) => {
  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <footer id="classroom-bottom-bar" className="w-full bg-white border-t border-[#DCE4EC] text-[#17232D] z-30 select-none shadow-[0_-1px_3px_rgba(23,35,45,0.02)]">
      {/* Subtitles Area */}
      {captionsEnabled && (
        <div className="bg-[#F3F7FA] border-b border-[#DCE4EC] px-4 md:px-8 py-2.5 flex items-center justify-center text-center min-h-[44px]">
          <p className="text-xs md:text-sm text-[#17232D] font-normal tracking-normal max-w-4xl leading-relaxed">
            <span className="text-[#4F7CAC] font-medium mr-1.5">Teacher:</span>
            "{currentSubtitle || "Let's explore this concept carefully..."}"
          </p>
        </div>
      )}

      {/* Control Bar Actions */}
      <div className="px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Playback & Voice controls */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Play / Pause */}
          <button
            id="play-pause-toggle-btn"
            onClick={onTogglePlay}
            className={`p-2 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
              isPlaying
                ? 'bg-[#A37332] hover:bg-[#8F6329] active:bg-[#7D5422] text-white shadow-[0_1px_2px_rgba(163,115,50,0.2)]'
                : 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_4px_rgba(79,124,172,0.25)] hover:-translate-y-0.5 active:translate-y-0'
            }`}
            title={isPlaying ? 'Pause Teacher Narration' : 'Play Teacher Narration'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Replay */}
          <button
            id="replay-speech-btn"
            onClick={onReplay}
            className="p-2 rounded-lg bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] border border-[#DCE4EC] hover:border-[#CBD6E2] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)]"
            title="Replay scene narration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute toggle */}
          <button
            id="mute-toggle-btn"
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] ${
              isMuted
                ? 'bg-[#F7EAEA] border-[#ECD1D1] text-[#9A4C4C]'
                : 'bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] border-[#DCE4EC] hover:border-[#CBD6E2]'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F3F7FA] p-0.5 rounded-lg border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-all duration-150 cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-white text-[#17232D] font-semibold border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.04)]'
                    : 'text-[#61707C] hover:text-[#17232D]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Captions Toggle */}
          <button
            id="captions-toggle-btn"
            onClick={onToggleCaptions}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] ${
              captionsEnabled
                ? 'bg-[#E8F1F7] text-[#4F7CAC] border-[#D0E1EE]'
                : 'bg-[#F3F7FA] text-[#61707C] border-[#DCE4EC] hover:border-[#CBD6E2]'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Captions</span>
          </button>

          {/* Auto-Advance Video Mode Toggle */}
          <button
            id="auto-advance-toggle-btn"
            onClick={onToggleAutoAdvance}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] ${
              autoAdvanceEnabled
                ? 'bg-[#EAF4EE] text-[#5B9A7A] border-[#D0E6D8]'
                : 'bg-[#F3F7FA] text-[#61707C] border-[#DCE4EC]'
            }`}
            title="Auto-advance video playback after narration finishes"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Flow: {autoAdvanceEnabled ? 'ON' : 'PAUSED'}</span>
          </button>
        </div>

        {/* Center/Right: Ask Teacher & Step Navigators */}
        <div className="flex items-center gap-2 md:gap-2.5 ml-auto">
          {/* Ask Teacher CTA */}
          <button
            id="open-ask-teacher-btn"
            onClick={onOpenAskTeacher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F7FA] active:bg-[#E8F1F7] text-[#17232D] font-medium text-xs transition-all duration-150 border border-[#DCE4EC] hover:border-[#CBD6E2] cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#4F7CAC]" />
            <span>Ask Teacher</span>
          </button>

          {/* Previous Scene */}
          <button
            id="previous-step-btn"
            disabled={!canGoPrevious}
            onClick={onPreviousScene}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
              canGoPrevious
                ? 'bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] border-[#DCE4EC] hover:border-[#CBD6E2] cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)]'
                : 'bg-[#F3F7FA] text-[#8D9AA6] border-[#DCE4EC] cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous Shot</span>
          </button>

          {/* Next Scene / Assessment CTA */}
          {isLastScene ? (
            <button
              id="start-assessment-btn"
              onClick={onStartAssessment}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5B9A7A] hover:bg-[#4B8266] active:bg-[#3F6E56] text-white font-medium text-xs shadow-[0_1px_2px_rgba(91,154,122,0.2)] hover:shadow-[0_2px_6px_rgba(91,154,122,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
            >
              <span>Take Assessment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="next-step-btn"
              disabled={!canGoNext}
              onClick={onNextScene}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 ${
                canGoNext
                  ? 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-[#F3F7FA] text-[#8D9AA6] border border-[#DCE4EC] cursor-not-allowed'
              }`}
            >
              <span>Next Shot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
