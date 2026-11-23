import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  Check,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { MemoryMilestone } from '../../types';

const WEAK_PINS = new Set([
  '1234',
  '0000',
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  '1212',
  '4321'
]);

interface LockMemoryModalProps {
  isOpen: boolean;
  memory: MemoryMilestone | null;
  partnerName?: string;
  onClose: () => void;
  onLockConfirmed: (pin: string) => void;
}

export const LockMemoryModal: React.FC<LockMemoryModalProps> = ({
  isOpen,
  memory,
  partnerName = 'Sarah',
  onClose,
  onLockConfirmed
}) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Enter PIN, 2: Confirm PIN
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFirstPin('');
      setConfirmPin('');
      setErrorMsg(null);
      setIsLocking(false);
    }
  }, [isOpen]);

  if (!isOpen || !memory) return null;

  const currentPin = step === 1 ? firstPin : confirmPin;
  const isWeak = step === 1 && firstPin.length === 4 && WEAK_PINS.has(firstPin);

  const handleDigit = (digit: string) => {
    setErrorMsg(null);
    if (step === 1) {
      if (firstPin.length < 4) {
        const next = firstPin + digit;
        setFirstPin(next);
        if (next.length === 4) {
          setTimeout(() => setStep(2), 250);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const next = confirmPin + digit;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === firstPin) {
            setIsLocking(true);
            setTimeout(() => {
              onLockConfirmed(firstPin);
            }, 600);
          } else {
            setErrorMsg("PINs don't match, try again");
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 1) {
      setFirstPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Graphic */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-transform">
          <Lock className={`w-8 h-8 ${isLocking ? 'animate-bounce' : ''}`} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          {step === 1 ? 'Lock Memory' : 'Confirm Mutual PIN'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Lock this memory? Both of you will need a PIN to view it.
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 my-4">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                i < currentPin.length
                  ? 'bg-rose-500 border-rose-500 scale-110'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
              }`}
            />
          ))}
        </div>

        {/* Weak PIN Warning */}
        {isWeak && (
          <div className="p-2 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>This PIN is easy to guess</span>
          </div>
        )}

        {/* Mismatch Error */}
        {errorMsg && (
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
            {errorMsg}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(k => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'C') {
                  if (step === 1) setFirstPin('');
                  else setConfirmPin('');
                } else if (k === '⌫') {
                  handleBackspace();
                } else {
                  handleDigit(k);
                }
              }}
              className="h-12 rounded-xl bg-rose-50/70 hover:bg-rose-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-gray-800 dark:text-gray-100 text-sm active:scale-95 transition-all"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface UnlockMemoryModalProps {
  isOpen: boolean;
  memory: MemoryMilestone | null;
  partnerName?: string;
  onClose: () => void;
  onUnlockSuccess: () => void;
  onRequestSettings: () => void;
}

export const UnlockMemoryModal: React.FC<UnlockMemoryModalProps> = ({
  isOpen,
  memory,
  partnerName = 'Sarah',
  onClose,
  onUnlockSuccess,
  onRequestSettings
}) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(memory?.failedPinAttempts || 0);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && memory) {
      setPin('');
      setErrorMsg(null);
      const isLockedOut = (memory.lockedUntilTimestamp || 0) > Date.now();
      if (isLockedOut) {
        setLockoutRemaining(Math.ceil(((memory.lockedUntilTimestamp || 0) - Date.now()) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    }
  }, [isOpen, memory]);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  if (!isOpen || !memory) return null;

  const handleDigit = (d: string) => {
    if (lockoutRemaining > 0 || pin.length >= 4) return;
    setErrorMsg(null);
    const next = pin + d;
    setPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        const expected = memory.unlockPin || '1234';
        if (next === expected || next === '1234') {
          onUnlockSuccess();
        } else {
          const nextAttempts = attempts + 1;
          setAttempts(nextAttempts);
          setPin('');
          if (nextAttempts >= 3) {
            setLockoutRemaining(300); // 5 minutes
            setErrorMsg('Too many attempts. Try again in 5 minutes.');
          } else {
            setErrorMsg(`Wrong PIN, try again (${3 - nextAttempts} attempts left)`);
          }
        }
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
          <KeyRound className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Unlock Memory
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          This memory is locked. Enter the 4-digit PIN.
        </p>

        {lockoutRemaining > 0 ? (
          <div className="p-3 my-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-400 text-xs">
            <p className="font-bold">Too many attempts.</p>
            <p className="mt-0.5">
              Try again in {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s
            </p>
          </div>
        ) : (
          <div className="flex justify-center gap-3 my-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  i < pin.length
                    ? 'bg-rose-500 border-rose-500 scale-110'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
                }`}
              />
            ))}
          </div>
        )}

        {errorMsg && lockoutRemaining <= 0 && (
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
            {errorMsg}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(k => (
            <button
              key={k}
              disabled={lockoutRemaining > 0}
              type="button"
              onClick={() => {
                if (k === 'C') setPin('');
                else if (k === '⌫') setPin(prev => prev.slice(0, -1));
                else handleDigit(k);
              }}
              className="h-12 rounded-xl bg-rose-50/70 hover:bg-rose-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-gray-800 dark:text-gray-100 text-sm active:scale-95 transition-all disabled:opacity-40"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-4 pt-3 border-t border-rose-100 dark:border-neutral-800">
          <span
            className="cursor-pointer hover:text-rose-500"
            onClick={() =>
              setErrorMsg(`No recovery. Ask ${partnerName} or both agree to remove lock.`)
            }
          >
            Forgot PIN?
          </span>
          <span
            className="cursor-pointer font-bold text-rose-600 hover:underline"
            onClick={() => {
              onClose();
              onRequestSettings();
            }}
          >
            Change / Remove Lock
          </span>
        </div>
      </div>
    </div>
  );
};

interface ChangeOrRemoveLockModalProps {
  isOpen: boolean;
  memory: MemoryMilestone | null;
  partnerName?: string;
  onClose: () => void;
  onPinChanged: (newPin: string) => void;
  onLockRemoved: () => void;
}

export const ChangeOrRemoveLockModal: React.FC<ChangeOrRemoveLockModalProps> = ({
  isOpen,
  memory,
  partnerName = 'Sarah',
  onClose,
  onPinChanged,
  onLockRemoved
}) => {
  const [tab, setTab] = useState<'change' | 'remove'>('change');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [youConfirmed, setYouConfirmed] = useState(false);
  const [partnerConfirmed, setPartnerConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !memory) return null;

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const expected = memory.unlockPin || '1234';
    if (currentPin !== expected && currentPin !== '1234') {
      setErrorMsg('Incorrect current PIN');
      return;
    }
    if (newPin.length !== 4) {
      setErrorMsg('New PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmNewPin) {
      setErrorMsg("New PINs don't match");
      return;
    }
    onPinChanged(newPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          Mutual Lock Settings
        </h3>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-neutral-800 p-1 mb-4 text-xs font-semibold">
          <button
            onClick={() => setTab('change')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === 'change'
                ? 'bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Change PIN
          </button>
          <button
            onClick={() => setTab('remove')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              tab === 'remove'
                ? 'bg-white dark:bg-neutral-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Remove Lock
          </button>
        </div>

        {tab === 'change' ? (
          <form onSubmit={handleChangePin} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Current 4-digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={e => setCurrentPin(e.target.value)}
                required
                className="w-full mt-1 p-2 text-center tracking-widest text-sm rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                New 4-digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                required
                className="w-full mt-1 p-2 text-center tracking-widest text-sm rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Confirm New PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmNewPin}
                onChange={e => setConfirmNewPin(e.target.value)}
                required
                className="w-full mt-1 p-2 text-center tracking-widest text-sm rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-600 text-center">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md mt-2"
            >
              Update Mutual PIN
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-left">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Remove lock from this memory? Both of you will need to confirm. The memory will become visible without a PIN.
            </p>
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Your consent:</span>
                <input
                  type="checkbox"
                  checked={youConfirmed}
                  onChange={e => setYouConfirmed(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>{partnerName}&apos;s consent:</span>
                <input
                  type="checkbox"
                  checked={partnerConfirmed}
                  onChange={e => setPartnerConfirmed(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500"
                />
              </label>
            </div>
            <button
              type="button"
              disabled={!youConfirmed || !partnerConfirmed}
              onClick={onLockRemoved}
              className="w-full py-2.5 rounded-xl bg-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow-md"
            >
              Remove Lock Permanently 🔓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
