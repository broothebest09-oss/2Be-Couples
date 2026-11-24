import React, { useState, useEffect } from 'react';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Toast } from './components/common/Toast';
import { HomeScreen } from './components/home/HomeScreen';
import { ChatScreen } from './components/chat/ChatScreen';
import { SnapScreen } from './components/snap/SnapScreen';
import { UsHub } from './components/us/UsHub';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AvatarScreen } from './components/avatar/AvatarScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Smartphone, Monitor, Lock, Fingerprint, Sparkles, RefreshCw } from 'lucide-react';
import { analytics } from './services/analytics';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isAppLocked,
    unlockApp,
    biometricLockEnabled,
    coupleSpace,
    isDarkMode,
    isSettingsOpen,
    setIsSettingsOpen
  } = useCouple();

  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile' | 'responsive'>('mobile');
  const [isPaired, setIsPaired] = useState<boolean>(() => {
    return localStorage.getItem('twobe_is_paired') === 'true';
  });

  // Analytics Engine initialization
  useEffect(() => {
    analytics.init();
  }, []);

  // Automatic Screen View Tracking
  useEffect(() => {
    if (!isPaired) {
      analytics.trackScreenView('screen_onboarding', 'OnboardingFlow');
      return;
    }
    if (isSettingsOpen) {
      analytics.trackScreenView('screen_settings', 'SettingsScreen');
    } else {
      const screenMap: Record<string, { name: string; cls: string }> = {
        home: { name: 'screen_home', cls: 'HomeScreen' },
        chat: { name: 'screen_chat', cls: 'ChatScreen' },
        snap: { name: 'screen_snap', cls: 'SnapScreen' },
        us: { name: 'screen_us_memories', cls: 'UsHub' },
        avatar: { name: 'screen_avatar_customizer', cls: 'AvatarScreen' },
        profile: { name: 'screen_profile', cls: 'AvatarScreen' }
      };
      const current = screenMap[activeTab] || { name: `screen_${activeTab}`, cls: 'Screen' };
      analytics.trackScreenView(current.name, current.cls);
    }
  }, [activeTab, isSettingsOpen, isPaired]);

  // If not paired, show the 7-screen Onboarding and Pairing flow
  if (!isPaired) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1A1416] text-[#F5E6EA]' : 'bg-[#FCF9F7] text-[#181114]'
      }`}>
        <div className="mx-auto max-w-md min-h-screen relative shadow-2xl border-x border-[#EADADF] dark:border-[#3D2F34]">
          <OnboardingFlow
            onComplete={(partnerName) => {
              setIsPaired(true);
            }}
          />
        </div>
      </div>
    );
  }

  // If app is locked by biometric lock
  if (isAppLocked && biometricLockEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1416] p-4">
        <div className="w-full max-w-sm rounded-[24px] p-8 bg-[#261E21] border border-[#3D2F34] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#E8A5B9]/20 border border-[#E8A5B9]/40 flex items-center justify-center mx-auto text-[#E8A5B9]">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">2Be Locked</h2>
            <p className="text-xs text-[#A89598] mt-1">Biometric privacy protection active</p>
          </div>
          <button
            onClick={unlockApp}
            className="w-full py-3 rounded-[24px] bg-gradient-to-r from-[#E8A5B9] to-[#9B4D6F] text-white text-xs font-semibold shadow-rose-glow"
          >
            Unlock with FaceID / TouchID
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-midnight-950 text-slate-100' : 'bg-[#F4F0EB] text-[#181114]'
    }`}>
      {/* Desktop view-mode toggle pill */}
      <div className="hidden lg:flex fixed top-4 right-6 z-50 items-center space-x-2 bg-white/95 dark:bg-midnight-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#DFCFD4] dark:border-lavender-500/30 shadow-xl text-xs text-[#181114] dark:text-slate-300">
        <button
          onClick={() => setDeviceFrameMode('mobile')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition ${
            deviceFrameMode === 'mobile'
              ? 'bg-gradient-to-r from-[#E07998] to-[#8C244F] text-white font-semibold shadow-sm'
              : 'hover:text-[#8C244F] dark:hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone Frame</span>
        </button>
        <button
          onClick={() => setDeviceFrameMode('responsive')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full transition ${
            deviceFrameMode === 'responsive'
              ? 'bg-gradient-to-r from-[#E07998] to-[#8C244F] text-white font-semibold shadow-sm'
              : 'hover:text-[#8C244F] dark:hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Width</span>
        </button>
      </div>

      {/* App Container */}
      <div
        className={`mx-auto transition-all duration-300 min-h-screen flex flex-col ${
          deviceFrameMode === 'mobile'
            ? 'max-w-md bg-[#FFFFFF] dark:bg-[#140C11] shadow-2xl relative border-x border-[#E2D2D7] dark:border-[#4D333F]'
            : 'w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#140C11] min-h-screen'
        }`}
      >
        <Header />

        <main className="flex-1 px-4 overflow-y-auto">
          {isSettingsOpen ? (
            <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'chat' && <ChatScreen />}
              {activeTab === 'snap' && <SnapScreen />}
              {activeTab === 'us' && <UsHub />}
              {(activeTab === 'avatar' || activeTab === 'profile') && <AvatarScreen />}
            </>
          )}
        </main>

        <Navigation />
        <Toast />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CoupleProvider>
      <MainLayout />
    </CoupleProvider>
  );
};

export default App;
