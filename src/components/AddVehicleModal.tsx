import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Car, 
  Sparkles, 
  Upload, 
  Award, 
  Wrench, 
  Trophy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileText, 
  Gauge, 
  Camera, 
  Volume2, 
  DollarSign, 
  Plus, 
  Trash2, 
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Vehicle, 
  PlateType, 
  VehicleCategory, 
  VehicleStatus, 
  User, 
  RestorationStep, 
  VehicleTrophyItem 
} from '../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (newVehicle: Vehicle) => void;
  currentUser?: User;
  currentUserId?: string;
}

const AVAILABLE_DOCUMENT_OPTIONS = [
  'Nota Fiscal de Compra Original de Época',
  'Manual do Proprietário & Livreto de Revisões Original',
  'Chave Reserva Original de Fábrica',
  'Certificado FIVA Internacional',
  'Laudo de Originalidade para Placa Preta',
  'Laudo Cautelar 100% Aprovado',
  'Histórico de Manutenções & Notas Fiscais Guardadas'
];

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
  currentUser,
  currentUserId
}) => {
  if (!isOpen) return null;

  // -------------------------------------------------------------
  // 1. CAMPOS OBRIGATÓRIOS (ESSENCIAIS)
  // -------------------------------------------------------------
  const [coverPhoto, setCoverPhoto] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<number | ''>(1975);
  const [category, setCategory] = useState<VehicleCategory>('carro');
  const [color, setColor] = useState<string>('');
  const [plateType, setPlateType] = useState<PlateType>('preta');

  // -------------------------------------------------------------
  // 2. SEÇÕES OPCIONAIS RECOLHÍVEIS (ACCORDIONS)
  // -------------------------------------------------------------
  const [openSections, setOpenSections] = useState<{
    specs: boolean;
    authenticity: boolean;
    history: boolean;
    media: boolean;
    commercial: boolean;
  }>({
    specs: false,
    authenticity: false,
    history: false,
    media: false,
    commercial: false
  });

  const toggleSection = (sectionKey: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // -------------------------------------------------------------
  // 2. CAMPOS OPCIONAIS - FICHA TÉCNICA
  // -------------------------------------------------------------
  const [engine, setEngine] = useState<string>('');
  const [horsepower, setHorsepower] = useState<number | ''>('');
  const [torque, setTorque] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');
  const [transmissionOriginal, setTransmissionOriginal] = useState<boolean>(true);
  const [fuel, setFuel] = useState<string>('Gasolina');
  const [mileage, setMileage] = useState<number | ''>('');
  const [zeroToHundred, setZeroToHundred] = useState<string>('');
  const [topSpeed, setTopSpeed] = useState<string>('');

  // -------------------------------------------------------------
  // 3. CAMPOS OPCIONAIS - AUTENTICIDADE & PROCEDÊNCIA
  // -------------------------------------------------------------
  const [chassisMasked, setChassisMasked] = useState<string>('');
  const [matchingNumbers, setMatchingNumbers] = useState<boolean>(false);
  const [bodyworkScore, setBodyworkScore] = useState<number>(95);
  const [engineScore, setEngineScore] = useState<number>(95);
  const [interiorScore, setInteriorScore] = useState<number>(95);
  const [paintScore, setPaintScore] = useState<number>(95);
  const [previousOwnersCount, setPreviousOwnersCount] = useState<string>('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // -------------------------------------------------------------
  // 4. CAMPOS OPCIONAIS - HISTÓRIA & RARIDADE
  // -------------------------------------------------------------
  const [restorationHistory, setRestorationHistory] = useState<string>('');
  const [restorationTimeline, setRestorationTimeline] = useState<RestorationStep[]>([]);
  const [newTimelineDate, setNewTimelineDate] = useState<string>('');
  const [newTimelineDesc, setNewTimelineDesc] = useState<string>('');
  const [newTimelineWorkshop, setNewTimelineWorkshop] = useState<string>('');

  const [modifications, setModifications] = useState<string[]>([]);
  const [newModInput, setNewModInput] = useState<string>('');

  const [trophies, setTrophies] = useState<VehicleTrophyItem[]>([]);
  const [newTrophyTitle, setNewTrophyTitle] = useState<string>('');
  const [newTrophyYear, setNewTrophyYear] = useState<string>('');
  const [newTrophyEvent, setNewTrophyEvent] = useState<string>('');

  const [limitedEdition, setLimitedEdition] = useState<string>('');
  const [historicalCuriosity, setHistoricalCuriosity] = useState<string>('');

  // -------------------------------------------------------------
  // 5. CAMPOS OPCIONAIS - MÍDIA EXTRA
  // -------------------------------------------------------------
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [soundAudioUrl, setSoundAudioUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  // -------------------------------------------------------------
  // 6. CAMPOS OPCIONAIS - COMERCIAL (À VENDA)
  // -------------------------------------------------------------
  const [status, setStatus] = useState<VehicleStatus>('garage');
  const [valuationEstimate, setValuationEstimate] = useState<string>('');
  const [acceptsTrade, setAcceptsTrade] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(currentUser?.location || 'São Paulo - SP');

  // Modals & Upload inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // -------------------------------------------------------------
  // VALIDAÇÕES & PROGRESSO
  // -------------------------------------------------------------
  const isCoverPhotoValid = Boolean(coverPhoto.trim());
  const isBrandValid = Boolean(brand.trim());
  const isModelValid = Boolean(model.trim());
  const isYearValid = Boolean(year && Number(year) >= 1900 && Number(year) <= 2026);
  const isCategoryValid = Boolean(category);
  const isColorValid = Boolean(color.trim());
  const isPlateTypeValid = Boolean(plateType);

  const isFormValid = (
    isCoverPhotoValid &&
    isBrandValid &&
    isModelValid &&
    isYearValid &&
    isCategoryValid &&
    isColorValid &&
    isPlateTypeValid
  );

  // Calculate profile completion percentage
  const calculatedCompletion = useMemo(() => {
    let score = 0;
    const weights = {
      // 7 Essential (35% total)
      essentials: 35,
      // Specs (20%)
      specs: 20,
      // Authenticity (20%)
      authenticity: 20,
      // History (15%)
      history: 15,
      // Media & Commerce (10%)
      extras: 10
    };

    // Check essential 7
    let validEssentialCount = 0;
    if (isCoverPhotoValid) validEssentialCount++;
    if (isBrandValid) validEssentialCount++;
    if (isModelValid) validEssentialCount++;
    if (isYearValid) validEssentialCount++;
    if (isCategoryValid) validEssentialCount++;
    if (isColorValid) validEssentialCount++;
    if (isPlateTypeValid) validEssentialCount++;
    score += Math.round((validEssentialCount / 7) * weights.essentials);

    // Specs
    let specFields = 0;
    if (engine) specFields++;
    if (horsepower) specFields++;
    if (torque) specFields++;
    if (transmission) specFields++;
    if (mileage) specFields++;
    if (zeroToHundred || topSpeed) specFields++;
    if (specFields > 0) {
      score += Math.round((Math.min(specFields, 5) / 5) * weights.specs);
    }

    // Authenticity
    let authFields = 0;
    if (chassisMasked) authFields++;
    if (matchingNumbers) authFields++;
    if (previousOwnersCount) authFields++;
    if (selectedDocuments.length > 0) authFields++;
    if (authFields > 0) {
      score += Math.round((Math.min(authFields, 4) / 4) * weights.authenticity);
    }

    // History
    let histFields = 0;
    if (restorationHistory || restorationTimeline.length > 0) histFields++;
    if (modifications.length > 0) histFields++;
    if (trophies.length > 0) histFields++;
    if (limitedEdition || historicalCuriosity) histFields++;
    if (histFields > 0) {
      score += Math.round((Math.min(histFields, 4) / 4) * weights.history);
    }

    // Extras
    let extraFields = 0;
    if (extraPhotos.length > 0) extraFields++;
    if (soundAudioUrl || videoUrl) extraFields++;
    if (status === 'for_sale' && valuationEstimate) extraFields++;
    if (extraFields > 0) {
      score += Math.round((Math.min(extraFields, 2) / 2) * weights.extras);
    }

    return Math.min(score, 100);
  }, [
    isCoverPhotoValid, isBrandValid, isModelValid, isYearValid, isCategoryValid, isColorValid, isPlateTypeValid,
    engine, horsepower, torque, transmission, mileage, zeroToHundred, topSpeed,
    chassisMasked, matchingNumbers, previousOwnersCount, selectedDocuments,
    restorationHistory, restorationTimeline, modifications, trophies, limitedEdition, historicalCuriosity,
    extraPhotos, soundAudioUrl, videoUrl, status, valuationEstimate
  ]);

  // Overall authenticity score calculated
  const computedAuthenticityScore = Math.round(
    (bodyworkScore + engineScore + interiorScore + paintScore) / 4
  );

  // -------------------------------------------------------------
  // FILE UPLOAD HANDLERS
  // -------------------------------------------------------------
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverPhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtraPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            const base64 = uploadEvent.target.result as string;
            setExtraPhotos(prev => [...prev, base64]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveExtraPhoto = (indexToRemove: number) => {
    setExtraPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Timeline add helper
  const handleAddTimelineStep = () => {
    if (newTimelineDate.trim() && newTimelineDesc.trim()) {
      setRestorationTimeline(prev => [
        ...prev,
        {
          date: newTimelineDate.trim(),
          description: newTimelineDesc.trim(),
          workshop: newTimelineWorkshop.trim() || undefined
        }
      ]);
      setNewTimelineDate('');
      setNewTimelineDesc('');
      setNewTimelineWorkshop('');
    }
  };

  // Mod add helper
  const handleAddMod = () => {
    if (newModInput.trim()) {
      setModifications(prev => [...prev, newModInput.trim()]);
      setNewModInput('');
    }
  };

  // Trophy add helper
  const handleAddTrophy = () => {
    if (newTrophyTitle.trim()) {
      setTrophies(prev => [
        ...prev,
        {
          title: newTrophyTitle.trim(),
          year: newTrophyYear.trim() || undefined,
          event: newTrophyEvent.trim() || undefined
        }
      ]);
      setNewTrophyTitle('');
      setNewTrophyYear('');
      setNewTrophyEvent('');
    }
  };

  // Document checkbox toggle
  const toggleDocument = (docName: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docName) ? prev.filter(d => d !== docName) : [...prev, docName]
    );
  };

  // -------------------------------------------------------------
  // SUBMIT HANDLER
  // -------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }

    const allPhotos = [coverPhoto, ...extraPhotos.filter(p => p !== coverPhoto)];

    const newVehicle: Vehicle = {
      id: `veh_${Date.now()}`,
      ownerId: currentUser?.id || currentUserId || 'u_curator_1',
      ownerName: currentUser?.name || 'Membro do Clube',
      ownerAvatar: currentUser?.avatar || '',
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      category,
      plateType,
      color: color.trim(),
      coverPhoto,
      photos: allPhotos,
      status,

      // Ficha Técnica
      engine: engine.trim() || 'Motor clássico original de época',
      horsepower: horsepower ? Number(horsepower) : 100,
      torque: torque.trim() || undefined,
      transmission: transmission.trim() || 'Manual clássico',
      transmissionOriginal,
      fuel,
      mileage: mileage ? Number(mileage) : 50000,
      zeroToHundred: zeroToHundred.trim() || undefined,
      topSpeed: topSpeed.trim() || undefined,

      // Autenticidade
      chassisMasked: chassisMasked.trim() || undefined,
      matchingNumbers,
      authenticityScore: computedAuthenticityScore,
      authenticityBreakdown: {
        bodywork: bodyworkScore,
        engine: engineScore,
        interior: interiorScore,
        paint: paintScore
      },
      previousOwnersCount: previousOwnersCount.trim() || undefined,
      documentsAvailable: selectedDocuments,

      // História
      restorationHistory: restorationHistory.trim() || 'Cadastrado no acervo Garage 95.',
      restorationTimeline: restorationTimeline.length > 0 ? restorationTimeline : undefined,
      modifications: modifications.length > 0 ? modifications : undefined,
      trophies: trophies.map(t => `${t.title}${t.year ? ` (${t.year})` : ''}`),
      trophiesStructured: trophies.length > 0 ? trophies : undefined,
      limitedEdition: limitedEdition.trim() || undefined,
      historicalCuriosity: historicalCuriosity.trim() || undefined,

      // Mídia
      soundAudioUrl: soundAudioUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,

      // Comercial
      valuationEstimate: valuationEstimate.trim() || undefined,
      acceptsTrade: status === 'for_sale' ? acceptsTrade : undefined,
      location: location.trim() || undefined
    };

    onAddVehicle(newVehicle);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C9A227', '#4F6650', '#F3E5AB', '#FFFFFF']
      });
    } catch {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#162018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#3B4D3A]/60 bg-[#131A14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C9A227]/30 to-[#1C291E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
              <Car className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-serif-heading font-black text-lg sm:text-xl text-[#F3E5AB]">
                Cadastrar Veículo
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#263628] text-[#8EA290] hover:text-[#E8ECE8] transition-colors cursor-pointer"
            title="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* FORM CONTENT (SCROLLABLE) */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">

          {/* ------------------------------------------------------- */}
          {/* SEÇÃO 1: CAMPOS OBRIGATÓRIOS (DESTAQUE) */}
          {/* ------------------------------------------------------- */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1B271D] to-[#151F17] border-2 border-[#D4AF37]/40 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#F3E5AB]">
                  1. Dados Obrigatórios para Publicação
                </h4>
              </div>
            </div>

            {/* Campo 1: Foto de Capa (Obrigatório) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1">
                  Foto de Capa do Veículo <span className="text-[#D4AF37] font-black">*</span>
                  <span className="text-[10px] text-[#D4AF37] font-semibold ml-1">(Obrigatório)</span>
                </label>
                {coverPhoto && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Foto carregada
                  </span>
                )}
              </div>

              {coverPhoto ? (
                <div className="relative aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden border border-[#D4AF37]/50 group bg-black">
                  <img 
                    src={coverPhoto} 
                    alt="Preview do veículo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-bold rounded-lg border border-[#D4AF37]/60 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Trocar Imagem</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverPhoto('')}
                      className="px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold rounded-lg border border-red-500/50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${
                    showValidationErrors && !coverPhoto
                      ? 'border-red-500 bg-red-950/10'
                      : 'border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#121713] hover:bg-[#151D16]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-3.5 rounded-full bg-[#263628] text-[#D4AF37] group-hover:scale-110 mb-2.5 border border-[#D4AF37]/30 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#F3E5AB] group-hover:text-white mb-1 transition-colors">
                      Faça o upload da foto principal do seu clássico
                    </p>
                    <p className="text-[11px] text-[#8EA290] max-w-sm mb-3">
                      Clique para selecionar uma imagem do seu dispositivo (JPG, PNG ou WebP).
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#AA820A] text-[#121713] text-xs font-bold rounded-xl shadow-md hover:from-[#E5C158] hover:to-[#C9A227] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Selecionar Imagem do Dispositivo</span>
                    </button>
                  </div>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleCoverFileUpload} 
                className="hidden" 
              />

              {showValidationErrors && !coverPhoto && (
                <p className="text-[11px] text-red-400 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> É obrigatório incluir ao menos uma foto de capa para cadastrar o veículo.
                </p>
              )}
            </div>

            {/* Grid Campos 2 e 3: Marca e Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                  Marca / Fabricante <span className="text-[#D4AF37] font-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Ford, Chevrolet, Volkswagen, Puma, Dodge..."
                  className={`w-full px-3.5 py-2.5 bg-[#121713] border rounded-xl text-xs sm:text-sm text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none transition-colors ${
                    showValidationErrors && !brand.trim() ? 'border-red-500' : 'border-[#3B4D3A]'
                  }`}
                />
                {showValidationErrors && !brand.trim() && (
                  <p className="text-[11px] text-red-400 mt-1">Informe a marca do veículo.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                  Modelo & Versão <span className="text-[#D4AF37] font-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ex: Mustang Fastback GTA 390, Opala SS..."
                  className={`w-full px-3.5 py-2.5 bg-[#121713] border rounded-xl text-xs sm:text-sm text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none transition-colors ${
                    showValidationErrors && !model.trim() ? 'border-red-500' : 'border-[#3B4D3A]'
                  }`}
                />
                {showValidationErrors && !model.trim() && (
                  <p className="text-[11px] text-red-400 mt-1">Informe o modelo e a versão.</p>
                )}
              </div>
            </div>

            {/* Grid Campos 4, 5, 6: Ano, Categoria, Cor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                  Ano de Fabricação <span className="text-[#D4AF37] font-black">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1900}
                  max={2026}
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
                  className={`w-full px-3 py-2.5 bg-[#121713] border rounded-xl text-xs sm:text-sm text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none transition-colors ${
                    showValidationErrors && (!year || Number(year) < 1900) ? 'border-red-500' : 'border-[#3B4D3A]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                  Categoria <span className="text-[#D4AF37] font-black">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2.5 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs sm:text-sm text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="carro">Carro Clássico / Esportivo</option>
                  <option value="moto">Moto Vintage / Custom</option>
                  <option value="outro">Utilitário / Caminhão / Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB] mb-1">
                  Cor / Acabamento <span className="text-[#D4AF37] font-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ex: Highland Green, Azul Pavão..."
                  className={`w-full px-3 py-2.5 bg-[#121713] border rounded-xl text-xs sm:text-sm text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none transition-colors ${
                    showValidationErrors && !color.trim() ? 'border-red-500' : 'border-[#3B4D3A]'
                  }`}
                />
                {showValidationErrors && !color.trim() && (
                  <p className="text-[11px] text-red-400 mt-1">Informe a cor do veículo.</p>
                )}
              </div>
            </div>

            {/* Campo 7: Tipo de Placa */}
            <div>
              <label className="block text-xs font-bold text-[#F3E5AB] mb-1.5">
                Tipo de Placa & Certificação <span className="text-[#D4AF37] font-black">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'preta', label: 'Placa Preta', desc: 'Coleção Brasil' },
                  { id: 'mercosul', label: 'Mercosul Coleção', desc: 'Padrão Cinza' },
                  { id: 'colecao', label: 'Certificado FIVA', desc: 'Internacional' },
                  { id: 'nao_informado', label: 'Não informado', desc: 'Prefiro omitir' }
                ].map((type) => {
                  const isSelected = plateType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPlateType(type.id as PlateType)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#263628] border-[#D4AF37] shadow-sm text-[#F3E5AB]'
                          : 'bg-[#121713] border-[#3B4D3A]/60 text-[#8EA290] hover:border-[#3B4D3A] hover:text-[#E8ECE8]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{type.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </div>
                      <span className="text-[10px] opacity-75 mt-0.5">{type.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* SEÇÕES RECOLHÍVEIS OPCIONAIS */}
          {/* ======================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#8EA290] uppercase tracking-wider">
                Dados Opcionais & Enriquecimento de Perfil
              </span>
              <span className="text-[11px] text-[#6E8070]">
                Expanda para preencher agora ou edite mais tarde
              </span>
            </div>

            {/* ----------------------------------------------------- */}
            {/* OPCIONAL 1: FICHA TÉCNICA */}
            {/* ----------------------------------------------------- */}
            <div className="rounded-xl bg-[#141C15] border border-[#3B4D3A]/70 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('specs')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1A241C] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                        Ficha Técnica & Motorização
                      </h5>
                      <span className="text-[10px] font-semibold text-[#8EA290] bg-[#1E2920] px-2 py-0.2 rounded-full border border-[#3B4D3A]">
                        Opcional
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8EA290]">
                      Motor, potência, torque, câmbio, hodômetro e aceleração.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(engine || horsepower || mileage) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/40">
                      Preenchido ✓
                    </span>
                  )}
                  {openSections.specs ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#8EA290]" />}
                </div>
              </button>

              {openSections.specs && (
                <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#121713] space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Motorização</label>
                      <input
                        type="text"
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        placeholder="Ex: 302ci (5.0L) Windsor V8 Quadrijet"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Potência (cv)</label>
                      <input
                        type="number"
                        value={horsepower}
                        onChange={(e) => setHorsepower(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ex: 197"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Torque Estimado</label>
                      <input
                        type="text"
                        value={torque}
                        onChange={(e) => setTorque(e.target.value)}
                        placeholder="Ex: 39.5 kgfm"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Câmbio / Transmissão</label>
                      <input
                        type="text"
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        placeholder="Ex: Manual 4 marchas Clark"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Tipo de Combustível</label>
                      <select
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Gasolina">Gasolina Comum</option>
                        <option value="Gasolina Podium">Gasolina Podium / Premium</option>
                        <option value="Etanol">Etanol / Álcool</option>
                        <option value="Dupla Carburação">Dupla Carburação</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#18221A] border border-[#3B4D3A]/40">
                    <input
                      type="checkbox"
                      id="transmission-orig"
                      checked={transmissionOriginal}
                      onChange={(e) => setTransmissionOriginal(e.target.checked)}
                      className="rounded border-[#3B4D3A] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="transmission-orig" className="text-xs text-[#E8ECE8] cursor-pointer">
                      Transmissão / Câmbio original de fábrica (sem conversão)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Hodômetro (km)</label>
                      <input
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ex: 48000"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">0 a 100 km/h</label>
                      <input
                        type="text"
                        value={zeroToHundred}
                        onChange={(e) => setZeroToHundred(e.target.value)}
                        placeholder="Ex: 8.5s"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Velocidade Máxima</label>
                      <input
                        type="text"
                        value={topSpeed}
                        onChange={(e) => setTopSpeed(e.target.value)}
                        placeholder="Ex: 190 km/h"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ----------------------------------------------------- */}
            {/* OPCIONAL 2: AUTENTICIDADE & PROCEDÊNCIA */}
            {/* ----------------------------------------------------- */}
            <div className="rounded-xl bg-[#141C15] border border-[#3B4D3A]/70 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('authenticity')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1A241C] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                        Autenticidade & Procedência
                      </h5>
                      <span className="text-[10px] font-semibold text-[#8EA290] bg-[#1E2920] px-2 py-0.2 rounded-full border border-[#3B4D3A]">
                        Opcional
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8EA290]">
                      Matching numbers, chassi protegido, histórico de donos e laudos.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(matchingNumbers || chassisMasked || selectedDocuments.length > 0) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/40">
                      Preenchido ✓
                    </span>
                  )}
                  {openSections.authenticity ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#8EA290]" />}
                </div>
              </button>

              {openSections.authenticity && (
                <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#121713] space-y-4 animate-in fade-in duration-150">
                  
                  {/* Supportive callout */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#263628]/80 to-[#1A241C] border border-[#D4AF37]/30 flex items-start gap-2.5 text-xs text-[#F3E5AB]">
                    <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>
                      Preencher estes dados aumenta a credibilidade, o selo de originalidade e o valor de apreciação histórica do seu exemplar no clube Garage 95.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">
                        Chassi / Motor Mascarado (Privacidade Segura)
                      </label>
                      <input
                        type="text"
                        value={chassisMasked}
                        onChange={(e) => setChassisMasked(e.target.value)}
                        placeholder="Ex: ***-7402 (apenas os 4 últimos dígitos)"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">
                        Histórico de Donos Conhecidos
                      </label>
                      <input
                        type="text"
                        value={previousOwnersCount}
                        onChange={(e) => setPreviousOwnersCount(e.target.value)}
                        placeholder="Ex: Único dono / 2º dono / Coleção familiar"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Matching Numbers Badge */}
                  <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    matchingNumbers 
                      ? 'bg-[#263829] border-[#D4AF37] shadow-inner' 
                      : 'bg-[#172018] border-[#3B4D3A]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="matching-numbers"
                        checked={matchingNumbers}
                        onChange={(e) => setMatchingNumbers(e.target.checked)}
                        className="rounded border-[#3B4D3A] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="matching-numbers" className="text-xs font-bold text-[#F3E5AB] cursor-pointer flex items-center gap-1.5">
                          <span>Matching Numbers (Motor e Chassi de Fábrica)</span>
                          {matchingNumbers && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#C9A227] text-[#121713]">
                              Certificado
                            </span>
                          )}
                        </label>
                        <p className="text-[11px] text-[#8EA290]">
                          O bloco do motor e o chassi mantêm a mesma numeração sequencial de saída de fábrica.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA290] mb-2">
                      Documentação & Comprovações Históricas Disponíveis:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_DOCUMENT_OPTIONS.map((doc, idx) => {
                        const isChecked = selectedDocuments.includes(doc);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleDocument(doc)}
                            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-[#263628] border-[#D4AF37]/60 text-[#F3E5AB]'
                                : 'bg-[#172018] border-[#3B4D3A]/50 text-[#8EA290] hover:text-[#E8ECE8]'
                            }`}
                          >
                            <span className="line-clamp-1">{doc}</span>
                            {isChecked && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ----------------------------------------------------- */}
            {/* OPCIONAL 3: HISTÓRIA & RARIDADE */}
            {/* ----------------------------------------------------- */}
            <div className="rounded-xl bg-[#141C15] border border-[#3B4D3A]/70 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('history')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1A241C] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                        História, Restauração & Concursos
                      </h5>
                      <span className="text-[10px] font-semibold text-[#8EA290] bg-[#1E2920] px-2 py-0.2 rounded-full border border-[#3B4D3A]">
                        Opcional
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8EA290]">
                      Linha do tempo de restauro, modificações, prêmios e curiosidades históricas.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(restorationHistory || restorationTimeline.length > 0 || trophies.length > 0) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/40">
                      Preenchido ✓
                    </span>
                  )}
                  {openSections.history ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#8EA290]" />}
                </div>
              </button>

              {openSections.history && (
                <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#121713] space-y-4 animate-in fade-in duration-150">
                  
                  {/* Resumo do histórico */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA290] mb-1">
                      Memorial Descritivo / Histórico de Conservação
                    </label>
                    <textarea
                      rows={3}
                      value={restorationHistory}
                      onChange={(e) => setRestorationHistory(e.target.value)}
                      placeholder="Conte a história do exemplar, detalhes de originalidade da carroceria, tapeçaria ou oficina responsável..."
                      className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  {/* Linha do tempo de restauração */}
                  <div className="p-3.5 rounded-xl bg-[#172018] border border-[#3B4D3A]/60 space-y-3">
                    <label className="block text-xs font-bold text-[#F3E5AB]">
                      Etapas da Restauração (Linha do Tempo):
                    </label>

                    {restorationTimeline.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {restorationTimeline.map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#121713] border border-[#3B4D3A] text-xs">
                            <div>
                              <span className="font-bold text-[#D4AF37] font-mono mr-2">{step.date}</span>
                              <span className="text-[#E8ECE8]">{step.description}</span>
                              {step.workshop && (
                                <span className="text-[#8EA290] text-[11px] block mt-0.5">Oficina: {step.workshop}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setRestorationTimeline(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Ano/Mês (ex: 2021)"
                        value={newTimelineDate}
                        onChange={(e) => setNewTimelineDate(e.target.value)}
                        className="px-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Descrição da etapa (ex: Funilaria artesanal)"
                        value={newTimelineDesc}
                        onChange={(e) => setNewTimelineDesc(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTimelineStep}
                        className="px-3 py-1.5 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-bold rounded-lg border border-[#D4AF37]/50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>

                  {/* Troféus & Concursos */}
                  <div className="p-3.5 rounded-xl bg-[#172018] border border-[#3B4D3A]/60 space-y-3">
                    <label className="block text-xs font-bold text-[#F3E5AB]">
                      Prêmios, Troféus & Destaques em Eventos:
                    </label>

                    {trophies.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {trophies.map((tr, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#121713] border border-[#3B4D3A] text-xs">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                              <span className="font-bold text-[#F3E5AB]">{tr.title}</span>
                              {tr.event && <span className="text-[#8EA290]">({tr.event})</span>}
                              {tr.year && <span className="font-mono text-[#D4AF37]">[{tr.year}]</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setTrophies(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Título do Prêmio (ex: 1º Lugar Nacional)"
                        value={newTrophyTitle}
                        onChange={(e) => setNewTrophyTitle(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Evento / Ano (ex: Águas de Lindóia 2022)"
                        value={newTrophyEvent}
                        onChange={(e) => setNewTrophyEvent(e.target.value)}
                        className="px-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-lg text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTrophy}
                        className="px-3 py-1.5 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-bold rounded-lg border border-[#D4AF37]/50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>

                  {/* Edição Limitada & Curiosidade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Edição Limitada / Série Especial</label>
                      <input
                        type="text"
                        value={limitedEdition}
                        onChange={(e) => setLimitedEdition(e.target.value)}
                        placeholder="Ex: 1 de 500 unidades produzidas"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">Curiosidade Histórica</label>
                      <input
                        type="text"
                        value={historicalCuriosity}
                        onChange={(e) => setHistoricalCuriosity(e.target.value)}
                        placeholder="Ex: Participou de filme / pertenceu a personalidade"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ----------------------------------------------------- */}
            {/* OPCIONAL 4: MÍDIA EXTRA */}
            {/* ----------------------------------------------------- */}
            <div className="rounded-xl bg-[#141C15] border border-[#3B4D3A]/70 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('media')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1A241C] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                        Mídia Extra & Ronco do Motor
                      </h5>
                      <span className="text-[10px] font-semibold text-[#8EA290] bg-[#1E2920] px-2 py-0.2 rounded-full border border-[#3B4D3A]">
                        Opcional
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8EA290]">
                      Galeria de fotos detalhadas (interior, cofre do motor), áudio do ronco e vídeo.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(extraPhotos.length > 0 || soundAudioUrl || videoUrl) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-700/40">
                      Preenchido ✓
                    </span>
                  )}
                  {openSections.media ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#8EA290]" />}
                </div>
              </button>

              {openSections.media && (
                <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#121713] space-y-4 animate-in fade-in duration-150">
                  
                  {/* Extra Photos Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-[#F3E5AB] mb-2">
                      Fotos Adicionais da Galeria:
                    </label>

                    {extraPhotos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                        {extraPhotos.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#3B4D3A] group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExtraPhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => extraFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#263628] hover:bg-[#344837] text-[#F3E5AB] text-xs font-bold rounded-xl border border-[#D4AF37]/50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Selecionar Fotos Adicionais do Dispositivo</span>
                      </button>
                      <span className="text-[11px] text-[#8EA290]">
                        Formatos suportados: JPG, PNG, WebP (múltiplos arquivos)
                      </span>
                    </div>

                    <input 
                      ref={extraFileInputRef}
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleExtraPhotosUpload} 
                      className="hidden" 
                    />
                  </div>

                  {/* Audio & Video */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#3B4D3A]/40">
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Áudio do Ronco do Motor (URL ou preset)
                      </label>
                      <input
                        type="text"
                        value={soundAudioUrl}
                        onChange={(e) => setSoundAudioUrl(e.target.value)}
                        placeholder="Ex: ronco-v8-classic.mp3 (ou automático pelo modelo)"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Vídeo Demonstrativo (URL)
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Ex: https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ----------------------------------------------------- */}
            {/* OPCIONAL 5: COMERCIAL / MARKETPLACE */}
            {/* ----------------------------------------------------- */}
            <div className="rounded-xl bg-[#141C15] border border-[#3B4D3A]/70 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('commercial')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1A241C] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#263628] text-[#D4AF37] border border-[#3B4D3A]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-[#F3E5AB]">
                        Status & Comercial (À Venda / Coleção)
                      </h5>
                      <span className="text-[10px] font-semibold text-[#8EA290] bg-[#1E2920] px-2 py-0.2 rounded-full border border-[#3B4D3A]">
                        Opcional
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8EA290]">
                      Defina se o carro é apenas do acervo privado ou se está disponível para venda.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status === 'for_sale' && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-700/40">
                      À Venda
                    </span>
                  )}
                  {openSections.commercial ? <ChevronUp className="w-4 h-4 text-[#D4AF37]" /> : <ChevronDown className="w-4 h-4 text-[#8EA290]" />}
                </div>
              </button>

              {openSections.commercial && (
                <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#121713] space-y-4 animate-in fade-in duration-150">
                  
                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#8EA290] mb-1.5">
                      Status do Veículo na Rede:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'garage', label: 'Coleção Privada', desc: 'Apenas exibição no perfil' },
                        { id: 'for_sale', label: 'À Venda no Marketplace', desc: 'Exibir preço e contato' },
                        { id: 'restoring', label: 'Em Restauração', desc: 'Diário de projeto ativo' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStatus(st.id as VehicleStatus)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            status === st.id
                              ? 'bg-[#263628] border-[#D4AF37] text-[#F3E5AB] shadow-sm'
                              : 'bg-[#172018] border-[#3B4D3A]/60 text-[#8EA290] hover:text-[#E8ECE8]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{st.label}</span>
                            {status === st.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                          </div>
                          <span className="text-[10px] opacity-75 block mt-0.5">{st.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Only show pricing if For Sale */}
                  {status === 'for_sale' ? (
                    <div className="p-3.5 rounded-xl bg-[#1D291F] border border-[#D4AF37]/40 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                        <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                        <span>Dados do Anúncio Comercial:</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#F3E5AB] mb-1">Preço Solicitado / Estimativa</label>
                          <input
                            type="text"
                            value={valuationEstimate}
                            onChange={(e) => setValuationEstimate(e.target.value)}
                            placeholder="Ex: R$ 180.000"
                            className="w-full px-3 py-2 bg-[#121713] border border-[#D4AF37]/50 rounded-xl text-xs text-[#E8ECE8] font-bold focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#8EA290] mb-1">Localização para Visitação</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ex: Curitiba - PR"
                            className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="accepts-trade"
                          checked={acceptsTrade}
                          onChange={(e) => setAcceptsTrade(e.target.checked)}
                          className="rounded border-[#3B4D3A] text-[#D4AF37] focus:ring-[#D4AF37] w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="accepts-trade" className="text-xs text-[#E8ECE8] cursor-pointer">
                          Aceita troca por outro clássico de menor/maior valor
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-[#8EA290] mb-1">
                        Estimativa de Mercado Opcional (apenas para avaliação do acervo)
                      </label>
                      <input
                        type="text"
                        value={valuationEstimate}
                        onChange={(e) => setValuationEstimate(e.target.value)}
                        placeholder="Ex: R$ 150.000"
                        className="w-full px-3 py-2 bg-[#172018] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

        </form>

        {/* ========================================================= */}
        {/* STICKY ACTION FOOTER */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 border-t border-[#3B4D3A]/60 bg-[#131A14] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="text-left w-full sm:w-auto">
            {isFormValid ? (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Todos os 7 campos essenciais preenchidos! Pronto para publicar.</span>
              </p>
            ) : (
              <p className="text-xs text-[#8EA290] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#D4AF37]" />
                <span>Preencha os campos com <span className="text-[#D4AF37] font-black">*</span> para habilitar a publicação.</span>
              </p>
            )}
            <p className="text-[10px] text-[#6E8070] hidden sm:block">
              Você pode complementar ou alterar qualquer dado mais tarde na sua garagem.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] hover:bg-[#1E2920] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              id="btn-submit-vehicle"
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                isFormValid
                  ? 'bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] hover:scale-[1.02] shadow-[0_0_20px_rgba(201,162,39,0.35)]'
                  : 'bg-[#222E24] text-[#6E8070] border border-[#3B4D3A]/40 cursor-not-allowed opacity-75'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Publicar Veículo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
