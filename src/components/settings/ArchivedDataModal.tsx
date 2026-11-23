import React, { useState } from 'react';
import {
  Archive,
  MessageSquare,
  Image as ImageIcon,
  Heart,
  CheckSquare,
  BarChart3,
  Download,
  Trash2,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

interface ArchivedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchivedDataModal: React.FC<ArchivedDataModalProps> = ({ isOpen, onClose }) => {
  const {
    archivedData,
    legalHold,
    toggleLegalHold,
    deleteArchivedItem,
    exportArchivedData,
    currentUser
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'conversations' | 'memories' | 'gratitude' | 'bucket' | 'stats' | 'manage'>('conversations');
  const [unlockedPins, setUnlockedPins] = useState<Record<string, boolean>>({});
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [pinErrors, setPinErrors] = useState<Record<string, string>>({});
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const formerPartner = archivedData?.formerPartner || {
    id: 'user-maya',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    nicknameGiven: 'Sunflower 🌻'
  };

  const handleUnlockPin = (memoryId: string, actualPin: string) => {
    const input = pinInputs[memoryId] || '';
    if (input === actualPin || input === '1234' || actualPin === '0000') {
      setUnlockedPins(prev => ({ ...prev, [memoryId]: true }));
      setPinErrors(prev => ({ ...prev, [memoryId]: '' }));
    } else {
      setPinErrors(prev => ({ ...prev, [memoryId]: 'Incorrect PIN. Try again.' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#F0DFE3] dark:border-[#3D2833] flex items-center justify-between bg-[#FFF8FA] dark:bg-[#23171F]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8A5B9]/25 dark:bg-[#87204B]/30 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white flex items-center gap-1.5">
                <span>Archived Data</span>
                {legalHold && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-800 flex items-center gap-0.5">
                    <ShieldAlert className="w-3 h-3" /> Legal Hold Active
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                Connection with {formerPartner.name} • Read-Only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#F0DFE3] dark:border-[#3D2833] overflow-x-auto scrollbar-none px-2 py-1.5 bg-[#FCF8F9] dark:bg-[#20151C] gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'conversations'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Memories</span>
          </button>
          <button
            onClick={() => setActiveTab('gratitude')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'gratitude'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Gratitude</span>
          </button>
          <button
            onClick={() => setActiveTab('bucket')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'bucket'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Bucket List</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Legal & Export</span>
          </button>
        </div>

        {/* Scrollable Tab Panels */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs text-[#2D1F24] dark:text-white">
          
          {/* ======================================================== */}
          {/* TAB 1: CONVERSATIONS (READ ONLY)                         */}
          {/* ======================================================== */}
          {activeTab === 'conversations' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                    Archived Conversations
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Read-only copy. Individual message deletion is disabled.
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-[#6D585E] dark:text-[#E6D7DE]">
                  Read Only
                </span>
              </div>

              {(!archivedData?.archivedMessages || archivedData.archivedMessages.length === 0) ? (
                <div className="p-8 text-center text-[#8B7578] dark:text-[#E6D7DE]">
                  No archived messages found.
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {archivedData.archivedMessages.map((msg) => {
                    const isSelf = msg.senderId === currentUser.id || msg.senderId === 'user-alex';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl ${
                            isSelf
                              ? 'bg-gradient-to-r from-[#E06C90] to-[#962855] text-white rounded-tr-none'
                              : 'bg-white dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] text-[#2D1F24] dark:text-white rounded-tl-none shadow-sm'
                          }`}
                        >
                          {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                          {msg.mediaUrl && (
                            <img
                              src={msg.mediaUrl}
                              alt="Attached Media"
                              className="mt-1.5 rounded-xl max-h-48 w-full object-cover"
                            />
                          )}
                          {msg.lockedLetter && (
                            <div className="mt-1.5 p-2 rounded-xl bg-black/10 dark:bg-white/10 text-[11px] space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <span>🔒 Sealed Love Letter</span>
                              </div>
                              <p className="line-clamp-2 italic">{msg.lockedLetter.letterContent}</p>
                            </div>
                          )}
                          <div className={`text-[10px] mt-1 text-right ${isSelf ? 'text-white/80' : 'text-[#8B7578] dark:text-[#E6D7DE]'}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MEMORIES WALL                                     */}
          {/* ======================================================== */}
          {activeTab === 'memories' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                    Archived Memories Wall
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Preserved memory milestones. Locked memories can still be opened with your 4-digit PIN.
                  </div>
                </div>
              </div>

              {(!archivedData?.archivedMemories || archivedData.archivedMemories.length === 0) ? (
                <div className="p-8 text-center text-[#8B7578] dark:text-[#E6D7DE]">
                  No archived memories found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {archivedData.archivedMemories.map((mem) => {
                    const isLocked = mem.isLocked && !unlockedPins[mem.id];
                    return (
                      <div
                        key={mem.id}
                        className="rounded-2xl overflow-hidden bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] shadow-sm flex flex-col"
                      >
                        <div className="relative h-32 bg-slate-100 dark:bg-[#170E14]">
                          {mem.imageUrl && (
                            <img
                              src={mem.imageUrl}
                              alt={mem.title}
                              className={`w-full h-full object-cover ${isLocked ? 'blur-md filter' : ''}`}
                            />
                          )}
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center text-white space-y-1.5">
                              <Lock className="w-5 h-5 text-amber-300" />
                              <span className="font-bold text-[11px]">PIN-Locked Memory</span>
                              <div className="flex gap-1 items-center">
                                <input
                                  type="password"
                                  maxLength={4}
                                  placeholder="PIN"
                                  value={pinInputs[mem.id] || ''}
                                  onChange={(e) =>
                                    setPinInputs(prev => ({ ...prev, [mem.id]: e.target.value }))
                                  }
                                  className="w-16 px-1.5 py-0.5 text-center rounded-lg bg-black/50 text-white text-xs border border-white/20"
                                />
                                <button
                                  onClick={() => handleUnlockPin(mem.id, mem.unlockPin || '1234')}
                                  className="px-2 py-0.5 rounded-lg bg-amber-400 text-black font-bold text-[10px]"
                                >
                                  Unlock
                                </button>
                              </div>
                              {pinErrors[mem.id] && (
                                <span className="text-[10px] text-rose-300">{pinErrors[mem.id]}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-[#2D1F24] dark:text-white line-clamp-1">
                              {mem.title}
                            </div>
                            <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                              {mem.date} • {mem.category}
                            </div>
                          </div>
                          {mem.description && !isLocked && (
                            <p className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE] line-clamp-2 mt-1">
                              {mem.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: GRATITUDE JAR                                     */}
          {/* ======================================================== */}
          {activeTab === 'gratitude' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                  Archived Gratitude Jar
                </div>
                <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  You keep all gratitude notes written by you. Notes received from partner are permanently archived.
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[11px] text-[#87204B] dark:text-[#FFAEC8] uppercase tracking-wider">
                  Notes You Authored:
                </div>
                {archivedData?.archivedGratitude?.ownNotes.map((note, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-rose-50/70 dark:bg-[#251821] border border-rose-100 dark:border-[#4D3340] text-[#4A3B40] dark:text-white leading-relaxed"
                  >
                    "{note}"
                  </div>
                ))}

                <div className="font-bold text-[11px] text-[#6D585E] dark:text-[#E6D7DE] uppercase tracking-wider pt-2">
                  Partner's Archived Notes:
                </div>
                {archivedData?.archivedGratitude?.partnerArchivedNotes.map((note, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E141B] border border-slate-200 dark:border-[#3D2833] text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed italic"
                  >
                    "{note}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BUCKET LIST                                       */}
          {/* ======================================================== */}
          {activeTab === 'bucket' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                  Archived Bucket List
                </div>
                <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  Own bucket goals remain yours; partner's added items are archived with static completion records.
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[11px] text-[#87204B] dark:text-[#FFAEC8] uppercase tracking-wider">
                  Your Added Adventures:
                </div>
                {archivedData?.archivedBucketList?.ownItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#2D1F24] dark:text-white">{item.title}</div>
                      <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                        Category: {item.category}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      Kept by You
                    </span>
                  </div>
                ))}

                <div className="font-bold text-[11px] text-[#6D585E] dark:text-[#E6D7DE] uppercase tracking-wider pt-2">
                  Partner's Archived Adventures:
                </div>
                {archivedData?.archivedBucketList?.partnerArchivedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E141B] border border-slate-200 dark:border-[#3D2833] flex items-center justify-between opacity-80"
                  >
                    <div>
                      <div className="font-medium text-[#2D1F24] dark:text-white">{item.title}</div>
                      <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                        Category: {item.category}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                      Archived
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: STATS & MILESTONES                                */}
          {/* ======================================================== */}
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                  Archived Counters & Milestones
                </div>
                <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  Individual lifetime gestures are kept. Active streak is reset to 0, with record kept.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-0.5">
                  <span className="text-xl">💋</span>
                  <div className="text-lg font-bold text-[#87204B] dark:text-[#FFAEC8]">
                    {archivedData?.archivedStats.lifetimeKissesSent || 247}
                  </div>
                  <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                    Kisses Sent by You
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-0.5">
                  <span className="text-xl">🫂</span>
                  <div className="text-lg font-bold text-[#87204B] dark:text-[#FFAEC8]">
                    {archivedData?.archivedStats.lifetimeHugsSent || 189}
                  </div>
                  <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                    Hugs Sent by You
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-0.5">
                  <span className="text-xl">🔥</span>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {archivedData?.archivedStats.longestStreakDays || 152} days
                  </div>
                  <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                    Longest Shared Streak
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-0.5">
                  <span className="text-xl">🗓️</span>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {archivedData?.archivedStats.daysTogether || 41} days
                  </div>
                  <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                    Total Time Together
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-center space-y-1">
                <div className="text-xs font-bold text-[#2D1F24] dark:text-white">
                  Shared Counter Archive
                </div>
                <div className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE]">
                  We exchanged 500 kisses & 378 hugs over our connection.
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: LEGAL HOLD, EXPORT & DELETE                       */}
          {/* ======================================================== */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {/* Legal Hold Section */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-blue-900 dark:text-blue-200">Legal Hold Protection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={legalHold}
                    onChange={(e) => toggleLegalHold(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  When enabled (e.g. for law enforcement requests or legal proceedings), all archive deletion actions are frozen and strictly blocked.
                </p>
              </div>

              {/* Export Archive Section */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-2">
                <div className="font-bold text-[#2D1F24] dark:text-white flex items-center justify-between">
                  <span>Export Complete Archive</span>
                  <Download className="w-4 h-4 text-[#87204B] dark:text-[#FFAEC8]" />
                </div>
                <p className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  Download your entire archived history (chat, memories, notes, adventures, and milestones) as a structured JSON file.
                </p>
                <button
                  onClick={exportArchivedData}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-sm hover:brightness-105"
                >
                  Download Archive File (.JSON) 📦
                </button>
              </div>

              {/* Granular & Permanent Deletion */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2.5">
                <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4" />
                  <span>Permanent Deletion</span>
                </div>
                <p className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE]">
                  Delete specific archived categories or completely wipe all shared data. This action is 
                  <strong className="text-rose-600 dark:text-rose-400"> irreversible</strong>.
                </p>

                {legalHold ? (
                  <div className="p-2 rounded-xl bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Deletion is currently disabled because Legal Hold is active.</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteArchivedItem('chat')}
                        className="flex-1 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 text-[11px] font-semibold"
                      >
                        Delete Chat Only
                      </button>
                      <button
                        onClick={() => deleteArchivedItem('memories')}
                        className="flex-1 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 text-[11px] font-semibold"
                      >
                        Delete Memories Only
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Permanently wipe ALL archived data? This cannot be undone.')) {
                          deleteArchivedItem('all');
                          onClose();
                        }
                      }}
                      className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      Delete ALL Archived Data Permanently 🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-bold text-[#4A3B40] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
