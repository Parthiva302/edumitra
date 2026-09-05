import React, { useState } from 'react';
import { GraduationCap, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lock, Mail, User, Loader2 } from 'lucide-react';
import { registerUser, AuthUser } from '../../utils/auth';
import { UserDataBundle } from '../../types';
import authVisualImage from '../../assets/images/edumitra_auth_visual_1788369212027.jpg';

interface SignUpPageProps {
  onAuthSuccess: (user: AuthUser, userData?: UserDataBundle) => void;
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onAuthSuccess,
  onNavigateLogin,
  onNavigateHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldErrors = {};

    // In-depth client validations
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await registerUser(fullName, email, password, confirmPassword);

      if (result.success && result.user) {
        setIsSuccess(true);
        setTimeout(() => {
          onAuthSuccess(result.user!, result.userData);
        }, 200);
      } else {
        setIsSubmitting(false);
        setFieldErrors({ form: result.error || 'Failed to create account. Please try again.' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setFieldErrors({ form: err.message || 'Failed to create account. Please try again.' });
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
          onClick={onNavigateLogin}
          className="text-xs font-medium text-[#4F7CAC] hover:text-[#3D6692] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F7CAC]/40 rounded px-2 py-1"
        >
          Log In
        </button>
      </header>

      {/* Main Container: 2-Column on Desktop */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full bg-white border border-[#DCE4EC] rounded-2xl shadow-[0_1px_3px_rgba(23,35,45,0.04),0_1px_2px_rgba(23,35,45,0.02)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* LEFT COLUMN: Registration Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              {/* Brand Heading */}
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#E8F1F7] text-[#4F7CAC] border border-[#D0E1EE] flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-semibold text-[#17232D] tracking-tight">
                  Create your EduMitra account
                </h1>
                <p className="text-xs sm:text-sm text-[#61707C]">
                  Start building a personalized learning journey with your AI teacher.
                </p>
              </div>

              {/* Form-level Error Banner */}
              {fieldErrors.form && (
                <div 
                  id="signup-error-banner"
                  className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C6C6] text-[#A63232] text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{fieldErrors.form}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1 group">
                  <label 
                    htmlFor="signup-fullname" 
                    className="block text-xs font-medium text-[#17232D]"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-fullname"
                      type="text"
                      disabled={isSubmitting || isSuccess}
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-200 disabled:opacity-60 ${
                        fieldErrors.fullName 
                          ? 'border-[#E27C7C] bg-[#FFF8F8] focus:border-[#E27C7C] focus:ring-2 focus:ring-[#E27C7C]/20' 
                          : 'border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-[#A63232]">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1 group">
                  <label 
                    htmlFor="signup-email" 
                    className="block text-xs font-medium text-[#17232D]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-email"
                      type="email"
                      disabled={isSubmitting || isSuccess}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      placeholder="name@university.edu"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-200 disabled:opacity-60 ${
                        fieldErrors.email 
                          ? 'border-[#E27C7C] bg-[#FFF8F8] focus:border-[#E27C7C] focus:ring-2 focus:ring-[#E27C7C]/20' 
                          : 'border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-[#A63232]">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1 group">
                  <label 
                    htmlFor="signup-password" 
                    className="block text-xs font-medium text-[#17232D]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-password"
                      type="password"
                      disabled={isSubmitting || isSuccess}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Minimum 6 characters"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-200 disabled:opacity-60 ${
                        fieldErrors.password 
                          ? 'border-[#E27C7C] bg-[#FFF8F8] focus:border-[#E27C7C] focus:ring-2 focus:ring-[#E27C7C]/20' 
                          : 'border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-[#A63232]">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1 group">
                  <label 
                    htmlFor="signup-confirm-password" 
                    className="block text-xs font-medium text-[#17232D]"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8D9AA6] group-focus-within:text-[#4F7CAC] transition-colors duration-200 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-confirm-password"
                      type="password"
                      disabled={isSubmitting || isSuccess}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      placeholder="Repeat password"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs text-[#17232D] placeholder:text-[#8D9AA6] focus:outline-none transition-all duration-200 disabled:opacity-60 ${
                        fieldErrors.confirmPassword 
                          ? 'border-[#E27C7C] bg-[#FFF8F8] focus:border-[#E27C7C] focus:ring-2 focus:ring-[#E27C7C]/20' 
                          : 'border-[#DCE4EC] bg-[#F8FAFC] focus:bg-white focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-[#A63232]">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    id="signup-submit-btn"
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
                        <span>Account Created • Entering Dashboard...</span>
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Setting up your classroom profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

            {/* Bottom Switch to Log In */}
            <div className="pt-6 border-t border-[#DCE4EC] text-center max-w-md w-full mx-auto">
              <p className="text-xs text-[#61707C]">
                Already have an account?{' '}
                <button
                  onClick={onNavigateLogin}
                  className="font-semibold text-[#4F7CAC] hover:text-[#3D6692] transition-colors duration-200 cursor-pointer underline-offset-2 hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Matching Visual Sidebar */}
          <div className="hidden lg:block lg:col-span-5 relative bg-[#17232D] overflow-hidden">
            <img
              src={authVisualImage}
              alt="EduMitra Academic Space"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#17232D]/90 via-[#17232D]/40 to-[#17232D]/30" />

            <div className="relative h-full p-8 md:p-10 flex flex-col justify-end text-white space-y-4">
              <div className="w-7 h-7 rounded-md bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>

              <blockquote className="text-sm font-medium leading-relaxed text-white/90">
                "Upload any syllabus chapter or textbook excerpt. EduMitra structures it into an interactive dialogue tailored to you."
              </blockquote>

              <div className="text-xs text-white/60 font-mono">
                Curriculum Integration • Real-time Diagnostic Checks
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
