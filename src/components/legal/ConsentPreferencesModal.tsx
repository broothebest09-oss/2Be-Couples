import React, { useState } from 'react';
import { ShieldCheck, Check, Clock, AlertCircle, Info, Lock } from 'lucide-react';

interface ConsentPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
}

interface ConsentLogEntry {
  timestamp: string;
  type: string;
  value: boolean;
}

export const ConsentPreferencesModal: React.FC<ConsentPreferencesModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy
}) => {
  // Load saved consents
  const getStoredConsents = () => {
    try {
      const item = localStorage.getItem('twobe_consents');
      return item
        ? JSON.parse(item)
        : {
            terms: true,
            privacy: true,
            dataProcessing: true,
            analytics: false,
            crashReporting: false,
            marketingEmails: false,
            doNotSell: true
          };
    } catch {
      return {
        terms: true,
        privacy: true,
        dataProcessing: true,
        analytics: false,
        crashReporting: false,
        marketingEmails: false,
        doNotSell: true
      };
    }
  };

  const [consents, setConsents] = useState(getStoredConsents);
  const [logs, setLogs] = useState<ConsentLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem('twobe_consent_logs');
      return stored
        ? JSON.parse(stored)
        : [
            {
              timestamp: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              type: 'Initial GDPR/CCPA Consent Manifest Created',
              value: true
            }
          ];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const handleToggle = (key: string, currentValue: boolean) => {
    const updatedValue = !currentValue;
    const newConsents = { ...consents, [key]: updatedValue };
    setConsents(newConsents);
    localStorage.setItem('twobe_consents', JSON.stringify(newConsents));

    const newLog: ConsentLogEntry = {
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      type: `${key} changed to ${updatedValue ? 'Enabled' : 'Disabled'}`,
      value: updatedValue
    };

    const updatedLogs = [newLog, ...logs.slice(0, 9)];
    setLogs(updatedLogs);
    localStorage.setItem('twobe_consent_logs', JSON.stringify(updatedLogs));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                Consent Preferences
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                GDPR & CCPA Granular Consent Management
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2D1F24] dark:text-white">
          
          {/* Required Consents */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] uppercase tracking-wider">
              Mandatory Legal Consents
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-[#22171E] border border-[#F0DFE3] dark:border-[#3D2833] p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#2D1F24] dark:text-white flex items-center gap-1.5">
                    <span>Terms & Privacy Policy</span>
                    <Lock className="w-3 h-3 text-[#8B7578]" />
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Core platform legal framework and E2EE standards.
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  Required
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#F0DFE3] dark:border-[#3D2833]">
                <div>
                  <div className="font-bold text-[#2D1F24] dark:text-white flex items-center gap-1.5">
                    <span>Encrypted Data Processing</span>
                    <Lock className="w-3 h-3 text-[#8B7578]" />
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    On-device cryptographic key exchange and message sync.
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  Required
                </span>
              </div>
            </div>
          </div>

          {/* Optional Consents */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] uppercase tracking-wider">
              Optional Privacy Preferences
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] divide-y divide-[#F0DFE3] dark:divide-[#3D2833]">
              
              {/* Analytics */}
              <div className="p-3 flex items-center justify-between">
                <div className="pr-3">
                  <div className="font-bold text-[#2D1F24] dark:text-white">
                    Anonymous Analytics
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Anonymized UI interaction and feature timing to improve app performance.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.analytics}
                  onChange={() => handleToggle('analytics', consents.analytics)}
                  className="w-5 h-5 rounded text-[#87204B] accent-[#87204B]"
                />
              </div>

              {/* Crash Reporting */}
              <div className="p-3 flex items-center justify-between">
                <div className="pr-3">
                  <div className="font-bold text-[#2D1F24] dark:text-white">
                    Crash Diagnostic Reporting
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Automated stack traces sent upon app exceptions (zero personal data included).
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.crashReporting}
                  onChange={() => handleToggle('crashReporting', consents.crashReporting)}
                  className="w-5 h-5 rounded text-[#87204B] accent-[#87204B]"
                />
              </div>

              {/* Marketing Emails */}
              <div className="p-3 flex items-center justify-between">
                <div className="pr-3">
                  <div className="font-bold text-[#2D1F24] dark:text-white">
                    Product News & Tips
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Occasional emails about new intimacy features and milestone celebrations.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.marketingEmails}
                  onChange={() => handleToggle('marketingEmails', consents.marketingEmails)}
                  className="w-5 h-5 rounded text-[#87204B] accent-[#87204B]"
                />
              </div>

              {/* CCPA: Do Not Sell My Personal Information */}
              <div className="p-3 flex items-center justify-between bg-blue-50/40 dark:bg-blue-950/20">
                <div className="pr-3">
                  <div className="font-bold text-[#2D1F24] dark:text-white flex items-center gap-1.5">
                    <span>Do Not Sell or Share My Info (CCPA)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                      Honored
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    2Be never sells personal data. We honor Global Privacy Control (GPC) signals automatically.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={consents.doNotSell}
                  onChange={() => handleToggle('doNotSell', consents.doNotSell)}
                  className="w-5 h-5 rounded text-blue-600 accent-blue-600"
                />
              </div>

            </div>
          </div>

          {/* Real-time Consent Audit Log */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Consent Audit Log</span>
            </div>
            <div className="rounded-xl bg-[#FFF9F6] dark:bg-[#1A1217] border border-[#F0DFE3] dark:border-[#3D2833] p-2.5 max-h-32 overflow-y-auto space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] text-[#5D474F] dark:text-[#E6D7DE]">
                  <span className="font-medium truncate">{log.type}</span>
                  <span className="text-[9px] text-[#8B7578] ml-2 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-sm hover:brightness-105"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};
