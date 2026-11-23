import React, { useState, useEffect } from 'react';
import { X, Heart, Shield, Sparkles, Feather } from 'lucide-react';

interface WeNeedToTalkModalProps {
  isOpen: boolean;
  partnerName?: string;
  onClose: () => void;
  onEnterGentleMode: () => void;
}

export const WeNeedToTalkModal: React.FC<WeNeedToTalkModalProps> = ({
  isOpen,
  partnerName = 'Sarah',
  onClose,
  onEnterGentleMode
}) => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setSeconds(30);
      const timer = setInterval(() => {
        setSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 p-6 text-center overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dove icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 text-3xl">
          🕊️
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          We Need to Talk Mode
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          A calm, de-escalating sanctuary to discuss difficult topics with care and vulnerability.
        </p>

        {/* Breathing Sync Circle */}
        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-400/20 dark:bg-rose-400/10 animate-ping opacity-40" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-100 to-rose-100 dark:from-purple-950/40 dark:to-rose-950/40 flex flex-col items-center justify-center border border-purple-200 dark:border-purple-800">
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300 font-mono">
              {seconds}s
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase">
              Breathe
            </span>
          </div>
        </div>

        {/* Gentle Starters */}
        <div className="p-3.5 mb-4 rounded-2xl bg-purple-50/70 dark:bg-neutral-900/60 border border-purple-100 dark:border-purple-900/30 text-left space-y-1.5 text-xs">
          <p className="font-bold text-purple-800 dark:text-purple-300 text-[11px] uppercase tracking-wide">
            Compassionate Conversation Starters:
          </p>
          <p className="text-gray-700 dark:text-gray-300">“I feel hurt because...”</p>
          <p className="text-gray-700 dark:text-gray-300">“What I need most right now is...”</p>
          <p className="text-gray-700 dark:text-gray-300">“Help me understand how you saw that...”</p>
          <p className="text-gray-700 dark:text-gray-300">“I love you and I want us to be okay.”</p>
        </div>

        <button
          onClick={() => {
            onEnterGentleMode();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:opacity-95 transition active:scale-98"
        >
          Enter Gentle Mode with {partnerName} 🕊️
        </button>
      </div>
    </div>
  );
};
