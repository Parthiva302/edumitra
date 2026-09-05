import React, { useState } from 'react';
import { StudentProfile, TeacherAvatarId, LanguageCode } from '../../types';
import { TEACHER_PERSONAS } from '../../data/mockData';
import { 
  User, 
  Volume2, 
  Sparkles, 
  Check, 
  Save,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface SettingsPageProps {
  student: StudentProfile;
  selectedAvatarId: TeacherAvatarId;
  defaultLanguage: LanguageCode;
  onUpdateAvatar: (avatarId: TeacherAvatarId) => void;
  onUpdateLanguage: (lang: LanguageCode) => void;
  onSaveProfile: (name: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  student,
  selectedAvatarId,
  defaultLanguage,
  onUpdateAvatar,
  onUpdateLanguage,
  onSaveProfile
}) => {
  const [name, setName] = useState(student.name);
  const [currentAvatar, setCurrentAvatar] = useState<TeacherAvatarId>(selectedAvatarId);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(defaultLanguage);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [defaultCaptions, setDefaultCaptions] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hinglish', label: 'Hinglish (Hindi + English)' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(name);
    onUpdateAvatar(currentAvatar);
    onUpdateLanguage(currentLang);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="settings-page" className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#DCE4EC] pb-4">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
          Preferences & Configuration
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#17232D] tracking-tight">Settings</h1>
        <p className="text-xs md:text-sm text-[#61707C] mt-0.5">
          Configure your student profile, preferred AI teacher avatar, voice pacing, and languages.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Student Profile Card */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <User className="w-4 h-4 text-[#4F7CAC]" />
            <span>Student Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#61707C] font-medium block mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F3F7FA] border border-[#DCE4EC] rounded-lg px-3.5 py-2 text-xs md:text-sm text-[#17232D] focus:outline-none focus:border-[#4F7CAC] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#61707C] font-medium block mb-1.5">Email / Account ID</label>
              <input
                type="email"
                disabled
                value={student.email}
                className="w-full bg-[#F3F7FA] border border-[#DCE4EC] rounded-lg px-3.5 py-2 text-xs md:text-sm text-[#8D9AA6] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Teacher Persona Selector */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-[#4F7CAC]" />
              <span>Preferred AI Teacher Persona</span>
            </div>
            <span className="text-xs text-[#61707C]">All educators are adaptive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEACHER_PERSONAS.map((teacher) => {
              const isSelected = currentAvatar === teacher.id;
              return (
                <div
                  key={teacher.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setCurrentAvatar(teacher.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCurrentAvatar(teacher.id);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col items-center text-center space-y-3 ${
                    isSelected
                      ? 'bg-[#F3F7FA] border-[#4F7CAC] ring-2 ring-[#4F7CAC]/40 shadow-xs -translate-y-0.5'
                      : 'bg-white border-[#DCE4EC] hover:border-[#CBD6E2] hover:bg-[#FAFBFD] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#DCE4EC]">
                    <img src={teacher.avatarImage} alt={teacher.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#4F7CAC]/40 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#17232D] text-xs md:text-sm">{teacher.name}</h3>
                    <p className="text-[11px] text-[#4F7CAC] font-mono mt-0.5">{teacher.specialty}</p>
                    <p className="text-[10px] text-[#61707C] mt-1 line-clamp-2">{teacher.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Language */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <Globe className="w-4 h-4 text-[#4F7CAC]" />
            <span>Default Teaching Language</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setCurrentLang(lang.code)}
                className={`p-3 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                  currentLang === lang.code
                    ? 'bg-[#E8F1F7] border-[#4F7CAC] text-[#17232D] font-semibold shadow-2xs'
                    : 'bg-white border-[#DCE4EC] text-[#61707C] hover:bg-[#F3F7FA] hover:text-[#17232D]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Speech Settings */}
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[#17232D] font-semibold text-sm">
            <Volume2 className="w-4 h-4 text-[#4F7CAC]" />
            <span>Speech & Audio Configuration</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#61707C] font-medium">Teacher Speech Pacing:</span>
                <span className="font-mono text-[#4F7CAC] font-semibold">{speechSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.25"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-[#DCE4EC] rounded-lg appearance-none cursor-pointer accent-[#4F7CAC]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#DCE4EC]">
              <div>
                <span className="text-xs md:text-sm font-medium text-[#17232D] block">Auto-Play Teacher Voice</span>
                <span className="text-xs text-[#61707C]">Automatically speak explanations on step change</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40 ${
                  autoPlayAudio ? 'bg-[#4F7CAC]' : 'bg-[#DCE4EC]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoPlayAudio ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#DCE4EC]">
              <div>
                <span className="text-xs md:text-sm font-medium text-[#17232D] block">Always Show Captions (CC)</span>
                <span className="text-xs text-[#61707C]">Display real-time subtitles at the bottom of the classroom</span>
              </div>
              <button
                type="button"
                onClick={() => setDefaultCaptions(!defaultCaptions)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40 ${
                  defaultCaptions ? 'bg-[#4F7CAC]' : 'bg-[#DCE4EC]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    defaultCaptions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <div className="flex items-center gap-2 text-[#5B9A7A] text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully.</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              id="save-settings-btn"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs md:text-sm transition-all duration-150 cursor-pointer shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
