import React, { useState } from 'react';
import {
  HeartHandshake,
  Smile,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Lock,
  Eye,
  Check,
  Send
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const EmotionalModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    currentUser,
    partnerUser,
    moods,
    submitMood,
    showToast
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'checkin' | 'lovelanguage' | 'weekly'>('checkin');

  // Check-in form state
  const myMood = moods[currentUser.id];
  const partnerMood = moods[partnerUser.id];

  const [moodLevel, setMoodLevel] = useState<number>(myMood?.moodLevel || 5);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(myMood?.moodEmoji || '🥰');
  const [selectedTags, setSelectedTags] = useState<string[]>(myMood?.feelingTags || ['Grateful', 'Connected']);
  const [wantsSupport, setWantsSupport] = useState<'comfort' | 'space' | 'just_listen' | 'distraction'>(
    myMood?.wantsComfortOrSpace || 'comfort'
  );
  const [supportNote, setSupportNote] = useState<string>(myMood?.supportNote || '');
  const [isSharedWithPartner, setIsSharedWithPartner] = useState<boolean>(
    myMood ? myMood.isSharedWithPartner : true
  );

  // Love language scores state
  const [loveLangTab, setLoveLangTab] = useState<'compare' | 'quiz'>('compare');

  const availableTags = [
    'Grateful',
    'Cozy',
    'Loving',
    'Excited',
    'Peaceful',
    'Tired',
    'Busy',
    'Need Hugs',
    'Thoughtful',
    'Playful'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveCheckIn = () => {
    submitMood({
      moodLevel,
      moodEmoji: selectedEmoji,
      feelingTags: selectedTags,
      wantsComfortOrSpace: wantsSupport,
      supportNote,
      isSharedWithPartner
    });
  };

  const moodEmojis = [
    { emoji: '😔', level: 1, label: 'Low Energy' },
    { emoji: '😐', level: 2, label: 'Okay' },
    { emoji: '🙂', level: 3, label: 'Pleasant' },
    { emoji: '✨', level: 4, label: 'Vibrant' },
    { emoji: '🥰', level: 5, label: 'Deeply Content' }
  ];

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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Emotional Connection</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'checkin'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Check-In
        </button>
        <button
          onClick={() => setActiveTab('lovelanguage')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'lovelanguage'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Love Languages
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'weekly'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Weekly Reflection
        </button>
      </div>

      {/* TAB 1: DAILY EMOTIONAL CHECK-IN */}
      {activeTab === 'checkin' && (
        <div className="space-y-4">
          {/* Privacy Note from Blueprint */}
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your emotional check-ins are strictly private by default. You choose whether to share your entry with your partner.
            </span>
          </div>

          {/* Current User's Check-In Form */}
          <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-800 dark:text-slate-300">
                How is your heart feeling today, {currentUser.name.split(' ')[0]}?
              </span>
              <span className="text-xs text-rose-600 dark:text-softpink-400 font-semibold">{selectedEmoji}</span>
            </div>

            {/* Emoji selector */}
            <div className="flex justify-between items-center py-2 px-1">
              {moodEmojis.map(m => (
                <button
                  key={m.level}
                  onClick={() => {
                    setMoodLevel(m.level);
                    setSelectedEmoji(m.emoji);
                  }}
                  className={`flex flex-col items-center p-2 rounded-2xl transition active:scale-95 ${
                    moodLevel === m.level
                      ? 'bg-purple-100 dark:bg-lavender-500/25 border border-purple-400 dark:border-lavender-400 text-slate-900 dark:text-white scale-110 shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Feeling tags */}
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-2 font-medium">
                Select your emotional vibes:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full transition active:scale-95 ${
                        isSelected
                          ? 'bg-softpink-500 text-white font-medium shadow-sm'
                          : 'bg-slate-100 dark:bg-midnight-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comfort vs Space */}
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-2 font-medium">
                What kind of energy do you need from {partnerUser.name.split(' ')[0]} today?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'comfort', label: 'Cuddles & Comfort 🫂' },
                  { id: 'space', label: 'Gentle Solo Space 🧘‍♀️' },
                  { id: 'just_listen', label: 'Just Listen to Me 👂' },
                  { id: 'distraction', label: 'Fun & Distraction 🍿' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setWantsSupport(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      wantsSupport === item.id
                        ? 'bg-purple-50 dark:bg-lavender-500/20 border-purple-400 dark:border-lavender-400 text-purple-900 dark:text-white font-medium'
                        : 'bg-slate-50 dark:bg-midnight-950 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:border-purple-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                Personal note or what made you smile:
              </label>
              <input
                type="text"
                value={supportNote}
                onChange={e => setSupportNote(e.target.value)}
                placeholder="e.g. A warm morning cup of tea, excited for our weekend..."
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Sharing toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
              <span className="text-slate-700 dark:text-slate-300">Share this check-in with {partnerUser.name.split(' ')[0]}</span>
              <button
                type="button"
                onClick={() => setIsSharedWithPartner(prev => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  isSharedWithPartner ? 'bg-softpink-500 justify-end' : 'bg-slate-200 dark:bg-midnight-950 justify-start border border-slate-300 dark:border-white/20'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <button
              onClick={handleSaveCheckIn}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
            >
              Save Emotional Check-In
            </button>
          </div>

          {/* Partner's Shared Check-In Card (if shared) */}
          <div className="rounded-3xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm space-y-2">
            <span className="text-xs uppercase font-bold text-rose-600 dark:text-rosegold-400 block">
              {partnerUser.name.split(' ')[0]}'s Shared Heart State
            </span>

            {partnerMood && partnerMood.isSharedWithPartner ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{partnerMood.moodEmoji}</span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Feeling level {partnerMood.moodLevel}/5
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Tags: {partnerMood.feelingTags.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950 text-slate-700 dark:text-slate-300 text-xs border border-slate-200/60 dark:border-transparent">
                  <span className="text-purple-700 dark:text-lavender-300 font-medium">Desired presence: </span>
                  {partnerMood.wantsComfortOrSpace === 'comfort' ? 'Warm cuddles & physical closeness 🫂' : 'Loving space to recharge'}
                  {partnerMood.supportNote && (
                    <p className="mt-1 text-slate-500 dark:text-slate-400 italic">"{partnerMood.supportNote}"</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                {partnerUser.nickname || partnerUser.name} hasn't shared an emotional check-in yet today.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LOVE LANGUAGES QUESTIONNAIRE */}
      {activeTab === 'lovelanguage' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400">
            Based on the 5 Love Languages. Used as tender conversation starters to understand how each of you receives affection best.
          </div>

          <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Love Language Comparison</h3>
              <span className="text-xs text-rose-600 dark:text-rosegold-400 font-semibold">Mutual Harmony</span>
            </div>

            {/* Compare Languages */}
            {[
              { name: 'Words of Affirmation', alex: 25, maya: 45, icon: '💬' },
              { name: 'Quality Time', alex: 40, maya: 30, icon: '⏳' },
              { name: 'Physical Touch', alex: 20, maya: 15, icon: '🫂' },
              { name: 'Acts of Service', alex: 10, maya: 7, icon: '☕️' },
              { name: 'Receiving Gifts', alex: 5, maya: 3, icon: '🎁' }
            ].map(lang => (
              <div key={lang.name} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5">
                    <span>{lang.icon}</span> {lang.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Alex ({lang.alex}%) • Maya ({lang.maya}%)
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Alex's bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-midnight-950 overflow-hidden">
                    <div
                      style={{ width: `${lang.alex}%` }}
                      className="h-full bg-lavender-500 rounded-full"
                    />
                  </div>
                  {/* Maya's bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-midnight-950 overflow-hidden">
                    <div
                      style={{ width: `${lang.maya}%` }}
                      className="h-full bg-softpink-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white block">Key Insight:</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Maya blossoms most with unexpected verbal compliments and sweet written notes, while Alex thrives in quiet, uninterrupted quality time together.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY REFLECTION */}
      {activeTab === 'weekly' && (
        <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400 block">
            Sunday Relationship Reflection
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            "What brought us closest together over the past 7 days?"
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Take five unhurried minutes together over Sunday tea to share one thing you deeply appreciated about each other.
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-midnight-950 text-xs text-slate-700 dark:text-slate-300 font-serif italic border border-slate-200/70 dark:border-white/5">
            "The goal of 2Be is never a numerical relationship score, but creating gentle space for honest, unhurried appreciation."
          </div>
        </div>
      )}
    </div>
  );
};
