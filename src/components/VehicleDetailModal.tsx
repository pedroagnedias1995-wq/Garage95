import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Award, 
  Gauge, 
  Wrench, 
  ShieldCheck, 
  Calendar, 
  Trophy, 
  Share2, 
  MessageSquare, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Edit3,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import { Vehicle, User, PostMedia } from '../types';
import { engineSound } from '../utils/engineSound';
import { MediaLightboxModal } from './MediaLightboxModal';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onContactOwner: (owner: { id: string; name: string; avatar: string }) => void;
  onViewOwnerProfile?: (owner: { id: string; name: string; avatar: string; handle?: string }) => void;
  onEditVehicle?: (vehicle: Vehicle) => void;
  currentUser: User;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onContactOwner,
  onViewOwnerProfile,
  onEditVehicle,
  currentUser
}) => {
  if (!vehicle) return null;

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'mods' | 'trophies'>('specs');

  const handlePlaySound = () => {
    if (isPlayingAudio) {
      engineSound.stop();
      setIsPlayingAudio(false);
    } else {
      let profile: 'v8_rumble' | 'flat6_scream' | 'mopar_growl' | 'v12_symphony' | 'inline6_f1' | 'classic_rev' = 'classic_rev';
      const engineLower = vehicle.engine.toLowerCase();
      const modelLower = vehicle.model.toLowerCase();

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
      engineSound.playEngineProfile(profile, 4.0);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length);
  };

  const modalContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [vehicle]);

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 py-4 sm:py-8 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-2 sm:my-4">
        
        {/* Header Close & Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {onEditVehicle && vehicle.ownerId === currentUser.id && (
            <button
              onClick={() => {
                onClose();
                onEditVehicle(vehicle);
              }}
              className="px-3.5 py-2 rounded-full backdrop-blur-md border bg-[#151D16]/90 hover:bg-[#263628] text-[#F3E5AB] border-[#D4AF37]/60 hover:border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              title="Editar este veículo"
            >
              <Edit3 className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Editar Veículo</span>
            </button>
          )}

          <button
            onClick={handlePlaySound}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              isPlayingAudio 
                ? 'bg-[#C9A227] text-[#121713] border-[#F3E5AB] scale-110 shadow-[0_0_15px_rgba(201,162,39,0.8)]' 
                : 'bg-[#151D16]/80 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#C9A227] hover:text-[#121713]'
            }`}
            title="Ouvir Ronco do Motor"
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              isLiked ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-black/60 text-[#E8ECE8] border-white/20 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Carousel */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-72 sm:h-96 w-full bg-black flex items-center justify-center overflow-hidden group cursor-pointer"
          title="Clique para ampliar foto em alta resolução"
        >
          <img
            src={vehicle.photos[activePhotoIndex]}
            alt={vehicle.model}
            className="w-full h-full object-cover sm:object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172018] via-transparent to-black/30 pointer-events-none" />

          {/* Top Expand button */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xl transition-all cursor-pointer"
              title="Ampliar foto em tela cheia"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ampliar Foto</span>
            </button>
          </div>

          {/* Photo Arrows */}
          {vehicle.photos.length > 1 && (
            <>
              {activePhotoIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activePhotoIndex < vehicle.photos.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          {/* Plate Badge on modal */}
          <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 z-10">
            {vehicle.plateType === 'preta' && (
              <div className="px-3 py-1 bg-[#101411]/95 border-2 border-[#D4AF37] rounded-lg shadow-xl text-[#E8ECE8] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="font-mono font-black text-xs tracking-widest">PLACA PRETA • COLEÇÃO</span>
              </div>
            )}
          </div>

          {/* Thumbnails Navigator */}
          {vehicle.photos.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5 bg-black/60 p-1.5 rounded-xl backdrop-blur-md z-10">
              {vehicle.photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(idx);
                  }}
                  className={`w-10 h-7 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    activePhotoIndex === idx ? 'border-[#D4AF37] scale-105 ring-1 ring-[#D4AF37]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Title & Owner Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#3B4D3A]/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                  {vehicle.brand} • {vehicle.year}
                </span>
                {vehicle.valuationEstimate && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#263628] text-[#F3E5AB] border border-[#3B4D3A]">
                    Valor de Mercado: {vehicle.valuationEstimate}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-heading font-black text-[#F3E5AB]">
                {vehicle.model}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8EA290] font-mono mt-1">
                <span>Chassi: {vehicle.chassisMasked || 'Homologado na FIVA'}</span>
                <span>•</span>
                <span>Cor: {vehicle.color}</span>
                {vehicle.matchingNumbers && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#F3E5AB] border border-[#D4AF37]/50 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Matching Numbers
                    </span>
                  </>
                )}
                {vehicle.limitedEdition && (
                  <>
                    <span>•</span>
                    <span className="text-[#D4AF37] font-semibold">{vehicle.limitedEdition}</span>
                  </>
                )}
              </div>
            </div>

            {/* Owner badge & Contact */}
            <div className="flex items-center gap-3 bg-[#1C271E] p-2.5 rounded-xl border border-[#3B4D3A]/40 shrink-0">
              <div 
                onClick={() => {
                  if (onViewOwnerProfile) {
                    onClose();
                    onViewOwnerProfile({
                      id: vehicle.ownerId,
                      name: vehicle.ownerName,
                      avatar: vehicle.ownerAvatar
                    });
                  }
                }}
                className={`flex items-center gap-2.5 ${onViewOwnerProfile ? 'cursor-pointer group' : ''}`}
                title="Ver perfil completo do colecionador"
              >
                <img
                  src={vehicle.ownerAvatar}
                  alt={vehicle.ownerName}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] group-hover:scale-105 group-hover:border-[#F3E5AB] transition-all"
                />
                <div>
                  <p className="text-xs font-semibold text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors">{vehicle.ownerName}</p>
                  <p className="text-[10px] text-[#D4AF37] flex items-center gap-1">
                    <span>Proprietário & Colecionador</span>
                    {onViewOwnerProfile && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] underline">Ver Perfil</span>}
                  </p>
                </div>
              </div>
              {vehicle.ownerId !== currentUser.id ? (
                <button
                  onClick={() => {
                    onClose();
                    onContactOwner({
                      id: vehicle.ownerId,
                      name: vehicle.ownerName,
                      avatar: vehicle.ownerAvatar
                    });
                  }}
                  className="ml-2 px-3 py-1.5 bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Mensagem</span>
                </button>
              ) : (
                onEditVehicle && (
                  <button
                    onClick={() => {
                      onClose();
                      onEditVehicle(vehicle);
                    }}
                    className="ml-2 px-3 py-1.5 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Editar Carro</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 my-5 border-b border-[#3B4D3A]/40 pb-2">
            {[
              { id: 'specs', label: 'Ficha Técnica', icon: Gauge },
              { id: 'history', label: 'Histórico & Restauração', icon: FileText },
              { id: 'mods', label: 'Modificações de Época', icon: Wrench },
              { id: 'trophies', label: 'Troféus & Premiações', icon: Trophy, count: vehicle.trophies?.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/50 shadow-xs'
                      : 'text-[#8EA290] hover:text-[#E8ECE8] hover:bg-[#1E2B20]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C9A227] text-[#121713] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[160px]">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Motorização</p>
                  <p className="font-bold text-[#E8ECE8] text-sm mt-0.5">{vehicle.engine || 'Original'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Potência</p>
                  <p className="font-bold text-[#D4AF37] font-mono text-sm mt-0.5">{vehicle.horsepower ? `${vehicle.horsepower} cv` : 'N/D'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Torque</p>
                  <p className="font-bold text-[#E8ECE8] font-mono text-sm mt-0.5">{vehicle.torque || 'N/D'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Transmissão</p>
                  <p className="font-semibold text-[#E8ECE8] text-sm mt-0.5">{vehicle.transmission || 'Manual'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Combustível</p>
                  <p className="font-semibold text-[#E8ECE8] text-sm mt-0.5">{vehicle.fuel || 'Gasolina'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Hodômetro</p>
                  <p className="font-bold text-[#E8ECE8] font-mono text-sm mt-0.5">
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Não informado'}
                  </p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">0 a 100 km/h</p>
                  <p className="font-bold text-[#D4AF37] font-mono text-sm mt-0.5">{vehicle.zeroToHundred || 'N/D'}</p>
                </div>
                <div className="bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
                  <p className="text-[#7E9180] text-[11px]">Velocidade Máxima</p>
                  <p className="font-bold text-[#E8ECE8] font-mono text-sm mt-0.5">{vehicle.topSpeed || 'N/D'}</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="bg-[#141C15] p-4 rounded-xl border border-[#3B4D3A]/40 text-xs leading-relaxed text-[#B4C4B6]">
                  <h4 className="font-serif font-bold text-[#F3E5AB] text-sm mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    Memorial Descritivo & Originalidade
                  </h4>
                  <p className="whitespace-pre-line">
                    {vehicle.restorationHistory || 'Veículo mantido em conservação original por entusiasta com histórico documentado.'}
                  </p>
                </div>

                {vehicle.historicalCuriosity && (
                  <div className="bg-gradient-to-r from-[#202E22] to-[#141C15] p-4 rounded-xl border border-[#D4AF37]/40 text-xs">
                    <h5 className="font-bold text-[#F3E5AB] text-xs mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Curiosidade Histórica & Proveniência:
                    </h5>
                    <p className="text-[#B4C4B6]">{vehicle.historicalCuriosity}</p>
                  </div>
                )}

                {vehicle.restorationTimeline && vehicle.restorationTimeline.length > 0 && (
                  <div className="bg-[#141C15] p-4 rounded-xl border border-[#3B4D3A]/40 text-xs">
                    <h5 className="font-bold text-[#F3E5AB] text-xs mb-3 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Linha do Tempo da Restauração:
                    </h5>
                    <div className="space-y-2.5">
                      {vehicle.restorationTimeline.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 pb-2 border-b border-[#3B4D3A]/30 last:border-0 last:pb-0">
                          <span className="font-bold font-mono text-[#D4AF37] text-xs px-2 py-0.5 rounded bg-[#263628] shrink-0">
                            {step.date}
                          </span>
                          <div>
                            <p className="text-[#E8ECE8] font-medium">{step.description}</p>
                            {step.workshop && (
                              <p className="text-[11px] text-[#8EA290]">Oficina / Especialista: {step.workshop}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vehicle.documentsAvailable && vehicle.documentsAvailable.length > 0 && (
                  <div className="bg-[#141C15] p-4 rounded-xl border border-[#3B4D3A]/40 text-xs">
                    <h5 className="font-bold text-[#F3E5AB] text-xs mb-2.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Documentação & Certificados Disponíveis:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicle.documentsAvailable.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#19241B] border border-[#3B4D3A]/50 text-xs text-[#E8ECE8]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mods' && (
              <div className="space-y-2">
                {vehicle.modifications && vehicle.modifications.length > 0 ? (
                  vehicle.modifications.map((mod, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141C15] border border-[#3B4D3A]/40 text-xs text-[#E8ECE8]">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{mod}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8EA290] p-4 bg-[#141C15] rounded-xl text-center">
                    Nenhuma modificação não-original registrada. Veículo 100% no padrão de fábrica.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'trophies' && (
              <div className="space-y-2">
                {vehicle.trophies && vehicle.trophies.length > 0 ? (
                  vehicle.trophies.map((trophy, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#202E22] to-[#141C15] border border-[#D4AF37]/40 text-xs">
                      <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#D4AF37]">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#F3E5AB] text-sm">{trophy}</p>
                        <p className="text-[11px] text-[#8EA290]">Chancelado por júri oficial de antigomobilismo</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8EA290] p-4 bg-[#141C15] rounded-xl text-center">
                    Nenhum troféu cadastrado ainda para este exemplar.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Vehicle Media Lightbox Zoom Modal */}
      {isLightboxOpen && vehicle.photos.length > 0 && (
        <MediaLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          media={vehicle.photos.map((p, idx) => ({
            type: 'image',
            url: p,
            caption: `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - Foto ${idx + 1}`
          }))}
          initialIndex={activePhotoIndex}
          title={`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
        />
      )}
    </div>
  );
};
