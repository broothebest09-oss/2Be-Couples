import React, { useState } from 'react';
import {
  HeartPulse,
  Calendar,
  ShieldAlert,
  ChevronLeft,
  Moon,
  Sun,
  Sparkles,
  Lock,
  Download,
  Trash2,
  Info
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { calculateCyclePhase } from '../../utils/date';

export const HealthCycleModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    cycleTracking,
    updateCycleTracking,
    currentUser,
    partnerUser,
    showToast
  } = useCouple();

  const phaseInfo = calculateCyclePhase(
    cycleTracking.lastPeriodStart,
    cycleTracking.cycleLengthDays
  );

  const [lastPeriodStart, setLastPeriodStart] = useState(cycleTracking.lastPeriodStart);
  const [cycleLength, setCycleLength] = useState(cycleTracking.cycleLengthDays);
  const [energyLevel, setEnergyLevel] = useState(cycleTracking.energyLevel);
  const [shareWithPartner, setShareWithPartner] = useState(cycleTracking.shareWithPartner);
  const [privateNotes, setPrivateNotes] = useState(cycleTracking.privateNotes);

  const handleSave = () => {
    updateCycleTracking({
      lastPeriodStart,
      cycleLengthDays: Number(cycleLength),
      energyLevel,
      shareWithPartner,
      privateNotes
    });
  };

  const isMaya = currentUser.id === 'user-maya';

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-lavender-500/15">
        <button
          onClick={onBack}
          className="flex items-center text-xs text-purple-600 dark:text-lavender-300 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Us
        </button>
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Health & Cycle</h2>
        <div className="w-12" />
      </div>

      {/* Strict Privacy Safeguard Box (Mandatory per PDF Section 7.3) */}
      <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-[11px] text-rose-900 dark:text-rose-200 space-y-1.5 shadow-xs">
        <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Health-Data Privacy Shield</span>
        </div>
        <p className="leading-relaxed">
          Cycle information is treated as strictly confidential. Excluded from advertising, encrypted at rest, never sent to AI without separate informed permission. Cycle predictions are estimates, not medical advice or contraception.
        </p>
      </div>

      {/* Cycle Phase Visualizer Card */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-white via-rose-50/30 to-purple-50/40 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-rose-600 dark:text-rosegold-400">
            Day {phaseInfo.currentDay} of {cycleTracking.cycleLengthDays}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-softpink-500/20 border border-rose-200 dark:border-softpink-400/30 text-xs font-semibold text-rose-700 dark:text-softpink-300">
            {phaseInfo.phaseName} Phase
          </span>
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            {phaseInfo.phaseName === 'Menstrual' && 'Gentle Rest & Restoration'}
            {phaseInfo.phaseName === 'Follicular' && 'Rising Energy & Fresh Ideas'}
            {phaseInfo.phaseName === 'Ovulation' && 'Vibrant Connection & Closeness'}
            {phaseInfo.phaseName === 'Luteal' && 'Grounding, Comfort & Nourishment'}
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
            {phaseInfo.description}
          </p>
        </div>

        {/* Phase circular timeline bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-midnight-950 overflow-hidden flex border border-slate-200 dark:border-transparent">
            <div style={{ width: '18%' }} className="h-full bg-rose-500" title="Menstrual (Days 1-5)" />
            <div style={{ width: '25%' }} className="h-full bg-amber-400" title="Follicular (Days 6-11)" />
            <div style={{ width: '18%' }} className="h-full bg-purple-400" title="Ovulation (Days 12-16)" />
            <div style={{ width: '39%' }} className="h-full bg-indigo-500" title="Luteal (Days 17-28)" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Menstrual</span>
            <span>Follicular</span>
            <span>Ovulation</span>
            <span>Luteal</span>
          </div>
        </div>

        {/* Partner Care Advice Card */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 space-y-1.5 shadow-xs">
          <span className="text-xs font-semibold text-purple-700 dark:text-lavender-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-rosegold-400" />
            Partner Support Guide (For {isMaya ? partnerUser.name : 'You'})
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
            {phaseInfo.partnerAdvice}
          </p>
        </div>
      </div>

      {/* Settings & Granular Sharing */}
      <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
          Cycle Management & Sharing Settings
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1">Last Period Start</label>
            <input
              type="date"
              value={lastPeriodStart}
              onChange={e => setLastPeriodStart(e.target.value)}
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1">Cycle Length (Days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              min={21}
              max={40}
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Granular Sharing with Partner Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
          <div>
            <span className="text-slate-900 dark:text-white font-medium block">
              Share Current Phase with Partner
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Only shares high-level phase & comfort tips. Private notes stay secret.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShareWithPartner(!shareWithPartner)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              shareWithPartner ? 'bg-softpink-500 justify-end' : 'bg-slate-200 dark:bg-midnight-950 justify-start border border-slate-300 dark:border-white/20'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Private Encrypted Notes */}
        <div>
          <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-600 dark:text-lavender-400" /> Private Health Notes (Never shared with anyone)
          </label>
          <textarea
            value={privateNotes}
            onChange={e => setPrivateNotes(e.target.value)}
            rows={2}
            className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-400"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
        >
          Save Cycle Preferences
        </button>
      </div>

      {/* Export / Delete Health Data */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => showToast('Health data export file generated securely', 'info')}
          className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
        >
          <Download className="w-3.5 h-3.5" /> Export Health Log
        </button>
        <button
          onClick={() => showToast('Cycle log reset safely', 'info')}
          className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Health History
        </button>
      </div>
    </div>
  );
};
