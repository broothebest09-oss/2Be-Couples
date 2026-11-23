export function getDaysTogether(anniversaryDate: string): number {
  const start = new Date(anniversaryDate).getTime();
  const now = new Date().getTime();
  const diffTime = Math.abs(now - start);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export function getCountdown(targetDateString: string): { days: number; hours: number; minutes: number } {
  try {
    const target = new Date(targetDateString).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  } catch {
    return { days: 0, hours: 0, minutes: 0 };
  }
}

export interface CyclePhaseInfo {
  currentDay: number;
  phaseName: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
  description: string;
  comfortTips: string[];
  partnerAdvice: string;
}

export function calculateCyclePhase(lastPeriodStart: string, cycleLengthDays: number = 28): CyclePhaseInfo {
  const start = new Date(lastPeriodStart).getTime();
  const now = new Date().getTime();
  const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const currentDay = ((daysSince % cycleLengthDays) + cycleLengthDays) % cycleLengthDays + 1;

  if (currentDay <= 5) {
    return {
      currentDay,
      phaseName: 'Menstrual',
      description: 'Rest and replenishment phase. Energy may be naturally lower.',
      comfortTips: ['Warm tea & hot water bottle', 'Gentle stretching', 'Extra sleep & gentle hydration'],
      partnerAdvice: 'Offer gentle back rubs, warm drinks, and quiet cozy comfort without pressure.'
    };
  } else if (currentDay <= 11) {
    return {
      currentDay,
      phaseName: 'Follicular',
      description: 'Energy is rising, creativity and motivation are peaking.',
      comfortTips: ['Active date nights', 'Exploring new hobbies', 'High energy adventures'],
      partnerAdvice: 'Great time to plan exciting date outings, workouts together, and future dream sessions!'
    };
  } else if (currentDay <= 16) {
    return {
      currentDay,
      phaseName: 'Ovulation',
      description: 'Peak confidence, vibrancy, and high social energy window.',
      comfortTips: ['Celebrate love & romance', 'Dress up for candlelit dinners', 'Express verbal appreciation'],
      partnerAdvice: 'Peak connection window! Plan romantic gestures and affectionate quality time.'
    };
  } else {
    return {
      currentDay,
      phaseName: 'Luteal',
      description: 'Winding down phase. Focus on nesting, grounding, and self-care.',
      comfortTips: ['Comfort food & sweet treats', 'Warm baths & low sensory lights', 'Cozy movie marathons'],
      partnerAdvice: 'Be patient, listen actively, take care of household tasks, and offer reassurance.'
    };
  }
}
