import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  MapPin, 
  Instagram, 
  Phone, 
  User as UserIcon, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Sparkle, 
  MessageCircle, 
  Calendar, 
  Info 
} from 'lucide-react';
import { User } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  {
    label: 'Clássico Formal',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Piloto Vintage',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Entusiasta Porsche',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mestre Restaurador',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Colecionadora Elegante',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Piloto Track Day',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80'
  }
];

const PRESET_COVERS = [
  {
    label: 'Porsche 911 Sunset',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Garagem Noturna V8',
    url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Oficina de Restauração',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Encontro Histórico',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Pista & Asfalto Clássico',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80'
  },
  {
    label: 'Cockpit Vintage em Madeira',
    url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80'
  }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser?.name || 'Membro');
  const [handle, setHandle] = useState(currentUser?.handle || '@membro');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [coverImage, setCoverImage] = useState(currentUser?.coverImage || PRESET_COVERS[0].url);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || 'São Paulo, SP');
  const [collectorTier, setCollectorTier] = useState<User['collectorTier']>(currentUser?.collectorTier || 'Colecionador');
  const [specialty, setSpecialty] = useState(currentUser?.specialty || 'Restauração de V8 Americanos & Clássicos Nacionais');
  const [instagram, setInstagram] = useState(currentUser?.instagram || '@edu.classicos');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [showPhoneOnProfile, setShowPhoneOnProfile] = useState<boolean>(currentUser?.showPhoneOnProfile ?? false);
  const memberSince = currentUser?.memberSince || 'Agosto 2026';
  const [verifiedCollector, setVerifiedCollector] = useState(currentUser?.verifiedCollector ?? true);

  const [activeTab, setActiveTab] = useState<'fotos' | 'dados'>('fotos');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

    const updatedUser: User = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      handle: formattedHandle,
      avatar: avatar.trim() || currentUser.avatar,
      coverImage: coverImage.trim() || currentUser.coverImage,
      bio: bio.trim() || currentUser.bio,
      location: location.trim() || currentUser.location,
      collectorTier,
      specialty: specialty.trim(),
      instagram: instagram.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      showPhoneOnProfile: Boolean(showPhoneOnProfile),
      memberSince,
      verifiedCollector
    };

    onSaveProfile(updatedUser);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#172119] border border-[#D4AF37]/50 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#E8ECE8]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#3B4D3A]/60 flex items-center justify-between bg-[#131A14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#263628] to-[#162018] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-heading font-bold text-lg sm:text-xl text-[#F3E5AB]">
                Editar Perfil do Colecionador
              </h2>
              <p className="text-xs text-[#8EA290]">
                Atualize sua foto, capa, identificação e credenciais na Garage 95
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8EA290] hover:text-[#F3E5AB] hover:bg-[#263628] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3B4D3A]/60 bg-[#141C15] px-4">
          <button
            type="button"
            onClick={() => setActiveTab('fotos')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'fotos'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#1E2B20]/60'
                : 'border-transparent text-[#8EA290] hover:text-[#E8ECE8]'
            }`}
          >
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span>Fotos & Capa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dados')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dados'
                ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#1E2B20]/60'
                : 'border-transparent text-[#8EA290] hover:text-[#E8ECE8]'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Informações Pessoais</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ================= TAB: FOTOS & CAPA ================= */}
          {activeTab === 'fotos' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Interactive Live Banner & Avatar Preview */}
              <div className="bg-[#141C15] border border-[#3B4D3A] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#D4AF37]">
                  <span>Pré-visualização em Tempo Real</span>
                  <span className="text-[11px] text-[#8EA290]">Como outros membros veem</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-[#3B4D3A]/80 shadow-lg">
                  {/* Cover Preview */}
                  <div className="h-32 sm:h-40 relative bg-black">
                    <img
                      src={coverImage}
                      alt="Capa preview"
                      className="w-full h-full object-cover opacity-60"
                      onError={() => setCoverImage(PRESET_COVERS[0].url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141C15] via-transparent to-black/30" />
                    
                    {/* Change Cover Trigger Button */}
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-[#D4AF37]/60 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Fazer Upload de Capa</span>
                    </button>
                  </div>

                  {/* Avatar Preview */}
                  <div className="px-4 pb-4 flex items-end justify-between -mt-12 relative">
                    <div className="flex items-end gap-3">
                      <div className="relative group">
                        <img
                          src={avatar}
                          alt="Avatar preview"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-[#D4AF37] shadow-xl bg-[#141C15]"
                          onError={() => setAvatar('')}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[#F3E5AB] text-[10px] font-bold transition-all cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-[#D4AF37] mb-0.5" />
                          <span>Alterar</span>
                        </button>
                      </div>

                      <div className="pb-1">
                        <h4 className="font-bold text-sm sm:text-base text-[#F3E5AB] flex items-center gap-1.5">
                          {name || 'Seu Nome'}
                        </h4>
                        <p className="text-xs text-[#D4AF37] font-mono">{handle || '@seuvin'}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#263628] hover:bg-[#344837] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Upload de Foto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarFileUpload}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Upload instructions / tips card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div 
                  onClick={() => avatarInputRef.current?.click()}
                  className="bg-[#141C15] hover:bg-[#182319] border border-[#3B4D3A] hover:border-[#D4AF37]/60 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3.5 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#263628] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#F3E5AB] group-hover:text-white transition-colors">
                      Foto de Perfil
                    </h5>
                    <p className="text-[11px] text-[#8EA290]">
                      Formatos JPG, PNG ou WEBP (quadrada)
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="bg-[#141C15] hover:bg-[#182319] border border-[#3B4D3A] hover:border-[#D4AF37]/60 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3.5 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#263628] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#F3E5AB] group-hover:text-white transition-colors">
                      Imagem de Capa
                    </h5>
                    <p className="text-[11px] text-[#8EA290]">
                      Formatos panorâmicos (16:9 ou 21:9)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: DADOS PESSOAIS ================= */}
          {activeTab === 'dados' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Nome Completo <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Eduardo Vasconcellos"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Identificador / @Handle <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="Ex: @edu_vasconcellos"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] font-mono text-[#D4AF37] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#8EA290]">
                    Biografia & Paixão Automotiva
                  </label>
                  <span className="text-[10px] text-[#7E9180]">{bio.length}/350 caracteres</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={350}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte sobre sua história com veículos antigos, carros que já teve ou seu projeto de restauração..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Location & Social */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Localização (Cidade, Estado)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: São Paulo, SP • Brasil"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Instagram / Rede Social
                  </label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Ex: @edu.classicos"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phone, WhatsApp Toggle & Automatic Registration Info */}
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-[#141C15] border border-[#3B4D3A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#263628] border border-[#D4AF37]/40 text-[#D4AF37]">
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#F3E5AB]">
                          Contato Direto para WhatsApp / Negociações
                        </label>
                        <p className="text-[11px] text-[#8EA290]">
                          Número com DDD para propostas de compra, venda e troca de informações
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +55 (11) 98765-4321 ou (11) 98765-4321"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#1A241B] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  {/* Toggle to show WhatsApp publicly on profile */}
                  <label className="flex items-start gap-3 pt-2 border-t border-[#3B4D3A]/40 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showPhoneOnProfile}
                      onChange={(e) => setShowPhoneOnProfile(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#D4AF37] rounded cursor-pointer shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors">
                        Mostrar botão de contato direto do WhatsApp publicamente no perfil
                      </span>
                      <p className="text-[11px] text-[#8EA290] mt-0.5 leading-normal">
                        Se ativado, outros membros e colecionadores poderão clicar para iniciar uma conversa no WhatsApp diretamente do seu perfil para tirar dúvidas ou fazer propostas.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Automatic Member Since Info Card (No manual input) */}
                <div className="p-3.5 rounded-2xl bg-[#141C15]/70 border border-[#3B4D3A]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <span className="text-[#8EA290] text-[11px]">Tempo de Membro do Clube:</span>
                      <p className="font-semibold text-[#F3E5AB]">{memberSince}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#263628] text-[10px] text-[#A3B8A6] font-mono flex items-center gap-1 border border-[#3B4D3A]">
                    <Info className="w-3 h-3 text-[#D4AF37]" />
                    Atribuído automaticamente
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-[#3B4D3A]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141C15] hover:bg-[#263628] text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] border border-[#3B4D3A] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {savedFeedback ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Perfil Atualizado!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#121713]" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
