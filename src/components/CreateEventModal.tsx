import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Check, 
  Award, 
  DollarSign 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClubEvent, User, Vehicle } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: ClubEvent) => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  currentUser,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'encontro' | 'track_day' | 'exposicao' | 'leilao' | 'passeio' | 'feira_pecas'>('encontro');
  const [date, setDate] = useState('20 de Dezembro de 2026');
  const [time, setTime] = useState('09:00 - 16:00');
  const [locationName, setLocationName] = useState('Autódromo de Interlagos');
  const [address, setAddress] = useState('Av. Sen. Teotônio Vilela, 261');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [description, setDescription] = useState('');
  const [entryFee, setEntryFee] = useState('Gratuito para Sócios');
  const [requirements, setRequirements] = useState('Veículos clássicos e de coleção');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: ClubEvent = {
      id: `evt_${Date.now()}`,
      organizer: currentUser,
      title,
      type,
      date,
      time,
      locationName,
      address,
      city,
      state,
      coordinates: { lat: -23.5505, lng: -46.6333 },
      coverImage,
      description: description || 'Encontro oficial organizado por membros da Garage 95.',
      confirmedAttendees: [
        {
          user: currentUser,
          carModel: userVehicles[0] ? `${userVehicles[0].brand} ${userVehicles[0].model}` : 'Veículo Clássico',
          confirmedAt: 'Agora mesmo'
        }
      ],
      interestedCount: 12,
      isRegistered: true,
      checkInAvailable: true,
      entryFee,
      requirements,
      schedule: [
        { time: '09:00', title: 'Abertura dos Portões & Acomodação dos Carros', desc: 'Recepção dos colecionadores.' },
        { time: '11:30', title: 'Passeio em Comboio e Fotos Oficiais', desc: 'Sessão fotográfica das máquinas.' },
        { time: '15:00', title: 'Encerramento e Sorteio de Memorabilia', desc: 'Confraternização entre membros.' }
      ]
    };

    onAddEvent(newEvent);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C9A227', '#4F6650']
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                Organizar Encontro / Evento Automotivo
              </h3>
              <p className="text-xs text-[#8EA290]">Crie encontros, passeios, track days ou exposições de época.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          <div>
            <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Título do Evento *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 5º Encontro Noturno de Clássicos & Muscle Cars"
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Tipo de Evento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="encontro">Encontro / Encontro Noturno</option>
                <option value="exposicao">Concurso d'Elegance / Exposição</option>
                <option value="track_day">Track Day / Pista Histórica</option>
                <option value="passeio">Passeio / Rally de Regularidade</option>
                <option value="feira_pecas">Mercado de Pulgas / Feira de Peças</option>
                <option value="leilao">Leilão de Clássicos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Taxa de Inscrição / Entrada</label>
              <input
                type="text"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="Ex: Gratuito / R$ 50 + 1kg alimento"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Data</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 28 de Novembro de 2026"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Horário</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex: 08:30 às 17:00"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Local / Estabelecimento</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ex: Parque Ibirapuera - Portão 3"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${city}, ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0] ? parts[0].trim() : '');
                  setState(parts[1] ? parts[1].trim() : 'SP');
                }}
                placeholder="São Paulo, SP"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Foto de Divulgação (URL)</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Descrição e Cronograma</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes do trajeto, estrutura de alimentação, regras de estacionamento por ano..."
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#3B4D3A]/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Publicar Evento</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
