import React, { useState } from 'react';
import { 
  User, 
  Vehicle, 
  Post, 
  MarketplaceListing, 
  ClubEvent 
} from '../types';
import { 
  Award,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  Car,
  Bookmark,
  TrendingUp,
  FileCheck,
  Volume2,
  Share2,
  Edit3,
  Camera,
  Instagram,
  Phone,
  MessageSquare,
  MessageCircle,
  UserPlus,
  UserCheck,
  UserMinus,
  Users,
  ArrowLeft,
  Video,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { PostCard } from './PostCard';
import { MarketplaceCard } from './MarketplaceCard';

interface ProfileViewProps {
  user: User;
  currentUser?: User;
  userVehicles: Vehicle[];
  userPosts: Post[];
  savedListings: MarketplaceListing[];
  savedPosts?: Post[];
  allEvents?: ClubEvent[];
  isFriend?: boolean;
  onToggleFriend?: (targetUser: User) => void;
  friendsList?: User[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: () => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
  onOpenValuation: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectListing: (listing: MarketplaceListing) => void;
  onToggleSaveListing: (listingId: string) => void;
  onToggleSavePost?: (postId: string) => void;
  onHashtagClick: (tag: string) => void;
  onContactAuthor: (author: User) => void;
  onViewUserProfile?: (author: User) => void;
  onBackToFeed?: () => void;
  onEditProfile?: () => void;
  onOpenCreatePost?: () => void;
  onNavigateToEvents?: () => void;
  openAuthModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  userVehicles,
  userPosts,
  savedListings,
  savedPosts = [],
  allEvents = [],
  isFriend = false,
  onToggleFriend,
  friendsList = [],
  onSelectVehicle,
  onAddVehicle,
  onEditVehicle,
  onOpenValuation,
  onLikePost,
  onAddComment,
  onSelectListing,
  onToggleSaveListing,
  onToggleSavePost,
  onHashtagClick,
  onContactAuthor,
  onViewUserProfile,
  onBackToFeed,
  onEditProfile,
  onOpenCreatePost,
  onNavigateToEvents,
  openAuthModal
}) => {
  const isOwnProfile = !currentUser || currentUser.id === user.id;
  const [profileTab, setProfileTab] = useState<'garagem' | 'publicacoes' | 'amigos' | 'salvos' | 'trofeus'>('garagem');
  const [savedSubFilter, setSavedSubFilter] = useState<'todos' | 'publicacoes' | 'anuncios'>('todos');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalSavedCount = savedListings.length + (savedPosts?.length || 0);
  const garageCompletion = userVehicles.length === 0
    ? 0
    : Math.round(
        userVehicles.reduce((total, vehicle) => {
          const completedFields = [
            vehicle.coverPhoto,
            vehicle.brand,
            vehicle.model,
            vehicle.year,
            vehicle.color,
            vehicle.engine,
            vehicle.horsepower,
            vehicle.restorationHistory,
            vehicle.photos?.length,
            vehicle.modifications?.length
          ].filter(Boolean).length;
          return total + Math.round((completedFields / 10) * 100);
        }, 0) / userVehicles.length
      );

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleShareProfile = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getWhatsAppUrl = (phoneStr?: string) => {
    if (!phoneStr) return '#';
    const digits = phoneStr.replace(/\D/g, '');
    const cleanNumber = digits.length <= 11 && !digits.startsWith('55') ? `55${digits}` : digits;
    const message = encodeURIComponent(`Olá ${user.name}! Encontrei seu perfil na Garage 95 e gostaria de conversar sobre seus veículos e negociações.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const availableTabs = [
    { id: 'amigos' as const, label: 'Amigos', icon: Users, count: friendsList.length || (user.friends?.length || 0) },
    { id: 'garagem' as const, label: 'Veículos', icon: Car, count: userVehicles.length },
    { id: 'publicacoes' as const, label: 'Publicações', icon: Sparkles, count: userPosts.length },
    ...(isOwnProfile ? [{ id: 'salvos' as const, label: 'Salvos', icon: Bookmark, count: totalSavedCount }] : []),
    { id: 'trofeus' as const, label: 'Troféus', icon: Award, count: user.trophies?.length || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Cover Banner */}
        <div className="h-48 sm:h-64 bg-gradient-to-r from-[#263628] via-[#1A241C] to-[#121713] relative overflow-hidden group">
          <img
            src={user.coverImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80"}
            alt="Capa do Perfil"
            className="w-full h-full object-cover opacity-60 group-hover:scale-101 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-black/20 to-black/40" />

          {/* Back Button (top-left) */}
          {onBackToFeed && (
            <button
              onClick={onBackToFeed}
              className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-black/75 hover:bg-black/95 backdrop-blur-md border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#F3E5AB] text-xs font-bold flex items-center gap-2 shadow-xl transition-all cursor-pointer"
              title="Voltar para a página anterior / feed"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span>Voltar</span>
            </button>
          )}

          {/* Edit Cover Overlay Button (only own profile) */}
          {isOwnProfile && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/60 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer hover:border-[#D4AF37]"
              title="Clique para editar a imagem de capa"
            >
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Editar Capa</span>
            </button>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-4 sm:px-6 pb-6 pt-0 relative z-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-20 gap-4 mb-5">
            
            {/* Avatar & Info */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="relative group shrink-0 z-10">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl object-cover border-4 border-[#D4AF37] shadow-2xl bg-[#141C15] shrink-0"
                />

                {/* Edit Avatar Overlay Button (only own profile) */}
                {isOwnProfile && onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[#F3E5AB] text-[11px] font-bold transition-all cursor-pointer border-2 border-[#D4AF37]"
                    title="Clique para alterar sua foto de perfil"
                  >
                    <Camera className="w-5 h-5 text-[#D4AF37] mb-1" />
                    <span>Trocar Foto</span>
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-heading font-black text-xl sm:text-2xl text-[#F3E5AB]">
                    {user.name}
                  </h1>
                </div>
                <p className="text-xs sm:text-sm font-mono text-[#D4AF37] font-semibold">{user.handle}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] text-[#8EA290] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    {user.location}
                  </span>
                  <span className="text-[11px] text-[#8EA290] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    Membro desde {user.memberSince || 'Agosto 2026'}
                  </span>
                  {user.instagram && (
                    <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 font-mono">
                      <Instagram className="w-3 h-3 text-[#D4AF37]" />
                      {user.instagram}
                    </span>
                  )}
                  {user.showPhoneOnProfile && user.phone && (
                    <a
                      href={getWhatsAppUrl(user.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-0.5 rounded-full bg-[#182a1d] hover:bg-[#203a27] text-[#25D366] text-[10px] font-bold border border-[#25D366]/40 flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      title="Abrir conversa no WhatsApp para negociações"
                    >
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                      <span>WhatsApp: {user.phone}</span>
                    </a>
                  )}
                  {user.authProvider === 'google' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#1e293b] text-blue-300 text-[10px] font-bold border border-blue-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      Vinculado via Google
                    </span>
                  )}
                  {user.authProvider === 'meta' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2a1728] text-pink-300 text-[10px] font-bold border border-pink-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-pink-400" />
                      Vinculado via Meta
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {isOwnProfile ? (
                <>
                  {onEditProfile && (
                    <button
                      id="profile-edit-main-btn"
                      onClick={onEditProfile}
                      className="px-3.5 py-2 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-semibold border border-[#D4AF37]/50 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      title="Editar dados, fotos e informações do perfil"
                    >
                      <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Editar Perfil</span>
                    </button>
                  )}

                  {onAddVehicle && (
                    <button
                      onClick={onAddVehicle}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Adicionar Veículo</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  {onToggleFriend && (
                    <button
                      id="profile-toggle-friend-btn"
                      onClick={() => onToggleFriend(user)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                        isFriend
                          ? 'bg-[#1C271E] text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#26372A] ring-1 ring-[#D4AF37]/30'
                          : 'bg-[#1D2B20] hover:bg-[#283B2C] text-[#F3E5AB] border border-[#D4AF37]/60 hover:border-[#D4AF37]'
                      }`}
                      title={isFriend ? "Remover dos Amigos" : "Adicionar aos Amigos"}
                    >
                      {isFriend ? (
                        <>
                          <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                          <span>Amigo Adicionado</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                          <span>Adicionar Amigo</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleToggleFollow}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isFollowing
                        ? 'bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/60 hover:bg-[#324535]'
                        : 'bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713]'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>Seguindo</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>

                  {user.showPhoneOnProfile && user.phone && (
                    <a
                      href={getWhatsAppUrl(user.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#172e1d] hover:bg-[#203f28] text-[#25D366] border border-[#25D366]/50 hover:border-[#25D366] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      title="Abrir WhatsApp para propostas e negociações"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Negociações</span>
                    </a>
                  )}

                  <button
                    onClick={() => onContactAuthor(user)}
                    className="px-4 py-2 rounded-xl bg-[#1C271E] hover:bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    <span>Enviar Mensagem</span>
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Bio */}
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs sm:text-sm text-[#D1DCD2] leading-relaxed">
              {user.bio}
            </p>
          </div>

          {isOwnProfile && (
            <div className="mt-5 max-w-xl p-3.5 rounded-2xl bg-[#141C15]/80 border border-[#D4AF37]/30">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Progresso da Garagem
                </span>
                <span className="text-xs font-mono font-bold text-[#F3E5AB]">{garageCompletion}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#263628] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#F3E5AB] transition-all duration-500"
                  style={{ width: `${garageCompletion}%` }}
                />
              </div>
              <p className="text-[10px] text-[#8EA290] mt-2">
                {garageCompletion >= 80
                  ? 'Sua Garagem está pronta para virar referência no clube.'
                  : 'Complete specs, fotos e história para desbloquear mais status.'}
              </p>
            </div>
          )}

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-t border-[#3B4D3A]/60 bg-[#141C15] overflow-x-auto">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = profileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id as typeof profileTab)}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-[#D4AF37] text-[#F3E5AB]'
                    : 'border-transparent text-[#8EA290] hover:text-[#E8ECE8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : ''}`} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-[#263628] text-[#D4AF37]' : 'bg-[#18221A] text-[#7E9180]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Tab Panels */}
      <div id="profile-tabs-content" className="scroll-mt-6">
        
        {/* Garage Vitrine Tab */}
        {profileTab === 'garagem' && (
          <div className="space-y-4">
            {userVehicles.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {userVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onSelect={onSelectVehicle}
                      onEdit={isOwnProfile ? onEditVehicle : undefined}
                      onViewOwnerProfile={onViewUserProfile}
                    />
                  ))}
                  {isOwnProfile && (
                    <button
                      onClick={onAddVehicle}
                      className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-[#141C15]/80 hover:bg-[#182319] border-2 border-dashed border-[#3B4D3A] hover:border-[#D4AF37] text-center transition-all cursor-pointer min-h-[280px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#263628] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform mb-3">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-serif font-bold text-sm text-[#F3E5AB] group-hover:text-white transition-colors">
                        Adicionar Veículo
                      </span>
                      <span className="text-[11px] text-[#8EA290] mt-1">
                        Cadastrar novo veículo na garagem
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-2xl p-10 text-center space-y-3">
                <Car className="w-12 h-12 text-[#D4AF37] mx-auto opacity-60" />
                <h4 className="font-serif font-bold text-[#F3E5AB]">
                  {isOwnProfile ? 'Sua Garagem está vazia' : 'Nenhum veículo exibido na vitrine'}
                </h4>
                <p className="text-xs text-[#8EA290] max-w-sm mx-auto">
                  {isOwnProfile 
                    ? 'Cadastre seu veículo para exibir na sua garagem.' 
                    : 'Este colecionador ainda não adicionou veículos públicos à sua garagem.'}
                </p>
                {isOwnProfile && (
                  <button
                    onClick={onAddVehicle}
                    className="px-4 py-2 bg-[#C9A227] text-[#121713] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Adicionar Primeiro Veículo
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {profileTab === 'publicacoes' && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Quick Share Photos / Videos Box for Collector */}
            {isOwnProfile && onOpenCreatePost && (
              <div className="bg-[#18221A] border border-[#3B4D3A]/70 hover:border-[#D4AF37]/60 rounded-2xl p-4 transition-all shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#D4AF37] shrink-0"
                  />
                  <button
                    type="button"
                    onClick={onOpenCreatePost}
                    className="flex-1 px-4 py-2.5 bg-[#121713] hover:bg-[#152016] border border-[#3B4D3A] rounded-xl text-left text-xs text-[#8EA290] hover:text-[#E8ECE8] transition-colors cursor-pointer"
                  >
                    Compartilhe fotos, vídeos do ronco do motor ou a história da sua máquina...
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#3B4D3A]/40">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenCreatePost}
                      className="px-3 py-1.5 rounded-xl bg-[#141C15] hover:bg-[#263628] text-xs font-semibold text-[#F3E5AB] border border-[#3B4D3A] hover:border-[#D4AF37]/60 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenCreatePost}
                      className="px-3 py-1.5 rounded-xl bg-[#141C15] hover:bg-[#263628] text-xs font-semibold text-[#F3E5AB] border border-[#3B4D3A] hover:border-[#D4AF37]/60 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Vídeo</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCreatePost}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Publicar</span>
                  </button>
                </div>
              </div>
            )}

            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser || user}
                  onLikePost={onLikePost}
                  onAddComment={onAddComment}
                  onSelectVehicle={onSelectVehicle}
                  onHashtagClick={onHashtagClick}
                  onContactAuthor={onContactAuthor}
                  onViewUserProfile={onViewUserProfile}
                />
              ))
            ) : (
              <div className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-2xl p-8 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto opacity-60" />
                <h4 className="font-serif font-bold text-[#F3E5AB]">
                  {isOwnProfile ? 'Nenhuma publicação realizada ainda' : 'Nenhuma publicação feita por este colecionador ainda'}
                </h4>
                <p className="text-xs text-[#8EA290] max-w-sm mx-auto">
                  {isOwnProfile 
                    ? 'Compartilhe fotos, vídeos de restauração, passeios e encontros com os membros do clube.' 
                    : 'Acompanhe este perfil para ver suas próximas postagens.'}
                </p>
                {isOwnProfile && onOpenCreatePost && (
                  <button
                    type="button"
                    onClick={onOpenCreatePost}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Publicar Primeira Foto / Vídeo</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {profileTab === 'amigos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                  {isOwnProfile ? 'Minha Lista de Amigos' : `Amigos de ${user.name}`} ({friendsList.length})
                </h3>
                <p className="text-xs text-[#8EA290]">
                  {isOwnProfile
                    ? 'Colecionadores e entusiastas conectados com você na rede Garage 95.'
                    : `Colecionadores conectados ao círculo exclusivo de ${user.name.split(' ')[0]}.`}
                </p>
              </div>
            </div>

            {friendsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friendsList.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37]/60 rounded-2xl p-4 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div 
                          onClick={() => onViewUserProfile && onViewUserProfile(friend)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#D4AF37]/70 group-hover:scale-105 transition-transform bg-[#141C15]"
                            />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors leading-tight">
                              {friend.name}
                            </h4>
                            <p className="text-[11px] font-mono text-[#D4AF37] font-semibold">{friend.handle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 py-2 border-t border-b border-[#3B4D3A]/40 my-2">
                        <p className="text-[11px] text-[#8EA290] line-clamp-2 leading-relaxed">
                          {friend.bio}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-[#D1DCD2] pt-1">
                          <span className="flex items-center gap-1 text-[#8EA290]">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
                            {friend.location}
                          </span>
                          <span className="flex items-center gap-1 text-[#D4AF37] font-medium font-mono">
                            <Car className="w-3 h-3" />
                            {friend.garageCount || 1} {friend.garageCount === 1 ? 'veículo' : 'veículos'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onViewUserProfile && onViewUserProfile(friend)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Ver Perfil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onContactAuthor(friend)}
                        className="p-2 rounded-xl bg-[#1D281F] hover:bg-[#2A3B2D] text-[#D4AF37] border border-[#3B4D3A] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                        title={`Enviar mensagem para ${friend.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {isOwnProfile && onToggleFriend && (
                        <button
                          type="button"
                          onClick={() => onToggleFriend(friend)}
                          className="p-2 rounded-xl bg-[#2A1D1D] hover:bg-[#3D2525] text-red-400 border border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer"
                          title="Remover dos amigos"
                        >
                          <UserMinus className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-2xl p-10 text-center space-y-3">
                <Users className="w-12 h-12 text-[#D4AF37] mx-auto opacity-60" />
                <h4 className="font-serif font-bold text-[#F3E5AB]">
                  {isOwnProfile ? 'Você ainda não possui amigos adicionados' : `${user.name} ainda não possui amigos listados`}
                </h4>
                <p className="text-xs text-[#8EA290] max-w-sm mx-auto">
                  {isOwnProfile
                    ? 'Conecte-se com outros colecionadores de clássicos! Acesse os perfis pelo Feed ou Explorar e clique no botão "Adicionar Amigo".'
                    : 'Este colecionador ainda não adicionou conexões públicas à sua lista de amigos.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Trophies Tab */}
        {profileTab === 'trofeus' && (
          <div>
            {user.trophies && user.trophies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.trophies.map((trophy, idx) => (
                  <div
                    key={idx}
                    className="bg-[#18221A] border border-[#D4AF37]/40 p-4 rounded-2xl shadow-lg flex items-start gap-3.5"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8C6D12] text-[#121713] shadow-md shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{trophy.year} • {trophy.category}</span>
                      <h4 className="font-serif font-bold text-sm text-[#F3E5AB] mt-0.5">{trophy.title}</h4>
                      <p className="text-xs text-[#8EA290] mt-1">{trophy.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#18221A] border border-[#3B4D3A]/50 rounded-2xl p-8 text-center text-xs text-[#8EA290]">
                Nenhuma premiação ou concurso de elegância cadastrado no momento.
              </div>
            )}
          </div>
        )}

        {/* Saved Tab (exibindo publicações e anúncios que salvei) */}
        {isOwnProfile && profileTab === 'salvos' && (
          <div className="space-y-6">
            
            {/* Header & Sub-filter chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18221A] border border-[#3B4D3A]/60 p-4 sm:p-5 rounded-2xl shadow-lg">
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB] flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Publicações & Anúncios Salvos ({totalSavedCount})</span>
                </h3>
                <p className="text-xs text-[#8EA290] mt-0.5">
                  Seus conteúdos favoritos, postagens salvas da comunidade e anúncios marcados no Marketplace.
                </p>
              </div>

              {/* Sub-filter tabs */}
              <div className="flex items-center gap-1.5 bg-[#141C15] p-1 rounded-xl border border-[#3B4D3A]/50 shrink-0 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSavedSubFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    savedSubFilter === 'todos'
                      ? 'bg-[#C9A227] text-[#121713] shadow-md'
                      : 'text-[#8EA290] hover:text-[#E8ECE8]'
                  }`}
                >
                  Todos ({totalSavedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setSavedSubFilter('publicacoes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    savedSubFilter === 'publicacoes'
                      ? 'bg-[#C9A227] text-[#121713] shadow-md'
                      : 'text-[#8EA290] hover:text-[#E8ECE8]'
                  }`}
                >
                  Publicações ({savedPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSavedSubFilter('anuncios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    savedSubFilter === 'anuncios'
                      ? 'bg-[#C9A227] text-[#121713] shadow-md'
                      : 'text-[#8EA290] hover:text-[#E8ECE8]'
                  }`}
                >
                  Anúncios ({savedListings.length})
                </button>
              </div>
            </div>

            {/* Total empty state */}
            {totalSavedCount === 0 ? (
              <div className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-2xl p-10 text-center space-y-3">
                <Bookmark className="w-12 h-12 text-[#D4AF37] mx-auto opacity-60" />
                <h4 className="font-serif font-bold text-[#F3E5AB]">
                  Nenhum item salvo ainda
                </h4>
                <p className="text-xs text-[#8EA290] max-w-md mx-auto">
                  Você pode salvar publicações tocando no ícone de marcador (<Bookmark className="w-3.5 h-3.5 inline text-[#D4AF37]" />) nos posts do feed ou nos anúncios de veículos e peças do Marketplace.
                </p>
                {onBackToFeed && (
                  <button
                    type="button"
                    onClick={onBackToFeed}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Explorar Feed de Colecionadores</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* 1. Publicações Salvas Section */}
                {(savedSubFilter === 'todos' || savedSubFilter === 'publicacoes') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#3B4D3A]/40 pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#F3E5AB] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Publicações Salvas ({savedPosts.length})</span>
                      </h4>
                      {savedSubFilter === 'todos' && savedPosts.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSavedSubFilter('publicacoes')}
                          className="text-[11px] text-[#D4AF37] hover:underline font-mono"
                        >
                          Ver somente posts
                        </button>
                      )}
                    </div>

                    {savedPosts.length > 0 ? (
                      <div className="space-y-5 max-w-3xl">
                        {savedPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser || user}
                            onLikePost={onLikePost}
                            onAddComment={onAddComment}
                            onSelectVehicle={onSelectVehicle}
                            onHashtagClick={onHashtagClick}
                            onContactAuthor={onContactAuthor}
                            onViewUserProfile={onViewUserProfile}
                            onToggleSavePost={onToggleSavePost}
                          />
                        ))}
                      </div>
                    ) : (
                      savedSubFilter === 'publicacoes' && (
                        <div className="bg-[#18221A] border border-[#3B4D3A]/50 rounded-2xl p-6 text-center text-xs text-[#8EA290]">
                          Nenhuma publicação salva no momento. Toque no ícone de marcador em qualquer post do feed para salvá-lo aqui.
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* 2. Anúncios Salvos do Marketplace Section */}
                {(savedSubFilter === 'todos' || savedSubFilter === 'anuncios') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#3B4D3A]/40 pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#F3E5AB] flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#D4AF37]" />
                        <span>Anúncios Salvos do Mercado ({savedListings.length})</span>
                      </h4>
                      {savedSubFilter === 'todos' && savedListings.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSavedSubFilter('anuncios')}
                          className="text-[11px] text-[#D4AF37] hover:underline font-mono"
                        >
                          Ver somente anúncios
                        </button>
                      )}
                    </div>

                    {savedListings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {savedListings.map((listing) => (
                          <MarketplaceCard
                            key={listing.id}
                            listing={listing}
                            onSelect={onSelectListing}
                            onToggleSave={onToggleSaveListing}
                            onViewUserProfile={onViewUserProfile}
                          />
                        ))}
                      </div>
                    ) : (
                      savedSubFilter === 'anuncios' && (
                        <div className="bg-[#18221A] border border-[#3B4D3A]/50 rounded-2xl p-6 text-center text-xs text-[#8EA290]">
                          Nenhum anúncio salvo no momento. Salve veículos e peças do Marketplace com o ícone de marcador.
                        </div>
                      )
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
