import React from 'react';
import { 
  Home, 
  Compass, 
  Car, 
  Warehouse,
  ShoppingBag, 
  Calendar, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Award, 
  PlusCircle, 
  ExternalLink, 
  Flame, 
  Shield, 
  User as UserIcon, 
  ChevronRight,
  Edit3
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  openCreateVehicle: () => void;
  openAdvisorModal: () => void;
  openEditProfile?: () => void;
  openMyProfile?: () => void;
  openAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  openCreateVehicle,
  openAdvisorModal,
  openEditProfile,
  openMyProfile,
  openAuthModal
}) => {
  const isProfileActive = activeTab === 'garage' || activeTab === 'perfil' || activeTab === 'profile';

  const navItems = [
    { id: 'feed', label: 'Linha do Tempo', icon: Car, badge: undefined },
    { id: 'explore', label: 'Explorar & Tendências', icon: Compass, badge: 'Hot' },
    { id: 'garage', label: 'Minha Garagem', icon: Warehouse, count: currentUser.garageCount },
    { id: 'marketplace', label: 'Marketplace Clássicos', icon: ShoppingBag, badge: 'Novo' },
    { id: 'events', label: 'Eventos & Encontros', icon: Calendar, badge: undefined },
    { id: 'groups', label: 'Comunidades & Grupos', icon: Users, badge: undefined },
    { id: 'messages', label: 'Mensagens Diretas', icon: MessageSquare, badge: undefined },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        
        {/* Navigation Card */}
        <div className="bg-[#18221A]/90 border border-[#3B4D3A]/60 rounded-2xl p-3 shadow-xl backdrop-blur-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'garage' ? isProfileActive : activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    if (item.id === 'garage' && openMyProfile) {
                      openMyProfile();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2B3B2D] to-[#1C271E] text-[#F3E5AB] border border-[#D4AF37]/40 shadow-inner'
                      : 'text-[#B4C4B6] hover:bg-[#202E23] hover:text-[#E8ECE8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8EA290]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#2F4132] text-[#D4AF37] border border-[#D4AF37]/20">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#C9A227]/20 text-[#E5C158] border border-[#C9A227]/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-3 border-t border-[#3B4D3A]/40 pt-3">
            <button
              onClick={openAdvisorModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#293B2B] to-[#19241B] text-[#F3E5AB] border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#E5C158]" />
                <span>Curador & IA Especialista</span>
              </div>
              <span className="text-[10px] text-[#C9A227] font-mono">Gemini</span>
            </button>
          </div>
        </div>

        {/* Quick User Collector Badge Card */}
        <div 
          onClick={() => {
            if (openMyProfile) {
              openMyProfile();
            } else {
              setActiveTab('garage');
            }
          }}
          className={`group bg-gradient-to-br from-[#1C271E] to-[#131A14] rounded-2xl p-4 shadow-xl transition-all cursor-pointer ${
            isProfileActive 
              ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/20' 
              : 'border border-[#D4AF37]/30 hover:border-[#D4AF37]/70'
          }`}
          title="Clique para abrir seu Perfil Completo"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37] group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#C9A227] text-[#121713] rounded-full p-0.5">
                  <Shield className="w-3 h-3" />
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-xs text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors truncate">
                    {currentUser.name}
                  </p>
                </div>
                <p className="text-[11px] font-mono text-[#D4AF37] font-semibold">{currentUser.handle}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 px-1 text-center bg-[#151E16] rounded-xl border border-[#3B4D3A]/40 mb-3 text-xs">
            <div>
              <p className="font-bold text-[#E8ECE8]">{currentUser.garageCount}</p>
              <p className="text-[10px] text-[#8EA290]">Veículos</p>
            </div>
            <div className="border-l border-[#3B4D3A]/40">
              <p className="font-bold text-[#D4AF37]">{currentUser.followersCount}</p>
              <p className="text-[10px] text-[#8EA290]">Amigos</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (openMyProfile) {
                  openMyProfile();
                } else {
                  setActiveTab('garage');
                }
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Ver Meu Perfil Completo</span>
            </button>
            {openEditProfile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditProfile();
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-[#1E2B20] hover:bg-[#263628] text-[#F3E5AB] text-xs font-medium border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Editar Perfil & Fotos</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openCreateVehicle();
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-[#263628] hover:bg-[#324835] text-[#F3E5AB] text-xs font-semibold border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cadastrar Novo Veículo</span>
            </button>
            {openAuthModal && (
              <button
                type="button"
                id="sidebar-btn-switch-account"
                onClick={(e) => {
                  e.stopPropagation();
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-[#141C15] hover:bg-[#1C271E] text-[#B4C4B6] hover:text-[#F3E5AB] text-[11px] font-medium border border-[#3B4D3A]/60 transition-all cursor-pointer"
              >
                <span>Trocar ou Criar Conta</span>
              </button>
            )}
          </div>
        </div>

        {/* Club Etiquette & Placa Preta Note */}
        <div className="p-3.5 rounded-2xl bg-[#172018]/60 border border-[#3B4D3A]/30 text-[11px] text-[#8EA290] space-y-1.5">
          <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs font-serif">
            <Award className="w-3.5 h-3.5" />
            <span>Certificado Placa Preta</span>
          </div>
          <p className="leading-relaxed">
            Valorize os 85%+ de originalidade. Suas fotos e histórico técnico constroem o patrimônio histórico do antigomobilismo.
          </p>
        </div>

      </div>
    </aside>
  );
};
