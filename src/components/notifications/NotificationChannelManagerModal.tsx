import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Vibrate,
  Eye,
  EyeOff,
  ShieldAlert,
  Moon,
  Clock,
  Send,
  Heart,
  Mail,
  HelpCircle,
  Sparkles,
  Lock,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { soundFX } from '../../utils/audio';

interface NotificationChannelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeepLinkNavigate?: (destination: string, payloadId?: string) => void;
}

export interface ChannelConfig {
  id: string;
  name: string;
  description: string;
  importance: 'HIGH' | 'DEFAULT' | 'LOW';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  ledColor: string;
  lockscreenPrivacy: 'show_all' | 'hide_sensitive' | 'secret';
  bypassDnd: boolean;
  userCustomizable: boolean;
  actions: string[];
}

export const NotificationChannelManagerModal: React.FC<NotificationChannelManagerModalProps> = ({
  isOpen,
  onClose,
  onDeepLinkNavigate
}) => {
  const {
    currentUser,
    partnerUser,
    biometricLockEnabled,
    showToast,
    setActiveTab,
    setIsSettingsOpen
  } = useCouple();

  const [activeTab, setActiveTabSection] = useState<'channels' | 'quiet_hours' | 'simulator' | 'permissions'>('channels');

  // Load saved channel configurations
  const defaultChannels: ChannelConfig[] = [
    {
      id: 'messages',
      name: 'Messages',
      description: 'Notifications for new messages',
      importance: 'HIGH',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#E8A5B9', // Rose
      lockscreenPrivacy: 'hide_sensitive',
      bypassDnd: false,
      userCustomizable: true,
      actions: ['Reply', 'Mark as read']
    },
    {
      id: 'kisses_hugs',
      name: 'Kisses & Hugs',
      description: 'When your partner sends you a kiss or hug',
      importance: 'HIGH',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#FF69B4', // Pink
      lockscreenPrivacy: 'show_all',
      bypassDnd: false,
      userCustomizable: true,
      actions: ['Send back', 'Later']
    },
    {
      id: 'locked_letters',
      name: 'Locked Letters',
      description: 'When a locked letter is ready to open',
      importance: 'HIGH',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#9B4D6F', // Purple
      lockscreenPrivacy: 'show_all',
      bypassDnd: false,
      userCustomizable: true,
      actions: ['Open now', 'Later']
    },
    {
      id: 'daily_prompts',
      name: 'Daily Prompts',
      description: 'Daily question of the day',
      importance: 'DEFAULT',
      soundEnabled: false,
      vibrationEnabled: false,
      ledColor: 'OFF',
      lockscreenPrivacy: 'show_all',
      bypassDnd: false,
      userCustomizable: true,
      actions: ['Answer']
    },
    {
      id: 'milestones',
      name: 'Milestones',
      description: 'When you reach a milestone (100th kiss, etc.)',
      importance: 'DEFAULT',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#FFD700', // Gold
      lockscreenPrivacy: 'show_all',
      bypassDnd: false,
      userCustomizable: true,
      actions: ['View']
    },
    {
      id: 'cycle_tracker',
      name: 'Cycle Tracker',
      description: 'Period and cycle notifications',
      importance: 'DEFAULT',
      soundEnabled: false,
      vibrationEnabled: false,
      ledColor: 'OFF',
      lockscreenPrivacy: 'secret', // Hide sensitive details
      bypassDnd: false,
      userCustomizable: true,
      actions: ['Open Log']
    },
    {
      id: 'system',
      name: 'System',
      description: 'App updates, security alerts, account notifications',
      importance: 'HIGH',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#00FFFF', // Cyan
      lockscreenPrivacy: 'show_all',
      bypassDnd: true, // Bypass DND for security alerts
      userCustomizable: false,
      actions: ['Check Alert']
    },
    {
      id: 'unpair_requests',
      name: 'Connection Requests',
      description: 'When partner requests to unpair',
      importance: 'HIGH',
      soundEnabled: true,
      vibrationEnabled: true,
      ledColor: '#FF0000', // Red
      lockscreenPrivacy: 'show_all',
      bypassDnd: true, // Always audible: critical mutual consent
      userCustomizable: false,
      actions: ['Review']
    }
  ];

  const [channels, setChannels] = useState<ChannelConfig[]>(() => {
    try {
      const stored = localStorage.getItem('twobe_android_channels');
      return stored ? JSON.parse(stored) : defaultChannels;
    } catch {
      return defaultChannels;
    }
  });

  // Quiet Hours state
  const [quietHoursEnabled, setQuietHoursEnabled] = useState<boolean>(() => {
    return localStorage.getItem('twobe_quiet_hours_enabled') === 'true';
  });
  const [quietHoursStart, setQuietHoursStart] = useState<string>(() => {
    return localStorage.getItem('twobe_quiet_hours_start') || '22:00';
  });
  const [quietHoursEnd, setQuietHoursEnd] = useState<string>(() => {
    return localStorage.getItem('twobe_quiet_hours_end') || '07:00';
  });

  // Android 13+ permission simulation
  const [hasPostNotificationPermission, setHasPostNotificationPermission] = useState<boolean>(() => {
    return localStorage.getItem('twobe_post_notif_perm') !== 'denied';
  });

  // Simulated notification list
  const [simulatedNotifications, setSimulatedNotifications] = useState<{
    id: string;
    channelId: string;
    title: string;
    body: string;
    time: string;
    ledColor: string;
    bypassedDnd: boolean;
    silencedByQuietHours: boolean;
    actions: string[];
    deepLinkDestination: string;
  }[]>([]);

  if (!isOpen) return null;

  // Toggle channel property
  const toggleChannelProp = (channelId: string, prop: 'soundEnabled' | 'vibrationEnabled') => {
    setChannels(prev => {
      const updated = prev.map(ch => {
        if (ch.id === channelId && ch.userCustomizable) {
          return { ...ch, [prop]: !ch[prop] };
        }
        return ch;
      });
      localStorage.setItem('twobe_android_channels', JSON.stringify(updated));
      return updated;
    });
  };

  // Check if quiet hours active right now
  const isQuietHoursActiveNow = () => {
    if (!quietHoursEnabled) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [sH, sM] = quietHoursStart.split(':').map(Number);
    const [eH, eM] = quietHoursEnd.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;

    return startMins < endMins
      ? currentMins >= startMins && currentMins <= endMins
      : currentMins >= startMins || currentMins < endMins;
  };

  const isQuietNow = isQuietHoursActiveNow();

  // Trigger test notification
  const triggerTestNotification = (channelId: string) => {
    if (!hasPostNotificationPermission) {
      showToast('Notifications disabled by permission. Enable in Permissions tab.', 'info');
      return;
    }

    const ch = channels.find(c => c.id === channelId);
    if (!ch) return;

    const isQuiet = isQuietNow;
    const isSilenced = isQuiet && !ch.bypassDnd;

    let title = '';
    let body = '';
    let dest = 'home';

    switch (ch.id) {
      case 'messages':
        title = partnerUser.nickname || partnerUser.name;
        body = biometricLockEnabled
          ? 'New message'
          : 'Can\'t wait for our cozy movie night tonight! 🎬🍿';
        dest = 'chat';
        if (!isSilenced) soundFX.playMessageReceive();
        break;
      case 'kisses_hugs':
        title = `💋 Kiss from ${partnerUser.name.split(' ')[0]}`;
        body = 'Tap to hold and complete our sync!';
        dest = 'chat';
        if (!isSilenced) soundFX.playKissPop();
        break;
      case 'locked_letters':
        title = '🔒 Locked letter ready';
        body = `A letter from ${partnerUser.name.split(' ')[0]} is ready to open`;
        dest = 'chat';
        if (!isSilenced) soundFX.playMissYouChime();
        break;
      case 'daily_prompts':
        title = 'Question of the day';
        body = '“What is your favorite memory of us together?”';
        dest = 'home';
        break;
      case 'milestones':
        title = '🎉 Milestone reached!';
        body = 'You\'ve exchanged 100 kisses together!';
        dest = 'us';
        if (!isSilenced) soundFX.playLoveTone();
        break;
      case 'cycle_tracker':
        title = 'Cycle update';
        body = biometricLockEnabled
          ? 'Cycle update'
          : 'Period predicted in 2 days. Self-care mode recommended 🌸';
        dest = 'us';
        break;
      case 'system':
        title = '2Be';
        body = 'End-to-end cryptographic keys verified client-side.';
        dest = 'settings';
        if (!isSilenced) soundFX.playMessageSend();
        break;
      case 'unpair_requests':
        title = 'Connection request';
        body = `${partnerUser.name} requested to unpair. You have 72 hours to respond.`;
        dest = 'settings';
        soundFX.playLoveTone(); // Always audible
        break;
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      channelId: ch.id,
      title,
      body,
      time: 'Just now',
      ledColor: ch.ledColor,
      bypassedDnd: ch.bypassDnd,
      silencedByQuietHours: isSilenced,
      actions: ch.actions,
      deepLinkDestination: dest
    };

    setSimulatedNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
    showToast(
      isSilenced
        ? `[Quiet Hours Silenced] Notification sent to channel "${ch.name}" 🔕`
        : `Notification delivered via channel "${ch.name}" 🔔`,
      'info'
    );
  };

  const handleDeepLinkClick = (destination: string) => {
    onClose();
    if (destination === 'chat') {
      setActiveTab('chat');
      setIsSettingsOpen(false);
    } else if (destination === 'us') {
      setActiveTab('us');
      setIsSettingsOpen(false);
    } else if (destination === 'home') {
      setActiveTab('home');
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white flex items-center gap-2">
                <span>Notification Channels System</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  Android 8+ & 13+
                </span>
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                Google Play Store Notification Channel Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F0DFE3] dark:border-[#3D2833] overflow-x-auto scrollbar-none px-3 py-1.5 bg-[#FCF8F9] dark:bg-[#20151C] gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTabSection('channels')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'channels'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>8 Channels</span>
          </button>
          <button
            onClick={() => setActiveTabSection('quiet_hours')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'quiet_hours'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Quiet Hours</span>
            {isQuietNow && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTabSection('simulator')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Live Simulator</span>
          </button>
          <button
            onClick={() => setActiveTabSection('permissions')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'permissions'
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white shadow-sm'
                : 'text-[#6D585E] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Permissions (API 33+)</span>
          </button>
        </div>

        {/* Permission Warning Banner if denied */}
        {!hasPostNotificationPermission && (
          <div className="bg-amber-500 text-white text-[11px] font-bold px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="truncate">Notifications disabled. Enable in Permissions to stay connected.</span>
            </span>
            <button
              onClick={() => setActiveTabSection('permissions')}
              className="underline shrink-0 ml-2 text-white"
            >
              Fix ›
            </button>
          </div>
        )}

        {/* Content Panels */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs text-[#2D1F24] dark:text-white">
          
          {/* ======================================================== */}
          {/* TAB 1: ALL 8 CHANNELS LIST                               */}
          {/* ======================================================== */}
          {activeTab === 'channels' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                Google Play requires distinct channels on Android 8.0+ with configurable importance, custom vibration, LED colors, and DND bypass policies.
              </div>

              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#2D1F24] dark:text-white flex items-center gap-1.5">
                        <span>{ch.name}</span>
                        <span className="text-[10px] font-mono text-[#8B7578] dark:text-[#A89598]">
                          ({ch.id})
                        </span>
                        {ch.bypassDnd && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            Bypasses DND
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE] mt-0.5">
                        {ch.description}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ch.importance === 'HIGH'
                          ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ch.importance}
                    </span>
                  </div>

                  {/* Channel attributes grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] p-2 rounded-xl bg-slate-50 dark:bg-[#180F15] border border-[#DFCFD4] dark:border-[#3D2833]">
                    <div className="flex items-center space-x-1">
                      {ch.soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
                      <span>Sound: {ch.soundEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Vibrate className={`w-3 h-3 ${ch.vibrationEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>Vibe: {ch.vibrationEnabled ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {ch.ledColor !== 'OFF' ? (
                        <span
                          className="w-2.5 h-2.5 rounded-full ring-1 ring-black/20 shrink-0"
                          style={{ backgroundColor: ch.ledColor }}
                        />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                      )}
                      <span className="truncate">LED: {ch.ledColor}</span>
                    </div>
                  </div>

                  {/* Actions & quick test */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center space-x-2">
                      {ch.userCustomizable && (
                        <>
                          <button
                            onClick={() => toggleChannelProp(ch.id, 'soundEnabled')}
                            className="px-2 py-0.5 rounded-lg border border-[#DFCFD4] dark:border-[#543745] font-semibold text-[10px] hover:bg-slate-100 dark:hover:bg-white/5"
                          >
                            Sound {ch.soundEnabled ? '✓' : '✕'}
                          </button>
                          <button
                            onClick={() => toggleChannelProp(ch.id, 'vibrationEnabled')}
                            className="px-2 py-0.5 rounded-lg border border-[#DFCFD4] dark:border-[#543745] font-semibold text-[10px] hover:bg-slate-100 dark:hover:bg-white/5"
                          >
                            Vibe {ch.vibrationEnabled ? '✓' : '✕'}
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => triggerTestNotification(ch.id)}
                      className="px-2.5 py-1 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#87204B] dark:text-[#FFAEC8] font-bold text-[10px] hover:brightness-105 flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Test Push</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: QUIET HOURS SETTINGS                              */}
          {/* ======================================================== */}
          {activeTab === 'quiet_hours' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Moon className="w-5 h-5 text-[#87204B] dark:text-[#FFAEC8]" />
                    <div>
                      <div className="font-bold text-sm text-[#2D1F24] dark:text-white">
                        Quiet Hours Schedule
                      </div>
                      <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                        Silences non-emergency notifications during sleep
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHoursEnabled}
                    onChange={(e) => {
                      setQuietHoursEnabled(e.target.checked);
                      localStorage.setItem('twobe_quiet_hours_enabled', String(e.target.checked));
                      showToast(
                        e.target.checked ? 'Quiet Hours enabled 🌙' : 'Quiet Hours disabled'
                      );
                    }}
                    className="w-5 h-5 rounded text-[#87204B] accent-[#87204B]"
                  />
                </div>

                {/* Status indicator */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#180F15] border border-[#DFCFD4] dark:border-[#3D2833] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#5D474F] dark:text-[#E6D7DE]">
                    Current Status:
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      isQuietNow
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {isQuietNow ? '🌙 Active (Notifications Silenced)' : '☀️ Inactive (Standard Sounds)'}
                  </span>
                </div>

                {/* Time range inputs */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-[11px] text-[#2D1F24] dark:text-white block mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => {
                        setQuietHoursStart(e.target.value);
                        localStorage.setItem('twobe_quiet_hours_start', e.target.value);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-[#2D1F24] dark:text-white block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => {
                        setQuietHoursEnd(e.target.value);
                        localStorage.setItem('twobe_quiet_hours_end', e.target.value);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Strict Non-negotiable Exceptions */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5 text-[11px]">
                <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Safety & Priority Exceptions (Always Audible)</span>
                </div>
                <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                  Even when Quiet Hours are active, the following two critical channels will <strong>always sound and bypass DND</strong>:
                </p>
                <div className="space-y-1 pt-1 font-semibold text-[#87204B] dark:text-[#FFAEC8]">
                  <div>• Connection Requests (72h unpair cooling-off notification)</div>
                  <div>• System Emergency Alerts (device security and unauthorized access)</div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LIVE SIMULATOR & NOTIFICATION SHADE               */}
          {/* ======================================================== */}
          {activeTab === 'simulator' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#2D1F24] dark:text-white">
                    Simulated Android Notification Shade
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Tap any notification card or action button to test deep-link routing.
                  </div>
                </div>
                {simulatedNotifications.length > 0 && (
                  <button
                    onClick={() => setSimulatedNotifications([])}
                    className="text-[11px] font-bold text-[#87204B] dark:text-[#FFAEC8] underline"
                  >
                    Clear Shade
                  </button>
                )}
              </div>

              {/* Quick trigger row */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {['messages', 'kisses_hugs', 'locked_letters', 'milestones', 'unpair_requests'].map((id) => (
                  <button
                    key={id}
                    onClick={() => triggerTestNotification(id)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#23171F] border border-[#DFCFD4] dark:border-[#4D3340] text-[10px] font-bold whitespace-nowrap hover:border-[#87204B]"
                  >
                    + {id.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Grouping test button */}
              <button
                onClick={() => {
                  triggerTestNotification('messages');
                  triggerTestNotification('messages');
                  triggerTestNotification('messages');
                  showToast('Grouped 3 messages from partner under GROUP_MESSAGES 💬', 'love');
                }}
                className="w-full py-1.5 rounded-xl border border-[#DFCFD4] dark:border-[#543745] text-[10px] font-bold text-[#87204B] dark:text-[#FFAEC8] bg-[#FFF9F6] dark:bg-[#1A1217] hover:brightness-105"
              >
                Simulate 3+ Messages Grouping (Summary Notification)
              </button>

              {/* Active notifications */}
              {simulatedNotifications.length === 0 ? (
                <div className="p-8 text-center text-[#8B7578] dark:text-[#E6D7DE] border border-dashed border-[#DFCFD4] dark:border-[#543745] rounded-2xl">
                  No notifications in shade. Tap any test button above.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {simulatedNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleDeepLinkClick(n.deepLinkDestination)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] shadow-md space-y-2 cursor-pointer hover:border-[#87204B] transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">2Be • {n.channelId}</span>
                          {n.silencedByQuietHours && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                              Silenced by Quiet Hours
                            </span>
                          )}
                          {n.bypassedDnd && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">
                              DND Bypass
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8B7578]">{n.time}</span>
                      </div>

                      <div>
                        <div className="font-bold text-xs text-[#2D1F24] dark:text-white">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE]">
                          {n.body}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1 border-t border-[#F0DFE3] dark:border-[#3D2833]">
                        {n.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Action "${act}" executed for ${n.title}`, 'love');
                              handleDeepLinkClick(n.deepLinkDestination);
                            }}
                            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1A1217] text-[#87204B] dark:text-[#FFAEC8] font-bold text-[10px] hover:brightness-105"
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ANDROID 13+ PERMISSION AUDIT                      */}
          {/* ======================================================== */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#2D1F24] dark:text-white flex items-center gap-2">
                      <span>POST_NOTIFICATIONS Permission</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hasPostNotificationPermission
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {hasPostNotificationPermission ? 'Granted' : 'Denied'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE] mt-1">
                      Android 13+ requires explicit runtime opt-in for notification delivery.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#180F15] border border-[#DFCFD4] dark:border-[#3D2833] text-[11px] space-y-1">
                  <div className="font-bold text-[#2D1F24] dark:text-white">
                    Google Play Required Disclosure:
                  </div>
                  <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                    <em>"2Be uses notifications to keep you connected with your partner in real time for messages, affection pulses, and locked letter unseals."</em>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const next = !hasPostNotificationPermission;
                    setHasPostNotificationPermission(next);
                    localStorage.setItem('twobe_post_notif_perm', next ? 'granted' : 'denied');
                    showToast(
                      next ? 'Notification permission GRANTED ✨' : 'Notification permission DENIED',
                      'info'
                    );
                  }}
                  className={`w-full py-2.5 rounded-full font-bold text-xs shadow-sm transition ${
                    hasPostNotificationPermission
                      ? 'bg-slate-200 dark:bg-white/10 text-[#4A3B40] dark:text-white'
                      : 'bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white'
                  }`}
                >
                  {hasPostNotificationPermission ? 'Revoke Permission (Simulate Denied)' : 'Grant POST_NOTIFICATIONS Permission'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-bold text-[#4A3B40] dark:text-[#E6D7DE]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
