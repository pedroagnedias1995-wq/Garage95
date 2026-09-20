export type PlateType = 'preta' | 'mercosul' | 'colecao' | 'nao_informado';
export type VehicleCategory = 'carro' | 'moto' | 'outro';
export type VehicleStatus = 'garage' | 'for_sale' | 'restoring';

export interface RestorationStep {
  date: string;
  description: string;
  workshop?: string;
}

export interface VehicleTrophyItem {
  title: string;
  year?: number | string;
  event?: string;
  category?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  plateType: PlateType;
  color: string;
  photos: string[];
  coverPhoto: string;
  status: VehicleStatus;

  // Ficha Técnica (opcional)
  engine?: string;
  horsepower?: number;
  torque?: string;
  transmission?: string;
  transmissionOriginal?: boolean;
  fuel?: string;
  mileage?: number;
  zeroToHundred?: string;
  topSpeed?: string;

  // Autenticidade & Procedência (opcional)
  chassisMasked?: string;
  matchingNumbers?: boolean;
  authenticityScore?: number;
  authenticityBreakdown?: {
    bodywork?: number;
    engine?: number;
    interior?: number;
    paint?: number;
  };
  previousOwnersCount?: string | number;
  documentsAvailable?: string[];

  // História & Raridade (opcional)
  restorationHistory?: string;
  restorationTimeline?: RestorationStep[];
  modifications?: string[];
  trophies?: string[];
  trophiesStructured?: VehicleTrophyItem[];
  limitedEdition?: string;
  historicalCuriosity?: string;

  // Mídia Extra (opcional)
  soundAudioUrl?: string;
  videoUrl?: string;

  // Comercial (opcional)
  valuationEstimate?: string;
  acceptsTrade?: boolean;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  collectorTier: 'Membro Fundador' | 'Colecionador Ouro' | 'Mestre Restaurador' | 'Entusiasta Clássico' | 'Piloto Histórico';
  memberSince: string;
  garageCount: number;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  reputationScore: number;
  verifiedCollector: boolean;
  tier?: string;
  role?: string;
  badges?: string[];
  level?: number;
  vehiclesCount?: number;
  savedCars?: string[];
  specialty?: string;
  instagram?: string;
  phone?: string;
  showPhoneOnProfile?: boolean;
  whatsapp?: string;
  email?: string;
  authProvider?: 'google' | 'meta' | 'email';
  linkedProviders?: ('google' | 'meta' | 'email')[];
  originalityScore?: number;
  favoriteEra?: string;
  trophies?: {
    title: string;
    year: number;
    event: string;
    category: string;
  }[];
  isFollowing?: boolean;
  friends?: string[];
  friendsCount?: number;
  isFriend?: boolean;
}

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface PostComment {
  id: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    collectorTier: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  vehicleTagged?: Vehicle;
  content: string;
  media: PostMedia[];
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: PostComment[];
  sharesCount: number;
  hashtags: string[];
  isExclusiveClub?: boolean;
  location?: string;
  soundTrackTitle?: string;
}

export interface Story {
  id: string;
  author: User;
  vehicleTagged?: Vehicle;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  subtitle?: string;
  engineRevAudio?: string;
  timestamp: string;
  viewed: boolean;
}

export type ListingCondition =
  | '100% Original Placa Preta'
  | 'Restaurado Concours'
  | 'Excelente Estado'
  | 'Projeto para Restauração'
  | 'Customizado / Restomod'
  | 'Novo / Sem Uso'
  | 'Usado Original de Época';

export interface MarketplaceListing {
  id: string;
  seller: User;
  title: string;
  category: 'veiculo' | 'peca' | 'acessorio' | 'memorabilia';
  condition: ListingCondition;
  price: number;
  currency: string;
  location: string;
  brand: string;
  model: string;
  year?: number;
  description: string;
  photos: string[];
  media?: PostMedia[];
  status: 'active' | 'reserved' | 'sold';
  views: number;
  savesCount: number;
  isSaved: boolean;
  isFeatured?: boolean;
  specsSummary?: { [key: string]: string };
  shippingAvailable?: boolean;
  certificateIncluded?: boolean;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  desc: string;
}

export interface ClubEvent {
  id: string;
  organizer: User;
  title: string;
  type: 'encontro' | 'track_day' | 'exposicao' | 'leilao' | 'passeio' | 'feira_pecas';
  date: string;
  time: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  coverImage: string;
  description: string;
  confirmedAttendees: {
    user: User;
    carModel?: string;
    confirmedAt: string;
  }[];
  interestedCount: number;
  isRegistered: boolean;
  checkInAvailable: boolean;
  schedule: EventScheduleItem[];
  postEventPhotos?: string[];
  entryFee?: string;
  requirements?: string;
}

export interface GroupPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface GroupPoll {
  id?: string;
  question: string;
  options: GroupPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  isActive?: boolean;
  createdAt?: string;
  endDate?: string;
}

export type ClubPoll = GroupPoll;

export type ClubVisibility = 'public' | 'private';
export type ClubJoinMode = 'free' | 'approval_required';
export type ClubType = 'brand_model' | 'specific_model' | 'general_community';
export type ClubRole = 'founder' | 'moderator' | 'member';

export interface ClubMember {
  user: User;
  role: ClubRole;
  joinedAt: string;
  vehicleInClub?: string;
}

export interface ClubJoinRequest {
  id: string;
  user: User;
  requestedAt: string;
  message?: string;
  vehicleModel?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userTier?: string;
  vehicleName?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ClubInviteLink {
  code: string;
  url: string;
  expiresLabel: 'Sem expiração' | '24 horas' | '7 dias';
  createdAt: string;
  createdBy?: string;
  active: boolean;
}

export interface ForumReply {
  id: string;
  author: User;
  content?: string;
  text?: string;
  createdAt?: string;
  timestamp?: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  lastActivity: string;
  repliesCount: number;
  viewsCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  replies: ForumReply[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  topics: ForumTopic[];
}

export interface ClubFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ClubPost {
  id: string;
  author: User;
  content?: string;
  text?: string;
  media?: PostMedia[];
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  createdAt?: string;
  timestamp?: string;
  likes?: number;
  likesCount?: number;
  isLiked?: boolean;
  replies?: number;
  commentsCount?: number;
  vehicleTagged?: string | Vehicle;
  comments?: PostComment[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bannerUrl: string;
  avatarUrl: string;
  category: string;
  clubType?: ClubType;
  visibility?: ClubVisibility;
  joinMode?: ClubJoinMode;
  memberCount: number;
  isMember: boolean;
  hasPendingRequest?: boolean;
  userRole?: ClubRole;
  tags: string[];
  targetEra?: string;
  targetBrands?: string[];
  rules: string[];
  pinnedPoll?: GroupPoll;
  polls?: GroupPoll[];
  postsCount: number;
  eventsCount: number;
  founderId?: string;
  founderName?: string;
  inviteLink?: ClubInviteLink;
  members?: ClubMember[];
  pendingRequests?: ClubJoinRequest[];
  forumCategories?: ForumCategory[];
  clubPosts?: ClubPost[];
  clubEvents?: ClubEvent[];
  faqs?: ClubFAQ[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
  vehicleContext?: {
    title: string;
    price: number;
    image: string;
  };
}

export interface Conversation {
  id: string;
  withUser: User;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  listingContext?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'marketplace_offer' | 'event_reminder' | 'group_invite' | 'system';
  sender: User;
  title: string;
  text: string;
  timestamp: string;
  read: boolean;
  targetId?: string;
  targetType?: 'post' | 'marketplace' | 'event' | 'group' | 'profile';
}
