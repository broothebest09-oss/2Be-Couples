import React, { useState } from 'react';
import {
  Music,
  Film,
  Disc,
  Play,
  Plus,
  ChevronLeft,
  Sparkles,
  Shuffle,
  ExternalLink,
  Check
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { EntertainmentItem } from '../../types';

export const EntertainmentModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    entertainment,
    addEntertainment,
    currentUser,
    partnerUser,
    showToast
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'songs' | 'movies' | 'roulette'>('songs');

  // Add song/movie form
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemType, setItemType] = useState<EntertainmentItem['type']>('song');
  const [itemTitle, setItemTitle] = useState('');
  const [itemSubtitle, setItemSubtitle] = useState('');
  const [itemNote, setItemNote] = useState('');

  // Movie roulette state
  const movies = entertainment.filter(e => e.type === 'movie');
  const [rouletteWinner, setRouletteWinner] = useState<EntertainmentItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    addEntertainment({
      type: itemType,
      title: itemTitle.trim(),
      subtitle: itemSubtitle.trim() || undefined,
      note: itemNote.trim() || undefined,
      coverUrl:
        itemType === 'song'
          ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80'
    });

    setItemTitle('');
    setItemSubtitle('');
    setItemNote('');
    setShowAddModal(false);
  };

  const spinMovieRoulette = () => {
    if (movies.length === 0) {
      showToast('Add movies to the watchlist first!', 'info');
      return;
    }
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setRouletteWinner(randomMovie);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        showToast(`Tonight's pick: ${randomMovie.title}! 🍿`, 'love');
      }
    }, 120);
  };

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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Our Entertainment</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => setActiveTab('songs')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'songs'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Song of the Day
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'movies'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Movie Watchlist
        </button>
        <button
          onClick={() => setActiveTab('roulette')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'roulette'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Date Roulette 🎲
        </button>
      </div>

      {/* TAB 1: SONG OF THE DAY & PLAYLISTS */}
      {activeTab === 'songs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Today's Soundtrack
            </span>
            <button
              onClick={() => {
                setItemType('song');
                setShowAddModal(true);
              }}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Dedicate Song
            </button>
          </div>

          <div className="space-y-3">
            {entertainment
              .filter(e => e.type === 'song' || e.type === 'playlist')
              .map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md flex items-start space-x-3.5 group hover:border-purple-300 dark:hover:border-lavender-400/40 transition"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-black">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.sharedAt}</span>
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-purple-700 dark:text-lavender-300 font-medium">{item.subtitle}</p>
                    )}
                    {item.note && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-1 line-clamp-2">
                        "{item.note}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      Dedicated by {item.sharedBy === currentUser.id ? 'You' : partnerUser.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: MOVIE NIGHT WATCHLIST */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              Couch Date Night Watchlist ({movies.length})
            </span>
            <button
              onClick={() => {
                setItemType('movie');
                setShowAddModal(true);
              }}
              className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Movie
            </button>
          </div>

          <div className="space-y-3">
            {movies.map(movie => (
              <div
                key={movie.id}
                className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md flex items-start space-x-3.5"
              >
                <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-black">
                  <img
                    src={movie.coverUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{movie.title}</h4>
                  {movie.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{movie.subtitle}</p>
                  )}
                  {movie.note && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-1 leading-snug">
                      "{movie.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DATE NIGHT ROULETTE */}
      {activeTab === 'roulette' && (
        <div className="rounded-3xl p-6 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 text-center space-y-4 shadow-sm dark:shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-lavender-500/20 border border-purple-200 dark:border-lavender-400/30 flex items-center justify-center mx-auto text-purple-700 dark:text-lavender-300">
            <Shuffle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-serif font-bold text-slate-900 dark:text-white">
              Can't Decide What to Watch Tonight?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Let the 2Be Date Night Roulette randomly pick from your couple watchlist!
            </p>
          </div>

          {rouletteWinner && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-midnight-950 border border-rose-300 dark:border-softpink-400/40 animate-pulse-subtle">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-softpink-300 block mb-1">
                Tonight's Selected Movie:
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{rouletteWinner.title}</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{rouletteWinner.subtitle}</p>
            </div>
          )}

          <button
            onClick={spinMovieRoulette}
            disabled={isSpinning}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-rose-glow active:scale-95 transition disabled:opacity-50"
          >
            {isSpinning ? 'Spinning the Film Reel...' : 'Spin Date Night Roulette 🍿'}
          </button>
        </div>
      )}

      {/* Modal: Add Entertainment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleAddItem}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Add {itemType === 'song' ? 'Song' : 'Movie'} to Lounge
            </h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                value={itemTitle}
                onChange={e => setItemTitle(e.target.value)}
                placeholder={itemType === 'song' ? 'e.g. Texas Sun' : 'e.g. Past Lives'}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Artist / Genre / Year</label>
              <input
                type="text"
                value={itemSubtitle}
                onChange={e => setItemSubtitle(e.target.value)}
                placeholder="e.g. Leon Bridges • Soul"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Why this reminds me of you</label>
              <textarea
                value={itemNote}
                onChange={e => setItemNote(e.target.value)}
                placeholder="Write a sweet note..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
