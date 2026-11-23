import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ChevronLeft,
  Plus,
  Heart,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const OurFutureModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { showToast } = useCouple();

  const [dreamBoardItems, setDreamBoardItems] = useState([
    {
      id: '1',
      title: 'Our Sun-Drenched Country Cottage',
      subtitle: 'Surrounded by lavender fields and our future rescue dogs',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
      category: 'Home & Sanctuary'
    },
    {
      id: '2',
      title: 'Backpacking Through Japan',
      subtitle: 'Kyoto bamboo groves, steaming bowls of ramen, and tea ceremonies',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      category: 'Travel Adventures'
    },
    {
      id: '3',
      title: 'Building Our Ceramic Studio',
      subtitle: 'Wheel throwing together on weekend afternoons with jazz playing',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      category: 'Creative Life'
    }
  ]);

  const [showAddDream, setShowAddDream] = useState(false);
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamSubtitle, setDreamSubtitle] = useState('');
  const [dreamCategory, setDreamCategory] = useState('Home & Sanctuary');

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamTitle.trim()) return;

    setDreamBoardItems(prev => [
      {
        id: `${Date.now()}`,
        title: dreamTitle.trim(),
        subtitle: dreamSubtitle.trim() || 'A shared dream for our tomorrow.',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        category: dreamCategory
      },
      ...prev
    ]);

    setDreamTitle('');
    setDreamSubtitle('');
    setShowAddDream(false);
    showToast('Vision pinned to Our Future board ✨', 'love');
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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Our Future</h2>
        <div className="w-12" />
      </div>

      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-xs uppercase font-bold text-rose-600 dark:text-rosegold-400 block">
            Vision & Dream Board
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">
            Visualizing the life, places, and memories we are creating together.
          </span>
        </div>
        <button
          onClick={() => setShowAddDream(true)}
          className="text-xs text-rose-600 dark:text-softpink-400 hover:text-rose-700 dark:hover:text-softpink-300 flex items-center gap-1 font-semibold shrink-0 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Pin Vision
        </button>
      </div>

      {/* Dream Board Cards Grid */}
      <div className="space-y-3.5">
        {dreamBoardItems.map(item => (
          <div
            key={item.id}
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm dark:shadow-xl hover:border-purple-300 dark:hover:border-lavender-400/40 transition"
          >
            <div className="h-44 w-full overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-midnight-950 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-midnight-950/80 backdrop-blur-md text-[10px] uppercase font-bold text-rose-600 dark:text-rosegold-300 border border-slate-200 dark:border-white/10 shadow-xs">
                {item.category}
              </span>
            </div>

            <div className="p-4 relative">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Dream */}
      {showAddDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-midnight-950/85 backdrop-blur-md">
          <form
            onSubmit={handleAddDream}
            className="w-full max-w-sm bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Pin New Couple Vision</h3>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Vision Title</label>
              <input
                type="text"
                value={dreamTitle}
                onChange={e => setDreamTitle(e.target.value)}
                placeholder="e.g. Northern Lights Roadtrip, Tiny House by the Sea"
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Category</label>
              <select
                value={dreamCategory}
                onChange={e => setDreamCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              >
                <option value="Home & Sanctuary">Home & Sanctuary</option>
                <option value="Travel Adventures">Travel Adventures</option>
                <option value="Creative Life">Creative Life</option>
                <option value="Family & Companions">Family & Companions</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Details & Feelings</label>
              <textarea
                value={dreamSubtitle}
                onChange={e => setDreamSubtitle(e.target.value)}
                placeholder="What feelings and details do you envision?"
                rows={3}
                className="w-full bg-slate-50 dark:bg-midnight-950 border border-slate-300 dark:border-lavender-400/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-400"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddDream(false)}
                className="flex-1 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow"
              >
                Pin Vision ✨
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
