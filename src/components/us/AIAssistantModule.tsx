import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Send,
  Lock,
  Copy,
  Check,
  Heart,
  Calendar,
  Gift
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const AIAssistantModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const {
    aiConsents,
    updateAIConsents,
    currentUser,
    partnerUser,
    sendMessage,
    showToast
  } = useCouple();

  const [activeFeature, setActiveFeature] = useState<'draft' | 'date' | 'gift' | 'privacy'>('draft');
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-baked intelligent prompts
  const dateNightThemes = [
    'Cozy Rainstorm Living Room Fort Date',
    'Amalfi Coast Candlelit Pasta Night',
    'Stargazing Picnic with Hot Cider',
    'Vinyl Record Discovery & Painting Night'
  ];

  const handleGenerate = (promptType: string, userQuery?: string) => {
    setIsGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsGenerating(false);
      if (promptType === 'draft') {
        setAiResponse(
          `"My dearest ${partnerUser.nickname || partnerUser.name.split(' ')[0]}, just wanted to pause in the middle of a busy day to tell you how deeply proud I am of everything you do. You make the ordinary world feel extraordinary. Can’t wait to wrap my arms around you tonight."`
        );
      } else if (promptType === 'date') {
        setAiResponse(
          `Date Concept: "The Parisian Living Room Cafe"\n\n1. Ambience: Soft jazz playlist, dim lamps, fairy lights.\n2. Culinary: Fresh baguette, warm Brie with honey and walnuts, crisp sparkling cider.\n3. Activity: Share 3 childhood polaroids and tell the backstory.\n4. Ending: Slow dance in socks on the hardwood floor.`
        );
      } else if (promptType === 'gift') {
        setAiResponse(
          `Gift Ideas for ${partnerUser.name.split(' ')[0]}:\n\n1. Custom embossed leather journal with coordinates of your first coffee shop meeting.\n2. Ceramic hand-thrown matcha bowl in sage green.\n3. Framed constellation map of the night sky when you both met in June 2023.`
        );
      }
    }, 1200);
  };

  const handleSendToChat = () => {
    if (!aiResponse) return;
    sendMessage({
      text: aiResponse
    });
    showToast('Sent directly into your couple messenger! ❤️', 'love');
  };

  const handleCopy = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Copied to clipboard', 'info');
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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">2Be AI Companion</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => {
            setActiveFeature('draft');
            setAiResponse(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeFeature === 'draft'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Love Drafts
        </button>
        <button
          onClick={() => {
            setActiveFeature('date');
            setAiResponse(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeFeature === 'date'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Date Planner
        </button>
        <button
          onClick={() => {
            setActiveFeature('gift');
            setAiResponse(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeFeature === 'gift'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Gifts
        </button>
        <button
          onClick={() => {
            setActiveFeature('privacy');
            setAiResponse(null);
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeFeature === 'privacy'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Privacy 🔒
        </button>
      </div>

      {/* Strict Consent & Guardrails Header (Section 7.9) */}
      <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Consent-First AI: 2Be AI operates solely upon request. By default, raw private chats, health logs, and intimate photos are strictly excluded from AI analysis.
        </span>
      </div>

      {/* FEATURE 1: MESSAGE DRAFTER */}
      {activeFeature === 'draft' && (
        <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
              Thoughtful Message Drafter
            </span>
            <span className="text-xs text-purple-700 dark:text-lavender-300 font-medium">
              For {partnerUser.name.split(' ')[0]}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Need words when your mind feels full? Let 2Be AI draft an affectionate, deeply appreciative note.
          </p>

          <button
            onClick={() => handleGenerate('draft')}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? 'Composing Heartfelt Note...' : 'Draft Sweet Appreciation Note'}
          </button>
        </div>
      )}

      {/* FEATURE 2: DATE PLANNER */}
      {activeFeature === 'date' && (
        <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
              Creative Date Night Architect
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Generate an enchanting, budget-conscious, or luxurious couple date itinerary.
          </p>

          <div className="space-y-2">
            {dateNightThemes.map((theme, i) => (
              <button
                key={i}
                onClick={() => handleGenerate('date', theme)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 text-xs text-left text-slate-800 dark:text-slate-200 hover:border-purple-300 dark:hover:border-lavender-400/40 transition active:scale-95 flex items-center justify-between"
              >
                <span>{theme}</span>
                <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-rosegold-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 3: GIFT CONCIERGE */}
      {activeFeature === 'gift' && (
        <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 space-y-4 shadow-sm dark:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
              Meaningful Gift Concierge
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Suggest thoughtful, personalized surprises based on memories and shared interests.
          </p>

          <button
            onClick={() => handleGenerate('gift')}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Gift className="w-3.5 h-3.5" />
            {isGenerating ? 'Brainstorming Thoughtful Gifts...' : 'Generate Gift Inspirations'}
          </button>
        </div>
      )}

      {/* FEATURE 4: AI PRIVACY & CONSENT TOGGLES (Section 7.9 & 10) */}
      {activeFeature === 'privacy' && (
        <div className="rounded-3xl p-5 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 space-y-4 shadow-sm dark:shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400 block">
            Granular AI Permissions & Consents
          </span>

          <div className="space-y-3 text-xs">
            {/* Message Drafting Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-900 dark:text-white font-medium block">Message Drafting Assistance</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Allow AI to offer phrasing suggestions</span>
              </div>
              <input
                type="checkbox"
                checked={aiConsents.allowMessageDrafting}
                onChange={e => updateAIConsents({ allowMessageDrafting: e.target.checked })}
                className="accent-softpink-500 w-4 h-4"
              />
            </div>

            {/* Date Planning Toggle */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-2">
              <div>
                <span className="text-slate-900 dark:text-white font-medium block">Date & Event Planning</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Suggest itinerary and recipe ideas</span>
              </div>
              <input
                type="checkbox"
                checked={aiConsents.allowDatePlanning}
                onChange={e => updateAIConsents({ allowDatePlanning: e.target.checked })}
                className="accent-softpink-500 w-4 h-4"
              />
            </div>

            {/* Health Context (Protected default: FALSE) */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-2">
              <div>
                <span className="text-rose-600 dark:text-rose-300 font-medium block">Health & Cycle Context</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Allow AI to see cycle data (Strictly OFF by default)
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiConsents.allowHealthContext}
                onChange={e => updateAIConsents({ allowHealthContext: e.target.checked })}
                className="accent-rose-500 w-4 h-4"
              />
            </div>

            {/* Intimate Media (Protected default: FALSE) */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-2">
              <div>
                <span className="text-rose-600 dark:text-rose-300 font-medium block">Intimate Media Scanning</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Strictly blocked by policy to guarantee total safety
                </span>
              </div>
              <input
                type="checkbox"
                disabled
                checked={aiConsents.allowIntimateMediaScanning}
                className="accent-rose-500 w-4 h-4 opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generated AI Result Card */}
      {aiResponse && (
        <div className="rounded-3xl p-5 bg-gradient-to-br from-white to-rose-50/50 dark:from-midnight-950 dark:to-midnight-900 border border-rose-300 dark:border-softpink-400/40 space-y-3 shadow-md dark:shadow-2xl animate-pulse-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-softpink-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 2Be AI Proposal
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-midnight-900/90 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-wrap border border-slate-200/80 dark:border-transparent">
            {aiResponse}
          </div>

          <button
            onClick={handleSendToChat}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-xs font-semibold shadow-md active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Send into Couple Messenger
          </button>
        </div>
      )}
    </div>
  );
};
