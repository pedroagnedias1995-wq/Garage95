import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Award, 
  CheckCircle2, 
  Car, 
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';
import { ClubEvent, User } from '../types';

interface EventCardProps {
  event: ClubEvent;
  onSelect: (event: ClubEvent) => void;
  onToggleRegister: (eventId: string) => void;
  currentUser: User;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onToggleRegister,
  currentUser
}) => {
  return (
    <div
      onClick={() => onSelect(event)}
      id={`event-card-${event.id}`}
      className="group bg-[#18221A] border border-[#3B4D3A]/60 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#121613]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18221A] via-transparent to-black/40" />

        {/* Event Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-[#101411]/90 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/50 shadow-sm">
            {event.type === 'exposicao' ? 'Concurso & Elegância' : event.type === 'track_day' ? 'Track Day Pista' : event.type === 'leilao' ? 'Leilão Oficial' : 'Encontro de Colecionadores'}
          </span>
        </div>

        {/* Date Stamp Tag */}
        <div className="absolute top-3 right-3 bg-[#101411]/90 border border-[#D4AF37]/40 px-2.5 py-1 rounded-xl text-center backdrop-blur-xs shadow-md">
          <p className="text-[10px] font-mono text-[#D4AF37] font-bold leading-tight">
            {event.date.split(' ')[0]} {event.date.split(' ')[2]?.substring(0, 3)}
          </p>
        </div>

        {/* Attendees Count */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#E8ECE8]">
          <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            {event.confirmedAttendees.length} confirmados • {event.interestedCount} interessados
          </span>

          {event.isRegistered && (
            <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#121713] font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Inscrito
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-1 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5" />
            <span>{event.time}</span>
          </div>

          <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="flex items-center gap-1 text-xs text-[#8EA290] mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>{event.locationName}, {event.city} - {event.state}</span>
          </p>

          <p className="text-xs text-[#B4C4B6] mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Confirmed Collectors preview */}
        <div className="mt-4 pt-3 border-t border-[#3B4D3A]/40 flex items-center justify-between">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {event.confirmedAttendees.slice(0, 4).map((att, idx) => (
              <img
                key={idx}
                src={att.user.avatar}
                alt={att.user.name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#18221A] object-cover"
                title={`${att.user.name} (${att.carModel || 'Colecionador'})`}
              />
            ))}
            {event.confirmedAttendees.length > 4 && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#263628] text-[10px] text-[#D4AF37] font-bold ring-2 ring-[#18221A]">
                +{event.confirmedAttendees.length - 4}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleRegister(event.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              event.isRegistered
                ? 'bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/50'
                : 'bg-gradient-to-r from-[#C9A227] to-[#AA820A] text-[#121713] hover:from-[#E5C158] hover:to-[#C9A227] shadow-md'
            }`}
          >
            {event.isRegistered ? 'Presença Confirmada' : 'Confirmar Presença'}
          </button>
        </div>
      </div>
    </div>
  );
};
