import React from 'react';
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Vote, 
  Check, 
  CheckCircle2,
  Car,
  Lock,
  Globe,
  ShieldCheck,
  Award,
  Crown,
  Clock
} from 'lucide-react';
import { CommunityGroup } from '../types';

interface GroupCardProps {
  group: CommunityGroup;
  onSelect: (group: CommunityGroup) => void;
  onToggleJoin: (groupId: string) => void;
  isAutoSuggested?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onSelect,
  onToggleJoin,
  isAutoSuggested = false
}) => {
  const isPrivate = group.visibility === 'private';
  const requiresApproval = group.joinMode === 'approval_required';
  const isBrandOrModel = group.clubType === 'brand_model' || group.clubType === 'specific_model';

  return (
    <div
      onClick={() => onSelect(group)}
      id={`group-card-${group.id}`}
      className="group bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Banner & Badges */}
      <div className="relative h-32 bg-[#121613] overflow-hidden">
        <img
          src={group.bannerUrl}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-black/30 to-black/60" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Club Type Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {isPrivate ? (
              <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#E8ECE8] border border-amber-500/50 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                Privado (Convite)
              </span>
            ) : isBrandOrModel ? (
              <span className="px-2 py-0.5 rounded-full bg-[#18221A]/90 backdrop-blur-md text-[#F3E5AB] border border-[#D4AF37]/60 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Award className="w-3 h-3 text-[#D4AF37]" />
                Clube de Marca/Modelo
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#18221A]/90 backdrop-blur-md text-[#A2B3A4] border border-[#3B4D3A] text-[10px] font-semibold flex items-center gap-1 shadow-md">
                <Globe className="w-3 h-3 text-[#4F6650]" />
                Comunidade Geral
              </span>
            )}

            {/* Approval Required Badge */}
            {!isPrivate && requiresApproval && (
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 backdrop-blur-md text-amber-200 border border-amber-600/60 text-[10px] font-bold flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Aprovação Necessária
              </span>
            )}
          </div>

          {/* Auto Suggested Badge */}
          {isAutoSuggested && (
            <div className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#121713] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Car className="w-3 h-3" />
              Sua Garagem
            </div>
          )}
        </div>
      </div>

      {/* Avatar & Action Button overlap */}
      <div className="px-4 -mt-7 flex items-end justify-between relative z-10">
        <div className="relative">
          <img
            src={group.avatarUrl}
            alt=""
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] bg-[#18221A] shadow-xl"
          />
          {isPrivate && (
            <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[#D4AF37] text-[#121713] shadow-md">
              <Lock className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>

        <div>
          {group.isMember ? (
            <div className="flex items-center gap-1.5">
              {group.userRole === 'founder' && (
                <span className="px-2 py-1 rounded-lg bg-[#C9A227]/20 border border-[#D4AF37]/50 text-[#F3E5AB] text-[11px] font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#D4AF37]" />
                  Fundador
                </span>
              )}
              {group.userRole === 'moderator' && (
                <span className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Moderador
                </span>
              )}
              {(!group.userRole || group.userRole === 'member') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleJoin(group.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#263628] hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-700/50 text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Membro</span>
                </button>
              )}
            </div>
          ) : group.hasPendingRequest ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleJoin(group.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-950/60 text-amber-200 border border-amber-500/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Solicitação Enviada</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleJoin(group.id);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1"
            >
              {requiresApproval ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Solicitar Entrada</span>
                </>
              ) : (
                <>
                  <span>Entrar no Clube</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] font-mono mb-1">
            <span>{group.category}</span>
            {group.targetEra && <span>• {group.targetEra}</span>}
          </div>

          <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {group.name}
          </h3>

          <p className="text-xs text-[#8EA290] mt-1 line-clamp-2 leading-relaxed">
            {group.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {group.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141C15] text-[#A2B3A4] border border-[#3B4D3A]/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Metrics & Poll Indicator */}
        <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between text-xs text-[#8EA290]">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            {group.memberCount.toLocaleString()} membros
          </span>

          <div className="flex items-center gap-2">
            {group.eventsCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-[#8EA290]">
                <Calendar className="w-3 h-3 text-[#4F6650]" />
                {group.eventsCount}
              </span>
            )}

            {(group.pinnedPoll || (group.polls && group.polls.some(p => p.isActive))) && (
              <span className="flex items-center gap-1 text-[10px] text-[#E5C158] bg-[#263628] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 font-semibold">
                <Vote className="w-3 h-3" />
                Enquete
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
