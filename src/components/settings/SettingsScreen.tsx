import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Heart,
  Lock,
  Shield,
  Camera,
  Cloud,
  HardDrive,
  Download,
  Trash2,
  Bell,
  Sparkles,
  Moon,
  Sun,
  Monitor,
  Type,
  Activity,
  HelpCircle,
  FileText,
  ShieldCheck,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  Archive,
  HeartCrack,
  Clock,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCouple } from '../../context/CoupleContext';
import { soundFX } from '../../utils/audio';
import { UnpairFlowModal } from './UnpairFlowModal';
import { ArchivedDataModal } from './ArchivedDataModal';
import { PrivacyPolicyModal } from '../legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../legal/TermsOfServiceModal';
import { ConsentPreferencesModal } from '../legal/ConsentPreferencesModal';
import { DataDeletionFlowModal } from '../legal/DataDeletionFlowModal';
import { DataExportFlowModal } from '../legal/DataExportFlowModal';
import { EmergencyResourcesModal } from '../legal/EmergencyResourcesModal';
import { LegalUpdateNoticeModal } from '../legal/LegalUpdateNoticeModal';
import { NotificationChannelManagerModal } from '../notifications/NotificationChannelManagerModal';
import { AnalyticsDashboardModal } from '../analytics/AnalyticsDashboardModal';
import { analytics } from '../../services/analytics';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    currentUser,
    partnerUser,
    isDarkMode,
    toggleDarkMode,
    biometricLockEnabled,
    toggleBiometricLock,
    showToast,
    pairingStatus,
    unpairRequest,
    archivedData,
    legalHold,
    cancelUnpair,
    exportArchivedData,
    rePair
  } = useCouple();

  // Modals & Flows
  const [showArchivedDataModal, setShowArchivedDataModal] = useState(false);
  const [showRePairModal, setShowRePairModal] = useState(false);
  const [rePairPartnerName, setRePairPartnerName] = useState('');
  const [rePairCode, setRePairCode] = useState('');

  // Legal & Privacy Compliance Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showLegalUpdateNotice, setShowLegalUpdateNotice] = useState(false);
  const [doNotSellActive, setDoNotSellActive] = useState<boolean>(() => {
    return localStorage.getItem('twobe_dnsmpi') !== 'false';
  });

  // Profile editable state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileNickname, setProfileNickname] = useState(currentUser.nickname || 'Bunny 🐰');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);

  // Appearance
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Notifications
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifKissesHugs, setNotifKissesHugs] = useState(true);
  const [notifLockedLetters, setNotifLockedLetters] = useState(true);
  const [notifDailyPrompt, setNotifDailyPrompt] = useState(true);
  const [dailyPromptTime, setDailyPromptTime] = useState('20:00');
  const [notifQuietHours, setNotifQuietHours] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  // Data & Backup
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(true);
  const [lastBackupText, setLastBackupText] = useState('Today at 3:14 PM');
  const [storageUsedMB, setStorageUsedMB] = useState(142.8);
  const [cacheUsedMB, setCacheUsedMB] = useState(36.4);

  // Health
  const [cycleTrackerEnabled, setCycleTrackerEnabled] = useState(true);

  // Accessibility & Sounds
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(!soundFX.isMuted);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEffectsEnabled(enabled);
    soundFX.isMuted = !enabled;
    if (enabled) {
      soundFX.playMessageReceive();
      showToast('Sound effects enabled 🔔');
    } else {
      showToast('Sound effects muted 🔕');
    }
  };

  const handleToggleHaptics = (enabled: boolean) => {
    setHapticsEnabled(enabled);
    if (enabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
    showToast(enabled ? 'Haptic feedback enabled 📳' : 'Haptic feedback muted');
  };

  const handleToggleHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('high-contrast', enabled);
    }
    showToast(enabled ? 'High contrast mode enabled 👁️' : 'Standard contrast mode');
  };

  const handleToggleReduceMotion = (enabled: boolean) => {
    setReduceMotion(enabled);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('reduce-motion', enabled);
    }
    showToast(enabled ? 'Reduce motion enabled 🐢' : 'Smooth animations enabled ✨');
  };

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPartnerProfileModal, setShowPartnerProfileModal] = useState(false);
  const [showUnpairModal, setShowUnpairModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCycleSetupModal, setShowCycleSetupModal] = useState(false);
  const [showNotificationChannelsModal, setShowNotificationChannelsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; content: string } | null>(null);

  // Temporary Edit Profile State
  const [tempName, setTempName] = useState(profileName);
  const [tempNickname, setTempNickname] = useState(profileNickname);
  const [tempAvatar, setTempAvatar] = useState(profileAvatar);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
  ];

  const handleOpenEditProfile = () => {
    setTempName(profileName);
    setTempNickname(profileNickname);
    setTempAvatar(profileAvatar);
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setProfileName(tempName.trim());
    setProfileNickname(tempNickname.trim());
    setProfileAvatar(tempAvatar);
    setShowEditProfileModal(false);
    showToast('Profile updated ✨');
  };

  const handleClearCache = () => {
    setCacheUsedMB(0.0);
    showToast('Cache cleared successfully! 🧹');
  };

  const handleBackupNow = () => {
    setLastBackupText('Just now');
    showToast('Encrypted backup uploaded to Google Drive ☁️');
  };

  return (
    <div className="min-h-screen pb-28 pt-2 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 px-1 py-1">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
          Settings
        </h2>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: ACCOUNT                                       */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          ACCOUNT
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Profile */}
          <button
            onClick={handleOpenEditProfile}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-t-[20px]"
          >
            <div className="flex items-center space-x-3">
              <img
                src={profileAvatar}
                alt={profileName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8A5B9]"
              />
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Profile
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  {profileName} • {profileNickname}
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8A5B9]/15 text-[#9B4D6F] dark:text-[#E8A5B9]">
              Edit
            </span>
          </button>

          {/* Partner */}
          <button
            onClick={() => setShowPartnerProfileModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <img
                src={partnerUser.avatar}
                alt={partnerUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#9B4D6F]"
              />
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Partner
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  {partnerUser.name} • {partnerUser.nickname}
                </div>
              </div>
            </div>
            <span className="text-xs text-[#8B7578] dark:text-[#A89598]">
              View only ›
            </span>
          </button>

          {/* Unpair / Dissolve Connection States */}
          {pairingStatus === 'cooling_off' ? (
            <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-b-[20px] space-y-2">
              <div
                onClick={() => setShowUnpairModal(true)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  <div>
                    <div className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      Cooling-Off Active (72h)
                    </div>
                    <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                      {unpairRequest?.initiatorName} requested unpair. Tap to view status.
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600">Review ›</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cancelUnpair();
                }}
                className="w-full py-1.5 rounded-xl bg-white dark:bg-[#1C1217] border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100/50 transition"
              >
                Cancel Unpair Request (Stay Connected) ❤️
              </button>
            </div>
          ) : pairingStatus === 'confirmation_pending' ? (
            <button
              onClick={() => setShowUnpairModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left bg-rose-50 dark:bg-rose-950/30 transition rounded-b-[20px]"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Unpair Confirmation Required
                  </div>
                  <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    72h cooling-off elapsed. Mutual consent required to finalize.
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                Action Required
              </span>
            </button>
          ) : pairingStatus === 'dissolved' ? (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-b-[20px] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🕊️</span>
                  <div>
                    <div className="text-sm font-bold text-[#2D1F24] dark:text-white">
                      Status: Unpaired
                    </div>
                    <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                      Connection dissolved. Data preserved in Archive.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRePairModal(true)}
                  className="px-2.5 py-1 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-[11px] shadow-sm"
                >
                  Pair Again
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowUnpairModal(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 transition rounded-b-[20px]"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">💔</span>
                <div>
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Unpair
                  </div>
                  <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    Dissolve connection with {partnerUser.name.split(' ')[0]}
                  </div>
                </div>
              </div>
              <span className="text-xs text-rose-500 font-semibold">
                Mutual consent ›
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: PRIVACY                                       */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          PRIVACY
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Biometric Lock Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔒</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Biometric Lock
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Enables Face ID / fingerprint to open app
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricLockEnabled}
              onChange={() => {
                toggleBiometricLock();
                showToast(
                  !biometricLockEnabled
                    ? 'Biometric Lock enabled 🔒'
                    : 'Biometric Lock disabled'
                );
              }}
              className="w-5 h-5 rounded text-[#E8A5B9] focus:ring-[#E8A5B9] accent-[#E8A5B9]"
            />
          </div>

          {/* End-to-End Encryption */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛡️</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  End-to-End Encryption
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Always on. Your messages are private.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>

          {/* Screenshot Prevention */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📸</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Screenshot Prevention
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Not available in v1. Trust-based.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#8B7578]">
              Trust Mode
            </span>
          </div>

          {/* Consent Preferences (GDPR) */}
          <button
            onClick={() => setShowConsentModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚖️</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Consent Preferences
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Manage analytics, crash reporting & legal consent
                </div>
              </div>
            </div>
            <span className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9] font-semibold">
              Manage ›
            </span>
          </button>

          {/* CCPA: Do Not Sell My Personal Information */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              <span className="text-xl">🛡️</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                  <span>Do Not Sell My Info (CCPA)</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    Always Honored
                  </span>
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  We never sell data. Honors Global Privacy Control (GPC).
                </div>
                <div className="flex gap-3 text-[11px] pt-1">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="text-[#9B4D6F] dark:text-[#FFAEC8] font-bold underline"
                  >
                    Request my data (DSAR)
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-rose-600 dark:text-rose-400 font-bold underline"
                  >
                    Request deletion
                  </button>
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={doNotSellActive}
              onChange={(e) => {
                setDoNotSellActive(e.target.checked);
                localStorage.setItem('twobe_dnsmpi', String(e.target.checked));
                showToast(
                  e.target.checked
                    ? 'Do Not Sell preference active (CCPA honored) 🛡️'
                    : 'CCPA preference updated'
                );
              }}
              className="w-5 h-5 rounded text-blue-600 accent-blue-600 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: DATA                                          */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          DATA
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Cloud Backup */}
          <button
            onClick={() => setShowBackupModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-t-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">☁️</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Cloud Backup
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Google Drive • Last: {lastBackupText}
                </div>
              </div>
            </div>
            <span className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9] font-semibold">
              Manage ›
            </span>
          </button>

          {/* Storage & Clear Cache */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">💾</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Storage
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  {storageUsedMB} MB used (Cache: {cacheUsedMB} MB)
                </div>
              </div>
            </div>
            <button
              onClick={handleClearCache}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#9B4D6F] dark:text-[#E8A5B9] hover:bg-[#FCEAD4] transition"
            >
              Clear cache
            </button>
          </div>

          {/* Firebase Analytics (GA4) System & Dashboard */}
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📊</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                  <span>Firebase Analytics & GA4</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Live Engine
                  </span>
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Event stream, funnels, cohort retention & DAU metrics
                </div>
              </div>
            </div>
            <span className="text-xs text-[#9B4D6F] dark:text-[#FFAEC8] font-semibold">
              Dashboard ›
            </span>
          </button>

          {/* Export Data */}
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📦</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Export Data
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Downloads all your data as ZIP
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#8B7578]" />
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 transition rounded-b-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🗑️</span>
              <div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Delete Account
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Delete permanently. Requires mutual consent for shared data.
                </div>
              </div>
            </div>
            <span className="text-xs text-rose-500 font-semibold">
              Delete ›
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3B: ARCHIVED DATA & HISTORY                      */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1 flex items-center justify-between">
          <span>ARCHIVED DATA</span>
          {legalHold && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold lowercase">
              ● legal hold active
            </span>
          )}
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Archived Data Browser */}
          <button
            onClick={() => setShowArchivedDataModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-t-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📦</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-2">
                  <span>Archived Data & Breakup Records</span>
                  {archivedData && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold">
                      Preserved
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Archived chat, memories, gratitude notes, bucket list & stats
                </div>
              </div>
            </div>
            <span className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9] font-semibold">
              Browse Archive ›
            </span>
          </button>

          {/* Export Archived Data */}
          <button
            onClick={exportArchivedData}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-b-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">💾</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Download Archive File
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Export preserved history as JSON
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#8B7578]" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: NOTIFICATIONS                                 */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          NOTIFICATIONS
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Android Notification Channels Center & Simulator */}
          <button
            onClick={() => setShowNotificationChannelsModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-t-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔔</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                  <span>Android Notification Channels</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    8 Channels
                  </span>
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Custom sounds, LEDs, DND bypass, quiet hours & test simulator
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#9B4D6F] dark:text-[#FFAEC8] flex items-center gap-1">
              Manage & Test ›
            </span>
          </button>

          {/* Messages */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
              Messages
            </span>
            <input
              type="checkbox"
              checked={notifMessages}
              onChange={(e) => setNotifMessages(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* Kisses & Hugs */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
              Kisses & Hugs
            </span>
            <input
              type="checkbox"
              checked={notifKissesHugs}
              onChange={(e) => setNotifKissesHugs(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* Locked Letters */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
              Locked Letters
            </span>
            <input
              type="checkbox"
              checked={notifLockedLetters}
              onChange={(e) => setNotifLockedLetters(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* Daily Prompt + Time Picker */}
          <div className="p-3.5 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                Daily Prompt
              </span>
              <input
                type="checkbox"
                checked={notifDailyPrompt}
                onChange={(e) => setNotifDailyPrompt(e.target.checked)}
                className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
              />
            </label>
            {notifDailyPrompt && (
              <div className="flex items-center justify-between pl-2 pt-1 text-xs">
                <span className="text-[#8B7578] dark:text-[#A89598]">Reminder time</span>
                <input
                  type="time"
                  value={dailyPromptTime}
                  onChange={(e) => setDailyPromptTime(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] font-semibold text-[#9B4D6F] dark:text-[#E8A5B9]"
                />
              </div>
            )}
          </div>

          {/* Quiet Hours + Start/End Time Pickers */}
          <div className="p-3.5 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                Quiet Hours
              </span>
              <input
                type="checkbox"
                checked={notifQuietHours}
                onChange={(e) => setNotifQuietHours(e.target.checked)}
                className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
              />
            </label>
            {notifQuietHours && (
              <div className="flex items-center justify-between pl-2 pt-1 text-xs">
                <span className="text-[#8B7578] dark:text-[#A89598]">Quiet Window</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] font-semibold text-[#9B4D6F] dark:text-[#E8A5B9]"
                  />
                  <span className="text-[#8B7578]">to</span>
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] font-semibold text-[#9B4D6F] dark:text-[#E8A5B9]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: APPEARANCE                                    */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          APPEARANCE
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 space-y-4 shadow-soft">
          {/* Theme segmented control */}
          <div>
            <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
              Theme
            </div>
            <div className="flex rounded-full bg-[#FFF4E6] dark:bg-[#33282C] p-1 border border-[#F0DFE3] dark:border-[#3D2F34]">
              {[
                { id: 'light' as const, label: 'Light', icon: '☀️' },
                { id: 'dark' as const, label: 'Dark', icon: '🌙' },
                { id: 'system' as const, label: 'System', icon: '📱' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeMode(t.id);
                    if (t.id === 'dark' && !isDarkMode) toggleDarkMode();
                    if (t.id === 'light' && isDarkMode) toggleDarkMode();
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition ${
                    themeMode === t.id
                      ? 'bg-gradient-to-r from-[#DE7090] to-[#8C244F] text-white font-bold shadow-sm'
                      : 'text-[#4A3B40] dark:text-[#A89598] font-medium'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Size segmented control */}
          <div className="pt-2 border-t border-[#F0DFE3] dark:border-[#3D2F34]">
            <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
              Text Size
            </div>
            <div className="flex rounded-full bg-[#FFF4E6] dark:bg-[#33282C] p-1 border border-[#F0DFE3] dark:border-[#3D2F34]">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setTextSize(s);
                    showToast(`Text size set to ${s}`);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                    textSize === s
                      ? 'bg-[#9B4D6F] text-white shadow-sm'
                      : 'text-[#8B7578] dark:text-[#A89598]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 6: ACCESSIBILITY & SOUNDS                        */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          ACCESSIBILITY & SOUNDS
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Sound Effects */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🔔</span>
              <div>
                <div className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                  Sound Effects
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Intimate feedback for pops, letters & milestones
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEffectsEnabled}
              onChange={(e) => handleToggleSound(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* Haptic Feedback */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg">📳</span>
              <div>
                <div className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                  Haptic Feedback
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Vibrations on long press, kiss holds & send
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hapticsEnabled}
              onChange={(e) => handleToggleHaptics(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* High Contrast Mode */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg">👁️</span>
              <div>
                <div className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                  High Contrast Mode
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Enhanced readability and stronger borders
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => handleToggleHighContrast(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>

          {/* Reduce Motion */}
          <label className="p-3.5 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🐢</span>
              <div>
                <div className="text-sm font-medium text-[#2D1F24] dark:text-[#F5E6EA]">
                  Reduce Motion
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Disable screen floating, confetti and bouncy physics
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => handleToggleReduceMotion(e.target.checked)}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </label>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 7: HEALTH                                        */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          HEALTH
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-3.5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🌸</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Cycle Tracker
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Track cycle to help partner support you better
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={cycleTrackerEnabled}
              onChange={(e) => {
                setCycleTrackerEnabled(e.target.checked);
                if (e.target.checked) setShowCycleSetupModal(true);
              }}
              className="w-5 h-5 rounded text-[#E8A5B9] accent-[#E8A5B9]"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 8: ABOUT                                         */}
      {/* ======================================================== */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase px-1">
          ABOUT
        </div>
        <div className="rounded-[20px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
          {/* Help & Support */}
          <button
            onClick={() =>
              setLegalModalContent({
                title: 'Help & Support',
                content:
                  '2Be Sanctuary Help Center:\n\n• End-to-End Encryption: All messages, photos, and cycle tracker data are strictly encrypted on-device.\n• Mutual Unpairing: Requires mutual approval and features a 72-hour cooling-off period.\n• Questions or feature suggestions? Contact support@2be.app'
              })
            }
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition rounded-t-[20px]"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">💡</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Help & Support
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  FAQ, encrypted backup guides & email support
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8B7578]" />
          </button>

          {/* Emergency Resources */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛟</span>
              <div>
                <div className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  Emergency Resources
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Crisis lifelines (988), domestic safety & quick exit
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Get Help ›
            </span>
          </button>

          {/* Terms of Service */}
          <button
            onClick={() => setShowTermsModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📜</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Terms of Service
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Eligibility, content ownership & mutual commitments
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8B7578]" />
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🛡️</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Privacy Policy
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Zero data sales, COPPA age gate & GDPR rights
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8B7578]" />
          </button>

          {/* Policy Update Notice */}
          <button
            onClick={() => setShowLegalUpdateNotice(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF9F5] dark:hover:bg-[#1A1416] transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔔</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                  <span>Policy Updates (v1.2)</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    New
                  </span>
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Review latest legal changes & grace period
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#87204B] dark:text-[#FFAEC8]">
              Review ›
            </span>
          </button>

          {/* Version */}
          <div className="p-3.5 flex items-center justify-between rounded-b-[20px]">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Version
                </div>
                <div className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  2Be Mobile Edition • Build 104
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#9B4D6F] dark:text-[#E8A5B9]">
              v1.0.4
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: PROFILE EDIT MODAL                              */}
      {/* ======================================================== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                Edit Profile
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            {/* Avatar Picker */}
            <div className="space-y-2">
              <div className="text-center">
                <img
                  src={tempAvatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-[#E8A5B9] shadow-soft"
                />
                <span className="text-[11px] text-[#8B7578] dark:text-[#A89598] block mt-1">
                  Choose avatar preset:
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {presetAvatars.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setTempAvatar(url)}
                    className={`rounded-full p-0.5 border-2 transition ${
                      tempAvatar === url
                        ? 'border-[#9B4D6F] scale-105'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar ${i}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value.slice(0, 20))}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA]"
              />
            </div>

            {/* Nickname Input */}
            <div>
              <label className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] block mb-1">
                Private Nickname
              </label>
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value.slice(0, 25))}
                className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] text-xs text-[#2D1F24] dark:text-[#F5E6EA]"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs shadow-soft transition"
            >
              Save Profile ✨
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PARTNER PROFILE MODAL (VIEW ONLY)               */}
      {/* ======================================================== */}
      {showPartnerProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                Partner Profile
              </h3>
              <button
                onClick={() => setShowPartnerProfileModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-[#9B4D6F] shadow-soft"
            />

            <div>
              <h4 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                {partnerUser.name}
              </h4>
              <p className="text-xs text-[#9B4D6F] dark:text-[#E8A5B9]">
                You call her "{partnerUser.nickname || 'My Sunshine'}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] text-xs text-[#8B7578] dark:text-[#A89598] space-y-1">
              <div>🔒 Paired & End-to-End Encrypted</div>
              <div>Connected for 41 days together</div>
            </div>

            <button
              onClick={() => setShowPartnerProfileModal(false)}
              className="w-full py-2.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA] font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: UNPAIR & BREAKUP FLOW MODAL                     */}
      {/* ======================================================== */}
      <UnpairFlowModal
        isOpen={showUnpairModal}
        onClose={() => setShowUnpairModal(false)}
        onOpenArchivedData={() => setShowArchivedDataModal(true)}
      />

      {/* ======================================================== */}
      {/* MODAL 3B: ARCHIVED DATA BROWSER                          */}
      {/* ======================================================== */}
      <ArchivedDataModal
        isOpen={showArchivedDataModal}
        onClose={() => setShowArchivedDataModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 3C: RE-PAIR / NEW PAIRING MODAL                    */}
      {/* ======================================================== */}
      {showRePairModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#DE7090]" />
                <span>Pair with Partner</span>
              </h3>
              <button
                onClick={() => setShowRePairModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6B555B] dark:text-[#E6D7DE]">
              Enter your partner's name and unique 2Be invite code to establish a fresh connection.
            </p>

            {rePairPartnerName.trim().toLowerCase().includes('maya') && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <span>⚠️ Previous Connection Detected</span>
                </div>
                <p>You were previously paired with Maya. Starting fresh? All streak and kiss counters will start at 0.</p>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <label className="text-xs font-bold text-[#2D1F24] dark:text-white block mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={rePairPartnerName}
                  onChange={(e) => setRePairPartnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F6] dark:bg-[#1A1416] border border-[#DFCFD4] dark:border-[#543745] text-xs text-[#2D1F24] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D1F24] dark:text-white block mb-1">
                  Invite Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. MAYA-2BE-LOVE"
                  value={rePairCode}
                  onChange={(e) => setRePairCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F6] dark:bg-[#1A1416] border border-[#DFCFD4] dark:border-[#543745] text-xs text-[#2D1F24] dark:text-white uppercase font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowRePairModal(false)}
                className="flex-1 py-2.5 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-semibold text-[#8B7578] dark:text-[#E6D7DE]"
              >
                Cancel
              </button>
              <button
                disabled={!rePairPartnerName.trim()}
                onClick={() => {
                  rePair(rePairPartnerName, rePairCode || 'LOVE2BE');
                  setShowRePairModal(false);
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold text-white shadow-sm transition ${
                  rePairPartnerName.trim()
                    ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] hover:brightness-105'
                    : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed text-slate-400'
                }`}
              >
                Connect ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: BACKUP SETTINGS MODAL                           */}
      {/* ======================================================== */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-[#9B4D6F]" />
                <span>Backup Settings</span>
              </h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#1A1416] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Google Drive Backup
                </span>
                <input
                  type="checkbox"
                  checked={cloudBackupEnabled}
                  onChange={(e) => setCloudBackupEnabled(e.target.checked)}
                  className="rounded text-[#E8A5B9] accent-[#E8A5B9]"
                />
              </div>
              <div className="text-[#8B7578] dark:text-[#A89598]">
                Last backup: {lastBackupText}
              </div>
            </div>

            <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
              Backups are encrypted client-side using your private couple keys before uploading.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleBackupNow}
                className="flex-1 py-2.5 rounded-full bg-[#E8A5B9] hover:bg-[#DE91A7] text-white font-bold text-xs shadow-soft transition"
              >
                Back Up Now ☁️
              </button>
              <button
                onClick={() => {
                  setShowBackupModal(false);
                  showToast('Data restored from cloud backup 🔄');
                }}
                className="flex-1 py-2.5 rounded-full border border-[#9B4D6F] text-[#9B4D6F] dark:text-[#E8A5B9] font-bold text-xs"
              >
                Restore 🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: DATA EXPORT FLOW MODAL                          */}
      {/* ======================================================== */}
      <DataExportFlowModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 6: DATA DELETION FLOW MODAL                        */}
      {/* ======================================================== */}
      <DataDeletionFlowModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDeletedComplete={() => {
          localStorage.clear();
          localStorage.setItem('twobe_onboarding_step', 'welcome');
          window.location.reload();
        }}
      />

      {/* ======================================================== */}
      {/* MODAL 7: PRIVACY POLICY MODAL                            */}
      {/* ======================================================== */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onOpenTerms={() => setShowTermsModal(true)}
      />

      {/* ======================================================== */}
      {/* MODAL 8: TERMS OF SERVICE MODAL                          */}
      {/* ======================================================== */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {/* ======================================================== */}
      {/* MODAL 9: CONSENT PREFERENCES MODAL                       */}
      {/* ======================================================== */}
      <ConsentPreferencesModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {/* ======================================================== */}
      {/* MODAL 10: EMERGENCY & CRISIS RESOURCES                   */}
      {/* ======================================================== */}
      <EmergencyResourcesModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 11: LEGAL UPDATES NOTICE MODAL                     */}
      {/* ======================================================== */}
      <LegalUpdateNoticeModal
        isOpen={showLegalUpdateNotice}
        onReview={() => {
          setShowLegalUpdateNotice(false);
          setShowPrivacyModal(true);
        }}
        onAccept={() => {
          setShowLegalUpdateNotice(false);
          showToast('Privacy Policy v1.2 terms accepted ✨', 'love');
        }}
      />

      {/* ======================================================== */}
      {/* MODAL 12: ANDROID NOTIFICATION CHANNELS & SIMULATOR      */}
      {/* ======================================================== */}
      <NotificationChannelManagerModal
        isOpen={showNotificationChannelsModal}
        onClose={() => setShowNotificationChannelsModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 13: FIREBASE ANALYTICS & GA4 DASHBOARD             */}
      {/* ======================================================== */}
      <AnalyticsDashboardModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL 7: LEGAL / FAQ READER                              */}
      {/* ======================================================== */}
      {legalModalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                {legalModalContent.title}
              </h3>
              <button
                onClick={() => setLegalModalContent(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B7578]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-xs text-[#8B7578] dark:text-[#A89598] whitespace-pre-line leading-relaxed pr-1">
              {legalModalContent.content}
            </div>

            <button
              onClick={() => setLegalModalContent(null)}
              className="w-full py-2.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#2D1F24] dark:text-[#F5E6EA] font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
