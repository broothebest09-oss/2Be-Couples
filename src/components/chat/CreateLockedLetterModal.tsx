import React, { useState } from 'react';
import {
  X,
  Lock,
  Calendar,
  Sparkles,
  Heart,
  Smile,
  MapPin,
  Camera,
  Film,
  Send,
  Eye,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LockedLetterPayload } from '../../types';

interface CreateLockedLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: LockedLetterPayload) => void;
  senderName?: string;
}

export const CreateLockedLetterModal: React.FC<CreateLockedLetterModalProps> = ({
  isOpen,
  onClose,
  onSend,
  senderName = 'You'
}) => {
  const [content, setContent] = useState('');
  const [conditionType, setConditionType] = useState<'date_time' | 'after_action' | 'location'>('date_time');
  
  // Date time state (default 2 days ahead)
  const defaultDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [unlockDate, setUnlockDate] = useState(defaultDate);
  const [unlockTime, setUnlockTime] = useState('12:00');

  // Action state
  const [actionType, setActionType] = useState<'kisses' | 'hugs' | 'snaps' | 'messages'>('kisses');
  const [targetCount, setTargetCount] = useState(10);

  // Location state
  const [locationName, setLocationName] = useState('Paris Airport');
  const [radiusMeters, setRadiusMeters] = useState(500);

  // General toggles
  const [showCountdown, setShowCountdown] = useState(true);

  // Media attachments
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [attachedVideos, setAttachedVideos] = useState<string[]>([]);

  if (!isOpen) return null;

  const maxChars = 5000;
  const remainingChars = maxChars - content.length;

  const getConditionSummary = () => {
    switch (conditionType) {
      case 'date_time': {
        const d = new Date(`${unlockDate}T${unlockTime}`);
        const formatted = isNaN(d.getTime())
          ? `${unlockDate} at ${unlockTime}`
          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ` at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        return `Opens on ${formatted}`;
      }
      case 'after_action':
        return `Opens after partner sends ${targetCount} ${actionType}`;
      case 'location':
        return `Opens when partner arrives at ${locationName || 'designated spot'} (within ${radiusMeters}m)`;
    }
  };

  const handleAddSamplePhoto = () => {
    if (attachedPhotos.length < 5) {
      const samples = [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80'
      ];
      setAttachedPhotos([...attachedPhotos, samples[attachedPhotos.length % samples.length]]);
    }
  };

  const handleAddSampleVideo = () => {
    if (attachedVideos.length < 2) {
      setAttachedVideos([...attachedVideos, 'https://assets.mixkit.co/videos/preview/mixkit-holding-hands-on-a-sunny-day-41662-large.mp4']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const payload: LockedLetterPayload = {
      id: 'letter_' + Date.now(),
      senderName,
      letterContent: content.trim(),
      conditionType,
      unlockDateTime: conditionType === 'date_time' ? `${unlockDate}T${unlockTime}` : undefined,
      targetActionType: conditionType === 'after_action' ? actionType : undefined,
      targetActionCount: conditionType === 'after_action' ? targetCount : undefined,
      currentActionCount: 0,
      locationName: conditionType === 'location' ? locationName.trim() : undefined,
      locationRadiusMeters: conditionType === 'location' ? radiusMeters : undefined,
      currentDistanceMeters: 1400,
      showCountdownToPartner: showCountdown,
      isUnlocked: false,
      mediaItems: [
        ...attachedPhotos.map((url, i) => ({ id: `p_${i}`, url, isVideo: false })),
        ...attachedVideos.map((url, i) => ({ id: `v_${i}`, url, isVideo: true, durationText: '0:15' }))
      ],
      createdAtText: 'Just now'
    };

    onSend(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1416] rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/40 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Write a Locked Letter</h3>
              <p className="text-xs text-white/80">Sealed with love & end-to-end encrypted</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Letter Content Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Letter Message
              </label>
              <span className={`text-xs ${remainingChars < 100 ? 'text-amber-500 font-bold' : 'text-gray-400'}`}>
                {remainingChars} chars remaining
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
              placeholder="Pour your heart out... This letter remains securely locked until your condition is met."
              rows={5}
              required
              className="w-full p-3.5 text-sm rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none font-serif leading-relaxed"
            />
          </div>

          {/* Media Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Optional Keepsakes ({attachedPhotos.length}/5 photos, {attachedVideos.length}/2 videos)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  disabled={attachedPhotos.length >= 5}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 flex items-center gap-1 disabled:opacity-40"
                >
                  <Camera className="w-3.5 h-3.5" /> + Photo
                </button>
                <button
                  type="button"
                  onClick={handleAddSampleVideo}
                  disabled={attachedVideos.length >= 2}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900/50 hover:bg-pink-100 flex items-center gap-1 disabled:opacity-40"
                >
                  <Film className="w-3.5 h-3.5" /> + Video
                </button>
              </div>
            </div>

            {(attachedPhotos.length > 0 || attachedVideos.length > 0) && (
              <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-gray-50 dark:bg-neutral-900/50 border border-dashed border-rose-200 dark:border-rose-950/40">
                {attachedPhotos.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group border border-rose-200">
                    <img src={url} alt="attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachedPhotos(attachedPhotos.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {attachedVideos.map((url, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group bg-neutral-800 flex items-center justify-center border border-pink-300">
                    <Film className="w-6 h-6 text-pink-300" />
                    <button
                      type="button"
                      onClick={() => setAttachedVideos(attachedVideos.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Condition Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Select Unlock Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConditionType('date_time')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  conditionType === 'date_time'
                    ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold shadow-sm'
                    : 'border-gray-200 dark:border-neutral-800 hover:border-rose-200 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Calendar className="w-5 h-5 mb-1 text-rose-500" />
                <span className="text-xs">Date & Time</span>
              </button>

              <button
                type="button"
                onClick={() => setConditionType('after_action')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  conditionType === 'after_action'
                    ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold shadow-sm'
                    : 'border-gray-200 dark:border-neutral-800 hover:border-rose-200 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-1 text-pink-500" />
                <span className="text-xs">After Action</span>
              </button>

              <button
                type="button"
                onClick={() => setConditionType('location')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  conditionType === 'location'
                    ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold shadow-sm'
                    : 'border-gray-200 dark:border-neutral-800 hover:border-rose-200 text-gray-600 dark:text-gray-400'
                }`}
              >
                <MapPin className="w-5 h-5 mb-1 text-rose-500" />
                <span className="text-xs">Location</span>
              </button>
            </div>
          </div>

          {/* Condition-specific Inputs */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-neutral-900/60 border border-rose-100 dark:border-rose-950/30 space-y-3">
            {conditionType === 'date_time' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose the exact moment when the letter will automatically unseal:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Unlock Date
                    </label>
                    <input
                      type="date"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Unlock Time
                    </label>
                    <input
                      type="time"
                      value={unlockTime}
                      onChange={(e) => setUnlockTime(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {conditionType === 'after_action' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Letter unlocks after your partner completes a playful affection goal:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Action Type
                    </label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as any)}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                      <option value="kisses">💋 Send Kisses</option>
                      <option value="hugs">🤗 Send Hugs</option>
                      <option value="snaps">📸 Send Snaps</option>
                      <option value="messages">💬 Send Messages</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Target Count
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-sm text-gray-900 dark:text-gray-100">
                        {targetCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTargetCount(Math.min(100, targetCount + 1))}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {conditionType === 'location' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Letter unlocks when GPS places your partner near a memorable location:
                </p>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                    Location Name / Landmark
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Airport, Central Park, Our First Cafe"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                    Required Proximity Radius
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { meters: 100, label: '100m (Spot)' },
                      { meters: 500, label: '500m (Area)' },
                      { meters: 1000, label: '1km (City)' }
                    ].map((item) => (
                      <button
                        key={item.meters}
                        type="button"
                        onClick={() => setRadiusMeters(item.meters)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                          radiusMeters === item.meters
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Countdown toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Show live countdown to partner
                </span>
              </div>
              <input
                type="checkbox"
                checked={showCountdown}
                onChange={(e) => setShowCountdown(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-500"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200/80 dark:border-rose-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Live Preview
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-200/60 dark:bg-rose-900/40 flex items-center justify-center text-xl">
                🔒
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                  Sealed Love Letter
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-300 truncate font-medium">
                  {getConditionSummary()}
                </p>
              </div>
            </div>
          </div>

          {/* Security badge & Submit */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted with client keys. Only partner can unlock.</span>
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send Sealed Letter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
