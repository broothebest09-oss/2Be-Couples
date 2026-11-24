import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Sparkles, Send, RefreshCw, X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { analytics } from '../../services/analytics';

interface GratitudeNoteItem {
  id: string;
  text: string;
  authorName: string;
  authorAvatar: string;
  dateText: string;
  colorBg: string;
}

export const GratitudeJarSection: React.FC<{
  onMilestoneReached?: (title: string, subtitle: string) => void;
}> = ({ onMilestoneReached }) => {
  const { partnerUser, currentUser } = useCouple();

  const [notes, setNotes] = useState<GratitudeNoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('2be_gratitude_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inputText, setInputText] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [activeNoteModal, setActiveNoteModal] = useState<GratitudeNoteItem | null>(null);
  const [partnerNotification, setPartnerNotification] = useState<string | null>(null);
  const [milestoneCelebration, setMilestoneCelebration] = useState<{ title: string; subtitle: string } | null>(null);

  const fillPercent = Math.min(100, Math.round((notes.length / 100) * 100));

  // Determine jar liquid color based on fullness:
  // empty = clear, 25% = light pink, 50% = pink, 75% = rose, 100% = deep rose with sparkles
  const jarFillColor =
    fillPercent < 10
      ? 'from-transparent to-pink-50/20'
      : fillPercent < 35
      ? 'from-pink-100/30 to-[#FFE3E8]/60'
      : fillPercent < 60
      ? 'from-[#FFD1DC]/50 to-[#E8A5B9]/70'
      : fillPercent < 85
      ? 'from-[#E8A5B9]/70 to-[#9B4D6F]/80'
      : 'from-[#E8A5B9] to-[#9B4D6F]';

  const triggerShake = () => {
    if (notes.length === 0) {
      setPartnerNotification('Your jar is empty right now! Drop your first note of appreciation below 💕');
      setTimeout(() => setPartnerNotification(null), 3500);
      return;
    }
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      if (randomNote) {
        setActiveNoteModal(randomNote);
      }
      analytics.trackGratitudeNoteRead('shake');
      try {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }, 500);
  };

  const handleDropNote = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    analytics.trackGratitudeNoteAdded(trimmed.length);

    const newNote: GratitudeNoteItem = {
      id: Date.now().toString(),
      text: trimmed,
      authorName: currentUser.name.split(' ')[0],
      authorAvatar: currentUser.avatar,
      dateText: 'Just now',
      colorBg: ['bg-[#FFE3E8]', 'bg-[#FFF3CD]', 'bg-[#E3F2FD]', 'bg-[#E8F5E9]', 'bg-[#F3E5F5]'][
        Math.floor(Math.random() * 5)
      ]
    };

    const nextCount = notes.length + 1;
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    try {
      localStorage.setItem('2be_gratitude_notes', JSON.stringify(updatedNotes));
    } catch (e) {}
    setInputText('');

    // Notification
    setPartnerNotification(`${currentUser.name.split(' ')[0]} added a note to the gratitude jar ✨`);
    setTimeout(() => setPartnerNotification(null), 3500);

    // Milestones check
    if (nextCount === 10 || nextCount === 50 || nextCount === 100) {
      const ms =
        nextCount === 10
          ? { title: '10 notes! 🎉', subtitle: 'A blossom of mutual appreciation' }
          : nextCount === 50
          ? { title: '50 notes! 🌟', subtitle: "You're amazing together" }
          : { title: '100 notes! 💖', subtitle: 'A century of gratitude' };
      setMilestoneCelebration(ms);
      onMilestoneReached?.(ms.title, ms.subtitle);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Partner Notification Banner */}
      {partnerNotification && (
        <div className="p-2.5 rounded-xl bg-[#9B4D6F] text-white text-xs font-semibold text-center animate-fadeIn shadow-soft">
          {partnerNotification}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. JAR VISUAL (Top half of screen)                       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-[20px] bg-white/90 dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex flex-col items-center">
        {/* Above Jar: Note count */}
        <div className="flex items-center space-x-1.5 mb-3">
          <span className="text-base font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
            {notes.length} notes of gratitude
          </span>
          {fillPercent >= 100 && <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />}
        </div>

        {/* Jar Illustration (200px tall) */}
        <div
          className={`relative w-40 h-52 flex flex-col items-center transition-transform ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          {/* Jar Cork Lid */}
          <div className="w-24 h-5 rounded-t-md bg-[#D4A373] border border-[#A67C52] shadow-sm z-10" />
          <div className="w-28 h-2 rounded-sm bg-white/60 dark:bg-white/20 border-x border-[#F0DFE3] z-10" />

          {/* Glass Body with Fill Level and reflection */}
          <div className="relative w-36 h-44 rounded-b-[28px] rounded-t-[10px] border-4 border-white/90 dark:border-white/30 shadow-2xl overflow-hidden bg-gradient-to-b from-white/30 to-white/10 dark:from-white/10 dark:to-transparent flex flex-col justify-end">
            {/* Glass Curving Highlight */}
            <div className="absolute top-2 left-2 w-2 h-36 rounded-full bg-white/40 blur-[1px]" />

            {/* Liquid Fill Level */}
            <div
              style={{ height: `${Math.max(5, fillPercent)}%` }}
              className={`w-full bg-gradient-to-t ${jarFillColor} transition-all duration-700 relative`}
            >
              {/* Floating folded paper notes inside jar */}
              <div className="absolute inset-0 p-2 flex flex-wrap gap-1.5 items-end overflow-hidden opacity-90">
                {notes.slice(0, 18).map((n, i) => (
                  <span
                    key={n.id}
                    style={{ transform: `rotate(${(i * 37) % 60 - 30}deg)` }}
                    className={`inline-block w-4 h-3 rounded-[2px] shadow-sm ${n.colorBg} border border-black/10`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Base shadow */}
          <div className="w-32 h-3 -mt-1 rounded-full bg-black/10 dark:bg-black/40 blur-sm" />
        </div>

        {/* Below Jar: Shake indicator button */}
        <button
          onClick={triggerShake}
          className="mt-4 flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs font-semibold text-[#8B7578] dark:text-[#A89598] hover:text-[#9B4D6F] transition active:scale-95"
        >
          <span>📳</span>
          <span>Shake phone (or tap here) to draw a note</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. ADD NOTE SECTION (Middle)                             */}
      {/* ======================================================== */}
      <div className="p-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase">
            What are you grateful for today?
          </span>
          <span className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
            {inputText.length}/500
          </span>
        </div>

        <textarea
          rows={3}
          maxLength={500}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="A sweet gesture, a warm laugh, or something they did that made you smile..."
          className="w-full p-3 rounded-[12px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs resize-none focus:outline-none focus:border-[#E8A5B9] text-[#2D1F24] dark:text-white"
        />

        <button
          onClick={handleDropNote}
          disabled={!inputText.trim()}
          className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow transition active:scale-95 disabled:opacity-50"
        >
          Drop in Jar 🍯
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. RECENT NOTES (Bottom)                                 */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] px-1">Recent notes</h4>
        {notes.length === 0 ? (
          <div className="p-4 rounded-xl text-center text-xs text-[#8B7578] bg-white dark:bg-[#261E21]">
            No notes yet. Be the first to drop one in!
          </div>
        ) : (
          notes.slice(0, 5).map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteModal(note)}
              className="cursor-pointer p-3 rounded-[14px] bg-white/90 dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex items-center justify-between transition hover:border-[#E8A5B9] active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={note.authorAvatar}
                  alt={note.authorName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E8A5B9] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#2D1F24] dark:text-[#F5E6EA] truncate">
                    {note.text.length > 50 ? `${note.text.slice(0, 50)}...` : note.text}
                  </p>
                  <span className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                    {note.authorName} • {note.dateText}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] ml-2 shrink-0">
                Read
              </span>
            </div>
          ))
        )}
      </div>

      {/* Full Note Modal (From Shake or Tap) */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-[#FFF8E7] dark:bg-[#2E2428] border border-[#E8A5B9] p-6 space-y-4 shadow-2xl relative text-[#2D1F24] dark:text-[#F5E6EA] animate-spring-press">
            <button
              onClick={() => setActiveNoteModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#8B7578]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 pt-2">
              <img
                src={activeNoteModal.authorAvatar}
                alt={activeNoteModal.authorName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E8A5B9]"
              />
              <div>
                <h4 className="text-xs font-bold">From {activeNoteModal.authorName}</h4>
                <p className="text-[10px] text-[#8B7578]">{activeNoteModal.dateText}</p>
              </div>
            </div>

            <p className="text-sm font-serif italic text-center py-4 leading-relaxed">
              “{activeNoteModal.text}”
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  const remaining = notes.filter((n) => n.id !== activeNoteModal.id);
                  if (remaining.length > 0) {
                    setActiveNoteModal(remaining[Math.floor(Math.random() * remaining.length)]);
                  }
                }}
                className="flex-1 py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
              >
                Next Note 🔀
              </button>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="flex-1 py-2.5 rounded-[24px] bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Celebration Dialog */}
      {milestoneCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#E8A5B9] p-6 text-center space-y-4 shadow-2xl">
            <span className="text-5xl block animate-bounce">🎉</span>
            <h3 className="text-lg font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA]">
              {milestoneCelebration.title}
            </h3>
            <p className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9] font-medium">
              {milestoneCelebration.subtitle}
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-semibold text-emerald-600">
              ✓ Auto-saved to Memories Timeline
            </div>
            <button
              onClick={() => setMilestoneCelebration(null)}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
            >
              Celebrate Together
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
