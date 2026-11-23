import React, { useState } from 'react';
import { Shield, Lock, FileText, CheckCircle2, ChevronRight, Mail, Calendar, Eye } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenTerms
}) => {
  const [highlightUpdates, setHighlightUpdates] = useState(false);

  if (!isOpen) return null;

  const sections = [
    {
      id: '1',
      title: '1. What Data We Collect',
      content: `We collect minimal personal data essential to providing your private couples sanctuary:
• Account & Profile Information: Display name, private nickname, optional email or phone number, and customized avatar choices. We do not require real legal names.
• Private Content: Messages, photos, video snippets, audio notes, love letters, locked letters, gratitude jar notes, and bucket list milestones.
• Device & Technical Telemetry: App version, operating system version, device identifiers (hashed), battery level percentage (for real-time partner battery glance), and connection status.
• Health & Cycle Data (Optional): Cycle tracking dates, symptoms, energy levels, and intimate notes. This data is only processed if explicitly enabled by the user.`
    },
    {
      id: '2',
      title: '2. How We Use Your Data',
      content: `Your data is utilized strictly to deliver and protect your 2-person sanctuary:
• Delivering real-time synchronized signals (synchronous kiss/hug hold gestures, typing status, voice chimes).
• Storing and displaying your shared timeline, memory wall, and gratitude jar.
• Facilitating client-side end-to-end encryption key exchanges.
• Ensuring technical reliability, bug triage, and preventing unauthorized account takeover.`
    },
    {
      id: '3',
      title: '3. Data Sharing & Zero-Sale Guarantee',
      content: `We enforce a strict Zero Data Monetization Standard:
• We NEVER sell, rent, or trade your personal data, messages, or media to third parties or data brokers.
• We do not share information with advertisers for cross-context behavioral marketing.
• Data is shared exclusively with your paired partner within the encrypted couple space.
• We only disclose data where strictly compelled by valid, lawful subpoenas, warrants, or court orders, subject to our encryption architecture.`
    },
    {
      id: '4',
      title: '4. End-to-End Encryption Architecture',
      content: `Your intimate communications are protected by state-of-the-art cryptography:
• Messages, photos, videos, and locked love letters are encrypted directly on your device before transmission using the Signal Protocol / AES-GCM-256.
• Only you and your paired partner possess the cryptographic keys needed to decrypt content.
• 2Be employees, servers, and cloud intermediaries cannot read your messages or decrypt your media.`
    },
    {
      id: '5',
      title: '5. Data Storage & Encrypted Backups',
      content: `• Primary Storage: All chat messages, media, and private notes reside locally on your device in secure sandbox storage.
• Cloud Backup: When cloud backup is enabled, your data is packaged, encrypted with your private couple passphrase, and stored directly in your personal Google Drive account. We maintain zero access to your Google Drive contents.`
    },
    {
      id: '6',
      title: '6. Data Retention Policy',
      content: `• Active Connection: Data is preserved until you delete individual items, unpair, or delete your account.
• Breakup / Unpair: If a connection dissolves, both partners receive a read-only archive in Settings > Archived Data.
• Account Deletion: When you delete your account, your data is purged from all active systems immediately. Minimal transactional logs are retained for up to 30 days solely for dispute resolution, then permanently purged.`
    },
    {
      id: '7',
      title: '7. Your Global Privacy Rights (GDPR & CCPA/CPRA)',
      content: `Regardless of your location, you enjoy full sovereignty over your personal data:
• Right of Access & Data Portability: You may request a complete export of all your data (delivered as a ZIP/JSON within 24 hours via Settings > Data > Export Data).
• Right to Rectification: Correct your display name, nicknames, and avatar anytime in Settings.
• Right to Erasure ("Right to be Forgotten"): Execute complete deletion via Settings > Data > Delete Account.
• California Rights: Exercise "Do Not Sell or Share My Personal Information" and opt out via Settings > Privacy.`
    },
    {
      id: '8',
      title: '8. Children\'s Privacy (COPPA Compliance)',
      content: `2Be is not directed to children under 13 years of age. We enforce an age gate upon initial registration. If we discover that a user under 13 has provided personal information without verifiable parental consent, we immediately delete their account and associated records.`
    },
    {
      id: '9',
      title: '9. Contact Information & Data Protection Officer',
      content: `If you have questions, inquiries, or wish to submit a Data Subject Access Request (DSAR):
• Privacy Team & DPO Email: privacy@2be.app
• Legal Team Email: legal@2be.app
• Postal Inquiries: 2Be Sanctuary Inc., Attn: Privacy Operations, 100 Intimacy Way, San Francisco, CA 94105 USA.`
    },
    {
      id: '10',
      title: '10. Policy Update Notifications',
      content: `We review this Privacy Policy periodically. If we introduce material alterations, we provide at least 30 days advance notice in-app and require affirmative consent before the updated terms govern your continued use of 2Be.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white flex items-center gap-2">
                <span>Privacy Policy</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  v1.2 Active
                </span>
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                Last Updated: November 24, 2026 • 2Be Sanctuary Inc.
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

        {/* Filter / Highlight Bar */}
        <div className="px-5 py-2.5 bg-[#FCF8F9] dark:bg-[#20151C] border-b border-[#F0DFE3] dark:border-[#3D2833] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-[#87204B] dark:text-[#FFAEC8]" />
            <span className="font-semibold text-[#5D474F] dark:text-[#E6D7DE]">
              End-to-End Encrypted Intimacy Standard
            </span>
          </div>
          <button
            onClick={() => setHighlightUpdates(prev => !prev)}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition ${
              highlightUpdates
                ? 'bg-[#87204B] text-white'
                : 'bg-white dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] text-[#87204B] dark:text-[#FFAEC8]'
            }`}
          >
            {highlightUpdates ? 'Showing Recent Changes' : 'Highlight Updates'}
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2D1F24] dark:text-white leading-relaxed">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className={`p-3.5 rounded-2xl transition border ${
                highlightUpdates && (sec.id === '3' || sec.id === '4' || sec.id === '7')
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 ring-1 ring-rose-400'
                  : 'bg-white dark:bg-[#23171F] border-[#F0DFE3] dark:border-[#4D3340]'
              }`}
            >
              <h4 className="font-bold text-xs text-[#87204B] dark:text-[#FFAEC8] mb-1.5 flex items-center justify-between">
                <span>{sec.title}</span>
                {highlightUpdates && (sec.id === '3' || sec.id === '4' || sec.id === '7') && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    UPDATED
                  </span>
                )}
              </h4>
              <p className="whitespace-pre-line text-[#5D474F] dark:text-[#E6D7DE]">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex items-center justify-between">
          {onOpenTerms ? (
            <button
              onClick={() => {
                onClose();
                onOpenTerms();
              }}
              className="text-xs font-bold text-[#87204B] dark:text-[#FFAEC8] hover:underline"
            >
              View Terms of Service ›
            </button>
          ) : (
            <span className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
              privacy@2be.app
            </span>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-sm hover:brightness-105"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
