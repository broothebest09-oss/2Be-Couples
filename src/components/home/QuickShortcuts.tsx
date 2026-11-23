import React from 'react';
import { Gamepad2, Mail, HeartHandshake, Bot, HeartPulse, Film } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const QuickShortcuts: React.FC = () => {
  const { openUsModule } = useCouple();

  const shortcuts = [
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'text-amber-400 bg-amber-400/10' },
    { id: 'letters', label: 'Love Letters', icon: Mail, color: 'text-softpink-400 bg-softpink-400/10' },
    { id: 'emotional', label: 'Check-In', icon: HeartHandshake, color: 'text-lavender-400 bg-lavender-400/10' },
    { id: 'health', label: 'Health & Cycle', icon: HeartPulse, color: 'text-rose-400 bg-rose-400/10' },
    { id: 'entertainment', label: 'Entertainment', icon: Film, color: 'text-cyan-400 bg-cyan-400/10' },
    { id: 'ai', label: '2Be AI', icon: Bot, color: 'text-rosegold-400 bg-rosegold-400/10' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Our Couple Spaces
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => openUsModule(item.id)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 hover:border-purple-300 dark:hover:border-lavender-400/40 hover:bg-slate-50 dark:hover:bg-midnight-800 transition active:scale-95 group shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
