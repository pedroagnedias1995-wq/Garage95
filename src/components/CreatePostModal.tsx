import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Car, 
  MapPin, 
  Sparkles, 
  Send, 
  Upload, 
  Tag, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Layers,
  AlertCircle,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import { User, Vehicle, Post, PostMedia } from '../types';
import { MediaLightboxModal } from './MediaLightboxModal';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: Post) => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

const MAX_MEDIA = 20;

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  currentUser,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [content, setContent] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(userVehicles[0]?.id || '');
  const [location, setLocation] = useState('São Paulo, SP');
  const [hashtags, setHashtags] = useState('#classicos #placapreta #v8 #garage95');
  const [soundTrackTitle, setSoundTrackTitle] = useState('V8 Pure Engine Sound Experience');

  const [mediaList, setMediaList] = useState<PostMedia[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [urlCaption, setUrlCaption] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      caption: urlCaption.trim() || undefined
    };

    setMediaList((prev) => [...prev, newItem]);
    setUrlInput('');
    setUrlCaption('');
    setWarningMessage('');
  };

  const handleImportVehiclePhotos = () => {
    const veh = userVehicles.find(v => v.id === selectedVehicleId);
    if (!veh) return;

    const availableSlots = MAX_MEDIA - mediaList.length;
    if (availableSlots <= 0) {
      setWarningMessage(`Limite máximo de ${MAX_MEDIA} fotos/vídeos atingido.`);
      return;
    }

    const allVehiclePhotos = [veh.coverPhoto, ...(veh.photos || [])].filter(Boolean);
    const uniquePhotos = Array.from(new Set(allVehiclePhotos));

    const newMedias: PostMedia[] = uniquePhotos.slice(0, availableSlots).map((p, idx) => ({
      type: 'image',
      url: p,
      caption: `${veh.brand} ${veh.model} (${veh.year}) — Foto ${idx + 1}`
    }));

    if (veh.videoUrl && newMedias.length < availableSlots) {
      newMedias.push({
        type: 'video',
        url: veh.videoUrl,
        caption: `Vídeo oficial do ${veh.model}`
      });
    }

    setMediaList((prev) => [...prev, ...newMedias].slice(0, MAX_MEDIA));
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

  const handleUpdateCaption = (index: number, caption: string) => {
    setMediaList((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], caption };
      }
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const taggedVehicle = userVehicles.find(v => v.id === selectedVehicleId);

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      vehicleTagged: taggedVehicle,
      content,
      media: mediaList,
      createdAt: 'Agora mesmo',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: hashtags ? hashtags.split(' ').filter(h => h.startsWith('#')) : [],
      isExclusiveClub: true,
      location,
      soundTrackTitle: soundTrackTitle || undefined
    };

    onAddPost(newPost);
    onClose();
  };

  const currentPreview = mediaList[previewIndex] || mediaList[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#172018] border border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-10 h-10 rounded-2xl object-cover border border-[#D4AF37]"
            />
            <div>
              <h3 className="font-semibold text-sm text-[#F3E5AB]">{currentUser.name}</h3>
              <p className="text-[11px] text-[#D4AF37] font-mono font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Nova Publicação com Carrossel (Até 20 fotos e vídeos)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#263628] text-[#8EA290] hover:text-[#E8ECE8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto custom-scrollbar">
          
          {/* Post Caption */}
          <div>
            <label className="block text-xs font-semibold text-[#8EA290] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Legenda ou História da Publicação *
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compartilhe a história do seu passeio, restauração, acerto mecânico ou detalhes do veículo..."
              className="w-full p-3 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs sm:text-sm text-[#E8ECE8] placeholder-[#7E9180] focus:border-[#D4AF37] focus:outline-none resize-none"
            />
          </div>

          {/* Media Section Header with Counter */}
          <div className="space-y-3 p-4 bg-[#141C15] border border-[#3B4D3A]/70 rounded-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#F3E5AB]">
                  Carrossel de Mídias (Fotos e Vídeos)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  mediaList.length >= MAX_MEDIA 
                    ? 'bg-amber-900/60 text-amber-300 border-amber-500' 
                    : 'bg-[#263628] text-[#D4AF37] border-[#D4AF37]/40'
                }`}>
                  {mediaList.length} / {MAX_MEDIA} itens
                </span>
                {mediaList.length > 1 && (
                  <span className="text-[10px] bg-[#1B271D] text-[#A2B5A4] px-2 py-0.5 rounded-md border border-[#3B4D3A]">
                    Formato Carrossel Ativo
                  </span>
                )}
              </div>
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
                <span>Carregar Fotos & Vídeos (Múltipla seleção até 20)</span>
              </button>

              {userVehicles.length > 0 && selectedVehicleId && (
                <button
                  type="button"
                  onClick={handleImportVehiclePhotos}
                  disabled={mediaList.length >= MAX_MEDIA}
                  className="py-2.5 px-3 rounded-xl bg-[#1A251C] hover:bg-[#233326] text-[#D4AF37] border border-[#3B4D3A] hover:border-[#D4AF37] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Importar Fotos do Veículo</span>
                </button>
              )}
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
                placeholder={urlType === 'video' ? 'Cole link direto de vídeo MP4/WebM...' : 'Cole link de imagem (URL)...'}
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
                  <span className="text-[11px] text-[#A2B5A4] font-medium flex items-center gap-1">
                    Pré-visualização do Carrossel ({previewIndex + 1} de {mediaList.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    {currentPreview.type === 'video' ? '🎥 Vídeo' : '📷 Foto'}
                  </span>
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
                      alt={currentPreview.caption || 'Prévia'}
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
                        {mediaList.length > 10 && (
                          <span className="text-[9px] font-mono text-white/80 bg-black/60 px-1 rounded">
                            +{mediaList.length - 10}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Caption input for active slide */}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={currentPreview.caption || ''}
                    onChange={(e) => handleUpdateCaption(previewIndex, e.target.value)}
                    placeholder={`Legenda para esta mídia #${previewIndex + 1}...`}
                    className="flex-1 px-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Thumbnails list with Reordering & Deletion */}
                <div className="mt-3">
                  <p className="text-[10px] text-[#8EA290] mb-1.5">
                    Mídias do carrossel (clique para pré-visualizar, reordenar ou remover):
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

                        <span className="absolute bottom-1 left-1 bg-black/80 px-1 rounded text-[9px] font-mono text-[#F3E5AB]">
                          #{idx + 1}
                        </span>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMedia(idx);
                              }}
                              className="p-1 bg-red-900/80 hover:bg-red-700 text-white rounded cursor-pointer"
                              title="Remover mídia"
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
                <p className="text-xs text-[#F3E5AB] font-medium">Nenhuma foto ou vídeo carregado ainda</p>
                <p className="text-[11px] text-[#8EA290] mt-0.5">
                  Clique no botão acima para selecionar do seu dispositivo ou cole o link direto. Apenas as mídias que você carregar aparecerão na sua publicação.
                </p>
              </div>
            )}
          </div>

          {/* Select Vehicle from Garage */}
          {userVehicles.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] mb-1 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Marcar Veículo da sua Garagem (Opcional)
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="">Nenhum veículo marcado</option>
                {userVehicles.map((veh) => (
                  <option key={veh.id} value={veh.id}>
                    {veh.brand} {veh.model} ({veh.year}) — {veh.engine}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                Localização
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Serra da Graciosa, PR"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#mustang #anos70 #trackday"
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#3B4D3A]/60 flex items-center justify-between">
            <span className="text-[11px] text-[#8EA290]">
              {mediaList.length > 1 ? `Carrossel com ${mediaList.length} mídias` : `${mediaList.length} mídia anexada`}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Publicar no Feed</span>
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* Lightbox Preview */}
      {isLightboxOpen && mediaList.length > 0 && (
        <MediaLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          media={mediaList}
          initialIndex={previewIndex}
          title="Prévia das Mídias do Post"
        />
      )}
    </div>
  );
};
