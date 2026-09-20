import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  Check, 
  Tag, 
  Image as ImageIcon,
  Lock,
  Globe,
  ShieldCheck,
  Award,
  Link as LinkIcon,
  HelpCircle,
  Car
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityGroup, User, ClubVisibility, ClubJoinMode, ClubType } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: (group: CommunityGroup) => void;
  currentUser: User;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onAddGroup,
  currentUser
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Clássicos Nacionais');
  const [clubType, setClubType] = useState<ClubType>('brand_model');
  const [visibility, setVisibility] = useState<ClubVisibility>('public');
  const [joinMode, setJoinMode] = useState<ClubJoinMode>('free');
  const [inviteExpiration, setInviteExpiration] = useState<'Sem expiração' | '24 horas' | '7 dias'>('Sem expiração');
  const [targetEra, setTargetEra] = useState('1960 - 1980');
  const [tags, setTags] = useState('#Clube #Classicos #Encontros');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanCode = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'CLUB';
    const inviteCode = `INV-${cleanCode}-${randomSuffix}`;

    const newGroup: CommunityGroup = {
      id: `grp_${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || name.trim(),
      description: description.trim() || 'Comunidade de colecionadores e entusiastas no GaragemClub.',
      category: category.trim() || 'Clássicos',
      clubType,
      visibility,
      joinMode: visibility === 'private' ? 'approval_required' : joinMode,
      targetEra,
      tags: tags.split(' ').filter(t => t.startsWith('#')),
      bannerUrl,
      avatarUrl,
      memberCount: 1,
      isMember: true,
      userRole: 'founder',
      founderId: currentUser.id,
      founderName: currentUser.name,
      inviteLink: {
        code: inviteCode,
        url: `https://garagemclub.app/invite/${inviteCode}`,
        expiresLabel: inviteExpiration,
        createdAt: 'Hoje',
        active: true
      },
      rules: [
        'Respeito mútuo entre todos os membros e preservação do acervo.',
        'Compartilhar apenas informações e fotos de veículos e peças verídicas.',
        'Utilizar os fóruns adequados para cada tipo de publicação técnica ou comercial.'
      ],
      members: [
        {
          user: currentUser,
          role: 'founder',
          joinedAt: 'Fundador • Hoje',
          vehicleInClub: 'Veículo Principal da Garagem'
        }
      ],
      forumCategories: [
        {
          id: `cat_mec_${Date.now()}`,
          name: 'Mecânica & Restauração',
          description: 'Debates sobre preparação, usinagem, suspensão, elétrica e peças.',
          topicsCount: 0,
          topics: []
        },
        {
          id: `cat_mkt_${Date.now()}`,
          name: 'Compra e Venda entre Membros',
          description: 'Espaço exclusivo para ofertas e busca de peças raras entre membros.',
          topicsCount: 0,
          topics: []
        },
        {
          id: `cat_meet_${Date.now()}`,
          name: 'Encontros e Comboios',
          description: 'Organização de saídas em comboio, passeios e encontros do clube.',
          topicsCount: 0,
          topics: []
        },
        {
          id: `cat_gen_${Date.now()}`,
          name: 'Bate-papo Geral',
          description: 'Histórias, curiosidades e conversas livres entre colecionadores.',
          topicsCount: 0,
          topics: []
        }
      ],
      faqs: [
        {
          id: `faq_init_1`,
          question: 'Quais os requisitos para se manter ativo no clube?',
          answer: 'Participar das discussões e seguir as regras de boa convivência e preservação histórica.'
        }
      ],
      clubPosts: [],
      postsCount: 0,
      eventsCount: 0
    };

    onAddGroup(newGroup);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C9A227', '#4F6650']
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                Fundar Novo Clube / Comunidade
              </h3>
              <p className="text-xs text-[#8EA290]">Configure a visibilidade, regras de acesso e fóruns internos.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto custom-scrollbar">
          
          {/* VISIBILITY SELECTOR (CRITICAL REQUIREMENT) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              1. Visibilidade do Clube *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option: Public */}
              <div
                onClick={() => setVisibility('public')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  visibility === 'public'
                    ? 'bg-[#223023] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'bg-[#121713] border-[#3B4D3A]/60 hover:border-[#3B4D3A] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#2B3B2D] text-[#D4AF37]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#F3E5AB]">Clube Público</span>
                  </div>
                  {visibility === 'public' && (
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#121713] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#8EA290] leading-relaxed">
                  Visível na aba "Descobrir" e buscas gerais. Qualquer colecionador pode encontrar e visualizar a comunidade.
                </p>
              </div>

              {/* Option: Private */}
              <div
                onClick={() => setVisibility('private')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  visibility === 'private'
                    ? 'bg-[#223023] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'bg-[#121713] border-[#3B4D3A]/60 hover:border-[#3B4D3A] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-950/60 text-[#D4AF37]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#F3E5AB]">Clube Privado</span>
                  </div>
                  {visibility === 'private' && (
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#121713] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#8EA290] leading-relaxed">
                  Oculto em buscas e descoberta. Acesso exclusivo e restrito através de Link de Convite gerado por você.
                </p>
              </div>

            </div>
          </div>

          {/* JOIN MODE OR INVITE LINK CONFIG */}
          {visibility === 'public' ? (
            <div className="p-3.5 rounded-xl bg-[#141C15] border border-[#3B4D3A]/60 space-y-2">
              <label className="block text-xs font-bold text-[#E8ECE8]">
                Controle de Entrada (Clube Público)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setJoinMode('free')}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                    joinMode === 'free'
                      ? 'bg-[#263628] border-[#D4AF37] text-[#F3E5AB] font-bold'
                      : 'bg-[#121713] border-[#3B4D3A]/50 text-[#8EA290]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span>Entrada Livre</span>
                    {joinMode === 'free' && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  </div>
                  <span className="text-[10px] text-[#8EA290] font-normal block">
                    Qualquer colecionador entra instantaneamente no clube.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setJoinMode('approval_required')}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                    joinMode === 'approval_required'
                      ? 'bg-[#263628] border-[#D4AF37] text-[#F3E5AB] font-bold'
                      : 'bg-[#121713] border-[#3B4D3A]/50 text-[#8EA290]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span>Mediante Aprovação</span>
                    {joinMode === 'approval_required' && <Check className="w-3 h-3 text-[#D4AF37]" />}
                  </div>
                  <span className="text-[10px] text-[#8EA290] font-normal block">
                    Solicitações precisam de aprovação do fundador ou moderador.
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                <LinkIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Link de Convite Exclusivo</span>
              </div>
              <p className="text-[11px] text-[#8EA290]">
                Um link exclusivo será gerado automaticamente. Escolha o tempo de validade inicial do link:
              </p>
              <div className="flex items-center gap-2 pt-1">
                {(['Sem expiração', '24 horas', '7 dias'] as const).map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setInviteExpiration(exp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      inviteExpiration === exp
                        ? 'bg-[#D4AF37] text-[#121713] border-[#D4AF37]'
                        : 'bg-[#121713] text-[#8EA290] border-[#3B4D3A]/60 hover:text-[#E8ECE8]'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CLUB TYPE SELECTOR */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#8EA290]">
              Tipo de Comunidade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'brand_model' as ClubType, label: 'Clube de Marca', desc: 'Ex: Ford, Porsche' },
                { id: 'specific_model' as ClubType, label: 'Modelo Específico', desc: 'Ex: Opala SS, Fusca' },
                { id: 'general_community' as ClubType, label: 'Comunidade Geral', desc: 'Ex: V8, Aircooled, Pista' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setClubType(t.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    clubType === t.id
                      ? 'bg-[#263628] border-[#D4AF37] text-[#F3E5AB]'
                      : 'bg-[#121713] border-[#3B4D3A]/50 text-[#8EA290]'
                  }`}
                >
                  <span className="text-xs font-bold block">{t.label}</span>
                  <span className="text-[10px] text-[#8EA290] block truncate">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* BASIC INFO */}
          <div>
            <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Nome do Clube *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maverick GT & V8 Society"
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Categoria / Estilo</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Muscle Cars, Aircooled, Motos"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Década de Foco</label>
              <input
                type="text"
                value={targetEra}
                onChange={(e) => setTargetEra(e.target.value)}
                placeholder="Ex: 1960 - 1980"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Slogan ou Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Preservando a história e o ronco dos motores de alta cilindrada."
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Descrição do Clube</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objetivos do clube, tipos de veículos aceitos, encontros e trocas técnicas..."
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Hashtags / Tags de Busca</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#V8 #Ford #Mustang #Arrancada"
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Banner de Capa (URL)</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Brasão / Avatar (URL)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#3B4D3A]/60 flex items-center justify-between gap-3">
            <div className="text-[11px] text-[#8EA290]">
              Você será registrado como <span className="text-[#D4AF37] font-bold">Fundador</span>.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Fundar Clube</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
