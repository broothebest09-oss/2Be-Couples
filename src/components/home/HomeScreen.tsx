import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Camera, Heart, Check, Sparkles, Lock, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KissHugSyncOverlay } from '../common/KissHugSyncOverlay';

export const HomeScreen: React.FC = () => {
  const { partnerUser, currentUser, setActiveTab, sendSecretLove } = useCouple();

  // Region 3 Prompt state
  const [promptAnswer, setPromptAnswer] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [shareWithPartner, setShareWithPartner] = useState(true);

  // Region 4 Overlay state
  const [activeOverlay, setActiveOverlay] = useState<'kiss' | 'hug' | null>(null);

  // Region 5 Detail popup state
  const [selectedUpcoming, setSelectedUpcoming] = useState<any>(null);

  const streakDays = 15;
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const upcomingList = [
    {
      id: '1',
      title: `Letter from ${partnerUser.name.split(' ')[0]}`,
      subtitle: 'Opens in 2 days 🔒',
      dateText: 'Nov 25',
      emoji: '💌',
      detail: 'A sealed love letter scheduled to unlock on your anniversary countdown.'
    },
    {
      id: '2',
      title: '100 Days Together Milestone',
      subtitle: 'Only 5 days left 🎉',
      dateText: 'Nov 28',
      emoji: '🥂',
      detail: 'Celebrate 100 days of shared moments, laughter, and building intimacy.'
    },
    {
      id: '3',
      title: 'Our Anniversary',
      subtitle: 'In 12 days ❤️',
      dateText: 'Dec 5',
      emoji: '💍',
      detail: 'Our special day! Private photo memory recap will be generated.'
    }
  ];

  const triggerKiss = () => {
    setActiveOverlay('kiss');
    sendSecretLove();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF9EB5', '#E85D88', '#FFF4E6']
      });
    } catch (e) {}
    setTimeout(() => setActiveOverlay(null), 1600);
  };

  const triggerHug = () => {
    setActiveOverlay('hug');
    sendSecretLove();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D8B4FE', '#9333EA', '#FAF5FF']
      });
    } catch (e) {}
    setTimeout(() => setActiveOverlay(null), 1600);
  };

  return (
    <div className="space-y-5 pb-28 pt-2 select-none">
      {/* ======================================================== */}
      {/* REGION 1 - HEADER                                        */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between px-2 pt-2">
        {/* Your avatar (left, 48px circle) */}
        <button
          onClick={() => setActiveTab('avatar')}
          title="Go to Avatar"
          className="relative group transition-transform active:scale-90"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E8A5B9] shadow-soft animate-float-slow"
          />
        </button>

        {/* Center: Streak counter with fire emoji + Today's date */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft">
            <span className="text-base animate-pulse">🔥</span>
            <span className="text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
              {streakDays} days
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#8B7578] dark:text-[#A89598] mt-1">
            {todayDate}
          </span>
        </div>

        {/* Partner's avatar (right, 48px circle) */}
        <button
          onClick={() => setActiveTab('avatar')}
          title="Go to Partner Avatar"
          className="relative group transition-transform active:scale-90"
        >
          <img
            src={partnerUser.avatar}
            alt={partnerUser.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#9B4D6F] shadow-soft animate-float-slow"
            style={{ animationDelay: '1s' }}
          />
        </button>
      </div>

      {/* ======================================================== */}
      {/* REGION 2 - PARTNER STATUS CARD                           */}
      {/* ======================================================== */}
      <div
        onClick={() => setActiveTab('avatar')}
        className="cursor-pointer p-4 rounded-[16px] bg-white/90 dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft transition hover:border-[#E8A5B9]/60 active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3.5">
          {/* Avatar (64px) with status ring */}
          <div className="relative shrink-0">
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#E8A5B9] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#7FB77E] border-2 border-white dark:border-[#261E21] rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] truncate">
                {partnerUser.nickname || partnerUser.name}
              </h3>
              <span className="text-[11px] font-semibold text-[#7FB77E]">Online</span>
            </div>
            <p className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] mt-0.5 truncate">
              {partnerUser.statusMessage || 'Thinking of you 💭'}
            </p>
            <p className="text-[11px] text-[#8B7578] dark:text-[#A89598] mt-1">
              Tap to visit {partnerUser.name.split(' ')[0]}'s avatar
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REGION 3 - DAILY PROMPT                                  */}
      {/* ======================================================== */}
      <div className="p-4 rounded-[16px] bg-gradient-to-br from-white via-[#FFF9F5] to-[#FFF4E6] dark:from-[#261E21] dark:via-[#261E21] dark:to-[#33282C] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase">
            Question of the day
          </span>
          {!isSaved && !isSkipped && (
            <span className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
              {promptAnswer.length}/500
            </span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-[#2D1F24] dark:text-[#F5E6EA] mb-3 leading-snug">
          “What's one thing you appreciate about them today?”
        </h4>

        {isSaved ? (
          <div className="p-3 rounded-[12px] bg-[#7FB77E]/10 border border-[#7FB77E]/30 flex items-center justify-between animate-spring-press">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#7FB77E]">Saved ✓</span>
              <span className="text-xs text-[#8B7578] dark:text-[#A89598]">
                {shareWithPartner ? 'Shared with your partner' : 'Saved privately'}
              </span>
            </div>
            <button
              onClick={() => setIsSaved(false)}
              className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] hover:underline"
            >
              Edit
            </button>
          </div>
        ) : isSkipped ? (
          <div className="p-3 rounded-[12px] bg-white/70 dark:bg-[#1A1416]/50 flex items-center justify-between text-xs text-[#8B7578]">
            <span>Skipped for today</span>
            <button
              onClick={() => setIsSkipped(false)}
              className="font-bold text-[#9B4D6F] dark:text-[#E8A5B9] hover:underline"
            >
              Undo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              maxLength={500}
              rows={3}
              value={promptAnswer}
              onChange={(e) => setPromptAnswer(e.target.value)}
              placeholder="Write your heartfelt answer here..."
              className="w-full p-3 rounded-[12px] bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#E8A5B9] text-xs resize-none text-[#2D1F24] dark:text-white"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1.5 text-xs text-[#8B7578] dark:text-[#A89598] cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareWithPartner}
                  onChange={(e) => setShareWithPartner(e.target.checked)}
                  className="rounded text-[#9B4D6F] focus:ring-0"
                />
                <span>Share with {partnerUser.name.split(' ')[0]}</span>
              </label>

              <button
                onClick={() => setIsSkipped(true)}
                className="text-xs font-medium text-[#8B7578] hover:text-[#2D1F24] dark:hover:text-white"
              >
                Skip for today
              </button>
            </div>

            <button
              onClick={() => promptAnswer.trim() && setIsSaved(true)}
              disabled={!promptAnswer.trim()}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow transition active:scale-95 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* REGION 4 - QUICK ACTIONS (Three 80px circular buttons)    */}
      {/* ======================================================== */}
      <div>
        <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase block mb-3 px-1">
          Quick Affection
        </span>

        <div className="flex justify-around items-center pt-1">
          {/* Button 1: Send Kiss 💋 (Pink gradient) */}
          <div className="flex flex-col items-center">
            <button
              onClick={triggerKiss}
              title="Send Kiss"
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF9EB5] to-[#E85D88] flex items-center justify-center text-3xl shadow-lg shadow-pink-300/40 dark:shadow-pink-900/30 transition-transform active:scale-90"
            >
              💋
            </button>
            <span className="text-[11px] font-semibold text-[#2D1F24] dark:text-[#F5E6EA] mt-2">
              Send Kiss 💋
            </span>
          </div>

          {/* Button 2: Send Hug 🤗 (Purple gradient) */}
          <div className="flex flex-col items-center">
            <button
              onClick={triggerHug}
              title="Send Hug"
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D8B4FE] to-[#9333EA] flex items-center justify-center text-3xl shadow-lg shadow-purple-300/40 dark:shadow-purple-900/30 transition-transform active:scale-90"
            >
              🤗
            </button>
            <span className="text-[11px] font-semibold text-[#2D1F24] dark:text-[#F5E6EA] mt-2">
              Send Hug 🤗
            </span>
          </div>

          {/* Button 3: Send Snap 📸 (Blue gradient) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActiveTab('chat')}
              title="Send Snap"
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#93C5FD] to-[#2563EB] flex items-center justify-center text-3xl shadow-lg shadow-blue-300/40 dark:shadow-blue-900/30 transition-transform active:scale-90"
            >
              📸
            </button>
            <span className="text-[11px] font-semibold text-[#2D1F24] dark:text-[#F5E6EA] mt-2">
              Send Snap 📸
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REGION 5 - UPCOMING                                      */}
      {/* ======================================================== */}
      <div>
        <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-3 px-1">
          Coming up
        </h3>

        {upcomingList.length === 0 ? (
          <div className="p-6 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-center text-xs text-[#8B7578]">
            Nothing scheduled yet
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedUpcoming(item)}
                className="cursor-pointer p-3.5 rounded-[16px] bg-white/90 dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex items-center justify-between transition hover:border-[#E8A5B9] active:scale-[0.99]"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-[12px] bg-[#E8A5B9]/20 flex items-center justify-center text-xl shrink-0">
                    {item.emoji}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#9B4D6F] dark:text-[#E8A5B9] font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#8B7578] dark:text-[#A89598] shrink-0">
                  {item.dateText}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-Time Kiss / Hug 3-Second Synchronized Hold Overlay */}
      {activeOverlay && (
        <KissHugSyncOverlay
          type={activeOverlay}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Upcoming Detail Modal */}
      {selectedUpcoming && (
        <div
          onClick={() => setSelectedUpcoming(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-6 rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-center shadow-2xl space-y-4 max-w-sm w-full animate-spring-press"
          >
            <div className="text-4xl">{selectedUpcoming.emoji}</div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#2D1F24] dark:text-white">
                {selectedUpcoming.title}
              </h3>
              <p className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] mt-1">
                {selectedUpcoming.subtitle} ({selectedUpcoming.dateText})
              </p>
              <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-3">
                {selectedUpcoming.detail}
              </p>
            </div>
            <button
              onClick={() => setSelectedUpcoming(null)}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
