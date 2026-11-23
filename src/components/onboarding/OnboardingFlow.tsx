import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Sparkles, Check, Copy, Share2, ArrowLeft, AlertCircle, RefreshCw, Loader2, ShieldCheck, X, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgeGateModal } from '../legal/AgeGateModal';
import { analytics } from '../../services/analytics';

interface OnboardingFlowProps {
  onComplete: (partnerName: string) => void;
}

const PRESET_AVATARS = [
  { id: '1', emoji: '🌸', name: 'Daisy' },
  { id: '2', emoji: '🎀', name: 'Blossom' },
  { id: '3', emoji: '🐰', name: 'Bunny' },
  { id: '4', emoji: '🐱', name: 'Kitten' },
  { id: '5', emoji: '🧸', name: 'Bear' },
  { id: '6', emoji: '⚡', name: 'Sparky' },
  { id: '7', emoji: '🦊', name: 'Fox' },
  { id: '8', emoji: '✨', name: 'Star' },
];

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  // Load saved step or start at splash
  const savedStep = localStorage.getItem('twobe_onboarding_step') || 'splash';
  const [step, setStep] = useState<string>(savedStep);

  // Form states with persistence
  const [emailOrPhone, setEmailOrPhone] = useState(localStorage.getItem('twobe_email') || '');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [displayName, setDisplayName] = useState(localStorage.getItem('twobe_display_name') || '');
  const [partnerNickname, setPartnerNickname] = useState(localStorage.getItem('twobe_partner_nickname') || '');
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('twobe_avatar') || '1');
  const [inviteOption, setInviteOption] = useState<'send' | 'enter'>('send');
  const [partnerCodeInput, setPartnerCodeInput] = useState(['', '', '', '', '', '']);
  const [confirmCodeInput, setConfirmCodeInput] = useState(['', '', '', '', '', '']);

  // Google Sign-in state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);

  // Age Gate & Legal state
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [pendingNextAction, setPendingNextAction] = useState<'google' | 'signup' | null>(null);

  const handleStartAuth = (target: 'google' | 'signup') => {
    analytics.trackSignupStart(target === 'google' ? 'google' : 'email');
    const isVerified = localStorage.getItem('twobe_age_verified') === 'true';
    if (!isVerified) {
      setPendingNextAction(target);
      setShowAgeGate(true);
    } else {
      if (target === 'google') setShowGoogleModal(true);
      else changeStep('signup');
    }
  };

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isInviteExpired, setIsInviteExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteCode = '2BE-8842';
  const partnerName = partnerNickname || 'Sarah';

  const changeStep = (nextStep: string) => {
    setStep(nextStep);
    localStorage.setItem('twobe_onboarding_step', nextStep);
    setErrorMessage(null);
  };

  const handleGoogleSignIn = (email: string, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setEmailOrPhone(email);
      setDisplayName(name);
      localStorage.setItem('twobe_email', email);
      localStorage.setItem('twobe_display_name', name);
      localStorage.setItem('twobe_auth_provider', 'google');
      analytics.trackSignupComplete('google', 2.5);
      setIsLoading(false);
      setShowGoogleModal(false);
      changeStep('profile');
    }, 600);
  };

  // SCREEN 1: Splash timer
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        changeStep('welcome');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // SCREEN 7: Fire confetti on mount
  useEffect(() => {
    if (step === 'success') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E8A5B9', '#9B4D6F', '#7FB77E', '#FFF4E6']
        });
      } catch (e) {
        // ignore
      }
    }
  }, [step]);

  // Helper for OTP digit auto-advance
  const handleDigitChange = (
    index: number,
    value: string,
    currentArr: string[],
    setArr: (arr: string[]) => void,
    nextInputPrefix: string
  ) => {
    if (value.length > 1) value = value.slice(-1);
    const newArr = [...currentArr];
    newArr[index] = value;
    setArr(newArr);

    if (value && index < 5) {
      const nextInput = document.getElementById(`${nextInputPrefix}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    currentArr: string[],
    nextInputPrefix: string
  ) => {
    if (e.key === 'Backspace' && !currentArr[index] && index > 0) {
      const prevInput = document.getElementById(`${nextInputPrefix}-${index - 1}`);
      prevInput?.focus();
    }
  };

  const renderGoogleModal = () => {
    if (!showGoogleModal) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GoogleIcon className="w-6 h-6 shrink-0" />
              <span className="text-sm font-bold text-[#2D1F24] dark:text-white">
                Sign in with Google
              </span>
            </div>
            <button
              onClick={() => {
                setShowGoogleModal(false);
                setShowCustomGoogleForm(false);
              }}
              className="p-1 rounded-full text-[#8B7578] hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
            Choose a Google account to automatically fill and verify your email.
          </p>

          {!showCustomGoogleForm ? (
            <div className="space-y-2.5">
              {/* Account 1: Alex */}
              <button
                onClick={() => handleGoogleSignIn('alex.miller@gmail.com', 'Alex')}
                className="w-full p-3.5 rounded-[16px] bg-[#FFF9F5] dark:bg-[#1A1416] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] border border-[#F0DFE3] dark:border-[#3D2F34] flex items-center space-x-3 text-left transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#2D1F24] dark:text-white truncate">
                    Alex Miller
                  </div>
                  <div className="text-[11px] text-[#8B7578] dark:text-[#A89598] truncate">
                    alex.miller@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                  Verified ✓
                </span>
              </button>

              {/* Account 2: Sarah */}
              <button
                onClick={() => handleGoogleSignIn('sarah.love@gmail.com', 'Sarah')}
                className="w-full p-3.5 rounded-[16px] bg-[#FFF9F5] dark:bg-[#1A1416] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] border border-[#F0DFE3] dark:border-[#3D2F34] flex items-center space-x-3 text-left transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9B4D6F] to-[#E8A5B9] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#2D1F24] dark:text-white truncate">
                    Sarah Jenkins
                  </div>
                  <div className="text-[11px] text-[#8B7578] dark:text-[#A89598] truncate">
                    sarah.love@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                  Verified ✓
                </span>
              </button>

              {/* Use Custom Google Account */}
              <button
                onClick={() => setShowCustomGoogleForm(true)}
                className="w-full p-3 rounded-[16px] border border-dashed border-[#E0D0D4] dark:border-[#4A3940] text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] hover:bg-[#E8A5B9]/10 transition flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Use another Google account</span>
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = googleCustomEmail.trim() || 'user@gmail.com';
                const name = googleCustomName.trim() || email.split('@')[0];
                handleGoogleSignIn(email, name);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={googleCustomEmail}
                  onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-[14px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={googleCustomName}
                  onChange={(e) => setGoogleCustomName(e.target.value)}
                  className="w-full h-11 px-3 rounded-[14px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleForm(false)}
                  className="flex-1 h-10 rounded-[18px] bg-slate-100 dark:bg-white/10 text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-[18px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-[#F0DFE3] dark:border-[#3D2F34] flex items-center space-x-1.5 text-[10px] text-[#8B7578] dark:text-[#A89598]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Pre-verified by Google OAuth. No code required.</span>
          </div>
        </div>
      </div>
    );
  };

  // SCREEN 1 - SPLASH
  if (step === 'splash') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF9F5] via-[#FFF4E6] to-[#FFEBEF] p-6 text-center select-none">
        <div className="flex flex-col items-center animate-pulse-subtle">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] flex items-center justify-center shadow-rose-glow mb-6">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#2D1F24] font-display">2Be</h1>
          <p className="text-sm font-medium text-[#8B7578] mt-2">A private world for just the two of you</p>
        </div>
      </div>
    );
  }

  // SCREEN 2 - WELCOME
  if (step === 'welcome') {
    return (
      <>
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FFF9F5] via-[#FFF4E6] to-[#FFF9F5] dark:from-[#1A1416] dark:via-[#261E21] dark:to-[#1A1416] p-6 text-[#2D1F24] dark:text-[#F5E6EA]">
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] flex items-center justify-center shadow-soft mb-6">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>

            <h2 className="text-2xl font-bold font-display leading-tight">
              A private world for just the two of you
            </h2>
            <p className="text-sm text-[#8B7578] dark:text-[#A89598] mt-2 mb-8">
              2Be is your intimate space to connect, share, and grow together
            </p>

            <div className="w-full space-y-3 text-left">
              {[
                { title: 'Private chats', desc: 'Encrypted messages, secret kisses & voice notes', icon: MessageCircle },
                { title: 'Shared memories', desc: 'Milestones, albums & time capsules for 2', icon: Heart },
                { title: 'Intimate moments', desc: 'Daily questions, bucket list & cycle care', icon: Sparkles },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-center space-x-3 p-3.5 rounded-[16px] bg-white/80 dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft">
                    <div className="w-10 h-10 rounded-full bg-[#E8A5B9]/20 flex items-center justify-center text-[#9B4D6F] dark:text-[#E8A5B9] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{f.title}</h4>
                      <p className="text-xs text-[#8B7578] dark:text-[#A89598]">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-sm mx-auto w-full pt-6 pb-4 space-y-2.5 text-center">
            {/* Google Sign-in Option */}
            <button
              onClick={() => handleStartAuth('google')}
              className="w-full h-12 rounded-[24px] bg-white dark:bg-[#261E21] border border-[#E0D0D4] dark:border-[#4A3940] text-[#2D1F24] dark:text-[#F5E6EA] font-semibold shadow-sm hover:shadow transition active:scale-95 flex items-center justify-center space-x-2.5"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleStartAuth('signup')}
              className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center"
            >
              Continue with Email or Phone
            </button>
            <button
              onClick={() => handleStartAuth('signup')}
              className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] hover:underline p-1 block mx-auto"
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
        {renderGoogleModal()}
        <AgeGateModal
          isOpen={showAgeGate}
          onVerified={(tier, consents) => {
            setShowAgeGate(false);
            if (pendingNextAction === 'google') {
              setShowGoogleModal(true);
            } else {
              changeStep('signup');
            }
          }}
          onCancel={() => setShowAgeGate(false)}
        />
      </>
    );
  }

  // SCREEN 3 - SIGN UP
  if (step === 'signup') {
    const handleSendCode = () => {
      const trimmed = emailOrPhone.trim();
      if (!trimmed || (!trimmed.includes('@') && trimmed.length < 8)) {
        setErrorMessage('Please enter a valid email or phone number');
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      setTimeout(() => {
        setIsLoading(false);
        setIsCodeSent(true);
        localStorage.setItem('twobe_email', trimmed);
      }, 700);
    };

    const handleVerify = () => {
      const codeStr = otpCode.join('');
      if (codeStr.length < 6) {
        setErrorMessage('Please enter all 6 digits');
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      setTimeout(() => {
        setIsLoading(false);
        analytics.trackSignupComplete('email', 12);
        changeStep('profile');
      }, 700);
    };

    return (
      <>
        <div className="min-h-screen flex flex-col justify-between bg-[#FFF9F5] dark:bg-[#1A1416] p-6 text-[#2D1F24] dark:text-[#F5E6EA]">
          <div className="max-w-sm mx-auto w-full pt-4">
            <button
              onClick={() => (isCodeSent ? setIsCodeSent(false) : changeStep('welcome'))}
              className="w-11 h-11 rounded-full flex items-center justify-center -ml-2 text-[#8B7578] hover:text-[#2D1F24] dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold font-display mt-4">
              {!isCodeSent ? 'Create your account' : 'Verify your code'}
            </h2>
            <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1 mb-6">
              {!isCodeSent
                ? 'Connect securely using Google or enter your email to get started.'
                : `Code sent to ${emailOrPhone}`}
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-[12px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!isCodeSent ? (
              <div className="space-y-4">
                {/* Google Sign-In Primary Shortcut */}
                <button
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full h-12 rounded-[24px] bg-white dark:bg-[#261E21] border border-[#E0D0D4] dark:border-[#4A3940] text-[#2D1F24] dark:text-[#F5E6EA] font-semibold shadow-sm hover:shadow transition active:scale-95 flex items-center justify-center space-x-2.5"
                >
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span>Continue with Google (Auto-verify)</span>
                </button>

                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-[#F0DFE3] dark:border-[#3D2F34]"></div>
                  <span className="px-3 text-xs text-[#8B7578] dark:text-[#A89598]">or email / phone</span>
                  <div className="flex-1 border-t border-[#F0DFE3] dark:border-[#3D2F34]"></div>
                </div>

                <input
                  type="text"
                  placeholder="e.g. alex@example.com or +123456789"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-sm"
                />
                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send verification code</span>}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Local Environment Info Banner */}
                <div className="p-3.5 rounded-[16px] bg-[#FFF4E6] dark:bg-[#33282C] border border-[#E8A5B9]/50 text-xs text-[#9B4D6F] dark:text-[#E8A5B9] space-y-1.5 shadow-sm">
                  <div className="flex items-center space-x-2 font-bold">
                    <Sparkles className="w-4 h-4 text-[#E8A5B9]" />
                    <span>Local Development Sandbox</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#8B7578] dark:text-[#D4C3C7]">
                    Since this app is running in a local test server, simulated codes are not sent to external mailboxes. Your verification code is <span className="font-mono font-bold text-xs bg-white/80 dark:bg-black/40 px-1.5 py-0.5 rounded text-[#2D1F24] dark:text-white">123456</span> (or any 6 digits).
                  </p>
                </div>

                <div className="flex justify-between gap-2">
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value, otpCode, setOtpCode, 'otp')}
                      onKeyDown={(e) => handleKeyDown(i, e, otpCode, 'otp')}
                      className="w-12 h-14 text-center text-xl font-bold rounded-[12px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#9B4D6F] text-[#2D1F24] dark:text-[#F5E6EA] shadow-soft"
                    />
                  ))}
                </div>

                {/* One-click Auto-fill Demo Code */}
                <button
                  type="button"
                  onClick={() => {
                    const demo = ['1', '2', '3', '4', '5', '6'];
                    setOtpCode(demo);
                    setErrorMessage(null);
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      changeStep('profile');
                    }, 400);
                  }}
                  className="w-full py-2.5 rounded-[16px] bg-[#E8A5B9]/20 hover:bg-[#E8A5B9]/30 text-[#9B4D6F] dark:text-[#E8A5B9] text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-[#E8A5B9]/40 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#9B4D6F] dark:text-[#E8A5B9]" />
                  <span>Auto-fill Demo Code (123456) & Continue</span>
                </button>

                <button
                  onClick={handleVerify}
                  disabled={isLoading || otpCode.some((d) => !d)}
                  className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify</span>}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] hover:underline flex items-center space-x-1"
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Switch to Google Sign-in</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="text-xs text-[#8B7578] dark:text-[#A89598] hover:underline"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {renderGoogleModal()}
      </>
    );
  }

  // SCREEN 4 - CREATE PROFILE
  if (step === 'profile') {
    const handleProfileContinue = () => {
      const trimmedName = displayName.trim();
      if (trimmedName.length < 2 || trimmedName.length > 20) {
        setErrorMessage('Display name must be between 2 and 20 characters');
        return;
      }
      localStorage.setItem('twobe_display_name', trimmedName);
      localStorage.setItem('twobe_partner_nickname', partnerNickname.trim());
      localStorage.setItem('twobe_avatar', selectedAvatar);
      analytics.trackProfileCreated(Boolean(partnerNickname.trim()), selectedAvatar);
      changeStep('invite');
    };

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FFF9F5] dark:bg-[#1A1416] p-6 text-[#2D1F24] dark:text-[#F5E6EA]">
        <div className="max-w-sm mx-auto w-full pt-4">
          <button
            onClick={() => changeStep('signup')}
            className="w-11 h-11 rounded-full flex items-center justify-center -ml-2 text-[#8B7578] hover:text-[#2D1F24] dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold font-display mt-4">Create your profile</h2>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1 mb-6">
            Choose your avatar and how you will appear in your private space.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-[12px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {/* 8 preset cute avatars grid */}
          <div className="mb-6 p-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft">
            <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider block mb-3 uppercase">
              Select Your Avatar
            </span>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`relative aspect-square rounded-full flex items-center justify-center text-2xl transition-all ${
                      isSelected
                        ? 'bg-[#E8A5B9]/30 ring-2 ring-[#9B4D6F] scale-105 shadow-sm'
                        : 'bg-[#FFF9F5] dark:bg-[#1A1416] hover:bg-[#FFF4E6]'
                    }`}
                  >
                    <span>{av.emoji}</span>
                    {isSelected && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#9B4D6F] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#8B7578] dark:text-[#A89598] block mb-1">
                Display Name (2-20 characters) *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full h-12 px-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8B7578] dark:text-[#A89598] block mb-1">
                Nickname for Partner (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. My Love"
                value={partnerNickname}
                onChange={(e) => setPartnerNickname(e.target.value)}
                className="w-full h-12 px-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto w-full pt-6 pb-4">
          <button
            onClick={handleProfileContinue}
            className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 5 - PAIRING INVITE
  if (step === 'invite') {
    const handleCopy = () => {
      navigator.clipboard?.writeText(inviteCode);
      setCopied(true);
      analytics.trackPairingInviteSent('code');
      setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
      analytics.trackPairingInviteSent('link');
      if (navigator.share) {
        navigator.share({
          title: 'Join me on 2Be',
          text: `Join our private couples space on 2Be! Use my invite code: ${inviteCode}`,
          url: `https://2be.app/pair?code=${inviteCode}`,
        });
      } else {
        handleCopy();
      }
    };

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FFF9F5] dark:bg-[#1A1416] p-6 text-[#2D1F24] dark:text-[#F5E6EA]">
        <div className="max-w-sm mx-auto w-full pt-4">
          <button
            onClick={() => changeStep('profile')}
            className="w-11 h-11 rounded-full flex items-center justify-center -ml-2 text-[#8B7578] hover:text-[#2D1F24] dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold font-display mt-4">Invite your partner</h2>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1 mb-6">
            Pair with your significant other to unlock your shared world.
          </p>

          {/* Option Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setInviteOption('send')}
              className={`p-4 rounded-[16px] text-center border transition ${
                inviteOption === 'send'
                  ? 'bg-white dark:bg-[#261E21] border-[#9B4D6F] shadow-soft font-semibold'
                  : 'bg-white/50 dark:bg-[#261E21]/50 border-transparent text-[#8B7578]'
              }`}
            >
              <Share2 className="w-5 h-5 mx-auto mb-1 text-[#9B4D6F]" />
              <span className="text-xs">Send invite link</span>
            </button>
            <button
              onClick={() => setInviteOption('enter')}
              className={`p-4 rounded-[16px] text-center border transition ${
                inviteOption === 'enter'
                  ? 'bg-white dark:bg-[#261E21] border-[#9B4D6F] shadow-soft font-semibold'
                  : 'bg-white/50 dark:bg-[#261E21]/50 border-transparent text-[#8B7578]'
              }`}
            >
              <Heart className="w-5 h-5 mx-auto mb-1 text-[#9B4D6F]" />
              <span className="text-xs">Enter partner code</span>
            </button>
          </div>

          {inviteOption === 'send' ? (
            <div className="space-y-4">
              <div className="p-6 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-center shadow-soft">
                <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase block mb-2">
                  Your Invite Code
                </span>
                <div className="text-3xl font-extrabold tracking-widest text-[#2D1F24] dark:text-white font-mono my-2">
                  {inviteCode}
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] border border-[#F0DFE3] dark:border-[#3D2F34] hover:bg-[#E8A5B9]/20"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#8B7578] dark:text-[#A89598] mt-4">
                  ⏳ Invite expires in 7 days
                </p>
              </div>

              {/* Waiting State */}
              <div className="p-4 rounded-[16px] bg-white/70 dark:bg-[#261E21]/70 border border-[#F0DFE3] dark:border-[#3D2F34] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#E8A5B9] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#E8A5B9] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#E8A5B9] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    Waiting for {partnerName} to join...
                  </span>
                </div>
                <button
                  onClick={() => changeStep('confirm')}
                  className="text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9] hover:underline"
                >
                  Simulate Join
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Invite Link</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-center shadow-soft">
                <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase block mb-4">
                  Enter 6-digit partner code
                </span>
                <div className="flex justify-between gap-2">
                  {partnerCodeInput.map((digit, i) => (
                    <input
                      key={i}
                      id={`pcode-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleDigitChange(i, e.target.value, partnerCodeInput, setPartnerCodeInput, 'pcode')
                      }
                      onKeyDown={(e) => handleKeyDown(i, e, partnerCodeInput, 'pcode')}
                      className="w-12 h-14 text-center text-xl font-bold rounded-[12px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#9B4D6F] text-[#2D1F24] dark:text-[#F5E6EA]"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => changeStep('confirm')}
                disabled={partnerCodeInput.some((d) => !d)}
                className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center disabled:opacity-60"
              >
                Connect with Partner
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // SCREEN 6 - PAIRING CONFIRM
  if (step === 'confirm') {
    const handleConfirmConnect = () => {
      const code = confirmCodeInput.join('');
      if (code.length < 6) {
        setErrorMessage('Please enter all 6 confirmation digits');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        changeStep('success');
      }, 900);
    };

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FFF9F5] dark:bg-[#1A1416] p-6 text-[#2D1F24] dark:text-[#F5E6EA]">
        <div className="max-w-sm mx-auto w-full pt-4">
          <button
            onClick={() => changeStep('invite')}
            className="w-11 h-11 rounded-full flex items-center justify-center -ml-2 text-[#8B7578] hover:text-[#2D1F24] dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Partner Preview Card */}
          <div className="mt-4 p-5 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#E8A5B9]/30 flex items-center justify-center text-3xl">
              🌸
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase block">
                Partner Found
              </span>
              <h3 className="text-xl font-bold text-[#2D1F24] dark:text-white">{partnerName}</h3>
              <p className="text-xs text-[#8B7578] dark:text-[#A89598]">Ready to pair your private sanctuary</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display mt-6">Confirm it's really them</h2>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1 mb-6">
            Enter the 6-digit confirmation code sent to {partnerName}'s device to securely exchange encryption keys.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-[12px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Helper box for pairing confirmation */}
          <div className="p-3.5 rounded-[16px] bg-[#FFF4E6] dark:bg-[#33282C] border border-[#E8A5B9]/50 text-xs text-[#9B4D6F] dark:text-[#E8A5B9] space-y-1 mb-4 shadow-sm">
            <div className="flex items-center space-x-2 font-bold">
              <Sparkles className="w-4 h-4 text-[#E8A5B9]" />
              <span>Simulated Partner Exchange</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8B7578] dark:text-[#D4C3C7]">
              Enter any 6 digits (e.g. <span className="font-mono font-bold text-xs bg-white/80 dark:bg-black/40 px-1 py-0.5 rounded text-[#2D1F24] dark:text-white">123456</span>) or tap below to auto-connect.
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-4">
            {confirmCodeInput.map((digit, i) => (
              <input
                key={i}
                id={`ccode-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleDigitChange(i, e.target.value, confirmCodeInput, setConfirmCodeInput, 'ccode')
                }
                onKeyDown={(e) => handleKeyDown(i, e, confirmCodeInput, 'ccode')}
                className="w-12 h-14 text-center text-xl font-bold rounded-[12px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#9B4D6F] text-[#2D1F24] dark:text-[#F5E6EA] shadow-soft"
              />
            ))}
          </div>

          {/* Quick Auto-fill Confirmation Code */}
          <button
            type="button"
            onClick={() => {
              setConfirmCodeInput(['1', '2', '3', '4', '5', '6']);
              setErrorMessage(null);
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                changeStep('success');
              }, 400);
            }}
            className="w-full py-2.5 rounded-[16px] bg-[#E8A5B9]/20 hover:bg-[#E8A5B9]/30 text-[#9B4D6F] dark:text-[#E8A5B9] text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-[#E8A5B9]/40 mb-3 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#9B4D6F] dark:text-[#E8A5B9]" />
            <span>Auto-fill Confirmation Code (123456) & Connect</span>
          </button>

          <button
            onClick={handleConfirmConnect}
            disabled={isLoading || confirmCodeInput.some((d) => !d)}
            className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Confirm & Connect</span>}
          </button>
        </div>
      </div>
    );
  }

  // SCREEN 7 - PAIRING SUCCESS
  if (step === 'success') {
    const handleStartJourney = () => {
      localStorage.setItem('twobe_is_paired', 'true');
      localStorage.removeItem('twobe_onboarding_step');
      analytics.trackPairingComplete(45, 'code');
      onComplete(partnerName);
    };

    return (
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#FFF9F5] via-[#FFF4E6] to-[#FFEBEF] dark:from-[#1A1416] dark:via-[#261E21] dark:to-[#1A1416] p-6 text-center select-none">
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto">
          {/* Couple Avatars with Heart Aura */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] flex items-center justify-center shadow-rose-glow p-2">
              <div className="flex items-center space-x-2 text-3xl">
                <span>{PRESET_AVATARS.find((a) => a.id === selectedAvatar)?.emoji || '🐰'}</span>
                <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                <span>🌸</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA] leading-tight">
            You're connected with {partnerName}!
          </h1>
          <p className="text-sm text-[#8B7578] dark:text-[#A89598] mt-3 max-w-xs">
            Your private world is ready. Everything between you is end-to-end encrypted and belongs to just the two of you.
          </p>
        </div>

        <div className="max-w-sm mx-auto w-full pb-4">
          <button
            onClick={handleStartJourney}
            className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-semibold shadow-rose-glow transition active:scale-95 flex items-center justify-center"
          >
            Start your journey
          </button>
        </div>
      </div>
    );
  }

  return null;
};
