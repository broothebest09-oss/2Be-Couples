import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import {
  Heart,
  Plus,
  Lock,
  Play,
  Calendar,
  ChevronDown,
  Trash2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  Camera,
  Smile,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GratitudeJarSection } from './GratitudeJarSection';
import { BucketListSection } from './BucketListSection';
import { CycleTrackerSection } from './CycleTrackerSection';

interface MemoryCardData {
  id: string;
  type: 'photo' | 'video' | 'milestone' | 'text' | 'locked';
  title?: string;
  caption?: string;
  emoji?: string;
  dateText: string;
  videoDuration?: string;
  senderName: string;
  senderAvatar: string;
  originalContext?: string;
  isLocked?: boolean;
  isPendingDeletion?: boolean;
}

export const UsHub: React.FC = () => {
  const { partnerUser, currentUser, pairingStatus, archivedData } = useCouple();

  const isDissolved = pairingStatus === 'dissolved';
  const isHer = currentUser.name.toLowerCase().includes('maya');

  // Top Section tabs: Memories | Gratitude | Bucket List | Cycle
  const [activeTab, setActiveTab] = useState<'memories' | 'gratitude' | 'bucket' | 'cycle'>('memories');

  // Filters
  const [dateRange, setDateRange] = useState('All time');
  const [sortOrder, setSortOrder] = useState('Newest first');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    kisses: 184,
    hugs: 142,
    memories: 36,
    streak: 15,
    daysTogether: 342
  });

  // Memories list with all 5 types
  const [memories, setMemories] = useState<MemoryCardData[]>([
    {
      id: '1',
      type: 'photo',
      caption: 'Picnic under the cherry blossoms 🌸',
      dateText: 'Nov 18',
      senderName: partnerUser.name.split(' ')[0],
      senderAvatar: partnerUser.avatar,
      originalContext: 'Sunday Date in the Park'
    },
    {
      id: '2',
      type: 'video',
      caption: 'Laughing at the cute puppy we saw 🐶',
      videoDuration: '0:18',
      dateText: 'Nov 15',
      senderName: currentUser.name.split(' ')[0],
      senderAvatar: currentUser.avatar,
      originalContext: 'Walk downtown'
    },
    {
      id: '3',
      type: 'milestone',
      title: '💋 100th Kiss!',
      caption: 'A sweet milestone of warmth and intimacy.',
      emoji: '💋',
      dateText: 'Nov 10',
      senderName: '2Be Milestone',
      senderAvatar: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80',
      originalContext: 'Automatic Couple Milestone'
    },
    {
      id: '4',
      type: 'text',
      caption: 'You make the ordinary moments feel like magic. Thank you for being you.',
      dateText: 'Nov 5',
      senderName: partnerUser.name.split(' ')[0],
      senderAvatar: partnerUser.avatar,
      originalContext: 'Night chat whisper'
    },
    {
      id: '5',
      type: 'locked',
      caption: 'Our secret midnight beach swim 🌊',
      isLocked: true,
      dateText: 'Oct 28',
      senderName: currentUser.name.split(' ')[0],
      senderAvatar: currentUser.avatar,
      originalContext: 'Private Time Capsule'
    },
    {
      id: '6',
      type: 'photo',
      caption: 'First coffee date of November ☕',
      dateText: 'Nov 1',
      senderName: partnerUser.name.split(' ')[0],
      senderAvatar: partnerUser.avatar,
      originalContext: 'Autumn walk'
    }
  ]);

  // Full screen viewer state
  const [selectedViewerIndex, setSelectedViewerIndex] = useState<number | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [showPinDialog, setShowPinDialog] = useState(false);

  // Deletion modal state
  const [deletionMemory, setDeletionMemory] = useState<MemoryCardData | null>(null);

  // Add memory modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newType, setNewType] = useState<'photo' | 'milestone' | 'text'>('photo');

  const handleCreateMemory = () => {
    const newMem: MemoryCardData = {
      id: Date.now().toString(),
      type: newType,
      caption: newCaption || 'New shared memory',
      title: newType === 'milestone' ? 'New Milestone' : undefined,
      emoji: newType === 'milestone' ? '🎉' : undefined,
      dateText: 'Just now',
      senderName: currentUser.name.split(' ')[0],
      senderAvatar: currentUser.avatar,
      originalContext: 'Manual Upload'
    };
    setMemories([newMem, ...memories]);
    setStats((prev) => ({ ...prev, memories: prev.memories + 1 }));
    setShowAddModal(false);
    setNewCaption('');
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleRequestDeletion = () => {
    if (!deletionMemory) return;
    setMemories(
      memories.map((m) =>
        m.id === deletionMemory.id ? { ...m, isPendingDeletion: true } : m
      )
    );
    setDeletionMemory(null);
  };

  const handlePartnerConfirmDeletion = () => {
    if (!deletionMemory) return;
    setMemories(memories.filter((m) => m.id !== deletionMemory.id));
    setStats((prev) => ({ ...prev, memories: Math.max(0, prev.memories - 1) }));
    setDeletionMemory(null);
    setSelectedViewerIndex(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] pb-28 pt-2 select-none">
      {/* ======================================================== */}
      {/* 4 TOP SECTION TABS: Memories | Gratitude | Bucket List | Cycle */}
      {/* ======================================================== */}
      <div className="sticky top-0 z-30 bg-[#FFF9F5]/90 dark:bg-[#1A1416]/90 backdrop-blur-md pb-2 pt-1">
        <div className="flex rounded-full bg-[#FFF4E6] dark:bg-[#261E21] p-1 border border-[#F0DFE3] dark:border-[#3D2F34]">
          {[
            { id: 'memories' as const, label: 'Memories' },
            { id: 'gratitude' as const, label: 'Gratitude' },
            { id: 'bucket' as const, label: 'Bucket List' },
            { id: 'cycle' as const, label: 'Cycle' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white font-bold shadow-sm'
                    : 'text-[#4A3B40] dark:text-[#A89598] hover:text-[#140C0F] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter and Sort row (Only in Memories section) */}
        {activeTab === 'memories' && (
          <div className="flex items-center justify-between mt-3 px-1">
            {/* Date filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-[11px] font-semibold text-[#2D1F24] dark:text-[#F5E6EA] shadow-soft"
              >
                <span>📅 {dateRange}</span>
                <ChevronDown className="w-3 h-3 text-[#8B7578]" />
              </button>
              {showFilterDropdown && (
                <div className="absolute left-0 mt-1 w-32 rounded-xl bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-xl py-1 z-40 text-xs">
                  {['This week', 'This month', 'This year', 'All time'].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDateRange(d);
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA]"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-[11px] font-semibold text-[#2D1F24] dark:text-[#F5E6EA] shadow-soft"
              >
                <span>⇅ {sortOrder}</span>
                <ChevronDown className="w-3 h-3 text-[#8B7578]" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-1 w-32 rounded-xl bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-xl py-1 z-40 text-xs">
                  {['Newest first', 'Oldest first'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSortOrder(s);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CONTENT FOR MEMORIES SECTION (DEFAULT)                   */}
      {/* ======================================================== */}
      {activeTab === 'memories' ? (
        memories.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-8 text-center my-12">
            <span className="text-5xl mb-3">📖</span>
            <h3 className="text-lg font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA]">
              Start creating memories together!
            </h3>
            <p className="text-xs text-[#8B7578] dark:text-[#A89598] max-w-xs mt-1 mb-6">
              Save photos, milestones, and heartfelt whispers into your couple album.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
            >
              Add your first memory
            </button>
          </div>
        ) : (
          /* 2-Column Square Grid (Aspect ratio 1:1) */
          <div className="grid grid-cols-2 gap-3 mt-3">
            {memories.map((memory, index) => {
              const isLockedCover = memory.type === 'locked' && !unlockedIds.includes(memory.id);

              return (
                <div
                  key={memory.id}
                  onClick={() => setSelectedViewerIndex(index)}
                  className="cursor-pointer relative aspect-square rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft overflow-hidden transition hover:border-[#E8A5B9] active:scale-[0.98]"
                >
                  {/* Card Type 1: Photo */}
                  {memory.type === 'photo' && (
                    <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-tr from-[#E8A5B9]/20 to-[#FFF4E6] dark:to-[#1A1416]">
                      <div className="text-2xl">📸</div>
                      <div className="bg-black/40 backdrop-blur-sm -mx-3 -mb-3 p-2 text-white">
                        <p className="text-[11px] font-medium truncate">{memory.caption}</p>
                      </div>
                    </div>
                  )}

                  {/* Card Type 2: Video */}
                  {memory.type === 'video' && (
                    <div className="w-full h-full flex items-center justify-center bg-[#261E21] relative text-white">
                      <span className="text-3xl">🎥</span>
                      <div className="w-9 h-9 rounded-full bg-white/80 absolute flex items-center justify-center text-[#9B4D6F]">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold">
                        {memory.videoDuration}
                      </span>
                    </div>
                  )}

                  {/* Card Type 3: Milestone */}
                  {memory.type === 'milestone' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#E8A5B9]/20 to-white dark:to-[#261E21]">
                      <span className="text-3xl mb-1">{memory.emoji}</span>
                      <h4 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] line-clamp-2">
                        {memory.title}
                      </h4>
                      <span className="text-[10px] text-[#8B7578] dark:text-[#A89598] mt-1">
                        {memory.dateText}
                      </span>
                    </div>
                  )}

                  {/* Card Type 4: Text memory snippet */}
                  {memory.type === 'text' && (
                    <div className="w-full h-full flex flex-col justify-between p-3">
                      <div className="flex items-center justify-between">
                        <img
                          src={memory.senderAvatar}
                          alt="Sender"
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-[#E8A5B9]"
                        />
                        <span className="text-[10px] text-[#8B7578]">{memory.dateText}</span>
                      </div>
                      <p className="text-xs font-medium text-[#2D1F24] dark:text-[#F5E6EA] line-clamp-2 italic">
                        “{memory.caption}”
                      </p>
                      <span className="text-[9px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
                        💬 Whisper Note
                      </span>
                    </div>
                  )}

                  {/* Card Type 5: Locked memory */}
                  {memory.type === 'locked' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#261E21] text-white relative">
                      <div className="absolute inset-0 bg-cover blur-sm opacity-30 bg-[#E8A5B9]" />
                      <Lock className="w-6 h-6 text-white mb-1 z-10" />
                      <span className="text-xs font-bold z-10">Locked 🔒</span>
                      <span className="text-[9px] text-white/70 mt-1 z-10">Tap to unlock</span>
                    </div>
                  )}

                  {/* Pending Deletion Badge */}
                  {memory.isPendingDeletion && (
                    <div className="absolute top-0 inset-x-0 bg-red-500 text-white text-[9px] font-bold py-0.5 text-center">
                      Pending Deletion
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === 'gratitude' ? (
        <GratitudeJarSection
          onMilestoneReached={(title, subtitle) => {
            const newMilestone: MemoryCardData = {
              id: Date.now().toString(),
              type: 'milestone',
              title,
              caption: subtitle,
              emoji: '🎉',
              dateText: 'Just now',
              senderName: 'Gratitude Jar',
              senderAvatar: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80',
              originalContext: 'Gratitude Milestone'
            };
            setMemories([newMilestone, ...memories]);
          }}
        />
      ) : activeTab === 'bucket' ? (
        <BucketListSection
          onMemoryCreated={(title, caption, emoji) => {
            const newMilestone: MemoryCardData = {
              id: Date.now().toString(),
              type: 'milestone',
              title,
              caption,
              emoji,
              dateText: 'Just now',
              senderName: currentUser.name.split(' ')[0],
              senderAvatar: currentUser.avatar,
              originalContext: 'Bucket List Milestone'
            };
            setMemories([newMilestone, ...memories]);
          }}
        />
      ) : (
        /* Cycle Tracker Section */
        isDissolved && !isHer ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-[#1E141B] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-3">
            <span className="text-3xl block">🌸</span>
            <h4 className="text-base font-bold text-[#2D1F24] dark:text-white">
              Cycle Data Retained Privately
            </h4>
            <p className="text-xs text-[#6D585E] dark:text-[#E6D7DE] leading-relaxed max-w-xs mx-auto">
              Following connection dissolution, cycle tracking data is retained exclusively by Her. Your access to cycle logs, predictions, and notifications has been removed.
            </p>
          </div>
        ) : (
          <CycleTrackerSection />
        )
      )}

      {/* ======================================================== */}
      {/* STATS SECTION (Bottom of screen, Sticky)                 */}
      {/* ======================================================== */}
      <div className="fixed bottom-16 inset-x-0 z-30 max-w-md mx-auto px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-[20px] bg-white/95 dark:bg-[#261E21]/95 border border-[#F0DFE3] dark:border-[#3D2F34] shadow-lg py-2.5 px-3 flex items-center space-x-3 overflow-x-auto no-scrollbar">
          {[
            { emoji: '💋', value: isDissolved ? (archivedData?.archivedStats.lifetimeKissesSent || 247) : stats.kisses, label: isDissolved ? 'my kisses' : 'kisses' },
            { emoji: '🤗', value: isDissolved ? (archivedData?.archivedStats.lifetimeHugsSent || 189) : stats.hugs, label: isDissolved ? 'my hugs' : 'hugs' },
            { emoji: '📸', value: stats.memories, label: 'memories' },
            { emoji: '🔥', value: isDissolved ? '0d' : `${stats.streak}d`, label: isDissolved ? 'streak (reset)' : 'streak' },
            { emoji: '⏳', value: isDissolved ? (archivedData?.archivedStats.daysTogether || 41) : stats.daysTogether, label: 'days' }
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#FFF4E6] dark:bg-[#33282C] shrink-0"
            >
              <span className="text-sm">{stat.emoji}</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9] leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] text-[#8B7578] dark:text-[#A89598] leading-none mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (FAB) in bottom-right */}
      {activeTab === 'memories' && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-28 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] text-white flex items-center justify-center shadow-rose-glow transition active:scale-90"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* ======================================================== */}
      {/* FULL-SCREEN VIEWER MODAL                                 */}
      {/* ======================================================== */}
      {selectedViewerIndex !== null && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">
              {selectedViewerIndex + 1} / {memories.length}
            </span>
            <button
              onClick={() => setSelectedViewerIndex(null)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewer Media Canvas */}
          {(() => {
            const memory = memories[selectedViewerIndex];
            const isLocked = memory.type === 'locked' && !unlockedIds.includes(memory.id);

            if (isLocked) {
              return (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl">
                    🔒
                  </div>
                  <h3 className="text-lg font-bold">Private Couple Memory</h3>
                  <p className="text-xs text-white/70 max-w-xs">
                    This memory requires 4-digit PIN verification to view.
                  </p>
                  <button
                    onClick={() => {
                      setUnlockedIds([...unlockedIds, memory.id]);
                    }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white text-xs font-bold shadow-md"
                  >
                    Unlock with PIN (1234)
                  </button>
                </div>
              );
            }

            return (
              <div className="flex flex-col items-center justify-center my-auto p-4">
                <div className="w-full max-w-xs aspect-square rounded-[24px] bg-white/10 flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden">
                  {memory.type === 'photo' && '📸'}
                  {memory.type === 'video' && '🎥'}
                  {memory.type === 'milestone' && (memory.emoji || '💖')}
                  {memory.type === 'text' && '💬'}
                  {memory.type === 'locked' && '🔓'}

                  {memory.isPendingDeletion && (
                    <div className="absolute top-0 inset-x-0 bg-red-600 text-white text-xs py-1 text-center font-bold">
                      ⚠️ Pending partner deletion approval
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold">{memory.caption}</p>
                  <p className="text-xs text-white/60 mt-1">
                    Saved by {memory.senderName} • {memory.dateText}
                  </p>
                  {memory.originalContext && (
                    <p className="text-[11px] text-white/40 mt-0.5">From: {memory.originalContext}</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Bottom Actions: Swipe buttons + Save & Delete */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                disabled={selectedViewerIndex === 0}
                onClick={() => setSelectedViewerIndex((i) => (i! > 0 ? i! - 1 : i))}
                className="p-2 rounded-full bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => alert('Saved to device gallery! 📸')}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-white/20 text-xs font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => setDeletionMemory(memories[selectedViewerIndex])}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-red-500/30 text-red-300 text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
              <button
                disabled={selectedViewerIndex === memories.length - 1}
                onClick={() =>
                  setSelectedViewerIndex((i) => (i! < memories.length - 1 ? i! + 1 : i))
                }
                className="p-2 rounded-full bg-white/10 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MUTUAL DELETION DIALOG                                   */}
      {/* ======================================================== */}
      {deletionMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 mx-auto flex items-center justify-center text-2xl">
              🛡️
            </div>

            <h3 className="text-base font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA]">
              {deletionMemory.isPendingDeletion ? 'Confirm Memory Deletion' : 'Delete this memory?'}
            </h3>

            <p className="text-xs text-[#8B7578] dark:text-[#A89598] leading-relaxed">
              {deletionMemory.isPendingDeletion
                ? `${partnerUser.name.split(' ')[0]} requested deletion. Once you confirm, this memory will be permanently removed for both of you.`
                : `Because 2Be is your shared sanctuary, memories can only be removed when both partners agree. ${partnerUser.name.split(' ')[0]} will be notified and must confirm.`}
            </p>

            <div className="space-y-2 pt-2">
              {!deletionMemory.isPendingDeletion ? (
                <>
                  <button
                    onClick={handleRequestDeletion}
                    className="w-full py-2.5 rounded-[24px] bg-red-500 text-white text-xs font-semibold shadow-sm"
                  >
                    Request Deletion from {partnerUser.name.split(' ')[0]}
                  </button>
                  <button
                    onClick={() => setDeletionMemory(null)}
                    className="w-full py-2 text-xs font-medium text-[#8B7578]"
                  >
                    Keep Memory
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePartnerConfirmDeletion}
                    className="w-full py-2.5 rounded-[24px] bg-red-600 text-white text-xs font-semibold shadow-sm"
                  >
                    Confirm & Permanently Delete
                  </button>
                  <button
                    onClick={() => {
                      setMemories(
                        memories.map((m) =>
                          m.id === deletionMemory.id ? { ...m, isPendingDeletion: false } : m
                        )
                      );
                      setDeletionMemory(null);
                    }}
                    className="w-full py-2 text-xs font-medium text-[#8B7578]"
                  >
                    Cancel Deletion Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD MEMORY DIALOG                                        */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">Add New Memory</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8B7578]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2">
              {[
                { id: 'photo' as const, label: 'Gallery', icon: '📸' },
                { id: 'milestone' as const, label: 'Milestone', icon: '🎉' },
                { id: 'text' as const, label: 'Note', icon: '📝' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setNewType(m.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex flex-col items-center ${
                    newType === m.id
                      ? 'bg-[#E8A5B9]/20 border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9]'
                      : 'border-transparent bg-slate-100 dark:bg-[#1A1416] text-[#8B7578]'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="w-full h-28 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] flex items-center justify-center text-4xl">
              {newType === 'photo' ? '🖼️' : newType === 'milestone' ? '🥂' : '💬'}
            </div>

            <input
              type="text"
              placeholder="Add caption or memory title..."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs focus:outline-none focus:border-[#E8A5B9]"
            />

            <button
              onClick={handleCreateMemory}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
            >
              Save Memory to Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
