import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { getCountdown } from '../../utils/date';

export const UpcomingEvent: React.FC = () => {
  const { events, openUsModule } = useCouple();
  const nextEvent = events[0];

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!nextEvent) return;
    const target = `${nextEvent.date}T${nextEvent.time && nextEvent.time.includes(':') ? nextEvent.time : '19:00'}:00`;
    setCountdown(getCountdown(target));

    const timer = setInterval(() => {
      setCountdown(getCountdown(target));
    }, 60000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent) return null;

  return (
    <div
      onClick={() => openUsModule('life')}
      className="cursor-pointer group relative overflow-hidden rounded-3xl p-5 bg-white dark:bg-midnight-900/80 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-lg hover:border-purple-300 dark:hover:border-lavender-400/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Upcoming Shared Event
        </span>
        <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 group-hover:text-purple-700 dark:group-hover:text-slate-200 transition font-medium">
          Calendar <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {nextEvent.title}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 text-purple-700 dark:text-lavender-300 font-semibold">
              <Clock className="w-3 h-3" />
              {new Date(nextEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
              {nextEvent.time && `• ${nextEvent.time}`}
            </span>
            {nextEvent.location && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <MapPin className="w-3 h-3" />
                {nextEvent.location}
              </span>
            )}
          </div>
        </div>

        {/* Live countdown pill */}
        <div className="flex items-center space-x-1.5 bg-[#F8F6F2] dark:bg-midnight-950/80 px-3 py-2 rounded-2xl border border-slate-200/90 dark:border-lavender-400/20 text-center shrink-0 shadow-sm">
          <div>
            <div className="text-base font-extrabold text-rose-600 dark:text-softpink-300 leading-none">
              {countdown.days}
            </div>
            <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">days</div>
          </div>
          <span className="text-slate-400 font-bold">:</span>
          <div>
            <div className="text-base font-extrabold text-purple-700 dark:text-lavender-300 leading-none">
              {countdown.hours}
            </div>
            <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">hrs</div>
          </div>
        </div>
      </div>
    </div>
  );
};
