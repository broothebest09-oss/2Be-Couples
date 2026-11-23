import { CoupleSpace, ChatMessage, SharedAlbum, MediaItem, MemoryMilestone, TimeCapsule, CalendarEvent, BucketListItem, GoalItem, DailyPrompt, MoodCheckIn, CycleTracking, LoveLetter, GameCard, EntertainmentItem, AIConsents } from '../types';

export const initialCoupleSpace: CoupleSpace = {
  id: 'couple-space-8842',
  name: "Alex & Maya's Sanctuary",
  code: '2BE-LOVE-779',
  anniversaryDate: '2023-06-18', // ~3+ years
  theme: 'midnight',
  activeSubscription: 'plus',
  subscriptionRenewalDate: '2027-01-18',
  storageUsedMB: 1420,
  storageMaxMB: 10000,
  streakDays: 48,
  createdAt: '2023-06-18T10:00:00Z',
  members: [
    {
      id: 'user-alex',
      name: 'Alex Rivera',
      nickname: 'My Bear 🐻',
      email: 'alex.rivera@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      statusMessage: 'Thinking of you with morning coffee ☕️',
      isOnline: true,
      mood: 'Grateful & energetic ✨',
      batteryLevel: 82,
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
      id: 'user-maya',
      name: 'Maya Chen',
      nickname: 'Sunflower 🌻',
      email: 'maya.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      statusMessage: 'Listening to our vinyl playlist 🎵',
      isOnline: true,
      mood: 'Happy & cozy ☁️',
      batteryLevel: 94,
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

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-alex',
    text: 'Good morning my love! Did you sleep well? ❤️',
    timestamp: '08:15 AM',
    status: 'read',
    reactions: [{ emoji: '🥰', count: 1, users: ['user-maya'] }]
  },
  {
    id: 'msg-2',
    senderId: 'user-maya',
    text: 'Morning sweetheart! Yes, dreamt about that cabin in the woods we saved on our future board 🌲✨',
    timestamp: '08:18 AM',
    status: 'read',
    reactions: [{ emoji: '💖', count: 1, users: ['user-alex'] }]
  },
  {
    id: 'msg-3',
    senderId: 'user-alex',
    text: 'Here is your morning reminder: you are brilliant, and your presentation today is going to blow everyone away!',
    isPinned: true,
    timestamp: '08:20 AM',
    status: 'read',
    reactions: [{ emoji: '🥹', count: 1, users: ['user-maya'] }]
  },
  {
    id: 'msg-4',
    senderId: 'user-maya',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    text: 'Matcha latte brewed with extra love. Grabbing the bakery croissants on the way back!',
    timestamp: '08:24 AM',
    status: 'read',
    reactions: [{ emoji: '🤤', count: 1, users: ['user-alex'] }]
  },
  {
    id: 'msg-5',
    senderId: 'user-alex',
    mediaType: 'audio',
    audioDuration: 7,
    waveform: [15, 30, 45, 80, 60, 40, 90, 75, 45, 60, 85, 30, 15],
    timestamp: '08:26 AM',
    status: 'read',
    reactions: [{ emoji: '❤️', count: 1, users: ['user-maya'] }]
  },
  {
    id: 'msg-6',
    senderId: 'user-maya',
    text: 'Sent you a secret kiss! Check your screen ✨',
    timestamp: '08:30 AM',
    status: 'read',
    reactions: [{ emoji: '💋', count: 1, users: ['user-alex'] }]
  },
  {
    id: 'msg-7',
    senderId: 'user-alex',
    replyTo: {
      id: 'msg-4',
      senderName: 'Maya Chen',
      text: 'Matcha latte brewed with extra love. Grabbing the bakery croissants on the way back!'
    },
    text: 'Please grab two almond croissants too! You are the absolute best ❤️🥐',
    timestamp: '08:32 AM',
    status: 'read',
    reactions: [{ emoji: '🥰', count: 1, users: ['user-maya'] }]
  },
  {
    id: 'msg-8',
    senderId: 'user-maya',
    mediaType: 'document',
    fileName: 'Lake_Como_Villa_Booking_Confirmation.pdf',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    text: 'Here is our reservation confirmation for Lake Como in April! 🇮🇹✨',
    timestamp: '08:35 AM',
    status: 'read',
    reactions: [{ emoji: '🔥', count: 1, users: ['user-alex'] }, { emoji: '❤️', count: 1, users: ['user-maya'] }]
  },
  {
    id: 'msg-9',
    senderId: 'user-maya',
    mediaType: 'locked_letter',
    text: 'A sealed letter waiting for our special anniversary moment 🔒',
    timestamp: '09:00 AM',
    status: 'read',
    reactions: [{ emoji: '❤️', count: 1, users: ['user-alex'] }],
    lockedLetter: {
      id: 'letter-demo-1',
      senderName: 'Maya Chen',
      letterContent: 'My Dearest Alex,\n\nI wrote this letter thinking about how far we have come. From that very first coffee date where we talked for five straight hours until the cafe closed, to building our cozy dream together.\n\nThank you for loving me patiently, holding me gently, and believing in every crazy idea I share with you. Distance is only temporary, but what we are building is forever.\n\nHappy Anniversary, my love!\nAlways yours ❤️',
      conditionType: 'date_time',
      unlockDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      showCountdownToPartner: true,
      isUnlocked: false,
      mediaItems: [
        {
          id: 'p1',
          url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
          isVideo: false
        },
        {
          id: 'p2',
          url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
          isVideo: false
        }
      ]
    }
  }
];

export const initialAlbums: SharedAlbum[] = [
  {
    id: 'album-1',
    title: 'Autumn in Paris',
    coverUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    itemCount: 42,
    createdAt: '2025-10-14'
  },
  {
    id: 'album-2',
    title: 'Sunday Morning Coffee',
    coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    itemCount: 28,
    createdAt: '2026-02-19'
  },
  {
    id: 'album-3',
    title: 'Our Sunlit Home Loft',
    coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    itemCount: 35,
    createdAt: '2025-05-01'
  },
  {
    id: 'album-4',
    title: 'Roadtrip to Big Sur',
    coverUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80',
    itemCount: 64,
    createdAt: '2024-08-11'
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    albumId: 'album-1',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    uploaderId: 'user-alex',
    caption: 'Sunset over Pont Neuf with warm roasted chestnuts.',
    isFavorite: true,
    date: '2025-10-15'
  },
  {
    id: 'med-2',
    albumId: 'album-2',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    uploaderId: 'user-maya',
    caption: 'Lazy Sunday brewing Chemex coffee in our pajamas.',
    isFavorite: true,
    date: '2026-02-19'
  },
  {
    id: 'med-3',
    albumId: 'album-3',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    uploaderId: 'user-alex',
    caption: 'First night with the fairy lights up in the living room!',
    isFavorite: true,
    date: '2025-05-01'
  },
  {
    id: 'med-4',
    albumId: 'album-4',
    url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    uploaderId: 'user-maya',
    caption: 'Windows rolled down, Fleetwood Mac on full blast.',
    isFavorite: false,
    date: '2024-08-11'
  }
];

export const initialMemories: MemoryMilestone[] = [
  {
    id: 'mem-1',
    title: 'The Coffee Shop Serendipity',
    date: '2023-06-18',
    category: 'firsts',
    description: 'We both reached for the last almond croissant at Blue Bottle. You smiled, split it in half, and we talked for 4 hours until the barista turned off the lights.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    likesCount: 2
  },
  {
    id: 'mem-2',
    title: 'First "I Love You" Under the Stars',
    date: '2023-09-22',
    category: 'milestones',
    description: 'Griffith Observatory lawn after midnight. The city below was shimmering and you whispered it first.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    likesCount: 2
  },
  {
    id: 'mem-3',
    title: 'Moving Into Our Sunlit Loft',
    date: '2024-05-01',
    category: 'home',
    description: 'Eating pepperoni pizza off moving boxes with no chairs. The happiest moving day ever.',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    likesCount: 2
  },
  {
    id: 'mem-4',
    title: 'Autumn Rain in Paris',
    date: '2025-10-15',
    category: 'trips',
    description: 'Sharing one yellow umbrella along the Seine, ducking into a jazz cellar when the downpour started.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    likesCount: 2
  }
];

export const initialTimeCapsules: TimeCapsule[] = [
  {
    id: 'cap-1',
    title: 'Our 5th Anniversary Sealed Box',
    creatorId: 'user-alex',
    sealedAt: '2025-06-18',
    unlockDate: '2028-06-18',
    letter: 'To the Maya of five years together: If you are reading this, know that every single day with you has been the greatest adventure of my life. I promised you we would see the aurora borealis, and I hope we have checked that off by now...',
    photos: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    isUnlocked: false
  }
];

export const initialEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Romantic Candlelit Pasta Night',
    date: '2026-11-14',
    time: '19:30',
    location: 'Our Kitchen / Osteria Bella',
    category: 'date',
    createdBy: 'user-alex',
    reminderMinutes: 60,
    notes: 'Alex is making the handmade truffle tagliatelle!'
  },
  {
    id: 'ev-2',
    title: 'Trip to Lake Como 🇮🇹',
    date: '2027-04-10',
    time: '09:00',
    location: 'Bellagio, Lake Como',
    category: 'trip',
    createdBy: 'user-maya',
    reminderMinutes: 1440,
    notes: 'Flights booked! Villa reservation confirmed.'
  },
  {
    id: 'ev-3',
    title: 'Our 4th Anniversary',
    date: '2027-06-18',
    time: 'All Day',
    category: 'anniversary',
    createdBy: 'user-alex',
    reminderMinutes: 2880,
    notes: 'Four incredible years of laughter and growth.'
  }
];

export const initialBucketList: BucketListItem[] = [
  {
    id: 'b-1',
    title: 'Hot air balloon flight at sunrise in Cappadocia',
    category: 'travel',
    isCompleted: true,
    completedDate: '2024-09-12',
    photoUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    addedBy: 'user-maya'
  },
  {
    id: 'b-2',
    title: 'Learn to cook authentic pasta together in Rome',
    category: 'food',
    isCompleted: true,
    completedDate: '2025-04-20',
    photoUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    addedBy: 'user-alex'
  },
  {
    id: 'b-3',
    title: 'See the Northern Lights from a glass igloo in Tromsø',
    category: 'adventure',
    isCompleted: false,
    addedBy: 'user-maya'
  },
  {
    id: 'b-4',
    title: 'Build our own custom ceramic dinner set in pottery class',
    category: 'romantic',
    isCompleted: false,
    addedBy: 'user-alex'
  },
  {
    id: 'b-5',
    title: 'Adopt a golden retriever puppy when we get the backyard',
    category: 'life',
    isCompleted: false,
    addedBy: 'user-maya'
  }
];

export const initialGoals: GoalItem[] = [
  {
    id: 'g-1',
    title: 'Lake Como Vacation Fund',
    targetAmount: 4000,
    currentAmount: 3200,
    targetDate: '2027-03-31',
    isCompleted: false,
    category: 'savings'
  },
  {
    id: 'g-2',
    title: 'Loft Terrace Garden Setup',
    targetAmount: 800,
    currentAmount: 800,
    targetDate: '2026-05-01',
    isCompleted: true,
    category: 'home'
  }
];

export const initialDailyPrompt: DailyPrompt = {
  id: 'prompt-today',
  date: '2026-11-12',
  question: 'What is one subtle, unspoken thing your partner does that always makes you feel deeply loved?',
  partner1Answer: 'When Maya gently fixes the collar of my coat before we step out into the cold, or slips her cold fingers into my warm jacket pocket.',
  partner2Answer: 'When Alex leaves the morning coffee on my nightstand with the mug handle pointed toward my hand, perfectly timed just as my alarm goes off.'
};

export const initialMoods: Record<string, MoodCheckIn> = {
  'user-alex': {
    id: 'mood-alex-today',
    userId: 'user-alex',
    date: '2026-11-12',
    moodLevel: 5,
    moodEmoji: '🥰',
    feelingTags: ['Grateful', 'Excited', 'Connected'],
    wantsComfortOrSpace: 'comfort',
    supportNote: 'Looking forward to our dinner date tonight!',
    isSharedWithPartner: true
  },
  'user-maya': {
    id: 'mood-maya-today',
    userId: 'user-maya',
    date: '2026-11-12',
    moodLevel: 4,
    moodEmoji: '✨',
    feelingTags: ['Creative', 'A bit busy', 'Happy'],
    wantsComfortOrSpace: 'comfort',
    supportNote: 'Presentation went great! Ready for cuddles.',
    isSharedWithPartner: true
  }
};

export const initialCycleTracking: CycleTracking = {
  enabled: true,
  lastPeriodStart: '2026-11-01',
  periodLengthDays: 5,
  cycleLengthDays: 28,
  symptoms: ['Mild fatigue', 'Craving dark chocolate'],
  energyLevel: 'high',
  privateNotes: 'Ovulation phase window. Feeling energized and happy.',
  shareWithPartner: true,
  shareReminders: true
};

export const initialLoveLetters: LoveLetter[] = [
  {
    id: 'letter-1',
    senderId: 'user-alex',
    title: 'The Light You Bring Into My Days',
    body: `My dearest Maya,

I woke up earlier than usual today and just watched the sunrise paint the living room walls in soft apricot and violet. You were still sleeping with that peaceful, gentle breath.

I caught myself thinking about how much lighter my whole existence feels since you stepped into it. Even the mundane things—doing the grocery run, waiting for the kettle to boil, getting stuck in city traffic—turn into little moments of magic because you are in my corner.

Thank you for choosing me every single day. I will always protect your smile.

With all my devotion,`,
    signature: 'Yours forever, Alex',
    stationery: 'vintage',
    sealColor: '#E0A96D',
    isOpened: true,
    deliveredAt: '2026-10-18T09:00:00Z',
    readAt: '2026-10-18T09:15:00Z'
  },
  {
    id: 'letter-2',
    senderId: 'user-maya',
    title: 'A Little Secret for You',
    body: `My darling Alex,

Whenever people ask me when I knew you were the one, I never mention a grand gesture. I think about that rainy Tuesday when I had the flu, and you sat on the floor next to my bed reading that fantasy book out loud in silly voices just to make me smile between naps.

You are my safest harbor and my wild excitement all in one. Can’t wait for tonight.`,
    signature: 'Forever your Maya 🌻',
    stationery: 'midnight',
    sealColor: '#F472B6',
    isOpened: true,
    deliveredAt: '2026-11-10T12:00:00Z',
    readAt: '2026-11-10T12:30:00Z'
  }
];

export const initialGameCards: GameCard[] = [
  {
    id: 'game-1',
    type: 'truth',
    category: 'romantic',
    prompt: 'What was the exact moment you realized you were truly in love with me?',
    partner1Response: 'When you sang off-key to ABBA in the car and didn’t care at all. You were glowing.',
    partner2Response: 'When you stayed awake with me while I panicked over my thesis submission and made tea at 3 AM.'
  },
  {
    id: 'game-2',
    type: 'would_you_rather',
    category: 'playful',
    prompt: 'Would you rather spend a week in an isolated cabin in snowstorm or on a private tropical beach?',
    options: ['Snowy mountain cabin with fireplace ❄️', 'Private tropical beach with hammocks 🏝️'],
    partner1Response: 'Snowy mountain cabin with fireplace ❄️',
    partner2Response: 'Snowy mountain cabin with fireplace ❄️'
  },
  {
    id: 'game-3',
    type: 'quiz',
    category: 'deep',
    prompt: 'Guess my comfort food when I have had a stressful day!',
    options: ['Extra-cheese truffle mac & cheese', 'Spicy ramen with soft-boiled egg', 'Chocolate fudge brownie sundae'],
    partner1Response: 'Spicy ramen with soft-boiled egg',
    partner2Response: 'Spicy ramen with soft-boiled egg'
  },
  {
    id: 'game-4',
    type: 'dare',
    category: 'spicy',
    prompt: 'Give your partner a 60-second slow shoulder massage without saying a single word, ending with a kiss on the cheek.',
    partner1Response: 'Challenge accepted & delivered 🥰',
    partner2Response: '10/10 rating ❤️'
  }
];

export const initialEntertainment: EntertainmentItem[] = [
  {
    id: 'ent-1',
    type: 'song',
    title: 'Texas Sun',
    subtitle: 'Leon Bridges & Khruangbin',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    note: 'Our official driving song on Highway 1. Brings instant goosebumps!',
    sharedBy: 'user-alex',
    sharedAt: 'Today, 09:15 AM',
    isWatchedOrHeard: true,
    externalUrl: 'https://open.spotify.com'
  },
  {
    id: 'ent-2',
    type: 'movie',
    title: 'Past Lives (2023)',
    subtitle: 'Romantic Drama • 1h 45m',
    coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80',
    note: 'Selected for our Saturday movie night couch date!',
    sharedBy: 'user-maya',
    sharedAt: 'Yesterday',
    isWatchedOrHeard: false
  },
  {
    id: 'ent-3',
    type: 'playlist',
    title: 'Cozy Morning Vinyl Vibes',
    subtitle: '24 songs • 1 hr 22 min',
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
    note: 'Our shared playlist for coffee and scrambled eggs.',
    sharedBy: 'user-maya',
    sharedAt: '3 days ago',
    isWatchedOrHeard: true
  }
];

export const initialAIConsents: AIConsents = {
  allowMessageDrafting: true,
  allowDatePlanning: true,
  allowMemoryBooks: true,
  allowHealthContext: false, // Strict default privacy
  allowIntimateMediaScanning: false // Denied by default
};
