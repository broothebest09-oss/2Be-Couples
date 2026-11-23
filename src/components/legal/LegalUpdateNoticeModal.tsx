import React from 'react';
import { Shield, Sparkles, ArrowRight, Clock, FileCheck } from 'lucide-react';

interface LegalUpdateNoticeModalProps {
  isOpen: boolean;
  onReview: () => void;
  onAccept: () => void;
}

export const LegalUpdateNoticeModal: React.FC<LegalUpdateNoticeModalProps> = ({
  isOpen,
  onReview,
  onAccept
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200 text-[#2D1F24] dark:text-white text-xs">
        
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto text-[#87204B] dark:text-[#FFAEC8]">
          <FileCheck className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
            We've Updated Our Privacy Policy
          </h3>
          <p className="text-xs text-[#6D585E] dark:text-[#E6D7DE]">
            Version 1.2 is now active to enhance transparency and comply with global standards.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1.5 text-left text-[11px]">
          <div className="font-bold text-[#87204B] dark:text-[#FFAEC8]">
            Key Updates Included:
          </div>
          <div className="space-y-1 text-[#5D474F] dark:text-[#E6D7DE]">
            <div>• Clarified end-to-end encryption key management.</div>
            <div>• Added explicit COPPA age-gate and parental consent terms.</div>
            <div>• Reaffirmed zero data monetization & GPC signal compliance.</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200 text-left flex items-center gap-1.5">
          <Clock className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-300" />
          <span>30-day grace period: Effective November 24, 2026.</span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onReview}
            className="flex-1 py-2.5 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-bold text-xs text-[#6D585E] dark:text-[#E6D7DE]"
          >
            Review Policy
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md"
          >
            Accept & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
