import React, { useState, useMemo, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  Award, 
  Car, 
  Users, 
  Calendar, 
  ShoppingBag, 
  Hash, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  UserPlus, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Star, 
  ExternalLink, 
  Plus, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2,
  Tag,
  Search,
  Wrench,
  Layers,
  Heart
} from 'lucide-react';
import { 
  Vehicle, 
  User, 
  CommunityGroup, 
  ClubEvent, 
  MarketplaceListing 
} from '../types';
import { VehicleCard } from './VehicleCard';
import { GroupCard } from './GroupCard';
import { EventCard } from './EventCard';
import { MarketplaceCard } from './MarketplaceCard';
import { engineSound } from '../utils/engineSound';

interface ExploreViewProps {
  currentUser: User;
  vehicles: Vehicle[];
  groups: CommunityGroup[];
  events: ClubEvent[];
  listings: MarketplaceListing[];
  users: User[];
  friendsUserIds: string[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenEditVehicle?: (vehicle: Vehicle) => void;
  onSelectGroup: (group: CommunityGroup) => void;
  onToggleJoinGroup: (groupId: string) => void;
  onSelectEvent: (event: ClubEvent) => void;
  onToggleRegisterEvent: (eventId: string) => void;
  onSelectListing: (listing: MarketplaceListing) => void;
  onToggleSaveListing: (listingId: string) => void;
  onViewUserProfile: (user: User) => void;
  onToggleFriend: (user: User) => void;
  onTagClick: (tag: string) => void;
  onOpenCreateVehicle: () => void;
  onNavigateToTab: (tabId: string) => void;
}

type ViewAllCategory = 
  | null 
  | 'trending_vehicles' 
  | 'recommended_vehicles' 
  | 'groups' 
  | 'events' 
  | 'people' 
  | 'marketplace';

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentUser,
  vehicles,
  groups,
  events,
  listings,
  users,
  friendsUserIds,
  onSelectVehicle,
  onOpenEditVehicle,
  onSelectGroup,
  onToggleJoinGroup,
  onSelectEvent,
  onToggleRegisterEvent,
  onSelectListing,
  onToggleSaveListing,
  onViewUserProfile,
  onToggleFriend,
  onTagClick,
  onOpenCreateVehicle,
  onNavigateToTab,
}) => {
  // Global Filters for Vehicles within Explore
  const [selectedEra, setSelectedEra] = useState<'todas' | 'anos60' | 'anos70' | 'anos80' | 'pre-guerra'>('todas');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'carro' | 'moto'>('todos');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Sub-view "Ver tudo" state
  const [viewAllCategory, setViewAllCategory] = useState<ViewAllCategory>(null);

  // Refs for horizontal scrolling carousels
  const trendingCarouselRef = useRef<HTMLDivElement>(null);
  const recommendedCarouselRef = useRef<HTMLDivElement>(null);
  const groupsCarouselRef = useRef<HTMLDivElement>(null);
  const eventsCarouselRef = useRef<HTMLDivElement>(null);
  const peopleCarouselRef = useRef<HTMLDivElement>(null);
  const marketplaceCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 340;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Sound Player for Feature Card
  const toggleSound = (soundKey: string = 'v8_idle', id: string) => {
    if (activeAudioId === id) {
      engineSound.stop();
      setActiveAudioId(null);
    } else {
      engineSound.stop();
      engineSound.playIgnitionStartup();
      setActiveAudioId(id);
      setTimeout(() => {
        setActiveAudioId((curr) => (curr === id ? null : curr));
      }, 5800);
    }
  };

  // ----------------------------------------------------
  // 1. Destaque da Semana (Featured Car of the Week)
  // ----------------------------------------------------
  // Curated hero vehicle (e.g., Highland Green Mustang Fastback or classic Porsche)
  const featuredVehicle = useMemo(() => {
    return (
      vehicles.find(v => v.id === 'veh_1') ||
      vehicles.find(v => v.plateType === 'preta') ||
      vehicles[0]
    );
  }, [vehicles]);

  // ----------------------------------------------------
  // 2. Veículos com Filtro de Era & Categoria
  // ----------------------------------------------------
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Category
      if (selectedCategory !== 'todos' && v.category !== selectedCategory) {
        return false;
      }
      // Era
      if (selectedEra === 'anos60' && (v.year < 1960 || v.year > 1969)) return false;
      if (selectedEra === 'anos70' && (v.year < 1970 || v.year > 1979)) return false;
      if (selectedEra === 'anos80' && (v.year < 1980 || v.year > 1989)) return false;
      if (selectedEra === 'pre-guerra' && v.year >= 1960) return false;
      return true;
    });
  }, [vehicles, selectedEra, selectedCategory]);

  // ----------------------------------------------------
  // 3. Em Alta (Tendências)
  // ----------------------------------------------------
  // Most interacted/curated vehicles
  const trendingVehicles = useMemo(() => {
    // Sort prioritizing plateType 'preta', high horsepower, and photos richness
    return [...filteredVehicles].sort((a, b) => {
      const scoreA = (a.plateType === 'preta' ? 50 : 0) + (a.photos?.length || 0) * 10 + (a.horsepower || 100);
      const scoreB = (b.plateType === 'preta' ? 50 : 0) + (b.photos?.length || 0) * 10 + (b.horsepower || 100);
      return scoreB - scoreA;
    });
  }, [filteredVehicles]);

  // ----------------------------------------------------
  // 4. Recomendado para Você (Baseado nos Interesses & Garagem)
  // ----------------------------------------------------
  const userGarageBrands = useMemo(() => {
    const userCars = vehicles.filter(v => v.ownerId === currentUser.id);
    return userCars.map(c => c.brand.toLowerCase());
  }, [vehicles, currentUser.id]);

  const userGarageModels = useMemo(() => {
    return vehicles
      .filter(v => v.ownerId === currentUser.id)
      .map(v => v.model.toLowerCase());
  }, [vehicles, currentUser.id]);

  const recommendedVehicles = useMemo(() => {
    // Exclude current user's own cars and prioritize matching brand or era affinity
    const othersVehicles = filteredVehicles.filter(v => v.ownerId !== currentUser.id);
    if (othersVehicles.length === 0) return filteredVehicles;

    const scoreVehicle = (vehicle: Vehicle) => {
      const brandMatch = userGarageBrands.some(brand => vehicle.brand.toLowerCase().includes(brand)) ? 100 : 0;
      const modelMatch = userGarageModels.some(model => vehicle.model.toLowerCase().includes(model)) ? 140 : 0;
      const eraMatch = vehicles.some(
        ownVehicle => ownVehicle.ownerId === currentUser.id && Math.abs(ownVehicle.year - vehicle.year) <= 5
      ) ? 25 : 0;
      const richness = Math.min((vehicle.photos?.length || 0) * 5, 20);
      return brandMatch + modelMatch + eraMatch + richness;
    };

    return [...othersVehicles].sort((a, b) => scoreVehicle(b) - scoreVehicle(a));
  }, [filteredVehicles, vehicles, currentUser.id, userGarageBrands, userGarageModels]);

  const recommendationRationale = useMemo(() => {
    if (userGarageBrands.includes('ford') || userGarageBrands.includes('dodge')) {
      return 'Recomendado com base no seu gosto por motores V8 e Muscle Cars da sua garagem';
    }
    if (userGarageBrands.includes('volkswagen') || userGarageBrands.includes('porsche')) {
      return 'Recomendado com base no seu interesse por clássicos refrigerados a ar (Aircooled)';
    }
    return 'Recomendado com base nos modelos de época da sua coleção e histórico';
  }, [userGarageBrands]);

  // ----------------------------------------------------
  // 5. Grupos Sugeridos para Conhecer
  // ----------------------------------------------------
  const suggestedGroups = useMemo(() => {
    // Prioritize groups the user is not a member of yet
    return [...groups].sort((a, b) => {
      if (a.isMember === b.isMember) return b.memberCount - a.memberCount;
      return a.isMember ? 1 : -1;
    });
  }, [groups]);

  // ----------------------------------------------------
  // 6. Eventos Próximos
  // ----------------------------------------------------
  const upcomingEvents = useMemo(() => {
    return [...events].slice(0, 6);
  }, [events]);

  // ----------------------------------------------------
  // 7. Pessoas para Seguir (Colecionadores)
  // ----------------------------------------------------
  const suggestedPeople = useMemo(() => {
    return users.filter(u => u.id !== currentUser.id);
  }, [users, currentUser.id]);

  // ----------------------------------------------------
  // 8. Achados do Marketplace (Curadoria)
  // ----------------------------------------------------
  const featuredListings = useMemo(() => {
    return listings.slice(0, 5);
  }, [listings]);

  // ----------------------------------------------------
  // 9. Tags Populares
  // ----------------------------------------------------
  const popularTags = [
    { label: '#opala', count: '142 posts', badge: 'Popular' },
    { label: '#v8', count: '98 posts', badge: 'Hot' },
    { label: '#mustang', count: '76 posts', badge: undefined },
    { label: '#placapreta', count: '210 posts', badge: 'Oficial' },
    { label: '#aircooled', count: '89 posts', badge: 'Clássico' },
    { label: '#trackday', count: '54 posts', badge: undefined },
    { label: '#restauracao', count: '128 posts', badge: 'Mão na Massa' },
    { label: '#matchingnumbers', count: '45 posts', badge: 'Raridade' },
    { label: '#dodgecharger', count: '63 posts', badge: undefined },
    { label: '#porsche911', count: '82 posts', badge: undefined },
    { label: '#youngtimers', count: '67 posts', badge: 'Anos 80/90' },
    { label: '#passeiohistorico', count: '51 posts', badge: undefined },
  ];

  // =========================================================================
  // VIEW ALL SUB-VIEW (When user clicks "Ver tudo" on any section)
  // =========================================================================
  if (viewAllCategory !== null) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Return Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewAllCategory(null)}
              className="p-2 rounded-xl bg-[#263628] hover:bg-[#324835] text-[#F3E5AB] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all cursor-pointer shadow-sm"
              title="Voltar ao Hub Explorar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                  Hub Explorar • Visualização Completa
                </span>
              </div>
              <h2 className="font-serif-heading text-lg sm:text-xl font-bold text-[#F3E5AB]">
                {viewAllCategory === 'trending_vehicles' && '🔥 Todos os Veículos em Alta'}
                {viewAllCategory === 'recommended_vehicles' && '⭐ Todos os Veículos Recomendados'}
                {viewAllCategory === 'groups' && '👥 Todas as Comunidades & Grupos'}
                {viewAllCategory === 'events' && '📅 Todos os Próximos Eventos & Encontros'}
                {viewAllCategory === 'people' && '🏎️ Colecionadores para Seguir'}
                {viewAllCategory === 'marketplace' && '🛍️ Achados e Oportunidades do Marketplace'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewAllCategory(null)}
              className="px-3.5 py-1.5 rounded-xl bg-[#263628] hover:bg-[#344837] text-xs font-semibold text-[#D4AF37] border border-[#3B4D3A] transition-all cursor-pointer"
            >
              Voltar ao Início do Explorar
            </button>
          </div>
        </div>

        {/* View All Content based on category */}
        {viewAllCategory === 'trending_vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={onSelectVehicle}
                onEdit={vehicle.ownerId === currentUser.id ? onOpenEditVehicle : undefined}
                onViewOwnerProfile={onViewUserProfile}
              />
            ))}
          </div>
        )}

        {viewAllCategory === 'recommended_vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={onSelectVehicle}
                onEdit={vehicle.ownerId === currentUser.id ? onOpenEditVehicle : undefined}
                onViewOwnerProfile={onViewUserProfile}
              />
            ))}
          </div>
        )}

        {viewAllCategory === 'groups' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onSelect={onSelectGroup}
                onToggleJoin={onToggleJoinGroup}
                isAutoSuggested={true}
              />
            ))}
          </div>
        )}

        {viewAllCategory === 'events' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={onSelectEvent}
                onToggleRegister={onToggleRegisterEvent}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

        {viewAllCategory === 'people' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestedPeople.map(person => {
              const isFriend = friendsUserIds.includes(person.id);
              const personCar = vehicles.find(v => v.ownerId === person.id);
              return (
                <div
                  key={person.id}
                  onClick={() => onViewUserProfile(person)}
                  className="group bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]/60 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-sm text-[#F3E5AB] truncate">
                          {person.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-[#8EA290]">{person.handle}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#263628] text-[#D4AF37] text-[10px] font-semibold border border-[#3B4D3A]">
                        {person.collectorTier}
                      </span>
                    </div>
                  </div>

                  {person.specialty && (
                    <p className="mt-3 text-xs text-[#E8ECE8]/80 line-clamp-2 bg-[#121713]/60 p-2 rounded-xl border border-[#3B4D3A]/30">
                      {person.specialty}
                    </p>
                  )}

                  {personCar && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#8EA290]">
                      <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="truncate">Garagem: {personCar.brand} {personCar.model} ({personCar.year})</span>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between">
                    <span className="text-[11px] text-[#8EA290] font-mono">
                      {person.garageCount} {person.garageCount === 1 ? 'veículo' : 'veículos'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFriend(person);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                        isFriend
                          ? 'bg-[#263628] text-[#8EA290] border border-[#3B4D3A] hover:border-[#D4AF37]'
                          : 'bg-[#C9A227] hover:bg-[#E5C158] text-[#121713]'
                      }`}
                    >
                      {isFriend ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Conectado</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Seguir Colecionador</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewAllCategory === 'marketplace' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(listing => (
              <MarketplaceCard
                key={listing.id}
                listing={listing}
                onSelect={onSelectListing}
                onToggleSave={onToggleSaveListing}
                onViewSellerProfile={onViewUserProfile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN EXPLORE HUB LAYOUT
  // =========================================================================
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ----------------------------------------------------
          SECTION 1: [ EM ALTA ] (TENDÊNCIAS)
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Em Alta na Comunidade
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                Tendências
              </span>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              Veículos com maior número de curtidas, comentários e admiração nos últimos 7 dias.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(trendingCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(trendingCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setViewAllCategory('trending_vehicles')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver tudo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={trendingCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {trendingVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="w-[285px] sm:w-[320px] shrink-0 snap-start"
            >
              <VehicleCard
                vehicle={vehicle}
                onSelect={onSelectVehicle}
                onEdit={vehicle.ownerId === currentUser.id ? onOpenEditVehicle : undefined}
                onViewOwnerProfile={onViewUserProfile}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 2: [ DESTAQUE DA SEMANA ] (CARD GRANDE HERO)
      ----------------------------------------------------- */}
      {featuredVehicle && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
              Curadoria Editorial Garage 95
            </span>
          </div>

          <div
            onClick={() => onSelectVehicle(featuredVehicle)}
            className="group relative rounded-3xl bg-[#18221A] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Big Photo Section */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] bg-[#121613] overflow-hidden">
                <img
                  src={featuredVehicle.coverPhoto}
                  alt={`${featuredVehicle.brand} ${featuredVehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#18221A]" />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  <div className="px-3 py-1 rounded-xl bg-[#C9A227] text-[#121713] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-[#121713]" />
                    <span>Destaque da Semana</span>
                  </div>
                  {featuredVehicle.plateType === 'preta' && (
                    <div className="px-2.5 py-1 rounded-xl bg-black text-[#F3E5AB] text-xs font-mono font-bold border border-[#D4AF37]/60 shadow-lg">
                      PLACA PRETA • COLEÇÃO
                    </div>
                  )}
                </div>

                {/* Engine Sound Preview Button */}
                {featuredVehicle.soundAudioUrl && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSound(featuredVehicle.soundAudioUrl, featuredVehicle.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xl transition-all cursor-pointer ${
                        activeAudioId === featuredVehicle.id
                          ? 'bg-[#D4AF37] text-[#121713] animate-pulse'
                          : 'bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/50'
                      }`}
                    >
                      {activeAudioId === featuredVehicle.id ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Pausar Ronco V8</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                          <span>Ouvir Ronco do Motor</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Details and Story Section */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  {/* Owner Header */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      const ownerUser = users.find(u => u.id === featuredVehicle.ownerId);
                      if (ownerUser) onViewUserProfile(ownerUser);
                    }}
                    className="flex items-center gap-3 group/owner mb-4 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={featuredVehicle.ownerAvatar}
                      alt={featuredVehicle.ownerName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37]"
                    />
                    <div>
                      <p className="text-[11px] text-[#8EA290] font-mono">Curadoria & Propriedade de</p>
                      <h4 className="text-sm font-bold text-[#F3E5AB] group-hover/owner:text-[#D4AF37]">
                        {featuredVehicle.ownerName}
                      </h4>
                    </div>
                  </div>

                  {/* Title & Specs */}
                  <h3 className="font-serif-heading font-black text-2xl sm:text-3xl text-[#F3E5AB] leading-tight group-hover:text-[#D4AF37] transition-colors">
                    {featuredVehicle.brand} {featuredVehicle.model}
                  </h3>
                  <p className="text-xs font-mono text-[#D4AF37] mt-1 font-bold">
                    Ano {featuredVehicle.year} • {featuredVehicle.color}
                  </p>

                  {/* Historical Curiosity or Restoration Highlight */}
                  <p className="mt-4 text-xs sm:text-sm text-[#E8ECE8]/90 leading-relaxed line-clamp-4 bg-[#121713]/60 p-3.5 rounded-2xl border border-[#3B4D3A]/40">
                    {featuredVehicle.historicalCuriosity || featuredVehicle.restorationHistory || 'Um dos exemplares mais bem preservados da cultura clássica, com restauração premiada e especificações de fábrica rigorosamente preservadas.'}
                  </p>

                  {/* Quick Technical Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-[#263628]/60 border border-[#3B4D3A]/50">
                      <span className="text-[10px] text-[#8EA290] block font-mono">Motorização</span>
                      <span className="text-xs font-bold text-[#F3E5AB] truncate block">
                        {featuredVehicle.engine || 'V8 Clássico'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#263628]/60 border border-[#3B4D3A]/50">
                      <span className="text-[10px] text-[#8EA290] block font-mono">Potência</span>
                      <span className="text-xs font-bold text-[#D4AF37] truncate block">
                        {featuredVehicle.horsepower ? `${featuredVehicle.horsepower} cv` : '335 cv'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-4 border-t border-[#3B4D3A]/40 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-[#8EA290]">
                    Acervo Oficial Garage 95
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVehicle(featuredVehicle);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span>Inspecionar Veículo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
          SECTION 3: [ RECOMENDADO PARA VOCÊ ]
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Recomendado para Você
              </h2>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              {recommendationRationale}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setViewAllCategory('recommended_vehicles')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver tudo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={recommendedCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
        >
          {recommendedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="w-[285px] sm:w-[320px] shrink-0 snap-start"
            >
              <VehicleCard
                vehicle={vehicle}
                onSelect={onSelectVehicle}
                onEdit={vehicle.ownerId === currentUser.id ? onOpenEditVehicle : undefined}
                onViewOwnerProfile={onViewUserProfile}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 4: [ GRUPOS PARA CONHECER ]
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Comunidades para Conhecer
              </h2>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              Grupos sugeridos com base nos modelos e marcas da sua garagem.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(groupsCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(groupsCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onNavigateToTab('groups')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver todos os grupos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={groupsCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
        >
          {suggestedGroups.map((group) => (
            <div
              key={group.id}
              className="w-[285px] sm:w-[320px] shrink-0 snap-start"
            >
              <GroupCard
                group={group}
                onSelect={onSelectGroup}
                onToggleJoin={onToggleJoinGroup}
                isAutoSuggested={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 5: [ EVENTOS PRÓXIMOS ]
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Eventos & Encontros Próximos
              </h2>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              Concursos d'Elegance, ralis de regularidade e encontros de época confirmados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(eventsCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(eventsCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onNavigateToTab('events')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver calendário completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={eventsCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
        >
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="w-[290px] sm:w-[330px] shrink-0 snap-start"
            >
              <EventCard
                event={event}
                onSelect={onSelectEvent}
                onToggleRegister={onToggleRegisterEvent}
                currentUser={currentUser}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 6: [ PESSOAS PARA SEGUIR ]
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Colecionadores para Seguir
              </h2>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              Entusiastas e mestres restauradores com garagens afins à sua.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(peopleCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(peopleCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setViewAllCategory('people')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={peopleCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
        >
          {suggestedPeople.map((person) => {
            const isFriend = friendsUserIds.includes(person.id);
            const personCar = vehicles.find(v => v.ownerId === person.id);
            return (
              <div
                key={person.id}
                onClick={() => onViewUserProfile(person)}
                className="w-[270px] sm:w-[290px] shrink-0 snap-start group bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-[#D4AF37]/60 shadow-md group-hover:border-[#D4AF37] transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-serif font-bold text-sm text-[#F3E5AB] truncate group-hover:text-[#D4AF37] transition-colors">
                          {person.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-[#8EA290]">{person.handle}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#263628] text-[#D4AF37] text-[10px] font-semibold border border-[#3B4D3A]">
                        {person.collectorTier}
                      </span>
                    </div>
                  </div>

                  {person.specialty && (
                    <p className="mt-3 text-[11px] text-[#E8ECE8]/80 line-clamp-2 bg-[#121713]/60 p-2 rounded-xl border border-[#3B4D3A]/30">
                      {person.specialty}
                    </p>
                  )}

                  {personCar && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#8EA290]">
                      <Car className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{personCar.brand} {personCar.model} ({personCar.year})</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between">
                  <span className="text-[11px] text-[#8EA290] font-mono">
                    {person.garageCount} {person.garageCount === 1 ? 'máquina' : 'máquinas'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFriend(person);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      isFriend
                        ? 'bg-[#263628] text-[#8EA290] border border-[#3B4D3A] hover:border-[#D4AF37]'
                        : 'bg-[#C9A227] hover:bg-[#E5C158] text-[#121713]'
                    }`}
                  >
                    {isFriend ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Conectado</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Seguir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 7: [ ACHADOS DO MARKETPLACE ]
      ----------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <h2 className="font-serif-heading font-black text-xl text-[#F3E5AB]">
                Achados do Marketplace
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                Oportunidades
              </span>
            </div>
            <p className="text-xs text-[#8EA290] mt-1">
              Curadoria seleta de peças raras, memorabilia e clássicos disponíveis para negociação.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel(marketplaceCarouselRef, 'left')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar esquerda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel(marketplaceCarouselRef, 'right')}
                className="p-2 rounded-xl bg-[#18221A] hover:bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]/70 transition-all cursor-pointer"
                title="Rolar direita"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onNavigateToTab('marketplace')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span>Ver todo o Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={marketplaceCarouselRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar"
        >
          {featuredListings.map((listing) => (
            <div
              key={listing.id}
              className="w-[285px] sm:w-[320px] shrink-0 snap-start"
            >
              <MarketplaceCard
                listing={listing}
                onSelect={onSelectListing}
                onToggleSave={onToggleSaveListing}
                onViewSellerProfile={onViewUserProfile}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 8: [ EXPLORAR POR TAGS & TEMAS ]
      ----------------------------------------------------- */}
      <section className="p-6 rounded-3xl bg-[#18221A] border border-[#3B4D3A]/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                Explorar por Temas & Hashtags Populares
              </h3>
            </div>
            <p className="text-xs text-[#8EA290] mt-0.5">
              Clique em qualquer tag para buscar publicações, carros e discussões relacionadas na comunidade.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {popularTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => onTagClick(tag.label)}
              className="group px-3.5 py-2 rounded-2xl bg-[#263628] hover:bg-[#344837] text-xs font-semibold text-[#E8ECE8] hover:text-[#F3E5AB] border border-[#3B4D3A] hover:border-[#D4AF37] flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              <span className="text-[#D4AF37] font-bold group-hover:scale-110 transition-transform">
                {tag.label}
              </span>
              <span className="text-[10px] text-[#8EA290] font-mono">
                {tag.count}
              </span>
              {tag.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#18221A] text-[#D4AF37] border border-[#D4AF37]/30">
                  {tag.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
