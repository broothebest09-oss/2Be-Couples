import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  BookOpen,
  MessageSquare,
  Compass,
  Check
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const GrowthModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'conflict'>('conversations');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(0);

  const guidedTopics = [
    {
      id: 0,
      title: 'Building Unshakeable Trust',
      category: 'Communication',
      duration: '10 min discussion',
      summary: 'Exploring what feeling safe and protected means to both of you.',
      prompts: [
        'When do you feel most securely understood by me?',
        'Is there any small boundary you would like us to honor more gently?',
        'How can we support each other during stressful work weeks?'
      ]
    },
    {
      id: 1,
      title: 'Deepening Emotional Intimacy',
      category: 'Closeness',
      duration: '15 min connection',
      summary: 'Going beyond daily logistics into each other’s inner dream world.',
      prompts: [
        'What is a childhood memory or dream that still shapes who you are today?',
        'What is your favorite quiet moment we shared this past month?',
        'How can I best comfort you when you feel overwhelmed?'
      ]
    },
    {
      id: 2,
      title: 'Aligning on Future Life & Space',
      category: 'Future',
      duration: '15 min alignment',
      summary: 'Conversations around lifestyle, home rhythm, and shared goals.',
      prompts: [
        'What does our ideal living sanctuary look and feel like in 3 years?',
        'How do we want to balance spontaneous adventures with peaceful routine?',
        'What is one tradition we should start together this season?'
      ]
    }
  ];

  const conflictResolutionSteps = [
    {
      step: 'Step 1: Pause & Breathe',
      description: 'Take a brief, consensual pause if emotions are high. Agree that you are on the same team, not opponents.'
    },
    {
      step: 'Step 2: Use "I Feel" Statements',
      description: 'Express personal feelings without accusatory labels (e.g. "I felt anxious when plans changed without notice" instead of "You always ignore me").'
    },
    {
      step: 'Step 3: Reflect & Validate',
      description: 'Summarize what your partner shared before responding ("What I hear you saying is that you felt exhausted and needed reassurance. Is that right?").'
    },
    {
      step: 'Step 4: Craft a Tender Compromise',
      description: 'Identify what concrete, gentle adjustment both partners can make together.'
    }
  ];

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
        <h2 className="text-sm font-serif font-bold text-slate-900 dark:text-white tracking-tight">Relationship Growth</h2>
        <div className="w-12" />
      </div>

      {/* Sub tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-200/70 dark:bg-midnight-900 border border-slate-300/60 dark:border-lavender-500/20 text-xs">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'conversations'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Guided Conversations
        </button>
        <button
          onClick={() => setActiveTab('conflict')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition ${
            activeTab === 'conflict'
              ? 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Constructive Harmony Guide
        </button>
      </div>

      {/* TAB 1: GUIDED CONVERSATIONS */}
      {activeTab === 'conversations' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400">
            Intimate discussion cards designed to help two partners connect deeply without judgment or time pressure.
          </div>

          <div className="space-y-3">
            {guidedTopics.map(topic => {
              const isSelected = selectedTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(isSelected ? null : topic.id)}
                  className={`cursor-pointer rounded-3xl p-5 border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-midnight-900 border-purple-400 dark:border-lavender-400/40 shadow-md dark:shadow-xl'
                      : 'bg-white dark:bg-midnight-900/80 border-slate-200/90 dark:border-lavender-500/15 hover:border-purple-300 dark:hover:border-lavender-400/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rosegold-400">
                      {topic.category} • {topic.duration}
                    </span>
                    <span className="text-xs text-purple-700 dark:text-lavender-300 font-semibold">
                      {isSelected ? 'Collapse' : 'Open Prompts'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{topic.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{topic.summary}</p>

                  {/* Prompts list if expanded */}
                  {isSelected && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5">
                      <span className="text-[11px] uppercase font-bold text-rose-600 dark:text-softpink-300 block">
                        Gentle Prompts to Ask Each Other:
                      </span>
                      {topic.prompts.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic"
                        >
                          "{p}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CONSTRUCTIVE HARMONY GUIDE (Section 7.8 of Blueprint) */}
      {activeTab === 'conflict' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-midnight-900/60 border border-rose-200/60 dark:border-lavender-500/15 text-[11px] text-slate-700 dark:text-slate-400">
            A compassionate framework for navigating misunderstandings. Reminder: 2Be does not replace professional therapy, but provides gentle, de-escalating communication guardrails.
          </div>

          <div className="space-y-3">
            {conflictResolutionSteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-4 bg-white dark:bg-midnight-900 border border-slate-200/90 dark:border-lavender-400/20 shadow-sm space-y-1.5"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rosegold-400">
                  {step.step}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-lavender-500/20 text-center text-xs text-slate-600 dark:text-slate-400 font-serif italic">
            "Remember: It is never You vs. Partner. It is both of you together against the misunderstanding."
          </div>
        </div>
      )}
    </div>
  );
};
