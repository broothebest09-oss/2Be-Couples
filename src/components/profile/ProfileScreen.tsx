import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Bell,
  Heart,
  HardDrive,
  Copy,
  QrCode,
  Sparkles,
  ArrowLeftRight,
  LogOut,
  ChevronRight,
  Check,
  Fingerprint
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { SubscriptionModal } from './SubscriptionModal';
import { DisconnectModal } from './DisconnectModal';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    partnerUser,
    coupleSpace,
    switchUser,
    biometricLockEnabled,
    toggleBiometricLock,
    showToast
  } = useCouple();

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Notification toggles
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifCalls, setNotifCalls] = useState(true);
  const [notifDates, setNotifDates] = useState(true);
  const [notifHealth, setNotifHealth] = useState(true);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupleSpace.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast(`Space Invite Code ${coupleSpace.code} copied!`, 'info');
  };

  const storagePercent = Math.round(
    (coupleSpace.storageUsedMB / coupleSpace.storageMaxMB) * 100
  );

  return (
    <div className="space-y-4 pb-28 pt-2 max-w-md mx-auto">
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
      />

      {/* User Profile Card */}
      <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-3 ring-rose-400 dark:ring-softpink-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-midnight-950 rounded-full px-1 shadow-sm">
              {currentUser.mood?.split(' ').pop() || '✨'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</h2>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-softpink-500/20 text-rose-700 dark:text-softpink-300 border border-rose-200 dark:border-softpink-400/30">
                You
              </span>
            </div>
            <p className="text-xs text-purple-700 dark:text-lavender-300 font-bold">{currentUser.nickname}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">{currentUser.email}</p>
          </div>
        </div>

        {/* Perspective Switcher Highlight */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-800 dark:text-slate-300 font-bold block">Interactive Demo Mode</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Currently acting as {currentUser.name.split(' ')[0]}
            </span>
          </div>
          <button
            onClick={switchUser}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-lavender-500/20 dark:hover:bg-lavender-500/30 border border-purple-200 dark:border-lavender-400/40 text-purple-800 dark:text-lavender-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition shadow-sm"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-purple-600 dark:text-lavender-400" />
            <span>Switch to {partnerUser.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Couple Space Details */}
      <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
            Shared Couple Space
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            2 Active Members (Rule of Two)
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{coupleSpace.name}</h3>

        {/* Invite Code & Share */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
              Private Space Code
            </span>
            <span className="font-mono text-xs font-bold text-purple-800 dark:text-lavender-300">
              {coupleSpace.code}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-midnight-800 dark:hover:text-white text-slate-800 dark:text-slate-300 transition flex items-center gap-1 text-xs font-bold shadow-sm"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Vault Storage Meter */}
        <div className="pt-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-purple-600 dark:text-lavender-400" /> Cloud Media Vault
            </span>
            <span className="text-slate-800 dark:text-slate-300 font-bold">
              {(coupleSpace.storageUsedMB / 1000).toFixed(1)} GB / {(coupleSpace.storageMaxMB / 1000).toFixed(0)} GB
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-midnight-950 overflow-hidden">
            <div
              style={{ width: `${storagePercent}%` }}
              className="h-full bg-gradient-to-r from-softpink-500 to-lavender-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-rosegold-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Couple Subscription
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-softpink-500/20 text-rose-700 dark:text-softpink-300 border border-rose-200 dark:border-softpink-400/30 text-xs font-bold uppercase">
            2Be {coupleSpace.activeSubscription}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          One active subscription covers both {currentUser.name.split(' ')[0]} and {partnerUser.name.split(' ')[0]} across all devices.
        </p>

        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="w-full py-2.5 rounded-2xl bg-[#F8F6F2] hover:bg-slate-100 dark:bg-midnight-800 dark:hover:bg-midnight-700 border border-slate-300 dark:border-lavender-400/30 text-xs font-bold text-purple-800 dark:text-lavender-300 active:scale-95 transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Manage or Upgrade Subscription</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Privacy & Security Controls (Section 8 & 9) */}
      <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md space-y-4 transition-colors">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          Privacy & Device Security
        </span>

        {/* Biometric App Lock */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <Fingerprint className="w-4 h-4 text-purple-600 dark:text-lavender-400" />
            <div>
              <span className="text-slate-900 dark:text-white font-bold block">Biometric App Lock</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Require FaceID / TouchID to open 2Be</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleBiometricLock}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              biometricLockEnabled ? 'bg-rose-500 justify-end' : 'bg-slate-200 dark:bg-midnight-950 justify-start border border-slate-300 dark:border-white/20'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* End-to-End Encryption */}
        <div className="flex items-center justify-between text-xs border-t border-slate-200/80 dark:border-white/5 pt-3">
          <div className="flex items-center space-x-2.5">
            <Key className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-slate-900 dark:text-white font-bold block">End-to-End Encryption Keys</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Verified & active on this device</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
        </div>
      </div>

      {/* Disconnect & Separation Flow (Journey E) */}
      <div className="p-4 rounded-3xl bg-rose-50/60 dark:bg-midnight-900/60 border border-rose-200 dark:border-rose-500/20 space-y-2 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
            Separation & Portability
          </span>
          <button
            onClick={() => setShowDisconnectModal(true)}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold"
          >
            Disconnect Space
          </button>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Clear separation flow respecting mutual consent, personal data export, and clean revocation of space access without data leakage.
        </p>
      </div>
    </div>
  );
};
