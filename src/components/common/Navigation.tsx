import React from 'react';
import { Home, MessageCircleHeart, Camera, Sparkles, User } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useCouple();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircleHeart },
    { id: 'us' as const, label: 'Us', icon: Sparkles },
    { id: 'avatar' as const, label: 'Avatar', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/98 dark:bg-[#160D13]/98 border-t border-[#E5D7DB] dark:border-[#4D333F] safe-area-bottom pb-1 shadow-lg dark:shadow-none transition-colors">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-14 py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#8C244F] dark:text-[#FFA8C5] font-extrabold'
                  : 'text-[#544248] dark:text-[#CBB5BE] hover:text-[#8C244F] dark:hover:text-white font-medium'
              }`}
            >
              {/* Active ambient glow pill */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-[#E07998] via-[#8C244F] to-[#E07998] rounded-full shadow-rose-glow" />
              )}

              <Icon
                className={`w-6 h-6 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.9]'
                }`}
              />
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
