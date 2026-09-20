import React from 'react';
import { Car, Compass, Warehouse, ShoppingBag, Calendar, Users } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessagesCount?: number;
  openMyProfile?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  openMyProfile
}) => {
  const isProfileActive = activeTab === 'garage' || activeTab === 'perfil' || activeTab === 'profile';

  const tabs = [
    { id: 'feed', label: 'Início', icon: Car },
    { id: 'explore', label: 'Explorar', icon: Compass },
    { id: 'marketplace', label: 'Mercado', icon: ShoppingBag },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'groups', label: 'Clubes', icon: Users },
    { id: 'garage', label: 'Garagem', icon: Warehouse }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#141C15]/95 backdrop-blur-xl border-t border-[#D4AF37]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.85)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'garage' ? isProfileActive : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'garage' && openMyProfile) {
                  openMyProfile();
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer ${
                isActive ? 'text-[#F3E5AB]' : 'text-[#8EA290] hover:text-[#B4C4B6]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold text-[#D4AF37]' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
