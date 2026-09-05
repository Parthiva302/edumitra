import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, StudentProfile } from '../../types';
import { 
  GraduationCap, 
  Plus, 
  Home, 
  TrendingUp, 
  Map, 
  FileText, 
  Settings, 
  Flame,
  Menu,
  X,
  User,
  Sliders,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  student: StudentProfile;
  onStartNewLesson: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  student,
  onStartNewLesson,
  onShowToast,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard' as AppScreen, label: 'Dashboard', icon: Home },
    { id: 'path' as AppScreen, label: 'Curriculum', icon: Map },
    { id: 'materials' as AppScreen, label: 'Materials', icon: FileText },
    { id: 'progress' as AppScreen, label: 'Analytics', icon: TrendingUp },
    { id: 'settings' as AppScreen, label: 'Settings', icon: Settings },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (screenId: AppScreen) => {
    onNavigate(screenId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    if (onShowToast) {
      onShowToast('Logged out of EduMitra session safely.', 'info');
    }
    onLogout?.();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* 1. LEFT: Refined EduMitra Brand */}
        <div 
          id="navbar-brand-logo"
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group focus:outline-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('dashboard'); }}
        >
          {/* Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center font-semibold group-hover:bg-[#4F7CAC] group-hover:text-white transition-all duration-150 shrink-0 shadow-[0_1px_2px_rgba(23,35,45,0.04)] group-hover:shadow-[0_2px_4px_rgba(79,124,172,0.2)]">
            <GraduationCap className="w-4 h-4" />
          </div>

          {/* Wordmark + Subtle Product Descriptor */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] md:text-base tracking-tight text-[#17232D] group-hover:text-[#3F6687] transition-colors leading-none">
              EduMitra
            </span>
            <span className="hidden sm:inline text-[#B5C1C9] font-normal text-xs select-none">
              ·
            </span>
            <span className="hidden sm:inline text-xs text-[#71808C] font-normal tracking-normal leading-none">
              Personal AI Teacher
            </span>
          </div>
        </div>

        {/* 2. CENTER: Clean Horizontal Navigation Group */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F3F7FA] p-1 rounded-lg border border-[#DCE4EC]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4F7CAC] ${
                  isActive
                    ? 'bg-[#E8F1F7] text-[#3F6687] border border-[#D0E1EE] font-semibold shadow-[0_1px_2px_rgba(23,35,45,0.03)]'
                    : 'text-[#647481] hover:text-[#3F6687] hover:bg-[#E8F1F7]/60 border border-transparent'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4F7CAC]' : 'text-[#647481]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. RIGHT: Utility Actions + Profile */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          <div 
            id="nav-streak-indicator"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF1E2] border border-[#F0E2CD] text-[#6F5A35] text-xs font-medium cursor-default select-none transition-transform duration-150 hover:-translate-y-px shadow-[0_1px_2px_rgba(111,90,53,0.04)]"
            title="7 consecutive days of active learning"
          >
            <Flame className="w-3.5 h-3.5 text-[#C58B3A] fill-[#C58B3A]" />
            <span>7-day streak</span>
          </div>

          {/* New Lesson Primary CTA */}
          <button
            id="navbar-new-lesson-btn"
            onClick={onStartNewLesson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_6px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#4F7CAC]/40"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">New Lesson</span>
          </button>

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-px bg-[#DCE4EC] hidden sm:block" />

          {/* User Profile Interactive Dropdown Area */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="navbar-profile-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer group select-none p-1 rounded-lg hover:bg-[#F3F7FA] border border-transparent hover:border-[#DCE4EC] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#4F7CAC]"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              title="Student Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-[#E8F1F7] text-[#3F6687] font-semibold text-xs flex items-center justify-center border border-[#DCE4EC] group-hover:border-[#4F7CAC]/50 transition-colors shrink-0 shadow-[0_1px_2px_rgba(23,35,45,0.03)]">
                {student.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-[#17232D] group-hover:text-[#3F6687] transition-colors block leading-tight truncate max-w-[110px]">
                  {student.name}
                </span>
                <span className="text-[11px] text-[#7A8790] block leading-tight">Student</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#7A8790] transition-transform duration-150 ${profileDropdownOpen ? 'rotate-180 text-[#4F7CAC]' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div 
                id="navbar-profile-dropdown"
                className="absolute right-0 mt-2 w-56 bg-white border border-[#DCE4EC] rounded-xl shadow-dropdown py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3.5 py-2.5 border-b border-[#DCE4EC]">
                  <p className="text-xs font-semibold text-[#17232D] truncate">{student.name}</p>
                  <p className="text-[11px] text-[#61707C] truncate">{student.email}</p>
                </div>

                <div className="py-1">
                  <button
                    id="dropdown-profile-item"
                    onClick={() => handleNavClick('settings')}
                    className="w-full px-3.5 py-2 text-xs text-[#17232D] hover:bg-[#F3F7FA] hover:text-[#4F7CAC] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[#61707C]" />
                    <span>Profile</span>
                  </button>

                  <button
                    id="dropdown-preferences-item"
                    onClick={() => handleNavClick('settings')}
                    className="w-full px-3.5 py-2 text-xs text-[#17232D] hover:bg-[#F3F7FA] hover:text-[#4F7CAC] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#61707C]" />
                    <span>Learning Preferences</span>
                  </button>

                  <button
                    id="dropdown-settings-item"
                    onClick={() => handleNavClick('settings')}
                    className="w-full px-3.5 py-2 text-xs text-[#17232D] hover:bg-[#F3F7FA] hover:text-[#4F7CAC] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#61707C]" />
                    <span>Account Settings</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#DCE4EC]">
                  <button
                    id="dropdown-logout-item"
                    onClick={handleLogout}
                    className="w-full px-3.5 py-2 text-xs text-[#B24A4A] hover:bg-[#FDF2F2] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#B24A4A]" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#647481] hover:text-[#17232D] hover:bg-[#F3F7FA] border border-[#DCE4EC] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCE4EC] bg-white px-4 py-3 space-y-1 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#71808C] px-2 py-1">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#E8F1F7] text-[#3F6687] font-semibold'
                    : 'text-[#647481] hover:text-[#17232D] hover:bg-[#F3F7FA]'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#4F7CAC]' : 'text-[#647481]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-[#DCE4EC] flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#6F5A35] bg-[#FAF1E2] px-2.5 py-1 rounded-md border border-[#F0E2CD]">
              <Flame className="w-3.5 h-3.5 text-[#C58B3A] fill-[#C58B3A]" />
              <span>7-day streak</span>
            </div>
            <span className="text-[#7A8790]">{student.name}</span>
          </div>
        </div>
      )}
    </header>
  );
};
