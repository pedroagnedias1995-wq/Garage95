import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Bookmark, 
  Heart,
  MessageSquare,
  Truck,
  FileCheck
} from 'lucide-react';
import { MarketplaceListing } from '../types';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  onSelect: (listing: MarketplaceListing) => void;
  onToggleSave: (listingId: string) => void;
  onViewSellerProfile?: (seller: MarketplaceListing['seller']) => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  listing,
  onSelect,
  onToggleSave,
  onViewSellerProfile
}) => {
  return (
    <div
      onClick={() => onSelect(listing)}
      id={`mkt-card-${listing.id}`}
      className="group bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#121613]">
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-transparent to-black/40" />

        {/* Category & Featured Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-[#101411]/90 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/50 shadow-sm">
            {listing.category === 'veiculo' ? 'Veículo' : listing.category === 'peca' ? 'Peça Rara' : 'Acessório'}
          </span>
          {listing.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-[#C9A227] text-[#121713] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Destaque
            </span>
          )}
        </div>

        {/* Save Bookmark Button & Media Count */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {((listing.media && listing.media.length > 1) || (listing.photos && listing.photos.length > 1)) && (
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#F3E5AB] border border-[#D4AF37]/40 shadow-sm flex items-center gap-1">
              <span>📷</span>
              <span>{listing.media?.length || listing.photos?.length}</span>
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(listing.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              listing.isSaved 
                ? 'bg-[#C9A227] text-[#121713] border-[#F3E5AB]' 
                : 'bg-black/50 text-[#E8ECE8] border-white/20 hover:text-[#D4AF37]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${listing.isSaved ? 'fill-[#121713]' : ''}`} />
          </button>
        </div>

        {/* Condition Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-[#151D16]/90 backdrop-blur-xs text-[10px] text-[#A2B3A4] border border-[#3B4D3A]">
            {listing.condition}
          </span>
          {listing.certificateIncluded && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#E5C158] bg-[#141C15]/90 px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
              <FileCheck className="w-3 h-3" />
              Certificado
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">
              {listing.brand} {listing.year ? `• ${listing.year}` : ''}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#8EA290]">
              <MapPin className="w-3 h-3" />
              {listing.location.split(',')[0]}
            </span>
          </div>

          <h3 className="font-serif-heading font-bold text-sm text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          <p className="text-xs text-[#8EA290] mt-1.5 line-clamp-2">
            {listing.description}
          </p>
        </div>

        {/* Price & Seller */}
        <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#7E9180]">Preço anunciado</p>
            <p className="text-base font-serif font-black text-[#F3E5AB]">
              {listing.currency === 'BRL' ? 'R$ ' : '$ '}
              {listing.price.toLocaleString('pt-BR')}
            </p>
          </div>

          <div 
            onClick={(e) => {
              if (onViewSellerProfile) {
                e.stopPropagation();
                onViewSellerProfile(listing.seller);
              }
            }}
            className={`flex items-center gap-2 text-right ${onViewSellerProfile ? 'cursor-pointer hover:opacity-90 group/seller' : ''}`}
            title={`Ver perfil de ${listing.seller.name}`}
          >
            <div>
              <p className="text-xs font-semibold text-[#E8ECE8] group-hover/seller:text-[#F3E5AB] group-hover/seller:underline transition-colors">{listing.seller.name.split(' ')[0]}</p>
              <p className="text-[10px] text-[#D4AF37]">{listing.seller.reputationScore}% Reputação</p>
            </div>
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/50 group-hover/seller:border-[#D4AF37] group-hover/seller:scale-105 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
