import React, { useState } from 'react';
import {
  Camera,
  Images,
  RotateCcw,
  Zap,
  ZapOff,
  Eye,
  Heart,
  Plus,
  Send,
  Download,
  BookmarkPlus,
  Sparkles,
  Lock
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { MediaItem } from '../../types';

export const SnapScreen: React.FC = () => {
  const {
    albums,
    media,
    addMedia,
    addAlbum,
    addMemory,
    currentUser,
    partnerUser,
    sendMessage,
    showToast
  } = useCouple();

  const [activeSnapTab, setActiveSnapTab] = useState<'camera' | 'gallery'>('camera');
  const [filterMode, setFilterMode] = useState<'normal' | 'warm' | 'film' | 'lavender'>('warm');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isViewOnce, setIsViewOnce] = useState(false);
  const [viewOnceTimer, setViewOnceTimer] = useState(5);
  const [captionInput, setCaptionInput] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albums[0]?.id || '');
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<MediaItem | null>(null);

  // New album modal state
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');

  // Sample curated camera shots
  const sampleShots = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  ];

  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>(sampleShots[0]);

  const handleCapture = () => {
    // Pick next shot
    const currentIndex = sampleShots.indexOf(previewPhotoUrl);
    const nextShot = sampleShots[(currentIndex + 1) % sampleShots.length];
    setPreviewPhotoUrl(nextShot);
    showToast('Snap captured! Choose to send or save below.', 'info');
  };

  const handleSendSnap = () => {
    if (isViewOnce) {
      sendMessage({
        mediaUrl: previewPhotoUrl,
        mediaType: 'image',
        isViewOnce: true,
        viewOnceTimer: viewOnceTimer,
        text: captionInput || `View-once private snap from ${currentUser.name.split(' ')[0]}`
      });
      showToast(`View-once snap sent to ${partnerUser.name}! 🔐`, 'love');
    } else {
      addMedia({
        url: previewPhotoUrl,
        type: 'image',
        uploaderId: currentUser.id,
        caption: captionInput,
        albumId: selectedAlbumId,
        isFavorite: false
      });
      sendMessage({
        mediaUrl: previewPhotoUrl,
        mediaType: 'image',
        text: captionInput || `Captured a new moment for our gallery`
      });
      showToast('Saved to shared gallery and sent in chat! 📸', 'love');
    }
    setCaptionInput('');
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;
    addAlbum(newAlbumTitle.trim(), previewPhotoUrl);
    setNewAlbumTitle('');
    setShowNewAlbumModal(false);
  };

  const handleSaveToMemories = (item: MediaItem) => {
    addMemory({
      title: item.caption || 'Cherished Photo Memory',
      date: item.date,
      category: 'milestones',
      description: `Captured by ${item.uploaderId === currentUser.id ? currentUser.name : partnerUser.name}`,
      imageUrl: item.url
    });
    showToast('Preserved into Our Memories timeline! ✨', 'love');
  };

  const filterStyles = {
    normal: '',
    warm: 'sepia-[0.25] saturate-125 contrast-105',
    film: 'contrast-115 brightness-95 grayscale-[0.2]',
    lavender: 'hue-rotate-15 saturate-110'
  };

  return (
    <div className="space-y-4 pb-24 pt-2 max-w-md mx-auto">
      {/* Sub tabs: Snap Camera vs Shared Gallery */}
      <div className="flex p-1 rounded-2xl bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-500/20 shadow-sm">
        <button
          onClick={() => setActiveSnapTab('camera')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSnapTab === 'camera'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Camera & Snap
        </button>
        <button
          onClick={() => setActiveSnapTab('gallery')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeSnapTab === 'gallery'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-white'
          }`}
        >
          <Images className="w-3.5 h-3.5" />
          Shared Gallery ({media.length})
        </button>
      </div>

      {activeSnapTab === 'camera' ? (
        /* CAMERA & SNAP STUDIO */
        <div className="space-y-4">
          {/* Viewfinder Card */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-black border border-lavender-400/20 shadow-2xl">
            <img
              src={previewPhotoUrl}
              alt="Camera View"
              className={`w-full h-full object-cover transition-all duration-300 ${filterStyles[filterMode]}`}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-midnight-950/40 pointer-events-none" />

            {/* Top camera controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
              <button
                onClick={() => setIsFlashOn(prev => !prev)}
                className="p-2.5 rounded-full bg-black/40 backdrop-blur-md active:scale-90 transition"
              >
                {isFlashOn ? <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> : <ZapOff className="w-4 h-4 text-white/70" />}
              </button>

              {/* View-once indicator */}
              <button
                onClick={() => setIsViewOnce(prev => !prev)}
                className={`px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition ${
                  isViewOnce
                    ? 'bg-softpink-500 text-white ring-2 ring-softpink-300'
                    : 'bg-black/40 text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isViewOnce ? `View Once (${viewOnceTimer}s)` : 'Normal Snap'}</span>
              </button>

              <button
                onClick={handleCapture}
                title="Switch Camera angle / sample"
                className="p-2.5 rounded-full bg-black/40 backdrop-blur-md active:scale-90 transition"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Filter pills */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-2">
              {(['normal', 'warm', 'film', 'lavender'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterMode(f)}
                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full backdrop-blur-md transition ${
                    filterMode === f
                      ? 'bg-white text-midnight-950 shadow-md'
                      : 'bg-black/40 text-white/70 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Disclaimer (Section 6.5 of Blueprint) */}
          <div className="p-3 rounded-2xl bg-white dark:bg-midnight-900/60 border border-slate-200/90 dark:border-lavender-500/15 flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium shadow-sm">
            <Lock className="w-4 h-4 text-purple-600 dark:text-lavender-400 shrink-0 mt-0.5" />
            <span>
              End-to-end encrypted shared space. While 2Be includes view-once self-destruct timers and screenshot alerts, no system can prevent photographing a physical screen.
            </span>
          </div>

          {/* Caption & Destination Settings */}
          <div className="p-4 rounded-3xl bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-500/20 space-y-3 shadow-sm">
            <input
              type="text"
              value={captionInput}
              onChange={e => setCaptionInput(e.target.value)}
              placeholder="Write a sweet caption or whisper..."
              className="w-full bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-semibold">Save to Album:</span>
              <select
                value={selectedAlbumId}
                onChange={e => setSelectedAlbumId(e.target.value)}
                className="bg-[#F8F6F2] dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 text-slate-800 dark:text-lavender-300 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none"
              >
                {albums.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Shutter / Send Button */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleCapture}
                className="flex-1 py-3 rounded-2xl bg-[#F8F6F2] hover:bg-slate-200 dark:bg-midnight-800 dark:hover:bg-midnight-700 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-sm"
              >
                <Camera className="w-4 h-4 text-purple-600 dark:text-lavender-400" />
                Retake
              </button>
              <button
                onClick={handleSendSnap}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-softpink-500 via-rose-500 to-lavender-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                {isViewOnce ? 'Send View-Once' : 'Send to Couple'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SHARED GALLERY & ALBUMS */
        <div className="space-y-5">
          {/* Albums header & creation */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Shared Couple Albums
              </span>
              <button
                onClick={() => setShowNewAlbumModal(true)}
                className="text-xs text-rose-600 dark:text-softpink-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> New Album
              </button>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
              {albums.map(album => (
                <div
                  key={album.id}
                  className="shrink-0 w-36 rounded-2xl overflow-hidden bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 group hover:border-purple-300 dark:hover:border-lavender-400/40 transition shadow-sm"
                >
                  <div className="h-24 overflow-hidden relative">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{album.title}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{album.itemCount} photos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Photos Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Moments
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{media.length} items</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {media.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhotoForView(item)}
                  className="cursor-pointer group relative rounded-2xl overflow-hidden aspect-square bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 hover:border-purple-300 dark:hover:border-lavender-400/50 transition shadow-sm"
                >
                  <img
                    src={item.url}
                    alt={item.caption || 'Shared Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-2.5">
                    {item.caption && (
                      <p className="text-[11px] text-white line-clamp-2 leading-tight">
                        {item.caption}
                      </p>
                    )}
                    <span className="text-[9px] text-lavender-300 mt-1">
                      {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Photo Detail */}
      {selectedPhotoForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-midnight-950/95 backdrop-blur-xl">
          <div className="relative max-w-sm w-full bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3">
            <button
              onClick={() => setSelectedPhotoForView(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              ✕
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-black">
              <img
                src={selectedPhotoForView.url}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-slate-900 dark:text-white font-medium leading-relaxed">
                {selectedPhotoForView.caption || 'A quiet, perfect moment between the two of you.'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span>
                  Uploaded by {selectedPhotoForView.uploaderId === currentUser.id ? 'You' : partnerUser.name}
                </span>
                <span>{selectedPhotoForView.date}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSaveToMemories(selectedPhotoForView)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-midnight-800 border border-slate-200 dark:border-lavender-400/20 text-xs font-semibold text-purple-700 dark:text-lavender-300 flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-midnight-700 active:scale-95 transition"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-rose-500 dark:text-rosegold-400" />
                Add to Timeline
              </button>
              <button
                onClick={() => {
                  showToast('Original high-res photo saved to camera roll', 'info');
                  setSelectedPhotoForView(null);
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-midnight-800 border border-slate-200 dark:border-lavender-400/20 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-midnight-700 transition"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Album */}
      {showNewAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateAlbum}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Create Shared Album</h3>
            <input
              type="text"
              value={newAlbumTitle}
              onChange={e => setNewAlbumTitle(e.target.value)}
              placeholder="e.g. Kyoto Cherry Blossoms, Our Cozy Mornings"
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewAlbumModal(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
