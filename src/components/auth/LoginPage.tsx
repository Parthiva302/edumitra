import React, { useState } from 'react';
import { GraduationCap, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lock, Mail, Loader2 } from 'lucide-react';
import { authenticateUser, AuthUser } from '../../utils/auth';
import { UserDataBundle } from '../../types';
import authVisualImage from '../../assets/images/edumitra_auth_visual_1788369212027.jpg';

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser, userData?: UserDataBundle) => void;
  onNavigateSignUp: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onAuthSuccess,
  onNavigateSignUp,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowForgotNotice(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authenticateUser(email, password);

      if (result.success && result.user) {
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(result.user!, result.userData);
        }, 200);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.error || 'Incorrect email or password.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage('Incorrect email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] flex flex-col font-sans selection:bg-[#4F7CAC] selection:text-white">
      {/* Minimal Top Header */}
      <header className="w-full bg-white border-b border-[#DCE4EC] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="group inline-flex items-center gap-2 text-xs font-medium text-[#61707C] hover:text-[#17232D] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded px-1.5 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Back to EduMitra</span>
        </button>

        <div 
          onClick={onNavigateHome}
          className="group flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-md bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center font-semibold group-hover:bg-[#4F7CAC] group-hover:text-white transition-all duration-200">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[#17232D] group-hover:text-[#3F6687] transition-colors duration-200">EduMitra</span>
        </div>

        <button
          onClick={onNavigateSignUp}
          className="text-xs font-medium text-[#4F7CAC] hover:text-[#3D6692] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded px-2 py-1"
        >
          Create Account
        </button>
      </header>

      {/* Main Container: 2-Column on Desktop */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full bg-white border border-[#DCE4EC] rounded-2xl shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT COLUMN: Clean, Minimal Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              {/* Brand Heading */}
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-semibold text-[#17232D] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-[#61707C]">
                  Log in to continue learning with your AI teacher.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div 
                  id="login-error-banner"
                  className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C6C6] text-[#A63232] text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Forgot password notification */}
              {showForgotNotice && (
                <div className="p-3 rounded-lg bg-[#E8F1F7] border border-[#D0E1EE] text-[#2F5272] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#4F7CAC] shrink-0 mt-0.5" />
                  <span>If an account exists for this email, password reset instructions have been logged.</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 group">
                  <label 
                    htmlFor="login-email" 
                    className="block text-xs font-medium text-[#17232D]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      disabled={isSubmitting || isSuccess}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@edumitra.edu"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20 transition-all duration-200 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs font-medium text-[#17232D]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotNotice(true)}
                      className="text-[11px] text-[#4F7CAC] hover:text-[#3D6692] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      disabled={isSubmitting || isSuccess}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20 transition-all duration-200 disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`w-full py-2.5 px-4 rounded-md text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(79,124,172,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7CAC]/40 ${
                    isSuccess
                      ? 'bg-[#5B9A7A] shadow-[0_2px_6px_rgba(91,154,122,0.3)]'
                      : isSubmitting
                      ? 'bg-[#3D6692] opacity-90 cursor-wait'
                      : 'bg-[#4F7CAC] hover:bg-[#3D6692] active:bg-[#35587E] hover:shadow-[0_4px_12px_rgba(79,124,172,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Authenticated • Opening Dashboard...</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Switch to Sign Up */}
            <div className="pt-6 border-t border-[#DCE4EC] text-center max-w-md w-full mx-auto">
              <p className="text-xs text-[#61707C]">
                Don't have an account?{' '}
                <button
                  onClick={onNavigateSignUp}
                  className="font-semibold text-[#4F7CAC] hover:text-[#3D6692] transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Subtle Educational Visual */}
          <div className="hidden lg:block lg:col-span-5 relative bg-[#17232D] overflow-hidden">
            <img
              src={authVisualImage}
              alt="EduMitra Academic Space"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity select-none"
            />
            
            {/* Subtle Gradient Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#17232D]/90 via-[#17232D]/40 to-[#17232D]/30" />

            {/* Quote & Brand Anchor */}
            <div className="relative h-full p-8 md:p-10 flex flex-col justify-end text-white space-y-4">
              <div className="w-7 h-7 rounded-md bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>

              <blockquote className="text-sm font-medium leading-relaxed text-white/90">
                "EduMitra does not merely answer questions; it tests your grasp and patiently guides you through misconceptions."
              </blockquote>

              <div className="text-xs text-white/60 font-mono">
                Academic Socratic Framework • Self-Paced
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
