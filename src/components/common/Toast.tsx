import React from 'react';
import { Sparkles, Heart, Info } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const Toast: React.FC = () => {
  const { activeToast, fullscreenKissActive } = useCouple();

  return (
    <>
      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300 pointer-events-none max-w-[90vw]">
          <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl bg-midnight-900/95 dark:bg-midnight-900/95 bg-white/95 border border-lavender-400/30 shadow-2xl text-xs font-medium text-slate-100 dark:text-slate-100 text-slate-800">
            {activeToast.type === 'love' ? (
              <Heart className="w-4 h-4 text-softpink-400 fill-softpink-400 shrink-0" />
            ) : activeToast.type === 'kiss' ? (
              <span className="text-base shrink-0">💋</span>
            ) : (
              <Sparkles className="w-4 h-4 text-lavender-400 shrink-0" />
            )}
            <span className="line-clamp-1">{activeToast.message}</span>
          </div>
        </div>
      )}

      {/* Fullscreen Animated Kiss Overlay */}
      {fullscreenKissActive && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
          <div className="flex flex-col items-center animate-heart-burst">
            <span className="text-8xl filter drop-shadow-[0_0_30px_rgba(244,114,182,0.8)]">
              💋
            </span>
            <span className="text-2xl font-serif italic text-softpink-300 mt-2 filter drop-shadow-md">
              A Kiss For You
            </span>
          </div>
        </div>
      )}
    </>
  );
};
