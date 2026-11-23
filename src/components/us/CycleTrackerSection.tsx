import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield,
  Sparkles,
  Lock,
  Gift,
  Lightbulb,
  Check,
  Settings,
  Bell,
  Activity,
  Smile,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCouple } from '../../context/CoupleContext';

export interface SymptomLog {
  date: string; // YYYY-MM-DD
  mood?: 'happy' | 'calm' | 'anxious' | 'irritable' | 'sad' | 'tired';
  pain?: 'none' | 'mild' | 'moderate' | 'severe';
  energy?: 'low' | 'medium' | 'high';
  flow?: 'spotting' | 'light' | 'medium' | 'heavy';
  notes?: string;
}

export const CycleTrackerSection: React.FC = () => {
  const { currentUser, partnerUser, showToast } = useCouple();

  // Perspective: 'her' or 'partner'
  const [perspective, setPerspective] = useState<'her' | 'partner'>('her');

  // Cycle settings
  const [settings, setSettings] = useState({
    isConfigured: true,
    lastPeriodStartDate: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    lastPeriodEndDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    avgCycleLength: 28,
    avgPeriodLength: 5,
    notifyRemindLog: true,
    notifyPartnerPhaseChanges: true
  });

  // Calendar State
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Symptoms record map
  const [symptomsMap, setSymptomsMap] = useState<Record<string, SymptomLog>>({
    [new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0]]: {
      date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
      mood: 'tired',
      pain: 'moderate',
      energy: 'low',
      flow: 'medium',
      notes: 'Morning cramps, warm tea helped significantly.'
    },
    [new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0]]: {
      date: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
      mood: 'calm',
      pain: 'mild',
      energy: 'medium',
      flow: 'light',
      notes: 'Feeling relaxed and peaceful.'
    },
    [todayStr]: {
      date: todayStr,
      mood: 'happy',
      pain: 'none',
      energy: 'high',
      notes: 'Feeling radiant, creative, and excited for dinner!'
    }
  });

  // Dialog Modals
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showSymptomsModal, setShowSymptomsModal] = useState(false);
  const [showCarePackageModal, setShowCarePackageModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Care package selection
  const careGifts = [
    { id: '1', emoji: '☕', name: 'Warm Cocoa', desc: 'Hot chocolate with marshmallows' },
    { id: '2', emoji: '💐', name: 'Fresh Peonies', desc: 'Handpicked sweet flowers' },
    { id: '3', emoji: '🫂', name: 'Warm Hugs', desc: 'Endless gentle grounding cuddles' },
    { id: '4', emoji: '💋', name: 'Forehead Kisses', desc: '100 soft reassuring kisses' },
    { id: '5', emoji: '💆‍♀️', name: 'Foot & Back Rub', desc: 'Relieving massage on demand' },
    { id: '6', emoji: '🍵', name: 'Chamomile Tea', desc: 'Calming bedtime blend' },
    { id: '7', emoji: '🍫', name: 'Dark Chocolate', desc: 'Sweet comforting endorphins' },
    { id: '8', emoji: '🧸', name: 'Heating Pad', desc: 'Cozy soothing warmth' }
  ];
  const [selectedCareGifts, setSelectedCareGifts] = useState<string[]>(['1', '3', '4']);
  const [carePackageNote, setCarePackageNote] = useState(
    "Thinking of you my love! Take all the rest you need today, I'm here for you 💕"
  );

  // Symptoms Modal Temp State
  const [tempMood, setTempMood] = useState<SymptomLog['mood'] | undefined>();
  const [tempPain, setTempPain] = useState<SymptomLog['pain'] | undefined>();
  const [tempEnergy, setTempEnergy] = useState<SymptomLog['energy'] | undefined>();
  const [tempFlow, setTempFlow] = useState<SymptomLog['flow'] | undefined>();
  const [tempNotes, setTempNotes] = useState('');

  // Calculations
  const calculateCycleDay = (dateStr: string) => {
    const start = new Date(settings.lastPeriodStartDate).getTime();
    const current = new Date(dateStr).getTime();
    const diffDays = Math.floor((current - start) / 86400000);
    const day = (((diffDays % settings.avgCycleLength) + settings.avgCycleLength) % settings.avgCycleLength) + 1;
    return day;
  };

  const getPhaseForDate = (dateStr: string) => {
    const cycleDay = calculateCycleDay(dateStr);
    const ovulationDay = settings.avgCycleLength - 14;

    if (cycleDay <= settings.avgPeriodLength) {
      return {
        key: 'menstruation',
        title: 'Menstruation',
        emoji: '🩸',
        color: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-500/15',
        herText: 'Your body is resetting. Rest, stay warm, and take it slow today.',
        partnerContext: 'She might need extra love and patience today. Common symptoms include cramps, fatigue, and tender emotions.',
        tips: [
          'Bring her a warm drink or heating pad without having to ask.',
          'Run her a warm bath or offer a gentle back/foot rub.',
          'Take care of dinner or chores to give her space to rest.',
          'Offer extra cuddles or gentle quiet time together.'
        ]
      };
    } else if (cycleDay < ovulationDay - 3) {
      return {
        key: 'follicular',
        title: 'Follicular Phase',
        emoji: '🌱',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/15',
        herText: 'Energy and creativity are rising! Great time for new projects and fun dates.',
        partnerContext: 'Her energy, optimism, and motivation are naturally climbing. She may feel adventurous and enthusiastic.',
        tips: [
          'Plan a fun date night, outdoor walk, or exciting activity.',
          'Encourage her new creative ideas and passions.',
          'Try cooking a fresh, vibrant meal together.'
        ]
      };
    } else if (cycleDay <= ovulationDay + 2) {
      return {
        key: 'ovulation',
        title: 'Ovulation',
        emoji: '✨',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/15',
        herText: 'Peak confidence, connection, and glow! High energy and sociability.',
        partnerContext: 'Peak warmth, confidence, and mutual closeness. She often feels vibrant, magnetic, and socially engaged.',
        tips: [
          'Shower her with heartfelt compliments.',
          'Plan a romantic evening or special dinner out.',
          'Take beautiful photos of her glowing moments.'
        ]
      };
    } else {
      return {
        key: 'luteal',
        title: 'Luteal Phase',
        emoji: '🌙',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-500/15',
        herText: 'Winding down. You might crave comfort foods, cozy spaces, and deep relaxation.',
        partnerContext: 'Energy begins to mellow. She may experience pre-menstrual sensitivity, cravings, or need grounding comfort.',
        tips: [
          'Stock her favorite comfort snacks and sweet treats.',
          'Be an attentive, validating listener without jumping to fix things.',
          'Create a peaceful, cozy environment at home.'
        ]
      };
    }
  };

  const currentPhase = getPhaseForDate(todayStr);
  const selectedDayPhase = getPhaseForDate(selectedDate);
  const currentCycleDay = calculateCycleDay(todayStr);

  const getNextPeriodDays = () => {
    const start = new Date(settings.lastPeriodStartDate).getTime();
    const today = new Date().getTime();
    const lengthMs = settings.avgCycleLength * 86400000;
    let nextStart = start;
    while (nextStart <= today) {
      nextStart += lengthMs;
    }
    return Math.ceil((nextStart - today) / 86400000);
  };
  const nextPeriodDays = getNextPeriodDays();

  // Fertile window string
  const getFertileWindowDates = () => {
    const start = new Date(settings.lastPeriodStartDate);
    const ovulationDay = settings.avgCycleLength - 14;
    const fertileStart = new Date(start.getTime() + (ovulationDay - 5) * 86400000);
    const fertileEnd = new Date(start.getTime() + (ovulationDay + 1) * 86400000);
    const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${format(fertileStart)} – ${format(fertileEnd)}`;
  };

  // Calendar Day Generators
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(currentYearMonth.year, currentYearMonth.month);
  const firstDayIndex = getFirstDayOfMonth(currentYearMonth.year, currentYearMonth.month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleOpenSymptoms = (date: string) => {
    setSelectedDate(date);
    const existing = symptomsMap[date];
    setTempMood(existing?.mood);
    setTempPain(existing?.pain);
    setTempEnergy(existing?.energy);
    setTempFlow(existing?.flow);
    setTempNotes(existing?.notes || '');
    setShowSymptomsModal(true);
  };

  const handleSaveSymptoms = () => {
    setSymptomsMap((prev) => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        mood: tempMood,
        pain: tempPain,
        energy: tempEnergy,
        flow: tempFlow,
        notes: tempNotes.trim()
      }
    }));
    setShowSymptomsModal(false);
    showToast('Symptoms logged securely 🌸');
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-4 pb-28 pt-1 max-w-md mx-auto">
      {/* ======================================================== */}
      {/* TOP BAR: Title & Perspective Switcher                    */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
            <span>🌸</span>
            <span>Cycle Tracker</span>
          </h2>
          <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
            {perspective === 'her' ? 'Her private tracking & rhythm' : 'Supportive partner insights'}
          </p>
        </div>

        <button
          onClick={() => setShowSetupModal(true)}
          className="p-2 rounded-xl bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578] dark:text-[#A89598] hover:text-[#9B4D6F] transition"
          title="Cycle Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Control: Her View vs Partner View */}
      <div className="flex rounded-full bg-[#FFF4E6] dark:bg-[#261E21] p-1 border border-[#F0DFE3] dark:border-[#3D2F34]">
        <button
          onClick={() => setPerspective('her')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${
            perspective === 'her'
              ? 'bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white shadow-sm'
              : 'text-[#4A3B40] dark:text-[#A89598] hover:text-[#140C0F]'
          }`}
        >
          Her View 🌸
        </button>
        <button
          onClick={() => setPerspective('partner')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${
            perspective === 'partner'
              ? 'bg-[#8C244F] text-white shadow-sm'
              : 'text-[#4A3B40] dark:text-[#A89598] hover:text-[#140C0F]'
          }`}
        >
          Partner View (for him) 💙
        </button>
      </div>

      {/* ======================================================== */}
      {/* REGION 1: STATUS CARD                                    */}
      {/* ======================================================== */}
      <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] flex items-center justify-center text-xl">
              {currentPhase.emoji}
            </div>
            <div>
              <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                Currently: {currentPhase.title}
              </div>
              <div className="text-xs font-semibold text-[#9B4D6F] dark:text-[#E8A5B9]">
                Day {currentCycleDay} of {settings.avgCycleLength}-day cycle
              </div>
            </div>
          </div>

          <div className="text-right px-2.5 py-1 rounded-xl bg-[#FFF4E6] dark:bg-[#33282C]">
            <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">Next Period</div>
            <div className="text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
              In {nextPeriodDays} days
            </div>
          </div>
        </div>

        {/* Fertile Window Row */}
        <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] text-xs">
          <span className="flex items-center gap-1.5 text-[#2D1F24] dark:text-[#F5E6EA] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#E8A5B9]" />
            Fertile Window
          </span>
          <span className="font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
            {getFertileWindowDates()}
          </span>
        </div>

        {/* Dynamic Context text */}
        <p className="mt-2.5 text-xs text-[#8B7578] dark:text-[#A89598] leading-relaxed">
          {perspective === 'her' ? currentPhase.herText : currentPhase.partnerContext}
        </p>
      </div>

      {/* ======================================================== */}
      {/* REGION 2: MONTHLY CALENDAR VIEW                          */}
      {/* ======================================================== */}
      <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft">
        {/* Calendar Month Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (currentYearMonth.month === 0) {
                setCurrentYearMonth({ year: currentYearMonth.year - 1, month: 11 });
              } else {
                setCurrentYearMonth({ year: currentYearMonth.year, month: currentYearMonth.month - 1 });
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
              {monthNames[currentYearMonth.month]} {currentYearMonth.year}
            </span>
            <button
              onClick={() => {
                const now = new Date();
                setCurrentYearMonth({ year: now.getFullYear(), month: now.getMonth() });
                setSelectedDate(todayStr);
              }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8A5B9]/20 text-[#9B4D6F] dark:text-[#E8A5B9]"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => {
              if (currentYearMonth.month === 11) {
                setCurrentYearMonth({ year: currentYearMonth.year + 1, month: 0 });
              } else {
                setCurrentYearMonth({ year: currentYearMonth.year, month: currentYearMonth.month + 1 });
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#8B7578] dark:text-[#A89598] mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(currentYearMonth.month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateStr = `${currentYearMonth.year}-${monthStr}-${dayStr}`;

            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const dayPhase = getPhaseForDate(dateStr);
            const cycleDay = calculateCycleDay(dateStr);
            const isPeriod = cycleDay <= settings.avgPeriodLength;
            const ovulationDay = settings.avgCycleLength - 14;
            const isOvulation = cycleDay === ovulationDay;
            const isFertile = cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1;
            const hasLog = !!symptomsMap[dateStr];

            // Predicted next period (next cycle start)
            const daysFromToday = Math.floor((new Date(dateStr).getTime() - new Date(todayStr).getTime()) / 86400000);
            const isPredictedPeriod =
              !isPeriod &&
              daysFromToday >= nextPeriodDays &&
              daysFromToday < nextPeriodDays + settings.avgPeriodLength;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-10 rounded-full flex flex-col items-center justify-center relative text-xs transition min-w-[36px] ${
                  isPeriod
                    ? 'bg-rose-500 text-white font-bold'
                    : isOvulation
                    ? 'bg-[#9B4D6F] text-white font-bold'
                    : isFertile
                    ? 'bg-pink-300/40 dark:bg-pink-900/30 text-[#2D1F24] dark:text-[#F5E6EA] font-semibold'
                    : isSelected
                    ? 'bg-[#E8A5B9]/25 text-[#2D1F24] dark:text-white font-semibold'
                    : 'text-[#2D1F24] dark:text-[#F5E6EA] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C]'
                } ${isToday ? 'ring-2 ring-[#9B4D6F]' : ''} ${
                  isPredictedPeriod && !isPeriod ? 'border-2 border-dashed border-rose-400' : ''
                }`}
              >
                <span>{dayNum}</span>
                {hasLog && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isPeriod || isOvulation ? 'bg-white' : 'bg-[#9B4D6F]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-around pt-2 border-t border-[#F0DFE3] dark:border-[#3D2F34] text-[11px] text-[#8B7578] dark:text-[#A89598]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Period</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
            <span>Fertile</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9B4D6F]" />
            <span>Ovulation</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-rose-400" />
            <span>Predicted</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REGION 3: SELECTED DAY DETAILS CARD                      */}
      {/* ======================================================== */}
      <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-[11px] text-[#9B4D6F] dark:text-[#E8A5B9] font-medium">
              {selectedDayPhase.emoji} {selectedDayPhase.title} • Cycle Day {calculateCycleDay(selectedDate)}
            </div>
          </div>

          {perspective === 'her' && (
            <button
              onClick={() => handleOpenSymptoms(selectedDate)}
              className="px-3 py-1.5 rounded-full bg-[#E8A5B9]/20 hover:bg-[#E8A5B9]/30 text-[#9B4D6F] dark:text-[#E8A5B9] text-xs font-bold transition"
            >
              {symptomsMap[selectedDate] ? 'Edit Log ✏️' : 'Log Day 🌸'}
            </button>
          )}
        </div>

        {perspective === 'her' ? (
          symptomsMap[selectedDate] ? (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {symptomsMap[selectedDate].mood && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E6] dark:bg-[#33282C] text-xs font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                    Mood: {symptomsMap[selectedDate].mood}
                  </span>
                )}
                {symptomsMap[selectedDate].pain && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-600 dark:text-rose-400">
                    Pain: {symptomsMap[selectedDate].pain}
                  </span>
                )}
                {symptomsMap[selectedDate].energy && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-xs font-medium text-amber-600 dark:text-amber-400">
                    Energy: {symptomsMap[selectedDate].energy}
                  </span>
                )}
                {symptomsMap[selectedDate].flow && (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-xs font-medium text-purple-600 dark:text-purple-400">
                    Flow: {symptomsMap[selectedDate].flow}
                  </span>
                )}
              </div>
              {symptomsMap[selectedDate].notes && (
                <p className="text-xs italic text-[#8B7578] dark:text-[#A89598] bg-[#FFF9F5] dark:bg-[#1A1416] p-2 rounded-xl">
                  "{symptomsMap[selectedDate].notes}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-2">
              No symptoms logged for this date.
            </p>
          )
        ) : (
          <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-2 leading-relaxed">
            {selectedDayPhase.partnerContext}
          </p>
        )}
      </div>

      {/* ======================================================== */}
      {/* REGION 4: ACTIONS (Her Quick Log vs Partner Care Actions) */}
      {/* ======================================================== */}
      {perspective === 'her' ? (
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
            Quick Logging
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSettings((prev) => ({ ...prev, lastPeriodStartDate: todayStr }));
                showToast('Period start logged for today! 🩸');
                try {
                  confetti({ particleCount: 20, spread: 40 });
                } catch (e) {}
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>🩸</span>
              <span>Period Started</span>
            </button>

            <button
              onClick={() => {
                setSettings((prev) => ({ ...prev, lastPeriodEndDate: todayStr }));
                showToast('Period end logged for today! 🌸');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA] hover:bg-[#FCEAD4] font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>🌸</span>
              <span>Period Ended</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenSymptoms(todayStr)}
            className="w-full py-2.5 rounded-xl bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs shadow-soft flex items-center justify-center gap-1.5 transition"
          >
            <span>📝</span>
            <span>Log Symptoms for Today</span>
          </button>
        </div>
      ) : (
        /* PARTNER VIEW ACTIONS */
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
              Support {partnerUser.name.split(' ')[0]}
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-[#9B4D6F] dark:text-[#E8A5B9]">
              <Lock className="w-3 h-3" />
              Privacy Shield Active
            </span>
          </div>

          <p className="text-xs text-[#8B7578] dark:text-[#A89598] leading-relaxed">
            Detailed symptom records are private to her. Here are thoughtful gestures to support and brighten her day:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowCarePackageModal(true)}
              className="py-2.5 px-3 rounded-xl bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition"
            >
              <Gift className="w-4 h-4" />
              <span>Send Care Package</span>
            </button>

            <button
              onClick={() => setShowTipsModal(true)}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#261E21] border border-[#9B4D6F] text-[#9B4D6F] dark:text-[#E8A5B9] hover:bg-[#FFF4E6] dark:hover:bg-[#33282C] font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Lightbulb className="w-4 h-4" />
              <span>View Tips</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REGION 5: PREDICTIONS SECTION                            */}
      {/* ======================================================== */}
      <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft space-y-3">
        <div>
          <h3 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
            Predictions & Statistics
          </h3>
          <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
            Based on your last 3 cycles:
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416]">
            <div className="text-sm font-bold text-[#E8A5B9]">
              {settings.avgCycleLength} days
            </div>
            <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">Avg Cycle</div>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416]">
            <div className="text-sm font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
              {settings.avgPeriodLength} days
            </div>
            <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">Avg Period</div>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416]">
            <div className="text-sm font-bold text-[#7FB77E]">94%</div>
            <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">Accuracy</div>
          </div>
        </div>

        <p className="text-[11px] italic text-[#8B7578] dark:text-[#A89598]">
          💡 Predictions get more accurate the more you log
        </p>
      </div>

      {/* ======================================================== */}
      {/* REGION 6: NOTIFICATIONS & REMINDERS                      */}
      {/* ======================================================== */}
      <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 shadow-soft space-y-2">
        <h3 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
          Active Notifications
        </h3>

        <div className="flex items-start space-x-2 text-xs">
          <span className="text-base">🔔</span>
          <div>
            <div className="font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">
              For Her: Period alerts & symptom reminders
            </div>
            <div className="text-[11px] text-[#7FB77E]">
              {settings.notifyRemindLog ? 'Enabled (2 days before period)' : 'Disabled'}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2 text-xs">
          <span className="text-base">💌</span>
          <div>
            <div className="font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">
              For Him: Phase change support reminders
            </div>
            <div className="text-[11px] text-[#7FB77E]">
              {settings.notifyPartnerPhaseChanges
                ? 'Enabled (Gentle advice without sharing symptoms)'
                : 'Disabled'}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CYCLE SETUP & SETTINGS                          */}
      {/* ======================================================== */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  🌸 Cycle Tracker Settings
                </h3>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Private rhythm & mutual care
                </p>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#E8A5B9]/15 border border-[#E8A5B9]/30 text-xs text-[#2D1F24] dark:text-[#F5E6EA] flex items-start gap-2">
              <Lock className="w-4 h-4 text-[#9B4D6F] flex-shrink-0 mt-0.5" />
              <span>
                Track your cycle to help your partner support you better. Your detailed symptoms remain strictly private and encrypted on your device.
              </span>
            </div>

            {/* Last period start date */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Last Period Start Date
              </label>
              <input
                type="date"
                value={settings.lastPeriodStartDate}
                onChange={(e) =>
                  setSettings({ ...settings, lastPeriodStartDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA]"
              />
            </div>

            {/* Cycle length slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#2D1F24] dark:text-[#F5E6EA]">Average Cycle Length</span>
                <span className="text-[#9B4D6F] dark:text-[#E8A5B9]">
                  {settings.avgCycleLength} days
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={40}
                value={settings.avgCycleLength}
                onChange={(e) =>
                  setSettings({ ...settings, avgCycleLength: Number(e.target.value) })
                }
                className="w-full accent-[#E8A5B9]"
              />
            </div>

            {/* Period length slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#2D1F24] dark:text-[#F5E6EA]">Average Period Length</span>
                <span className="text-[#9B4D6F] dark:text-[#E8A5B9]">
                  {settings.avgPeriodLength} days
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={settings.avgPeriodLength}
                onChange={(e) =>
                  setSettings({ ...settings, avgPeriodLength: Number(e.target.value) })
                }
                className="w-full accent-[#9B4D6F]"
              />
            </div>

            {/* Notification switches */}
            <div className="space-y-2 pt-2 border-t border-[#F0DFE3] dark:border-[#3D2F34]">
              <label className="flex items-center justify-between text-xs text-[#2D1F24] dark:text-[#F5E6EA]">
                <span>Remind me to log symptoms</span>
                <input
                  type="checkbox"
                  checked={settings.notifyRemindLog}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyRemindLog: e.target.checked })
                  }
                  className="rounded text-[#E8A5B9] focus:ring-[#E8A5B9]"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-[#2D1F24] dark:text-[#F5E6EA]">
                <span>Notify partner of phase changes</span>
                <input
                  type="checkbox"
                  checked={settings.notifyPartnerPhaseChanges}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyPartnerPhaseChanges: e.target.checked })
                  }
                  className="rounded text-[#9B4D6F] focus:ring-[#9B4D6F]"
                />
              </label>
            </div>

            <button
              onClick={() => {
                setShowSetupModal(false);
                showToast('Cycle settings saved & predictions recalibrated ✨');
              }}
              className="w-full py-2.5 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs shadow-soft transition"
            >
              Save Changes ✨
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: LOG SYMPTOMS (FOR HER)                          */}
      {/* ======================================================== */}
      {showSymptomsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-t-[28px] sm:rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  🌸 Log Daily Symptoms
                </h3>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  {selectedDate}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9B4D6F]/10 text-[#9B4D6F] dark:text-[#E8A5B9]">
                🔒 Strictly Private
              </span>
            </div>

            {/* Mood */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Mood
              </label>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { id: 'happy', emoji: '😊', label: 'Happy' },
                  { id: 'calm', emoji: '😌', label: 'Calm' },
                  { id: 'anxious', emoji: '😰', label: 'Anxious' },
                  { id: 'irritable', emoji: '😤', label: 'Irritable' },
                  { id: 'sad', emoji: '🥺', label: 'Sad' },
                  { id: 'tired', emoji: '😴', label: 'Tired' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTempMood(tempMood === m.id ? undefined : (m.id as any))}
                    className={`p-2 rounded-xl text-center text-xs transition ${
                      tempMood === m.id
                        ? 'bg-[#8C244F] text-white font-bold shadow-sm'
                        : 'bg-[#FFF4E6] dark:bg-[#33282C] text-[#140C0F] dark:text-[#F5E6EA] font-medium'
                    }`}
                  >
                    <div className="text-base">{m.emoji}</div>
                    <div className="text-[9px] mt-0.5">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pain */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Pain / Cramps
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'None ✨' },
                  { id: 'mild', label: 'Mild 🌸' },
                  { id: 'moderate', label: 'Moderate ⚡' },
                  { id: 'severe', label: 'Severe 💥' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setTempPain(tempPain === p.id ? undefined : (p.id as any))}
                    className={`py-2 px-1 rounded-xl text-center text-xs transition ${
                      tempPain === p.id
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Energy Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low 🪫' },
                  { id: 'medium', label: 'Medium 🔋' },
                  { id: 'high', label: 'High ⚡' }
                ].map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setTempEnergy(tempEnergy === e.id ? undefined : (e.id as any))}
                    className={`py-2 rounded-xl text-center text-xs transition ${
                      tempEnergy === e.id
                        ? 'bg-[#9B4D6F] text-white font-bold'
                        : 'bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA]'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flow */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Flow
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'spotting', label: 'Spotting 💧' },
                  { id: 'light', label: 'Light 🩸' },
                  { id: 'medium', label: 'Medium 🩸🩸' },
                  { id: 'heavy', label: 'Heavy 🩸🩸🩸' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTempFlow(tempFlow === f.id ? undefined : (f.id as any))}
                    className={`py-2 px-1 rounded-xl text-center text-xs transition ${
                      tempFlow === f.id
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Personal Reflections (strictly private)
              </label>
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value.slice(0, 300))}
                rows={2}
                placeholder="How are you feeling inside? Sleep quality, cravings, body feelings..."
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA] resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowSymptomsModal(false)}
                className="flex-1 py-2.5 rounded-full border border-[#F0DFE3] dark:border-[#3D2F34] text-xs font-semibold text-[#8B7578]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSymptoms}
                className="flex-1 py-2.5 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs shadow-soft transition"
              >
                Save Log 🌸
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: SEND CARE PACKAGE (FOR PARTNER)                 */}
      {/* ======================================================== */}
      {showCarePackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#E8A5B9]" />
                  <span>Send Care Package</span>
                </h3>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  To {partnerUser.name.split(' ')[0]} • {currentPhase.title}
                </p>
              </div>
              <button
                onClick={() => setShowCarePackageModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
              Select gifts to include in her digital care basket:
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {careGifts.map((gift) => {
                const isSelected = selectedCareGifts.includes(gift.id);
                return (
                  <button
                    key={gift.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCareGifts(selectedCareGifts.filter((g) => g !== gift.id));
                      } else {
                        setSelectedCareGifts([...selectedCareGifts, gift.id]);
                      }
                    }}
                    className={`p-2 rounded-xl text-left border transition flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-[#E8A5B9]/15 border-[#E8A5B9] text-[#2D1F24] dark:text-[#F5E6EA]'
                        : 'bg-[#FFF9F5] dark:bg-[#1A1416] border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578]'
                    }`}
                  >
                    <span className="text-2xl">{gift.emoji}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{gift.name}</div>
                      <div className="text-[10px] text-[#8B7578] dark:text-[#A89598] truncate">
                        {gift.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Sweet Note to Include
              </label>
              <textarea
                value={carePackageNote}
                onChange={(e) => setCarePackageNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA] resize-none"
              />
            </div>

            <button
              onClick={() => {
                setShowCarePackageModal(false);
                showToast(`Care package sent to ${partnerUser.name.split(' ')[0]}! 🎁💖`);
                try {
                  confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
                } catch (e) {}
              }}
              disabled={selectedCareGifts.length === 0}
              className="w-full py-2.5 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] disabled:opacity-50 text-white font-bold text-xs shadow-soft transition"
            >
              Send Care Package ({selectedCareGifts.length} items) 💖
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CYCLE TIPS (FOR PARTNER)                        */}
      {/* ======================================================== */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{currentPhase.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                    Support During {currentPhase.title}
                  </h3>
                  <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    Practical, compassionate advice
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTipsModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] text-xs text-[#8B7578] dark:text-[#A89598] leading-relaxed">
              <span className="font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                What she might feel:
              </span>
              {currentPhase.partnerContext}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block">
                Ways to Show Love & Care:
              </span>
              {currentPhase.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-[#FFF4E6] dark:bg-[#33282C] text-xs text-[#2D1F24] dark:text-[#F5E6EA]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8A5B9] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTipsModal(false)}
              className="w-full py-2.5 rounded-full bg-[#9B4D6F] text-white font-bold text-xs transition"
            >
              Got It, I'll Be There For Her ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
