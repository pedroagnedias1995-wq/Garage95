import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  CheckCircle2, 
  Car, 
  Share2, 
  QrCode, 
  ExternalLink,
  Sparkles,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClubEvent, User, Vehicle } from '../types';

interface EventDetailModalProps {
  event: ClubEvent | null;
  onClose: () => void;
  onToggleRegister: (eventId: string, carModel?: string) => void;
  onViewUserProfile?: (user: any) => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onToggleRegister,
  onViewUserProfile,
  currentUser,
  userVehicles
}) => {
  if (!event) return null;

  const [selectedCarModel, setSelectedCarModel] = useState(
    userVehicles[0] ? `${userVehicles[0].brand} ${userVehicles[0].model} (${userVehicles[0].year})` : ''
  );
  const [checkedIn, setCheckedIn] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleRegister = () => {
    onToggleRegister(event.id, selectedCarModel);
    if (!event.isRegistered) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#C9A227', '#4F6650', '#F3E5AB']
        });
      } catch {}
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#E5C158', '#FFFFFF']
      });
    } catch {}
  };

  const modalContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [event]);

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 py-4 sm:py-8 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-2 sm:my-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover */}
        <div className="relative h-64 sm:h-80 w-full bg-black overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172018] via-black/40 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-[#C9A227] text-[#121713] text-[10px] font-bold uppercase tracking-wider">
                  {event.type.toUpperCase()}
                </span>
                {event.entryFee && (
                  <span className="px-2.5 py-0.5 rounded-md bg-black/70 text-[#F3E5AB] text-[10px] font-mono border border-[#D4AF37]/40">
                    {event.entryFee}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-serif-heading font-black text-[#F3E5AB]">
                {event.title}
              </h1>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {event.isRegistered && (
                <button
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="px-3 py-2 rounded-xl bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  <span>Passaporte / QR</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Details & Schedule & Attendees */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#141C15] p-3.5 rounded-xl border border-[#3B4D3A]/40 text-xs">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#7E9180] text-[10px]">Data & Horário</p>
                    <p className="font-bold text-[#E8ECE8]">{event.date}</p>
                    <p className="text-[#A2B3A4]">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#7E9180] text-[10px]">Localização</p>
                    <p className="font-bold text-[#E8ECE8]">{event.locationName}</p>
                    <p className="text-[#A2B3A4]">{event.address}, {event.city} - {event.state}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-2">
                  Sobre o Evento & Regulamento
                </h4>
                <p className="text-xs sm:text-sm text-[#D1DCD2] leading-relaxed bg-[#141C15] p-4 rounded-xl border border-[#3B4D3A]/30">
                  {event.description}
                </p>
                {event.requirements && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#263628]/60 border border-[#3B4D3A] text-xs text-[#E5C158] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Critérios: {event.requirements}</span>
                  </div>
                )}
              </div>

              {/* Program Schedule */}
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-3">
                  Cronograma Oficial
                </h4>
                <div className="space-y-2">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40 text-xs">
                      <span className="font-mono font-bold text-[#D4AF37] shrink-0">{item.time}</span>
                      <div>
                        <p className="font-semibold text-[#E8ECE8]">{item.title}</p>
                        <p className="text-[#8EA290] text-[11px] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmed Attendees List */}
              <div>
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center justify-between">
                  <span>Colecionadores Confirmados ({event.confirmedAttendees.length})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.confirmedAttendees.map((attendee, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (onViewUserProfile) {
                          onClose();
                          onViewUserProfile(attendee.user);
                        }
                      }}
                      className={`flex items-center gap-2.5 bg-[#141C15] p-2.5 rounded-xl border border-[#3B4D3A]/40 transition-all ${
                        onViewUserProfile ? 'cursor-pointer hover:border-[#D4AF37]/60 hover:bg-[#1A251C] group' : ''
                      }`}
                      title="Ver perfil do colecionador"
                    >
                      <img
                        src={attendee.user.avatar}
                        alt={attendee.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/50 group-hover:border-[#F3E5AB] shrink-0 transition-colors"
                      />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-xs text-[#E8ECE8] group-hover:text-[#F3E5AB] truncate transition-colors">
                          {attendee.user.name}
                        </p>
                        {attendee.carModel && (
                          <p className="text-[11px] text-[#D4AF37] truncate flex items-center gap-1">
                            <Car className="w-3 h-3 shrink-0" />
                            {attendee.carModel}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Registration Card & Check-in */}
            <div className="space-y-4">
              
              {/* Registration Action Box */}
              <div className="bg-[#141C15] p-5 rounded-2xl border border-[#3B4D3A]/60 space-y-4">
                <h4 className="font-serif font-bold text-xs text-[#D4AF37] uppercase tracking-wider">
                  Inscrição no Encontro
                </h4>

                {/* Select Car to Take */}
                {userVehicles.length > 0 && !event.isRegistered && (
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8EA290] mb-1.5">
                      Qual veículo da sua garagem você levará?
                    </label>
                    <select
                      value={selectedCarModel}
                      onChange={(e) => setSelectedCarModel(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                    >
                      {userVehicles.map((v) => (
                        <option key={v.id} value={`${v.brand} ${v.model} (${v.year})`}>
                          {v.brand} {v.model} ({v.year})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    event.isRegistered
                      ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]'
                      : 'bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{event.isRegistered ? 'Presença Confirmada (Clique para Cancelar)' : 'Confirmar Presença no Evento'}</span>
                </button>

                {/* Digital Check-in at location */}
                {event.isRegistered && (
                  <div className="pt-2 border-t border-[#3B4D3A]/40 space-y-2">
                    <p className="text-[11px] text-[#8EA290]">
                      Check-in digital por geolocalização no local do evento:
                    </p>
                    {checkedIn ? (
                      <div className="p-3 bg-[#263628] border border-[#D4AF37] rounded-xl text-center text-xs text-[#F3E5AB] font-bold flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span>Check-in Realizado com Sucesso!</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleCheckIn}
                        className="w-full py-2 px-3 rounded-xl bg-[#1C271E] hover:bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Fazer Check-in no Local</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Simulated Interactive Map */}
              <div className="bg-[#141C15] p-3.5 rounded-2xl border border-[#3B4D3A]/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#E8ECE8] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Mapa de Acesso
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-mono">Rota de Comboio</span>
                </div>
                <div className="relative aspect-[16/10] bg-[#1a261c] rounded-xl overflow-hidden border border-[#3B4D3A]/40 flex items-center justify-center text-center p-4">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#C9A227] text-[#121713] flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-[#F3E5AB]">{event.locationName}</p>
                    <p className="text-[10px] text-[#8EA290]">{event.city} - {event.state}</p>
                  </div>
                </div>
              </div>

              {/* Organizer Profile */}
              <div 
                onClick={() => {
                  if (onViewUserProfile) {
                    onClose();
                    onViewUserProfile(event.organizer);
                  }
                }}
                className={`p-3.5 rounded-xl bg-[#141C15] border border-[#3B4D3A]/40 flex items-center gap-3 transition-all ${
                  onViewUserProfile ? 'cursor-pointer hover:border-[#D4AF37]/60 hover:bg-[#1A251C] group' : ''
                }`}
                title="Ver perfil do organizador"
              >
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#D4AF37] group-hover:border-[#F3E5AB] transition-colors"
                />
                <div>
                  <p className="text-[10px] text-[#7E9180]">Organizado por</p>
                  <p className="text-xs font-semibold text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors">{event.organizer.name}</p>
                  <p className="text-[10px] text-[#D4AF37]">{event.organizer.collectorTier}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* QR Code Pass Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#172018] border-2 border-[#D4AF37] p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#D4AF37] font-bold">PASSAPORTE DO COLECIONADOR</span>
                <button onClick={() => setShowQrModal(false)} className="text-white hover:text-[#D4AF37]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl inline-block shadow-inner">
                {/* SVG QR Code Simulation */}
                <div className="w-40 h-40 bg-black grid grid-cols-6 grid-rows-6 gap-1 p-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${(i * 7 + 3) % 2 === 0 ? 'bg-white' : 'bg-black'} rounded-xs`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="font-serif font-bold text-sm text-[#F3E5AB]">{currentUser.name}</p>
                <p className="text-xs text-[#8EA290]">{selectedCarModel || 'Veículo Homologado'}</p>
                <p className="text-[10px] font-mono text-[#D4AF37] mt-1">TOKEN: GC-{event.id.toUpperCase()}-2026</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
