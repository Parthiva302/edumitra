import React, { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Film, Sun, Moon } from 'lucide-react';
import { LanguageCode } from '../../types';
import { getInitialTheme, toggleTheme, subscribeTheme, ThemeMode } from '../../utils/theme';

interface ClassroomTopBarProps {
  lessonTitle: string;
  subject: string;
  currentStepIndex: number;
  totalSteps: number;
  currentConcept: string;
  currentSceneIndex: number;
  totalScenes: number;
  sceneType?: string;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onExit: () => void;
}

export const ClassroomTopBar: React.FC<ClassroomTopBarProps> = ({
  lessonTitle,
  subject,
  currentStepIndex,
  totalSteps,
  currentConcept,
  currentSceneIndex,
  totalScenes,
  sceneType,
  currentLanguage,
  onLanguageChange,
  onExit
}) => {
  const [themeState, setThemeState] = useState<ThemeMode>(getInitialTheme());

  useEffect(() => {
    return subscribeTheme((newTheme) => setThemeState(newTheme));
  }, []);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hinglish', label: 'Hinglish (Hindi + English)' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' }
  ];

  const progressPercent = Math.round(((currentSceneIndex + 1) / Math.max(1, totalScenes)) * 100);

  const getSceneBadge = (type?: string) => {
    switch (type) {
      case 'teacher_intro':
        return { label: 'Intro Hook', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'visual_explanation':
        return { label: 'Visual Model', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'teacher_and_visual':
        return { label: 'Conceptual Deep-Dive', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'question':
        return { label: 'Interactive Check', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'teacher_summary':
        return { label: 'Summary & Synthesis', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Live Teaching', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const badge = getSceneBadge(sceneType);

  return (
    <header id="classroom-top-bar" className="w-full bg-white border-b border-[#DCE4EC] px-4 md:px-6 py-2.5 flex items-center justify-between z-30 select-none shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
      {/* Left: Exit + Title + Step */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          id="exit-classroom-btn"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F7FA] hover:bg-[#E8F1F7] text-[#17232D] text-xs font-medium transition-all duration-150 border border-[#DCE4EC] hover:border-[#CBD6E2] cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-semibold text-[#17232D] tracking-tight">{lessonTitle}</h1>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] font-medium hidden md:inline">
              {subject}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium hidden sm:inline-flex items-center gap-1 ${badge.color}`}>
              <Film className="w-2.5 h-2.5" />
              <span>{badge.label}</span>
            </span>
          </div>
          <p className="text-xs text-[#61707C]">
            Step {currentStepIndex + 1}/{totalSteps} • Shot {currentSceneIndex + 1}/{totalScenes}: <strong className="text-[#17232D] font-medium">{currentConcept}</strong>
          </p>
        </div>
      </div>

      {/* Right: Progress & Language Selector */}
      <div className="flex items-center gap-3">
        {/* Scene Progress bar */}
        <div className="hidden lg:flex items-center gap-2.5 bg-[#F3F7FA] px-3 py-1.5 rounded-lg border border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
          <span className="text-xs text-[#61707C] font-medium">Shot Progress</span>
          <div className="w-24 h-1.5 bg-[#DCE4EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4F7CAC] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-[#17232D]">{progressPercent}%</span>
        </div>

        {/* Language selector */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 bg-[#F3F7FA] border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-lg px-2.5 py-1 text-xs text-[#17232D] font-medium shadow-[0_1px_2px_rgba(23,35,45,0.02)] transition-colors">
            <Globe className="w-3.5 h-3.5 text-[#61707C]" />
            <select
              id="classroom-language-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs text-[#17232D] outline-none cursor-pointer pr-1 font-medium"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-white text-[#17232D]">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          id="classroom-theme-toggle-btn"
          onClick={() => toggleTheme()}
          className="p-1.5 rounded-lg text-[#61707C] hover:text-[#17232D] hover:bg-[#F3F7FA] border border-[#DCE4EC] transition-colors cursor-pointer flex items-center justify-center shadow-xs"
          title={`Switch to ${themeState === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle dark / light mode"
        >
          {themeState === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#4F7CAC]" />
          )}
        </button>
      </div>
    </header>
  );
};
