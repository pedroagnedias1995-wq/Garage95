import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Car, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Maximize2
} from 'lucide-react';
import { Post, User, Vehicle } from '../types';
import { engineSound } from '../utils/engineSound';
import { MediaLightboxModal } from './MediaLightboxModal';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onHashtagClick: (tag: string) => void;
  onContactAuthor: (author: User) => void;
  onViewUserProfile?: (author: User) => void;
  onToggleSavePost?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLikePost,
  onAddComment,
  onSelectVehicle,
  onHashtagClick,
  onContactAuthor,
  onViewUserProfile,
  onToggleSavePost
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [internalSaved, setInternalSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isSaved = post.isSaved !== undefined ? post.isSaved : internalSaved;

  const handleSoundTrack = () => {
    if (isPlayingAudio) {
      engineSound.stop();
      setIsPlayingAudio(false);
    } else {
      engineSound.playEngineProfile('v8_rumble', 3.5);
      setIsPlayingAudio(true);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 3500);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(post.id, newCommentText);
    setNewCommentText('');
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className="bg-[#18221A] border border-[#3B4D3A]/60 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all hover:border-[#3B4D3A]"
    >
      {/* Author Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              if (onViewUserProfile) {
                onViewUserProfile(post.author);
              } else {
                onContactAuthor(post.author);
              }
            }}
            className="cursor-pointer relative group/avatar"
            title={`Ver perfil de ${post.author.name}`}
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-[#D4AF37] group-hover/avatar:scale-105 group-hover/avatar:border-[#F3E5AB] transition-all"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 
                onClick={() => {
                  if (onViewUserProfile) {
                    onViewUserProfile(post.author);
                  } else {
                    onContactAuthor(post.author);
                  }
                }}
                className="font-semibold text-xs text-[#E8ECE8] hover:text-[#F3E5AB] cursor-pointer hover:underline"
                title={`Ver perfil de ${post.author.name}`}
              >
                {post.author.name}
              </h4>
              <span className="text-[11px] text-[#7E9180]">{post.author.handle}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#A2B3A4]">
              <span className="text-[#D4AF37] font-medium">{post.author.collectorTier}</span>
              <span>• {post.createdAt}</span>
              {post.location && (
                <span className="flex items-center gap-0.5 text-[#8EA290] hidden sm:inline-flex">
                  <MapPin className="w-2.5 h-2.5" />
                  {post.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Gallery with Carousel */}
      {post.media && post.media.length > 0 && (
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[16/10] sm:aspect-[16/9] bg-black overflow-hidden group cursor-pointer"
          title="Clique para ampliar foto ou vídeo em tela cheia"
        >
          {post.media[activeMediaIndex].type === 'video' || post.media[activeMediaIndex].url.includes('.mp4') || post.media[activeMediaIndex].url.includes('video') ? (
            <div className="relative w-full h-full">
              <video
                key={`post-video-${activeMediaIndex}-${post.media[activeMediaIndex].url}`}
                src={post.media[activeMediaIndex].url}
                playsInline
                preload="none"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                <div className="p-3 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37] text-[#D4AF37] group-hover:scale-110 transition-transform shadow-xl">
                  <Maximize2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          ) : (
            <img
              key={`post-img-${activeMediaIndex}-${post.media[activeMediaIndex].url}`}
              src={post.media[activeMediaIndex].url}
              alt={post.media[activeMediaIndex].caption || 'Mídia da publicação'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Carousel Arrows (only show left arrow if not on first photo, and right arrow if not on last photo) */}
          {post.media.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/40 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10"
                  title="Mídia anterior"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              {activeMediaIndex < post.media.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex((prev) => Math.min(post.media.length - 1, prev + 1));
                  }}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-[#F3E5AB] border border-[#D4AF37]/40 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shadow-xl z-10"
                  title="Próxima mídia"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Adaptive Indicators (dots for <= 8, smart indicator bar for > 8) */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10 px-4">
                {post.media.length <= 8 ? (
                  post.media.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeMediaIndex === i ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))
                ) : (
                  <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                    {post.media.slice(0, Math.min(10, post.media.length)).map((_, i) => {
                      const isCurrent = activeMediaIndex === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIndex(i);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            isCurrent ? 'w-4 bg-[#D4AF37]' : 'w-1 bg-white/40'
                          }`}
                        />
                      );
                    })}
                    {post.media.length > 10 && (
                      <span className="text-[9px] font-mono text-[#F3E5AB] pl-1">
                        +{post.media.length - 10}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Text & Hashtags */}
      <div className="p-4 space-y-3">
        <p className="text-xs sm:text-sm text-[#D1DCD2] leading-relaxed whitespace-pre-line font-sans-body">
          {post.content}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag, idx) => (
              <span
                key={idx}
                onClick={() => onHashtagClick(tag)}
                className="text-[11px] font-mono text-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer hover:underline"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#3B4D3A]/40 text-xs text-[#A2B3A4]">
          <div className="flex items-center gap-4">
            
            {/* Like */}
            <button
              onClick={() => onLikePost(post.id)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                post.isLiked ? 'text-red-500 font-bold' : 'hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{post.likesCount}</span>
            </button>

            {/* Comments Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 hover:text-[#F3E5AB] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentsCount}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-[#F3E5AB] transition-colors cursor-pointer"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink ? <span className="text-[#D4AF37] text-[10px]">Copiado!</span> : <span>{post.sharesCount}</span>}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onToggleSavePost) {
                onToggleSavePost(post.id);
              } else {
                setInternalSaved(!internalSaved);
              }
            }}
            className={`p-1.5 rounded-lg hover:bg-[#263628] transition-colors cursor-pointer ${
              isSaved ? 'text-[#D4AF37]' : 'text-[#8EA290]'
            }`}
            title={isSaved ? 'Remover dos itens salvos' : 'Salvar publicação no perfil'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#D4AF37]' : ''}`} />
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-3 border-t border-[#3B4D3A]/40 space-y-3 animate-in fade-in duration-150">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 bg-[#141C15] p-2.5 rounded-xl border border-[#3B4D3A]/30">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      onClick={() => {
                        if (onViewUserProfile) {
                          onViewUserProfile(comment.author);
                        } else {
                          onContactAuthor(comment.author);
                        }
                      }}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#D4AF37]/40 cursor-pointer hover:border-[#D4AF37] transition-colors"
                      title={`Ver perfil de ${comment.author.name}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span 
                            onClick={() => {
                              if (onViewUserProfile) {
                                onViewUserProfile(comment.author);
                              } else {
                                onContactAuthor(comment.author);
                              }
                            }}
                            className="font-semibold text-xs text-[#E8ECE8] hover:text-[#F3E5AB] cursor-pointer hover:underline"
                            title={`Ver perfil de ${comment.author.name}`}
                          >
                            {comment.author.name}
                          </span>
                          <span className="text-[10px] text-[#D4AF37]">{comment.author.collectorTier}</span>
                        </div>
                        <span className="text-[10px] text-[#7E9180]">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#B4C4B6] mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8EA290] text-center py-2">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            )}

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/50 shrink-0"
              />
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escreva um comentário sobre o veículo ou história..."
                className="flex-1 px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] placeholder-[#7E9180] focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] disabled:opacity-40 text-[#121713] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Fullscreen Zoom & Magnification Lightbox */}
      {isLightboxOpen && post.media && post.media.length > 0 && (
        <MediaLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          media={post.media}
          initialIndex={activeMediaIndex}
          title={post.vehicleTagged ? `${post.vehicleTagged.brand} ${post.vehicleTagged.model} (${post.vehicleTagged.year})` : `Publicação de ${post.author.name}`}
        />
      )}
    </article>
  );
};
