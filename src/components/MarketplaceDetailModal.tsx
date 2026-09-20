import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  DollarSign, 
  FileCheck, 
  Truck, 
  Sparkles, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Send,
  AlertCircle,
  Video,
  Layers,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarketplaceListing, User, PostMedia } from '../types';
import { MediaLightboxModal } from './MediaLightboxModal';

interface MarketplaceDetailModalProps {
  listing: MarketplaceListing | null;
  onClose: () => void;
  onStartChat: (seller: User, listingContext?: { id: string; title: string; price: number; image: string }, initialOffer?: number) => void;
  onViewSellerProfile?: (seller: User) => void;
  currentUser: User;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  listing,
  onClose,
  onStartChat,
  onViewSellerProfile,
  currentUser
}) => {
  if (!listing) return null;

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [offerInput, setOfferInput] = useState<string>('');
  const [showOfferForm, setShowOfferForm] = useState(false);

  // Normalize media items: use listing.media if present, or create from listing.photos
  const mediaItems: PostMedia[] = React.useMemo(() => {
    if (listing.media && listing.media.length > 0) {
      return listing.media;
    }
    if (listing.photos && listing.photos.length > 0) {
      return listing.photos.map((url, idx) => ({
        type: url.includes('.mp4') || url.includes('video') ? 'video' : 'image',
        url,
        caption: `Foto ${idx + 1}`
      }));
    }
    return [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80',
        caption: 'Foto Principal'
      }
    ];
  }, [listing]);

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(offerInput);
    if (!amount || amount <= 0) return;

    onStartChat(listing.seller, {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      image: mediaItems[0]?.url || listing.photos?.[0] || ''
    }, amount);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#C9A227', '#F3E5AB']
      });
    } catch {}

    onClose();
  };

  const modalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveMediaIndex(0);
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [listing]);

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 py-4 sm:py-8 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-2 sm:my-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/20 transition-colors cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Carousel (Supports up to 20 Photos and Videos) */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-72 sm:h-96 md:h-[420px] w-full bg-black flex items-center justify-center overflow-hidden group cursor-pointer"
          title="Clique para ampliar foto ou vídeo em alta resolução"
        >
          {currentMedia.type === 'video' || currentMedia.url.includes('.mp4') ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                key={`listing-video-${activeMediaIndex}-${currentMedia.url}`}
                src={currentMedia.url}
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                <div className="p-3.5 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37] text-[#D4AF37] group-hover:scale-110 transition-transform shadow-2xl">
                  <Maximize2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          ) : (
            <img
              key={`listing-img-${activeMediaIndex}-${currentMedia.url}`}
              src={currentMedia.url}
              alt={currentMedia.caption || listing.title}
              className="w-full h-full object-cover sm:object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172018] via-transparent to-black/30 pointer-events-none" />

          {/* Media Count Badge & Zoom Button */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            {mediaItems.length > 1 && (
              <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F3E5AB] flex items-center gap-1.5 shadow-xl">
                <span className="text-[#D4AF37]">
                  {currentMedia.type === 'video' ? '🎥' : '📷'}
                </span>
                <span>{activeMediaIndex + 1} / {mediaItems.length}</span>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
              title="Ampliar mídia em tela cheia"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ampliar</span>
            </button>
          </div>

          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/40 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10"
                title="Mídia anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/40 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10"
                title="Próxima mídia"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Badges on Bottom of Image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 bg-[#101411]/90 border border-[#D4AF37] rounded-lg text-[#F3E5AB] text-xs font-bold font-mono shadow-md">
              {listing.condition}
            </span>
            {listing.certificateIncluded && (
              <span className="px-3 py-1 bg-[#263628]/90 border border-[#3B4D3A] rounded-lg text-[#E5C158] text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <FileCheck className="w-3.5 h-3.5" />
                Certificado FIVA / Placa Preta
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Ribbon for Carousel */}
        {mediaItems.length > 1 && (
          <div className="px-6 pt-3 pb-1 bg-[#121713] border-b border-[#3B4D3A]/50">
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar items-center">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    activeMediaIndex === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105 opacity-100'
                      : 'border-[#3B4D3A] opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-[#1A241C] flex items-center justify-center">
                      <Video className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white bg-black/70 px-1 rounded">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Details & Specs */}
            <div className="lg:col-span-2 space-y-4">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] mb-1">
                  <span>{listing.brand}</span>
                  {listing.year && <span>• Ano {listing.year}</span>}
                  <span>• {listing.category.toUpperCase()}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif-heading font-black text-[#F3E5AB]">
                  {listing.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#8EA290] mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {listing.location}
                  </span>
                  <span>• {listing.views} visualizações</span>
                  <span>• {listing.savesCount} interessados</span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="p-4 rounded-xl bg-[#141C15] border border-[#D4AF37]/40 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#7E9180]">Valor solicitado</p>
                  <p className="text-2xl font-serif font-black text-[#F3E5AB]">
                    R$ {listing.price.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-[#263628] text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30">
                    Negociação Segura
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                  Descrição & Histórico do Item
                </h4>
                <p className="text-xs sm:text-sm text-[#D1DCD2] leading-relaxed whitespace-pre-line bg-[#141C15] p-4 rounded-xl border border-[#3B4D3A]/30">
                  {listing.description}
                </p>
              </div>

              {/* Specs Summary Grid */}
              {listing.specsSummary && (
                <div>
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                    Ficha Técnica Resumida
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {Object.entries(listing.specsSummary).map(([key, val], idx) => (
                      <div key={idx} className="bg-[#141C15] p-2.5 rounded-lg border border-[#3B4D3A]/40">
                        <p className="text-[10px] text-[#7E9180]">{key}</p>
                        <p className="font-semibold text-[#E8ECE8] mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Seller Card & Direct Chat/Offer */}
            <div className="space-y-4">
              
              {/* Seller Profile Box */}
              <div className="bg-[#141C15] p-4 rounded-2xl border border-[#3B4D3A]/50 space-y-3">
                <h4 className="font-serif font-bold text-xs text-[#D4AF37] uppercase tracking-wider">
                  Vendedor & Colecionador
                </h4>

                <div 
                  onClick={() => {
                    if (onViewSellerProfile) {
                      onClose();
                      onViewSellerProfile(listing.seller);
                    }
                  }}
                  className={`flex items-center gap-3 p-1.5 -m-1.5 rounded-xl transition-all ${
                    onViewSellerProfile ? 'cursor-pointer hover:bg-[#1E2A1F] group' : ''
                  }`}
                  title="Ver perfil completo do vendedor"
                >
                  <img
                    src={listing.seller?.avatar || ''}
                    alt={listing.seller?.name || ''}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] group-hover:scale-105 group-hover:border-[#F3E5AB] transition-all"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors">{listing.seller?.name}</h5>
                    <p className="text-[11px] text-[#D4AF37]">{listing.seller?.location}</p>
                    {onViewSellerProfile && (
                      <span className="text-[10px] text-[#D4AF37] underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Perfil
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3B4D3A]/30 text-center text-xs">
                  <div className="bg-[#1A241C] p-2 rounded-lg">
                    <p className="font-bold text-[#D4AF37]">{listing.seller.garageCount || 1}</p>
                    <p className="text-[10px] text-[#8EA290]">Veículos na Garagem</p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                {listing.seller.id !== currentUser.id && (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onStartChat(listing.seller, {
                          id: listing.id,
                          title: listing.title,
                          price: listing.price,
                          image: mediaItems[0]?.url || listing.photos?.[0] || ''
                        });
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Conversar com o Vendedor</span>
                    </button>

                    <button
                      onClick={() => setShowOfferForm(!showOfferForm)}
                      className="w-full py-2 px-3 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-semibold border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                      <span>Fazer Proposta de Compra</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Offer Form Panel */}
              {showOfferForm && (
                <form onSubmit={handleSendOffer} className="bg-[#1C271E] p-4 rounded-2xl border border-[#D4AF37] space-y-3 animate-in fade-in duration-150">
                  <h5 className="font-serif font-bold text-xs text-[#F3E5AB]">
                    Enviar Proposta Direta
                  </h5>
                  <p className="text-[11px] text-[#8EA290]">
                    Digite o valor da sua oferta em R$ para envio imediato ao chat privado do vendedor.
                  </p>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-[#D4AF37]">
                      R$
                    </span>
                    <input
                      type="number"
                      required
                      min={1000}
                      placeholder={(listing.price * 0.9).toFixed(0)}
                      value={offerInput}
                      onChange={(e) => setOfferInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] text-[#121713] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Oferta Oficial</span>
                  </button>
                </form>
              )}

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-[#141C15] border border-[#3B4D3A]/40 text-[11px] text-[#8EA290] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Recomendamos vistoria presencial ou laudo de originalidade FIVA antes de transações financeiras.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Media Zoom Lightbox Modal */}
      {isLightboxOpen && mediaItems.length > 0 && (
        <MediaLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          media={mediaItems}
          initialIndex={activeMediaIndex}
          title={listing.title}
        />
      )}
    </div>
  );
};
