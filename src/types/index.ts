export type UserRole = 'partner1' | 'partner2';

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  statusMessage: string;
  isOnline: boolean;
  lastSeen?: string;
  mood?: string;
  batteryLevel?: number;
  loveLanguage?: {
    primary: string;
    scores: Record<string, number>;
  };
}

export interface CoupleSpace {
  id: string;
  name: string;
  code: string;
  anniversaryDate: string; // YYYY-MM-DD
  members: [User, User];
  theme: 'midnight' | 'lavender' | 'rosegold' | 'dusk';
  activeSubscription: 'free' | 'plus' | 'premium';
  subscriptionRenewalDate?: string;
  storageUsedMB: number;
  storageMaxMB: number;
  streakDays: number;
  createdAt: string;
}

export interface LockedLetterPayload {
  id: string;
  senderName: string;
  letterContent: string;
  mediaItems?: { id: string; url: string; isVideo?: boolean; durationText?: string }[];
  conditionType: 'date_time' | 'after_action' | 'location';
  unlockDateTime?: string; // ISO string or formatted
  targetActionType?: 'kisses' | 'hugs' | 'snaps' | 'messages';
  targetActionCount?: number;
  currentActionCount?: number;
  locationName?: string;
  locationRadiusMeters?: number;
  currentDistanceMeters?: number;
  showCountdownToPartner?: boolean;
  isUnlocked?: boolean;
  openedAtDateText?: string;
  createdAtText?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'locked_letter';
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  audioDuration?: number; // seconds
  waveform?: number[];
  isViewOnce?: boolean;
  viewOnceOpened?: boolean;
  viewOnceTimer?: number; // seconds (e.g. 5)
  reactions: { emoji: string; count: number; users: string[] }[];
  isPinned?: boolean;
  isBookmarked?: boolean;
  replyTo?: { id: string; senderName: string; text: string; mediaType?: string };
  lockedLetter?: LockedLetterPayload;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface SharedAlbum {
  id: string;
  title: string;
  coverUrl: string;
  itemCount: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  albumId?: string;
  url: string;
  type: 'image' | 'video';
  uploaderId: string;
  caption?: string;
  isFavorite: boolean;
  date: string;
  isViewOnce?: boolean;
}

export interface MemoryMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  category: 'firsts' | 'trips' | 'milestones' | 'home' | 'anniversaries';
  likesCount: number;
  isLocked?: boolean;
  pinRequired?: boolean;
  unlockPin?: string;
  lockedAtDateText?: string;
  failedPinAttempts?: number;
  lockedUntilTimestamp?: number;
}

export interface TimeCapsule {
  id: string;
  title: string;
  letter: string;
  creatorId: string;
  unlockDate: string;
  photos: string[];
  isUnlocked: boolean;
  sealedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  category: 'date' | 'anniversary' | 'trip' | 'appointment' | 'reminder';
  createdBy: string;
  reminderMinutes: number;
  notes?: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'travel' | 'adventure' | 'romantic' | 'food' | 'life';
  isCompleted: boolean;
  completedDate?: string;
  photoUrl?: string;
  addedBy: string;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  isCompleted: boolean;
  category: 'savings' | 'health' | 'home' | 'adventure';
}

export interface DailyPrompt {
  id: string;
  date: string;
  question: string;
  partner1Answer?: string;
  partner2Answer?: string;
}

export interface MoodCheckIn {
  id: string;
  userId: string;
  date: string;
  moodLevel: number; // 1 to 5
  moodEmoji: string;
  feelingTags: string[];
  wantsComfortOrSpace: 'comfort' | 'space' | 'just_listen' | 'distraction';
  supportNote?: string;
  isSharedWithPartner: boolean;
}

export interface CycleTracking {
  enabled: boolean;
  lastPeriodStart: string; // YYYY-MM-DD
  periodLengthDays: number;
  cycleLengthDays: number;
  symptoms: string[];
  energyLevel: 'low' | 'moderate' | 'high';
  privateNotes: string;
  shareWithPartner: boolean;
  shareReminders: boolean;
}

export interface LoveLetter {
  id: string;
  senderId: string;
  title: string;
  body: string;
  stationery: 'vintage' | 'midnight' | 'rose' | 'minimal';
  signature: string;
  sealColor: string;
  audioUrl?: string;
  scheduledDeliveryDate?: string;
  isOpened: boolean;
  deliveredAt: string;
  readAt?: string;
}

export interface GameCard {
  id: string;
  type: 'truth' | 'dare' | 'would_you_rather' | 'quiz' | 'never_have_i_ever';
  category: 'romantic' | 'playful' | 'deep' | 'spicy';
  prompt: string;
  options?: string[];
  partner1Response?: string;
  partner2Response?: string;
}

export interface EntertainmentItem {
  id: string;
  type: 'song' | 'movie' | 'playlist' | 'link';
  title: string;
  subtitle?: string;
  coverUrl?: string;
  note?: string;
  sharedBy: string;
  sharedAt: string;
  isWatchedOrHeard?: boolean;
  externalUrl?: string;
}

export interface AIConsents {
  allowMessageDrafting: boolean;
  allowDatePlanning: boolean;
  allowMemoryBooks: boolean;
  allowHealthContext: boolean; // default false
  allowIntimateMediaScanning: boolean; // default false
}

export type UnpairStatus =
  | 'none'
  | 'cooling_off'
  | 'confirmation_pending'
  | 'dissolved'
  | 'cancelled';

export interface UnpairRequest {
  id: string;
  initiatorId: string;
  initiatorName: string;
  partnerId: string;
  partnerName: string;
  requestedAt: number;
  coolingOffEndsAt: number;
  confirmationDeadline: number;
  status: UnpairStatus;
  userConfirmed: boolean;
  partnerConfirmed: boolean;
  cancelledBy?: string;
  cancellationReason?: string;
  isUnilateralInactivity?: boolean;
  immediateAccountDeletion?: boolean;
}

export interface ArchivedDataRecord {
  id: string;
  archivedAt: string;
  formerPartner: {
    id: string;
    name: string;
    avatar: string;
    nicknameGiven: string;
  };
  archivedMessages: ChatMessage[];
  archivedMemories: MemoryMilestone[];
  archivedGratitude: {
    ownNotes: string[];
    partnerArchivedNotes: string[];
  };
  archivedBucketList: {
    ownItems: BucketListItem[];
    partnerArchivedItems: BucketListItem[];
  };
  archivedCycle?: {
    preserved: boolean;
    isHer: boolean;
    cycleData?: CycleTracking;
  };
  archivedStats: {
    lifetimeKissesSent: number;
    lifetimeHugsSent: number;
    sharedKissesArchive: number;
    sharedHugsArchive: number;
    longestStreakDays: number;
    daysTogether: number;
  };
  legalHold: boolean;
}
