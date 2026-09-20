import React, { useState, useRef } from 'react';
import { 
  X, 
  Car, 
  Camera, 
  Upload, 
  Sparkles, 
  Award, 
  Wrench, 
  Trophy, 
  Check, 
  Trash2, 
  Plus, 
  Gauge, 
  FileText, 
  Layers,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Vehicle, PlateType, VehicleCategory, User } from '../types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSaveVehicle: (updatedVehicle: Vehicle) => void;
  onDeleteVehicle?: (vehicleId: string) => void;
  currentUser: User;
}

const PRESET_VEHICLE_PHOTOS = [
  {
    label: 'Maverick V8 Sunset',
    url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Corvette Stingray C3',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Porsche 911 Carrera RS',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Alfa Romeo Giulia Sprint',
    url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Fusca Vintage Fuscão',
    url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Dodge Charger R/T V8',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80'
  }
];

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSaveVehicle,
  onDeleteVehicle,
  currentUser
}) => {
  if (!isOpen || !vehicle) return null;

  const [activeTab, setActiveTab] = useState<'geral' | 'fotos' | 'mecanica' | 'historico'>('geral');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states initialized from vehicle
  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [year, setYear] = useState<number>(vehicle.year);
  const [category, setCategory] = useState<VehicleCategory>(vehicle.category);
  const [plateType, setPlateType] = useState<PlateType>(vehicle.plateType);
  const [color, setColor] = useState(vehicle.color);
  const [valuationEstimate, setValuationEstimate] = useState(vehicle.valuationEstimate || '');
  const [authenticityScore, setAuthenticityScore] = useState<number>(vehicle.authenticityScore || 95);
  const [chassisMasked, setChassisMasked] = useState(vehicle.chassisMasked || '');

  // Specs & Engine
  const [engine, setEngine] = useState(vehicle.engine);
  const [horsepower, setHorsepower] = useState<number>(vehicle.horsepower);
  const [transmission, setTransmission] = useState(vehicle.transmission);
  const [fuel, setFuel] = useState(vehicle.fuel);
  const [mileage, setMileage] = useState<number>(vehicle.mileage);
  const [zeroToHundred, setZeroToHundred] = useState(vehicle.zeroToHundred || '');
  const [topSpeed, setTopSpeed] = useState(vehicle.topSpeed || '');

  // Photos
  const [coverPhoto, setCoverPhoto] = useState(vehicle.coverPhoto);
  const [photos, setPhotos] = useState<string[]>(vehicle.photos || [vehicle.coverPhoto]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // History & Mods & Trophies
  const [restorationHistory, setRestorationHistory] = useState(vehicle.restorationHistory || '');
  const [modificationsText, setModificationsText] = useState((vehicle.modifications || []).join('\n'));
  const [trophiesText, setTrophiesText] = useState((vehicle.trophies || []).join('\n'));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64Url = uploadEvent.target.result as string;
          setCoverPhoto(base64Url);
          if (!photos.includes(base64Url)) {
            setPhotos([base64Url, ...photos]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoUrl = () => {
    if (newPhotoUrl.trim()) {
      const trimmed = newPhotoUrl.trim();
      if (!photos.includes(trimmed)) {
        setPhotos([...photos, trimmed]);
      }
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (photoUrlToRemove: string) => {
    const updated = photos.filter(p => p !== photoUrlToRemove);
    setPhotos(updated);
    if (coverPhoto === photoUrlToRemove && updated.length > 0) {
      setCoverPhoto(updated[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) return;

    const parsedMods = modificationsText
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const parsedTrophies = trophiesText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedVehicle: Vehicle = {
      ...vehicle,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      category,
      plateType,
      color: color.trim() || 'Clássico Original',
      valuationEstimate: valuationEstimate.trim(),
      authenticityScore: Number(authenticityScore),
      chassisMasked: chassisMasked.trim(),
      engine: engine.trim() || 'Motor Clássico Aspirado',
      horsepower: Number(horsepower),
      transmission: transmission.trim(),
      fuel: fuel.trim(),
      mileage: Number(mileage),
      zeroToHundred: zeroToHundred.trim(),
      topSpeed: topSpeed.trim(),
      coverPhoto: coverPhoto.trim() || photos[0] || vehicle.coverPhoto,
      photos: photos.length > 0 ? photos : [coverPhoto],
      restorationHistory: restorationHistory.trim(),
      modifications: parsedMods,
      trophies: parsedTrophies
    };

    onSaveVehicle(updatedVehicle);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  const handleDelete = () => {
    if (onDeleteVehicle) {
      onDeleteVehicle(vehicle.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#172119] border border-[#D4AF37]/60 rounded-3xl shadow-2xl overflow-hidden my-6 text-[#E8ECE8]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3B4D3A]/60 bg-[#131A14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#263628] to-[#162018] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg sm:text-xl text-[#F3E5AB]">
                Editar Veículo: {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-xs text-[#8EA290]">
                Atualize fotos, dados técnicos, histórico de restauração e premiações.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8EA290] hover:text-[#F3E5AB] hover:bg-[#263628] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3B4D3A]/60 bg-[#141C15] px-4 overflow-x-auto">
          {[
            { id: 'geral', label: 'Identificação & Dados', icon: Car },
            { id: 'fotos', label: 'Fotos & Galeria', icon: Camera },
            { id: 'mecanica', label: 'Ficha Técnica & Motor', icon: Gauge },
            { id: 'historico', label: 'Restauração & Troféus', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#D4AF37] text-[#F3E5AB] bg-[#1E2B20]/60'
                    : 'border-transparent text-[#8EA290] hover:text-[#E8ECE8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* ================= TAB: GERAL & IDENTIFICAÇÃO ================= */}
          {activeTab === 'geral' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Quick Summary Card */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#141C15] border border-[#3B4D3A]/60">
                <img
                  src={coverPhoto}
                  alt={model}
                  className="w-20 h-14 rounded-xl object-cover border border-[#D4AF37]/50 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#F3E5AB] text-sm truncate">
                    {brand || 'Marca'} {model || 'Modelo'} ({year})
                  </h4>
                  <p className="text-xs text-[#8EA290] font-mono truncate">{engine}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/40 font-bold">
                  {valuationEstimate || 'Sob consulta'}
                </span>
              </div>

              {/* Brand, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Marca / Fabricante <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Ford, Chevrolet, Porsche"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Modelo & Versão <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: Maverick GT 302 V8"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Ano de Fabricação <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1900}
                    max={2026}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] font-mono text-[#D4AF37] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category, Plate Type, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Categoria do Veículo
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    <option value="carro">Carro Clássico / Esportivo</option>
                    <option value="moto">Motocicleta Vintage</option>
                    <option value="caminhao">Caminhão / Ônibus Histórico</option>
                    <option value="utilitario">Picape / Utilitário Antigo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Classificação de Placa
                  </label>
                  <select
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value as PlateType)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    <option value="preta">Placa Preta (Coleção Oficial)</option>
                    <option value="mercosul">Mercosul Colecionador</option>
                    <option value="amarela">Placa Amarela Histórica</option>
                    <option value="regular">Placa Padrão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Cor da Carroceria
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ex: Laranja Solar com Faixas GT"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Valuation & Chassis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Estimativa de Valor FIVA / Mercado
                  </label>
                  <input
                    type="text"
                    value={valuationEstimate}
                    onChange={(e) => setValuationEstimate(e.target.value)}
                    placeholder="Ex: R$ 210.000"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#F3E5AB] font-mono rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Identificação / Chassi
                  </label>
                  <input
                    type="text"
                    value={chassisMasked}
                    onChange={(e) => setChassisMasked(e.target.value)}
                    placeholder="Ex: LB5HE*** (Homologado)"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] font-mono rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB: FOTOS & GALERIA ================= */}
          {activeTab === 'fotos' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Cover Photo Primary Preview */}
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-2">
                  Foto de Capa Principal do Veículo
                </label>
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 aspect-[16/9] max-h-56 bg-black shadow-xl">
                  <img
                    src={coverPhoto}
                    alt="Capa do veículo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 text-[#F3E5AB] text-xs font-bold border border-[#D4AF37]/50">
                      Foto Principal Selecionada
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Substituir com Arquivo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Add Photo by URL or File */}
              <div className="p-4 rounded-2xl bg-[#141C15] border border-[#3B4D3A] space-y-3">
                <label className="block text-xs font-semibold text-[#8EA290]">
                  Adicionar Nova Foto por Link URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Cole o link da imagem (https://...)"
                    className="flex-1 px-3.5 py-2 text-xs bg-[#1A241C] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-4 py-2 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-bold rounded-xl border border-[#D4AF37]/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* Gallery List */}
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-2 flex items-center justify-between">
                  <span>Galeria de Fotos Cadastradas ({photos.length})</span>
                  <span className="text-[11px] text-[#8EA290]">Clique em uma foto para defini-la como Capa</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((p, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] bg-black ${
                        coverPhoto === p ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40' : 'border-[#3B4D3A] hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <img
                        src={p}
                        alt=""
                        onClick={() => setCoverPhoto(p)}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                      />
                      {coverPhoto === p && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#121713] text-[9px] font-black uppercase">
                          Capa
                        </div>
                      )}
                      {photos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(p)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remover foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Presets Gallery */}
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-2">
                  Escolher da Galeria de Fotos Clássicas
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_VEHICLE_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCoverPhoto(p.url);
                        if (!photos.includes(p.url)) {
                          setPhotos([...photos, p.url]);
                        }
                      }}
                      className="group relative rounded-xl overflow-hidden border border-[#3B4D3A] hover:border-[#D4AF37] transition-all aspect-[4/3] cursor-pointer"
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB: MECÂNICA & ESPECIFICAÇÕES ================= */}
          {activeTab === 'mecanica' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Motorização / Especificação do Motor <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="Ex: 302ci (5.0L) Windsor V8 Quadrijet"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Potência Declarada (cv / hp)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1500}
                    value={horsepower}
                    onChange={(e) => setHorsepower(Number(e.target.value))}
                    placeholder="Ex: 197"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] font-mono text-[#D4AF37] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Transmissão / Câmbio
                  </label>
                  <input
                    type="text"
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    placeholder="Ex: Manual 4 marchas Clark"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Combustível
                  </label>
                  <input
                    type="text"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    placeholder="Ex: Gasolina Podium"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Hodômetro Atual (km)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    placeholder="Ex: 45000"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] font-mono text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Aceleração 0 a 100 km/h
                  </label>
                  <input
                    type="text"
                    value={zeroToHundred}
                    onChange={(e) => setZeroToHundred(e.target.value)}
                    placeholder="Ex: 8.5s"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] font-mono text-[#D4AF37] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                    Velocidade Máxima
                  </label>
                  <input
                    type="text"
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(e.target.value)}
                    placeholder="Ex: 195 km/h"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141C15] font-mono text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB: RESTAURAÇÃO & TROFÉUS ================= */}
          {activeTab === 'historico' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1.5">
                  Memorial Descritivo & Histórico de Restauração
                </label>
                <textarea
                  rows={4}
                  value={restorationHistory}
                  onChange={(e) => setRestorationHistory(e.target.value)}
                  placeholder="Descreva as etapas da restauração, oficinas envolvidas, catálogo de peças originais, certificado de placa preta..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1.5">
                  Modificações de Época / Acessórios (Uma por linha)
                </label>
                <textarea
                  rows={3}
                  value={modificationsText}
                  onChange={(e) => setModificationsText(e.target.value)}
                  placeholder="Ex: Carburador Holley 650 Quadrijet&#10;Escape 8x2 Dimensionado em Inox&#10;Rodas Magnum 500 de Época"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1.5">
                  Troféus, Premiações & Concours d'Elegance (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={trophiesText}
                  onChange={(e) => setTrophiesText(e.target.value)}
                  placeholder="Ex: 1º Lugar Nacional - Encontro de Águas de Lindóia (2023)&#10;Melhor V8 Restaurado - Autódromo de Interlagos"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#141C15] text-[#E8ECE8] rounded-xl border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5 text-red-300 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>
                  Tem certeza que deseja remover <strong>{vehicle.brand} {vehicle.model}</strong> do acervo? Esta ação não pode ser desfeita.
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#141C15] text-xs font-medium text-[#8EA290] hover:text-[#E8ECE8] border border-[#3B4D3A] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sim, Excluir</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-[#3B4D3A]/60 flex items-center justify-between">
            {onDeleteVehicle && !showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remover Veículo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#141C15] hover:bg-[#263628] text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] border border-[#3B4D3A] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Veículo Atualizado!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#121713]" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
