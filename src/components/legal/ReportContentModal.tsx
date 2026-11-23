import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Send, Lock } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

interface ReportContentModalProps {
  isOpen: boolean;
  messageId?: string;
  messageSnippet?: string;
  onClose: () => void;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  messageId,
  messageSnippet,
  onClose
}) => {
  const { showToast } = useCouple();

  const [category, setCategory] = useState<'illegal' | 'harassment' | 'self_harm' | 'other'>('harassment');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitted(true);
    showToast('Report submitted confidentially to 2Be Safety Team 🛡️', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                Report Content
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                2Be Trust & Safety Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-[#2D1F24] dark:text-white">
          {!isSubmitted ? (
            <>
              {messageSnippet && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#22171E] border border-[#F0DFE3] dark:border-[#3D2833] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B7578]">
                    Reported Message Snippet:
                  </div>
                  <p className="italic text-[#5D474F] dark:text-[#E6D7DE] line-clamp-2">
                    "{messageSnippet}"
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-xs text-[#2D1F24] dark:text-white block mb-2">
                  Select Violation Category
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'illegal' as const, label: 'Illegal Content', desc: 'Child exploitation, terror threats, or severe unlawful conduct' },
                    { id: 'harassment' as const, label: 'Abuse or Harassment', desc: 'Intimidation, coercive control, or non-consensual threats' },
                    { id: 'self_harm' as const, label: 'Self-Harm or Suicide Threat', desc: 'Expressions of self-injury or imminent crisis' },
                    { id: 'other' as const, label: 'Other Safety Concern', desc: 'Unwanted impersonation or severe violation' }
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className={`p-3 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
                        category === cat.id
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                          : 'bg-white dark:bg-[#1A1217] border-[#DFCFD4] dark:border-[#3D2833]'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={category === cat.id}
                        onChange={() => setCategory(cat.id)}
                        className="mt-0.5 text-rose-600 accent-rose-600"
                      />
                      <div>
                        <div className="font-bold text-[#2D1F24] dark:text-white">
                          {cat.label}
                        </div>
                        <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                          {cat.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-[#2D1F24] dark:text-white block mb-1">
                  Additional Context (Optional)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any relevant details to help our safety specialists triage this report..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] text-xs text-[#2D1F24] dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200">
                🔒 Reports are investigated strictly by trained human safety specialists under confidentiality covenants. Response time: within 24 hours.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#6D585E] dark:text-[#E6D7DE]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
                >
                  Submit Report 🛡️
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#2D1F24] dark:text-white">
                  Report Received
                </h4>
                <p className="text-xs text-[#6D585E] dark:text-[#E6D7DE] mt-1 leading-relaxed">
                  Thank you for looking out for our community. Our Trust & Safety team has received your report and will review it within 24 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
