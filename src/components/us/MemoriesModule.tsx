import React, { useState } from 'react';
import {
  CalendarHeart,
  Plus,
  Lock,
  Unlock,
  Sparkles,
  Heart,
  ChevronLeft,
  Clock,
  Send,
  KeyRound,
  Settings,
  Trash2
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { MemoryMilestone, TimeCapsule } from '../../types';
import {
  LockMemoryModal,
  UnlockMemoryModal,
  ChangeOrRemoveLockModal
} from './MutualMemoryLockModal';

export const MemoriesModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    memories,
    addMemory,
    lockMemory,
    unlockMemory,
    changeMemoryPin,
    removeMemoryLock,
    deleteMemory,
    timeCapsules,
    sealTimeCapsule,
    unlockTimeCapsule,
    currentUser,
    partnerUser,
    showToast
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'timeline' | 'capsule' | 'recap'>('timeline');

  // Memory Lock states
  const [activeLockingMemory, setActiveLockingMemory] = useState<MemoryMilestone | null>(null);
  const [activeUnlockingMemory, setActiveUnlockingMemory] = useState<MemoryMilestone | null>(null);
  const [activeSettingsMemory, setActiveSettingsMemory] = useState<MemoryMilestone | null>(null);

  // New milestone form state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState(new Date().toISOString().split('T')[0]);
  const [milestoneCategory, setMilestoneCategory] = useState<MemoryMilestone['category']>('milestones');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneImg, setMilestoneImg] = useState('');

  // New time capsule form state
  const [showAddCapsule, setShowAddCapsule] = useState(false);
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [capsuleUnlockDate, setCapsuleUnlockDate] = useState('2027-06-18');
  const [capsuleLetter, setCapsuleLetter] = useState('');

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    addMemory({
      title: milestoneTitle.trim(),
      date: milestoneDate,
      category: milestoneCategory,
      description: milestoneDesc.trim() || 'A milestone we will forever hold close.',
      imageUrl: milestoneImg || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
    });

    setMilestoneTitle('');
    setMilestoneDesc('');
    setMilestoneImg('');
    setShowAddMilestone(false);
  };

  const handleCreateCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleTitle.trim() || !capsuleLetter.trim()) return;

    sealTimeCapsule({
      title: capsuleTitle.trim(),
      letter: capsuleLetter.trim(),
      creatorId: currentUser.id,
      unlockDate: capsuleUnlockDate,
      photos: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
      ]
    });

    setCapsuleTitle('');
    setCapsuleLetter('');
    setShowAddCapsule(false);
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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Our Memories</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'timeline'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('capsule')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'capsule'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Time Capsules ({timeCapsules.length})
        </button>
        <button
          onClick={() => setActiveTab('recap')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'recap'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Memory Book
        </button>
      </div>

      {/* TAB 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Relationship Milestones
            </span>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>

          {/* Chronological list */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-softpink-500 before:via-lavender-500 before:to-rosegold-500">
            {memories.map((mem) => (
              <div key={mem.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#FAF8F5] dark:bg-midnight-950 border-2 border-rose-500 dark:border-softpink-400 ring-4 ring-[#FAF8F5] dark:ring-midnight-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 dark:bg-softpink-300" />
                </div>

                {/* Card */}
                <div className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-2 overflow-hidden relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-rose-600 dark:text-lavender-300 font-semibold uppercase tracking-wider text-[10px]">
                      {mem.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {mem.isLocked && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold text-[10px] flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(mem.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{mem.title}</h3>

                  {mem.isLocked ? (
                    /* Locked View */
                    <div
                      onClick={() => setActiveUnlockingMemory(mem)}
                      className="relative rounded-xl overflow-hidden h-36 w-full bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Locked - requires PIN
                      </span>
                      <span className="text-[10px] text-rose-500 font-medium mt-0.5">
                        Tap to unlock with mutual code
                      </span>
                    </div>
                  ) : (
                    /* Unlocked View */
                    <>
                      {mem.imageUrl && (
                        <div className="rounded-xl overflow-hidden h-36 w-full">
                          <img
                            src={mem.imageUrl}
                            alt={mem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        </div>
                      )}
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{mem.description}</p>
                    </>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-lavender-500/10 text-xs">
                    {mem.isLocked ? (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={() => setActiveUnlockingMemory(mem)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold text-[11px] hover:bg-rose-600 transition flex items-center gap-1.5"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Unlock
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSettingsMemory(mem)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                          title="Lock Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={() => setActiveLockingMemory(mem)}
                          className="text-slate-600 dark:text-slate-400 hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1.5 transition"
                        >
                          <Lock className="w-3.5 h-3.5" /> Lock Memory
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMemory(mem.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TIME CAPSULES */}
      {activeTab === 'capsule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Future Secret Capsules
            </span>
            <button
              onClick={() => setShowAddCapsule(true)}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Seal New Capsule
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400 flex items-start gap-2">
            <Lock className="w-4 h-4 text-rose-500 dark:text-rosegold-400 shrink-0 mt-0.5" />
            <span>
              Time capsules are encrypted letters and photos sealed until a chosen future anniversary. Neither partner can open it until the unlock date!
            </span>
          </div>

          <div className="space-y-3">
            {timeCapsules.map(cap => {
              const isUnlockable = new Date(cap.unlockDate) <= new Date();

              return (
                <div
                  key={cap.id}
                  className="rounded-2xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rosegold-300 flex items-center gap-1.5">
                      {cap.isUnlocked ? (
                        <Unlock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-rose-500 dark:text-rosegold-400" />
                      )}
                      {cap.isUnlocked ? 'Unlocked Memory' : 'Sealed Until'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(cap.unlockDate).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{cap.title}</h3>

                  {cap.isUnlocked ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic whitespace-pre-wrap">
                      "{cap.letter}"
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/50 border border-dashed border-slate-300 dark:border-lavender-500/30 text-center space-y-2">
                      <Lock className="w-6 h-6 text-purple-600 dark:text-lavender-400 mx-auto opacity-70" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Sealed with secret love by {cap.creatorId === currentUser.id ? 'You' : partnerUser.name}.
                      </p>
                      <button
                        onClick={() => unlockTimeCapsule(cap.id)}
                        className="text-[11px] px-3 py-1 rounded-full bg-purple-50 dark:bg-lavender-500/20 text-purple-700 dark:text-lavender-300 border border-purple-200 dark:border-lavender-400/30 hover:bg-purple-100 dark:hover:bg-lavender-500/30 transition"
                      >
                        Preview Early (Founder / Test Unlock)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI MEMORY BOOK */}
      {activeTab === 'recap' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-white via-rose-50/40 to-purple-50/40 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900 border border-slate-200 dark:border-lavender-400/20 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rosegold-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Scrapbook & Annual Recap</span>
            </div>
            <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
              Year Three: "Sunlit Lofts and Autumn Rains"
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Curated recap combining your {memories.length} milestones, 42 shared photos in Paris, and 365 daily connection answers into a bound memory keepsake.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-midnight-950/70 border border-slate-200 dark:border-lavender-500/20 text-center shadow-xs">
                <span className="text-lg font-bold text-rose-600 dark:softpink-400 block">48</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Days Streak</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-midnight-950/70 border border-slate-200 dark:border-lavender-500/20 text-center shadow-xs">
                <span className="text-lg font-bold text-purple-700 dark:text-lavender-300 block">168</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Shared Moments</span>
              </div>
            </div>

            <button
              onClick={() => alert('Generating digital keepsake scrapbook... (Completed in background)')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
            >
              Export Illustrated Digital Memory Book
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add Milestone */}
      {showAddMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleCreateMilestone}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Add Relationship Milestone</h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                value={milestoneTitle}
                onChange={e => setMilestoneTitle(e.target.value)}
                placeholder="e.g. First Roadtrip, Adopted Milo"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={e => setMilestoneDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Category</label>
                <select
                  value={milestoneCategory}
                  onChange={e => setMilestoneCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="firsts">Firsts</option>
                  <option value="trips">Trips</option>
                  <option value="milestones">Milestones</option>
                  <option value="home">Home</option>
                  <option value="anniversaries">Anniversaries</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Description</label>
              <textarea
                value={milestoneDesc}
                onChange={e => setMilestoneDesc(e.target.value)}
                placeholder="What made this moment unforgettable?"
                rows={3}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMilestone(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Seal Capsule */}
      {showAddCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleCreateCapsule}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Seal Time Capsule</h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Capsule Title</label>
              <input
                type="text"
                value={capsuleTitle}
                onChange={e => setCapsuleTitle(e.target.value)}
                placeholder="e.g. Open on Our 5th Anniversary"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Unlock Date</label>
              <input
                type="date"
                value={capsuleUnlockDate}
                onChange={e => setCapsuleUnlockDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Secret Letter to Partner</label>
              <textarea
                value={capsuleLetter}
                onChange={e => setCapsuleLetter(e.target.value)}
                placeholder="Write your heartfelt promises to your future selves..."
                rows={4}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCapsule(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Seal 🔐
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lock Memory Modal */}
      <LockMemoryModal
        isOpen={!!activeLockingMemory}
        memory={activeLockingMemory}
        partnerName={partnerUser.nickname || partnerUser.name}
        onClose={() => setActiveLockingMemory(null)}
        onLockConfirmed={(pin) => {
          if (activeLockingMemory) {
            lockMemory(activeLockingMemory.id, pin);
            setActiveLockingMemory(null);
          }
        }}
      />

      {/* Unlock Memory Modal */}
      <UnlockMemoryModal
        isOpen={!!activeUnlockingMemory}
        memory={activeUnlockingMemory}
        partnerName={partnerUser.nickname || partnerUser.name}
        onClose={() => setActiveUnlockingMemory(null)}
        onUnlockSuccess={() => {
          if (activeUnlockingMemory) {
            unlockMemory(activeUnlockingMemory.id, activeUnlockingMemory.unlockPin || '1234');
            showToast('Memory unlocked! ✨', 'love');
            setActiveUnlockingMemory(null);
          }
        }}
        onRequestSettings={() => {
          const mem = activeUnlockingMemory;
          setActiveUnlockingMemory(null);
          setActiveSettingsMemory(mem);
        }}
      />

      {/* Change / Remove Lock Modal */}
      <ChangeOrRemoveLockModal
        isOpen={!!activeSettingsMemory}
        memory={activeSettingsMemory}
        partnerName={partnerUser.nickname || partnerUser.name}
        onClose={() => setActiveSettingsMemory(null)}
        onPinChanged={(newPin) => {
          if (activeSettingsMemory) {
            changeMemoryPin(activeSettingsMemory.id, newPin);
            setActiveSettingsMemory(null);
          }
        }}
        onLockRemoved={() => {
          if (activeSettingsMemory) {
            removeMemoryLock(activeSettingsMemory.id);
            setActiveSettingsMemory(null);
          }
        }}
      />
    </div>
  );
};
