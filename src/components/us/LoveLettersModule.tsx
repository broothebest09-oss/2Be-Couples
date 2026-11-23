import React, { useState } from 'react';
import {
  Mail,
  Send,
  Calendar,
  Sparkles,
  ChevronLeft,
  Heart,
  Plus,
  PenTool,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { LoveLetter } from '../../types';

export const LoveLettersModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    loveLetters,
    sendLoveLetter,
    openLoveLetter,
    currentUser,
    partnerUser,
    showToast
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);

  // Compose letter form state
  const [letterTitle, setLetterTitle] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [letterSignature, setLetterSignature] = useState(`Forever yours, ${currentUser.name.split(' ')[0]}`);
  const [stationery, setStationery] = useState<LoveLetter['stationery']>('vintage');
  const [sealColor, setSealColor] = useState('#E0A96D');
  const [scheduledDate, setScheduledDate] = useState('');

  const stationeryThemes = {
    vintage: 'bg-[#F9F4EB] text-slate-800 border-[#E8DFD1]',
    midnight: 'bg-midnight-950 text-slate-100 border-lavender-500/30',
    rose: 'bg-[#FFF5F7] text-rose-950 border-rose-200',
    minimal: 'bg-white dark:bg-midnight-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-white/10'
  };

  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterBody.trim()) return;

    sendLoveLetter({
      title: letterTitle.trim(),
      body: letterBody.trim(),
      signature: letterSignature.trim(),
      stationery,
      sealColor,
      scheduledDeliveryDate: scheduledDate || undefined
    });

    setLetterTitle('');
    setLetterBody('');
    setActiveTab('inbox');
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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Love Letters</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => {
            setActiveTab('inbox');
            setSelectedLetter(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'inbox'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Sealed Letters ({loveLetters.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('compose');
            setSelectedLetter(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'compose'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Write Letter ✍️
        </button>
      </div>

      {/* TAB 1: INBOX / LETTER VIEWER */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {selectedLetter ? (
            /* Selected Letter Reader with Stationery theme */
            <div className="space-y-3">
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-xs text-purple-600 dark:text-lavender-300 hover:text-slate-900 dark:hover:text-white flex items-center transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Back to letters
              </button>

              <div
                className={`rounded-3xl p-6 border shadow-2xl space-y-4 transition-all ${
                  stationeryThemes[selectedLetter.stationery]
                }`}
              >
                {/* Wax seal ornament */}
                <div className="flex justify-between items-center border-b border-black/10 pb-3">
                  <span className="text-[11px] uppercase tracking-widest font-semibold opacity-70">
                    Sealed with Devotion
                  </span>
                  <div
                    style={{ backgroundColor: selectedLetter.sealColor }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md text-xs font-bold"
                  >
                    ❤️
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold tracking-tight">
                  {selectedLetter.title}
                </h3>

                <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif italic">
                  {selectedLetter.body}
                </p>

                <div className="pt-4 border-t border-black/10 text-right">
                  <span className="font-handwriting text-2xl block text-rose-600 dark:text-softpink-400">
                    {selectedLetter.signature}
                  </span>
                  <span className="text-[10px] opacity-60 block mt-1">
                    Delivered on {new Date(selectedLetter.deliveredAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Letter List */
            <div className="space-y-3">
              {loveLetters.map(letter => {
                const isFromMe = letter.senderId === currentUser.id;

                return (
                  <div
                    key={letter.id}
                    onClick={() => {
                      setSelectedLetter(letter);
                      openLoveLetter(letter.id);
                    }}
                    className="cursor-pointer rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-md flex items-center justify-between group hover:border-purple-300 dark:hover:border-lavender-400/50 transition"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        style={{ backgroundColor: letter.sealColor }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base shadow shrink-0"
                      >
                        💌
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-softpink-300 transition">
                          {letter.title}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {isFromMe ? 'Written by You' : `From ${partnerUser.nickname || partnerUser.name}`} •{' '}
                          {new Date(letter.deliveredAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {letter.isOpened ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Read
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-softpink-500 text-white font-bold">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPOSE LOVE LETTER */}
      {activeTab === 'compose' && (
        <form
          onSubmit={handleSendLetter}
          className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 space-y-4 shadow-sm dark:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
              Stationery & Wax Seal Letter
            </span>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1">Letter Title</label>
            <input
              type="text"
              value={letterTitle}
              onChange={e => setLetterTitle(e.target.value)}
              placeholder="e.g. For When You Miss Me Most"
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              required
            />
          </div>

          {/* Stationery Theme picker */}
          <div>
            <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1.5">Stationery Paper Theme</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'vintage', label: 'Vintage' },
                { id: 'midnight', label: 'Midnight' },
                { id: 'rose', label: 'Petals' },
                { id: 'minimal', label: 'Clean' }
              ].map(st => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStationery(st.id as any)}
                  className={`py-2 rounded-xl text-center font-medium border transition ${
                    stationery === st.id
                      ? 'bg-purple-100 dark:bg-lavender-500/25 border-purple-400 dark:border-lavender-400 text-purple-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-midnight-950 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:border-purple-300'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1">Your Letter</label>
            <textarea
              value={letterBody}
              onChange={e => setLetterBody(e.target.value)}
              rows={5}
              placeholder="Pour your sweetest, most tender thoughts into words..."
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 leading-relaxed font-serif"
              required
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1">Handwritten Signature</label>
            <input
              type="text"
              value={letterSignature}
              onChange={e => setLetterSignature(e.target.value)}
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Scheduled Delivery */}
          <div>
            <label className="text-slate-600 dark:text-slate-400 text-xs block mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-600 dark:text-lavender-400" /> Future Scheduled Delivery (Optional)
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-softpink-500 via-rose-500 to-lavender-500 text-white text-xs font-semibold shadow-rose-glow active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Seal & Deliver Love Letter
          </button>
        </form>
      )}
    </div>
  );
};
