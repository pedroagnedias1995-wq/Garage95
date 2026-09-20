import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Download, 
  Film, 
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PostMedia } from '../types';

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: PostMedia[];
  initialIndex?: number;
  title?: string;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
  title
}) => {
  if (!isOpen || !media || media.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync initial index
  useEffect(() => {
    setCurrentIndex(Math.min(Math.max(0, initialIndex), media.length - 1));
    resetZoom();
  }, [initialIndex, isOpen, media.length]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length, resetZoom]);

  const handlePrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length, resetZoom]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          if (zoomLevel > 1) {
            resetZoom();
          } else {
            onClose();
          }
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, zoomLevel, handleNext, handlePrev, handleZoomIn, handleZoomOut, resetZoom, onClose, toggleFullscreen]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    const current = media[currentIndex];
    if (current?.type === 'video') return;

    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Drag & Pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click to zoom in/out
  const handleDoubleClick = () => {
    const current = media[currentIndex];
    if (current?.type === 'video') return;

    if (zoomLevel === 1) {
      setZoomLevel(2.5);
    } else {
      resetZoom();
    }
  };

  const currentMedia = media[currentIndex] || media[0];
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url.includes('.mp4') || currentMedia?.url.includes('video');

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Bar Header */}
      <div 
        className={`relative z-30 flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <div className="p-2 rounded-xl bg-[#141C15] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
            {isVideo ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-[#F3E5AB] truncate">
              {currentMedia?.caption || title || (isVideo ? 'Vídeo em Alta Resolução' : 'Foto Ampliada')}
            </h4>
            <p className="text-xs text-[#8EA290] font-mono">
              {currentIndex + 1} de {media.length} mídias
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isVideo && (
            <>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#263628] disabled:opacity-30 text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                title="Ampliar (Zoom In +)"
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#263628] disabled:opacity-30 text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                title="Reduzir (Zoom Out -)"
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={resetZoom}
                  className="px-2.5 py-1.5 rounded-full bg-[#1F2B21] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Restaurar tamanho 100%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{Math.round(zoomLevel * 100)}%</span>
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#263628] text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <a
            href={currentMedia?.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#263628] text-[#E8ECE8] hover:text-[#F3E5AB] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            title="Abrir imagem original"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-black/80 hover:bg-red-950/80 text-[#E8ECE8] hover:text-red-400 border border-white/20 hover:border-red-500/50 transition-all cursor-pointer ml-1"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Main Media Stage */}
      <div 
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseMove={handleMouseMove}
      >
        {isVideo ? (
          <div className="relative max-w-5xl max-h-full w-full flex items-center justify-center">
            <video
              ref={videoRef}
              key={currentMedia.url}
              src={currentMedia.url}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[75vh] sm:max-h-[82vh] rounded-xl shadow-2xl border border-[#3B4D3A]"
            />
          </div>
        ) : (
          <div
            className={`relative transition-transform duration-75 ease-out flex items-center justify-center max-w-full max-h-full ${
              zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
          >
            <img
              src={currentMedia.url}
              alt={currentMedia.caption || 'Mídia ampliada'}
              className="max-w-full max-h-[75vh] sm:max-h-[82vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {media.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/75 hover:bg-[#1D2A1F] text-[#F3E5AB] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all cursor-pointer shadow-2xl z-20"
                title="Mídia anterior (Seta esquerda)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}
            {currentIndex < media.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/75 hover:bg-[#1D2A1F] text-[#F3E5AB] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all cursor-pointer shadow-2xl z-20"
                title="Próxima mídia (Seta direita)"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer Thumbnail Ribbon & Caption */}
      <div 
        className={`relative z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      >
        {currentMedia?.caption && (
          <div className="max-w-3xl mx-auto text-center mb-2 px-4">
            <span className="inline-block text-xs sm:text-sm text-[#F3E5AB] bg-black/75 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
              {currentMedia.caption}
            </span>
          </div>
        )}

        {media.length > 1 && (
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {media.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  resetZoom();
                  setCurrentIndex(idx);
                }}
                className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/60 scale-105 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-[#151D16] flex items-center justify-center">
                    <Film className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white bg-black/75 px-1 rounded">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="text-center pt-1 text-[10px] text-[#8EA290]/70 font-mono hidden sm:block">
          Dica: Use duplo clique ou scroll do mouse para dar zoom • Setas do teclado para navegar • Esc para fechar
        </div>
      </div>
    </div>
  );
};
