import React from 'react';
import { FileText, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy
}) => {
  if (!isOpen) return null;

  const sections = [
    {
      id: '1',
      title: '1. Acceptance of Terms',
      content: `By downloading, accessing, or using the 2Be mobile application ("2Be", "Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, do not install or use the Service.`
    },
    {
      id: '2',
      title: '2. Eligibility & Age Requirements',
      content: `You must be at least 13 years of age to use 2Be. If you are between 13 and the legal age of majority in your jurisdiction (typically 18), you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. Any registration by anyone under 13 is strictly unauthorized.`
    },
    {
      id: '3',
      title: '3. User Responsibilities & Mutual Respect',
      content: `2Be is designed specifically as an intimate sanctuary for two paired individuals. You agree to:
• Maintain the confidentiality of your device and authentication credentials.
• Communicate honestly and respectfully with your paired partner.
• Use features (including Locked Letters, Gratitude Jar, and Synchronized Hugs/Kisses) solely in a consensual manner.`
    },
    {
      id: '4',
      title: '4. Content Ownership & License',
      content: `You retain 100% intellectual property ownership of all messages, photos, videos, notes, audio clips, and documents you transmit through 2Be. Because your data is client-side encrypted, 2Be does not claim any ownership, rights, or license to exploit, monetize, or publicly distribute your intimate content.`
    },
    {
      id: '5',
      title: '5. Prohibited Conduct',
      content: `You agree NOT to use 2Be to:
• Post, share, or transmit non-consensual intimate imagery, abusive harassment, or hate speech.
• Upload illegal content, including child sexual abuse material (CSAM) or terroristic threats.
• Reverse engineer, decompile, or compromise the end-to-end cryptographic integrity of the application.
• Attempt to bypass or circumvent account pairing protocols, mutual consent mechanisms, or legal holds.`
    },
    {
      id: '6',
      title: '6. Termination & Connection Dissolution',
      content: `• Either partner may dissolve their connection at any time following our 72-Hour Cooling-Off Protocol and mutual consent safeguards.
• 2Be reserves the right to suspend or terminate accounts that violate our safety policies or applicable law, without prior notice where required for platform integrity.`
    },
    {
      id: '7',
      title: '7. Disclaimers ("As-Is" Service)',
      content: `2Be is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While we utilize industry-standard cryptographic techniques, we do not warrant that the service will be entirely error-free, uninterrupted, or immune to physical device tampering.`
    },
    {
      id: '8',
      title: '8. Limitation of Liability',
      content: `To the maximum extent permitted by applicable law, 2Be Sanctuary Inc. and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to access the service, or disputes arising between paired partners.`
    },
    {
      id: '9',
      title: '9. Governing Law & Dispute Resolution',
      content: `These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any dispute arising under these Terms shall be resolved through binding confidential arbitration administered by the American Arbitration Association (AAA).`
    },
    {
      id: '10',
      title: '10. Contact Information',
      content: `For legal notices, terms inquiries, or reporting violations:
• Email: legal@2be.app
• Support: support@2be.app
• Address: 2Be Sanctuary Inc., Attn: Legal Department, 100 Intimacy Way, San Francisco, CA 94105 USA.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                Terms of Service
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                Effective Date: November 24, 2026 • Version 1.2
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2D1F24] dark:text-white leading-relaxed">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340]"
            >
              <h4 className="font-bold text-xs text-[#87204B] dark:text-[#FFAEC8] mb-1">
                {sec.title}
              </h4>
              <p className="whitespace-pre-line text-[#5D474F] dark:text-[#E6D7DE]">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex items-center justify-between">
          {onOpenPrivacy ? (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="text-xs font-bold text-[#87204B] dark:text-[#FFAEC8] hover:underline"
            >
              View Privacy Policy ›
            </button>
          ) : (
            <span className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
              legal@2be.app
            </span>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-sm hover:brightness-105"
          >
            I Accept
          </button>
        </div>

      </div>
    </div>
  );
};
