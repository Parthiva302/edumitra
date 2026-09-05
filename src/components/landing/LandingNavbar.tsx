import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface LandingNavbarProps {
  onNavigateLogin: () => void;
  onNavigateSignUp: () => void;
  onScrollToSection: (sectionId: string) => void;
  onLaunchJudgeDemo?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onNavigateLogin,
  onNavigateSignUp,
  onScrollToSection,
  onLaunchJudgeDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track active section on scroll for subtle indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'how-it-works', 'features', 'hero'];
      const scrollPos = window.scrollY + 120;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
      if (window.scrollY < 80) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-[#DCE4EC] shadow-[0_1px_2px_rgba(23,35,45,0.02)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: EduMitra Logo and Wordmark */}
        <div 
          id="landing-navbar-logo"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 rounded-lg p-1 -m-1 transition-all duration-200"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavClick('hero'); }}
          aria-label="EduMitra Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center font-semibold group-hover:bg-[#4F7CAC] group-hover:text-white transition-all duration-200 shrink-0 shadow-[0_1px_2px_rgba(23,35,45,0.04)] group-hover:shadow-[0_2px_4px_rgba(79,124,172,0.25)] group-active:scale-95">
            <GraduationCap className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] md:text-base tracking-tight text-[#17232D] group-hover:text-[#3F6687] transition-colors duration-200 leading-none">
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

        {/* CENTER: Navigation Links (Smooth Scroll) */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#647481]" aria-label="Main Navigation">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('hero')}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 active:scale-[0.98] ${
              activeSection === 'hero' 
                ? 'text-[#17232D] font-semibold bg-[#F3F7FA]' 
                : 'hover:text-[#17232D] hover:bg-[#F3F7FA]/70'
            }`}
          >
            Home
          </button>
          <button
            id="nav-link-how-it-works"
            onClick={() => handleNavClick('how-it-works')}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 active:scale-[0.98] ${
              activeSection === 'how-it-works' 
                ? 'text-[#17232D] font-semibold bg-[#F3F7FA]' 
                : 'hover:text-[#17232D] hover:bg-[#F3F7FA]/70'
            }`}
          >
            How It Works
          </button>
          <button
            id="nav-link-features"
            onClick={() => handleNavClick('features')}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 active:scale-[0.98] ${
              activeSection === 'features' 
                ? 'text-[#17232D] font-semibold bg-[#F3F7FA]' 
                : 'hover:text-[#17232D] hover:bg-[#F3F7FA]/70'
            }`}
          >
            Features
          </button>
          <button
            id="nav-link-about"
            onClick={() => handleNavClick('about')}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 active:scale-[0.98] ${
              activeSection === 'about' 
                ? 'text-[#17232D] font-semibold bg-[#F3F7FA]' 
                : 'hover:text-[#17232D] hover:bg-[#F3F7FA]/70'
            }`}
          >
            About
          </button>
        </nav>

        {/* RIGHT: Login, Demo & Sign Up CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onLaunchJudgeDemo && (
            <button
              id="landing-navbar-demo-btn"
              onClick={onLaunchJudgeDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 transition-all duration-200 cursor-pointer shadow-xs"
              title="Launch complete 9-step hackathon judge evaluation demo"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Judge Demo Mode</span>
            </button>
          )}

          <button
            id="landing-navbar-login-btn"
            onClick={onNavigateLogin}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#17232D] hover:text-[#3F6687] hover:bg-[#F3F7FA] border border-transparent hover:border-[#DCE4EC] hover:-translate-y-px active:translate-y-0 active:scale-[0.98] active:bg-[#E8F1F7] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
          >
            Log In
          </button>

          <button
            id="landing-navbar-signup-btn"
            onClick={onNavigateSignUp}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-xs transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_2px_8px_rgba(79,124,172,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-[0_1px_2px_rgba(79,124,172,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            id="landing-navbar-mobile-login-btn"
            onClick={onNavigateLogin}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#17232D] hover:bg-[#F3F7FA] active:bg-[#E8F1F7] active:scale-[0.98] border border-[#DCE4EC] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
          >
            Log In
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#647481] hover:text-[#17232D] hover:bg-[#F3F7FA] active:bg-[#E8F1F7] active:scale-95 border border-[#DCE4EC] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with smooth motion animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden border-t border-[#DCE4EC] bg-white px-4 py-3 space-y-1 shadow-md overflow-hidden"
          >
            <button
              onClick={() => handleNavClick('hero')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                activeSection === 'hero' ? 'bg-[#F3F7FA] text-[#17232D] font-semibold' : 'text-[#17232D] hover:bg-[#F3F7FA]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                activeSection === 'how-it-works' ? 'bg-[#F3F7FA] text-[#17232D] font-semibold' : 'text-[#17232D] hover:bg-[#F3F7FA]'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                activeSection === 'features' ? 'bg-[#F3F7FA] text-[#17232D] font-semibold' : 'text-[#17232D] hover:bg-[#F3F7FA]'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer ${
                activeSection === 'about' ? 'bg-[#F3F7FA] text-[#17232D] font-semibold' : 'text-[#17232D] hover:bg-[#F3F7FA]'
              }`}
            >
              About
            </button>
            <div className="pt-2.5 border-t border-[#DCE4EC] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateSignUp();
                }}
                className="w-full py-2.5 px-3 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] active:scale-[0.99] text-white font-medium text-xs text-center flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
