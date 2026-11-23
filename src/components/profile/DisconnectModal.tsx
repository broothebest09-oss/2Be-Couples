import React, { useState } from 'react';
import { AlertTriangle, Download, X, Lock, CheckCircle2 } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const DisconnectModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { coupleSpace, partnerUser, disconnectSpace, showToast } = useCouple();
  const [confirmInput, setConfirmInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      showToast('Encrypted personal archive downloaded successfully', 'info');
    }, 1500);
  };

  const handleDisconnect = () => {
    if (confirmInput !== 'DISCONNECT') return;
    disconnectSpace();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-midnight-950/95 backdrop-blur-xl">
      <div className="relative w-full max-w-md bg-white dark:bg-midnight-900 border border-rose-300 dark:border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center space-x-3 text-rose-500 dark:text-rose-400">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Couple Separation Protocol</h2>
            <span className="text-xs text-rose-600 dark:text-rose-300">Journey E Safeguards</span>
          </div>
        </div>

        {/* Explanatory terms */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-midnight-950 border border-slate-200 dark:border-white/10 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">What happens upon disconnection:</p>
          <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            <li>Access to this shared CoupleSpace is immediately revoked for both accounts.</li>
            <li>No private files or personal notes are transferred to your partner.</li>
            <li>Shared media in albums will enter a 30-day retention grace period for export.</li>
            <li>Both accounts revert to individual profiles and can join a new space when ready.</li>
          </ul>
        </div>

        {/* Step 1: Export Data first */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-lavender-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              Download Personal Archive
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Export all your uploaded photos, milestones, and letters.
            </span>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting || exportComplete}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-midnight-800 border border-slate-200 dark:border-white/10 text-xs font-semibold text-purple-700 dark:text-lavender-300 hover:bg-slate-200 dark:hover:bg-midnight-700 flex items-center gap-1.5 shrink-0 transition"
          >
            {exportComplete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Downloaded
              </>
            ) : isExporting ? (
              'Packaging...'
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Export Data
              </>
            )}
          </button>
        </div>

        {/* Step 2: Confirmation input */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] text-slate-600 dark:text-slate-400 block">
            Type <span className="font-bold text-rose-600 dark:text-rose-400">DISCONNECT</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={e => setConfirmInput(e.target.value)}
            placeholder="Type DISCONNECT"
            className="w-full bg-slate-50 dark:bg-midnight-950 border border-rose-300 dark:border-rose-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white uppercase focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-midnight-800 text-xs text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-midnight-700 transition"
          >
            Keep Space Intact
          </button>
          <button
            type="button"
            onClick={handleDisconnect}
            disabled={confirmInput !== 'DISCONNECT'}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Revoke & Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};
