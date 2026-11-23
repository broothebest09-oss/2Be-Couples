import React, { useState, useEffect } from 'react';
import {
  HeartCrack,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
  Lock,
  ChevronRight,
  UserX,
  FileCheck2
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';
import { soundFX } from '../../utils/audio';

interface UnpairFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenArchivedData?: () => void;
}

export const UnpairFlowModal: React.FC<UnpairFlowModalProps> = ({
  isOpen,
  onClose,
  onOpenArchivedData
}) => {
  const {
    currentUser,
    partnerUser,
    unpairRequest,
    pairingStatus,
    initiateUnpair,
    cancelUnpair,
    fastForwardCoolingOff,
    confirmUnpair,
    unilateralUnpair,
    finalizeUnpair
  } = useCouple();

  const [acknowledgedDisposition, setAcknowledgedDisposition] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'disposition' | 'edge_cases'>('overview');
  const [timeRemainingText, setTimeRemainingText] = useState<string>('');

  // Calculate cooling-off remaining time
  useEffect(() => {
    if (!unpairRequest || unpairRequest.status !== 'cooling_off') return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = unpairRequest.coolingOffEndsAt - now;
      if (diff <= 0) {
        setTimeRemainingText('Cooling-off complete. Ready for mutual confirmation.');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemainingText(`${hours}h ${minutes}m ${seconds}s remaining`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [unpairRequest]);

  if (!isOpen) return null;

  const isCoolingOff = pairingStatus === 'cooling_off' && unpairRequest;
  const isConfirmationPending = pairingStatus === 'confirmation_pending' && unpairRequest;
  const isDissolved = pairingStatus === 'dissolved';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] flex items-center justify-between bg-[#FFF8FA] dark:bg-[#23171F]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <HeartCrack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                {isDissolved
                  ? 'Connection Dissolved'
                  : isConfirmationPending
                  ? 'Final Unpair Confirmation'
                  : isCoolingOff
                  ? 'Cooling-Off Period (72h)'
                  : 'Unpair / Dissolve Connection'}
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                2Be Intimate Sanctuary Safety Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[#2D1F24] dark:text-white">

          {/* ======================================================== */}
          {/* STATE 1: INITIAL TRIGGER WARNING                         */}
          {/* ======================================================== */}
          {!isCoolingOff && !isConfirmationPending && !isDissolved && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
                <span className="text-3xl block">💔</span>
                <h4 className="text-base font-bold text-rose-700 dark:text-rose-300">
                  Are you sure? This will dissolve your connection.
                </h4>
                <p className="text-xs text-[#6B555B] dark:text-[#E6D7DE] leading-relaxed">
                  Ending a private sanctuary is a deeply sensitive event. 2Be enforces a 
                  <strong className="text-rose-600 dark:text-rose-400"> 72-hour cooling-off period</strong>. 
                  During this time, both of you can reflect, the app functions normally, and either partner can cancel with a single tap.
                </p>
              </div>

              {/* Data Safety Summary */}
              <div className="rounded-2xl bg-[#FFF9F6] dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#87204B] dark:text-[#FFAEC8]">
                  <FileCheck2 className="w-4 h-4" />
                  <span>How Your Shared Data Will Be Protected</span>
                </div>
                <ul className="text-xs space-y-2 text-[#5A474D] dark:text-[#E6D7DE]">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Chat & Media:</strong> You each keep a permanent, read-only copy in Archived Conversations.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Memories & Wall:</strong> Completely preserved in Archived Memories. Locked PINs still work.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Cycle Data:</strong> Kept 100% private by Her. His access and notifications are wiped.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>Mutual Consent:</strong> Requires both partners to confirm after 72 hours.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-bold text-[#4A3B40] dark:text-[#E6D7DE] hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Keep Connection ❤️
                </button>
                <button
                  onClick={() => {
                    initiateUnpair();
                  }}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-rose-900/20 transition"
                >
                  Start 72h Cooling-Off 🕊️
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 2: COOLING-OFF PERIOD ACTIVE (72 HOURS)             */}
          {/* ======================================================== */}
          {isCoolingOff && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
                  <Clock className="w-5 h-5 animate-pulse" />
                  <span>72-Hour Cooling-Off Period Active</span>
                </div>
                <p className="text-xs text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                  <strong>{unpairRequest.initiatorName}</strong> requested to dissolve the connection. Both partners have 72 hours to reflect. 
                  The app remains fully functional, and either partner can cancel immediately.
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1C1217] border border-amber-200/80 dark:border-amber-800/40 text-center">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                    Time Remaining
                  </div>
                  <div className="text-lg font-mono font-bold text-[#2D1F24] dark:text-white mt-0.5">
                    {timeRemainingText || 'Calculating...'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    cancelUnpair(`${currentUser.name.split(' ')[0]} cancelled the unpair request. Connection restored! ❤️`);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md shadow-rose-900/20 transition hover:brightness-105"
                >
                  Cancel Unpair Request (Stay Connected) ❤️
                </button>

                {/* Simulation Test Controls for Reviewer */}
                <div className="p-3 rounded-2xl bg-[#FFF5F7] dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] space-y-2">
                  <div className="text-[11px] font-bold text-[#87204B] dark:text-[#FFAEC8] flex items-center justify-between">
                    <span>⚡ Testing / Simulation Controls</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/50 dark:bg-rose-900/40">Demo Aid</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={fastForwardCoolingOff}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] text-left text-xs text-[#2D1F24] dark:text-[#E6D7DE] hover:border-[#87204B] transition flex items-center justify-between"
                    >
                      <span>Simulate 72 Hours Elapsed ⏩</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8B7578]" />
                    </button>
                    <button
                      onClick={() => unilateralUnpair('immediate_account_delete')}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] text-left text-xs text-rose-600 dark:text-rose-400 hover:border-rose-500 transition flex items-center justify-between"
                    >
                      <span>Edge Case: Partner deleted account (Immediate unpair)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                    <button
                      onClick={() => unilateralUnpair('inactivity_30d')}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] text-left text-xs text-amber-600 dark:text-amber-400 hover:border-amber-500 transition flex items-center justify-between"
                    >
                      <span>Edge Case: Partner unresponsive for 30 days (Unilateral unpair)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 3: FINAL MUTUAL CONFIRMATION (POST 72H)             */}
          {/* ======================================================== */}
          {isConfirmationPending && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Permanent Dissolution Confirmation</span>
                </div>
                <p className="text-xs text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                  The 72-hour cooling-off period has passed. <strong>Both partners must explicitly confirm</strong> to dissolve the shared connection.
                  If either partner does not confirm within <strong>7 days</strong>, the unpair request will automatically cancel.
                </p>
              </div>

              {/* Sub-tabs for Reviewing Data Disposition */}
              <div className="flex rounded-xl bg-[#F6EFF2] dark:bg-[#251821] p-1 gap-1 text-xs font-semibold">
                <button
                  onClick={() => setActiveTabSection('overview')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    activeTabSection === 'overview'
                      ? 'bg-white dark:bg-[#170E14] text-[#87204B] dark:text-[#FFAEC8] shadow-sm'
                      : 'text-[#8B7578] dark:text-[#E6D7DE]'
                  }`}
                >
                  Status
                </button>
                <button
                  onClick={() => setActiveTabSection('disposition')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    activeTabSection === 'disposition'
                      ? 'bg-white dark:bg-[#170E14] text-[#87204B] dark:text-[#FFAEC8] shadow-sm'
                      : 'text-[#8B7578] dark:text-[#E6D7DE]'
                  }`}
                >
                  Data Breakdown
                </button>
                <button
                  onClick={() => setActiveTabSection('edge_cases')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    activeTabSection === 'edge_cases'
                      ? 'bg-white dark:bg-[#170E14] text-[#87204B] dark:text-[#FFAEC8] shadow-sm'
                      : 'text-[#8B7578] dark:text-[#E6D7DE]'
                  }`}
                >
                  Edge Cases
                </button>
              </div>

              {activeTabSection === 'overview' && (
                <div className="space-y-3">
                  {/* Partner Consent Status Grid */}
                  <div className="rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] p-3.5 space-y-2.5">
                    <div className="text-xs font-bold text-[#2D1F24] dark:text-white">
                      Mutual Consent Status
                    </div>
                    
                    {/* User Consent */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#F0DFE3] dark:border-[#3D2833]">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-[#DE7090]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#2D1F24] dark:text-white">
                            {currentUser.name} (You)
                          </div>
                          <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                            {unpairRequest.userConfirmed ? 'Confirmed' : 'Pending your confirmation'}
                          </div>
                        </div>
                      </div>
                      {unpairRequest.userConfirmed ? (
                        <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Agreed
                        </span>
                      ) : (
                        <button
                          disabled={!acknowledgedDisposition}
                          onClick={() => confirmUnpair(currentUser.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                            acknowledgedDisposition
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                              : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Confirm
                        </button>
                      )}
                    </div>

                    {/* Partner Consent */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#F0DFE3] dark:border-[#3D2833]">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={partnerUser.avatar}
                          alt={partnerUser.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-[#DE7090]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#2D1F24] dark:text-white">
                            {partnerUser.name} (Partner)
                          </div>
                          <div className="text-[10px] text-[#8B7578] dark:text-[#E6D7DE]">
                            {unpairRequest.partnerConfirmed ? 'Confirmed' : 'Pending partner confirmation'}
                          </div>
                        </div>
                      </div>
                      {unpairRequest.partnerConfirmed ? (
                        <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Agreed
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmUnpair(partnerUser.id)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F4E3E8] dark:bg-[#3D2833] text-[#87204B] dark:text-[#FFAEC8] hover:brightness-105"
                          title="Simulate partner confirmation"
                        >
                          Simulate Partner Confirm
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Legal & Data Checkbox */}
                  <label className="flex items-start space-x-2.5 p-3 rounded-2xl bg-[#FFF8FA] dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acknowledgedDisposition}
                      onChange={(e) => setAcknowledgedDisposition(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-rose-600 accent-rose-600"
                    />
                    <span className="text-xs text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                      I understand that this action is permanent and irreversible. My shared history will move to 
                      <strong className="text-rose-600 dark:text-rose-400"> Settings &gt; Archived Data</strong> as read-only.
                    </span>
                  </label>
                </div>
              )}

              {activeTabSection === 'disposition' && (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">💬 Chat History</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      Both keep full message & media history. Chat becomes strictly read-only and moves to Settings &gt; Archived Conversations. Individual messages cannot be deleted.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">🖼️ Memories Wall & Locked Memories</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      Both keep the entire memory wall. PIN-locked memories remain unlockable with your existing PIN. Mutual deletion is disabled.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">🌸 Cycle Tracker Data</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      Her logs and symptoms remain 100% accessible to Her. His view of cycle data, predictions, and notifications is completely eliminated.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">💋 Kisses, Hugs & Streaks</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      Individual lifetime counters kept ("I sent 247 kisses"). Shared counters archived. Active streak resets to 0 with longest streak saved.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">🫙 Gratitude Jar & Bucket List</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      You keep items and notes you authored; partner's items are frozen in archive. Jar visual becomes static.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">🏷️ Nicknames & Avatars</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      Keep nickname you gave partner. Received nickname reverts to plain display name. Partner's avatar is removed.
                    </p>
                  </div>
                </div>
              )}

              {activeTabSection === 'edge_cases' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#2D1F24] dark:text-white">⚖️ Legal Hold Policy</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      If a law enforcement preservation order is active, all data deletions are locked. Data is preserved indefinitely.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#2D1F24] dark:text-white">⏳ 30-Day Unresponsive Bypass</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      If a partner is absent from 2Be for 30 consecutive days, the active partner can execute a unilateral unpair without mutual confirmation.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1">
                    <div className="font-bold text-[#2D1F24] dark:text-white">🔄 Re-Pairing Detection</div>
                    <p className="text-[#5D474F] dark:text-[#E6D7DE]">
                      If you ever re-pair with the same person later, 2Be alerts: <em>"You were previously paired with [Name]. Starting fresh?"</em> All counters start at 0.
                    </p>
                  </div>
                </div>
              )}

              {/* Cancel or Finalize Bar */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => cancelUnpair()}
                  className="flex-1 py-3 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-bold text-[#4A3B40] dark:text-[#E6D7DE] hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Cancel Request
                </button>
                <button
                  disabled={!acknowledgedDisposition || !unpairRequest.userConfirmed || !unpairRequest.partnerConfirmed}
                  onClick={finalizeUnpair}
                  className={`flex-1 py-3 rounded-full text-xs font-bold transition ${
                    acknowledgedDisposition && unpairRequest.userConfirmed && unpairRequest.partnerConfirmed
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/30'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Finalize Dissolution 💔
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 4: DISSOLVED / UNPAIRED COMPLETED                   */}
          {/* ======================================================== */}
          {isDissolved && (
            <div className="space-y-4 text-center">
              <span className="text-4xl block">🕊️</span>
              <div>
                <h4 className="text-base font-bold text-[#2D1F24] dark:text-white">
                  Connection Has Been Dissolved
                </h4>
                <p className="text-xs text-[#8B7578] dark:text-[#E6D7DE] mt-1 leading-relaxed">
                  Your shared sanctuary is now inactive. Your memories, messages, and milestones have been safely preserved in 
                  <strong className="text-[#87204B] dark:text-[#FFAEC8]"> Archived Data</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F6] dark:bg-[#251821] border border-[#F0DFE3] dark:border-[#4D3340] text-xs space-y-2 text-left">
                <div className="font-bold text-[#2D1F24] dark:text-white">What happens now?</div>
                <div className="space-y-1 text-[#5D474F] dark:text-[#E6D7DE]">
                  <div>• All partner push notifications and shared signals are disabled.</div>
                  <div>• Your chat is preserved in read-only mode.</div>
                  <div>• You can export your archive anytime as JSON or ZIP.</div>
                  <div>• You may invite a new partner or re-pair whenever you are ready.</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {onOpenArchivedData && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenArchivedData();
                    }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md shadow-rose-900/20"
                  >
                    Open Archived Data 📦
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full border border-[#DFCFD4] dark:border-[#543745] text-xs font-semibold text-[#8B7578] dark:text-[#E6D7DE]"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
