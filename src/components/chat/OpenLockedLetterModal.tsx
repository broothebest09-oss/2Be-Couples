import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Reply,
  Bookmark,
  Share2,
  Calendar,
  LockOpen,
  Volume2,
  Film,
  Camera,
  Check
} from 'lucide-react';
import { LockedLetterPayload } from '../../types';

interface OpenLockedLetterModalProps {
  isOpen: boolean;
  letter: LockedLetterPayload | null;
  onClose: () => void;
  onReply: (quoteText: string) => void;
}

export const OpenLockedLetterModal: React.FC<OpenLockedLetterModalProps> = ({
  isOpen,
  letter,
  onClose,
  onReply
}) => {
  const [isUnsealing, setIsUnsealing] = useState(true);
  const [isSavedToMemories, setIsSavedToMemories] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsUnsealing(true);
      const timer = setTimeout(() => {
        setIsUnsealing(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !letter) return null;

  const openedDateStr =
    letter.openedAtDateText ||
    new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) +
      ' at ' +
      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Celebration Unsealing Stage */}
      {isUnsealing ? (
        <div className="relative text-center flex flex-col items-center justify-center p-8 text-white animate-pulse">
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            {/* Sparkles burst */}
            <div className="absolute inset-0 rounded-full bg-rose-400/40 animate-ping" />
            <div className="absolute -inset-4 rounded-full bg-pink-400/20 animate-spin" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 shadow-2xl flex items-center justify-center text-5xl">
              💌
            </div>
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
            Unsealing Your Love Letter...
            <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
          </h2>
          <p className="text-sm text-rose-200">Breaking the seal of patience & love ✨</p>
        </div>
      ) : (
        /* Actual Letter View */
        <div className="relative w-full max-w-xl bg-[#FFF9F5] dark:bg-[#1E1719] rounded-3xl shadow-2xl border border-rose-200/60 dark:border-rose-950/40 overflow-hidden my-6 animate-scale-up">
          
          {/* Top Banner Ribbon */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-500/90 via-pink-500/90 to-rose-600/90 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <LockOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-white/90">
                  Unsealed Keepsake
                </span>
                <span className="text-[11px] text-white/75">
                  Opened on {openedDateStr}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Letter Body Container */}
          <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Header: Sender & Stamp */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-200/50 dark:border-rose-900/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-2xl shadow-inner">
                  ❤️
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-100">
                    From {letter.senderName}
                  </h4>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    Written with all their heart
                  </p>
                </div>
              </div>

              {/* Romantic Vintage Stamp */}
              <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-rose-400/60 dark:border-rose-600/40 rounded-lg p-1 rotate-3 bg-rose-50/50 dark:bg-rose-950/30">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30" />
                <span className="text-[9px] font-bold tracking-widest text-rose-500 uppercase mt-1">2BE LOVE</span>
              </div>
            </div>

            {/* Letter Content Parchment Style */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#FFF4E6]/60 dark:bg-neutral-900/40 border border-rose-100 dark:border-rose-950/40 shadow-sm relative">
              <div className="prose dark:prose-invert max-w-none font-serif text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {letter.letterContent}
              </div>
            </div>

            {/* Media Keepsakes Section */}
            {letter.mediaItems && letter.mediaItems.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-3">
                  Attached Keepsakes ({letter.mediaItems.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {letter.mediaItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => setActiveMediaPreview(item.url)}
                      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-rose-200/70 hover:scale-[1.02] transition-transform"
                    >
                      {item.isVideo ? (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                          <Film className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white">
                            {item.durationText || 'Video'}
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt="keepsake"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notification Badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>This letter is permanently unlocked. You can re-read it anytime!</span>
            </div>
          </div>

          {/* Action Bar Footer */}
          <div className="p-4 bg-white dark:bg-[#1A1416] border-t border-rose-100 dark:border-rose-950/40 flex items-center justify-between gap-3">
            <button
              onClick={() => setIsSavedToMemories(!isSavedToMemories)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSavedToMemories
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-rose-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSavedToMemories ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSavedToMemories ? 'Saved in Memories' : 'Save to Memories'}</span>
            </button>

            <button
              onClick={() => {
                onReply(letter.letterContent);
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Reply className="w-4 h-4" />
              <span>Reply with Love</span>
            </button>
          </div>
        </div>
      )}

      {/* Expanded Media Lightbox */}
      {activeMediaPreview && (
        <div
          onClick={() => setActiveMediaPreview(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden">
            <img src={activeMediaPreview} alt="full preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setActiveMediaPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-rose-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
