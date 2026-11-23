import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  Shield,
  Clock,
  Layers,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Download,
  Trash2,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { analytics, AnalyticsEvent, FUNNELS } from '../../services/analytics';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'retention' | 'funnels' | 'events' | 'ga4'>('overview');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AnalyticsEvent | null>(null);
  const [consentGranted, setConsentGranted] = useState<boolean>(analytics.hasConsent());
  const [userProps, setUserProps] = useState(analytics.getUserProperties());
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const refreshEvents = () => {
    const list = analytics.getLoggedEvents();
    setEvents(list);
    setUserProps(analytics.getUserProperties());
    setConsentGranted(analytics.hasConsent());
  };

  useEffect(() => {
    if (isOpen) {
      refreshEvents();
      analytics.trackScreenView('screen_analytics_dashboard', 'AnalyticsDashboardModal');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleTriggerTestEvent = (name: string, params: Record<string, any>) => {
    analytics.logEvent(name, params);
    refreshEvents();
    showNotification(`Logged test event: ${name}`);
  };

  const handleFlushNow = async () => {
    await analytics.flushQueue();
    refreshEvents();
    showNotification('Flushed queued events to GA4 Measurement Protocol 🚀');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `2be_analytics_events_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
    showNotification('Exported analytics events log (JSON) 📥');
  };

  const handleClearHistory = () => {
    analytics.clearLoggedEvents();
    refreshEvents();
    setSelectedEvent(null);
    showNotification('Analytics event log cleared');
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(e.params).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-[28px] bg-[#FFFFFF] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#2D1F24] dark:text-[#F5E6EA]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#F0DFE3] dark:border-[#3D2F34] flex items-center justify-between bg-gradient-to-r from-[#FFF9F5] to-[#FFF4E6] dark:from-[#261E21] dark:to-[#1A1416]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8A5B9] to-[#9B4D6F] flex items-center justify-center text-white shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Firebase Analytics & GA4 System
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                Standardized GA4 event tracking, funnels, adoption & retention engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F0DFE3] dark:border-[#3D2F34] bg-[#FFF9F5] dark:bg-[#1E1719] overflow-x-auto no-scrollbar px-3 pt-2">
          {[
            { id: 'overview', label: 'Daily Metrics', icon: TrendingUp },
            { id: 'features', label: 'Feature Adoption', icon: Activity },
            { id: 'retention', label: 'Retention & Cohorts', icon: Users },
            { id: 'funnels', label: 'Funnels', icon: Layers },
            { id: 'events', label: `Event Stream (${events.length})`, icon: Clock },
            { id: 'ga4', label: 'Firebase / GA4 Config', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2.5 text-xs font-bold rounded-t-xl transition whitespace-nowrap border-b-2 ${
                  active
                    ? 'border-[#9B4D6F] dark:border-[#E8A5B9] text-[#9B4D6F] dark:text-[#E8A5B9] bg-white dark:bg-[#261E21]'
                    : 'border-transparent text-[#8B7578] dark:text-[#A89598] hover:text-[#2D1F24] dark:hover:text-[#F5E6EA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification Toast */}
        {copiedNotification && (
          <div className="bg-emerald-500 text-white text-xs font-semibold py-1.5 px-4 text-center animate-in fade-in duration-150">
            {copiedNotification}
          </div>
        )}

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: OVERVIEW / DAILY METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
                    DAILY COUPLE ACTIVITY METRICS
                  </h4>
                  <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    Real-time aggregated engagement across paired couples
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-[#9B4D6F] dark:text-[#E8A5B9] bg-[#E8A5B9]/15 px-2.5 py-1 rounded-full">
                  Updated just now
                </span>
              </div>

              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34]">
                  <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">DAU (Couples)</div>
                  <div className="text-xl font-extrabold text-[#2D1F24] dark:text-[#F5E6EA] mt-0.5">14,280</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ +8.4% vs last wk</div>
                </div>

                <div className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34]">
                  <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">MAU (Couples)</div>
                  <div className="text-xl font-extrabold text-[#2D1F24] dark:text-[#F5E6EA] mt-0.5">42,650</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ +14.2% MoM</div>
                </div>

                <div className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34]">
                  <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">Sessions / User</div>
                  <div className="text-xl font-extrabold text-[#2D1F24] dark:text-[#F5E6EA] mt-0.5">4.6 / day</div>
                  <div className="text-[10px] text-[#8B7578] dark:text-[#A89598] font-medium mt-1">Avg 18m 42s duration</div>
                </div>

                <div className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34]">
                  <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">Daily Touchpoints</div>
                  <div className="text-xl font-extrabold text-[#2D1F24] dark:text-[#F5E6EA] mt-0.5">182.6K</div>
                  <div className="text-[10px] text-[#9B4D6F] dark:text-[#FFAEC8] font-semibold mt-1">Messages & Kisses</div>
                </div>
              </div>

              {/* Volume Breakdown */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 space-y-3">
                <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Daily Volume & Connection Health
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <span className="text-[#8B7578] dark:text-[#A89598]">Messages sent per day</span>
                    <span className="font-bold text-[#2D1F24] dark:text-[#F5E6EA]">128,450 msgs</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <span className="text-[#8B7578] dark:text-[#A89598]">Kisses & Hugs synced / day</span>
                    <span className="font-bold text-[#9B4D6F] dark:text-[#FFAEC8]">54,200 syncs</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <span className="text-[#8B7578] dark:text-[#A89598]">New pairings created / day</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+820 couples</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <span className="text-[#8B7578] dark:text-[#A89598]">Unpairs / day (72h cooled)</span>
                    <span className="font-bold text-rose-500">12 (0.03% churn)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURE ADOPTION */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
                    COUPLE FEATURE PENETRATION & ADOPTION
                  </h4>
                  <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                    Percentage of active paired couples using each feature weekly
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Daily Prompts', percent: 84, desc: 'Question of the day answering rate', color: 'from-[#E8A5B9] to-[#9B4D6F]' },
                  { name: 'Scratch-Off Messages', percent: 71, desc: 'Interactive revealed mystery notes', color: 'from-amber-400 to-amber-600' },
                  { name: 'Gratitude Jar', percent: 76, desc: 'Mutual notes dropped and drawn', color: 'from-pink-400 to-rose-500' },
                  { name: 'Bucket List Dreams', percent: 68, desc: 'Future goals created and marked complete', color: 'from-purple-400 to-indigo-600' },
                  { name: 'Cycle Tracker', percent: 62, desc: 'Shared phase awareness and symptom care', color: 'from-rose-400 to-red-500' },
                  { name: 'Locked Letters', percent: 58, desc: 'Time, action & geo-locked love letters', color: 'from-fuchsia-500 to-pink-600' },
                  { name: '"We Need to Talk" Mode', percent: 24, desc: 'Constructive conflict resolution tool', color: 'from-blue-400 to-indigo-500' },
                  { name: 'Mutual Memory Lock (PIN)', percent: 39, desc: 'Shared 4-digit PIN protected memories', color: 'from-emerald-400 to-teal-600' },
                ].map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#2D1F24] dark:text-[#F5E6EA]">{f.name}</span>
                        <span className="text-[#8B7578] dark:text-[#A89598] ml-2 text-[11px]">{f.desc}</span>
                      </div>
                      <span className="font-extrabold text-[#9B4D6F] dark:text-[#FFAEC8]">{f.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EADADF] dark:bg-[#3D2F34] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${f.color} transition-all duration-500`}
                        style={{ width: `${f.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RETENTION & COHORTS */}
          {activeTab === 'retention' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
                  RETENTION BENCHMARKS & COHORT ANALYSIS
                </h4>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Cohort retention tracked by pairing completion date
                </p>
              </div>

              {/* Retention Rates Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Day 1 Retention', value: '78.4%', target: 'Top 5% couples apps' },
                  { label: 'Day 7 Retention', value: '64.2%', target: 'Daily streak driver' },
                  { label: 'Day 30 Retention', value: '52.8%', target: 'Monthly habit loop' },
                  { label: 'Day 90 Retention', value: '44.1%', target: 'Long-term relationship core' },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-[18px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34]"
                  >
                    <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">{r.label}</div>
                    <div className="text-xl font-extrabold text-[#9B4D6F] dark:text-[#FFAEC8] mt-0.5">{r.value}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{r.target}</div>
                  </div>
                ))}
              </div>

              {/* Cohort Table */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-3.5 overflow-x-auto">
                <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] mb-2">
                  Cohort Retention Matrix (Couples Paired)
                </h5>
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="border-b border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578] dark:text-[#A89598]">
                      <th className="py-1.5 font-bold">Cohort</th>
                      <th className="py-1.5 font-bold">Couples</th>
                      <th className="py-1.5 font-bold">D1</th>
                      <th className="py-1.5 font-bold">D7</th>
                      <th className="py-1.5 font-bold">D14</th>
                      <th className="py-1.5 font-bold">D30</th>
                      <th className="py-1.5 font-bold">D90</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0DFE3] dark:divide-[#3D2F34]">
                    {[
                      { cohort: 'Oct 2026', size: '12,400', d1: '79%', d7: '66%', d14: '59%', d30: '54%', d90: '45%' },
                      { cohort: 'Sep 2026', size: '11,800', d1: '78%', d7: '64%', d14: '58%', d30: '52%', d90: '44%' },
                      { cohort: 'Aug 2026', size: '10,950', d1: '77%', d7: '63%', d14: '57%', d30: '51%', d90: '43%' },
                      { cohort: 'Jul 2026', size: '9,800', d1: '76%', d7: '62%', d14: '55%', d30: '50%', d90: '42%' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/40 dark:hover:bg-black/20">
                        <td className="py-2 font-bold">{row.cohort}</td>
                        <td className="py-2 text-[#8B7578] dark:text-[#A89598]">{row.size}</td>
                        <td className="py-2 text-emerald-600 font-semibold">{row.d1}</td>
                        <td className="py-2 text-emerald-600 font-semibold">{row.d7}</td>
                        <td className="py-2 text-blue-600 font-semibold">{row.d14}</td>
                        <td className="py-2 text-purple-600 font-semibold">{row.d30}</td>
                        <td className="py-2 text-[#9B4D6F] dark:text-[#FFAEC8] font-bold">{row.d90}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Churn Reasons */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-3.5 space-y-2">
                <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Exit & Unpair Reasons Survey
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">Relationship ended</div>
                    <div className="font-bold text-rose-500">58%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">Needed a digital break</div>
                    <div className="font-bold text-amber-500">18%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">Resetting connection</div>
                    <div className="font-bold text-blue-500">12%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FUNNELS */}
          {activeTab === 'funnels' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
                  CONVERSION & DROP-OFF FUNNELS
                </h4>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Critical user journeys tracked step-by-step
                </p>
              </div>

              {/* Funnel 1: Onboarding */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center space-x-2">
                      <span>Funnel 1: Onboarding & Pairing</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
                        72% Completion
                      </span>
                    </h5>
                    <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                      signup_start → profile_created → pairing_invite_sent → pairing_complete → first_message_sent
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { step: '1. signup_start', pct: 100, drop: '0%' },
                    { step: '2. profile_created', pct: 91, drop: '-9%' },
                    { step: '3. pairing_invite_sent', pct: 84, drop: '-7%' },
                    { step: '4. pairing_complete', pct: 76, drop: '-8%' },
                    { step: '5. first_message_sent', pct: 72, drop: '-4%' },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">{s.step}</span>
                        <span className="text-[#8B7578] dark:text-[#A89598]">
                          {s.pct}% ({s.drop})
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EADADF] dark:bg-[#3D2F34] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F]"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funnel 2: Kiss & Hug Sync */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center space-x-2">
                      <span>Funnel 2: Tactile Kiss / Hug Sync</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold">
                        88% Success Rate
                      </span>
                    </h5>
                    <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                      kiss_button_tapped → partner_notified → partner_responded → sync_completed
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { step: '1. kiss_button_tapped', pct: 100, drop: '0%' },
                    { step: '2. partner_notified (push/socket)', pct: 98, drop: '-2%' },
                    { step: '3. partner_responded (hold started)', pct: 91, drop: '-7%' },
                    { step: '4. sync_completed (3s sustained)', pct: 88, drop: '-3%' },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">{s.step}</span>
                        <span className="text-[#8B7578] dark:text-[#A89598]">{s.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EADADF] dark:bg-[#3D2F34] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-600"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funnel 3: Locked Letter */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] flex items-center space-x-2">
                      <span>Funnel 3: Locked Letter Lifecycle</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                        79% Open Rate
                      </span>
                    </h5>
                    <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                      letter_created → letter_received → unlock_condition_met → letter_opened
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { step: '1. letter_created', pct: 100 },
                    { step: '2. letter_received', pct: 99 },
                    { step: '3. unlock_condition_met', pct: 82 },
                    { step: '4. letter_opened', pct: 79 },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-[#2D1F24] dark:text-[#F5E6EA]">{s.step}</span>
                        <span className="text-[#8B7578] dark:text-[#A89598]">{s.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EADADF] dark:bg-[#3D2F34] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-600"
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EVENT STREAM & DEBUGGER */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7578]" />
                    <input
                      type="text"
                      placeholder="Search events or parameters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] font-semibold text-[#2D1F24] dark:text-[#F5E6EA]"
                  >
                    <option value="all">All Categories</option>
                    <option value="screen">Screen (screen_)</option>
                    <option value="user">User Lifecycle (user_)</option>
                    <option value="feature">Feature (feature_)</option>
                    <option value="engagement">Engagement (engagement_)</option>
                    <option value="system">System (system_)</option>
                    <option value="error">Errors (error_)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleFlushNow}
                    className="px-2.5 py-1.5 rounded-xl bg-[#E8A5B9]/20 hover:bg-[#E8A5B9]/30 text-[#9B4D6F] dark:text-[#FFAEC8] text-xs font-semibold flex items-center space-x-1 transition"
                    title="Send queued batch to Firebase Analytics now"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Flush GA4</span>
                  </button>
                  <button
                    onClick={handleExportJson}
                    className="p-1.5 rounded-xl bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-[#8B7578] hover:text-[#2D1F24] transition"
                    title="Export JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 rounded-xl bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Clear Event Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Trigger Test Events */}
              <div className="p-3 rounded-2xl bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] space-y-2">
                <div className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598]">
                  Quick Fire Test Event (Validation & Payload Inspection):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '+ Kiss Sync', name: 'feature_kiss_sync_completed', p: { duration_seconds: 3, partner_responded: true } },
                    { label: '+ Hug Sync', name: 'feature_hug_sync_completed', p: { duration_seconds: 5, partner_responded: true } },
                    { label: '+ Locked Letter', name: 'feature_locked_letter_created', p: { unlock_type: 'date', has_media: true } },
                    { label: '+ Gratitude Note', name: 'feature_gratitude_note_added', p: { note_length_chars: 42 } },
                    { label: '+ Scratch Off', name: 'feature_scratch_off_revealed', p: { content_type: 'photo', scratch_duration_seconds: 4 } },
                    { label: '+ Error Occurred', name: 'error_occurred', p: { error_type: 'network_timeout', screen_name: 'screen_chat' } },
                    { label: '+ Unpair Requested', name: 'system_unpair_requested', p: { initiator: 'self', reason: 'cooling_off_test' } },
                  ].map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTriggerTestEvent(t.name, t.p)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] hover:border-[#E8A5B9] text-[#9B4D6F] dark:text-[#FFAEC8] transition"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Stream List */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] max-h-72 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8B7578] dark:text-[#A89598]">
                    No events matching filter. Try interacting with the app or firing a test event above!
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const isSelected = selectedEvent?.id === evt.id;
                    const timeStr = new Date(evt.timestamp).toLocaleTimeString();
                    const categoryColors: Record<string, string> = {
                      screen: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
                      user: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400',
                      feature: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300',
                      engagement: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
                      system: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
                      error: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400',
                    };
                    const colorClass = categoryColors[evt.category] || categoryColors.feature;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(isSelected ? null : evt)}
                        className={`p-3 cursor-pointer transition ${
                          isSelected ? 'bg-white dark:bg-[#1A1416]' : 'hover:bg-white/50 dark:hover:bg-[#1A1416]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${colorClass}`}>
                              {evt.category}
                            </span>
                            <span className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA] font-mono">
                              {evt.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8B7578] dark:text-[#A89598]">{timeStr}</span>
                        </div>

                        {isSelected && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto space-y-1">
                            <div className="text-[#E8A5B9] font-bold">Parameters ({Object.keys(evt.params).length}/25):</div>
                            <pre className="whitespace-pre-wrap">{JSON.stringify(evt.params, null, 2)}</pre>
                            <div className="text-slate-400 text-[9px] pt-1">
                              Status: {evt.synced ? 'Synced to GA4' : 'Buffered / Locally Logged'} • ID: {evt.id}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 6: FIREBASE / GA4 CONFIGURATION */}
          {activeTab === 'ga4' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#8B7578] dark:text-[#A89598] uppercase">
                  GA4 / FIREBASE ANALYTICS CONFIGURATION
                </h4>
                <p className="text-xs text-[#8B7578] dark:text-[#A89598]">
                  Standard Google Analytics 4 Measurement Protocol compliance specs
                </p>
              </div>

              {/* Status summary */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] divide-y divide-[#F0DFE3] dark:divide-[#3D2F34] shadow-soft">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">Measurement ID</div>
                    <div className="text-[11px] text-[#8B7578] dark:text-[#A89598]">Google Analytics 4 Property ID</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#9B4D6F] dark:text-[#FFAEC8] bg-[#E8A5B9]/15 px-2.5 py-1 rounded-full">
                    G-2BECOUPLES1
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">User Consent (GDPR)</div>
                    <div className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                      {consentGranted ? 'Events dispatched to GA4' : 'Analytics blocked (Privacy opt-out)'}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      consentGranted
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {consentGranted ? 'Opted In' : 'Opted Out'}
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">Event Batching Interval</div>
                    <div className="text-[11px] text-[#8B7578] dark:text-[#A89598]">Periodic queue flush & unload sendBeacon</div>
                  </div>
                  <span className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">Every 30s</span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">Naming Validation</div>
                    <div className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                      snake_case, max 40 chars, max 25 params per event
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    Enforced ✓
                  </span>
                </div>
              </div>

              {/* User Properties */}
              <div className="rounded-[20px] bg-[#FFF9F5] dark:bg-[#261E21] border border-[#F0DFE3] dark:border-[#3D2F34] p-3.5 space-y-2">
                <h5 className="text-xs font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                  Active User Properties (GA4 Demographics & Dimensions)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">pairing_date</div>
                    <div className="font-mono font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                      {userProps.pairing_date || '2026-11-20'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">account_age_days</div>
                    <div className="font-mono font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                      {userProps.account_age_days ?? 4} days
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">has_cycle_tracker</div>
                    <div className="font-mono font-bold text-emerald-600">
                      {userProps.has_cycle_tracker ? 'true' : 'true'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34]">
                    <div className="text-[10px] text-[#8B7578]">device_platform</div>
                    <div className="font-mono font-bold text-[#2D1F24] dark:text-[#F5E6EA]">
                      Android (Dual Native/Web)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2F34] bg-[#FFF9F5] dark:bg-[#261E21] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-[#8B7578] dark:text-[#A89598]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>GA4 Measurement Protocol Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white font-bold text-xs shadow-rose-glow active:scale-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
