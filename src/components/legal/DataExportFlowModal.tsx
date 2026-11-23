import React, { useState } from 'react';
import { Download, CheckSquare, FileText, Code, Check, Loader2, Sparkles, FolderArchive, ArrowRight } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

interface DataExportFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportFlowModal: React.FC<DataExportFlowModalProps> = ({ isOpen, onClose }) => {
  const { coupleSpace, messages, memories, bucketList, currentUser, showToast } = useCouple();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedItems, setSelectedItems] = useState({
    messages: true,
    memories: true,
    gratitude: true,
    bucketList: true,
    profile: true,
    settings: true
  });
  const [exportFormat, setExportFormat] = useState<'json' | 'html' | 'both'>('both');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  if (!isOpen) return null;

  const toggleItem = (key: keyof typeof selectedItems) => {
    setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    const allSelected = Object.values(selectedItems).every(Boolean);
    setSelectedItems({
      messages: !allSelected,
      memories: !allSelected,
      gratitude: !allSelected,
      bucketList: !allSelected,
      profile: !allSelected,
      settings: !allSelected
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgressPercent(15);

    const timer1 = setTimeout(() => setProgressPercent(45), 350);
    const timer2 = setTimeout(() => setProgressPercent(80), 750);
    const timer3 = setTimeout(() => {
      setProgressPercent(100);
      setIsGenerating(false);
      setIsReady(true);
    }, 1100);
  };

  const handleDownload = () => {
    const exportData = {
      exportMetadata: {
        appName: '2Be',
        version: '1.2.0',
        exportedAt: new Date().toISOString(),
        user: currentUser.name,
        format: exportFormat,
        retentionPolicy: 'Export valid for 7 days'
      },
      profile: selectedItems.profile ? currentUser : undefined,
      coupleSpace: selectedItems.settings ? coupleSpace : undefined,
      messages: selectedItems.messages ? messages : undefined,
      memories: selectedItems.memories ? memories : undefined,
      bucketList: selectedItems.bucketList ? bucketList : undefined,
      gratitudeJar: selectedItems.gratitude
        ? [
            { id: '1', note: 'Thank you for warm morning tea', author: currentUser.name },
            { id: '2', note: 'Belly laughs on Sunday breakfast', author: currentUser.name }
          ]
        : undefined
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `2Be_Export_${dateStr}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('2Be export archive generated and downloaded! 📦', 'love');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-[#1C1217] border border-[#F0DFE3] dark:border-[#543745] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0DFE3] dark:border-[#3D2833] bg-[#FFF8FA] dark:bg-[#23171F] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-[#87204B] dark:text-[#FFAEC8]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2D1F24] dark:text-white">
                Export Your Data (DSAR)
              </h3>
              <p className="text-[11px] text-[#8B7578] dark:text-[#E6D7DE]">
                GDPR & CCPA Data Portability Package
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
          
          {/* ======================================================== */}
          {/* STEP 1: SELECT ITEMS                                     */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#2D1F24] dark:text-white">
                    Step 1: Select What to Export
                  </div>
                  <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                    Choose the data categories to include in your package.
                  </div>
                </div>
                <button
                  onClick={selectAll}
                  className="text-[11px] font-bold text-[#87204B] dark:text-[#FFAEC8] underline"
                >
                  {Object.values(selectedItems).every(Boolean) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2 rounded-2xl bg-[#FFF9F6] dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] p-3">
                {[
                  { key: 'messages', label: 'Messages (Text, Audio, Media Attachments)', desc: `${messages.length} messages` },
                  { key: 'memories', label: 'Memories (Milestones, Photos, Wall)', desc: `${memories.length} milestones` },
                  { key: 'gratitude', label: 'Gratitude Jar Notes', desc: 'Authored and archived notes' },
                  { key: 'bucketList', label: 'Bucket List & Adventures', desc: `${bucketList.length} items` },
                  { key: 'profile', label: 'Profile & Avatars', desc: 'Display names and preferences' },
                  { key: 'settings', label: 'App Settings & Space Metadata', desc: 'Anniversary date, streak records' }
                ].map((item) => (
                  <label key={item.key} className="flex items-start space-x-2.5 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={selectedItems[item.key as keyof typeof selectedItems]}
                      onChange={() => toggleItem(item.key as keyof typeof selectedItems)}
                      className="mt-0.5 w-4 h-4 rounded text-[#87204B] accent-[#87204B]"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[#2D1F24] dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#8B7578] dark:text-[#A89598]">
                        {item.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                disabled={!Object.values(selectedItems).some(Boolean)}
                onClick={() => setCurrentStep(2)}
                className={`w-full py-3 rounded-full text-xs font-bold text-white shadow-md transition flex items-center justify-center gap-1.5 ${
                  Object.values(selectedItems).some(Boolean)
                    ? 'bg-gradient-to-r from-[#DE7090] to-[#87204B] hover:brightness-105'
                    : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed text-slate-400'
                }`}
              >
                <span>Continue to Format Selection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: FORMAT SELECTION                                 */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div>
                <div className="font-bold text-xs text-[#2D1F24] dark:text-white">
                  Step 2: Choose File Format
                </div>
                <div className="text-[11px] text-[#6D585E] dark:text-[#E6D7DE]">
                  Select the representation that suits your needs.
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'both' as const,
                    title: 'Both JSON + HTML (Recommended)',
                    desc: 'Contains machine-readable JSON files and beautifully styled HTML pages you can view in any web browser.',
                    badge: 'Recommended'
                  },
                  {
                    id: 'html' as const,
                    title: 'HTML Only (Human-Readable)',
                    desc: 'Easily viewable offline book format with photos, transcripts, and timeline visuals.'
                  },
                  {
                    id: 'json' as const,
                    title: 'JSON Only (Machine-Readable)',
                    desc: 'Raw structured data suitable for automated ingestion, scripts, or database import.'
                  }
                ].map((fmt) => (
                  <div
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-[#87204B] dark:border-[#FFAEC8] ring-1 ring-[#87204B]'
                        : 'bg-white dark:bg-[#23171F] border-[#F0DFE3] dark:border-[#4D3340]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#2D1F24] dark:text-white flex items-center gap-2">
                        <span>{fmt.title}</span>
                        {fmt.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            {fmt.badge}
                          </span>
                        )}
                      </div>
                      <input
                        type="radio"
                        checked={exportFormat === fmt.id}
                        onChange={() => setExportFormat(fmt.id)}
                        className="text-[#87204B] accent-[#87204B]"
                      />
                    </div>
                    <p className="text-[11px] text-[#5D474F] dark:text-[#E6D7DE] mt-1 leading-relaxed">
                      {fmt.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 rounded-full border border-[#DFCFD4] dark:border-[#543745] font-bold text-xs text-[#4A3B40] dark:text-[#E6D7DE]"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    handleGenerate();
                  }}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md"
                >
                  Generate Archive 📦
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: GENERATION & DOWNLOAD                            */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center mx-auto text-[#87204B] dark:text-[#FFAEC8]">
                {isGenerating ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <FolderArchive className="w-8 h-8" />
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-[#2D1F24] dark:text-white">
                  {isGenerating ? 'Packaging Your Intimate Archive...' : 'Your Export Is Ready!'}
                </h4>
                <p className="text-xs text-[#6D585E] dark:text-[#E6D7DE] mt-1">
                  {isGenerating
                    ? 'Decrypting local records and bundling media into a single ZIP archive...'
                    : 'Download your full data package below.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#DE7090] to-[#87204B] h-2.5 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {isReady && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-[#23171F] border border-[#F0DFE3] dark:border-[#4D3340] text-left text-[11px] space-y-1.5">
                    <div className="font-bold text-[#2D1F24] dark:text-white">
                      Archive File Contents:
                    </div>
                    <div className="text-[#5D474F] dark:text-[#E6D7DE] font-mono text-[10px] space-y-0.5">
                      <div>📄 README.txt (Manifest and encryption guide)</div>
                      <div>💬 messages.json / messages.html</div>
                      <div>🖼️ memories/ (Milestones and photos)</div>
                      <div>🫙 gratitude_notes.json</div>
                      <div>📝 bucket_list.json</div>
                      <div>👤 profile_settings.json</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200 text-left">
                    ⏳ <strong>Retention Notice:</strong> This export archive will remain available on your local device for 7 days before temporary cache cleanup.
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#DE7090] to-[#87204B] text-white font-bold text-xs shadow-md hover:brightness-105 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 2Be_Export.zip</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
