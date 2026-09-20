import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Trophy, 
  Layers,
  Edit3
} from 'lucide-react';
import { Vehicle } from '../types';
import { engineSound } from '../utils/engineSound';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onViewOwnerProfile?: (owner: { id: string; name: string; avatar: string; handle?: string }) => void;
  isCompact?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onSelect, 
  onEdit,
  onViewOwnerProfile,
  isCompact = false 
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      engineSound.stop();
      setIsPlayingAudio(false);
    } else {
      let profile: 'v8_rumble' | 'flat6_scream' | 'mopar_growl' | 'v12_symphony' | 'inline6_f1' | 'classic_rev' = 'classic_rev';
      const engineLower = (vehicle.engine || '').toLowerCase();
      const modelLower = (vehicle.model || '').toLowerCase();

      if (engineLower.includes('v8') || modelLower.includes('mustang') || modelLower.includes('charger') || modelLower.includes('opala ss')) {
        profile = engineLower.includes('mopar') || modelLower.includes('charger') ? 'mopar_growl' : 'v8_rumble';
      } else if (engineLower.includes('boxer') || engineLower.includes('flat-6') || modelLower.includes('porsche') || modelLower.includes('sp2')) {
        profile = 'flat6_scream';
      } else if (engineLower.includes('flat-12') || engineLower.includes('v12') || modelLower.includes('testarossa')) {
        profile = 'v12_symphony';
      } else if (engineLower.includes('6 cilindros') || modelLower.includes('cbx')) {
        profile = 'inline6_f1';
      }

      setIsPlayingAudio(true);
      engineSound.playEngineProfile(profile, 3.5);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 3500);
    }
  };

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group relative bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col cursor-pointer"
      id={`vehicle-card-${vehicle.id}`}
    >
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#121613]">
        <img
          src={vehicle.coverPhoto}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-transparent to-black/40" />

        {/* Audio Engine Rev Trigger & Edit Trigger */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(vehicle);
              }}
              title="Editar veículo, fotos e ficha técnica"
              className="p-2 rounded-full backdrop-blur-md border bg-[#151D16]/90 text-[#F3E5AB] border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-[#121713] hover:scale-105 transition-all cursor-pointer shadow-md"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handlePlaySound}
            title={isPlayingAudio ? 'Parar ronco do motor' : 'Ouvir ronco do motor clássico'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              isPlayingAudio 
                ? 'bg-[#C9A227] text-[#121713] border-[#F3E5AB] scale-110 shadow-[0_0_12px_rgba(201,162,39,0.8)]' 
                : 'bg-[#151D16]/80 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#C9A227] hover:text-[#121713]'
            }`}
          >
            {isPlayingAudio ? (
              <VolumeX className="w-4 h-4 animate-bounce" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Year Pill & Photo Count */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-[#18221A]/80 backdrop-blur-md text-[#D4AF37] text-xs font-mono font-bold border border-[#D4AF37]/30">
            {vehicle.year}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#A2B3A4] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <Layers className="w-3 h-3 text-[#D4AF37]" />
            {vehicle.photos.length} fotos
          </span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#D4AF37]">
              {vehicle.brand}
            </p>
            {vehicle.valuationEstimate && (
              <span className="text-[11px] font-mono text-[#A2B3A4]">
                Est. {vehicle.valuationEstimate}
              </span>
            )}
          </div>

          <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {vehicle.model}
          </h3>

          <p className="text-xs text-[#8EA290] mt-1 line-clamp-1 font-mono-spec">
            {vehicle.engine || 'Motor Clássico Aspirado'}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="mt-3 pt-3 border-t border-[#3B4D3A]/40 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#141C15] p-1.5 rounded-lg border border-[#3B4D3A]/30">
            <p className="text-[10px] text-[#7E9180]">Potência</p>
            <p className="font-bold text-[#E8ECE8] font-mono">{vehicle.horsepower ? `${vehicle.horsepower} cv` : 'N/D'}</p>
          </div>
          <div className="bg-[#141C15] p-1.5 rounded-lg border border-[#3B4D3A]/30">
            <p className="text-[10px] text-[#7E9180]">Câmbio</p>
            <p className="font-semibold text-[#E8ECE8] truncate text-[11px]">
              {vehicle.transmission ? vehicle.transmission.split(' ')[0] : 'Manual'}
            </p>
          </div>
          <div className="bg-[#141C15] p-1.5 rounded-lg border border-[#3B4D3A]/30">
            <p className="text-[10px] text-[#7E9180]">Hodômetro</p>
            <p className="font-bold text-[#D4AF37] font-mono">
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/D'}
            </p>
          </div>
        </div>

        {/* Trophies & Owner Footnote */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#8EA290]">
          <div 
            onClick={(e) => {
              if (onViewOwnerProfile) {
                e.stopPropagation();
                onViewOwnerProfile({
                  id: vehicle.ownerId,
                  name: vehicle.ownerName,
                  avatar: vehicle.ownerAvatar
                });
              }
            }}
            className={`flex items-center gap-1.5 ${onViewOwnerProfile ? 'cursor-pointer hover:text-[#F3E5AB] group/owner' : ''}`}
            title={`Ver perfil de ${vehicle.ownerName}`}
          >
            <img
              src={vehicle.ownerAvatar}
              alt={vehicle.ownerName}
              className="w-4 h-4 rounded-full object-cover border border-[#D4AF37]/50 group-hover/owner:border-[#D4AF37]"
            />
            <span className="truncate max-w-[120px] group-hover/owner:underline">{vehicle.ownerName}</span>
          </div>

          {vehicle.trophies && vehicle.trophies.length > 0 && (
            <div className="flex items-center gap-1 text-[#E5C158]" title={vehicle.trophies[0]}>
              <Trophy className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-semibold">{vehicle.trophies.length} troféu{vehicle.trophies.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {onEdit && (
          <div className="mt-3 pt-2.5 border-t border-[#3B4D3A]/40 flex items-center justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(vehicle);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-semibold border border-[#D4AF37]/40 hover:border-[#D4AF37] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Editar perfil do veículo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
