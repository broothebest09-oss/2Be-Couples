import { CoupleSpace, ChatMessage, SharedAlbum, MediaItem, MemoryMilestone, TimeCapsule, CalendarEvent, BucketListItem, GoalItem, DailyPrompt, MoodCheckIn, CycleTracking, LoveLetter, GameCard, EntertainmentItem, AIConsents } from '../types';

export const initialCoupleSpace: CoupleSpace = {
  id: 'couple-space-new',
  name: "Our Sanctuary",
  code: '2BE-' + Math.floor(1000 + Math.random() * 9000),
  anniversaryDate: new Date().toISOString().split('T')[0],
  theme: 'midnight',
  activeSubscription: 'plus',
  subscriptionRenewalDate: '2027-01-01',
  storageUsedMB: 0,
  storageMaxMB: 10000,
  streakDays: 1,
  createdAt: new Date().toISOString(),
  members: [
    {
      id: 'user-me',
      name: 'You',
      nickname: 'You',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      statusMessage: 'Connected in 2Be 💕',
      isOnline: true,
      mood: 'Happy & in love ✨',
      batteryLevel: 100,
      loveLanguage: {
        primary: 'Quality Time',
        scores: {
          'Quality Time': 40,
          'Words of Affirmation': 25,
          'Physical Touch': 20,
          'Acts of Service': 10,
          'Receiving Gifts': 5,
        }
      }
    },
    {
      id: 'user-partner',
      name: 'Partner',
      nickname: 'My Love',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      statusMessage: 'With you always 💖',
      isOnline: true,
      mood: 'Grateful & cozy ☁️',
      batteryLevel: 100,
      loveLanguage: {
        primary: 'Words of Affirmation',
        scores: {
          'Words of Affirmation': 45,
          'Quality Time': 30,
          'Physical Touch': 15,
          'Acts of Service': 7,
          'Receiving Gifts': 3,
        }
      }
    }
  ]
};

export const initialMessages: ChatMessage[] = [];

export const initialAlbums: SharedAlbum[] = [];

export const initialMedia: MediaItem[] = [];

export const initialMemories: MemoryMilestone[] = [];

export const initialTimeCapsules: TimeCapsule[] = [];

export const initialEvents: CalendarEvent[] = [];

export const initialBucketList: BucketListItem[] = [];

export const initialGoals: GoalItem[] = [];

export const initialDailyPrompt: DailyPrompt = {
  id: 'prompt-1',
  date: new Date().toISOString().split('T')[0],
  question: 'What is one moment with you this week that made me genuinely smile?'
};

export const initialMoods: Record<string, MoodCheckIn> = {};

export const initialCycleTracking: CycleTracking = {
  enabled: false,
  lastPeriodStart: new Date().toISOString().split('T')[0],
  periodLengthDays: 5,
  cycleLengthDays: 28,
  symptoms: [],
  energyLevel: 'moderate',
  privateNotes: '',
  shareWithPartner: false,
  shareReminders: false
};

export const initialLoveLetters: LoveLetter[] = [];

export const initialGameCards: GameCard[] = [];

export const initialEntertainment: EntertainmentItem[] = [];

export const initialAIConsents: AIConsents = {
  allowMessageDrafting: true,
  allowDatePlanning: true,
  allowMemoryBooks: true,
  allowHealthContext: false,
  allowIntimateMediaScanning: false
};
