import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  ChevronLeft,
  Flame,
  HelpCircle,
  SkipForward,
  CheckCircle2,
  Send,
  Lock,
  Heart
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { GameCard } from '../../types';

export const CoupleGamesModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    gameCards,
    answerGameCard,
    currentUser,
    partnerUser,
    showToast
  } = useCouple();

  const [activeCategory, setActiveCategory] = useState<'all' | 'romantic' | 'playful' | 'deep' | 'spicy'>('all');
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [userAnswerInput, setUserAnswerInput] = useState('');

  const filteredCards = gameCards.filter(
    c => activeCategory === 'all' || c.category === activeCategory
  );

  const currentCard: GameCard | undefined = filteredCards[selectedGameIndex % Math.max(1, filteredCards.length)];

  const isAlex = currentUser.id === 'user-alex';
  const myAnswer = isAlex ? currentCard?.partner1Response : currentCard?.partner2Response;
  const partnerAnswer = isAlex ? currentCard?.partner2Response : currentCard?.partner1Response;

  const handleNextGame = () => {
    setSelectedGameIndex(prev => prev + 1);
    setUserAnswerInput('');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard || !userAnswerInput.trim()) return;
    answerGameCard(currentCard.id, userAnswerInput.trim());
    setUserAnswerInput('');
  };

  const handleSelectOption = (opt: string) => {
    if (!currentCard) return;
    answerGameCard(currentCard.id, opt);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-lavender-500/15">
        <button
          onClick={onBack}
          className="flex items-center text-xs text-purple-600 dark:text-lavender-300 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Us
        </button>
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Couple Games</h2>
        <div className="w-12" />
      </div>

      {/* Category selector */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Games', icon: '✨' },
          { id: 'romantic', label: 'Romantic', icon: '💖' },
          { id: 'playful', label: 'Playful', icon: '🎉' },
          { id: 'deep', label: 'Deep Soul', icon: '🌌' },
          { id: 'spicy', label: 'Flirty / 18+', icon: '🌶️' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setSelectedGameIndex(0);
            }}
            className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition active:scale-95 flex items-center gap-1 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow-md'
                : 'bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Game Card */}
      {currentCard ? (
        <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-rose-50/30 to-purple-50/40 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900 border border-slate-200/90 dark:border-lavender-400/30 shadow-md dark:shadow-2xl space-y-4">
          {/* Card meta */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {currentCard.type.replace(/_/g, ' ')} • {currentCard.category}
            </span>

            <button
              onClick={handleNextGame}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
              title="Skip or next card"
            >
              <span>Skip / Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prompt */}
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-relaxed text-center py-4">
            "{currentCard.prompt}"
          </h3>

          {/* If the card has preset options (e.g. Would You Rather / Multiple Choice) */}
          {currentCard.options && currentCard.options.length > 0 && (
            <div className="space-y-2 pt-2">
              {currentCard.options.map((opt, i) => {
                const isMyChoice = myAnswer === opt;
                const isPartnerChoice = partnerAnswer === opt;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-3.5 rounded-2xl border text-xs font-medium text-left transition active:scale-95 flex items-center justify-between ${
                      isMyChoice
                        ? 'bg-rose-50 dark:bg-softpink-500/20 border-rose-400 dark:border-softpink-400 text-rose-950 dark:text-white shadow-xs'
                        : 'bg-white/90 dark:bg-midnight-950/80 border-slate-200 dark:border-lavender-500/20 text-slate-800 dark:text-slate-300 hover:border-purple-300 dark:hover:border-lavender-400/40'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className="flex items-center gap-1">
                      {isMyChoice && <span className="text-[10px] text-rose-600 dark:text-softpink-300 font-bold">(You)</span>}
                      {isPartnerChoice && (
                        <span className="text-[10px] text-purple-700 dark:text-rosegold-400 font-bold">
                          ({partnerUser.name.split(' ')[0]})
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* If freeform text prompt */}
          {!currentCard.options && (
            <div className="space-y-3 pt-2">
              {/* My answer field */}
              {myAnswer ? (
                <div className="p-3 rounded-2xl bg-white/90 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-400/20 text-xs shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-softpink-300 block mb-1">
                    Your Answer ({currentUser.name.split(' ')[0]}):
                  </span>
                  <p className="text-slate-900 dark:text-white font-medium">{myAnswer}</p>
                </div>
              ) : (
                <form onSubmit={handleAnswerSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswerInput}
                    onChange={e => setUserAnswerInput(e.target.value)}
                    placeholder="Type your secret answer..."
                    className="flex-1 bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shrink-0 shadow-md active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Partner's answer */}
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-400/20 text-xs shadow-xs">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-rosegold-400 block mb-1">
                  {partnerUser.name.split(' ')[0]}'s Answer:
                </span>
                {partnerAnswer ? (
                  <p className="text-slate-900 dark:text-white font-medium">{partnerAnswer}</p>
                ) : (
                  <p className="text-slate-500 italic">Waiting for partner to respond...</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          No cards found for this category.
        </div>
      )}

      {/* Rules & Opt-out assurance */}
      <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400 flex items-start gap-2">
        <Heart className="w-4 h-4 text-rose-500 dark:text-softpink-400 shrink-0 mt-0.5" />
        <span>
          Game rules: Playfulness without pressure. Either partner can pass, skip, or change categories freely anytime.
        </span>
      </div>
    </div>
  );
};
