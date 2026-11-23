import React from 'react';
import { Camera, Heart, ChevronRight } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const MemoryCarousel: React.FC = () => {
  const { memories, openUsModule } = useCouple();

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-purple-600 dark:text-lavender-400" />
          Precious Highlights
        </span>
        <button
          onClick={() => openUsModule('memories')}
          className="text-xs text-purple-700 dark:text-lavender-400 hover:text-purple-900 dark:hover:text-lavender-300 flex items-center font-semibold"
        >
          View all <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      <div className="flex space-x-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {memories.map((mem) => (
          <div
            key={mem.id}
            onClick={() => openUsModule('memories')}
            className="cursor-pointer snap-start shrink-0 w-44 rounded-2xl overflow-hidden bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 group hover:border-purple-300 dark:hover:border-lavender-400/40 transition shadow-sm dark:shadow-md"
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={mem.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80'}
                alt={mem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-white flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                {mem.likesCount}
              </div>
            </div>

            <div className="p-3">
              <div className="text-[10px] text-purple-700 dark:text-lavender-400 uppercase tracking-wider font-bold">
                {new Date(mem.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {mem.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                {mem.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
