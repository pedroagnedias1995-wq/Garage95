import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  Bell, 
  MessageSquare, 
  Compass, 
  Flame, 
  Sparkles,
  Car,
  ChevronDown,
  Home,
  X,
  ShoppingBag,
  Calendar,
  Users,
  User as UserIcon,
  Award,
  LogOut,
  Sliders,
  Edit3,
  Menu
} from 'lucide-react';
import { User, NotificationItem } from '../types';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreatePost: () => void;
  openCreateVehicle: () => void;
  openNotifications: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  onSearch: (query: string) => void;
  searchQuery: string;
  openAdvisorModal: () => void;
  openAuthModal: () => void;
  openEditProfile?: () => void;
  openMyProfile?: () => void;
  onReplaySplash?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  openCreatePost,
  openCreateVehicle,
  openNotifications,
  unreadNotificationsCount,
  unreadMessagesCount,
  onSearch,
  searchQuery,
  openAdvisorModal,
  openAuthModal,
  openEditProfile,
  openMyProfile,
  onReplaySplash
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleGoHome = () => {
    setActiveTab('feed');
    onSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoProfile = () => {
    if (openMyProfile) {
      openMyProfile();
    } else {
      setActiveTab('garage');
    }
    setProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#141C15]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-15 sm:h-16 gap-2 sm:gap-3">
          
          {/* Logo & Brand Identity (Home Link) */}
          <div 
            onClick={handleGoHome}
            className="cursor-pointer group shrink-0 py-1"
            id="brand-logo-button"
            title="Ir para a Página Inicial (Feed)"
          >
            <AppLogo size="sm" variant="horizontal" className="group-hover:opacity-95 transition-opacity" />
          </div>

          {/* Search Bar (Featured & Prominent) */}
          <div className="flex-1 max-w-sm sm:max-w-md lg:max-w-xl mx-2 sm:mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]/70">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearch(e.target.value);
                  if (activeTab !== 'explore' && e.target.value.trim().length > 0) {
                    setActiveTab('explore');
                  }
                }}
                placeholder="Buscar clássicos, peças, eventos..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-[#1A241C] text-[#E8ECE8] placeholder-[#7E9180] rounded-full border border-[#3B4D3A] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8EA290] hover:text-[#F3E5AB] cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons & Quick Nav */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* Notifications */}
            <button
              id="notifications-nav-btn"
              onClick={openNotifications}
              className="relative p-2 text-[#A2B3A4] hover:text-[#F3E5AB] hover:bg-[#263628]/60 rounded-full transition-colors cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C9A227] text-[#121713] text-[10px] font-bold flex items-center justify-center border border-[#141C15]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Messages */}
            <button
              id="messages-nav-btn"
              onClick={() => setActiveTab('messages')}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'messages' 
                  ? 'text-[#D4AF37] bg-[#263628]' 
                  : 'text-[#A2B3A4] hover:text-[#F3E5AB] hover:bg-[#263628]/60'
              }`}
              title="Mensagens e Propostas"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C9A227] text-[#121713] text-[10px] font-bold flex items-center justify-center border border-[#141C15]">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Burger Menu Button & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                id="user-profile-nav-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  profileDropdownOpen || activeTab === 'garage' || activeTab === 'perfil' || activeTab === 'profile'
                    ? 'bg-[#263628] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 text-[#F3E5AB]' 
                    : 'bg-[#18221A] border-[#3B4D3A] hover:border-[#D4AF37]/60 text-[#E8ECE8] hover:text-[#F3E5AB]'
                }`}
                title="Menu Principal & Perfil"
                aria-label="Abrir menu"
              >
                <Menu className="w-5 h-5 text-[#D4AF37]" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#172018] border border-[#D4AF37]/40 rounded-2xl shadow-2xl py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User info header */}
                  <div 
                    onClick={handleGoProfile}
                    className="px-4 py-2.5 border-b border-[#3B4D3A]/60 flex items-center gap-3 cursor-pointer hover:bg-[#1E2B20] transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-[#F3E5AB] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#D4AF37] font-serif">{currentUser.collectorTier}</p>
                      <p className="text-[10px] text-[#8EA290]">{currentUser.garageCount} veículos cadastrados</p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="pt-1.5 space-y-0.5">
                    <button
                      onClick={handleGoProfile}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Ver Meu Perfil Completo</span>
                    </button>

                    {openEditProfile && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openEditProfile();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                        <span>Editar Perfil & Fotos</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('garage');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-[#D4AF37]" />
                      <span>Minha Garagem ({currentUser.garageCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openCreateVehicle();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                      <span>Cadastrar Novo Clássico</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openAdvisorModal();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#E5C158]" />
                      <span>Consultoria IA & Laudo Placa Preta</span>
                    </button>

                    {onReplaySplash && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onReplaySplash();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-[#E8ECE8] hover:bg-[#243327] hover:text-[#F3E5AB] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Flame className="w-4 h-4 text-[#D4AF37]" />
                        <span>Dar a Partida (Animação V8)</span>
                      </button>
                    )}

                    <div className="border-t border-[#3B4D3A]/50 my-1 pt-1">
                      <button
                        id="nav-btn-switch-account"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          openAuthModal();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#F3E5AB] hover:bg-[#2D3E30] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#D4AF37]" />
                        <span>Trocar ou Criar Conta</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
