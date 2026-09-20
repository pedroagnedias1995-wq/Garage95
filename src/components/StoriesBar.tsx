import React, { useState } from 'react';
import { Plus, Volume2, Sparkles, UserCheck, Users, Radio, Play } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  friendsUserIds?: string[];
  onSelectStory: (story: Story) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  friendsUserIds = [],
  onSelectStory,
  onAddStory
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'friends'>('all');

  // Categorize stories:
  // 1. My Stories (authored by current user)
  const myStories = stories.filter(s => s.author.id === currentUser.id);
  const hasMyStory = myStories.length > 0;
  const latestMyStory = myStories[0];

  // 2. Friends & Following Stories (excluding current user)
  const friendStories = stories.filter(s => 
    s.author.id !== currentUser.id && 
    (friendsUserIds.includes(s.author.id) || (currentUser.friends && currentUser.friends.includes(s.author.id)))
  );

  // 3. Other Club Community Stories
  const otherStories = stories.filter(s => 
    s.author.id !== currentUser.id && 
    !friendsUserIds.includes(s.author.id) &&
    !(currentUser.friends && currentUser.friends.includes(s.author.id))
  );

  // Ordered list of non-self stories to show: Friends first, then Others
  const orderedStories = filterMode === 'friends' 
    ? friendStories 
    : [...friendStories, ...otherStories];

  return (
    <div className="bg-[#18221A]/95 border border-[#3B4D3A]/70 rounded-2xl p-4 shadow-xl mb-5 overflow-hidden backdrop-blur-md">
      
      {/* Header with Title */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1 border-b border-[#3B4D3A]/40 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#263628] border border-[#D4AF37]/40 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-[#E5C158] animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif-heading font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
              Stories & Roncos 24h
            </h3>
          </div>
        </div>
      </div>

      {/* Horizontal Stories Carousel */}
      <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto pb-2 pt-1 custom-scrollbar">
        
        {/* ================= 1. MEU STORY (WITH ADD OPTION) ================= */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="relative">
            {/* Avatar Circle */}
            <div
              onClick={() => {
                if (hasMyStory) {
                  onSelectStory(latestMyStory);
                } else {
                  onAddStory();
                }
              }}
              id="my-story-avatar-btn"
              className={`relative w-16 h-16 rounded-full p-0.5 cursor-pointer transition-transform group-hover:scale-105 ${
                hasMyStory
                  ? 'bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#C9A227] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'border-2 border-dashed border-[#D4AF37]/60 bg-[#162018]'
              }`}
              title={hasMyStory ? 'Visualizar meu story' : 'Criar novo story'}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[#121A14] flex items-center justify-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-full h-full object-cover ${hasMyStory ? 'opacity-100' : 'opacity-70 group-hover:opacity-90 transition-opacity'}`}
                />
              </div>

              {/* Status indicator if active story */}
              {hasMyStory && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#121A14]" title="Story ativo" />
              )}
            </div>

            {/* Always visible Add (+) Button badge to publish another or first story */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddStory();
              }}
              id="btn-add-story-plus"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#E5C158] to-[#AA820A] text-[#121713] flex items-center justify-center shadow-lg border-2 border-[#141C15] hover:scale-115 active:scale-95 transition-transform cursor-pointer"
              title="Adicionar novo Story à sua garagem"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#F3E5AB] truncate max-w-[75px] block leading-tight">
              Meu Story
            </span>
          </div>
        </div>

        {/* ================= 2. AMIGOS & QUEM EU SIGO + OUTROS COLECIODORES ================= */}
        {orderedStories.length === 0 ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#121A14]/70 rounded-xl border border-[#3B4D3A]/40 text-xs text-[#8EA290]">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Nenhum story de amigos no momento. Seja o primeiro a publicar acima!</span>
          </div>
        ) : (
          orderedStories.map((story) => {
            const isFriend = friendsUserIds.includes(story.author.id) || (currentUser.friends && currentUser.friends.includes(story.author.id));

            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                id={`story-item-${story.id}`}
              >
                <div className="relative">
                  {/* Glowing Story Ring: Gold/Emerald for Friends, Classic Gold for others */}
                  <div
                    className={`relative p-0.5 rounded-full transition-transform group-hover:scale-105 shadow-md ${
                      isFriend
                        ? 'bg-gradient-to-tr from-[#10B981] via-[#D4AF37] to-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.35)] ring-1 ring-[#10B981]/50'
                        : story.viewed
                        ? 'bg-[#3B4D3A]'
                        : 'bg-gradient-to-tr from-[#D4AF37] via-[#E5C158] to-[#604908] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                    }`}
                  >
                    <div className="p-0.5 rounded-full bg-[#18221A]">
                      <img
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>

                    {/* Sound or Badge icon */}
                    <div
                      className={`absolute -bottom-1 -right-1 p-1 rounded-full border border-[#141C15] shadow-sm ${
                        isFriend
                          ? 'bg-[#0D3B22] text-[#4ADE80]'
                          : 'bg-[#263628] text-[#D4AF37]'
                      }`}
                    >
                      {story.engineRevAudio ? (
                        <Volume2 className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Relation Badge */}
                <div className="text-center max-w-[80px]">
                  <span className="text-[11px] font-medium text-[#E8ECE8] group-hover:text-[#F3E5AB] transition-colors truncate block">
                    {story.author.name.split(' ')[0]}
                  </span>
                  {isFriend && (
                    <span className="inline-block text-[8.5px] uppercase font-black tracking-tight text-[#4ADE80] bg-[#10B981]/15 px-1 rounded border border-[#10B981]/30">
                      Amigo
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
};
