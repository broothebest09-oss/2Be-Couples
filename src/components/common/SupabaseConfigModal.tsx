import React, { useState } from 'react';
import { Database, Key, CheckCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY, configureSupabaseCredentials } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('https://')) {
      setError('Project URL must start with https:// (e.g. https://xyzcompany.supabase.co)');
      return;
    }
    if (cleanKey.length < 20) {
      setError('Please enter a valid Supabase anon/public API key');
      return;
    }

    configureSupabaseCredentials(cleanUrl, cleanKey);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1F171A] rounded-[24px] border border-[#F0DFE3] dark:border-[#3D2F34] shadow-2xl overflow-hidden p-6 text-[#2D1F24] dark:text-[#F5E6EA] animate-scaleIn">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0DFE3] dark:border-[#3D2F34]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8A5B9]/20 flex items-center justify-center text-[#9B4D6F] dark:text-[#E8A5B9]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Connect Supabase</h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#A89598]">
                Real emails, user accounts & live 2-phone sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#8B7578]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSupabaseConfigured ? (
          <div className="my-4 p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold">Supabase is Connected & Live!</div>
              <div className="text-[11px] opacity-80 mt-0.5">Real email codes and real-time syncing are active.</div>
            </div>
          </div>
        ) : (
          <div className="my-4 p-3 rounded-[14px] bg-[#FFF4E6] dark:bg-[#33282C] border border-[#E8A5B9]/40 text-xs text-[#9B4D6F] dark:text-[#E8A5B9] space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <span>Free Setup (Takes 2 minutes)</span>
            </div>
            <p className="text-[11px] text-[#8B7578] dark:text-[#D4C3C7] leading-relaxed">
              1. Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold text-[#9B4D6F] dark:text-[#E8A5B9] inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-0.5 inline" /></a> and create a free project.<br />
              2. Open <b>Project Settings → API</b> and copy your <b>URL</b> and <b>anon public key</b> below.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
              Project URL
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzabcdefg.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[14px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#9B4D6F] text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8B7578] dark:text-[#A89598] block mb-1">
              Anon Public API Key
            </label>
            <input
              type="text"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[14px] bg-[#FFF9F5] dark:bg-[#1A1416] border border-[#F0DFE3] dark:border-[#3D2F34] focus:outline-none focus:border-[#9B4D6F] text-xs font-mono"
            />
          </div>

          <div className="pt-2 flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-[20px] bg-slate-100 dark:bg-white/10 text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-[20px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow active:scale-95 transition"
            >
              Save & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
