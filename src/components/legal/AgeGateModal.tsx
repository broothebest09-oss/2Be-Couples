import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Calendar, Check, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

interface AgeGateModalProps {
  isOpen: boolean;
  onVerified: (ageTier: '18+' | '13-17', consents: { analytics: boolean; crashReporting: boolean }) => void;
  onCancel?: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onVerified,
  onCancel
}) => {
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState<number>(currentYear - 22);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [birthDay, setBirthDay] = useState<number>(1);

  // Region / GDPR Consents
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);
  const [consentAnalytics, setConsentAnalytics] = useState(false);
  const [consentCrashReporting, setConsentCrashReporting] = useState(false);
  const [parentalConsentConfirmed, setParentalConsentConfirmed] = useState(false);

  if (!isOpen) return null;

  // Calculate age accurately
  const calculateAge = () => {
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const m = today.getMonth() + 1 - birthMonth;
    if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge();
  const isUnder13 = calculatedAge < 13;
  const isTeen = calculatedAge >= 13 && calculatedAge < 18;
  const isAdult = calculatedAge >= 18;

  const canProceed =
    !isUnder13 &&
    agreeTerms &&
    agreePrivacy &&
    consentDataProcessing &&
    (!isTeen || parentalConsentConfirmed);

  const handleConfirm = () => {
    if (!canProceed) return;
    const tier = isAdult ? '18+' : '13-17';
    // Securely save verification state without storing raw birthdate
    localStorage.setItem('twobe_age_verified', 'true');
    localStorage.setItem('twobe_age_tier', tier);
    localStorage.setItem(
      'twobe_consents',
      JSON.stringify({
        terms: true,
        privacy: true,
        dataProcessing: true,
        analytics: consentAnalytics,
        crashReporting: consentCrashReporting,
        verifiedAt: new Date().toISOString()
      })
    );

    onVerified(tier, {
      analytics: consentAnalytics,
      crashReporting: consentCrashReporting
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
                Age Verification & Consent
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                COPPA & GDPR Compliance Gate
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7578] dark:text-[#E6D7DE] hover:bg-black/5 dark:hover:bg-white/10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-[#2D1F24] dark:text-white">
          
          {/* DOB Picker */}
          <div className="space-y-2">
            <label className="font-bold text-sm text-[#2D1F24] dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#87204B] dark:text-[#FFAEC8]" />
              <span>How old are you?</span>
            </label>
            <p className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
              2Be is an intimate couples sanctuary. Please select your birth date. Your birth date is securely verified and will never be displayed publicly.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Month */}
              <div>
                <span className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
                  Month
                </span>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#2D1F24] dark:text-white"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div>
                <span className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
                  Day
                </span>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#2D1F24] dark:text-white"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <span className="text-[10px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
                  Year
                </span>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#FFF9F6] dark:bg-[#170E14] border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#2D1F24] dark:text-white"
                >
                  {Array.from({ length: 85 }, (_, i) => currentYear - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Validation Notice based on age */}
          {isUnder13 && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1 text-rose-800 dark:text-rose-200">
              <div className="font-bold flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Eligibility Restriction</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                You must be <strong>13 or older</strong> to use 2Be. Pursuant to the Children's Online Privacy Protection Act (COPPA), we cannot establish accounts for users under 13.
              </p>
            </div>
          )}

          {isTeen && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-amber-900 dark:text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Parental Notice (Ages 13–17)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                You are eligible to use 2Be under teen safety policies. In jurisdictions where parental consent is required for users under the age of majority, your parent or guardian must review the Terms and Privacy Policy.
              </p>
              <label className="flex items-start space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentalConsentConfirmed}
                  onChange={(e) => setParentalConsentConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 accent-amber-600"
                />
                <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                  I confirm that my parent or legal guardian has reviewed and consented to my use of 2Be.
                </span>
              </label>
            </div>
          )}

          {isAdult && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Age verified: 18+ (Full adult private sanctuary access)</span>
            </div>
          )}

          {/* GDPR Legal Consents (Required for EU & Global Compliance) */}
          <div className="space-y-2.5 pt-1">
            <div className="font-bold text-xs text-[#2D1F24] dark:text-white uppercase tracking-wider">
              Legal Agreements & Consents
            </div>

            <div className="space-y-2 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] p-3">
              {/* Terms of Service */}
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 accent-rose-600"
                />
                <span className="text-[11px] leading-relaxed text-[#5D474F] dark:text-[#E6D7DE]">
                  <strong className="text-rose-600 dark:text-rose-400">* Required:</strong> I agree to the{' '}
                  <span className="font-bold underline text-[#87204B] dark:text-[#FFAEC8]">
                    Terms of Service
                  </span>
                  .
                </span>
              </label>

              {/* Privacy Policy */}
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 accent-rose-600"
                />
                <span className="text-[11px] leading-relaxed text-[#5D474F] dark:text-[#E6D7DE]">
                  <strong className="text-rose-600 dark:text-rose-400">* Required:</strong> I have read and agree to the{' '}
                  <span className="font-bold underline text-[#87204B] dark:text-[#FFAEC8]">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* Data Processing Consent */}
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentDataProcessing}
                  onChange={(e) => setConsentDataProcessing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 accent-rose-600"
                />
                <span className="text-[11px] leading-relaxed text-[#5D474F] dark:text-[#E6D7DE]">
                  <strong className="text-rose-600 dark:text-rose-400">* Required:</strong> I consent to the processing of my personal and end-to-end encrypted message data to provide the 2Be service.
                </span>
              </label>
            </div>

            {/* Optional Consents (GDPR compliant: unbundled & pre-unchecked) */}
            <div className="space-y-2 rounded-2xl bg-white dark:bg-[#1A1217] border border-[#F0DFE3] dark:border-[#3D2833] p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B7578] dark:text-[#A89598]">
                Optional Preferences (Configurable anytime in Settings)
              </div>

              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAnalytics}
                  onChange={(e) => setConsentAnalytics(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#87204B] accent-[#87204B]"
                />
                <span className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  I consent to anonymous app performance and engagement analytics.
                </span>
              </label>

              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentCrashReporting}
                  onChange={(e) => setConsentCrashReporting(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#87204B] accent-[#87204B]"
                />
                <span className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  I consent to automated crash diagnostic logs to help resolve bugs.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0DFE3] dark:border-[#3D2833] bg-[#FCF8F9] dark:bg-[#20151C] flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="py-2.5 px-4 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-semibold text-xs text-[#6D585E] dark:text-[#E6D7DE]"
            >
              Cancel
            </button>
          )}
          <button
            disabled={!canProceed}
            onClick={handleConfirm}
            className={`flex-1 py-3 rounded-full text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5 ${
              canProceed
                ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] hover:brightness-105 shadow-rose-950/20'
                : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed text-slate-400'
            }`}
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
