import React from 'react';
import { Check, Sparkles, X, Heart } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const SubscriptionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { coupleSpace, upgradeSubscription, showToast } = useCouple();

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free' as const,
      name: '2Be Free',
      price: '$0',
      period: 'Forever free',
      description: 'Essential private communication for two.',
      features: [
        'End-to-end encrypted messaging',
        'One-to-one voice & video calls',
        'Basic photo & video gallery (2GB)',
        'Shared life calendar',
        'Basic couple games & prompts'
      ]
    },
    {
      id: 'plus' as const,
      name: '2Be Plus',
      price: '$4.99',
      period: 'per couple / month',
      popular: true,
      description: 'One subscription covers both partners seamlessly.',
      features: [
        'Everything in Free',
        'Expanded 10GB cloud vault',
        'Unlimited shared photo albums',
        'Love Letters with wax seals & stationery',
        'Full Couple Games suite (Truth/Dare, Would You Rather)',
        'Custom chat themes & romantic sounds'
      ]
    },
    {
      id: 'premium' as const,
      name: '2Be Premium',
      price: '$9.99',
      period: 'per couple / month',
      description: 'The ultimate intimate luxury experience.',
      features: [
        'Everything in Plus',
        'Massive 50GB original-quality vault',
        '2Be AI Companion with unlimited generations',
        'Automated annual Memory Book creation',
        'Future time capsules with multi-year seals',
        'Priority feature previews & VIP support'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-midnight-950/90 backdrop-blur-xl">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-midnight-900 border border-slate-200 dark:border-lavender-400/30 rounded-3xl p-6 space-y-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-softpink-500/20 text-rose-700 dark:text-softpink-300 border border-rose-200 dark:border-softpink-400/30 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 dark:fill-softpink-400 text-rose-500 dark:text-softpink-400" />
            <span>One Subscription Covers Both Partners</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Choose Your Couple Plan</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Never pay twice. Subscribing on either phone activates premium benefits for both of you.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3.5">
          {plans.map(p => {
            const isCurrent = coupleSpace.activeSubscription === p.id;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'bg-rose-50/60 dark:bg-midnight-950 border-rose-400 dark:border-softpink-400 ring-2 ring-rose-300 dark:ring-softpink-500/30'
                    : p.popular
                    ? 'bg-purple-50/40 dark:bg-midnight-950/70 border-purple-200 dark:border-lavender-400/50'
                    : 'bg-slate-50 dark:bg-midnight-950/40 border-slate-200 dark:border-white/10'
                }`}
              >
                {p.popular && !isCurrent && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-softpink-500 to-lavender-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    Active Plan
                  </span>
                )}

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">{p.price}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">/{p.period}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{p.description}</p>

                <div className="space-y-1.5 mb-4">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-rose-600 dark:text-softpink-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    upgradeSubscription(p.id);
                    onClose();
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-default'
                      : 'bg-gradient-to-r from-softpink-500 to-lavender-500 text-white shadow-md hover:opacity-95'
                  }`}
                >
                  {isCurrent ? 'Current Active Membership' : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
