import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Wifi, WifiOff, Battery, Bell, Volume2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCouple } from '../../context/CoupleContext';

export interface KissHugSyncOverlayProps {
  type: 'kiss' | 'hug';
  onClose: () => void;
  onSuccess?: () => void;
}

export const KissHugSyncOverlay: React.FC<KissHugSyncOverlayProps> = ({
  type,
  onClose,
  onSuccess
}) => {
  const {
    partnerUser,
    currentUser,
    sendMessage,
    showToast
  } = useCouple();

  const [isHolding, setIsHolding] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0.0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Partner Real-Time State
  const [isPartnerInApp, setIsPartnerInApp] = useState(partnerUser.isOnline);
  const [isPartnerHolding, setIsPartnerHolding] = useState(false);
  const [isNetworkDisconnected, setIsNetworkDisconnected] = useState(false);
  const [isLowBattery, setIsLowBattery] = useState(false);

  // Debounce check
  const [isDebounced, setIsDebounced] = useState(false);

  const holdIntervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const emoji = type === 'kiss' ? '💋' : '🤗';
  const actionName = type === 'kiss' ? 'kiss' : 'hug';

  // 30-Second Timeout
  useEffect(() => {
    // Check local debounce
    const lastAttempt = Number(sessionStorage.getItem('twobe_last_affection_attempt') || '0');
    const now = Date.now();
    if (now - lastAttempt < 5000) {
      setIsDebounced(true);
      setFeedbackMessage('Please wait 5s between affection attempts');
      const timer = setTimeout(() => onClose(), 1800);
      return () => clearTimeout(timer);
    }
    sessionStorage.setItem('twobe_last_affection_attempt', String(now));

    // If partner not in app, queue it
    if (!isPartnerInApp) {
      setFeedbackMessage(`Push sent: ${currentUser.name.split(' ')[0]} is sending you a ${actionName}! 💋 (Queued)`);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isSuccess) {
        setFeedbackMessage("Partner didn't respond, try again later");
        setTimeout(() => onClose(), 2200);
      }
    }, 30000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const startHolding = () => {
    if (isSuccess || isDebounced) return;
    setIsHolding(true);
    setFeedbackMessage(null);
    setProgressSeconds(0.0);

    // If partner in app, simulate real-time simultaneous holding via WebSocket!
    if (isPartnerInApp) {
      setIsPartnerHolding(true);
    }

    const stepMs = 50;
    let accumulated = 0;

    holdIntervalRef.current = setInterval(() => {
      accumulated += stepMs;
      const currentSec = Math.min(3.0, accumulated / 1000);
      setProgressSeconds(Number(currentSec.toFixed(1)));

      // Haptic feedback increases with time (light → medium → strong)
      if (navigator.vibrate && !isLowBattery) {
        if (accumulated < 1000 && accumulated % 250 === 0) {
          navigator.vibrate(20);
        } else if (accumulated >= 1000 && accumulated < 2000 && accumulated % 150 === 0) {
          navigator.vibrate(35);
        } else if (accumulated >= 2000 && accumulated % 100 === 0) {
          navigator.vibrate(50);
        }
      }

      // Exactly at 3.0 seconds: SUCCESS!
      if (accumulated >= 3000) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        handleCompletion();
      }
    }, stepMs);
  };

  const releaseHolding = () => {
    if (!isSuccess) {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setIsPartnerHolding(false);

      if (progressSeconds > 0.2 && progressSeconds < 3.0) {
        setFeedbackMessage('Almost! Hold longer next time');
      }
      setIsHolding(false);
      setProgressSeconds(0.0);

      setTimeout(() => {
        if (!isSuccess) {
          onClose();
        }
      }, 1600);
    }
  };

  const handleCompletion = () => {
    setIsSuccess(true);
    setIsHolding(false);

    // Strong vibration
    if (navigator.vibrate) {
      navigator.vibrate([80, 50, 120]);
    }

    // Exploding hearts & confetti
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: type === 'kiss' ? ['#FF8DA1', '#E85D88', '#FFF4E6'] : ['#D8B4FE', '#9333EA', '#FAF5FF']
      });
    } catch (e) {}

    // Increment lifetime counter
    const currentKisses = Number(localStorage.getItem('twobe_kisses') || '184');
    const currentHugs = Number(localStorage.getItem('twobe_hugs') || '142');
    if (type === 'kiss') {
      localStorage.setItem('twobe_kisses', String(currentKisses + 1));
    } else {
      localStorage.setItem('twobe_hugs', String(currentHugs + 1));
    }

    // Save to chat as special message
    sendMessage({
      text: type === 'kiss' ? '💋 Sent a warm 3.0s synchronized kiss' : '🤗 Sent a cozy 3.0s synchronized hug',
      mediaType: 'sticker'
    });

    showToast(`${type === 'kiss' ? 'Kiss' : 'Hug'} sent! ${emoji}`);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top Bar: Connection & Close */}
      <div className="flex items-center justify-between text-white/80">
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isNetworkDisconnected ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <span className="font-medium">
            {isNetworkDisconnected ? 'Reconnecting...' : 'WebSocket Synced'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Partner in-app invitation banner */}
      {isPartnerInApp && !isSuccess && !isHolding && (
        <div className="mx-auto max-w-xs px-3.5 py-1.5 rounded-full bg-[#FFF4E6]/15 border border-[#E8A5B9]/30 text-white text-xs text-center flex items-center justify-center gap-2">
          <span>💌</span>
          <span>{partnerUser.name.split(' ')[0]} is in app! Hold together</span>
        </div>
      )}

      {/* Center: Large Animated Icon + Instructions */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
            type === 'kiss'
              ? 'bg-gradient-to-tr from-rose-500 to-pink-400 shadow-rose-500/40'
              : 'bg-gradient-to-tr from-purple-600 to-pink-400 shadow-purple-500/40'
          }`}
          style={{
            transform: isSuccess
              ? 'scale(1.25)'
              : isHolding
              ? `scale(${1 + progressSeconds * 0.08})`
              : 'scale(1)'
          }}
        >
          <span className="text-7xl">{emoji}</span>

          {/* Sound / Pulse Wave Overlay */}
          {isHolding && (
            <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping pointer-events-none" />
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isSuccess
              ? `${type === 'kiss' ? 'Kiss' : 'Hug'} sent! ${emoji}`
              : isPartnerHolding && isHolding
              ? 'Both holding together! 💕'
              : isHolding
              ? 'Keep holding...'
              : `Hold to send ${actionName}`}
          </h2>
          <p className="text-xs text-white/75 max-w-xs">
            {isSuccess
              ? `${partnerUser.name.split(' ')[0]} feels your love right now`
              : isPartnerHolding && isHolding
              ? 'WebSocket synchronized • Releasing early cancels sync'
              : !isPartnerInApp
              ? `Queued for ${partnerUser.name.split(' ')[0]} when they open 2Be`
              : 'Hold the button for 3.0 seconds to deliver'}
          </p>
        </div>
      </div>

      {/* Bottom Section: Counter + 120px Circular Button */}
      <div className="flex flex-col items-center space-y-3 pb-6">
        {feedbackMessage && !isSuccess && (
          <div className="text-xs font-semibold text-rose-300 animate-shake">
            {feedbackMessage}
          </div>
        )}

        {/* Counter: 0.0s initially, counting up smoothly */}
        <div
          className={`text-2xl font-extrabold tracking-wider transition-colors ${
            isHolding ? 'text-pink-300' : 'text-white'
          }`}
        >
          {isSuccess ? '3.0s ✓' : `${progressSeconds.toFixed(1)}s`}
        </div>

        {/* 120px Diameter Button with Expanding Radial Glow */}
        <div className="relative flex items-center justify-center">
          {/* Visual glow effect intensifies */}
          {isHolding && (
            <div
              className="absolute rounded-full pointer-events-none transition-all duration-300"
              style={{
                width: `${120 + progressSeconds * 40}px`,
                height: `${120 + progressSeconds * 40}px`,
                background:
                  type === 'kiss'
                    ? 'radial-gradient(circle, rgba(244,114,182,0.5) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)'
              }}
            />
          )}

          {/* EXACT 120px CIRCULAR BUTTON */}
          <button
            onMouseDown={startHolding}
            onMouseUp={releaseHolding}
            onTouchStart={startHolding}
            onTouchEnd={releaseHolding}
            disabled={isSuccess}
            className={`w-[120px] h-[120px] rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-transform active:scale-95 cursor-pointer relative z-10 ${
              type === 'kiss'
                ? 'bg-gradient-to-tr from-[#E85D88] via-[#FF9EB5] to-[#E85D88] shadow-pink-500/50'
                : 'bg-gradient-to-tr from-[#9333EA] via-[#D8B4FE] to-[#9333EA] shadow-purple-500/50'
            }`}
          >
            <span className="text-3xl mb-0.5">{emoji}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {isHolding ? 'HOLDING' : 'HOLD'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
