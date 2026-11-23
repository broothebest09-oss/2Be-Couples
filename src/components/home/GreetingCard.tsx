import React from 'react';
import { Heart, Sparkles, Flame, CalendarHeart } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { getDaysTogether } from '../../utils/date';

export const GreetingCard: React.FC = () => {
  const { coupleSpace, currentUser, partnerUser } = useCouple();
  const daysTogether = getDaysTogether(coupleSpace.anniversaryDate);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-white via-rose-50/30 to-purple-50/40 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900 border border-purple-100 dark:border-lavender-400/20 shadow-md dark:shadow-xl transition-colors">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-200/40 dark:bg-softpink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/40 dark:bg-lavender-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header text */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-purple-700 dark:text-lavender-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-rosegold-400" />
            {getGreeting()}
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {coupleSpace.members[0].name.split(' ')[0]} & {coupleSpace.members[1].name.split(' ')[0]}
          </h1>
        </div>

        {/* Couple streak / intimacy flame */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-midnight-950/60 border border-rose-200 dark:border-rosegold-400/30 text-rose-700 dark:text-rosegold-300 shadow-sm">
          <Flame className="w-4 h-4 text-rose-500 dark:text-rosegold-400 fill-rose-500 dark:fill-rosegold-400" />
          <span className="text-xs font-bold">{coupleSpace.streakDays}d Streak</span>
        </div>
      </div>

      {/* Intertwined Avatars & Days Counter */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center -space-x-3">
          <div className="relative z-20">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover ring-3 ring-white dark:ring-midnight-900 shadow-md"
            />
            <span className="absolute -bottom-1 -left-1 text-sm bg-white dark:bg-midnight-950 rounded-full px-1 shadow-sm">
              {currentUser.mood?.split(' ').pop() || '✨'}
            </span>
          </div>

          <div className="relative z-10">
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-14 h-14 rounded-full object-cover ring-3 ring-white dark:ring-midnight-900 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-midnight-950 rounded-full px-1 shadow-sm">
              {partnerUser.mood?.split(' ').pop() || '💖'}
            </span>
          </div>

          <div className="pl-6 flex flex-col justify-center">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 dark:from-softpink-300 dark:via-lavender-300 dark:to-rosegold-300 bg-clip-text text-transparent">
                {daysTogether.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Days</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <CalendarHeart className="w-3 h-3 text-rose-500 dark:text-softpink-400" />
              Since {new Date(coupleSpace.anniversaryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-white/5 border border-rose-100 dark:border-white/10 flex items-center justify-center text-rose-500 dark:text-softpink-400 shadow-sm">
          <Heart className="w-5 h-5 fill-rose-500 dark:fill-softpink-400/80 animate-pulse-subtle" />
        </div>
      </div>
    </div>
  );
};
