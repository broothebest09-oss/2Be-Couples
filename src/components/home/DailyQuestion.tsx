import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, Lock } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const DailyQuestion: React.FC = () => {
  const { dailyPrompt, answerDailyPrompt, currentUser, partnerUser } = useCouple();
  const isAlex = currentUser.id === 'user-alex';
  const myAnswer = isAlex ? dailyPrompt.partner1Answer : dailyPrompt.partner2Answer;
  const partnerAnswer = isAlex ? dailyPrompt.partner2Answer : dailyPrompt.partner1Answer;

  const [inputVal, setInputVal] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    answerDailyPrompt(inputVal.trim());
    setInputVal('');
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900/70 border border-slate-200/80 dark:border-lavender-400/20 shadow-sm dark:shadow-lg transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-purple-700 dark:text-lavender-400">
          <HelpCircle className="w-4 h-4 text-rose-500 dark:text-softpink-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Today's Connection Question
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Daily Ritual</span>
      </div>

      <p className="text-base font-serif italic text-slate-900 dark:text-white leading-relaxed mb-4">
        "{dailyPrompt.question}"
      </p>

      {/* Answers display */}
      <div className="space-y-3">
        {/* Current user's answer */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950/70 border border-slate-200/80 dark:border-lavender-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-purple-800 dark:text-lavender-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-softpink-400"></span>
              Your Thought ({currentUser.name.split(' ')[0]})
            </span>
            {myAnswer && !isEditing && (
              <button
                onClick={() => {
                  setInputVal(myAnswer);
                  setIsEditing(true);
                }}
                className="text-[10px] text-purple-700 dark:text-slate-400 hover:underline font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          {myAnswer && !isEditing ? (
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal font-medium">{myAnswer}</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Write your honest, loving answer..."
                className="flex-1 bg-white dark:bg-midnight-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-3 py-2 border border-slate-300 dark:border-lavender-400/30 focus:outline-none focus:border-rose-500 dark:focus:border-softpink-400 shadow-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-medium flex items-center justify-center shrink-0 active:scale-95 shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Partner's answer */}
        <div className="p-3.5 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950/70 border border-slate-200/80 dark:border-lavender-500/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-800 dark:text-rosegold-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-rosegold-400"></span>
              {partnerUser.name.split(' ')[0]}'s Answer
            </span>
            {partnerAnswer ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Waiting...
              </span>
            )}
          </div>

          {partnerAnswer ? (
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal font-medium">{partnerAnswer}</p>
          ) : (
            <p className="text-xs italic text-slate-500 dark:text-slate-400">
              {partnerUser.nickname || partnerUser.name} hasn't answered yet today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
