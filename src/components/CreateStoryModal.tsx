import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Volume2, 
  Car, 
  Check, 
  Image as ImageIcon,
  Flame,
  Radio,
  Plus
} from 'lucide-react';
import { User, Vehicle, Story } from '../types';
import { engineSound } from '../utils/engineSound';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (story: Omit<Story, 'id' | 'timestamp' | 'viewed'>) => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onAddStory,
  currentUser,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [hasEngineRev, setHasEngineRev] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample quick media presets from classic cars if no custom file uploaded
  const sampleMediaOptions = [
    { label: 'Ronco V8 na Garagem', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80', desc: 'Chevrolet Corvette Stingray 1969' },
    { label: 'Passeio Noturno', url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80', desc: 'Ford Mustang Fastback 1967' },
    { label: 'Restauração Box', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80', desc: 'Porsche 911 Carrera 1974' },
    { label: 'Pista & Encontro', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80', desc: 'Dodge Charger R/T 1971' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const finalMedia = mediaUrl || (userVehicles[0]?.photos[0] || sampleMediaOptions[0].url);
    const taggedCar = userVehicles.find(v => v.id === selectedVehicleId) || userVehicles[0];

    try {
      if (hasEngineRev) {
        engineSound.playRev();
      }
    } catch {}

    onAddStory({
      author: currentUser,
      title: title.trim() || (taggedCar ? `${taggedCar.brand} ${taggedCar.model} na Ativa` : 'Novo momento na Garagem 95'),
      subtitle: subtitle.trim() || `${currentUser.name} • Momento 24h`,
      mediaUrl: finalMedia,
      mediaType: 'image',
      vehicleTagged: taggedCar,
      engineRevAudio: hasEngineRev ? 'v8_engine_start.mp3' : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#162018] border border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden my-4 text-[#E8ECE8]">
        
        {/* Header */}
        <div className="p-5 bg-[#1C271E] border-b border-[#3B4D3A]/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#263628] border border-[#D4AF37]/40 flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-sm text-[#F3E5AB]">
                Publicar no Meu Story (24h)
              </h3>
              <p className="text-[11px] text-[#8EA290]">
                Compartilhe momentos da garagem, passeios e restaurações
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8EA290] hover:text-[#F3E5AB] hover:bg-[#263628] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {/* Media Preview & Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#A2B3A4] mb-2">
              Foto ou Vídeo do Story
            </label>
            
            {mediaUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/50 h-52 bg-black flex items-center justify-center group">
                <img
                  src={mediaUrl}
                  alt="Story preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  title="Remover foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Box */}
                <label className="border-2 border-dashed border-[#3B4D3A] hover:border-[#D4AF37] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#121A14]/80 transition-colors">
                  <Upload className="w-6 h-6 text-[#D4AF37]" />
                  <span className="text-xs font-medium text-[#F3E5AB]">
                    Clique para enviar foto do seu computador/celular
                  </span>
                  <span className="text-[10px] text-[#7E9180]">
                    JPG, PNG ou WebP até 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7E9180] tracking-wider block mb-1.5">
                    Ou escolha um momento clássico:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleMediaOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setMediaUrl(opt.url);
                          if (!title) setTitle(opt.label);
                        }}
                        className="text-left p-2 rounded-xl bg-[#1B261D] hover:bg-[#253527] border border-[#3B4D3A]/60 flex items-center gap-2 text-xs transition-colors"
                      >
                        <img
                          src={opt.url}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-[#E8ECE8] truncate text-[11px]">{opt.label}</p>
                          <p className="text-[9px] text-[#8EA290] truncate">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Story Caption / Title */}
          <div>
            <label className="block text-xs font-semibold text-[#A2B3A4] mb-1">
              Legenda do Story
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aquecendo o V8 para o passeio de domingo..."
              className="w-full px-3.5 py-2.5 bg-[#121A14] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] placeholder-[#667A68] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Tag Vehicle from Garage */}
          {userVehicles.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#A2B3A4] mb-1">
                Marcar Veículo da Minha Garagem (Opcional)
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 bg-[#121A14] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="">Nenhum veículo selecionado</option>
                {userVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Engine Audio Option */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1B261D] border border-[#3B4D3A]/60">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <p className="text-xs font-semibold text-[#F3E5AB]">Áudio de Ronco do Motor</p>
                <p className="text-[10px] text-[#8EA290]">Tocar ronco clássico ao abrir o story</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasEngineRev}
              onChange={(e) => setHasEngineRev(e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A2B3A4] hover:bg-[#263628] hover:text-[#E8ECE8] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] text-[#121713] font-bold text-xs shadow-lg hover:from-[#E5C158] hover:to-[#C9A227] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publicar Story</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
