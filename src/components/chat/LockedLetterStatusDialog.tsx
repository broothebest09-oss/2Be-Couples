import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Clock,
  Sparkles,
  MapPin,
  Heart,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LockedLetterPayload } from '../../types';

interface LockedLetterStatusDialogProps {
  isOpen: boolean;
  letter: LockedLetterPayload | null;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const LockedLetterStatusDialog: React.FC<LockedLetterStatusDialogProps> = ({
  isOpen,
  letter,
  onClose,
  onUnlockSuccess
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [simulatedActionCount, setSimulatedActionCount] = useState(letter?.currentActionCount || 0);
  const [simulatedDistance, setSimulatedDistance] = useState(letter?.currentDistanceMeters || 1200);
  const [manualUnlockRequested, setManualUnlockRequested] = useState(false);

  useEffect(() => {
    if (letter) {
      setSimulatedActionCount(letter.currentActionCount || 0);
      setSimulatedDistance(letter.currentDistanceMeters || 1200);
      setManualUnlockRequested(false);
    }
  }, [letter]);

  useEffect(() => {
    if (!letter || letter.conditionType !== 'date_time' || !letter.unlockDateTime) return;

    const calculateTime = () => {
      const target = new Date(letter.unlockDateTime!).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [letter]);

  if (!isOpen || !letter) return null;

  const targetCount = letter.targetActionCount || 10;
  const radiusMeters = letter.locationRadiusMeters || 500;

  const handleSimulateAction = () => {
    const next = simulatedActionCount + 1;
    setSimulatedActionCount(next);
    if (next >= targetCount) {
      setTimeout(() => {
        onUnlockSuccess();
      }, 500);
    }
  };

  const handleSimulateArrival = () => {
    setSimulatedDistance(150); // Inside radius!
    setTimeout(() => {
      onUnlockSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Sealed Lock Badge */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/10 dark:bg-rose-500/20 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Letter is Still Sealed
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Sent with love by <span className="font-semibold text-rose-500">{letter.senderName}</span>
        </p>

        {/* Condition details */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 mb-5 text-left">
          <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            {letter.conditionType === 'date_time' && <Clock className="w-4 h-4" />}
            {letter.conditionType === 'after_action' && <Sparkles className="w-4 h-4" />}
            {letter.conditionType === 'location' && <MapPin className="w-4 h-4" />}
            <span>Unlock Requirement</span>
          </div>

          {/* Condition 1: Date & Time Countdown */}
          {letter.conditionType === 'date_time' && (
            <div>
              {letter.showCountdownToPartner !== false ? (
                <div className="grid grid-cols-4 gap-2 my-3 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-rose-100 dark:border-rose-900/30">
                    <span className="block font-bold text-lg text-rose-600 dark:text-rose-400">{timeLeft.days}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Days</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-rose-100 dark:border-rose-900/30">
                    <span className="block font-bold text-lg text-rose-600 dark:text-rose-400">{timeLeft.hours}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Hours</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-rose-100 dark:border-rose-900/30">
                    <span className="block font-bold text-lg text-rose-600 dark:text-rose-400">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Mins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-rose-100 dark:border-rose-900/30">
                    <span className="block font-bold text-lg text-rose-600 dark:text-rose-400">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-gray-400 uppercase">Secs</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 dark:text-gray-300 py-2">
                  The sender set this letter to open at a surprise future moment.
                </p>
              )}
              <p className="text-[11px] text-gray-400 text-center">
                Check back when the timer expires to unseal!
              </p>
            </div>
          )}

          {/* Condition 2: Action count progress */}
          {letter.conditionType === 'after_action' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Send {targetCount} {letter.targetActionType || 'kisses'}
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {simulatedActionCount} / {targetCount}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-rose-200/50 dark:bg-rose-900/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (simulatedActionCount / targetCount) * 100)}%` }}
                />
              </div>
              <button
                type="button"
                onClick={handleSimulateAction}
                className="w-full py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Send 1 {letter.targetActionType || 'kiss'} now</span>
              </button>
            </div>
          )}

          {/* Condition 3: Location proximity */}
          {letter.conditionType === 'location' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Target Spot: <strong className="text-rose-600 dark:text-rose-400">{letter.locationName || 'Special place'}</strong>
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-rose-100 dark:border-rose-900/40 text-xs flex items-center justify-between">
                <span className="text-gray-500">Distance:</span>
                <span className={`font-bold ${simulatedDistance <= radiusMeters ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {simulatedDistance}m away (radius: {radiusMeters}m)
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateArrival}
                  className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20"
                >
                  Simulate Arrival 📍
                </button>
                <button
                  type="button"
                  onClick={() => setManualUnlockRequested(true)}
                  disabled={manualUnlockRequested}
                  className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  {manualUnlockRequested ? 'Requested ✓' : 'Manual Unlock'}
                </button>
              </div>

              {manualUnlockRequested && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 text-center">
                  Manual unlock request sent to sender for approval!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Demo immediate unseal button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onUnlockSuccess}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/40 flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unseal Now (Instant Demo)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Close & Wait Patiently
          </button>
        </div>
      </div>
    </div>
  );
};
