import React, { useState, useMemo } from 'react';
import { 
  mockVehicles, 
  mockPosts, 
  mockListings, 
  mockEvents, 
  mockGroups, 
  mockStories,
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { 
  User, 
  Vehicle, 
  Post, 
  MarketplaceListing, 
  ClubEvent, 
  CommunityGroup, 
  Story,
  NotificationItem
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { AppLogo } from './components/AppLogo';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { AddVehicleModal } from './components/AddVehicleModal';
import { MarketplaceCard } from './components/MarketplaceCard';
import { MarketplaceDetailModal } from './components/MarketplaceDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { CreateEventModal } from './components/CreateEventModal';
import { GroupCard } from './components/GroupCard';
import { GroupDetailModal } from './components/GroupDetailModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { MessagesModal, ChatConversation } from './components/MessagesModal';
import { ValuationCalculatorModal } from './components/ValuationCalculatorModal';
import { ProfileView } from './components/ProfileView';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { ExploreView } from './components/ExploreView';
import { NotificationsModal } from './components/NotificationsModal';
import { EditProfileModal } from './components/EditProfileModal';
import { EditVehicleModal } from './components/EditVehicleModal';
import { AuthModal } from './components/AuthModal';
import { WelcomeAuthGate } from './components/WelcomeAuthGate';
import { StartupSplashAnimation } from './components/StartupSplashAnimation';

import { 
  Sparkles, 
  Filter, 
  Plus, 
  Car, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Search, 
  TrendingUp, 
  Award, 
  Volume2, 
  ShieldCheck, 
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Radio,
  ArrowLeft,
  Home,
  X,
  Globe,
  Lock,
  Link as LinkIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { engineSound } from './utils/engineSound';
import './utils/resetGarage95Data';

const emptyUser: User = {
  id: 'guest_user',
  name: '',
  handle: '@visitante',
  avatar: '',
  coverImage: '',
  bio: 'Visitante sem conta ativa.',
  location: 'Brasil',
  collectorTier: 'Entusiasta Clássico',
  memberSince: '2026',
  garageCount: 0,
  followersCount: 0,
  followingCount: 0,
  totalLikes: 0,
  reputationScore: 0,
  verifiedCollector: false,
  friends: []
};

export function App() {
  // Restore the logged-in user when the app starts.
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('garage95_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
    return emptyUser;
  });

  // Controls whether startup animation splash screen is active
  const [isStartupSplashActive, setIsStartupSplashActive] = useState<boolean>(() => {
    try {
      return !(localStorage.getItem('garage95_authenticated') === 'true' && localStorage.getItem('garage95_onboarding_step') === 'completed');
    } catch {
      return true;
    }
  });

  // Controls whether user is authenticated with completed registration
  // Starts directly on registration/welcome screen if not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('garage95_authenticated');
      const savedStep = localStorage.getItem('garage95_onboarding_step');
      return savedAuth === 'true' && savedStep === 'completed';
    } catch {
      return false;
    }
  });

  const [isWelcomeGateOpen, setIsWelcomeGateOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  // Master Collections
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [listings, setListings] = useState<MarketplaceListing[]>(mockListings);
  const [events, setEvents] = useState<ClubEvent[]>(mockEvents);
  const [groups, setGroups] = useState<CommunityGroup[]>(mockGroups);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Active Tab: unified ids
  const [activeTab, setActiveTab] = useState<string>('feed');

  // Search & Global Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'todos' | 'v8' | 'placapreta' | 'aircooled' | 'restauracao' | 'pista'>('todos');
  const [exploreEraFilter, setExploreEraFilter] = useState<'todas' | 'anos60' | 'anos70' | 'anos80' | 'pre-guerra'>('todas');
  const [marketplaceCategoryFilter, setMarketplaceCategoryFilter] = useState<'todos' | 'veiculo' | 'peca' | 'acessorio'>('todos');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<'todos' | 'encontro' | 'exposicao' | 'track_day' | 'leilao'>('todos');
  const [clubCategoryFilter, setClubCategoryFilter] = useState<'todos' | 'brand_model' | 'specific_model' | 'general_community'>('todos');
  const [clubSearchQuery, setClubSearchQuery] = useState('');

  // Modals & Selected items state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [isCreateListingModalOpen, setIsCreateListingModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isInviteAccessModalOpen, setIsInviteAccessModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [viewedUserProfile, setViewedUserProfile] = useState<User | null>(null);

  // User's Friends Collection (persisted to localStorage)
  const [friendsUserIds, setFriendsUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('garage95_friends');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
    return currentUser.friends || [];
  });

  const handleToggleFriend = (targetUser: User) => {
    setFriendsUserIds((prev) => {
      const isAlreadyFriend = prev.includes(targetUser.id);
      let updated: string[];
      if (isAlreadyFriend) {
        updated = prev.filter((id) => id !== targetUser.id);
      } else {
        updated = [...prev, targetUser.id];
        // Celebrate adding new friend
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#263628', '#F3E5AB']
        });
        // Add a friendly notification
        const newNotif: NotificationItem = {
          id: `notif_friend_${Date.now()}`,
          type: 'like',
          sender: targetUser,
          title: 'Novo Amigo Adicionado!',
          text: `Você e ${targetUser.name} agora estão conectados na rede Garage 95.`,
          timestamp: 'Agora mesmo',
          read: false,
          targetId: targetUser.id,
          targetType: 'profile'
        };
        setNotifications((n) => [newNotif, ...n]);
      }
      try {
        localStorage.setItem('garage95_friends', JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  // Real-time Chat Conversations Store
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // Notifications Count
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleResetToHome = () => {
    setActiveTab('feed');
    setSearchQuery('');
    setFeedCategoryFilter('todos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setIsNotificationsModalOpen(false);

    if (item.targetType === 'event') {
      setActiveTab('events');
      const targetEvt = events.find(e => e.id === item.targetId);
      if (targetEvt) setSelectedEvent(targetEvt);
    } else if (item.targetType === 'group') {
      setActiveTab('groups');
      const targetGrp = groups.find(g => g.id === item.targetId);
      if (targetGrp) setSelectedGroup(targetGrp);
    } else if (item.targetType === 'marketplace') {
      setActiveTab('marketplace');
      const targetMkt = listings.find(l => l.id === item.targetId);
      if (targetMkt) setSelectedListing(targetMkt);
    } else if (item.targetType === 'profile') {
      setActiveTab('garage');
      const targetVeh = vehicles.find(v => v.id === item.targetId);
      if (targetVeh) setSelectedVehicle(targetVeh);
    }
  };

  // User's own vehicles & posts
  const userVehicles = useMemo(() => {
    return vehicles.filter(v => v.ownerId === currentUser.id);
  }, [vehicles, currentUser.id]);

  const userPosts = useMemo(() => {
    return posts.filter(p => p.author.id === currentUser.id);
  }, [posts, currentUser.id]);

  const userGarageProfile = useMemo(() => {
    const ownedVehicles = vehicles.filter(v => v.ownerId === currentUser.id);
    const brands = new Set(ownedVehicles.map(v => v.brand.toLowerCase()));
    const models = new Set(ownedVehicles.map(v => v.model.toLowerCase()));
    return { ownedVehicles, brands, models };
  }, [vehicles, currentUser.id]);

  const savedListings = useMemo(() => {
    return listings.filter(l => l.isSaved);
  }, [listings]);

  const savedPosts = useMemo(() => {
    return posts.filter(p => p.isSaved);
  }, [posts]);

  // ----------------------------------------------------
  // Authentication & Onboarding Handlers
  // ----------------------------------------------------
  const handleOpenAuthGate = () => {
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('garage95_authenticated');
      localStorage.removeItem('garage95_onboarding_step');
      localStorage.removeItem('garage95_user');
    } catch {
      // Ignored
    }
  };

  const handleAuthSuccess = (user: User, initialVehicle?: Partial<Vehicle>) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsWelcomeGateOpen(false);
    setIsAuthModalOpen(false);
    setActiveTab('feed');
    try {
      localStorage.setItem('garage95_user', JSON.stringify(user));
      localStorage.setItem('garage95_authenticated', 'true');
      localStorage.setItem('garage95_onboarding_step', 'completed');
    } catch {
      // Ignored
    }

    if (initialVehicle) {
      const fullVehicle: Vehicle = {
        id: initialVehicle.id || `veh_${Date.now()}`,
        ownerId: user.id,
        ownerName: user.name,
        ownerAvatar: user.avatar,
        brand: initialVehicle.brand || 'Ford',
        model: initialVehicle.model || 'Mustang Fastback',
        year: initialVehicle.year || 1967,
        category: initialVehicle.category || 'carro',
        plateType: initialVehicle.plateType || 'preta',
        engine: initialVehicle.engine || 'V8 302 / 5.0L',
        horsepower: initialVehicle.horsepower || 220,
        transmission: initialVehicle.transmission || 'Manual 4 Marchas',
        fuel: initialVehicle.fuel || 'Gasolina',
        mileage: initialVehicle.mileage || 45000,
        color: initialVehicle.color || 'A definir',
        photos: initialVehicle.photos?.length ? initialVehicle.photos : ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1000&auto=format&fit=crop&q=80'],
        coverPhoto: initialVehicle.coverPhoto || 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1000&auto=format&fit=crop&q=80',
        status: 'garage',
        valuationEstimate: initialVehicle.valuationEstimate || 'R$ 280.000',
        authenticityScore: initialVehicle.authenticityScore || 95,
        restorationHistory: initialVehicle.restorationHistory || 'Cadastrado e certificado no acervo Garage 95.'
      };
      setVehicles(prev => [fullVehicle, ...prev]);
      setCurrentUser(prev => ({ ...prev, garageCount: (prev.garageCount || 0) + 1 }));

      const celebratoryPost: Post = {
        id: `post_first_${Date.now()}`,
        author: user,
        vehicleTagged: fullVehicle,
        content: `🏁 Acabei de criar minha conta na **Garage 95** e cadastrei meu clássico: ${fullVehicle.brand} ${fullVehicle.model} (${fullVehicle.year})!\n\nPronto para os encontros, passeios históricos e troca de peças.`,
        media: [{ type: 'image', url: fullVehicle.coverPhoto, caption: `${fullVehicle.brand} ${fullVehicle.model}` }],
        createdAt: 'Agora mesmo',
        likesCount: 3,
        isLiked: true,
        commentsCount: 0,
        comments: [],
        sharesCount: 1,
        hashtags: [`#${fullVehicle.brand.toLowerCase()}`, `#${fullVehicle.model.toLowerCase().replace(/\s+/g, '')}`, '#garage95', '#classicos'],
        isExclusiveClub: true,
        location: user.location,
        soundTrackTitle: `${fullVehicle.engine} Engine Sound Track`
      };
      setPosts(prev => [celebratoryPost, ...prev]);
    }

    setIsAuthModalOpen(false);
  };

  // ----------------------------------------------------
  // Handlers for Add / Like / Comment / Register Actions
  // ----------------------------------------------------

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    setCurrentUser(prev => ({ ...prev, garageCount: (prev.garageCount || 0) + 1 }));
    // Also generate a celebratory post in the feed
    const celebratoryPost: Post = {
      id: `post_new_car_${Date.now()}`,
      author: currentUser,
      vehicleTagged: newVehicle,
      content: `🔥 Nova máquina incorporada à minha garagem na Garage 95!\n\n${newVehicle.brand} ${newVehicle.model} (${newVehicle.year}) com motor ${newVehicle.engine}, ${newVehicle.horsepower}cv e certificação ${newVehicle.plateType === 'preta' ? 'Placa Preta de Coleção' : 'Histórica'}.`,
      media: [{ type: 'image', url: newVehicle.coverPhoto, caption: `${newVehicle.brand} ${newVehicle.model} (${newVehicle.year})` }],
      createdAt: 'Agora mesmo',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: [`#${newVehicle.brand.toLowerCase()}`, `#${newVehicle.model.toLowerCase().replace(/\s+/g, '')}`, '#garage95', '#classicos'],
      isExclusiveClub: true,
      location: currentUser.location,
      soundTrackTitle: `${newVehicle.engine} Engine Sound Track`
    };
    setPosts(prev => [celebratoryPost, ...prev]);
  };

  const handleAddPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleAddStory = (newStoryData: Omit<Story, 'id' | 'timestamp' | 'viewed'>) => {
    const newStory: Story = {
      ...newStoryData,
      id: `story_${Date.now()}`,
      timestamp: 'Agora',
      viewed: false
    };
    setStories(prev => [newStory, ...prev]);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#263628', '#F3E5AB']
    });
    const notif: NotificationItem = {
      id: `notif_story_${Date.now()}`,
      type: 'like',
      sender: currentUser,
      title: 'Story Publicado!',
      text: `Seu story "${newStory.title}" foi publicado com sucesso e ficará disponível por 24h.`,
      timestamp: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newC = {
          id: `c_${Date.now()}`,
          author: currentUser,
          text,
          createdAt: 'Agora mesmo'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newC]
        };
      }
      return p;
    }));
  };

  const handleToggleSaveListing = (listingId: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          isSaved: !l.isSaved,
          savesCount: l.isSaved ? l.savesCount - 1 : l.savesCount + 1
        };
      }
      return l;
    }));
  };

  const handleToggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isSaved: !p.isSaved
        };
      }
      return p;
    }));
  };

  const handleAddListing = (newListing: MarketplaceListing) => {
    setListings(prev => [newListing, ...prev]);
  };

  const handleToggleRegisterEvent = (eventId: string, carModel?: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const willBeRegistered = !evt.isRegistered;
        let newAttendees = [...evt.confirmedAttendees];
        if (willBeRegistered) {
          newAttendees.push({
            user: currentUser,
            carModel: carModel || (userVehicles[0] ? `${userVehicles[0].brand} ${userVehicles[0].model}` : 'Veículo Clássico'),
            confirmedAt: 'Agora mesmo'
          });
        } else {
          newAttendees = newAttendees.filter(a => a.user.id !== currentUser.id);
        }
        return {
          ...evt,
          isRegistered: willBeRegistered,
          confirmedAttendees: newAttendees
        };
      }
      return evt;
    }));
  };

  const handleAddEvent = (newEvent: ClubEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleToggleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        if (g.isMember) {
          // Leave group
          return {
            ...g,
            isMember: false,
            userRole: undefined,
            memberCount: Math.max(1, g.memberCount - 1),
            members: (g.members || []).filter(m => m.user.id !== currentUser.id)
          };
        } else if (g.joinMode === 'approval_required') {
          // Toggle pending request
          const willHavePending = !g.hasPendingRequest;
          let pendingReqs = [...(g.pendingRequests || [])];
          if (willHavePending) {
            pendingReqs.push({
              id: `req_${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              userTier: currentUser.tier,
              vehicleName: userVehicles[0] ? `${userVehicles[0].brand} ${userVehicles[0].model} (${userVehicles[0].year})` : 'Veículo da Garagem',
              requestedAt: 'Agora mesmo',
              message: 'Gostaria de participar das discussões e encontros do clube.'
            });
          } else {
            pendingReqs = pendingReqs.filter(r => r.userId !== currentUser.id);
          }
          return {
            ...g,
            hasPendingRequest: willHavePending,
            pendingRequests: pendingReqs
          };
        } else {
          // Free join
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#263628', '#F3E5AB']
            });
          } catch {}

          const newMember = {
            user: currentUser,
            role: 'member' as const,
            joinedAt: 'Membro • Hoje',
            vehicleInClub: userVehicles[0] ? `${userVehicles[0].brand} ${userVehicles[0].model}` : 'Veículo da Garagem'
          };

          return {
            ...g,
            isMember: true,
            userRole: 'member',
            memberCount: g.memberCount + 1,
            members: [...(g.members || []), newMember]
          };
        }
      }
      return g;
    }));
  };

  const handleUpdateGroup = (updatedGroup: CommunityGroup) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    if (selectedGroup && selectedGroup.id === updatedGroup.id) {
      setSelectedGroup(updatedGroup);
    }
  };

  const handleAddGroup = (newGroup: CommunityGroup) => {
    setGroups(prev => [newGroup, ...prev]);
  };

  const handleVotePoll = (groupId: string, optionId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId && g.pinnedPoll) {
        const prevVoteId = g.pinnedPoll.userVotedOptionId;
        const updatedOptions = g.pinnedPoll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          if (opt.id === prevVoteId) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        return {
          ...g,
          pinnedPoll: {
            ...g.pinnedPoll,
            userVotedOptionId: optionId,
            totalVotes: prevVoteId ? g.pinnedPoll.totalVotes : g.pinnedPoll.totalVotes + 1,
            options: updatedOptions
          }
        };
      }
      return g;
    }));
  };

  const handleStartChatWithUser = (
    recipient: User, 
    listingContext?: { id: string; title: string; price: number; image: string },
    initialOffer?: number
  ) => {
    // Check if conversation exists
    let conv = conversations.find(c => c.recipient.id === recipient.id);
    let convId = conv ? conv.id : `conv_${Date.now()}`;

    if (!conv) {
      const newConv: ChatConversation = {
        id: convId,
        recipient,
        lastMessage: initialOffer ? `Proposta de R$ ${initialOffer.toLocaleString('pt-BR')}` : 'Iniciou uma conversa',
        lastTimestamp: 'Agora',
        unreadCount: 0,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text: initialOffer 
              ? `Olá ${recipient.name}! Tenho real interesse no anúncio "${listingContext?.title}". Gostaria de formalizar uma proposta no valor de R$ ${initialOffer.toLocaleString('pt-BR')}.`
              : `Olá ${recipient.name}! Gostaria de tirar dúvidas sobre o veículo/peça anunciado.`,
            timestamp: 'Agora',
            listingContext,
            offerAmount: initialOffer
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
    } else if (initialOffer) {
      // Add offer message to existing conversation
      const offerMsg = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        text: `Olá ${recipient.name}! Gostaria de fazer uma proposta de R$ ${initialOffer.toLocaleString('pt-BR')} no item "${listingContext?.title}".`,
        timestamp: 'Agora',
        listingContext,
        offerAmount: initialOffer
      };
      setConversations(prev => prev.map(c => {
        if (c.id === conv!.id) {
          return {
            ...c,
            lastMessage: `Proposta de R$ ${initialOffer.toLocaleString('pt-BR')}`,
            lastTimestamp: 'Agora',
            messages: [...c.messages, offerMsg]
          };
        }
        return c;
      }));
    }

    setActiveConversationId(convId);
    setIsMessagesModalOpen(true);
  };

  const handleSendMessage = (conversationId: string, text: string, offerAmount?: number) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const newMsg = {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          text,
          timestamp: 'Agora',
          offerAmount
        };
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Agora',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
  };

  const handleHashtagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveTab('feed');
  };

  const handleViewUserProfile = (targetUser: User | { id: string; name: string; avatar: string; handle?: string }) => {
    // Resolve only the authenticated user; demo users are intentionally absent.
    const foundUser = targetUser.id === currentUser.id ? currentUser : null;

    if (foundUser) {
      setViewedUserProfile(foundUser);
    } else {
      // Fallback reconstructed user
      setViewedUserProfile({
        id: targetUser.id,
        name: targetUser.name,
        handle: (targetUser as any).handle || `@${targetUser.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: targetUser.avatar,
        bio: 'Membro entusiasta e colecionador na rede Garage 95.',
        location: 'Brasil',
        collectorTier: (targetUser as any).collectorTier || 'Colecionador Certificado',
        memberSince: '2023',
        garageCount: vehicles.filter(v => v.ownerId === targetUser.id).length || 1,
        followersCount: 120,
        followingCount: 45,
        totalLikes: 350,
        reputationScore: 98,
        verifiedCollector: true,
        specialty: 'Preservação de Automóveis Antigos'
      });
    }

    setActiveTab('garage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOwnProfile = () => {
    setViewedUserProfile(null);
    setActiveTab('garage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User to display in ProfileView: either a viewed other user or currentUser
  const activeProfileUser = viewedUserProfile || currentUser;
  const isViewingOwnProfile = !viewedUserProfile || viewedUserProfile.id === currentUser.id;

  const profileDisplayVehicles = useMemo(() => {
    return vehicles.filter(v => v.ownerId === activeProfileUser.id);
  }, [vehicles, activeProfileUser.id]);

  const profileDisplayPosts = useMemo(() => {
    return posts.filter(p => p.author.id === activeProfileUser.id);
  }, [posts, activeProfileUser.id]);

  const allKnownUsers = useMemo(() => {
    return [currentUser];
  }, [currentUser]);

  const activeProfileFriends = useMemo(() => {
    if (isViewingOwnProfile) {
      return friendsUserIds
        .map(id => allKnownUsers.find(u => u.id === id))
        .filter((u): u is User => Boolean(u));
    } else {
      const listIds = activeProfileUser.friends || [];
      const list = listIds
        .map(id => (id === currentUser.id ? currentUser : allKnownUsers.find(u => u.id === id)))
        .filter((u): u is User => Boolean(u));
      
      if (friendsUserIds.includes(activeProfileUser.id) && !list.some(u => u.id === currentUser.id)) {
        return [currentUser, ...list];
      }
      return list;
    }
  }, [isViewingOwnProfile, friendsUserIds, activeProfileUser, allKnownUsers, currentUser]);

  // ----------------------------------------------------
  // Filtered views calculation
  // ----------------------------------------------------

  const filteredPosts = useMemo(() => {
    const matchingPosts = posts.filter(post => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.vehicleTagged?.brand.toLowerCase().includes(query) ||
        post.vehicleTagged?.model.toLowerCase().includes(query) ||
        post.hashtags?.some(h => h.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category Filter
      if (feedCategoryFilter === 'v8') {
        return post.vehicleTagged?.engine?.toLowerCase().includes('v8') || post.hashtags?.includes('#v8') || post.content.toLowerCase().includes('v8');
      }
      if (feedCategoryFilter === 'placapreta') {
        return post.vehicleTagged?.plateType === 'preta' || post.hashtags?.includes('#placapreta');
      }
      if (feedCategoryFilter === 'aircooled') {
        return post.vehicleTagged?.engine?.toLowerCase().includes('boxer') || post.hashtags?.includes('#aircooled') || post.content.toLowerCase().includes('fusca');
      }
      if (feedCategoryFilter === 'restauracao') {
        return post.hashtags?.includes('#restauracao') || post.content.toLowerCase().includes('restauração');
      }
      if (feedCategoryFilter === 'pista') {
        return post.hashtags?.includes('#trackday') || post.content.toLowerCase().includes('pista');
      }
      return true;
    });

    if (searchQuery.trim() || feedCategoryFilter !== 'todos') return matchingPosts;

    const scorePost = (post: Post) => {
      const vehicle = post.vehicleTagged;
      const brandMatch = vehicle && userGarageProfile.brands.has(vehicle.brand.toLowerCase()) ? 35 : 0;
      const modelMatch = vehicle && userGarageProfile.models.has(vehicle.model.toLowerCase()) ? 45 : 0;
      const authorMatch = post.author.id === currentUser.id || friendsUserIds.includes(post.author.id) ? 25 : 0;
      const clubContent = post.isExclusiveClub ? 10 : 0;
      const mediaQuality = Math.min(post.media.length * 4, 12);
      const engagement = Math.min(post.likesCount + post.commentsCount * 2, 30);
      return brandMatch + modelMatch + authorMatch + clubContent + mediaQuality + engagement;
    };

    return [...matchingPosts].sort((a, b) => scorePost(b) - scorePost(a));
  }, [posts, searchQuery, feedCategoryFilter, userGarageProfile, currentUser.id, friendsUserIds]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.engine.toLowerCase().includes(query) ||
        v.year.toString().includes(query);

      if (!matchesSearch) return false;

      if (exploreEraFilter === 'anos60') return v.year >= 1960 && v.year <= 1969;
      if (exploreEraFilter === 'anos70') return v.year >= 1970 && v.year <= 1979;
      if (exploreEraFilter === 'anos80') return v.year >= 1980 && v.year <= 1989;
      if (exploreEraFilter === 'pre-guerra') return v.year < 1960;

      return true;
    });
  }, [vehicles, searchQuery, exploreEraFilter]);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        l.title.toLowerCase().includes(query) ||
        l.brand.toLowerCase().includes(query) ||
        l.model.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (marketplaceCategoryFilter !== 'todos') {
        return l.category === marketplaceCategoryFilter;
      }
      return true;
    });
  }, [listings, searchQuery, marketplaceCategoryFilter]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        e.title.toLowerCase().includes(query) ||
        e.city.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (eventCategoryFilter !== 'todos') {
        return e.type === eventCategoryFilter;
      }
      return true;
    });
  }, [events, searchQuery, eventCategoryFilter]);

  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Sync current user's authored posts
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.author.id === updatedUser.id
          ? { ...post, author: updatedUser }
          : post
      )
    );
    // Sync current user's vehicles owner info
    setVehicles(prevVehicles =>
      prevVehicles.map(veh =>
        veh.ownerId === updatedUser.id
          ? { ...veh, ownerName: updatedUser.name, ownerAvatar: updatedUser.avatar }
          : veh
      )
    );
  };

  const handleOpenEditVehicle = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsEditVehicleModalOpen(true);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    if (selectedVehicle && selectedVehicle.id === updatedVehicle.id) {
      setSelectedVehicle(updatedVehicle);
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    if (selectedVehicle && selectedVehicle.id === vehicleId) {
      setSelectedVehicle(null);
    }
    if (vehicleToEdit && vehicleToEdit.id === vehicleId) {
      setVehicleToEdit(null);
      setIsEditVehicleModalOpen(false);
    }
  };

  // 1. App Startup Animation with Logo and Classic V8 Engine Sound
  if (isStartupSplashActive) {
    return (
      <StartupSplashAnimation
        isFirstAccess={!isAuthenticated}
        onComplete={() => {
          setIsStartupSplashActive(false);
        }}
      />
    );
  }

  // 2. If user is not yet registered/authenticated (first access), direct to Cadastro & Welcome Screen
  if (!isAuthenticated) {
    return (
      <WelcomeAuthGate
        isOpen={true}
        onComplete={(user, initialVehicle) => {
          handleAuthSuccess(user, initialVehicle);
          setActiveTab('feed');
        }}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-garage-theme text-[#E8ECE8] font-sans-body antialiased flex flex-col selection:bg-[#D4AF37] selection:text-[#121713] relative">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreatePost={() => setIsCreatePostModalOpen(true)}
        openCreateVehicle={() => setIsAddVehicleModalOpen(true)}
        openNotifications={() => setIsNotificationsModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={totalUnreadMessages}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        openAdvisorModal={() => setIsAdvisorModalOpen(true)}
        openAuthModal={handleOpenAuthGate}
        openEditProfile={() => setIsEditProfileModalOpen(true)}
        openMyProfile={handleViewOwnProfile}
        onReplaySplash={() => setIsStartupSplashActive(true)}
      />

      {/* Mobile Top Secondary Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMyProfile={handleViewOwnProfile}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 flex gap-6">
        
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          openCreateVehicle={() => setIsAddVehicleModalOpen(true)}
          openAdvisorModal={() => setIsAdvisorModalOpen(true)}
          openEditProfile={() => setIsEditProfileModalOpen(true)}
          openMyProfile={handleViewOwnProfile}
          openAuthModal={handleOpenAuthGate}
        />

        {/* Center Main Dynamic Content */}
        <main className="flex-1 min-w-0 pb-24 sm:pb-20 lg:pb-6">
          
          {/* ===================== TAB: FEED ===================== */}
          {activeTab === 'feed' && (
            <div className="space-y-5">
              {/* Active Search/Filter Reset Notification if active */}
              {(searchQuery || feedCategoryFilter !== 'todos') && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C271E] border border-[#D4AF37]/40 text-xs text-[#F3E5AB]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {searchQuery ? `Buscando por: "${searchQuery}"` : `Filtrando por: ${feedCategoryFilter}`}
                    </span>
                  </div>
                  <button
                    onClick={handleResetToHome}
                    className="px-2.5 py-1 rounded-lg bg-[#263628] hover:bg-[#324835] text-[#D4AF37] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Ver feed completo</span>
                  </button>
                </div>
              )}

              {/* Feed Posts List */}
              <div className="space-y-6">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLikePost={handleLikePost}
                      onAddComment={handleAddComment}
                      onSelectVehicle={setSelectedVehicle}
                      onHashtagClick={handleHashtagClick}
                      onContactAuthor={(author) => handleStartChatWithUser(author)}
                      onViewUserProfile={handleViewUserProfile}
                      onToggleSavePost={handleToggleSavePost}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center bg-[#18221A] rounded-2xl border border-[#3B4D3A]/60 space-y-3">
                    <Car className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
                    <h4 className="font-serif font-bold text-[#F3E5AB]">Nenhuma publicação encontrada</h4>
                    <p className="text-xs text-[#8EA290]">
                      Tente alterar os filtros ou clique abaixo para retornar ao início.
                    </p>
                    <button
                      onClick={handleResetToHome}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A227] text-[#121713] text-xs font-bold hover:bg-[#E5C158] transition-all cursor-pointer shadow-md"
                    >
                      <Home className="w-4 h-4" />
                      <span>Voltar para a Página Inicial</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ===================== TAB: EXPLORAR (HUB DE DESCOBERTA & TENDÊNCIAS) ===================== */}
          {(activeTab === 'explore' || activeTab === 'explorar') && (
            <ExploreView
              currentUser={currentUser}
              vehicles={vehicles}
              groups={groups}
              events={events}
              listings={listings}
              users={allKnownUsers}
              friendsUserIds={friendsUserIds}
              onSelectVehicle={setSelectedVehicle}
              onOpenEditVehicle={handleOpenEditVehicle}
              onSelectGroup={setSelectedGroup}
              onToggleJoinGroup={handleToggleJoinGroup}
              onSelectEvent={setSelectedEvent}
              onToggleRegisterEvent={handleToggleRegisterEvent}
              onSelectListing={setSelectedListing}
              onToggleSaveListing={handleToggleSaveListing}
              onViewUserProfile={handleViewUserProfile}
              onToggleFriend={handleToggleFriend}
              onTagClick={handleHashtagClick}
              onOpenCreateVehicle={() => setIsAddVehicleModalOpen(true)}
              onNavigateToTab={(tabId) => {
                setActiveTab(tabId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* ===================== TAB: MARKETPLACE ===================== */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              
              {/* Back to Home Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleResetToHome}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18221A] hover:bg-[#263628] text-xs font-bold text-[#D4AF37] border border-[#3B4D3A]/70 hover:border-[#D4AF37]/60 shadow-sm transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para a Página Inicial (Feed)</span>
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18221A] border border-[#3B4D3A]/60 p-5 rounded-2xl shadow-lg">
                <div>
                  <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                    Mercado de Clássicos & Peças Raras
                  </h2>
                  <p className="text-xs text-[#8EA290] mt-0.5">
                    Negociação direta e segura entre colecionadores certificados com laudo FIVA.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsCreateListingModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Criar Anúncio</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {[
                  { id: 'todos', label: 'Todos os Itens' },
                  { id: 'veiculo', label: 'Veículos Completos' },
                  { id: 'peca', label: 'Peças Raras & Motores' },
                  { id: 'acessorio', label: 'Acessórios de Época' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMarketplaceCategoryFilter(cat.id as typeof marketplaceCategoryFilter)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      marketplaceCategoryFilter === cat.id
                        ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                        : 'bg-[#18221A] text-[#8EA290] border border-[#3B4D3A]/60 hover:text-[#E8ECE8]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Marketplace Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((listing) => (
                  <MarketplaceCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedListing}
                    onToggleSave={handleToggleSaveListing}
                    onViewSellerProfile={handleViewUserProfile}
                  />
                ))}
              </div>

            </div>
          )}

          {/* ===================== TAB: EVENTOS ===================== */}
          {(activeTab === 'events' || activeTab === 'eventos') && (
            <div className="space-y-6">
              
              {/* Back to Home Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleResetToHome}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18221A] hover:bg-[#263628] text-xs font-bold text-[#D4AF37] border border-[#3B4D3A]/70 hover:border-[#D4AF37]/60 shadow-sm transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para a Página Inicial (Feed)</span>
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18221A] border border-[#3B4D3A]/60 p-5 rounded-2xl shadow-lg">
                <div>
                  <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    Agenda de Encontros, Rallies & Pista
                  </h2>
                  <p className="text-xs text-[#8EA290] mt-0.5">
                    Participe de encontros noturnos, passeios em comboio, track days históricos e feiras de peças.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateEventModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Organizar Encontro</span>
                </button>
              </div>

              {/* Event Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {[
                  { id: 'todos', label: 'Todos os Eventos' },
                  { id: 'encontro', label: 'Encontros Noturnos' },
                  { id: 'exposicao', label: 'Concursos d\'Elegance' },
                  { id: 'track_day', label: 'Track Days' },
                  { id: 'leilao', label: 'Leilões Oficiais' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEventCategoryFilter(item.id as typeof eventCategoryFilter)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      eventCategoryFilter === item.id
                        ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                        : 'bg-[#18221A] text-[#8EA290] border border-[#3B4D3A]/60 hover:text-[#E8ECE8]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={setSelectedEvent}
                    onToggleRegister={handleToggleRegisterEvent}
                    currentUser={currentUser}
                  />
                ))}
              </div>

            </div>
          )}

          {/* ===================== TAB: GRUPOS ===================== */}
          {(activeTab === 'groups' || activeTab === 'grupos') && (() => {
            const myClubs = groups.filter((g) => g.isMember);
            
            const suggestedClubs = groups.filter((g) => {
              if (g.isMember || g.visibility === 'private') return false;
              return userVehicles.some((v) =>
                v.brand.toLowerCase().includes(g.name.toLowerCase().split(' ')[0]) ||
                g.tags.some((t) => t.toLowerCase().includes(v.brand.toLowerCase())) ||
                (g.clubType === 'brand_model' && v.brand.toLowerCase().includes(g.category.toLowerCase()))
              );
            });

            const discoverClubs = groups.filter((g) => {
              // Rule: Private clubs NEVER appear in Discovery for non-members
              if (g.visibility === 'private' && !g.isMember) return false;

              // Filter by category chip
              if (clubCategoryFilter === 'brand_model' && g.clubType !== 'brand_model' && g.clubType !== 'specific_model') {
                return false;
              }
              if (clubCategoryFilter === 'specific_model' && g.clubType !== 'specific_model') {
                return false;
              }
              if (clubCategoryFilter === 'general_community' && g.clubType !== 'general_community') {
                return false;
              }

              // Search query in club name, description, category or tags
              if (clubSearchQuery.trim()) {
                const q = clubSearchQuery.toLowerCase();
                const matchName = g.name.toLowerCase().includes(q);
                const matchDesc = g.description.toLowerCase().includes(q);
                const matchCat = g.category.toLowerCase().includes(q);
                const matchTag = g.tags.some((t) => t.toLowerCase().includes(q));
                if (!matchName && !matchDesc && !matchCat && !matchTag) return false;
              }

              return true;
            });

            return (
              <div className="space-y-8">
                
                {/* Back to Home Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResetToHome}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18221A] hover:bg-[#263628] text-xs font-bold text-[#D4AF37] border border-[#3B4D3A]/70 hover:border-[#D4AF37]/60 shadow-sm transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar para a Página Inicial (Feed)</span>
                  </button>
                </div>

                {/* Main Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18221A] border border-[#3B4D3A]/60 p-5 rounded-2xl shadow-lg">
                  <div>
                    <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#D4AF37]" />
                      Clubes de Colecionadores & Comunidades
                    </h2>
                    <p className="text-xs text-[#8EA290] mt-0.5">
                      Participe de fóruns técnicos, encontros oficiais, enquetes exclusivas e comboios com outros proprietários.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsInviteAccessModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Acessar via Convite</span>
                    </button>

                    <button
                      onClick={() => setIsCreateGroupModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Fundar Novo Clube</span>
                    </button>
                  </div>
                </div>

                {/* ================= LAYER 1: MEUS CLUBES ================= */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-[#263628] text-[#D4AF37]">
                        <Users className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                        Meus Clubes ({myClubs.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#8EA290]">Comunidades que você participa ativamente</span>
                  </div>

                  {myClubs.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#18221A]/80 border border-[#3B4D3A]/60 text-center space-y-2">
                      <Users className="w-8 h-8 mx-auto text-[#4F6650] opacity-70" />
                      <h4 className="font-bold text-sm text-[#F3E5AB]">Você ainda não participa de nenhum clube</h4>
                      <p className="text-xs text-[#8EA290] max-w-md mx-auto">
                        Explore as sugestões baseadas na sua garagem ou descubra comunidades públicas abaixo para trocar experiências e participar de encontros.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {myClubs.map((group) => (
                        <GroupCard
                          key={group.id}
                          group={group}
                          onSelect={setSelectedGroup}
                          onToggleJoin={handleToggleJoinGroup}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= LAYER 2: SUGERIDOS PARA VOCÊ ================= */}
                {suggestedClubs.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-[#C9A227]/20 text-[#D4AF37]">
                          <Car className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                          Sugeridos para Você
                        </h3>
                      </div>
                      <span className="text-[11px] text-[#D4AF37] font-medium">Baseado nos carros da sua garagem</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {suggestedClubs.map((group) => (
                        <GroupCard
                          key={group.id}
                          group={group}
                          onSelect={setSelectedGroup}
                          onToggleJoin={handleToggleJoinGroup}
                          isAutoSuggested={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= LAYER 3: DESCOBRIR (DEMAIS CLUBES PÚBLICOS) ================= */}
                <div className="space-y-4 pt-2 border-t border-[#3B4D3A]/40">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB] flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#D4AF37]" />
                        Descobrir Clubes & Comunidades
                      </h3>
                      <p className="text-xs text-[#8EA290]">Navegue por marca, modelo específico ou estilo de veículo.</p>
                    </div>

                    {/* Search inside Discovery */}
                    <div className="relative w-full md:w-72">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA290]" />
                      <input
                        type="text"
                        value={clubSearchQuery}
                        onChange={(e) => setClubSearchQuery(e.target.value)}
                        placeholder="Buscar por nome, marca ou tag..."
                        className="w-full pl-9 pr-3 py-1.5 bg-[#18221A] border border-[#3B4D3A] focus:border-[#D4AF37] rounded-xl text-xs text-[#E8ECE8] focus:outline-none"
                      />
                      {clubSearchQuery && (
                        <button
                          onClick={() => setClubSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8EA290] hover:text-[#E8ECE8]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'todos', label: 'Todos os Clubes' },
                      { id: 'brand_model', label: 'Clubes de Marca / Modelo' },
                      { id: 'specific_model', label: 'Modelos Específicos' },
                      { id: 'general_community', label: 'Comunidades Gerais (Era / Estilo / Pista)' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setClubCategoryFilter(cat.id as typeof clubCategoryFilter)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          clubCategoryFilter === cat.id
                            ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                            : 'bg-[#18221A] text-[#8EA290] border border-[#3B4D3A]/60 hover:text-[#E8ECE8]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Discovery Grid */}
                  {discoverClubs.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#18221A]/50 border border-[#3B4D3A]/50 text-center space-y-2">
                      <Search className="w-8 h-8 mx-auto text-[#4F6650] opacity-60 mb-1" />
                      <h4 className="font-bold text-sm text-[#F3E5AB]">Nenhum clube encontrado</h4>
                      <p className="text-xs text-[#8EA290]">
                        Tente ajustar os termos da busca ou selecione outra categoria de clube.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {discoverClubs.map((group) => {
                        const isSuggested = userVehicles.some((v) =>
                          v.brand.toLowerCase().includes(group.name.toLowerCase().split(' ')[0]) ||
                          group.tags.some((t) => t.toLowerCase().includes(v.brand.toLowerCase()))
                        );

                        return (
                          <GroupCard
                            key={group.id}
                            group={group}
                            onSelect={setSelectedGroup}
                            onToggleJoin={handleToggleJoinGroup}
                            isAutoSuggested={isSuggested}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {/* ===================== TAB: PERFIL / GARAGEM ===================== */}
          {(activeTab === 'garage' || activeTab === 'perfil' || activeTab === 'profile') && (
            <ProfileView
              user={activeProfileUser}
              currentUser={currentUser}
              userVehicles={profileDisplayVehicles}
              userPosts={profileDisplayPosts}
              savedListings={savedListings}
              savedPosts={savedPosts}
              allEvents={events}
              isFriend={friendsUserIds.includes(activeProfileUser.id)}
              onToggleFriend={handleToggleFriend}
              friendsList={activeProfileFriends}
              onSelectVehicle={setSelectedVehicle}
              onAddVehicle={() => setIsAddVehicleModalOpen(true)}
              onEditVehicle={isViewingOwnProfile ? handleOpenEditVehicle : undefined}
              onOpenValuation={() => setIsValuationModalOpen(true)}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onSelectListing={setSelectedListing}
              onToggleSaveListing={handleToggleSaveListing}
              onToggleSavePost={handleToggleSavePost}
              onHashtagClick={handleHashtagClick}
              onContactAuthor={(author) => handleStartChatWithUser(author)}
              onViewUserProfile={handleViewUserProfile}
              onBackToFeed={handleResetToHome}
              onEditProfile={() => setIsEditProfileModalOpen(true)}
              onOpenCreatePost={() => setIsCreatePostModalOpen(true)}
              onNavigateToEvents={() => {
                setActiveTab('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              openAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* ===================== TAB: MESSAGES (IF SELECTED VIA SIDEBAR/NAV) ===================== */}
          {activeTab === 'messages' && (
            <div className="p-8 text-center bg-[#18221A] rounded-2xl border border-[#3B4D3A]/60 space-y-4">
              <div className="flex items-center justify-start mb-2">
                <button
                  onClick={handleResetToHome}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18221A] hover:bg-[#263628] text-xs font-bold text-[#D4AF37] border border-[#3B4D3A]/70 hover:border-[#D4AF37]/60 shadow-sm transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para a Página Inicial (Feed)</span>
                </button>
              </div>
              <Users className="w-12 h-12 text-[#D4AF37] mx-auto opacity-70" />
              <h3 className="font-serif-heading text-lg font-bold text-[#F3E5AB]">Mensagens Diretas & Negociações</h3>
              <p className="text-xs text-[#8EA290] max-w-md mx-auto">
                Converse em tempo real com compradores, mecânicos especializados e outros colecionadores.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsMessagesModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Abrir Painel de Mensagens ({totalUnreadMessages} não lidas)
                </button>
                <button
                  onClick={handleResetToHome}
                  className="px-4 py-2.5 rounded-xl bg-[#263628] hover:bg-[#324835] text-[#F3E5AB] text-xs font-bold transition-all border border-[#D4AF37]/40 cursor-pointer"
                >
                  Voltar ao Feed
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onContactOwner={(owner) => handleStartChatWithUser(owner)}
        onViewOwnerProfile={handleViewUserProfile}
        onEditVehicle={handleOpenEditVehicle}
        currentUser={currentUser}
      />

      {/* 2. Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onAddVehicle={handleAddVehicle}
        currentUser={currentUser}
        currentUserId={currentUser.id}
      />

      {/* 3. Story Viewer Modal */}
      <StoryViewerModal
        story={activeStory}
        stories={stories}
        onClose={() => setActiveStory(null)}
        onSelectStory={setActiveStory}
        onContactAuthor={(author) => handleStartChatWithUser(author)}
        onViewUserProfile={handleViewUserProfile}
      />

      {/* 3.1 Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setIsCreateStoryModalOpen(false)}
        onAddStory={handleAddStory}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 4. Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onAddPost={handleAddPost}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 5. Marketplace Detail Modal */}
      <MarketplaceDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onStartChat={handleStartChatWithUser}
        onViewSellerProfile={handleViewUserProfile}
        currentUser={currentUser}
      />

      {/* 6. Create Listing Modal */}
      <CreateListingModal
        isOpen={isCreateListingModalOpen}
        onClose={() => setIsCreateListingModalOpen(false)}
        onAddListing={handleAddListing}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 7. Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onToggleRegister={handleToggleRegisterEvent}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 8. Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onAddEvent={handleAddEvent}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 9. Group Detail Modal */}
      <GroupDetailModal
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
        onToggleJoin={handleToggleJoinGroup}
        onVotePoll={handleVotePoll}
        onUpdateGroup={handleUpdateGroup}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 10. Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onAddGroup={handleAddGroup}
        currentUser={currentUser}
      />

      {/* 10.1 Invite Link / Code Preview & Access Modal */}
      {isInviteAccessModalOpen && (() => {
        const cleanInput = inviteCodeInput.trim().toUpperCase().replace(/.*\/C\//i, '').replace(/.*\/INVITE\//i, '');
        const foundClub = groups.find((g) => {
          if (!cleanInput) return false;
          const clubCode = (g.inviteLink?.code || '').toUpperCase();
          const clubId = g.id.toUpperCase();
          const clubName = g.name.toUpperCase();
          return clubCode === cleanInput || clubCode.includes(cleanInput) || clubId.includes(cleanInput) || clubName.includes(cleanInput);
        });

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
            <div className="w-full max-w-lg bg-[#18221A] border border-[#D4AF37]/60 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
              
              {/* Modal Top Bar */}
              <div className="p-4 bg-[#121713] border-b border-[#3B4D3A]/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37]">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-heading font-bold text-sm text-[#F3E5AB]">Acesso por Convite de Clube</h3>
                    <p className="text-[10px] text-[#8EA290]">Abra links ou insira códigos de clubes privados e exclusivos</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsInviteAccessModalOpen(false);
                    setInviteCodeInput('');
                  }}
                  className="p-1.5 rounded-lg text-[#8EA290] hover:text-[#E8ECE8] hover:bg-[#263628] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5">
                {/* Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#D4AF37]">
                    Código ou Link do Convite:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inviteCodeInput}
                      onChange={(e) => setInviteCodeInput(e.target.value)}
                      placeholder="Ex: OPALA-VIP-95 ou cole o link recebido..."
                      className="w-full pl-3 pr-24 py-2.5 bg-[#121713] border border-[#3B4D3A] focus:border-[#D4AF37] rounded-xl text-xs text-[#E8ECE8] font-mono focus:outline-none"
                    />
                    {inviteCodeInput && (
                      <button
                        onClick={() => setInviteCodeInput('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] text-[#8EA290] hover:text-[#E8ECE8]"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Test Chips for Private Clubs */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#8EA290] uppercase tracking-wider block">
                    Sugestões de Convites para Testar:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {groups
                      .filter((g) => g.inviteLink?.code)
                      .slice(0, 4)
                      .map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setInviteCodeInput(g.inviteLink?.code || '')}
                          className="px-2.5 py-1 rounded-lg bg-[#121713] hover:bg-[#263628] border border-[#3B4D3A]/60 hover:border-[#D4AF37]/50 text-[10px] font-mono text-[#D4AF37] transition-all cursor-pointer flex items-center gap-1"
                        >
                          {g.visibility === 'private' && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                          <span>{g.inviteLink?.code}</span>
                          <span className="text-[#8EA290]">({g.name.split(' ')[0]})</span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* CLUB PREVIEW CARD (When Code is matched) */}
                {foundClub ? (
                  <div className="rounded-2xl bg-[#121713] border border-[#D4AF37]/50 overflow-hidden shadow-lg animate-in fade-in space-y-0">
                    {/* Cover Header */}
                    <div className="relative h-28 w-full overflow-hidden">
                      <img
                        src={foundClub.bannerUrl}
                        alt={foundClub.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121713] via-[#121713]/50 to-transparent" />
                      
                      <div className="absolute top-2.5 right-2.5">
                        {foundClub.visibility === 'private' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>Clube Privado Exclusivo</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
                            <Globe className="w-3 h-3" />
                            <span>Clube Público</span>
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="absolute bottom-2.5 left-4 flex items-end gap-3">
                        <img
                          src={foundClub.avatarUrl}
                          alt={foundClub.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4AF37] shadow-md bg-[#18221A]"
                        />
                        <div className="pb-0.5">
                          <h4 className="font-serif-heading font-bold text-sm text-[#F3E5AB] leading-tight">
                            {foundClub.name}
                          </h4>
                          <span className="text-[10px] text-[#A2B3A4] font-medium block">
                            {foundClub.category} • {foundClub.memberCount} membros
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-[#8EA290] leading-relaxed">
                        {foundClub.description}
                      </p>

                      <div className="pt-2 border-t border-[#3B4D3A]/40 flex items-center justify-between gap-3">
                        <div className="text-[10px] text-[#8EA290]">
                          Fundado por: <strong className="text-[#E8ECE8]">{foundClub.founderName || 'Colecionador'}</strong>
                        </div>

                        {foundClub.isMember ? (
                          <button
                            onClick={() => {
                              setIsInviteAccessModalOpen(false);
                              setSelectedGroup(foundClub);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Abrir Clube (Já é Membro)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleToggleJoinGroup(foundClub.id);
                              setIsInviteAccessModalOpen(false);
                              setSelectedGroup({ ...foundClub, isMember: true });
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Entrar no Clube com Convite</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : cleanInput ? (
                  <div className="p-5 rounded-2xl bg-[#121713] border border-rose-900/50 text-center space-y-1">
                    <p className="text-xs font-bold text-rose-400">Convite não encontrado ou código expirado</p>
                    <p className="text-[11px] text-[#8EA290]">Verifique se digitou o código de convite corretamente.</p>
                  </div>
                ) : null}

              </div>

            </div>
          </div>
        );
      })()}

      {/* 11. Messages Modal */}
      <MessagesModal
        isOpen={isMessagesModalOpen}
        onClose={() => setIsMessagesModalOpen(false)}
        currentUser={currentUser}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onSendMessage={handleSendMessage}
      />

      {/* 12. Valuation Calculator Modal */}
      <ValuationCalculatorModal
        isOpen={isValuationModalOpen}
        onClose={() => setIsValuationModalOpen(false)}
        userVehicles={userVehicles}
      />

      {/* 13. AI Advisor & Curator Modal (Powered by Gemini) */}
      <AIAdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        currentUser={currentUser}
        userVehicles={userVehicles}
      />

      {/* 14. Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* 15. Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />

      {/* 16. Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={isEditVehicleModalOpen}
        onClose={() => {
          setIsEditVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        vehicle={vehicleToEdit}
        onSaveVehicle={handleSaveVehicle}
        onDeleteVehicle={handleDeleteVehicle}
      />

      {/* 17. Startup & Account Auth / Registration Modal (Google & Meta Account Linking) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        canDismiss={true}
      />

      {/* 18. Welcome & Onboarding Full Gate Modal */}
      <WelcomeAuthGate
        isOpen={isWelcomeGateOpen}
        onClose={() => setIsWelcomeGateOpen(false)}
        onComplete={(user) => handleAuthSuccess(user)}
        currentUser={currentUser}
      />

    </div>
  );
}

export default App;
