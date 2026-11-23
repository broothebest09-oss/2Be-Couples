import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Target,
  Sparkles,
  Plane
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { CalendarEvent, BucketListItem } from '../../types';

export const OurLifeModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    events,
    addEvent,
    bucketList,
    toggleBucketItem,
    addBucketItem,
    goals,
    updateGoalAmount,
    currentUser,
    partnerUser
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'calendar' | 'bucket' | 'goals'>('calendar');

  // Event modal state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('19:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<CalendarEvent['category']>('date');

  // Bucket list state
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [bucketTitle, setBucketTitle] = useState('');
  const [bucketCategory, setBucketCategory] = useState<BucketListItem['category']>('travel');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addEvent({
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      location: eventLocation.trim() || undefined,
      category: eventCategory,
      reminderMinutes: 60
    });

    setEventTitle('');
    setEventLocation('');
    setShowAddEvent(false);
  };

  const handleCreateBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucketTitle.trim()) return;

    addBucketItem(bucketTitle.trim(), bucketCategory);
    setBucketTitle('');
    setShowAddBucket(false);
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto">
      {/* Header with back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-lavender-500/15">
        <button
          onClick={onBack}
          className="flex items-center text-xs text-purple-600 dark:text-lavender-300 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Us
        </button>
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Our Life</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'calendar'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Calendar ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('bucket')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'bucket'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Bucket List
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'goals'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Shared Goals
        </button>
      </div>

      {/* TAB 1: SHARED CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Dates, Trips & Anniversaries
            </span>
            <button
              onClick={() => setShowAddEvent(true)}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Event
            </button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => {
              const eventDateObj = new Date(ev.date);
              const daysLeft = Math.ceil((eventDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={ev.id}
                  className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-2 hover:border-purple-300 dark:hover:border-lavender-400/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
                        {ev.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{ev.title}</h3>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20 text-xs font-semibold text-rose-600 dark:text-softpink-300">
                        {daysLeft > 0 ? `In ${daysLeft} days` : daysLeft === 0 ? 'Today!' : 'Past'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
                    <span className="flex items-center gap-1 text-purple-700 dark:text-lavender-300 font-medium">
                      <Clock className="w-3 h-3" />
                      {eventDateObj.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}{' '}
                      {ev.time && `• ${ev.time}`}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {ev.location}
                      </span>
                    )}
                  </div>

                  {ev.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-white/5">
                      "{ev.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BUCKET LIST */}
      {activeTab === 'bucket' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Shared Adventures ({bucketList.filter(b => b.isCompleted).length}/{bucketList.length} Completed)
            </span>
            <button
              onClick={() => setShowAddBucket(true)}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Dream
            </button>
          </div>

          <div className="space-y-2.5">
            {bucketList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleBucketItem(item.id)}
                className={`cursor-pointer rounded-2xl p-3.5 border transition flex items-start space-x-3 ${
                  item.isCompleted
                    ? 'bg-slate-100/80 dark:bg-midnight-950/80 border-emerald-500/30 text-slate-500 dark:text-slate-400'
                    : 'bg-white dark:bg-midnight-900 border-slate-200/90 dark:border-lavender-400/20 text-slate-900 dark:text-white shadow-xs hover:border-purple-300 dark:hover:border-lavender-400/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-purple-500 dark:text-lavender-400" />
                  )}
                </div>

                <div className="flex-1">
                  <span
                    className={`text-xs font-medium block leading-snug ${
                      item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-semibold text-rose-600 dark:text-lavender-300">
                      {item.category}
                    </span>
                    {item.completedDate && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Accomplished on {item.completedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHARED GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Couple Milestone Funds & Goals
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400">
            Privacy promise: Financial and savings milestones are self-managed without requiring bank account integration.
          </div>

          <div className="space-y-3">
            {goals.map((g) => {
              const percent = g.targetAmount
                ? Math.min(100, Math.round(((g.currentAmount || 0) / g.targetAmount) * 100))
                : 100;

              return (
                <div
                  key={g.id}
                  className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-lavender-300">
                        {g.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{g.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rosegold-400">
                      ${g.currentAmount?.toLocaleString()} / ${g.targetAmount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-midnight-950 overflow-hidden border border-slate-200 dark:border-white/5">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-gradient-to-r from-softpink-500 to-lavender-400 rounded-full transition-all duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{percent}% achieved</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateGoalAmount(g.id, 50)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition"
                      >
                        +$50
                      </button>
                      <button
                        onClick={() => updateGoalAmount(g.id, 200)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-softpink-500/20 border border-rose-300 dark:border-softpink-400/30 text-xs font-medium text-rose-600 dark:text-softpink-300 hover:bg-rose-100 dark:hover:bg-softpink-500/30 transition"
                      >
                        +$200
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Event */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleCreateEvent}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Add Shared Couple Event</h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                placeholder="e.g. Candlelit Rooftop Dinner"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Location</label>
              <input
                type="text"
                value={eventLocation}
                onChange={e => setEventLocation(e.target.value)}
                placeholder="e.g. Osteria Bella or Our Living Room"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEvent(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Bucket Dream */}
      {showAddBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleCreateBucket}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Add Bucket List Dream</h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Dream / Adventure</label>
              <input
                type="text"
                value={bucketTitle}
                onChange={e => setBucketTitle(e.target.value)}
                placeholder="e.g. Roadtrip along Amalfi Coast"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Category</label>
              <select
                value={bucketCategory}
                onChange={e => setBucketCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              >
                <option value="travel">Travel</option>
                <option value="romantic">Romantic</option>
                <option value="adventure">Adventure</option>
                <option value="food">Food & Culinary</option>
                <option value="life">Life Milestones</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBucket(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Add Dream
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
