import React, { useEffect, useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Heart, 
  Send, 
  Car, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { Story, User } from '../types';
import { engineSound } from '../utils/engineSound';

interface StoryViewerModalProps {
  story: Story | null;
  stories: Story[];
  onClose: () => void;
  onSelectStory: (story: Story) => void;
  onContactAuthor: (author: User) => void;
  onViewUserProfile?: (author: User) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  stories,
  onClose,
  onSelectStory,
  onContactAuthor,
  onViewUserProfile
}) => {
  if (!story) return null;

  const [progress, setProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentIndex = stories.findIndex((s) => s.id === story.id);

  useEffect(() => {
    setProgress(0);
    if (story.engineRevAudio) {
      engineSound.playEngineProfile(story.engineRevAudio as any, 4.5);
      setIsPlayingAudio(true);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            onSelectStory(stories[currentIndex + 1]);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      engineSound.stop();
    };
  }, [story.id]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      onSelectStory(stories[currentIndex + 1]);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectStory(stories[currentIndex - 1]);
    }
  };

  const toggleSound = () => {
    if (isPlayingAudio) {
      engineSound.stop();
      setIsPlayingAudio(false);
    } else {
      if (story.engineRevAudio) {
        engineSound.playEngineProfile(story.engineRevAudio as any, 4.0);
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-lg animate-in fade-in duration-200">
      
      {/* Prev / Next on Desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm h-[85vh] max-h-[720px] bg-[#121713] rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={story.mediaUrl}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        </div>

        {/* Top Progress Bar & User Header */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Indicator */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-100"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Row */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => {
                if (onViewUserProfile) {
                  onClose();
                  onViewUserProfile(story.author);
                }
              }}
              className={`flex items-center gap-2.5 ${onViewUserProfile ? 'cursor-pointer group/user' : ''}`}
              title={`Ver perfil de ${story.author.name}`}
            >
              <img
                src={story.author.avatar}
                alt={story.author.name}
                className="w-9 h-9 rounded-full object-cover border border-[#D4AF37] group-hover/user:scale-105 group-hover/user:border-[#F3E5AB] transition-all"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-xs text-white group-hover/user:text-[#F3E5AB] group-hover/user:underline transition-colors">{story.author.name}</p>
                  <span className="text-[10px] text-[#D4AF37]">• {story.timestamp}</span>
                </div>
                <p className="text-[10px] text-[#A2B3A4]">{story.author.collectorTier}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-full bg-black/50 text-[#D4AF37] hover:text-[#F3E5AB] border border-[#D4AF37]/30 transition-colors cursor-pointer"
              >
                {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/50 text-white hover:text-[#F3E5AB] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Caption & Tagged Vehicle */}
        <div className="relative z-20 p-4 space-y-3">
          
          {story.vehicleTagged && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-xs text-[#F3E5AB]">
              <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold">{story.vehicleTagged.brand} {story.vehicleTagged.model} ({story.vehicleTagged.year})</span>
            </div>
          )}

          <div className="bg-black/60 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <h4 className="font-serif font-bold text-base text-[#F3E5AB]">{story.title}</h4>
            {story.subtitle && (
              <p className="text-xs text-[#E8ECE8] mt-1 leading-relaxed">{story.subtitle}</p>
            )}
          </div>

          {/* Quick Reply / Like Bar */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Responder para o colecionador..."
              className="flex-1 px-3 py-2 text-xs bg-black/60 border border-white/20 rounded-full text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none"
            />
            {replyText.trim() ? (
              <button
                onClick={() => {
                  onContactAuthor(story.author);
                  onClose();
                }}
                className="p-2 rounded-full bg-[#C9A227] text-[#121713] font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full bg-black/60 border border-white/20 transition-all cursor-pointer ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
