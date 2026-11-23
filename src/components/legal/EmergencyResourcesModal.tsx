import React from 'react';
import { Phone, MessageSquare, ShieldAlert, Heart, ExternalLink, LifeBuoy, X } from 'lucide-react';

interface EmergencyResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyResourcesModal: React.FC<EmergencyResourcesModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleSafetyExit = () => {
    // Quick Safety Exit: redirects or disguises screen immediately
    window.location.href = 'https://www.google.com';
  };

  const hotlines = [
    {
      title: '988 Suicide & Crisis Lifeline',
      desc: 'Free, confidential support 24/7 for anyone experiencing distress or suicidal crisis.',
      contact: 'Call or Text 988',
      tel: 'tel:988',
      badge: '24/7 • US & Canada'
    },
    {
      title: 'National Domestic Violence Hotline',
      desc: 'Confidential support, safety planning, and crisis resources for relationship abuse.',
      contact: '1-800-799-SAFE (7233) or Text "START" to 88788',
      tel: 'tel:18007997233',
      badge: '24/7 • Confidential'
    },
    {
      title: 'Crisis Text Line',
      desc: 'Free 24/7 support via text message from trained Volunteer Crisis Counselors.',
      contact: 'Text "HOME" to 741741',
      tel: 'sms:741741',
      badge: 'Free Text'
    },
    {
      title: 'International Resources Directory',
      desc: 'Find emergency numbers, crisis centers, and helplines globally across 70+ countries.',
      contact: 'Befrienders Worldwide & Find A Helpline',
      url: 'https://findahelpline.com',
      badge: 'Worldwide'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                Emergency & Crisis Resources
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                Confidential Help & Safety Support
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

        {/* Safety Exit Banner */}
        <div className="px-5 py-2.5 bg-rose-100/70 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs">
          <span className="font-semibold text-rose-900 dark:text-rose-200 text-[11px]">
            Need to leave quickly for your safety?
          </span>
          <button
            onClick={handleSafetyExit}
            className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 transition"
          >
            Quick Safety Exit ⚡
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs text-[#2D1F24] dark:text-white">
          <p className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE] leading-relaxed">
            If you or someone you know is in immediate physical danger, please call your local emergency services (such as <strong>911</strong> in the US/Canada or <strong>112</strong> in Europe).
          </p>

          <div className="space-y-2.5">
            {hotlines.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#2D1F24] dark:text-white">
                    {item.title}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE] leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-1">
                  {item.tel ? (
                    <a
                      href={item.tel}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#87204B] dark:text-[#FFAEC8] font-bold text-xs hover:brightness-105"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.contact}</span>
                    </a>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFF4E6] dark:bg-[#33282C] text-[#87204B] dark:text-[#FFAEC8] font-bold text-xs hover:brightness-105"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{item.contact}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#6D585E] dark:text-[#E6D7DE]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
