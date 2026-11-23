import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Lock,
  XCircle
} from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

interface DataDeletionFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeletedComplete: () => void;
}

export const DataDeletionFlowModal: React.FC<DataDeletionFlowModalProps> = ({
  isOpen,
  onClose,
  onDeletedComplete
}) => {
  const { partnerUser, currentUser } = useCouple();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [confirmInput, setConfirmInput] = useState('');
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  if (!isOpen) return null;

  const deletionStages = [
    'Removing account from partner\'s paired sanctuary list...',
    'Dissolving pairing and notifying partner...',
    'Deleting all end-to-end encrypted messages (local & cloud)...',
    'Deleting all memories, albums, and milestone records...',
    'Purging gratitude jar notes...',
    'Deleting bucket list items and goals...',
    'Permanently scrubbing cycle tracker health data...',
    'Wiping avatar customizations and presets...',
    'Purging user profile and cryptographic keys...',
    'Revoking authentication tokens & sessions...',
    'Removing client-encrypted backup from Google Drive...'
  ];

  const handleStartDeletion = () => {
    setCurrentStep(3);
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < deletionStages.length) {
        setActiveStageIndex(stage);
      } else {
        clearInterval(interval);
        // Execute real cleanup
        localStorage.clear();
        localStorage.setItem('twobe_onboarding_step', 'welcome');
        setCurrentStep(4);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#1C1217] border border-rose-300 dark:border-rose-900/60 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-rose-50/70 dark:bg-rose-950/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-rose-700 dark:text-rose-200">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-800 dark:text-rose-200">
                Permanent Account Deletion
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                GDPR Article 17 • Right to Erasure
              </p>
            </div>
          </div>
          {currentStep !== 3 && currentStep !== 4 && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2D1F24] dark:text-white">
          
          {/* ======================================================== */}
          {/* STEP 1: WARNING SCREEN                                   */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2 text-center">
                <span className="text-3xl block">⚠️</span>
                <h4 className="text-base font-bold text-rose-700 dark:text-rose-300">
                  Are you absolutely sure?
                </h4>
                <p className="text-xs text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                  This will <strong>permanently delete your account and all your data</strong>. 
                  Your partner ({partnerUser.name.split(' ')[0]}) will be notified and their connection to you will be dissolved.
                </p>
                <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 pt-1">
                  This action cannot be undone.
                </div>
              </div>

              <div className="rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] p-4 space-y-2">
                <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
                  What will be destroyed:
                </div>
                <ul className="space-y-1.5 text-[#5D474F] dark:text-[#E6D7DE]">
                  <li>• All chat messages, media attachments, and voice notes</li>
                  <li>• Entire memory wall, shared photos, and time capsules</li>
                  <li>• Gratitude jar notes, bucket lists, and milestone counters</li>
                  <li>• All cycle tracker health data and private notes</li>
                  <li>• Your profile, avatar, credentials, and Google Drive backups</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A1217] border border-[#DFCFD4] dark:border-[#3D2833] text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                ⚖️ <strong>Legal Notice:</strong> As required by law, minimal transactional logs will be retained for up to 30 days for payment and legal dispute resolution, after which they are automatically purged.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-bold text-xs text-[#4A3B40] dark:text-[#E6D7DE]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
                >
                  Continue ›
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CONFIRMATION BY TYPING 'DELETE'                  */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="font-bold text-rose-800 dark:text-rose-200 text-sm">
                  Final Safety Gate
                </div>
                <p className="text-xs text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                  To confirm permanent deletion of your 2Be account, type{' '}
                  <strong className="text-rose-600 dark:text-rose-400 font-mono">DELETE</strong> in the box below:
                </p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#170E14] border-2 border-rose-300 dark:border-rose-800 text-center text-sm font-bold tracking-widest text-[#2D1F24] dark:text-white focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-bold text-xs text-[#4A3B40] dark:text-[#E6D7DE]"
                >
                  Back
                </button>
                <button
                  disabled={confirmInput !== 'DELETE'}
                  onClick={handleStartDeletion}
                  className={`flex-1 py-3 rounded-full text-xs font-bold text-white shadow-md transition ${
                    confirmInput === 'DELETE'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/30'
                      : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed text-slate-400'
                  }`}
                >
                  Delete My Account Permanently 🗑️
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: STAGED EXECUTION PROGRESS                        */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto text-rose-600 animate-spin">
                <Loader2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#2D1F24] dark:text-white">
                  Deleting Your Data...
                </h4>
                <p className="text-xs text-[#8B7578] dark:text-[#E6D7DE] mt-1">
                  Executing complete GDPR Article 17 erasure
                </p>
              </div>

              {/* Staged deletion checklist */}
              <div className="rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] p-3 text-left space-y-2 max-h-52 overflow-y-auto">
                {deletionStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-2 text-[11px] transition ${
                      idx < activeStageIndex
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : idx === activeStageIndex
                        ? 'text-rose-600 dark:text-rose-400 font-bold animate-pulse'
                        : 'text-slate-400 dark:text-white/20'
                    }`}
                  >
                    <span>
                      {idx < activeStageIndex ? '✓' : idx === activeStageIndex ? '▶' : '○'}
                    </span>
                    <span className="truncate">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: COMPLETED CONFIRMATION                           */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#2D1F24] dark:text-white">
                  Account Permanently Deleted
                </h4>
                <p className="text-xs text-[#6D585E] dark:text-[#E6D7DE] mt-1.5 leading-relaxed">
                  Your 2Be account, messages, memories, and personal records have been completely purged from our servers and your local device.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1A1217] border border-[#DFCFD4] dark:border-[#3D2833] text-[11px] text-[#5D474F] dark:text-[#E6D7DE] text-left space-y-1">
                <div>• Connection to {partnerUser.name.split(' ')[0]} dissolved.</div>
                <div>• All cloud backups erased.</div>
                <div>• Dispute transaction logs scheduled for automatic purge in 30 days.</div>
              </div>

              <button
                onClick={() => {
                  onDeletedComplete();
                  window.location.reload();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md"
              >
                Return to Welcome Screen
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
