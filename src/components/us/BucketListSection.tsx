import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Check, Plus, X, Sparkles, Trash2, Calendar, MapPin, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { analytics } from '../../services/analytics';

interface BucketDreamItem {
  id: string;
  text: string;
  authorName: string;
  authorAvatar: string;
  isCompleted: boolean;
  dateAdded: string;
  dateCompleted?: string;
  category: 'Travel' | 'Food' | 'Adventure' | 'Romance' | 'Other';
  emoji: string;
  targetDate?: string;
}

export const BucketListSection: React.FC<{
  onMemoryCreated?: (title: string, caption: string, emoji: string) => void;
}> = ({ onMemoryCreated }) => {
  const { partnerUser, currentUser } = useCouple();

  const [items, setItems] = useState<BucketDreamItem[]>([
    {
      id: '1',
      text: 'Watch the Northern Lights from a cozy glass igloo',
      authorName: partnerUser.name.split(' ')[0],
      authorAvatar: partnerUser.avatar,
      isCompleted: false,
      dateAdded: 'Nov 12',
      category: 'Travel',
      emoji: '✈️',
      targetDate: 'Winter 2027'
    },
    {
      id: '2',
      text: 'Cook a 5-course homemade pasta dinner together from scratch',
      authorName: currentUser.name.split(' ')[0],
      authorAvatar: currentUser.avatar,
      isCompleted: false,
      dateAdded: 'Nov 8',
      category: 'Food',
      emoji: '🍝'
    },
    {
      id: '3',
      text: 'Take a sunrise hot air balloon flight over Cappadocia',
      authorName: partnerUser.name.split(' ')[0],
      authorAvatar: partnerUser.avatar,
      isCompleted: false,
      dateAdded: 'Oct 29',
      category: 'Adventure',
      emoji: '🧗'
    },
    {
      id: '4',
      text: 'Dance together in the pouring rain with no umbrellas',
      authorName: currentUser.name.split(' ')[0],
      authorAvatar: currentUser.avatar,
      isCompleted: true,
      dateAdded: 'Sep 15',
      dateCompleted: 'Nov 4',
      category: 'Romance',
      emoji: '🌹'
    },
    {
      id: '5',
      text: 'Adopt our first rescue puppy together 🐶',
      authorName: partnerUser.name.split(' ')[0],
      authorAvatar: partnerUser.avatar,
      isCompleted: true,
      dateAdded: 'Aug 20',
      dateCompleted: 'Oct 12',
      category: 'Other',
      emoji: '✨'
    }
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'Travel' | 'Food' | 'Adventure' | 'Romance' | 'Other'>('Travel');
  const [newTargetDate, setNewTargetDate] = useState('');

  const [completingItem, setCompletingItem] = useState<BucketDreamItem | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<BucketDreamItem | null>(null);
  const [partnerNotification, setPartnerNotification] = useState<string | null>(null);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddDream = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    const emojiMap = {
      Travel: '✈️',
      Food: '🍝',
      Adventure: '🧗',
      Romance: '🌹',
      Other: '✨'
    };

    const newDream: BucketDreamItem = {
      id: Date.now().toString(),
      text: trimmed,
      authorName: currentUser.name.split(' ')[0],
      authorAvatar: currentUser.avatar,
      isCompleted: false,
      dateAdded: 'Just now',
      category: newCategory,
      emoji: emojiMap[newCategory],
      targetDate: newTargetDate.trim() || undefined
    };

    setItems([newDream, ...items]);
    setShowAddModal(false);
    setNewText('');
    setNewTargetDate('');

    analytics.trackBucketItemAdded(Boolean(newCategory), Boolean(newTargetDate.trim()));

    // Notification
    setPartnerNotification(`${currentUser.name.split(' ')[0]} added '${trimmed}' to the bucket list ✨`);
    setTimeout(() => setPartnerNotification(null), 3500);

    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleComplete = (withMemory: boolean) => {
    if (!completingItem) return;
    const updated = items.map((i) =>
      i.id === completingItem.id
        ? { ...i, isCompleted: true, dateCompleted: 'Today' }
        : i
    );
    setItems(updated);
    analytics.trackBucketItemCompleted(14, Boolean(withMemory));

    if (withMemory) {
      onMemoryCreated?.(
        `🎉 Completed: ${completingItem.text}`,
        'A shared couple dream fulfilled together!',
        completingItem.emoji
      );
    }

    setPartnerNotification(`${currentUser.name.split(' ')[0]} completed '${completingItem.text}'! 🎉`);
    setTimeout(() => setPartnerNotification(null), 3500);

    setCompletingItem(null);

    // Check if all completed
    if (updated.every((i) => i.isCompleted)) {
      setShowAllCompleted(true);
      try {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const incompleteItems = items.filter((i) => !i.isCompleted);
  const completedItems = items.filter((i) => i.isCompleted);

  return (
    <div className="space-y-4 pt-2">
      {/* Partner Notification Banner */}
      {partnerNotification && (
        <div className="p-2.5 rounded-xl bg-[#9B4D6F] text-white text-xs font-semibold text-center animate-fadeIn shadow-soft">
          {partnerNotification}
        </div>
      )}

      {/* ======================================================== */}
      {/* HEADER: "When We're Together" & Progress Bar             */}
      {/* ======================================================== */}
      <div className="p-4 rounded-[16px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
              When We're Together
            </h3>
            <p className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] mt-0.5">
              {completedCount} of {totalCount} completed
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow transition active:scale-95"
          >
            + Add Dream
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] transition-all duration-500"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* LIST: Incomplete "Dreams" and "Completed"               */}
      {/* ======================================================== */}
      {items.length === 0 ? (
        <div className="p-8 text-center my-8 bg-white dark:bg-[#261E21] rounded-[16px] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft">
          <span className="text-4xl block mb-2">🗺️</span>
          <h4 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
            Start dreaming together!
          </h4>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1 mb-4">
            Adventures to take, restaurants to try, and milestones to reach hand in hand.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
          >
            Add your first dream
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section 1: Dreams (Incomplete) */}
          {incompleteItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#9B4D6F] dark:text-[#E8A5B9] tracking-wider uppercase px-1">
                Dreams ({incompleteItems.length})
              </span>

              {incompleteItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetail(item)}
                  className="cursor-pointer p-3.5 rounded-[14px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex items-center justify-between transition hover:border-[#E8A5B9] active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletingItem(item);
                      }}
                      className="w-6 h-6 rounded-full border-2 border-[#F0DFE3] dark:border-[#3D2F34] hover:border-[#7FB77E] flex items-center justify-center shrink-0 transition"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#2D1F24] dark:text-[#F5E6EA] line-clamp-1">
                        {item.text}
                      </p>
                      <span className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                        Added by {item.authorName} on {item.dateAdded}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm shrink-0 ml-2">{item.emoji}</span>
                </div>
              ))}
            </div>
          )}

          {/* Section 2: Completed */}
          {completedItems.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#7FB77E] tracking-wider uppercase px-1">
                Completed ({completedItems.length})
              </span>

              {completedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedDetail(item)}
                  className="cursor-pointer p-3.5 rounded-[14px] bg-white/60 dark:bg-[#261E21]/60 border border-[#F0DFE3] dark:border-[#3D2F34] shadow-soft flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Checked Box */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setItems(
                          items.map((i) =>
                            i.id === item.id ? { ...i, isCompleted: false, dateCompleted: undefined } : i
                          )
                        );
                      }}
                      className="w-6 h-6 rounded-full bg-[#7FB77E] text-white flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#8B7578] line-through truncate">
                        {item.text}
                      </p>
                      <span className="text-[10px] text-[#7FB77E] font-medium">
                        Completed on {item.dateCompleted}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm shrink-0 ml-2">{item.emoji}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* COMPLETE ITEM DIALOG WITH MEMORY PROMPT                 */}
      {/* ======================================================== */}
      {completingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 text-center space-y-4 shadow-2xl animate-spring-press">
            <div className="w-14 h-14 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] mx-auto flex items-center justify-center text-3xl">
              ✅
            </div>

            <h3 className="text-base font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA]">
              Mark dream as completed?
            </h3>

            <p className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9]">
              “{completingItem.text}”
            </p>

            <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
              Would you like to preserve this moment in your shared Memories Timeline?
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleComplete(true)}
                className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
              >
                Yes, Create Memory & Complete 🎉
              </button>
              <button
                onClick={() => handleComplete(false)}
                className="w-full py-2.5 rounded-[24px] bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA] text-xs font-semibold"
              >
                Complete Without Memory
              </button>
              <button
                onClick={() => setCompletingItem(null)}
                className="w-full py-1 text-xs text-[#8B7578]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / DETAIL DIALOG                                     */}
      {/* ======================================================== */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 space-y-4 shadow-2xl relative animate-spring-press text-left">
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 text-[#8B7578]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
                {selectedDetail.emoji} {selectedDetail.category}
              </span>
              {selectedDetail.isCompleted && (
                <span className="px-2 py-0.5 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] text-[10px] font-bold">
                  Completed ✓
                </span>
              )}
            </div>

            {selectedDetail.authorName === currentUser.name.split(' ')[0] ? (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#9B4D6F] uppercase tracking-wider block">
                  Edit Dream Text
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={selectedDetail.text}
                  onChange={(e) =>
                    setSelectedDetail({ ...selectedDetail, text: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs focus:outline-none focus:border-[#E8A5B9] text-[#2D1F24] dark:text-white"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">
                  “{selectedDetail.text}”
                </p>
                <div className="mt-2 text-[10px] text-[#8B7578] flex items-center space-x-1">
                  <span>🔒 Only {selectedDetail.authorName} can edit this dream</span>
                </div>
              </div>
            )}

            <div className="text-[11px] text-[#8B7578] space-y-1 pt-1">
              <p>Added by {selectedDetail.authorName} on {selectedDetail.dateAdded}</p>
              {selectedDetail.targetDate && (
                <p className="text-[#9B4D6F] dark:text-[#E8A5B9] font-medium">
                  🎯 Target: {selectedDetail.targetDate}
                </p>
              )}
              {selectedDetail.dateCompleted && (
                <p className="text-[#7FB77E] font-medium">
                  🎉 Completed on {selectedDetail.dateCompleted}
                </p>
              )}
            </div>

            <div className="pt-2 flex space-x-2">
              {selectedDetail.authorName === currentUser.name.split(' ')[0] ? (
                <>
                  <button
                    onClick={() => {
                      setItems(
                        items.map((i) => (i.id === selectedDetail.id ? selectedDetail : i))
                      );
                      setSelectedDetail(null);
                    }}
                    className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this dream from your bucket list?')) {
                        setItems(items.filter((i) => i.id !== selectedDetail.id));
                        setSelectedDetail(null);
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-xs font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="w-full py-2 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-xs font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD DREAM BOTTOM MODAL                                   */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                Add a Couple Dream
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8B7578]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-[#8B7578] mb-1">
                <span>Dream description</span>
                <span>{newText.length}/200</span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="e.g. Stargaze from a glass cabin in Norway..."
                className="w-full p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs resize-none focus:outline-none focus:border-[#E8A5B9] text-[#2D1F24] dark:text-white"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#9B4D6F] uppercase tracking-wider block mb-1.5">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['Travel', 'Food', 'Adventure', 'Romance', 'Other'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      newCategory === cat
                        ? 'bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white border-transparent shadow-sm'
                        : 'bg-[#FFF9F5] dark:bg-[#1A1416] border-[#DFCFD4] dark:border-[#3D2F34] text-[#4A3B40] dark:text-[#A89598]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#9B4D6F] uppercase tracking-wider block mb-1">
                Target Timeline (Optional)
              </span>
              <input
                type="text"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                placeholder="e.g. Summer 2027, Next Anniversary"
                className="w-full p-2.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs focus:outline-none focus:border-[#E8A5B9]"
              />
            </div>

            <button
              onClick={handleAddDream}
              disabled={!newText.trim()}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow transition active:scale-95 disabled:opacity-50"
            >
              Add to List ✨
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ALL DREAMS COMPLETED CELEBRATION                         */}
      {/* ======================================================== */}
      {showAllCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#E8A5B9] p-6 text-center space-y-4 shadow-2xl animate-spring-press">
            <span className="text-5xl block animate-bounce">👑</span>
            <h3 className="text-lg font-bold font-display text-[#2D1F24] dark:text-[#F5E6EA]">
              All dreams completed! 🎉
            </h3>
            <p className="text-xs text-[#8B7578] dark:text-[#A89598] leading-relaxed">
              You two conquered every single dream together. Ready to write your next adventure chapter?
            </p>
            <button
              onClick={() => setShowAllCompleted(false)}
              className="w-full py-2.5 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
            >
              Keep Dreaming Together
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
