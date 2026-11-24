import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Search,
  Pin,
  Smile,
  Send,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Check,
  CheckCheck,
  Heart,
  Flame,
  Eye,
  Trash2,
  X,
  Reply,
  Copy,
  FileText,
  Download,
  Film,
  Camera,
  Palette,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Volume2,
  Lock,
  Flag,
  ShieldAlert
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { CallModal } from './CallModal';
import { KissHugSyncOverlay } from '../common/KissHugSyncOverlay';
import { CreateLockedLetterModal } from './CreateLockedLetterModal';
import { LockedLetterStatusDialog } from './LockedLetterStatusDialog';
import { OpenLockedLetterModal } from './OpenLockedLetterModal';
import { WeNeedToTalkModal } from './WeNeedToTalkModal';
import { ReportContentModal } from '../legal/ReportContentModal';
import { ChatMessage, LockedLetterPayload } from '../../types';

export const ChatScreen: React.FC = () => {
  const {
    messages,
    sendMessage,
    currentUser,
    partnerUser,
    sendSecretLove,
    sendMissYou,
    sendKiss,
    toggleReaction,
    pinMessage,
    deleteMessage,
    startCall,
    unlockLockedLetter,
    showToast,
    pairingStatus
  } = useCouple();

  // Input and search state
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showStickerTray, setShowStickerTray] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isViewOnceMode, setIsViewOnceMode] = useState(false);
  const [chatTheme, setChatTheme] = useState<'instagram' | 'midnight' | 'rosegold' | 'lavender'>('instagram');
  const [activeKissHugOverlay, setActiveKissHugOverlay] = useState<'kiss' | 'hug' | null>(null);

  // Locked Letter states
  const [showCreateLockedLetterModal, setShowCreateLockedLetterModal] = useState(false);
  const [activeLockedLetterStatus, setActiveLockedLetterStatus] = useState<LockedLetterPayload | null>(null);
  const [activeOpenLockedLetter, setActiveOpenLockedLetter] = useState<LockedLetterPayload | null>(null);

  // We Need to Talk mode
  const [showWeNeedToTalkModal, setShowWeNeedToTalkModal] = useState(false);
  const [isGentleModeActive, setIsGentleModeActive] = useState(false);

  // Swipe-to-reply & reply-to state
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    senderName: string;
    text: string;
    mediaType?: string;
  } | null>(null);

  // Active floating reaction message ID
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [doubleTapBurstId, setDoubleTapBurstId] = useState<string | null>(null);
  const [reportingMessage, setReportingMessage] = useState<{ id: string; snippet: string } | null>(null);

  // Touch and swipe state
  const [swipedMessageId, setSwipedMessageId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);
  const lastTapTimeRef = useRef<{ [msgId: string]: number }>({});

  // Voice recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);

  // File input refs
  const fileInputMediaRef = useRef<HTMLInputElement>(null);
  const fileInputDocRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceTimer(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Handle Send text or message with reply
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      text: inputText.trim(),
      replyTo: replyingTo || undefined
    });

    setInputText('');
    setReplyingTo(null);
  };

  // Double tap to like (Instagram signature interaction)
  const handleMessageTap = (msg: ChatMessage) => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current[msg.id] || 0;

    if (now - lastTap < 320) {
      // Double tap detected!
      setDoubleTapBurstId(msg.id);
      toggleReaction(msg.id, '❤️');
      setTimeout(() => setDoubleTapBurstId(null), 900);
      lastTapTimeRef.current[msg.id] = 0;
    } else {
      lastTapTimeRef.current[msg.id] = now;
      // Toggle reaction bar on single tap/click
      setActiveReactionMsgId(prev => (prev === msg.id ? null : msg.id));
    }
  };

  // Touch Swipe to Reply handlers (Slide left to reply)
  const handleTouchStart = (e: React.TouchEvent, msgId: string) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent, msgId: string) => {
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    // Only allow horizontal swipe left (negative deltaX)
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
      isSwipingRef.current = true;
      setSwipedMessageId(msgId);
      // Limit swipe distance
      const clampedOffset = Math.max(-80, deltaX);
      setSwipeOffset(clampedOffset);
    }
  };

  const handleTouchEnd = (msg: ChatMessage) => {
    if (isSwipingRef.current && swipeOffset < -45) {
      // Trigger reply!
      triggerReplyTo(msg);
    }
    setSwipedMessageId(null);
    setSwipeOffset(0);
    isSwipingRef.current = false;
  };

  // Mouse Drag Swipe for Desktop Users
  const handleMouseDown = (e: React.MouseEvent, msgId: string) => {
    touchStartXRef.current = e.clientX;
    isSwipingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent, msgId: string) => {
    if (!isSwipingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (deltaX < 0) {
      setSwipedMessageId(msgId);
      setSwipeOffset(Math.max(-80, deltaX));
    }
  };

  const handleMouseUp = (msg: ChatMessage) => {
    if (isSwipingRef.current && swipeOffset < -45) {
      triggerReplyTo(msg);
    }
    setSwipedMessageId(null);
    setSwipeOffset(0);
    isSwipingRef.current = false;
  };

  const triggerReplyTo = (msg: ChatMessage) => {
    const isSender = msg.senderId === currentUser.id;
    const senderName = isSender ? 'You' : partnerUser.nickname || partnerUser.name;
    const previewText =
      msg.text ||
      (msg.mediaType === 'image'
        ? '📷 Photo'
        : msg.mediaType === 'video'
        ? '🎥 Video'
        : msg.mediaType === 'document'
        ? `📄 ${msg.fileName || 'Document'}`
        : msg.mediaType === 'audio'
        ? '🎤 Voice Note'
        : msg.mediaType === 'locked_letter'
        ? '💌 Locked Love Letter'
        : 'Sticker');

    setReplyingTo({
      id: msg.id,
      senderName,
      text: previewText,
      mediaType: msg.mediaType
    });

    showToast(`Replying to ${senderName}`, 'info');
  };

  const handleLockedLetterClick = (msg: ChatMessage) => {
    if (!msg.lockedLetter) return;
    if (msg.lockedLetter.isUnlocked) {
      setActiveOpenLockedLetter(msg.lockedLetter);
    } else {
      let conditionMet = false;
      if (msg.lockedLetter.conditionType === 'date_time' && msg.lockedLetter.unlockDateTime) {
        conditionMet = new Date(msg.lockedLetter.unlockDateTime).getTime() <= Date.now();
      }
      if (conditionMet) {
        setActiveOpenLockedLetter(msg.lockedLetter);
      } else {
        setActiveLockedLetterStatus(msg.lockedLetter);
      }
    }
  };

  // Handle uploading real photos or videos via Clipper
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = event => {
        const resultUrl = event.target?.result as string;
        sendMessage({
          mediaUrl: resultUrl,
          mediaType: isVideo ? 'video' : 'image',
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          isViewOnce: isViewOnceMode,
          viewOnceTimer: 5,
          replyTo: replyingTo || undefined,
          text: isViewOnceMode ? 'Sent a confidential view-once photo' : undefined
        });
      };
      reader.readAsDataURL(file);
    }

    setShowAttachmentMenu(false);
    setIsViewOnceMode(false);
    setReplyingTo(null);
    showToast('Media uploaded into conversation! 📸', 'love');
    if (fileInputMediaRef.current) fileInputMediaRef.current.value = '';
  };

  // Handle uploading real documents (PDF, Word, TXT) via Clipper
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const reader = new FileReader();

    reader.onload = event => {
      const fileData = event.target?.result as string;
      sendMessage({
        mediaType: 'document',
        mediaUrl: fileData,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: extension,
        replyTo: replyingTo || undefined,
        text: `Shared document: ${file.name}`
      });
    };
    reader.readAsDataURL(file);

    setShowAttachmentMenu(false);
    setReplyingTo(null);
    showToast(`Attached ${file.name} 📎`, 'info');
    if (fileInputDocRef.current) fileInputDocRef.current.value = '';
  };

  // Finish Voice Note recording
  const handleFinishVoiceRecord = () => {
    setIsRecordingVoice(false);
    sendMessage({
      mediaType: 'audio',
      audioDuration: Math.max(3, voiceTimer),
      waveform: [25, 45, 80, 95, 65, 40, 75, 85, 55, 30, 60, 40, 20],
      replyTo: replyingTo || undefined
    });
    setReplyingTo(null);
  };

  // Send sample cute sticker (Instagram style)
  const handleSendSticker = (stickerText: string, stickerEmoji: string) => {
    sendMessage({
      mediaType: 'sticker',
      text: stickerText,
      replyTo: replyingTo || undefined
    });
    setShowStickerTray(false);
    setReplyingTo(null);
    showToast(`Sticker sent! ${stickerEmoji}`, 'love');
  };

  const scrollToMessage = (msgId: string) => {
    const el = messageRefs.current[msgId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-rose-500', 'dark:ring-softpink-400', 'transition-all');
      setTimeout(() => el.classList.remove('ring-2', 'ring-rose-500', 'dark:ring-softpink-400'), 1500);
    }
  };

  const copyMessageText = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('Message copied to clipboard', 'info');
    setActiveReactionMsgId(null);
  };

  const pinnedMessages = messages.filter(m => m.isPinned);
  const filteredMessages = messages.filter(m =>
    searchQuery ? m.text?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const emojiBar = ['❤️', '😂', '😮', '😢', '👏', '🔥', '🥰', '💋'];

  // Instagram-style Theme gradients (with high-contrast white & dark mode surfaces)
  const themeStyles = {
    instagram: {
      sentBubble: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white shadow-md',
      receivedBubble: 'bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-500/20 text-slate-900 dark:text-slate-100 shadow-sm',
      accent: 'text-[#FD1D1D]'
    },
    midnight: {
      sentBubble: 'bg-gradient-to-br from-purple-700 via-indigo-700 to-midnight-800 text-white shadow-md',
      receivedBubble: 'bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-500/20 text-slate-900 dark:text-slate-100 shadow-sm',
      accent: 'text-purple-600 dark:text-purple-400'
    },
    rosegold: {
      sentBubble: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white shadow-md',
      receivedBubble: 'bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-rose-500/20 text-slate-900 dark:text-slate-100 shadow-sm',
      accent: 'text-rose-600 dark:text-rose-400'
    },
    lavender: {
      sentBubble: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-lavender-600 text-white shadow-md',
      receivedBubble: 'bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 text-slate-900 dark:text-slate-100 shadow-sm',
      accent: 'text-purple-700 dark:text-lavender-300'
    }
  };

  const activeTheme = themeStyles[chatTheme];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-md mx-auto relative select-none">
      <CallModal />

      {/* Hidden File Inputs for real Clipper Attachments */}
      <input
        type="file"
        ref={fileInputMediaRef}
        onChange={handleMediaUpload}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputDocRef}
        onChange={handleDocUpload}
        accept=".pdf,.doc,.docx,.txt,.zip,.xls,.xlsx,.csv,.ppt,.pptx"
        className="hidden"
      />

      {/* TOP BAR: Partner status, Instagram theme picker, Call actions */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/90 dark:border-lavender-500/15">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-300 dark:ring-lavender-400/40 shadow-sm"
            />
            {partnerUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-midnight-950" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {partnerUser.nickname || partnerUser.name}
              </h2>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active in private space
            </span>
          </div>
        </div>

        {/* Top Actions: Theme, Search, Calls */}
        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setShowWeNeedToTalkModal(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition text-purple-600 dark:text-purple-300"
            title="We Need to Talk Mode (Gentle Conversation)"
          >
            🕊️
          </button>
          <button
            onClick={() => setShowThemePicker(prev => !prev)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition text-amber-600 dark:text-rosegold-400"
            title="Instagram Chat Themes"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => startCall('voice')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition text-purple-700 dark:text-lavender-300"
            title="Start Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => startCall('video')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition text-rose-600 dark:text-softpink-400"
            title="Start Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSearch(prev => !prev)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gentle Mode Active Banner */}
      {isGentleModeActive && (
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-900/40 flex items-center justify-between text-xs animate-fade-in my-1 rounded-2xl">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <span>🕊️</span>
            <span className="font-semibold">Gentle Conversation Mode</span>
            <span className="opacity-70 text-[11px] hidden sm:inline">• Slower pace, vulnerability space</span>
          </div>
          <button
            onClick={() => setIsGentleModeActive(false)}
            className="px-2.5 py-1 rounded-lg bg-purple-200/80 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold text-[11px] hover:bg-purple-300"
          >
            Exit Mode
          </button>
        </div>
      )}

      {/* Theme Picker Drawer (Conditional) */}
      {showThemePicker && (
        <div className="py-2.5 px-3 bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-500/20 rounded-2xl flex items-center justify-between my-1 text-xs shadow-md">
          <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-softpink-400" /> Theme:
          </span>
          <div className="flex gap-1.5">
            {[
              { id: 'instagram', label: 'Instagram Glow' },
              { id: 'rosegold', label: 'Sunset Rose' },
              { id: 'lavender', label: 'Lavender' },
              { id: 'midnight', label: 'Velvet' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setChatTheme(t.id as any);
                  setShowThemePicker(false);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  chatTheme === t.id
                    ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white font-bold shadow-sm'
                    : 'bg-[#F8F6F2] dark:bg-midnight-950 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Input Bar (Conditional) */}
      {showSearch && (
        <div className="py-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in private conversation..."
              className="w-full bg-white dark:bg-midnight-900 border border-slate-300 dark:border-lavender-400/30 text-xs rounded-xl pl-8 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
              autoFocus
            />
          </div>
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pinned Message Banner */}
      {pinnedMessages.length > 0 && !showSearch && (
        <div
          onClick={() => scrollToMessage(pinnedMessages[pinnedMessages.length - 1].id)}
          className="cursor-pointer mt-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-midnight-900/90 border border-slate-200/90 dark:border-lavender-400/20 flex items-center justify-between text-xs text-purple-800 dark:text-lavender-300 hover:border-purple-300 dark:hover:border-lavender-400/40 transition shadow-sm"
        >
          <div className="flex items-center space-x-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-500 dark:text-rosegold-400 shrink-0" />
            <span className="truncate text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {pinnedMessages[pinnedMessages.length - 1].text}
            </span>
          </div>
          <span className="text-[10px] text-purple-700 dark:text-slate-400 font-bold shrink-0 ml-2">Jump to Pinned</span>
        </div>
      )}

      {/* Quick Love Pulse / Miss You / Kiss triggers */}
      <div className="py-2 flex items-center justify-between border-b border-slate-200/80 dark:border-lavender-500/10 text-xs">
        <button
          onClick={sendSecretLove}
          className="flex-1 mr-1 py-1.5 px-2 rounded-xl bg-rose-50 dark:bg-softpink-500/15 border border-rose-200 dark:border-softpink-400/30 text-rose-700 dark:text-softpink-300 flex items-center justify-center gap-1.5 hover:bg-rose-100 dark:hover:bg-softpink-500/25 active:scale-95 transition font-bold shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 dark:fill-softpink-400" />
          <span>Love Pulse</span>
        </button>

        <button
          onClick={sendMissYou}
          className="flex-1 mx-1 py-1.5 px-2 rounded-xl bg-purple-50 dark:bg-lavender-500/15 border border-purple-200 dark:border-lavender-400/30 text-purple-700 dark:text-lavender-300 flex items-center justify-center gap-1.5 hover:bg-purple-100 dark:hover:bg-lavender-500/25 active:scale-95 transition font-bold shadow-sm"
        >
          <Flame className="w-3.5 h-3.5 text-purple-600 dark:text-lavender-400" />
          <span>Miss You</span>
        </button>

        <button
          onClick={sendKiss}
          className="flex-1 ml-1 py-1.5 px-2 rounded-xl bg-amber-50 dark:bg-rosegold-500/15 border border-amber-200 dark:border-rosegold-400/30 text-amber-800 dark:text-rosegold-300 flex items-center justify-center gap-1.5 hover:bg-amber-100 dark:hover:bg-rosegold-500/25 active:scale-95 transition font-bold shadow-sm"
        >
          <span>💋 Kiss</span>
        </button>
      </div>

      {/* MESSAGE FEED with SWIPE TO REPLY & DOUBLE-TAP TO REACT */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scroll-smooth">
        {filteredMessages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto min-h-[350px]">
            <div className="w-16 h-16 rounded-full bg-[#E8A5B9]/20 border border-[#E8A5B9]/40 flex items-center justify-center text-[#E8A5B9] animate-pulse">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                Your Private Sanctuary is Ready
              </h3>
              <p className="text-xs text-[#8B7578] dark:text-[#A89598] mt-1.5 max-w-xs mx-auto leading-relaxed">
                Everything here is end-to-end encrypted. Say hello or send a secret kiss to {partnerUser.name} to start your story 💕
              </p>
            </div>
            <button
              onClick={sendKiss}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-bold shadow-rose-glow active:scale-95 transition flex items-center space-x-1.5"
            >
              <span>💋 Send First Kiss</span>
            </button>
          </div>
        )}
        {filteredMessages.map((msg, index) => {
          const isSender = msg.senderId === currentUser.id;
          const isSwiped = swipedMessageId === msg.id;
          const currentOffset = isSwiped ? swipeOffset : 0;
          const isLastReadByPartner =
            isSender && index === filteredMessages.length - 1 && msg.status === 'read';

          return (
            <div
              key={msg.id}
              ref={el => (messageRefs.current[msg.id] = el)}
              className="relative group transition-all"
            >
              {/* Swipe Reply indicator behind message (reveals when pulled left) */}
              <div
                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-200 ${
                  currentOffset < -15 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    currentOffset < -45
                      ? 'bg-rose-500 text-white scale-110'
                      : 'bg-slate-200 dark:bg-midnight-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Reply className="w-4 h-4 transform rotate-180" />
                </div>
              </div>

              {/* Message Bubble Container with Swipe Transform */}
              <div
                style={{ transform: `translateX(${currentOffset}px)` }}
                onTouchStart={e => handleTouchStart(e, msg.id)}
                onTouchMove={e => handleTouchMove(e, msg.id)}
                onTouchEnd={() => handleTouchEnd(msg)}
                onMouseDown={e => handleMouseDown(e, msg.id)}
                onMouseMove={e => handleMouseMove(e, msg.id)}
                onMouseUp={() => handleMouseUp(msg)}
                className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} transition-transform`}
              >
                <div className="relative max-w-[85%]">
                  {/* Quoted Reply Header (if this message is replying to another) */}
                  {msg.replyTo && (
                    <div
                      onClick={() => scrollToMessage(msg.replyTo!.id)}
                      className={`cursor-pointer mb-1 px-3 py-1.5 rounded-xl border-l-4 border-rose-500 dark:border-softpink-400 text-xs flex items-center justify-between transition shadow-sm ${
                        isSender
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-[#F5F1EB] dark:bg-midnight-950/70 text-slate-800 dark:text-slate-300 hover:bg-[#EFEAE2]'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className={`text-[10px] uppercase font-bold block ${
                          isSender ? 'text-white' : 'text-purple-700 dark:text-softpink-400'
                        }`}>
                          Replying to {msg.replyTo.senderName}
                        </span>
                        <span className={`text-[11px] truncate block ${
                          isSender ? 'text-white/90' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {msg.replyTo.text}
                        </span>
                      </div>
                      <Reply className="w-3.5 h-3.5 opacity-70 shrink-0 transform rotate-180" />
                    </div>
                  )}

                  {/* Main Bubble */}
                  <div
                    onClick={() => handleMessageTap(msg)}
                    className={`relative rounded-3xl px-4 py-2.5 shadow-sm text-sm cursor-pointer transition select-text leading-relaxed ${
                      isSender
                        ? `${activeTheme.sentBubble} rounded-tr-sm`
                        : `${activeTheme.receivedBubble} rounded-tl-sm`
                    }`}
                  >
                    {/* Double Tap Heart Burst Animation */}
                    {doubleTapBurstId === msg.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <span className="text-5xl animate-heart-burst filter drop-shadow-lg">
                          ❤️
                        </span>
                      </div>
                    )}

                    {/* Pinned label */}
                    {msg.isPinned && (
                      <div className="flex items-center gap-1 text-[10px] font-bold mb-1 opacity-90">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </div>
                    )}

                    {/* View-Once Confidential Image/Video */}
                    {msg.isViewOnce && (
                      <div className="flex items-center space-x-2 py-2 px-1 text-rose-500 dark:text-softpink-300">
                        <Eye className="w-5 h-5 animate-pulse" />
                        <div className="text-xs">
                          <span className="font-bold block">View-Once Confidential Media</span>
                          <span className="text-[10px] opacity-80">Self-destruct timer (5s)</span>
                        </div>
                      </div>
                    )}

                    {/* Standard Image Attachment */}
                    {!msg.isViewOnce && msg.mediaType === 'image' && msg.mediaUrl && (
                      <div className="mb-2 rounded-2xl overflow-hidden max-h-64 shadow">
                        <img
                          src={msg.mediaUrl}
                          alt="Attached Photo"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                    )}

                    {/* Video Attachment */}
                    {!msg.isViewOnce && msg.mediaType === 'video' && msg.mediaUrl && (
                      <div className="mb-2 rounded-2xl overflow-hidden max-h-64 shadow bg-black">
                        <video
                          src={msg.mediaUrl}
                          controls
                          className="w-full max-h-60 rounded-2xl object-cover"
                        />
                      </div>
                    )}

                    {/* Document Attachment Card (PDF, Docs, Sheets) */}
                    {msg.mediaType === 'document' && (
                      <div className={`mb-2 p-3 rounded-2xl border flex items-center justify-between space-x-3 shadow-sm ${
                        isSender
                          ? 'bg-black/20 border-white/20 text-white'
                          : 'bg-[#F8F6F2] dark:bg-midnight-950/80 border-slate-200 dark:border-lavender-500/30 text-slate-900 dark:text-slate-100'
                      }`}>
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-extrabold text-xs uppercase">
                            {msg.fileType || 'PDF'}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold block truncate">
                              {msg.fileName || 'Shared Document'}
                            </span>
                            <span className="text-[10px] opacity-75 font-medium">
                              {msg.fileSize || 'Document'}
                            </span>
                          </div>
                        </div>

                        {msg.mediaUrl && (
                          <a
                            href={msg.mediaUrl}
                            download={msg.fileName || 'document.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 shrink-0 active:scale-90 transition"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Locked Letter Attachment Bubble */}
                    {msg.mediaType === 'locked_letter' && (
                      <div
                        onClick={() => handleLockedLetterClick(msg)}
                        className={`mb-2 p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md ${
                          msg.lockedLetter?.isUnlocked
                            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60'
                            : isSender
                            ? 'bg-black/20 border-white/20 text-white'
                            : 'bg-white dark:bg-midnight-950 border-rose-200 dark:border-rose-950/40 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                            msg.lockedLetter?.isUnlocked
                              ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-600'
                              : 'bg-rose-500/20 text-rose-500'
                          }`}>
                            {msg.lockedLetter?.isUnlocked ? '💌' : '🔒'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold truncate">
                                {msg.lockedLetter?.isUnlocked ? 'Unsealed Love Letter' : 'Sealed Love Letter'}
                              </h4>
                              {msg.lockedLetter?.isUnlocked && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold">
                                  Unlocked ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] opacity-80 truncate mt-0.5 font-medium">
                              {msg.lockedLetter?.isUnlocked
                                ? 'Tap to re-read your love letter'
                                : msg.lockedLetter?.conditionType === 'date_time'
                                ? `Opens on ${new Date(msg.lockedLetter.unlockDateTime || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                : msg.lockedLetter?.conditionType === 'after_action'
                                ? `Goal: ${msg.lockedLetter.currentActionCount || 0}/${msg.lockedLetter.targetActionCount || 10} ${msg.lockedLetter.targetActionType || 'kisses'}`
                                : `Location: ${msg.lockedLetter?.locationName || 'Special spot'}`}
                            </p>
                          </div>
                        </div>

                        {/* Action-based progress bar */}
                        {!msg.lockedLetter?.isUnlocked && msg.lockedLetter?.conditionType === 'after_action' && (
                          <div className="mt-2.5 pt-2 border-t border-current/10">
                            <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (((msg.lockedLetter.currentActionCount || 0) /
                                      (msg.lockedLetter.targetActionCount || 10)) *
                                      100)
                                  )}%`
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-[10px] opacity-70 font-semibold flex items-center justify-between">
                          <span>{msg.lockedLetter?.isUnlocked ? 'Read letter →' : 'Check status / unlock →'}</span>
                          <span>🔒 2Be Encrypted</span>
                        </div>
                      </div>
                    )}

                    {/* Sticker Message */}
                    {msg.mediaType === 'sticker' && (
                      <div className="text-4xl py-2 px-1 text-center font-serif">
                        {msg.text}
                      </div>
                    )}

                    {/* Voice Note Player */}
                    {msg.mediaType === 'audio' && (
                      <VoiceNotePlayer
                        duration={msg.audioDuration}
                        waveform={msg.waveform}
                        isSender={isSender}
                      />
                    )}

                    {/* Text content */}
                    {msg.mediaType !== 'sticker' && msg.text && (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Footer: timestamp + read receipts */}
                    <div className="flex items-center justify-end space-x-1.5 mt-1 text-[10px] opacity-80 font-medium">
                      <span>{msg.timestamp}</span>
                      {isSender && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-300 dark:text-emerald-300 inline" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-white/80 dark:text-slate-300 inline" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-white/70 dark:text-slate-400 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reactions Tray attached under the message bubble */}
                  {msg.reactions.length > 0 && (
                    <div className="flex space-x-1 mt-1 -mb-1">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => toggleReaction(msg.id, r.emoji)}
                          className={`text-xs px-2 py-0.5 rounded-full border shadow-sm flex items-center space-x-1 active:scale-90 transition ${
                            r.users.includes(currentUser.id)
                              ? 'bg-purple-100 dark:bg-lavender-500/40 border-purple-300 dark:border-lavender-400 text-purple-900 dark:text-white font-bold'
                              : 'bg-white dark:bg-midnight-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{r.emoji}</span>
                          {r.count > 1 && <span className="font-extrabold text-[10px]">{r.count}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Instagram-Style Floating Reaction & Action Bar (when message is tapped) */}
                  {activeReactionMsgId === msg.id && (
                    <div className="absolute z-40 -top-12 left-0 right-auto bg-white/95 dark:bg-midnight-950/95 border border-slate-200 dark:border-lavender-400/40 backdrop-blur-xl rounded-full px-2.5 py-1.5 flex items-center space-x-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                      {emojiBar.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            toggleReaction(msg.id, emoji);
                            setActiveReactionMsgId(null);
                          }}
                          className="text-lg p-0.5 hover:scale-135 active:scale-95 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                      <div className="w-[1px] h-4 bg-slate-300 dark:bg-white/20 mx-1" />
                      <button
                        onClick={() => {
                          triggerReplyTo(msg);
                          setActiveReactionMsgId(null);
                        }}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        title="Reply to message"
                      >
                        <Reply className="w-3.5 h-3.5 transform rotate-180" />
                      </button>
                      <button
                        onClick={() => copyMessageText(msg.text)}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          pinMessage(msg.id);
                          setActiveReactionMsgId(null);
                        }}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-rosegold-400"
                        title="Pin message"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      {isSender && (
                        <button
                          onClick={() => {
                            deleteMessage(msg.id);
                            setActiveReactionMsgId(null);
                          }}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Unsend message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setReportingMessage({
                            id: msg.id,
                            snippet: msg.text || msg.mediaType || 'Encrypted Attachment'
                          });
                          setActiveReactionMsgId(null);
                        }}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                        title="Report message to Safety Team"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Instagram "Seen" avatar indicator */}
                {isLastReadByPartner && (
                  <div className="flex items-center space-x-1 mt-1 pr-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <img
                      src={partnerUser.avatar}
                      alt="Seen by partner"
                      className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-white/20"
                    />
                    <span>Seen</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice recording live indicator */}
      {isRecordingVoice && (
        <div className="py-2 px-4 rounded-2xl bg-rose-50 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 flex items-center justify-between animate-pulse my-1">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span>Recording voice note: 0:0{voiceTimer}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRecordingVoice(false)}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishVoiceRecord}
              className="text-xs bg-rose-600 text-white font-bold px-3 py-1 rounded-xl shadow"
            >
              Send Voice
            </button>
          </div>
        </div>
      )}

      {/* INSTAGRAM-STYLE REPLYING BANNER (above the input bar) */}
      {replyingTo && (
        <div className="px-3 py-2 rounded-2xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-softpink-400/40 flex items-center justify-between text-xs mb-1.5 shadow-md">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-softpink-500/20 flex items-center justify-center text-rose-600 dark:text-softpink-400 shrink-0">
              <Reply className="w-3.5 h-3.5 transform rotate-180" />
            </div>
            <div className="truncate">
              <span className="font-bold text-rose-600 dark:text-softpink-300 block text-[11px]">
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate block font-medium">
                {replyingTo.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INSTAGRAM-STYLE STICKER TRAY (Conditional) */}
      {showStickerTray && (
        <div className="p-3 bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl mb-2 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-purple-800 dark:text-lavender-300">Couple Stickers</span>
            <button
              onClick={() => setShowStickerTray(false)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { text: 'I Love You ❤️', emoji: '❤️' },
              { text: 'Sending Cuddles 🫂', emoji: '🫂' },
              { text: 'Tender Kisses 💋', emoji: '💋' },
              { text: 'Miss You So Much 🌸', emoji: '🌸' },
              { text: 'Thinking of You ✨', emoji: '✨' },
              { text: 'Goodnight Darling 🌙', emoji: '🌙' },
              { text: 'Coffee Date? ☕️', emoji: '☕️' },
              { text: 'Proud of You 🏆', emoji: '🏆' }
            ].map(sticker => (
              <button
                key={sticker.text}
                onClick={() => handleSendSticker(sticker.text, sticker.emoji)}
                className="p-2.5 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20 hover:border-purple-300 dark:hover:border-softpink-400/50 hover:bg-purple-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
              >
                <span className="text-xl block mb-1">{sticker.emoji}</span>
                <span className="text-[10px] text-slate-800 dark:text-slate-300 font-semibold leading-tight block truncate">
                  {sticker.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CLIPPER ATTACHMENT MENU (Instagram / Messenger style) */}
      {showAttachmentMenu && (
        <div className="p-3 bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl mb-2 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Attach Media & Documents</span>
            <button
              onClick={() => setShowAttachmentMenu(false)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            {/* Photos & Videos */}
            <button
              onClick={() => fileInputMediaRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20 hover:border-purple-300 dark:hover:border-softpink-400 hover:bg-purple-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-700 dark:text-purple-400 mb-1.5 font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Photos</span>
            </button>

            {/* Videos */}
            <button
              onClick={() => fileInputMediaRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20 hover:border-purple-300 dark:hover:border-softpink-400 hover:bg-purple-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-1.5 font-bold">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Videos</span>
            </button>

            {/* Document / PDF */}
            <button
              onClick={() => fileInputDocRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-200 dark:border-lavender-500/20 hover:border-purple-300 dark:hover:border-softpink-400 hover:bg-purple-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-700 dark:text-cyan-400 mb-1.5 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Document</span>
            </button>

            {/* View-Once Mode */}
            <button
              onClick={() => {
                setIsViewOnceMode(prev => !prev);
                showToast(`View-Once mode ${!isViewOnceMode ? 'Enabled' : 'Disabled'}`, 'info');
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 shadow-sm ${
                isViewOnceMode
                  ? 'bg-rose-50 dark:bg-softpink-500/20 border-rose-400 dark:border-softpink-400 text-rose-700'
                  : 'bg-[#F8F6F2] dark:bg-midnight-950 border-slate-200 dark:border-lavender-500/20 hover:bg-purple-50 dark:hover:bg-midnight-800'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 font-bold ${
                  isViewOnceMode ? 'bg-rose-500 text-white' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}
              >
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {isViewOnceMode ? 'View 1x (On)' : 'View-Once'}
              </span>
            </button>

            {/* Send Kiss Sync */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setActiveKissHugOverlay('kiss');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-pink-50 to-rose-50 dark:bg-midnight-950 border border-pink-200 dark:border-pink-500/20 hover:border-pink-400 hover:bg-pink-100 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center text-xl mb-1.5 font-bold">
                💋
              </div>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">Send Kiss</span>
            </button>

            {/* Send Hug Sync */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setActiveKissHugOverlay('hug');
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-purple-50 to-lavender-50 dark:bg-midnight-950 border border-purple-200 dark:border-purple-500/20 hover:border-purple-400 hover:bg-purple-100 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-xl mb-1.5 font-bold">
                🤗
              </div>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Send Hug</span>
            </button>

            {/* Locked Letter */}
            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                setShowCreateLockedLetterModal(true);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-rose-50 to-amber-50 dark:bg-midnight-950 border border-rose-200 dark:border-rose-500/20 hover:border-rose-400 hover:bg-rose-100 transition active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-xl mb-1.5 font-bold">
                💌
              </div>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">Locked Letter</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM INPUT BAR with CLIPPER (Paperclip) SYMBOL or Read-Only Banner */}
      <div className="pt-2">
        {pairingStatus === 'dissolved' ? (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E141B] border border-[#F0DFE3] dark:border-[#4D3340] shadow-sm text-center space-y-1">
            <div className="text-xs font-bold text-[#87204B] dark:text-[#FFAEC8] flex items-center justify-center gap-1.5">
              <span>🔒 Archived Conversation (Read-Only)</span>
            </div>
            <p className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
              This connection has been dissolved. Messages are read-only. Access your full history in <strong>Settings &gt; Archived Data</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex items-center space-x-2">
            {/* CLIPPER SYMBOL (Paperclip) button */}
            <button
              type="button"
              onClick={() => {
                setShowAttachmentMenu(prev => !prev);
                setShowStickerTray(false);
              }}
              title="Attach Photos, Videos, Documents (PDF) & Files"
              className={`p-2.5 rounded-full border transition active:scale-95 shadow-sm ${
                showAttachmentMenu
                  ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white border-transparent'
                  : 'bg-white dark:bg-midnight-900 border-slate-300 dark:border-lavender-500/20 text-purple-700 dark:text-lavender-300 hover:text-purple-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-midnight-800'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Quick Camera Capture Button */}
            <button
              type="button"
              onClick={() => fileInputMediaRef.current?.click()}
              title="Camera & Photos"
              className="p-2.5 rounded-full bg-white dark:bg-midnight-900 border border-slate-300 dark:border-lavender-500/20 text-purple-700 dark:text-lavender-300 hover:text-purple-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Text Input Container */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Message ${partnerUser.nickname || partnerUser.name}...`}
                className="w-full bg-white dark:bg-midnight-900 border border-slate-300 dark:border-lavender-500/30 text-slate-900 dark:text-white placeholder-slate-400 rounded-full pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:border-rose-500 dark:focus:border-softpink-400 shadow-sm"
              />
              {/* Sticker / Smile Tray Button */}
              <button
                type="button"
                onClick={() => {
                  setShowStickerTray(prev => !prev);
                  setShowAttachmentMenu(false);
                }}
                title="Stickers & Emojis"
                className="absolute right-3 text-slate-400 hover:text-rose-500 dark:hover:text-softpink-400 transition"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            {/* Send or Voice Record Button */}
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow-md transition active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecordingVoice(prev => !prev)}
                className="p-2.5 rounded-full bg-white dark:bg-midnight-900 border border-slate-300 dark:border-lavender-500/20 text-purple-700 dark:text-lavender-300 hover:text-purple-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-midnight-800 transition active:scale-95 shadow-sm"
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Kiss / Hug Synchronized Hold Overlay */}
      {activeKissHugOverlay && (
        <KissHugSyncOverlay
          type={activeKissHugOverlay}
          onClose={() => setActiveKissHugOverlay(null)}
        />
      )}

      {/* Create Locked Letter Modal */}
      <CreateLockedLetterModal
        isOpen={showCreateLockedLetterModal}
        onClose={() => setShowCreateLockedLetterModal(false)}
        senderName="You"
        onSend={(payload) => {
          setShowCreateLockedLetterModal(false);
          sendMessage({
            mediaType: 'locked_letter',
            text: `Sent a sealed letter: "${payload.letterContent.slice(0, 30)}..." 💌`,
            lockedLetter: payload
          });
          showToast('Locked letter sealed & sent to chat! 💌', 'love');
        }}
      />

      {/* Locked Letter Status Dialog */}
      <LockedLetterStatusDialog
        isOpen={!!activeLockedLetterStatus}
        letter={activeLockedLetterStatus}
        onClose={() => setActiveLockedLetterStatus(null)}
        onUnlockSuccess={() => {
          if (activeLockedLetterStatus) {
            unlockLockedLetter(activeLockedLetterStatus.id);
            const unlocked = { ...activeLockedLetterStatus, isUnlocked: true };
            setActiveLockedLetterStatus(null);
            setActiveOpenLockedLetter(unlocked);
            showToast('Letter unsealed! ✨', 'love');
          }
        }}
      />

      {/* Open Locked Letter Modal */}
      <OpenLockedLetterModal
        isOpen={!!activeOpenLockedLetter}
        letter={activeOpenLockedLetter}
        onClose={() => setActiveOpenLockedLetter(null)}
        onReply={(quote) => {
          setInputText(`Re: "${quote.slice(0, 45)}..." `);
          showToast('Quoting letter in reply', 'info');
        }}
      />

      {/* We Need to Talk Conflict Mode Modal */}
      <WeNeedToTalkModal
        isOpen={showWeNeedToTalkModal}
        partnerName={partnerUser.nickname || partnerUser.name}
        onClose={() => setShowWeNeedToTalkModal(false)}
        onEnterGentleMode={() => {
          setIsGentleModeActive(true);
          showToast('Gentle Conversation Mode active 🕊️', 'info');
        }}
      />

      {/* Trust & Safety: Report Content Modal */}
      <ReportContentModal
        isOpen={!!reportingMessage}
        messageId={reportingMessage?.id}
        messageSnippet={reportingMessage?.snippet}
        onClose={() => setReportingMessage(null)}
      />
    </div>
  );
};
