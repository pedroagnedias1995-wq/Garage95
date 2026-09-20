import React, { useState, useRef } from 'react';
import { 
  X, 
  Users, 
  Vote, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Car,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Upload,
  Heart,
  Film,
  Plus,
  Lock,
  Globe,
  Link as LinkIcon,
  Copy,
  Check,
  Calendar,
  HelpCircle,
  BookOpen,
  Crown,
  Share2,
  Clock,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Pin,
  ChevronDown,
  ChevronUp,
  MapPin,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CommunityGroup, 
  User, 
  Vehicle, 
  ClubMember, 
  ForumCategory, 
  ForumTopic, 
  ForumReply,
  ClubFAQ, 
  ClubPost, 
  ClubPoll,
  ClubJoinRequest 
} from '../types';

interface GroupDetailModalProps {
  group: CommunityGroup | null;
  onClose: () => void;
  onToggleJoin: (groupId: string) => void;
  onVotePoll: (groupId: string, optionId: string, pollId?: string) => void;
  currentUser: User;
  userVehicles: Vehicle[];
  onUpdateGroup?: (updatedGroup: CommunityGroup) => void;
}

export const GroupDetailModal: React.FC<GroupDetailModalProps> = ({
  group,
  onClose,
  onToggleJoin,
  onVotePoll,
  currentUser,
  userVehicles,
  onUpdateGroup
}) => {
  if (!group) return null;

  type TabType = 'posts' | 'forums' | 'events' | 'members' | 'faqs' | 'polls' | 'rules';
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  // Role detection
  const isFounder = group.userRole === 'founder' || group.founderId === currentUser.id;
  const isModerator = group.userRole === 'moderator';
  const isPrivileged = isFounder || isModerator;
  const isMember = group.isMember;

  // Invite Link State
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteExpiration, setInviteExpiration] = useState<'Sem expiração' | '24 horas' | '7 dias'>(
    group.inviteLink?.expiresLabel || 'Sem expiração'
  );

  // Forum navigation state
  const [selectedForumCategory, setSelectedForumCategory] = useState<ForumCategory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategoryId, setNewTopicCategoryId] = useState<string>(
    group.forumCategories?.[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Feed / Posts State
  const [newPostText, setNewPostText] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [newPostVehicleTag, setNewPostVehicleTag] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // FAQ State
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(group.faqs?.[0]?.id || null);
  const [showNewFaqModal, setShowNewFaqModal] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Events State
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('Próximo Sábado, 09:00');
  const [newEventLocation, setNewEventLocation] = useState('Ponto de Encontro da Estrada Velha');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Polls State
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOption1, setNewPollOption1] = useState('');
  const [newPollOption2, setNewPollOption2] = useState('');
  const [newPollOption3, setNewPollOption3] = useState('');

  // Rules State
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');

  // Members search
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Helper to trigger state sync
  const updateGroup = (updater: (prev: CommunityGroup) => CommunityGroup) => {
    if (onUpdateGroup) {
      const updated = updater(group);
      onUpdateGroup(updated);
    }
  };

  // Handle Copy Invite Link
  const handleCopyInviteLink = () => {
    const link = group.inviteLink?.url || `https://garagemclub.app/invite/${group.inviteLink?.code || 'CLUB'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Regenerate Invite Code
  const handleRegenerateInviteLink = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanCode = group.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'CLUB';
    const newCode = `INV-${cleanCode}-${randomSuffix}`;

    updateGroup((prev) => ({
      ...prev,
      inviteLink: {
        code: newCode,
        url: `https://garagemclub.app/invite/${newCode}`,
        expiresLabel: inviteExpiration,
        createdAt: 'Agora',
        active: true
      }
    }));

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
  };

  // Post Submission
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: ClubPost = {
      id: `cpost_${Date.now()}`,
      author: currentUser,
      text: newPostText.trim(),
      content: newPostText.trim(),
      mediaType: newPostMediaType === 'none' ? undefined : newPostMediaType,
      mediaUrl: newPostMediaUrl.trim() || undefined,
      vehicleTagged: newPostVehicleTag.trim() || undefined,
      timestamp: 'Agora',
      createdAt: 'Agora',
      likes: 0,
      likesCount: 0,
      isLiked: false,
      replies: 0,
      commentsCount: 0
    };

    updateGroup((prev) => ({
      ...prev,
      clubPosts: [newPost, ...(prev.clubPosts || [])],
      postsCount: (prev.postsCount || 0) + 1
    }));

    setNewPostText('');
    setNewPostMediaUrl('');
    setNewPostMediaType('none');
    setNewPostVehicleTag('');
    setShowNewPostForm(false);
  };

  // Like Post
  const handleLikePost = (postId: string) => {
    updateGroup((prev) => ({
      ...prev,
      clubPosts: (prev.clubPosts || []).map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    }));
  };

  // Create Forum Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: ForumCategory = {
      id: `cat_${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim() || 'Discussões temáticas da comunidade.',
      topicsCount: 0,
      topics: []
    };

    updateGroup((prev) => ({
      ...prev,
      forumCategories: [...(prev.forumCategories || []), newCat]
    }));

    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowNewCategoryModal(false);
  };

  // Create Forum Topic
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    const newTopic: ForumTopic = {
      id: `topic_${Date.now()}`,
      categoryId: newTopicCategoryId || group.forumCategories?.[0]?.id || 'default',
      title: newTopicTitle.trim(),
      author: currentUser,
      content: newTopicContent.trim(),
      repliesCount: 0,
      viewsCount: 1,
      createdAt: 'Agora',
      lastActivity: 'Agora',
      replies: []
    };

    updateGroup((prev) => {
      const updatedCats = (prev.forumCategories || []).map((cat) => {
        if (cat.id === newTopic.categoryId) {
          return {
            ...cat,
            topicsCount: (cat.topicsCount || 0) + 1,
            topics: [newTopic, ...(cat.topics || [])]
          };
        }
        return cat;
      });
      return { ...prev, forumCategories: updatedCats };
    });

    setNewTopicTitle('');
    setNewTopicContent('');
    setShowNewTopicModal(false);
    setSelectedTopic(newTopic);
  };

  // Reply to Topic
  const handleReplyTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTopic) return;

    const newReply: ForumReply = {
      id: `reply_${Date.now()}`,
      author: currentUser,
      content: replyText.trim(),
      text: replyText.trim(),
      createdAt: 'Agora',
      timestamp: 'Agora',
      likesCount: 0
    };

    const updatedTopic = {
      ...selectedTopic,
      repliesCount: (selectedTopic.repliesCount || 0) + 1,
      lastActivity: 'Agora',
      replies: [...(selectedTopic.replies || []), newReply]
    };

    setSelectedTopic(updatedTopic);

    updateGroup((prev) => {
      const updatedCats = (prev.forumCategories || []).map((cat) => {
        if (cat.id === selectedTopic.categoryId) {
          return {
            ...cat,
            topics: (cat.topics || []).map((t) => (t.id === selectedTopic.id ? updatedTopic : t))
          };
        }
        return cat;
      });
      return { ...prev, forumCategories: updatedCats };
    });

    setReplyText('');
  };

  // Create FAQ
  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const newFaq: ClubFAQ = {
      id: `faq_${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim()
    };

    updateGroup((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }));

    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setShowNewFaqModal(false);
    setExpandedFaqId(newFaq.id);
  };

  // Create Rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    updateGroup((prev) => ({
      ...prev,
      rules: [...(prev.rules || []), newRuleText.trim()]
    }));

    setNewRuleText('');
    setShowNewRuleModal(false);
  };

  // Approve Pending Request
  const handleApproveRequest = (requestId: string, req: ClubJoinRequest) => {
    const targetUserId = req.userId || req.user?.id || `usr_${Date.now()}`;
    const targetUserName = req.userName || req.user?.name || 'Colecionador';
    const targetUserAvatar = req.userAvatar || req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const targetUserTier = (req.userTier || req.user?.collectorTier || 'Entusiasta Clássico') as any;
    const targetVehicle = req.vehicleName || req.vehicleModel || 'Veículo Clássico';

    const newMember: ClubMember = {
      user: {
        id: targetUserId,
        name: targetUserName,
        handle: `@${targetUserName.toLowerCase().replace(/\s+/g, '')}`,
        avatar: targetUserAvatar,
        coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
        bio: 'Membro entusiasta do clube.',
        location: 'São Paulo, Brasil',
        collectorTier: targetUserTier,
        memberSince: '2024',
        garageCount: 1,
        followersCount: 12,
        followingCount: 15,
        totalLikes: 40,
        reputationScore: 90,
        verifiedCollector: true
      },
      role: 'member',
      joinedAt: 'Membro • Hoje',
      vehicleInClub: targetVehicle
    };

    updateGroup((prev) => ({
      ...prev,
      memberCount: prev.memberCount + 1,
      members: [...(prev.members || []), newMember],
      pendingRequests: (prev.pendingRequests || []).filter((r) => r.id !== requestId)
    }));
  };

  // Reject Pending Request
  const handleRejectRequest = (requestId: string) => {
    updateGroup((prev) => ({
      ...prev,
      pendingRequests: (prev.pendingRequests || []).filter((r) => r.id !== requestId)
    }));
  };

  // Change Member Role
  const handleChangeRole = (userId: string, newRole: 'moderator' | 'member') => {
    updateGroup((prev) => ({
      ...prev,
      members: (prev.members || []).map((m) => {
        if (m.user.id === userId) {
          return { ...m, role: newRole };
        }
        return m;
      })
    }));
  };

  // Remove Member
  const handleRemoveMember = (userId: string) => {
    updateGroup((prev) => ({
      ...prev,
      memberCount: Math.max(1, prev.memberCount - 1),
      members: (prev.members || []).filter((m) => m.user.id !== userId)
    }));
  };

  // Filtered members
  const filteredMembers = (group.members || []).filter((m) =>
    m.user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    (m.vehicleInClub && m.vehicleInClub.toLowerCase().includes(memberSearchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#141C15] border border-[#3B4D3A] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* ======================= HEADER SECTION ======================= */}
        <div className="relative">
          {/* Banner */}
          <div className="relative h-44 sm:h-56 bg-[#0E130F] overflow-hidden">
            <img
              src={group.bannerUrl}
              alt={group.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141C15] via-[#141C15]/40 to-black/60" />

            {/* Top Control Bar */}
            <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-5 flex items-center justify-between z-20">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-[#E8ECE8] border border-white/10 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Invite Link Button (Always visible for members / founders) */}
                {group.inviteLink && (isMember || isPrivileged) && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#263628]/90 hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">Convite do Clube</span>
                    <span className="sm:hidden">Convite</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-[#E8ECE8] border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile & Info Overlay */}
          <div className="px-4 sm:px-6 -mt-14 sm:-mt-16 relative z-10 pb-4 border-b border-[#3B4D3A]/60">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              
              {/* Left: Avatar and Identity */}
              <div className="flex items-end gap-3.5 sm:gap-4">
                <div className="relative">
                  <img
                    src={group.avatarUrl}
                    alt={group.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-4 border-[#141C15] bg-[#18221A] shadow-2xl"
                  />
                  {group.visibility === 'private' && (
                    <div className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-[#D4AF37] text-[#121713] shadow-lg">
                      <Lock className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                    {group.visibility === 'private' ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-200 border border-amber-500/50 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                        Clube Privado
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-[#1F2C20] text-[#A2B3A4] border border-[#3B4D3A] text-[10px] font-semibold flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#4F6650]" />
                        Clube Público
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-mono">
                      {group.category}
                    </span>

                    {group.targetEra && (
                      <span className="px-2 py-0.5 rounded-md bg-[#18221A] text-[#8EA290] border border-[#3B4D3A]/40 text-[10px] font-mono hidden sm:inline">
                        {group.targetEra}
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif-heading font-bold text-lg sm:text-2xl text-[#F3E5AB]">
                    {group.name}
                  </h1>
                </div>
              </div>

              {/* Right: User Role & Join/Status Action */}
              <div className="flex items-center gap-2 sm:self-end">
                {isFounder && (
                  <span className="px-3 py-1.5 rounded-xl bg-[#C9A227]/20 border border-[#D4AF37]/60 text-[#F3E5AB] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Fundador</span>
                  </span>
                )}

                {isModerator && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Moderador</span>
                  </span>
                )}

                {group.isMember ? (
                  <button
                    onClick={() => onToggleJoin(group.id)}
                    className="px-4 py-2 rounded-xl bg-[#263628] hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-700/50 text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Membro Ativo</span>
                  </button>
                ) : group.hasPendingRequest ? (
                  <button
                    onClick={() => onToggleJoin(group.id)}
                    className="px-4 py-2 rounded-xl bg-amber-950/70 text-amber-200 border border-amber-500/50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Solicitação Enviada</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleJoin(group.id)}
                    className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {group.joinMode === 'approval_required' ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Solicitar Entrada</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Entrar no Clube</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>

            {/* Tagline & Stats Summary */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8EA290]">
              <p className="line-clamp-1 italic text-[#A2B3A4]">
                "{group.tagline}"
              </p>

              <div className="flex items-center gap-4 text-xs font-medium text-[#8EA290]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <strong className="text-[#E8ECE8]">{group.memberCount}</strong> membros
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#4F6650]" />
                  <strong className="text-[#E8ECE8]">{group.postsCount || group.clubPosts?.length || 0}</strong> publicações
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <strong className="text-[#E8ECE8]">{group.eventsCount || 0}</strong> encontros
                </span>
              </div>
            </div>

            {/* Pending Requests Alert Banner for Admins */}
            {isPrivileged && (group.pendingRequests?.length || 0) > 0 && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    Existem <strong>{group.pendingRequests?.length}</strong> pedidos de entrada aguardando sua aprovação.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('members')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[11px] border border-amber-500/40 cursor-pointer"
                >
                  Gerenciar Pedidos
                </button>
              </div>
            )}
          </div>

          {/* ======================= TABS NAVIGATION ======================= */}
          <div className="px-4 sm:px-6 bg-[#111712] border-b border-[#3B4D3A]/60 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
            {[
              { id: 'posts' as TabType, label: 'Publicações', icon: MessageCircle, count: group.clubPosts?.length },
              { id: 'forums' as TabType, label: 'Fóruns', icon: MessageSquare, count: group.forumCategories?.length },
              { id: 'events' as TabType, label: 'Eventos', icon: Calendar, count: group.eventsCount },
              { id: 'members' as TabType, label: 'Membros', icon: Users, count: group.memberCount },
              { id: 'faqs' as TabType, label: 'FAQ', icon: HelpCircle, count: group.faqs?.length },
              { id: 'polls' as TabType, label: 'Enquetes', icon: Vote, count: group.polls?.length || (group.pinnedPoll ? 1 : 0) },
              { id: 'rules' as TabType, label: 'Regulamento', icon: BookOpen, count: group.rules?.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedForumCategory(null);
                    setSelectedTopic(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/60 shadow-sm'
                      : 'text-[#8EA290] hover:text-[#E8ECE8] hover:bg-[#18221A]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#4F6650]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#D4AF37] text-[#121713] font-black' : 'bg-[#18221A] text-[#8EA290]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================= TAB BODY CONTENT ======================= */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">

          {/* TAB 1: PUBLICAÇÕES (FEED & COMPOSER) */}
          {activeTab === 'posts' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              
              {/* Post Composer (Only for members) */}
              {isMember ? (
                <div className="p-4 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/70 shadow-lg">
                  <div className="flex items-start gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]"
                    />
                    <div className="flex-1">
                      <textarea
                        rows={showNewPostForm ? 3 : 2}
                        value={newPostText}
                        onFocus={() => setShowNewPostForm(true)}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder="Compartilhe uma atualização, foto de restauração ou aviso com o clube..."
                        className="w-full bg-[#121713] border border-[#3B4D3A] focus:border-[#D4AF37] rounded-xl p-3 text-xs text-[#E8ECE8] placeholder-[#8EA290] focus:outline-none transition-all"
                      />

                      {showNewPostForm && (
                        <div className="mt-3 space-y-3 pt-2 border-t border-[#3B4D3A]/40 animate-in fade-in">
                          {/* Media Link Input */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <select
                                value={newPostMediaType}
                                onChange={(e) => setNewPostMediaType(e.target.value as any)}
                                className="px-2.5 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:outline-none"
                              >
                                <option value="none">Sem Mídia</option>
                                <option value="image">Foto (URL)</option>
                                <option value="video">Vídeo (URL)</option>
                              </select>
                              {newPostMediaType !== 'none' && (
                                <input
                                  type="url"
                                  value={newPostMediaUrl}
                                  onChange={(e) => setNewPostMediaUrl(e.target.value)}
                                  placeholder="Link da imagem / vídeo..."
                                  className="flex-1 px-2.5 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Vehicle Tag */}
                            <select
                              value={newPostVehicleTag}
                              onChange={(e) => setNewPostVehicleTag(e.target.value)}
                              className="px-2.5 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:outline-none"
                            >
                              <option value="">Marcar Veículo da Garagem (Opcional)</option>
                              {userVehicles.map((v) => (
                                <option key={v.id} value={`${v.brand} ${v.model} (${v.year})`}>
                                  {v.brand} {v.model} ({v.year})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => setShowNewPostForm(false)}
                              className="text-xs text-[#8EA290] hover:text-[#E8ECE8]"
                            >
                              Recolher
                            </button>

                            <button
                              onClick={handleCreatePost}
                              disabled={!newPostText.trim()}
                              className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] disabled:opacity-50 text-[#121713] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Publicar no Clube</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/70 text-center space-y-2">
                  <p className="text-xs text-[#8EA290]">
                    Apenas membros confirmados podem publicar e interagir no mural do clube.
                  </p>
                  <button
                    onClick={() => onToggleJoin(group.id)}
                    className="px-4 py-1.5 rounded-xl bg-[#C9A227] text-[#121713] text-xs font-bold cursor-pointer"
                  >
                    Entrar no Clube para Participar
                  </button>
                </div>
              )}

              {/* Feed of Posts */}
              <div className="space-y-4">
                {(group.clubPosts || []).length === 0 ? (
                  <div className="text-center py-10 text-[#8EA290] bg-[#18221A]/40 rounded-2xl border border-[#3B4D3A]/40">
                    <MessageSquare className="w-8 h-8 mx-auto text-[#4F6650] mb-2 opacity-60" />
                    <p className="text-sm font-bold text-[#F3E5AB]">Nenhuma publicação ainda</p>
                    <p className="text-xs">Seja o primeiro a compartilhar uma foto ou novidade com os membros!</p>
                  </div>
                ) : (
                  (group.clubPosts || []).map((post) => (
                    <div
                      key={post.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60 shadow-md space-y-3"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]/50"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F3E5AB]">{post.author.name}</span>
                              {post.author.role === 'founder' && (
                                <span className="px-1.5 py-0.2 rounded bg-[#C9A227]/20 text-[#D4AF37] text-[9px] font-bold border border-[#D4AF37]/40">
                                  Fundador
                                </span>
                              )}
                              {post.author.role === 'moderator' && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                                  Moderador
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8EA290]">{post.author.handle} • {post.timestamp}</span>
                          </div>
                        </div>

                        {post.vehicleTagged && (
                          <div className="px-2 py-0.5 rounded-full bg-[#121713] text-[#D4AF37] border border-[#3B4D3A] text-[10px] flex items-center gap-1 font-mono">
                            <Car className="w-3 h-3" />
                            <span className="hidden sm:inline">{post.vehicleTagged}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <p className="text-xs text-[#E8ECE8] leading-relaxed whitespace-pre-line">
                        {post.text}
                      </p>

                      {/* Media */}
                      {post.mediaType === 'image' && post.mediaUrl && (
                        <div className="rounded-xl overflow-hidden border border-[#3B4D3A]/60 bg-[#121613] max-h-96">
                          <img
                            src={post.mediaUrl}
                            alt="Post media"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {post.mediaType === 'video' && post.mediaUrl && (
                        <div className="rounded-xl overflow-hidden border border-[#3B4D3A]/60 bg-[#121613]">
                          <video
                            src={post.mediaUrl}
                            controls
                            className="w-full max-h-96 object-cover"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="pt-2 border-t border-[#3B4D3A]/40 flex items-center justify-between text-xs text-[#8EA290]">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            post.isLiked
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-600/40'
                              : 'hover:bg-[#263628] hover:text-[#E8ECE8]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{post.likes} Curtidas</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-[#4F6650]" />
                          <span>{post.replies} comentários</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: FÓRUNS (CATEGORIES & THREADS) */}
          {activeTab === 'forums' && (
            <div className="space-y-5">
              
              {/* Case 1: Viewing a specific Topic Thread */}
              {selectedTopic ? (
                <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar para tópicos de {selectedForumCategory?.name || 'Fórum'}</span>
                  </button>

                  {/* Topic Head */}
                  <div className="p-5 rounded-2xl bg-[#18221A] border border-[#3B4D3A] shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#D4AF37]">
                        {group.forumCategories?.find((c) => c.id === selectedTopic.categoryId)?.name || 'Discussão Técnica'}
                      </span>
                      <span className="text-[10px] text-[#8EA290]">{selectedTopic.createdAt}</span>
                    </div>

                    <h2 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                      {selectedTopic.title}
                    </h2>

                    <div className="flex items-center gap-3 pt-1 border-t border-[#3B4D3A]/40">
                      <img
                        src={selectedTopic.author.avatar}
                        alt={selectedTopic.author.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#D4AF37]/50"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#E8ECE8]">{selectedTopic.author.name}</span>
                        <span className="text-[10px] text-[#8EA290] block">{selectedTopic.author.handle}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#E8ECE8] leading-relaxed whitespace-pre-line pt-2">
                      {selectedTopic.content}
                    </p>
                  </div>

                  {/* Replies List */}
                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#3B4D3A]/60">
                    <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      Respostas ({selectedTopic.replies?.length || 0})
                    </h3>

                    {(selectedTopic.replies || []).map((reply) => (
                      <div key={reply.id} className="p-3.5 rounded-xl bg-[#18221A]/80 border border-[#3B4D3A]/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-6 h-6 rounded-md object-cover border border-[#D4AF37]/40"
                            />
                            <span className="text-xs font-bold text-[#F3E5AB]">{reply.author.name}</span>
                            <span className="text-[10px] text-[#8EA290]">{reply.author.handle}</span>
                          </div>
                          <span className="text-[10px] text-[#8EA290]">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#E8ECE8] leading-relaxed">{reply.text}</p>
                      </div>
                    ))}

                    {/* Reply Form */}
                    {isMember ? (
                      <form onSubmit={handleReplyTopic} className="mt-4 p-3.5 rounded-xl bg-[#18221A] border border-[#3B4D3A] space-y-2">
                        <label className="block text-xs font-semibold text-[#8EA290]">Responder a este tópico:</label>
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Digite sua resposta técnica ou contribuição..."
                          className="w-full bg-[#121713] border border-[#3B4D3A] focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-[#E8ECE8] focus:outline-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="px-4 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#E5C158] disabled:opacity-50 text-[#121713] font-bold text-xs shadow transition-all cursor-pointer"
                          >
                            Enviar Resposta
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#18221A] text-center text-xs text-[#8EA290]">
                        Entre no clube para responder a tópicos de discussão técnica.
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedForumCategory ? (
                /* Case 2: Viewing topics within a selected Category */
                <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedForumCategory(null)}
                      className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar para Categorias</span>
                    </button>

                    {isMember && (
                      <button
                        onClick={() => {
                          setNewTopicCategoryId(selectedForumCategory.id);
                          setShowNewTopicModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Tópico em {selectedForumCategory.name}</span>
                      </button>
                    )}
                  </div>

                  {/* Category Header */}
                  <div className="p-4 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60">
                    <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">{selectedForumCategory.name}</h2>
                    <p className="text-xs text-[#8EA290]">{selectedForumCategory.description}</p>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-2.5">
                    {(selectedForumCategory.topics || []).length === 0 ? (
                      <div className="text-center py-8 text-[#8EA290] bg-[#18221A]/50 rounded-xl border border-[#3B4D3A]/40">
                        <MessageSquare className="w-6 h-6 mx-auto text-[#4F6650] mb-1.5 opacity-60" />
                        <p className="text-xs font-bold text-[#F3E5AB]">Nenhum tópico criado nesta categoria</p>
                        <p className="text-[11px]">Seja o primeiro a iniciar uma discussão aqui!</p>
                      </div>
                    ) : (
                      (selectedForumCategory.topics || []).map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                          className="p-4 rounded-xl bg-[#18221A] hover:bg-[#202C22] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={topic.author.avatar}
                              alt={topic.author.name}
                              className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/40 mt-0.5"
                            />
                            <div>
                              <h3 className="font-bold text-xs text-[#F3E5AB] hover:text-[#D4AF37] transition-colors">
                                {topic.title}
                              </h3>
                              <p className="text-[11px] text-[#8EA290] line-clamp-1 mt-0.5">{topic.content}</p>
                              <div className="flex items-center gap-2 text-[10px] text-[#A2B3A4] mt-1">
                                <span>Por {topic.author.name}</span>
                                <span>•</span>
                                <span>{topic.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div className="text-center">
                              <span className="text-xs font-bold text-[#F3E5AB] block">{topic.repliesCount || 0}</span>
                              <span className="text-[9px] text-[#8EA290] uppercase">Respostas</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Case 3: Forum Categories List */
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">Fóruns Temáticos do Clube</h2>
                      <p className="text-xs text-[#8EA290]">Discussões organizadas por categoria para troca de peças e mecânica.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPrivileged && (
                        <button
                          onClick={() => setShowNewCategoryModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Nova Categoria</span>
                        </button>
                      )}

                      {isMember && (
                        <button
                          onClick={() => setShowNewTopicModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Novo Tópico</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {(group.forumCategories || []).map((category) => (
                      <div
                        key={category.id}
                        onClick={() => setSelectedForumCategory(category)}
                        className="p-4 rounded-2xl bg-[#18221A] hover:bg-[#202C22] border border-[#3B4D3A]/70 hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-serif-heading font-bold text-sm text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors">
                              {category.name}
                            </h3>
                            <span className="text-[11px] font-mono text-[#D4AF37] bg-[#263628] px-2 py-0.5 rounded-md">
                              {category.topicsCount || category.topics?.length || 0} tópicos
                            </span>
                          </div>
                          <p className="text-xs text-[#8EA290] line-clamp-2 leading-relaxed">
                            {category.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between text-[11px] text-[#A2B3A4]">
                          <span>Ver discussões</span>
                          <span className="text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: EVENTOS DO CLUBE */}
          {activeTab === 'events' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">Encontros e Comboios do Clube</h2>
                  <p className="text-xs text-[#8EA290]">Eventos oficiais organizados com exclusividade para os membros.</p>
                </div>

                {isPrivileged && (
                  <button
                    onClick={() => setShowNewEventModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Evento</span>
                  </button>
                )}
              </div>

              {/* Sample Club Event */}
              <div className="p-5 rounded-2xl bg-[#18221A] border border-[#D4AF37]/40 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-bold uppercase tracking-wider">
                    Oficial • Próximo Encontro
                  </span>
                  <span className="text-xs text-[#8EA290] font-mono">14 Confirmados</span>
                </div>

                <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                  Comboio da Serra & Café dos Clássicos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A2B3A4]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>Sábado, 15 de Outubro às 08:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>Posto Graal Rodovia dos Bandeirantes Km 56</span>
                  </div>
                </div>

                <p className="text-xs text-[#8EA290] leading-relaxed">
                  Passeio em comboio com os membros do clube, seguido de café da manhã e sessão de fotos com fotógrafo profissional do GaragemClub.
                </p>

                <div className="pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between">
                  <span className="text-[11px] text-[#8EA290]">Apenas para veículos clássicos em conformidade.</span>
                  {isMember ? (
                    <button
                      onClick={() => {
                        try {
                          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                        } catch {}
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/60 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Presença Confirmada</span>
                    </button>
                  ) : (
                    <span className="text-xs text-[#D4AF37]">Entre no clube para confirmar presença</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEMBROS & SOLICITAÇÕES */}
          {activeTab === 'members' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              
              {/* Pending Join Requests (If Founder/Mod) */}
              {isPrivileged && (group.pendingRequests || []).length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/50 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Solicitações de Entrada Aguardando Aprovação ({group.pendingRequests?.length})</span>
                  </div>

                  <div className="space-y-2">
                    {group.pendingRequests?.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-xl bg-[#141C15] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={req.userAvatar}
                            alt={req.userName}
                            className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#F3E5AB]">{req.userName}</span>
                            <div className="flex items-center gap-2 text-[11px] text-[#8EA290]">
                              <span>{req.userTier}</span>
                              <span>•</span>
                              <span className="text-[#D4AF37]">{req.vehicleName}</span>
                            </div>
                            {req.message && (
                              <p className="text-[11px] text-[#A2B3A4] italic mt-0.5">"{req.message}"</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-xs font-bold cursor-pointer"
                          >
                            Recusar
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id, req)}
                            className="px-3 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Aprovar Entrada</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members Search & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                    Quadro de Membros ({group.memberCount})
                  </h2>
                  <p className="text-xs text-[#8EA290]">Colecionadores e entusiastas proprietários.</p>
                </div>

                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Buscar membro por nome ou carro..."
                  className="px-3 py-1.5 bg-[#18221A] border border-[#3B4D3A] focus:border-[#D4AF37] rounded-xl text-xs text-[#E8ECE8] focus:outline-none w-full sm:w-64"
                />
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMembers.map((member) => {
                  const memberIsFounder = member.role === 'founder' || member.user.id === group.founderId;
                  const memberIsMod = member.role === 'moderator';

                  return (
                    <div
                      key={member.user.id}
                      className="p-3.5 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.user.avatar}
                          alt={member.user.name}
                          className="w-11 h-11 rounded-xl object-cover border border-[#D4AF37]/50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#F3E5AB]">{member.user.name}</span>
                            {memberIsFounder && (
                              <span className="px-1.5 py-0.2 rounded bg-[#C9A227]/20 text-[#D4AF37] text-[9px] font-bold border border-[#D4AF37]/40">
                                Fundador
                              </span>
                            )}
                            {memberIsMod && !memberIsFounder && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                                Moderador
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-[#8EA290] block">{member.joinedAt}</span>
                          {member.vehicleInClub && (
                            <span className="text-[10px] text-[#D4AF37] font-mono block mt-0.5 line-clamp-1">
                              🚗 {member.vehicleInClub}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Founder Actions on Member */}
                      {isFounder && member.user.id !== currentUser.id && (
                        <div className="flex items-center gap-1">
                          {member.role === 'member' ? (
                            <button
                              onClick={() => handleChangeRole(member.user.id, 'moderator')}
                              title="Promover a Moderador"
                              className="p-1.5 rounded-lg bg-[#263628] hover:bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-500/40 cursor-pointer"
                            >
                              Promover Mod
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeRole(member.user.id, 'member')}
                              title="Remover Moderador"
                              className="p-1.5 rounded-lg bg-[#263628] hover:bg-amber-950 text-amber-300 text-[10px] font-semibold border border-amber-500/40 cursor-pointer"
                            >
                              Tirar Mod
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveMember(member.user.id)}
                            title="Remover do Clube"
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-[10px] cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: FAQ / DÚVIDAS FREQUENTES */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">Perguntas Frequentes (FAQ)</h2>
                  <p className="text-xs text-[#8EA290]">Dúvidas técnicas, requisitos e regras gerais fixadas.</p>
                </div>

                {isPrivileged && (
                  <button
                    onClick={() => setShowNewFaqModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Pergunta</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {(group.faqs || []).map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#202C22]"
                      >
                        <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#8EA290] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#8EA290] shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-[#3B4D3A]/40 text-xs text-[#8EA290] leading-relaxed animate-in fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: ENQUETES (POLLS) */}
          {activeTab === 'polls' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">Enquetes da Comunidade</h2>
                  <p className="text-xs text-[#8EA290]">Votações sobre encontros, roteiros e decisões do clube.</p>
                </div>

                {isPrivileged && (
                  <button
                    onClick={() => setShowNewPollModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Enquete</span>
                  </button>
                )}
              </div>

              {/* Render Polls */}
              {group.pinnedPoll && (
                <div className="p-5 rounded-2xl bg-[#18221A] border border-[#D4AF37]/50 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold flex items-center gap-1">
                      <Vote className="w-3 h-3" />
                      Enquete em Destaque
                    </span>
                    <span className="text-xs text-[#8EA290]">{group.pinnedPoll.totalVotes} votos registrados</span>
                  </div>

                  <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                    {group.pinnedPoll.question}
                  </h3>

                  <div className="space-y-2.5">
                    {group.pinnedPoll.options.map((opt) => {
                      const percentage =
                        group.pinnedPoll!.totalVotes > 0
                          ? Math.round((opt.votes / group.pinnedPoll!.totalVotes) * 100)
                          : 0;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => onVotePoll(group.id, opt.id)}
                          className={`relative overflow-hidden p-3.5 rounded-xl border transition-all cursor-pointer ${
                            opt.hasVoted
                              ? 'border-[#D4AF37] bg-[#223023]'
                              : 'border-[#3B4D3A]/60 bg-[#121713] hover:border-[#3B4D3A]'
                          }`}
                        >
                          {/* Fill percentage background */}
                          <div
                            className="absolute inset-0 bg-[#263628] opacity-60 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs">
                            <span className={`font-bold ${opt.hasVoted ? 'text-[#F3E5AB]' : 'text-[#E8ECE8]'}`}>
                              {opt.text}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#D4AF37] font-bold">{percentage}%</span>
                              <span className="text-[10px] text-[#8EA290]">({opt.votes})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: REGULAMENTO & NORMAS */}
          {activeTab === 'rules' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-heading font-bold text-base text-[#F3E5AB]">Regulamento & Estatuto do Clube</h2>
                  <p className="text-xs text-[#8EA290]">Diretrizes de convivência e conservação histórica.</p>
                </div>

                {isFounder && (
                  <button
                    onClick={() => setShowNewRuleModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Regra</span>
                  </button>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/70 shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Código de Conduta Oficial</span>
                </div>

                <div className="space-y-3">
                  {(group.rules || []).map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#121713] border border-[#3B4D3A]/40">
                      <span className="w-5 h-5 rounded-full bg-[#263628] text-[#D4AF37] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-[#E8ECE8] leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ======================= MODAL: GERENCIAR CONVITES ======================= */}
        {showInviteModal && group.inviteLink && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[#18221A] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                  <LinkIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>Link de Convite do Clube</span>
                </div>
                <button onClick={() => setShowInviteModal(false)} className="text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121713] border border-[#3B4D3A] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8EA290]">
                  <span>Código Único:</span>
                  <span className="font-mono text-[#D4AF37] font-bold">{group.inviteLink.code}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8EA290]">
                  <span>Validade:</span>
                  <span className="text-[#E8ECE8]">{group.inviteLink.expiresLabel}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={group.inviteLink.url}
                    className="flex-1 px-3 py-1.5 bg-[#18221A] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] select-all font-mono"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Founder controls to regenerate or expire link */}
              {isFounder && (
                <div className="pt-3 border-t border-[#3B4D3A]/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#8EA290]">
                    <span>Revogar e Gerar Novo Link:</span>
                    <select
                      value={inviteExpiration}
                      onChange={(e) => setInviteExpiration(e.target.value as any)}
                      className="bg-[#121713] border border-[#3B4D3A] rounded-lg px-2 py-1 text-xs text-[#E8ECE8]"
                    >
                      <option value="Sem expiração">Sem expiração</option>
                      <option value="24 horas">24 horas</option>
                      <option value="7 dias">7 dias</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRegenerateInviteLink}
                    className="w-full py-2 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Gerar Novo Link (Revoga o anterior)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= MODAL: NOVO TÓPICO DE FÓRUM ======================= */}
        {showNewTopicModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-lg bg-[#18221A] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Criar Novo Tópico de Discussão</span>
                </div>
                <button onClick={() => setShowNewTopicModal(false)} className="text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1">Categoria do Fórum</label>
                  <select
                    value={newTopicCategoryId}
                    onChange={(e) => setNewTopicCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:outline-none"
                  >
                    {(group.forumCategories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Título do Tópico *</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Ex: Regulagem de ponto de ignição para motor 250-S"
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1">Mensagem / Pergunta Técnica *</label>
                  <textarea
                    rows={4}
                    required
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    placeholder="Descreva o problema, peça ou debate com detalhes..."
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTopicModal(false)}
                    className="px-3 py-1.5 text-xs text-[#8EA290] hover:text-[#E8ECE8]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold shadow cursor-pointer"
                  >
                    Publicar Tópico
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================= MODAL: NOVA CATEGORIA DE FÓRUM ======================= */}
        {showNewCategoryModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[#18221A] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Nova Categoria de Fórum</span>
                </div>
                <button onClick={() => setShowNewCategoryModal(false)} className="text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Nome da Categoria *</label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Compra e Venda de Peças Raras"
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Objetivo das discussões nesta categoria..."
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryModal(false)}
                    className="px-3 py-1.5 text-xs text-[#8EA290]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold cursor-pointer"
                  >
                    Criar Categoria
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================= MODAL: NOVO FAQ ======================= */}
        {showNewFaqModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[#18221A] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                  <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Adicionar Pergunta Frequente (FAQ)</span>
                </div>
                <button onClick={() => setShowNewFaqModal(false)} className="text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFaq} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Pergunta *</label>
                  <input
                    type="text"
                    required
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="Ex: Como funciona a vistoria para placa de colecionador?"
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1">Resposta / Orientação *</label>
                  <textarea
                    rows={4}
                    required
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    placeholder="Explique o procedimento oficial passo a passo..."
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFaqModal(false)}
                    className="px-3 py-1.5 text-xs text-[#8EA290]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold cursor-pointer"
                  >
                    Salvar no FAQ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================= MODAL: NOVA REGRA ======================= */}
        {showNewRuleModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[#18221A] border border-[#D4AF37]/60 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>Adicionar Regra ao Estatuto</span>
                </div>
                <button onClick={() => setShowNewRuleModal(false)} className="text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Descrição da Regra *</label>
                  <textarea
                    rows={3}
                    required
                    value={newRuleText}
                    onChange={(e) => setNewRuleText(e.target.value)}
                    placeholder="Ex: Proibido anúncios comerciais de terceiros sem autorização dos moderadores."
                    className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewRuleModal(false)}
                    className="px-3 py-1.5 text-xs text-[#8EA290]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold cursor-pointer"
                  >
                    Adicionar Regra
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
