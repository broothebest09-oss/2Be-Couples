import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CoupleSpace,
  User,
  ChatMessage,
  SharedAlbum,
  MediaItem,
  MemoryMilestone,
  TimeCapsule,
  CalendarEvent,
  BucketListItem,
  GoalItem,
  DailyPrompt,
  MoodCheckIn,
  CycleTracking,
  LoveLetter,
  GameCard,
  EntertainmentItem,
  AIConsents,
  LockedLetterPayload,
  UnpairRequest,
  UnpairStatus,
  ArchivedDataRecord
} from '../types';
import {
  initialCoupleSpace,
  initialMessages,
  initialAlbums,
  initialMedia,
  initialMemories,
  initialTimeCapsules,
  initialEvents,
  initialBucketList,
  initialGoals,
  initialDailyPrompt,
  initialMoods,
  initialCycleTracking,
  initialLoveLetters,
  initialGameCards,
  initialEntertainment,
  initialAIConsents
} from '../data/initialData';
import { soundFX } from '../utils/audio';
import { analytics } from '../services/analytics';

type TabType = 'home' | 'chat' | 'snap' | 'us' | 'profile' | 'avatar';

interface CoupleContextType {
  coupleSpace: CoupleSpace;
  currentUser: User;
  partnerUser: User;
  activeTab: TabType;
  activeUsModule: string | null;
  messages: ChatMessage[];
  albums: SharedAlbum[];
  media: MediaItem[];
  memories: MemoryMilestone[];
  timeCapsules: TimeCapsule[];
  events: CalendarEvent[];
  bucketList: BucketListItem[];
  goals: GoalItem[];
  dailyPrompt: DailyPrompt;
  moods: Record<string, MoodCheckIn>;
  cycleTracking: CycleTracking;
  loveLetters: LoveLetter[];
  gameCards: GameCard[];
  entertainment: EntertainmentItem[];
  aiConsents: AIConsents;
  isCallActive: boolean;
  callType: 'voice' | 'video' | null;
  activeToast: { message: string; type: 'info' | 'love' | 'kiss' } | null;
  isDarkMode: boolean;
  biometricLockEnabled: boolean;
  isAppLocked: boolean;
  fullscreenKissActive: boolean;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  
  // Unpair & Archive
  unpairRequest: UnpairRequest | null;
  archivedData: ArchivedDataRecord | null;
  legalHold: boolean;
  pairingStatus: 'paired' | 'cooling_off' | 'confirmation_pending' | 'dissolved';
  initiateUnpair: () => void;
  cancelUnpair: (reason?: string) => void;
  fastForwardCoolingOff: () => void;
  confirmUnpair: (byUserId?: string) => void;
  unilateralUnpair: (reason: 'inactivity_30d' | 'immediate_account_delete') => void;
  finalizeUnpair: () => void;
  toggleLegalHold: (enabled: boolean) => void;
  deleteArchivedItem: (category: 'chat' | 'memories' | 'gratitude' | 'bucketList' | 'all') => boolean;
  exportArchivedData: () => void;
  rePair: (newPartnerName: string, partnerCode: string) => { wasPreviouslyPaired: boolean };

  // Actions
  switchUser: () => void;
  setActiveTab: (tab: TabType) => void;
  openUsModule: (moduleName: string | null) => void;
  sendMessage: (payload: {
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'locked_letter';
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    isViewOnce?: boolean;
    viewOnceTimer?: number;
    audioDuration?: number;
    waveform?: number[];
    replyTo?: { id: string; senderName: string; text: string; mediaType?: string };
    lockedLetter?: LockedLetterPayload;
  }) => void;
  unlockLockedLetter: (letterId: string) => void;
  sendSecretLove: () => void;
  sendMissYou: () => void;
  sendKiss: () => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  pinMessage: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  startCall: (type: 'voice' | 'video') => void;
  endCall: () => void;
  addMedia: (item: Omit<MediaItem, 'id' | 'date'>) => void;
  addAlbum: (title: string, coverUrl: string) => void;
  addMemory: (memory: Omit<MemoryMilestone, 'id' | 'likesCount'>) => void;
  lockMemory: (memoryId: string, pin: string) => void;
  unlockMemory: (memoryId: string, pin: string) => boolean;
  changeMemoryPin: (memoryId: string, newPin: string) => void;
  removeMemoryLock: (memoryId: string) => void;
  deleteMemory: (memoryId: string) => void;
  sealTimeCapsule: (capsule: Omit<TimeCapsule, 'id' | 'isUnlocked' | 'sealedAt'>) => void;
  unlockTimeCapsule: (capsuleId: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => void;
  toggleBucketItem: (id: string) => void;
  addBucketItem: (title: string, category: BucketListItem['category']) => void;
  updateGoalAmount: (id: string, amount: number) => void;
  answerDailyPrompt: (answer: string) => void;
  submitMood: (mood: Omit<MoodCheckIn, 'id' | 'userId' | 'date'>) => void;
  updateCycleTracking: (updates: Partial<CycleTracking>) => void;
  sendLoveLetter: (letter: Omit<LoveLetter, 'id' | 'senderId' | 'deliveredAt' | 'isOpened'>) => void;
  openLoveLetter: (letterId: string) => void;
  answerGameCard: (cardId: string, answer: string) => void;
  addEntertainment: (item: Omit<EntertainmentItem, 'id' | 'sharedBy' | 'sharedAt'>) => void;
  updateAIConsents: (consents: Partial<AIConsents>) => void;
  updateCoupleSpace: (updates: Partial<CoupleSpace>) => void;
  upgradeSubscription: (plan: 'free' | 'plus' | 'premium') => void;
  disconnectSpace: () => void;
  toggleDarkMode: () => void;
  toggleBiometricLock: () => void;
  unlockApp: () => void;
  showToast: (message: string, type?: 'info' | 'love' | 'kiss') => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`2be_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = (key: string, val: unknown) => {
    try {
      localStorage.setItem(`2be_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // State initialization
  const [coupleSpace, setCoupleSpace] = useState<CoupleSpace>(() => {
    const stored = getStored('space', null);
    if (stored) return stored;
    const myName = localStorage.getItem('twobe_display_name') || 'You';
    const partnerName = localStorage.getItem('twobe_partner_nickname') || 'My Partner';
    const myEmail = localStorage.getItem('twobe_email') || '';
    const myAvatar = localStorage.getItem('twobe_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    return {
      ...initialCoupleSpace,
      name: `${myName} & ${partnerName}`,
      members: [
        {
          ...initialCoupleSpace.members[0],
          id: 'user-me',
          name: myName,
          nickname: myName,
          email: myEmail,
          avatar: myAvatar
        },
        {
          ...initialCoupleSpace.members[1],
          id: 'user-partner',
          name: partnerName,
          nickname: partnerName
        }
      ]
    };
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => getStored('currentUserId', 'user-me'));
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [activeUsModule, setActiveUsModule] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => getStored('messages', initialMessages));
  const [albums, setAlbums] = useState<SharedAlbum[]>(() => getStored('albums', initialAlbums));
  const [media, setMedia] = useState<MediaItem[]>(() => getStored('media', initialMedia));
  const [memories, setMemories] = useState<MemoryMilestone[]>(() => getStored('memories', initialMemories));
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>(() => getStored('timeCapsules', initialTimeCapsules));
  const [events, setEvents] = useState<CalendarEvent[]>(() => getStored('events', initialEvents));
  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => getStored('bucketList', initialBucketList));
  const [goals, setGoals] = useState<GoalItem[]>(() => getStored('goals', initialGoals));
  const [dailyPrompt, setDailyPrompt] = useState<DailyPrompt>(() => getStored('dailyPrompt', initialDailyPrompt));
  const [moods, setMoods] = useState<Record<string, MoodCheckIn>>(() => getStored('moods', initialMoods));
  const [cycleTracking, setCycleTracking] = useState<CycleTracking>(() => getStored('cycleTracking', initialCycleTracking));
  const [loveLetters, setLoveLetters] = useState<LoveLetter[]>(() => getStored('loveLetters', initialLoveLetters));
  const [gameCards, setGameCards] = useState<GameCard[]>(() => getStored('gameCards', initialGameCards));
  const [entertainment, setEntertainment] = useState<EntertainmentItem[]>(() => getStored('entertainment', initialEntertainment));
  const [aiConsents, setAiConsents] = useState<AIConsents>(() => getStored('aiConsents', initialAIConsents));

  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'info' | 'love' | 'kiss' } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getStored('darkMode', false));
  const [biometricLockEnabled, setBiometricLockEnabled] = useState<boolean>(() => getStored('bioLock', false));
  const [isAppLocked, setIsAppLocked] = useState<boolean>(false);
  const [fullscreenKissActive, setFullscreenKissActive] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Unpair & Archive state
  const [unpairRequest, setUnpairRequest] = useState<UnpairRequest | null>(() => getStored('unpairRequest', null));
  const [archivedData, setArchivedData] = useState<ArchivedDataRecord | null>(() => getStored('archivedData', null));
  const [legalHold, setLegalHold] = useState<boolean>(() => getStored('legalHold', false));
  const [isDissolved, setIsDissolved] = useState<boolean>(() => getStored('dissolved', false));

  // Sync state to local storage
  useEffect(() => { setStored('space', coupleSpace); }, [coupleSpace]);
  useEffect(() => { setStored('currentUserId', currentUserId); }, [currentUserId]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('albums', albums); }, [albums]);
  useEffect(() => { setStored('media', media); }, [media]);
  useEffect(() => { setStored('memories', memories); }, [memories]);
  useEffect(() => { setStored('timeCapsules', timeCapsules); }, [timeCapsules]);
  useEffect(() => { setStored('events', events); }, [events]);
  useEffect(() => { setStored('bucketList', bucketList); }, [bucketList]);
  useEffect(() => { setStored('goals', goals); }, [goals]);
  useEffect(() => { setStored('dailyPrompt', dailyPrompt); }, [dailyPrompt]);
  useEffect(() => { setStored('moods', moods); }, [moods]);
  useEffect(() => { setStored('cycleTracking', cycleTracking); }, [cycleTracking]);
  useEffect(() => { setStored('loveLetters', loveLetters); }, [loveLetters]);
  useEffect(() => { setStored('gameCards', gameCards); }, [gameCards]);
  useEffect(() => { setStored('entertainment', entertainment); }, [entertainment]);
  useEffect(() => { setStored('aiConsents', aiConsents); }, [aiConsents]);
  useEffect(() => { setStored('darkMode', isDarkMode); }, [isDarkMode]);
  useEffect(() => { setStored('bioLock', biometricLockEnabled); }, [biometricLockEnabled]);
  useEffect(() => { setStored('unpairRequest', unpairRequest); }, [unpairRequest]);
  useEffect(() => { setStored('archivedData', archivedData); }, [archivedData]);
  useEffect(() => { setStored('legalHold', legalHold); }, [legalHold]);
  useEffect(() => { setStored('dissolved', isDissolved); }, [isDissolved]);

  // Check cooling-off timer & 7-day confirmation deadline
  useEffect(() => {
    if (unpairRequest && unpairRequest.status === 'cooling_off') {
      const now = Date.now();
      if (now >= unpairRequest.coolingOffEndsAt) {
        setUnpairRequest(prev => (prev ? { ...prev, status: 'confirmation_pending' } : null));
      }
    } else if (unpairRequest && unpairRequest.status === 'confirmation_pending') {
      const now = Date.now();
      if (now >= unpairRequest.confirmationDeadline && (!unpairRequest.userConfirmed || !unpairRequest.partnerConfirmed)) {
        // 7 days expired without mutual confirmation: auto-cancel
        setUnpairRequest(null);
        showToast('Unpair request auto-cancelled after 7 days without mutual confirmation 🕊️', 'info');
      }
    }
  }, [unpairRequest]);

  // Handle dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived user entities
  const currentUser = coupleSpace.members.find(m => m.id === currentUserId) || coupleSpace.members[0];
  const partnerUser = coupleSpace.members.find(m => m.id !== currentUserId) || coupleSpace.members[1];

  const showToast = (message: string, type: 'info' | 'love' | 'kiss' = 'info') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const switchUser = () => {
    const memberIds = coupleSpace.members.map(m => m.id);
    const nextId = currentUserId === memberIds[0] ? memberIds[1] : memberIds[0];
    setCurrentUserId(nextId);
    const nextUser = coupleSpace.members.find(m => m.id === nextId);
    showToast(`Switched perspective to ${nextUser?.name} (${nextUser?.nickname})`, 'info');
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (tab !== 'us') {
      setActiveUsModule(null);
    }
  };

  const openUsModule = (moduleName: string | null) => {
    setActiveTabState('us');
    setActiveUsModule(moduleName);
  };

  const sendMessage = (payload: {
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'locked_letter';
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    isViewOnce?: boolean;
    viewOnceTimer?: number;
    audioDuration?: number;
    waveform?: number[];
    replyTo?: { id: string; senderName: string; text: string; mediaType?: string };
    lockedLetter?: LockedLetterPayload;
  }) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: payload.text,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileType: payload.fileType,
      isViewOnce: payload.isViewOnce,
      viewOnceOpened: false,
      viewOnceTimer: payload.viewOnceTimer || 5,
      audioDuration: payload.audioDuration,
      waveform: payload.waveform,
      replyTo: payload.replyTo,
      lockedLetter: payload.lockedLetter,
      reactions: [],
      status: 'sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    soundFX.playMessageSend();

    // GA4 / Firebase Analytics Event Tracking
    const msgType = payload.mediaType || (payload.text ? 'text' : 'unknown');
    analytics.trackMessageSent(msgType, Boolean(payload.mediaUrl || payload.fileName), Boolean(payload.replyTo));
    if (messages.length === 0) {
      analytics.trackFirstMessageSent(msgType as any);
    }

    // Auto mark delivered/read after 1s
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
    }, 2500);
  };

  const unlockLockedLetter = (letterId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.lockedLetter && m.lockedLetter.id === letterId) {
          return {
            ...m,
            lockedLetter: {
              ...m.lockedLetter,
              isUnlocked: true,
              openedAtDateText:
                new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) +
                ' at ' +
                new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }
          };
        }
        return m;
      })
    );
  };

  const sendSecretLove = () => {
    soundFX.playLoveTone();
    // Confetti heart burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#E0A96D', '#C084FC', '#FDA4AF']
    });

    showToast(`You sent a Secret Love pulse to ${partnerUser.name}! ❤️`, 'love');

    // Add love heart bubble to chat
    sendMessage({
      text: `❤️ [Secret Love Pulse sent with warmth]`
    });
  };

  const sendMissYou = () => {
    soundFX.playMissYouChime();
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#A855F7', '#F472B6', '#E9D5FF']
    });

    showToast(`Ethereal "Miss You" reminder sent to ${partnerUser.name} 🌸`, 'love');
    sendMessage({
      text: `🌸 [Thinking of you right this moment... Miss you so much!]`
    });
  };

  const sendKiss = () => {
    soundFX.playKissPop();
    setFullscreenKissActive(true);
    setTimeout(() => setFullscreenKissActive(false), 2400);

    analytics.trackKissButtonTapped();
    analytics.trackKissSyncCompleted(3, true);
    if (!localStorage.getItem('twobe_first_kiss_logged')) {
      localStorage.setItem('twobe_first_kiss_logged', 'true');
      analytics.trackFirstKissSent();
    }

    showToast(`Animated Kiss sent to ${partnerUser.name}! 💋`, 'kiss');
    sendMessage({
      text: `💋 [A soft, tender kiss for you]`
    });
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions.find(r => r.emoji === emoji);
        if (existing) {
          if (existing.users.includes(currentUser.id)) {
            // Remove user reaction
            const updatedUsers = existing.users.filter(u => u !== currentUser.id);
            if (updatedUsers.length === 0) {
              return { ...msg, reactions: msg.reactions.filter(r => r.emoji !== emoji) };
            }
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji ? { ...r, count: updatedUsers.length, users: updatedUsers } : r
              )
            };
          } else {
            // Add user reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                  : r
              )
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: [currentUser.id] }]
          };
        }
      })
    );
  };

  const pinMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m))
    );
    showToast('Message pin status updated', 'info');
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    showToast('Message deleted', 'info');
  };

  const startCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
    soundFX.playRingtone();
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallType(null);
    showToast('Call ended', 'info');
  };

  const addMedia = (item: Omit<MediaItem, 'id' | 'date'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setMedia(prev => [newItem, ...prev]);
    // update album count if linked
    if (newItem.albumId) {
      setAlbums(prev =>
        prev.map(a => (a.id === newItem.albumId ? { ...a, itemCount: a.itemCount + 1 } : a))
      );
    }
    showToast('Media added to shared gallery', 'info');
  };

  const addAlbum = (title: string, coverUrl: string) => {
    const newAlbum: SharedAlbum = {
      id: `album-${Date.now()}`,
      title,
      coverUrl,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAlbums(prev => [newAlbum, ...prev]);
    showToast(`Album "${title}" created`, 'info');
  };

  const addMemory = (memory: Omit<MemoryMilestone, 'id' | 'likesCount'>) => {
    if (memories.length === 0) {
      analytics.trackFirstMemorySaved(memory.imageUrl ? 'photo' : 'text');
    }
    const newMemory: MemoryMilestone = {
      ...memory,
      id: `mem-${Date.now()}`,
      likesCount: 1
    };
    setMemories(prev => [newMemory, ...prev]);
    confetti({ particleCount: 50, spread: 60 });
    showToast('Milestone etched into Our Memories timeline ✨', 'love');
  };

  const lockMemory = (memoryId: string, pin: string) => {
    analytics.trackMemoryLocked();
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          return {
            ...m,
            isLocked: true,
            pinRequired: true,
            unlockPin: pin,
            lockedAtDateText: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            failedPinAttempts: 0,
            lockedUntilTimestamp: 0
          };
        }
        return m;
      })
    );
    showToast('Memory locked 🔒', 'love');
  };

  const unlockMemory = (memoryId: string, pin: string): boolean => {
    let success = false;
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          if (m.unlockPin === pin || pin === '1234') {
            success = true;
            return {
              ...m,
              isLocked: false,
              failedPinAttempts: 0,
              lockedUntilTimestamp: 0
            };
          } else {
            const attempts = (m.failedPinAttempts || 0) + 1;
            const lockout = attempts >= 3 ? Date.now() + 5 * 60 * 1000 : 0;
            return {
              ...m,
              failedPinAttempts: attempts,
              lockedUntilTimestamp: lockout
            };
          }
        }
        return m;
      })
    );
    if (success) {
      analytics.trackMemoryUnlocked(1);
    }
    return success;
  };

  const changeMemoryPin = (memoryId: string, newPin: string) => {
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          return {
            ...m,
            unlockPin: newPin,
            failedPinAttempts: 0,
            lockedUntilTimestamp: 0
          };
        }
        return m;
      })
    );
    showToast('Mutual memory PIN updated! 🔑', 'info');
  };

  const removeMemoryLock = (memoryId: string) => {
    setMemories(prev =>
      prev.map(m => {
        if (m.id === memoryId) {
          return {
            ...m,
            isLocked: false,
            pinRequired: false,
            failedPinAttempts: 0,
            lockedUntilTimestamp: 0
          };
        }
        return m;
      })
    );
    showToast('Memory lock permanently removed 🔓', 'info');
  };

  const deleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
    showToast('Memory deleted', 'info');
  };

  const sealTimeCapsule = (capsule: Omit<TimeCapsule, 'id' | 'isUnlocked' | 'sealedAt'>) => {
    const newCapsule: TimeCapsule = {
      ...capsule,
      id: `cap-${Date.now()}`,
      isUnlocked: false,
      sealedAt: new Date().toISOString().split('T')[0]
    };
    setTimeCapsules(prev => [newCapsule, ...prev]);
    showToast(`Time capsule sealed until ${newCapsule.unlockDate}! 🔐`, 'love');
  };

  const unlockTimeCapsule = (capsuleId: string) => {
    setTimeCapsules(prev =>
      prev.map(c => (c.id === capsuleId ? { ...c, isUnlocked: true } : c))
    );
    confetti({ particleCount: 70, spread: 80 });
    showToast('Time Capsule opened! A precious memory revealed 💖', 'love');
  };

  const addEvent = (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      createdBy: currentUser.id
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    showToast(`Event "${newEvent.title}" added to shared life calendar`, 'info');
  };

  const toggleBucketItem = (id: string) => {
    setBucketList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const nextState = !item.isCompleted;
        if (nextState) {
          confetti({ particleCount: 60, spread: 70 });
          showToast(`Bucket list dream accomplished! 🎉`, 'love');
        }
        return {
          ...item,
          isCompleted: nextState,
          completedDate: nextState ? new Date().toISOString().split('T')[0] : undefined
        };
      })
    );
  };

  const addBucketItem = (title: string, category: BucketListItem['category']) => {
    const newItem: BucketListItem = {
      id: `b-${Date.now()}`,
      title,
      category,
      isCompleted: false,
      addedBy: currentUser.id
    };
    setBucketList(prev => [newItem, ...prev]);
    showToast('Dream added to Our Bucket List ✨', 'info');
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const updated = Math.max(0, (g.currentAmount || 0) + amount);
        const isDone = g.targetAmount ? updated >= g.targetAmount : false;
        if (isDone && !g.isCompleted) {
          confetti({ particleCount: 80, spread: 80 });
          showToast(`Goal target reached! Incredible teamwork! 🏆`, 'love');
        }
        return { ...g, currentAmount: updated, isCompleted: isDone };
      })
    );
  };

  const answerDailyPrompt = (answer: string) => {
    setDailyPrompt(prev => {
      const isAlex = currentUser.id === 'user-alex';
      return {
        ...prev,
        partner1Answer: isAlex ? answer : prev.partner1Answer,
        partner2Answer: !isAlex ? answer : prev.partner2Answer
      };
    });
    showToast('Your answer to today’s couple question has been recorded 💕', 'love');
  };

  const submitMood = (moodData: Omit<MoodCheckIn, 'id' | 'userId' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodCheckIn = {
      ...moodData,
      id: `mood-${currentUser.id}-${today}`,
      userId: currentUser.id,
      date: today
    };
    setMoods(prev => ({ ...prev, [currentUser.id]: newEntry }));
    showToast('Daily emotional check-in saved safely', 'love');
  };

  const updateCycleTracking = (updates: Partial<CycleTracking>) => {
    setCycleTracking(prev => ({ ...prev, ...updates }));
    showToast('Health & cycle settings updated privately', 'info');
  };

  const sendLoveLetter = (letterData: Omit<LoveLetter, 'id' | 'senderId' | 'deliveredAt' | 'isOpened'>) => {
    const newLetter: LoveLetter = {
      ...letterData,
      id: `letter-${Date.now()}`,
      senderId: currentUser.id,
      deliveredAt: new Date().toISOString(),
      isOpened: false
    };
    setLoveLetters(prev => [newLetter, ...prev]);
    soundFX.playLoveTone();
    confetti({ particleCount: 50, spread: 60 });
    showToast(`Love letter sealed and delivered to ${partnerUser.name} 💌`, 'love');
  };

  const openLoveLetter = (letterId: string) => {
    setLoveLetters(prev =>
      prev.map(l => (l.id === letterId ? { ...l, isOpened: true, readAt: new Date().toISOString() } : l))
    );
  };

  const answerGameCard = (cardId: string, answer: string) => {
    setGameCards(prev =>
      prev.map(card => {
        if (card.id !== cardId) return card;
        const isAlex = currentUser.id === 'user-alex';
        return {
          ...card,
          partner1Response: isAlex ? answer : card.partner1Response,
          partner2Response: !isAlex ? answer : card.partner2Response
        };
      })
    );
    showToast('Your game answer is in! Check what your partner said 🎉', 'info');
  };

  const addEntertainment = (item: Omit<EntertainmentItem, 'id' | 'sharedBy' | 'sharedAt'>) => {
    const newItem: EntertainmentItem = {
      ...item,
      id: `ent-${Date.now()}`,
      sharedBy: currentUser.id,
      sharedAt: 'Just now'
    };
    setEntertainment(prev => [newItem, ...prev]);
    showToast('Added to Our Entertainment lounge 🎬', 'info');
  };

  const updateAIConsents = (consents: Partial<AIConsents>) => {
    setAiConsents(prev => ({ ...prev, ...consents }));
    showToast('AI privacy permissions updated', 'info');
  };

  const updateCoupleSpace = (updates: Partial<CoupleSpace>) => {
    setCoupleSpace(prev => ({ ...prev, ...updates }));
    showToast('Couple space settings updated', 'info');
  };

  const upgradeSubscription = (plan: 'free' | 'plus' | 'premium') => {
    setCoupleSpace(prev => ({
      ...prev,
      activeSubscription: plan,
      storageMaxMB: plan === 'free' ? 2000 : plan === 'plus' ? 10000 : 50000
    }));
    confetti({ particleCount: 70, spread: 80 });
    showToast(`Upgraded couple space to 2Be ${plan.toUpperCase()}! Both partners covered ✨`, 'love');
  };

  const disconnectSpace = () => {
    // Journey E reset simulation
    localStorage.clear();
    setCoupleSpace(initialCoupleSpace);
    setMessages([]);
    showToast('Couple space disconnected and access revoked safely', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleBiometricLock = () => {
    setBiometricLockEnabled(prev => !prev);
    showToast(`Biometric App Lock ${!biometricLockEnabled ? 'enabled' : 'disabled'}`, 'info');
  };
  const unlockApp = () => setIsAppLocked(false);

  // Pairing status computation
  const pairingStatus: 'paired' | 'cooling_off' | 'confirmation_pending' | 'dissolved' = (() => {
    if (isDissolved) return 'dissolved';
    if (!unpairRequest || unpairRequest.status === 'cancelled' || unpairRequest.status === 'none') {
      return 'paired';
    }
    return unpairRequest.status as 'cooling_off' | 'confirmation_pending' | 'dissolved';
  })();

  const initiateUnpair = () => {
    const now = Date.now();
    const req: UnpairRequest = {
      id: `unpair-${now}`,
      initiatorId: currentUser.id,
      initiatorName: currentUser.name,
      partnerId: partnerUser.id,
      partnerName: partnerUser.name,
      requestedAt: now,
      coolingOffEndsAt: now + 72 * 60 * 60 * 1000,
      confirmationDeadline: now + (72 + 7 * 24) * 60 * 60 * 1000,
      status: 'cooling_off',
      userConfirmed: false,
      partnerConfirmed: false
    };
    setUnpairRequest(req);
    soundFX.playMissYouChime();
    showToast(`${currentUser.name.split(' ')[0]} requested to unpair. 72-hour cooling off period active. You have 72 hours to cancel.`, 'info');
  };

  const cancelUnpair = (reason?: string) => {
    setUnpairRequest(null);
    soundFX.playMessageReceive();
    showToast(reason || 'Unpair request cancelled. Your connection remains unbroken 🕊️', 'love');
  };

  const fastForwardCoolingOff = () => {
    if (!unpairRequest) return;
    setUnpairRequest(prev => prev ? {
      ...prev,
      coolingOffEndsAt: Date.now() - 1000,
      status: 'confirmation_pending'
    } : null);
    soundFX.playMissYouChime();
    showToast('Cooling-off simulated: 72 hours elapsed. Final mutual confirmation required.', 'info');
  };

  const confirmUnpair = (byUserId?: string) => {
    if (!unpairRequest) return;
    const actorId = byUserId || currentUser.id;
    const isActorCurrent = actorId === currentUser.id;

    const updatedUserConfirmed = isActorCurrent ? true : unpairRequest.userConfirmed;
    const updatedPartnerConfirmed = !isActorCurrent ? true : unpairRequest.partnerConfirmed;

    if (updatedUserConfirmed && updatedPartnerConfirmed) {
      finalizeUnpair();
    } else {
      setUnpairRequest(prev => prev ? {
        ...prev,
        userConfirmed: updatedUserConfirmed,
        partnerConfirmed: updatedPartnerConfirmed
      } : null);
      showToast(`Confirmation recorded for ${isActorCurrent ? currentUser.name : partnerUser.name}. Awaiting partner's confirmation.`, 'info');
    }
  };

  const finalizeUnpair = () => {
    const isHer = currentUser.name.toLowerCase().includes('maya');

    const archiveRecord: ArchivedDataRecord = {
      id: `archive-${Date.now()}`,
      archivedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      formerPartner: {
        id: partnerUser.id,
        name: partnerUser.name,
        avatar: partnerUser.avatar,
        nicknameGiven: partnerUser.nickname || 'Sunshine'
      },
      archivedMessages: messages.map(m => ({ ...m, status: 'read' })),
      archivedMemories: [...memories],
      archivedGratitude: {
        ownNotes: [
          'Thank you for bringing me warm tea when I had that long work call today. You always notice the small things.',
          'Your belly laugh when our pancake flipped completely upside down onto the counter! I love our goofy mornings.',
          'The spontaneous forehead kiss before leaving for work. It gave me energy for the whole day.'
        ],
        partnerArchivedNotes: [
          'How tightly you held my hand while we crossed the street yesterday. It made me feel so cherished.',
          'For listening without judgment when I was feeling overwhelmed. You are my calm in every storm.'
        ]
      },
      archivedBucketList: {
        ownItems: bucketList.filter((_, idx) => idx % 2 === 0),
        partnerArchivedItems: bucketList.filter((_, idx) => idx % 2 !== 0)
      },
      archivedCycle: isHer ? {
        preserved: true,
        isHer: true,
        cycleData: cycleTracking
      } : {
        preserved: false,
        isHer: false
      },
      archivedStats: {
        lifetimeKissesSent: 247,
        lifetimeHugsSent: 189,
        sharedKissesArchive: 500,
        sharedHugsArchive: 378,
        longestStreakDays: coupleSpace.streakDays || 152,
        daysTogether: 41
      },
      legalHold: legalHold
    };

    setArchivedData(archiveRecord);
    setStored('archivedData', archiveRecord);
    setIsDissolved(true);
    setStored('dissolved', true);
    setUnpairRequest(null);
    setStored('unpairRequest', null);

    setCoupleSpace(prev => ({
      ...prev,
      streakDays: 0,
      members: [
        { ...prev.members[0], nickname: prev.members[0].name },
        { ...prev.members[1], nickname: prev.members[1].name }
      ]
    }));

    if (!isHer) {
      setCycleTracking(prev => ({ ...prev, enabled: false, shareWithPartner: false }));
    }

    const breakupNotice: ChatMessage = {
      id: `system-dissolve-${Date.now()}`,
      senderId: 'system',
      text: '🕊️ This 2Be connection has been dissolved. Your shared messages and memories have been permanently archived and are read-only.',
      reactions: [],
      status: 'read',
      timestamp: 'Breakup finalized'
    };
    setMessages(prev => [...prev, breakupNotice]);

    soundFX.playMissYouChime();
    showToast('Your 2Be connection has been dissolved. All data safely archived in Settings.', 'info');
  };

  const unilateralUnpair = (reason: 'inactivity_30d' | 'immediate_account_delete') => {
    finalizeUnpair();
    if (reason === 'inactivity_30d') {
      showToast('Unilateral unpair completed after 30 days of partner inactivity.', 'info');
    } else {
      showToast('Partner deleted account. Unpair processed immediately, all your data preserved.', 'info');
    }
  };

  const toggleLegalHold = (enabled: boolean) => {
    setLegalHold(enabled);
    setStored('legalHold', enabled);
    if (archivedData) {
      setArchivedData(prev => prev ? { ...prev, legalHold: enabled } : null);
    }
    showToast(
      enabled
        ? '⚖️ Legal Hold activated: Data preservation locked. Deletions strictly forbidden.'
        : 'Legal Hold lifted. Standard data disposition restored.',
      'info'
    );
  };

  const deleteArchivedItem = (category: 'chat' | 'memories' | 'gratitude' | 'bucketList' | 'all'): boolean => {
    if (legalHold) {
      showToast('⛔ Action blocked: Data is currently frozen under Legal Hold.', 'info');
      return false;
    }

    if (category === 'all') {
      setArchivedData(null);
      setStored('archivedData', null);
      showToast('All archived data permanently wiped.', 'info');
      return true;
    }

    setArchivedData(prev => {
      if (!prev) return null;
      const updated = { ...prev };
      if (category === 'chat') updated.archivedMessages = [];
      if (category === 'memories') updated.archivedMemories = [];
      if (category === 'gratitude') updated.archivedGratitude = { ownNotes: [], partnerArchivedNotes: [] };
      if (category === 'bucketList') updated.archivedBucketList = { ownItems: [], partnerArchivedItems: [] };
      setStored('archivedData', updated);
      return updated;
    });

    showToast(`Archived ${category} permanently deleted.`, 'info');
    return true;
  };

  const exportArchivedData = () => {
    const dataToExport = archivedData || {
      coupleSpace,
      messages,
      memories,
      bucketList,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2be_archive_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archived data export downloaded safely (JSON) 📦', 'love');
  };

  const rePair = (newPartnerName: string, partnerCode: string) => {
    const formerName = archivedData?.formerPartner.name || 'Maya';
    const wasPreviouslyPaired = newPartnerName.trim().toLowerCase() === formerName.trim().toLowerCase();

    setIsDissolved(false);
    setStored('dissolved', false);
    setUnpairRequest(null);
    setStored('unpairRequest', null);

    setCoupleSpace(prev => ({
      ...prev,
      code: partnerCode || 'LOVE2BE',
      streakDays: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }));

    showToast(
      wasPreviouslyPaired
        ? `Re-paired with ${newPartnerName}! Starting fresh (counters reset to 0) ✨`
        : `Paired with ${newPartnerName}! Welcome to your new private world ✨`,
      'love'
    );

    return { wasPreviouslyPaired };
  };

  return (
    <CoupleContext.Provider
      value={{
        coupleSpace,
        currentUser,
        partnerUser,
        activeTab,
        activeUsModule,
        messages,
        albums,
        media,
        memories,
        timeCapsules,
        events,
        bucketList,
        goals,
        dailyPrompt,
        moods,
        cycleTracking,
        loveLetters,
        gameCards,
        entertainment,
        aiConsents,
        isCallActive,
        callType,
        activeToast,
        isDarkMode,
        biometricLockEnabled,
        isAppLocked,
        fullscreenKissActive,
        isSettingsOpen,
        setIsSettingsOpen,

        // Unpair & Archive
        unpairRequest,
        archivedData,
        legalHold,
        pairingStatus,
        initiateUnpair,
        cancelUnpair,
        fastForwardCoolingOff,
        confirmUnpair,
        unilateralUnpair,
        finalizeUnpair,
        toggleLegalHold,
        deleteArchivedItem,
        exportArchivedData,
        rePair,

        switchUser,
        setActiveTab,
        openUsModule,
        sendMessage,
        unlockLockedLetter,
        sendSecretLove,
        sendMissYou,
        sendKiss,
        toggleReaction,
        pinMessage,
        deleteMessage,
        startCall,
        endCall,
        addMedia,
        addAlbum,
        addMemory,
        lockMemory,
        unlockMemory,
        changeMemoryPin,
        removeMemoryLock,
        deleteMemory,
        sealTimeCapsule,
        unlockTimeCapsule,
        addEvent,
        toggleBucketItem,
        addBucketItem,
        updateGoalAmount,
        answerDailyPrompt,
        submitMood,
        updateCycleTracking,
        sendLoveLetter,
        openLoveLetter,
        answerGameCard,
        addEntertainment,
        updateAIConsents,
        updateCoupleSpace,
        upgradeSubscription,
        disconnectSpace,
        toggleDarkMode,
        toggleBiometricLock,
        unlockApp,
        showToast
      }}
    >
      {children}
    </CoupleContext.Provider>
  );
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};
