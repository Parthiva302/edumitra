import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UploadCloud, 
  MessageSquare, 
  Languages, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { LandingNavbar } from './LandingNavbar';
import heroLearningImage from '../../assets/images/edumitra_hero_learning_1788369195986.jpg';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignUp: () => void;
}

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateSignUp,
}) => {
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const yOffset = -72;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      icon: Sparkles,
      title: 'AI-Personalized Teaching',
      desc: 'Lessons adapt to your level, pace, goals, and available time.',
    },
    {
      icon: UploadCloud,
      title: 'Learn From Your Material',
      desc: 'Upload PDFs, notes, textbooks, and other learning material.',
    },
    {
      icon: MessageSquare,
      title: 'Interactive Learning',
      desc: 'Answer questions, test your understanding, and receive explanations when you struggle.',
    },
    {
      icon: Languages,
      title: 'Learn in Your Language',
      desc: 'Study in your preferred language while maintaining lesson context.',
    },
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Choose what you want to learn',
      description: 'Select any curriculum topic, standard, or upload your own course syllabus, lecture slides, or revision notes.',
    },
    {
      number: '02',
      title: 'EduMitra builds your personalized lesson',
      description: 'Our pedagogical engine structures step-by-step milestones, calibrates baseline depth, and prepares interactive checks.',
    },
    {
      number: '03',
      title: 'Learn, interact, and improve with your AI teacher',
      description: 'Engage with synchronized concept explanations, test understanding at key checkpoints, and receive remediation when stuck.',
    },
  ];

  return (
    <div id="edumitra-public-landing" className="min-h-screen bg-[#F5F7F8] text-[#17232D] flex flex-col font-sans selection:bg-[#4F7CAC] selection:text-white">
      {/* 1. PUBLIC NAVBAR */}
      <LandingNavbar
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1 w-full">
        {/* 2. HERO SECTION */}
        <section 
          id="hero" 
          className="relative pt-8 pb-16 md:pt-16 md:pb-24 border-b border-[#DCE4EC] bg-white overflow-hidden scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Left-aligned content with subtle staggered load animation */}
              <motion.div 
                variants={heroContainerVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-7 space-y-6 md:space-y-7 text-left z-10"
              >
                {/* Eyebrow */}
                <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F7FA] border border-[#DCE4EC] text-[#4F7CAC] text-xs font-mono font-medium tracking-wider uppercase transition-colors duration-200">
                  <span>Personal AI Learning Platform</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 variants={heroItemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold text-[#17232D] tracking-tight leading-[1.12]">
                  Learn Anything.<br />
                  <span className="text-[#3F6687]">With a Teacher That Adapts to You.</span>
                </motion.h1>

                {/* Concise Description */}
                <motion.p variants={heroItemVariants} className="text-base sm:text-lg text-[#61707C] leading-relaxed max-w-2xl">
                  EduMitra turns your study material or any topic into a personalized, interactive lesson that explains, asks questions, adapts to your understanding, and helps you learn with confidence.
                </motion.p>

                {/* CTAs with unified button interaction system */}
                <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    id="hero-create-account-btn"
                    onClick={onNavigateSignUp}
                    className="group px-6 py-3 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_4px_12px_rgba(79,124,172,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>

                  <button
                    id="hero-how-it-works-btn"
                    onClick={() => scrollToSection('how-it-works')}
                    className="px-6 py-3 rounded-md bg-white hover:bg-[#F3F7FA] text-[#17232D] font-medium text-sm border border-[#DCE4EC] hover:border-[#CBD6E2] hover:text-[#3F6687] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_8px_rgba(23,35,45,0.04)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:bg-[#E8F1F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
                  >
                    <span>See How It Works</span>
                  </button>
                </motion.div>

                {/* Micro Trust Indicators */}
                <motion.div variants={heroItemVariants} className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#71808C]">
                  <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#17232D]">
                    <CheckCircle2 className="w-4 h-4 text-[#5B9A7A]" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#17232D]">
                    <CheckCircle2 className="w-4 h-4 text-[#5B9A7A]" />
                    <span>Works with any syllabus or document</span>
                  </div>
                  <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[#17232D]">
                    <CheckCircle2 className="w-4 h-4 text-[#5B9A7A]" />
                    <span>Personalized pacing</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column: Large, subtle, realistic educational visual with gentle entrance animation */}
              <motion.div 
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 relative flex items-center justify-center"
              >
                <div className="relative w-full max-w-lg lg:max-w-none rounded-2xl overflow-hidden border border-[#DCE4EC] shadow-[0_4px_20px_rgba(23,35,45,0.06),0_1px_2px_rgba(23,35,45,0.03)] bg-[#F3F7FA] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(23,35,45,0.08),0_1px_2px_rgba(23,35,45,0.03)]">
                  <img
                    src={heroLearningImage}
                    alt="EduMitra Personalized AI Teaching Environment"
                    className="w-full h-auto object-cover object-center max-h-[440px] select-none"
                    loading="eager"
                  />
                  
                  {/* Subtle blend gradient overlays for refined integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />

                  {/* Understated caption card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs border border-[#DCE4EC] rounded-xl p-3 shadow-[0_2px_8px_rgba(23,35,45,0.08)] transition-all duration-200 hover:bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#5B9A7A] animate-pulse" />
                        <span className="text-xs font-semibold text-[#17232D]">Adaptive Learning Active</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#4F7CAC] bg-[#E8F1F7] px-2 py-0.5 rounded border border-[#D0E1EE]">
                        Socratic Remediation
                      </span>
                    </div>
                    <p className="text-[11px] text-[#61707C] mt-1 line-clamp-1">
                      Diagnosing misconception in Ohm's Law • recalibrating analogy for clarity.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 3. SUPPORTING FEATURES */}
        <section id="features" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#17232D] tracking-tight">
              A complete pedagogical platform, designed for genuine mastery.
            </h2>
            <p className="text-sm sm:text-base text-[#61707C] leading-relaxed">
              Every feature serves a singular academic purpose: ensuring you understand the principle behind every formula, theorem, and definition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureCards.map((feat, idx) => (
              <div
                key={idx}
                className="group bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-6 space-y-4 transition-all duration-200 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_16px_rgba(23,35,45,0.06),0_1px_2px_rgba(23,35,45,0.03)] hover:-translate-y-1 cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center shrink-0 group-hover:bg-[#4F7CAC] group-hover:text-white group-hover:border-[#4F7CAC] group-hover:shadow-[0_2px_6px_rgba(79,124,172,0.25)] transition-all duration-200">
                  <feat.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm md:text-base text-[#17232D] transition-colors duration-200 group-hover:text-[#3F6687]">
                    {feat.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#61707C] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="py-16 md:py-20 border-t border-[#DCE4EC] bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#61707C]">
                Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#17232D] tracking-tight">
                How EduMitra Works
              </h2>
              <p className="text-sm sm:text-base text-[#61707C]">
                Three simple, transparent steps from initial topic to deep conceptual confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflowSteps.map((step) => (
                <div 
                  key={step.number}
                  className="group bg-[#F8FAFC] hover:bg-white border border-[#DCE4EC] hover:border-[#CBD6E2] rounded-xl p-7 space-y-4 flex flex-col justify-between shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_4px_14px_rgba(23,35,45,0.05)] hover:-translate-y-1 transition-all duration-200 cursor-default"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-semibold text-[#4F7CAC] group-hover:text-white group-hover:bg-[#4F7CAC] group-hover:border-[#4F7CAC] group-hover:shadow-[0_2px_6px_rgba(79,124,172,0.25)] px-2.5 py-1 rounded bg-[#E8F1F7] border border-[#D0E1EE] inline-block transition-all duration-200">
                      {step.number}
                    </span>
                    <h3 className="text-base font-semibold text-[#17232D] group-hover:text-[#3F6687] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#61707C] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. TRUST / PRODUCT SECTION ("Not just an AI chatbot") */}
        <section id="about" className="py-16 md:py-20 border-t border-[#DCE4EC] bg-[#F5F7F8] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-[#DCE4EC] rounded-2xl p-8 md:p-12 shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] space-y-8 transition-all duration-200 hover:border-[#CBD6E2]">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#4F7CAC] uppercase">
                  <ShieldCheck className="w-4 h-4 text-[#4F7CAC]" />
                  <span>The Pedagogical Difference</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#17232D] tracking-tight">
                  Not just an AI chatbot.
                </h2>
                
                <p className="text-base md:text-lg text-[#17232D] leading-relaxed">
                  EduMitra teaches progressively, checks your understanding, identifies knowledge gaps, and changes its explanation when you need help.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#DCE4EC]">
                <div className="p-3 -m-3 rounded-xl transition-all duration-200 hover:bg-[#F3F7FA] space-y-2 cursor-default">
                  <div className="flex items-center gap-2 text-[#4F7CAC] font-semibold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>Progressive Milestone Flow</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#61707C] leading-relaxed">
                    Concepts are broken into digestible steps with concrete analogies before moving to formulas and rigorous derivations.
                  </p>
                </div>

                <div className="p-3 -m-3 rounded-xl transition-all duration-200 hover:bg-[#F3F7FA] space-y-2 cursor-default">
                  <div className="flex items-center gap-2 text-[#5B9A7A] font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Formative Checkpoints</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#61707C] leading-relaxed">
                    Interactive questions diagnose whether an error stemmed from a calculation mistake or a fundamental physical misconception.
                  </p>
                </div>

                <div className="p-3 -m-3 rounded-xl transition-all duration-200 hover:bg-[#F3F7FA] space-y-2 cursor-default">
                  <div className="flex items-center gap-2 text-[#3F6687] font-semibold text-sm">
                    <GraduationCap className="w-4 h-4" />
                    <span>Adaptive Remediation</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#61707C] leading-relaxed">
                    If an idea doesn't click, your teacher switches approaches—using intuitive models and visual representations until you grasp it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-16 md:py-20 border-t border-[#DCE4EC] bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#17232D] tracking-tight">
              Ready to learn differently?
            </h2>
            <p className="text-base md:text-lg text-[#61707C] max-w-xl mx-auto leading-relaxed">
              Create your personalized learning experience with EduMitra.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="footer-cta-signup-btn"
                onClick={onNavigateSignUp}
                className="group w-full sm:w-auto px-6 py-3 rounded-md bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] hover:shadow-[0_4px_12px_rgba(79,124,172,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <button
                id="footer-cta-login-btn"
                onClick={onNavigateLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-white hover:bg-[#F3F7FA] text-[#17232D] font-medium text-sm border border-[#DCE4EC] hover:border-[#CBD6E2] hover:text-[#3F6687] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(23,35,45,0.02)] hover:shadow-[0_2px_8px_rgba(23,35,45,0.04)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:bg-[#E8F1F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40"
              >
                <span>Log In</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="w-full border-t border-[#DCE4EC] bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#61707C] select-none mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('hero'); }}
          >
            <div className="w-7 h-7 rounded-md bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center group-hover:bg-[#4F7CAC] group-hover:text-white transition-all duration-200">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#17232D] group-hover:text-[#3F6687] transition-colors duration-200 block">EduMitra</span>
              <span className="text-xs text-[#71808C]">Personal AI Teacher</span>
            </div>
          </div>

          {/* Navigation Links in Footer */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#647481]">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="hover:text-[#17232D] transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#4F7CAC] hover:after:w-full after:transition-all after:duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="hover:text-[#17232D] transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#4F7CAC] hover:after:w-full after:transition-all after:duration-200"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-[#17232D] transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#4F7CAC] hover:after:w-full after:transition-all after:duration-200"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-[#17232D] transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#4F7CAC] hover:after:w-full after:transition-all after:duration-200"
            >
              About
            </button>
            <span className="text-[#DCE4EC] hidden sm:inline select-none">|</span>
            <button 
              onClick={onNavigateLogin} 
              className="hover:text-[#17232D] transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#4F7CAC] hover:after:w-full after:transition-all after:duration-200"
            >
              Log In
            </button>
            <button 
              onClick={onNavigateSignUp} 
              className="text-[#4F7CAC] hover:text-[#3D6692] font-semibold transition-colors duration-200 cursor-pointer relative py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#3D6692] hover:after:w-full after:transition-all after:duration-200"
            >
              Create Account
            </button>
          </div>

          <div className="text-xs text-[#8D9AA6]">
            <span>© {new Date().getFullYear()} EduMitra Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
