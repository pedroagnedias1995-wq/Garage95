import React, { useState, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Car, 
  Wrench, 
  DollarSign, 
  MapPin, 
  Check, 
  Sparkles, 
  FileCheck, 
  Truck, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  AlertCircle, 
  Star,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarketplaceListing, ListingCondition, User, Vehicle, PostMedia } from '../types';
import { MediaLightboxModal } from './MediaLightboxModal';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: MarketplaceListing) => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

const MAX_MEDIA = 20;

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  currentUser,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<'veiculo' | 'peca' | 'acessorio' | 'memorabilia'>('veiculo');
  const [selectedGarageVehicleId, setSelectedGarageVehicleId] = useState('');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(1975);
  const [condition, setCondition] = useState<ListingCondition>('100% Original Placa Preta');
  const [price, setPrice] = useState<number>(180000);
  const [location, setLocation] = useState(currentUser?.location || 'São Paulo, SP');
  const [description, setDescription] = useState('');
  const [certificateIncluded, setCertificateIncluded] = useState(true);
  const [shippingAvailable, setShippingAvailable] = useState(false);

  // Up to 20 Media items (photos & videos)
  const [mediaList, setMediaList] = useState<PostMedia[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [warningMessage, setWarningMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectGarageCar = (vehicleId: string) => {
    setSelectedGarageVehicleId(vehicleId);
    const v = userVehicles.find(item => item.id === vehicleId);
    if (v) {
      setTitle(`${v.year} ${v.brand} ${v.model} Placa Preta`);
      setBrand(v.brand);
      setModel(v.model);
      setYear(v.year);
      setDescription(`Veículo impecável da minha garagem particular. ${v.restorationHistory || ''} Motor ${v.engine || ''}, ${v.horsepower || 0}cv.`);
      setCondition(v.plateType === 'preta' ? '100% Original Placa Preta' : 'Restaurado Concours');

      // Import all vehicle photos
      const vehiclePhotos = [v.coverPhoto, ...(v.photos || [])].filter(Boolean);
      const uniquePhotos = Array.from(new Set(vehiclePhotos));
      const newItems: PostMedia[] = uniquePhotos.slice(0, MAX_MEDIA).map((photoUrl, idx) => ({
        type: 'image',
        url: photoUrl,
        caption: `${v.brand} ${v.model} - Foto ${idx + 1}`
      }));

      if (v.videoUrl && newItems.length < MAX_MEDIA) {
        newItems.push({
          type: 'video',
          url: v.videoUrl,
          caption: `Vídeo do ${v.model}`
        });
      }

      if (newItems.length > 0) {
        setMediaList(newItems);
        setPreviewIndex(0);
      }
    }
  };

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setWarningMessage('');
    const availableSlots = MAX_MEDIA - mediaList.length;
    if (availableSlots <= 0) {
      setWarningMessage(`Limite máximo de ${MAX_MEDIA} fotos/vídeos atingido.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots) as File[];
    if (files.length > availableSlots) {
      setWarningMessage(`Apenas ${availableSlots} arquivo(s) adicionados para respeitar o limite de ${MAX_MEDIA}.`);
    }

    const readFilesPromises = filesToProcess.map((file: File) => {
      return new Promise<PostMedia>((resolve) => {
        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            type: isVideo ? 'video' : 'image',
            url: (event.target?.result as string) || '',
            caption: file.name.replace(/\.[^/.]+$/, '')
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFilesPromises).then((newItems) => {
      const validItems = newItems.filter(item => Boolean(item.url));
      setMediaList((prev) => [...prev, ...validItems].slice(0, MAX_MEDIA));
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleAddFromUrl = () => {
    if (!urlInput.trim()) return;
    if (mediaList.length >= MAX_MEDIA) {
      setWarningMessage(`Limite máximo de ${MAX_MEDIA} fotos/vídeos atingido.`);
      return;
    }

    const isVideo = urlType === 'video' || urlInput.endsWith('.mp4') || urlInput.endsWith('.webm');
    const newItem: PostMedia = {
      type: isVideo ? 'video' : 'image',
      url: urlInput.trim(),
      caption: `Mídia #${mediaList.length + 1}`
    };

    setMediaList((prev) => [...prev, newItem]);
    setUrlInput('');
    setWarningMessage('');
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (previewIndex >= updated.length && updated.length > 0) {
        setPreviewIndex(updated.length - 1);
      }
      return updated;
    });
  };

  const handleMoveMedia = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= mediaList.length) return;
    setMediaList((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    setPreviewIndex(toIndex);
  };

  const handleSetCover = (index: number) => {
    handleMoveMedia(index, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    const fallbackPhotos = mediaList.map(m => m.url).filter(Boolean);
    const photosArray = fallbackPhotos.length > 0 ? fallbackPhotos : ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200&auto=format&fit=crop&q=80'];

    const newListing: MarketplaceListing = {
      id: `mkt_${Date.now()}`,
      seller: currentUser,
      title,
      category,
      condition,
      price: Number(price),
      currency: 'BRL',
      location,
      brand: brand || 'Clássico',
      model: model || title,
      year: year ? Number(year) : undefined,
      description: description || 'Anúncio publicado no Marketplace Garage 95.',
      photos: photosArray,
      media: mediaList.length > 0 ? mediaList : undefined,
      status: 'active',
      views: 1,
      savesCount: 0,
      isSaved: false,
      isFeatured: true,
      certificateIncluded,
      shippingAvailable
    };

    onAddListing(newListing);

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

  const currentPreview = mediaList[previewIndex] || mediaList[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                Criar Anúncio no Marketplace
              </h3>
              <p className="text-xs text-[#8EA290]">Venda para colecionadores e entusiastas qualificados.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#263628] text-[#8EA290] hover:text-[#E8ECE8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[78vh] overflow-y-auto custom-scrollbar">
          
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#D4AF37] mb-2">Categoria do Anúncio</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'veiculo', label: 'Veículo Completo', icon: Car },
                { id: 'peca', label: 'Peça Rara', icon: Wrench },
                { id: 'acessorio', label: 'Acessório', icon: Sparkles },
                { id: 'memorabilia', label: 'Memorabilia', icon: FileCheck }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategory(tab.id as typeof category)}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#263628] text-[#F3E5AB] border-[#D4AF37]'
                        : 'bg-[#141C15] text-[#8EA290] border-[#3B4D3A] hover:text-[#E8ECE8]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Import from Garage if vehicle */}
          {category === 'veiculo' && userVehicles.length > 0 && (
            <div className="p-3 bg-[#1A241C] border border-[#3B4D3A] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-semibold text-[#D4AF37] mb-1">
                  Importar dados e galeria da sua Garagem:
                </label>
                <select
                  value={selectedGarageVehicleId}
                  onChange={(e) => handleSelectGarageCar(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Selecione um carro para preenchimento automático...</option>
                  {userVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.year}) — {(v.photos?.length || 0) + 1} fotos
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1">Título do Anúncio *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 1969 Dodge Charger R/T 440 Magnum Placa Preta"
              className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Dodge, Ford, Weber"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Modelo / Versão</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Charger R/T"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Ano (se aplicável)</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Estado de Conservação</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="100% Original Placa Preta">100% Original Placa Preta</option>
                <option value="Restaurado Concours">Restaurado Concours</option>
                <option value="Excelente Estado">Excelente Estado</option>
                <option value="Projeto para Restauração">Projeto para Restauração</option>
                <option value="Customizado / Restomod">Customizado / Restomod</option>
                <option value="Novo / Sem Uso">Novo / Sem Uso</option>
                <option value="Usado Original de Época">Usado Original de Época</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] mb-1">Preço Desejado (R$) *</label>
              <input
                type="number"
                required
                min={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono font-bold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Media Section (Up to 20 Photos and Videos in Carousel) */}
          <div className="p-4 bg-[#141C15] border border-[#3B4D3A]/70 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#F3E5AB]">
                  Galeria do Anúncio (Até 20 fotos e vídeos com carrossel)
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                mediaList.length >= MAX_MEDIA 
                  ? 'bg-amber-900/60 text-amber-300 border-amber-500' 
                  : 'bg-[#263628] text-[#D4AF37] border-[#D4AF37]/40'
              }`}>
                {mediaList.length} / {MAX_MEDIA} fotos e vídeos
              </span>
            </div>

            {warningMessage && (
              <div className="p-2.5 bg-amber-950/70 border border-amber-600/60 rounded-xl flex items-center gap-2 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMultipleFiles}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaList.length >= MAX_MEDIA}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  mediaList.length >= MAX_MEDIA
                    ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                    : 'bg-[#1D2B20] hover:bg-[#283B2C] text-[#F3E5AB] border border-[#D4AF37]/60 hover:border-[#D4AF37]'
                }`}
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Carregar Fotos & Vídeos (Múltipla seleção)</span>
              </button>
            </div>

            {/* URL Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex bg-[#121713] p-1 rounded-xl border border-[#3B4D3A]/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setUrlType('image')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    urlType === 'image'
                      ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/50'
                      : 'text-[#8EA290]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrlType('video')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    urlType === 'video'
                      ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/50'
                      : 'text-[#8EA290]'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>Vídeo</span>
                </button>
              </div>

              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={urlType === 'video' ? 'Cole link de vídeo MP4 do veículo...' : 'Cole link de foto (URL)...'}
                className="flex-1 px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />

              <button
                type="button"
                onClick={handleAddFromUrl}
                disabled={!urlInput.trim() || mediaList.length >= MAX_MEDIA}
                className="px-4 py-2 bg-[#263628] hover:bg-[#344b37] disabled:opacity-50 text-[#F3E5AB] border border-[#D4AF37]/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Live Carousel Preview inside modal */}
            {mediaList.length > 0 && currentPreview ? (
              <div className="mt-3 pt-3 border-t border-[#3B4D3A]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#A2B5A4] font-medium">
                    Pré-visualização do Carrossel do Anúncio ({previewIndex + 1} de {mediaList.length})
                  </span>
                  {previewIndex === 0 && (
                    <span className="text-[10px] bg-[#C9A227] text-[#121713] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-[#121713]" /> Foto Principal da Capa
                    </span>
                  )}
                </div>

                <div className="relative aspect-[16/9] bg-black rounded-2xl overflow-hidden border border-[#3B4D3A] group">
                  {currentPreview.type === 'video' || currentPreview.url.includes('.mp4') ? (
                    <video
                      src={currentPreview.url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentPreview.url}
                      alt={currentPreview.caption || 'Foto do anúncio'}
                      className="w-full h-full object-cover cursor-pointer"
                      referrerPolicy="no-referrer"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  )}

                  {/* Top Zoom button */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/50 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow-md transition-all cursor-pointer"
                      title="Ampliar pré-visualização"
                    >
                      <ZoomIn className="w-3 h-3 text-[#D4AF37]" />
                      <span>Ampliar</span>
                    </button>
                  </div>

                  {/* Carousel Overlay Arrows */}
                  {mediaList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((prev) => (prev + 1) % mediaList.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                        {mediaList.slice(0, 10).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              previewIndex === i ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails list with Reordering, Set as Cover, & Deletion */}
                <div className="mt-3">
                  <p className="text-[10px] text-[#8EA290] mb-1.5">
                    Fotos e vídeos (o 1º item é a capa do anúncio no marketplace):
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {mediaList.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewIndex(idx)}
                        className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                          previewIndex === idx
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105'
                            : 'border-[#3B4D3A] opacity-75 hover:opacity-100'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full bg-[#101411] flex items-center justify-center relative">
                            <video src={item.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Video className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}

                        <span className={`absolute bottom-1 left-1 px-1 rounded text-[9px] font-mono font-bold ${
                          idx === 0 ? 'bg-[#C9A227] text-[#121713]' : 'bg-black/80 text-[#F3E5AB]'
                        }`}>
                          {idx === 0 ? 'Capa' : `#${idx + 1}`}
                        </span>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                          <div className="flex justify-between items-center">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCover(idx);
                                }}
                                className="p-0.5 bg-[#C9A227] text-[#121713] text-[9px] font-bold rounded cursor-pointer"
                                title="Definir como Capa"
                              >
                                <Star className="w-3 h-3 fill-[#121713]" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMedia(idx);
                              }}
                              className="p-1 bg-red-900/80 hover:bg-red-700 text-white rounded cursor-pointer ml-auto"
                              title="Remover"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveMedia(idx, idx - 1);
                              }}
                              className="p-0.5 bg-black/80 hover:bg-[#263628] disabled:opacity-30 text-[#F3E5AB] rounded cursor-pointer"
                              title="Mover para esquerda"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === mediaList.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveMedia(idx, idx + 1);
                              }}
                              className="p-0.5 bg-black/80 hover:bg-[#263628] disabled:opacity-30 text-[#F3E5AB] rounded cursor-pointer"
                              title="Mover para direita"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 px-4 rounded-xl border border-dashed border-[#3B4D3A] text-center bg-[#101511]/60">
                <ImageIcon className="w-8 h-8 text-[#8EA290]/50 mx-auto mb-2" />
                <p className="text-xs text-[#F3E5AB] font-medium">Nenhuma mídia carregada para este anúncio</p>
                <p className="text-[11px] text-[#8EA290] mt-0.5">
                  Carregue as fotos reais e vídeos do item para montar o carrossel do anúncio.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Localização (Cidade, UF)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Curitiba, PR"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Descrição Breve</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Carro impecável, placa preta, motor revisado..."
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs text-[#B4C4B6] cursor-pointer">
              <input
                type="checkbox"
                checked={certificateIncluded}
                onChange={(e) => setCertificateIncluded(e.target.checked)}
                className="rounded border-[#3B4D3A] text-[#C9A227] focus:ring-[#D4AF37]"
              />
              <span>Acompanha Certificado de Originalidade FIVA / Placa Preta</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#B4C4B6] cursor-pointer">
              <input
                type="checkbox"
                checked={shippingAvailable}
                onChange={(e) => setShippingAvailable(e.target.checked)}
                className="rounded border-[#3B4D3A] text-[#C9A227] focus:ring-[#D4AF37]"
              />
              <span>Disponível para envio/frete seguro em prancha</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#3B4D3A]/60 flex items-center justify-between">
            <span className="text-[11px] text-[#8EA290]">
              {mediaList.length > 1 ? `Carrossel com ${mediaList.length} fotos/vídeos` : `${mediaList.length} mídia anexada`}
            </span>
            <div className="flex items-center gap-3">
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
                <span>Publicar Anúncio</span>
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* Lightbox Preview Modal */}
      {isLightboxOpen && mediaList.length > 0 && (
        <MediaLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          media={mediaList}
          initialIndex={previewIndex}
          title={title || 'Prévia das Fotos do Anúncio'}
        />
      )}
    </div>
  );
};
