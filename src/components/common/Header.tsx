import React from 'react';
import { Heart, Moon, Sun, ArrowLeftRight, BatteryMedium, Sparkles, Settings } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    partnerUser,
    switchUser,
    isDarkMode,
    toggleDarkMode,
    sendSecretLove,
    activeTab,
    setIsSettingsOpen,
    pairingStatus
  } = useCouple();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-[#160D13]/95 border-b border-[#E5D7DB] dark:border-[#4D333F] transition-colors shadow-sm dark:shadow-none">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand & Partner Status */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8A5B9] dark:ring-[#FFA8C5]/50 shadow-sm"
            />
            {partnerUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#160D13] rounded-full"></span>
            )}
            {partnerUser.mood && (
              <span className="absolute -top-1 -right-1 text-xs">
                {partnerUser.mood.split(' ').pop()}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-extrabold tracking-tight text-[#181114] dark:text-white">
                {partnerUser.nickname || partnerUser.name}
              </span>
              {partnerUser.batteryLevel && (
                <div className="flex items-center text-[10px] text-[#544248] dark:text-[#E2D1D8] font-bold">
                  <BatteryMedium className="w-3 h-3 ml-0.5 text-[#544248] dark:text-[#E2D1D8]" />
                  <span>{partnerUser.batteryLevel}%</span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-[#8C244F] dark:text-[#FFA8C5] font-semibold line-clamp-1 truncate max-w-[140px]">
              {partnerUser.statusMessage}
            </span>
          </div>
        </div>

        {/* Right actions: Secret Love pulse, Perspective Switcher, Theme toggle */}
        <div className="flex items-center space-x-2">
          {/* Secret Love trigger */}
          <button
            onClick={sendSecretLove}
            title="Send Secret Love Pulse"
            className="p-2 rounded-full bg-rose-50 dark:bg-[#2D1D27] hover:bg-rose-100 dark:hover:bg-[#3D2534] text-[#8C244F] dark:text-[#FFA8C5] transition active:scale-90 border border-rose-200/60 dark:border-[#4D333F]"
          >
            <Heart className="w-4 h-4 fill-rose-500 dark:fill-[#FFA8C5]" />
          </button>

          {/* Perspective Switcher */}
          <button
            onClick={switchUser}
            title={`Switch to ${partnerUser.name}'s view`}
            className="flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-full bg-[#FFF4E6] hover:bg-[#FFE8D6] dark:bg-[#2D1D27] dark:hover:bg-[#3D2534] border border-[#E8A5B9] dark:border-[#4D333F] text-[#8C244F] dark:text-white transition active:scale-95 font-bold shadow-sm"
          >
            <ArrowLeftRight className="w-3 h-3 text-[#8C244F] dark:text-[#FFA8C5]" />
            <span className="hidden xs:inline">As {currentUser.name.split(' ')[0]}</span>
          </button>

          {/* Gear icon on Home and Us tabs */}
          {(activeTab === 'home' || activeTab === 'us') && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              className="p-2 rounded-full text-[#544248] dark:text-[#E2D1D8] hover:text-[#181114] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-[#544248] dark:text-[#E2D1D8] hover:text-[#8C244F] dark:hover:text-white" />
            </button>
          )}

          {/* Dark / Light toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-[#544248] dark:text-[#E2D1D8] hover:text-[#181114] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#8C244F]" />}
          </button>
        </div>
      </div>

      {/* Cooling-off / Unpair notification banners */}
      {pairingStatus === 'cooling_off' && (
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="bg-amber-600 text-white text-[11px] font-bold px-4 py-1.5 flex items-center justify-between cursor-pointer hover:bg-amber-700 transition"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>🕊️</span>
            <span className="truncate">Cooling-Off Active (72h). Either partner can cancel anytime.</span>
          </span>
          <span className="underline ml-2 shrink-0">Settings ›</span>
        </div>
      )}
      {pairingStatus === 'confirmation_pending' && (
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="bg-rose-600 text-white text-[11px] font-bold px-4 py-1.5 flex items-center justify-between cursor-pointer hover:bg-rose-700 transition"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>⚠️</span>
            <span className="truncate">Cooling-off elapsed. Mutual confirmation required.</span>
          </span>
          <span className="underline ml-2 shrink-0">Review ›</span>
        </div>
      )}
      {pairingStatus === 'dissolved' && (
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="bg-[#2D1F24] dark:bg-[#1A1116] border-t border-[#4D333F] text-white text-[11px] font-bold px-4 py-1.5 flex items-center justify-between cursor-pointer hover:bg-[#3D2B32] transition"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>🕊️</span>
            <span className="truncate">Connection Dissolved • Shared records in Archived Data</span>
          </span>
          <span className="underline ml-2 shrink-0 text-[#FFA8C5]">Archive ›</span>
        </div>
      )}
    </header>
  );
};
