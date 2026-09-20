import React from 'react';
import { 
  X, 
  Bell, 
  Heart, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Users, 
  ShieldCheck, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-400 fill-red-400/20" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-[#D4AF37]" />;
      case 'marketplace_offer':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'event_reminder':
        return <Calendar className="w-4 h-4 text-[#E5C158]" />;
      case 'group_invite':
        return <Users className="w-4 h-4 text-sky-400" />;
      case 'follow':
        return <ShieldCheck className="w-4 h-4 text-[#C9A227]" />;
      default:
        return <Bell className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#D4AF37]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                Notificações do Clube
              </h3>
              <p className="text-[11px] text-[#8EA290]">
                Atualizações do acervo, propostas e novidades da comunidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#D4AF37] hover:text-[#F3E5AB] hover:bg-[#263628] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Marcar lidas</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8EA290] hover:text-[#E8ECE8] hover:bg-[#263628] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8EA290]">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  item.read
                    ? 'bg-[#141C15]/70 border-[#3B4D3A]/40 text-[#A2B3A4]'
                    : 'bg-[#1F2B21] border-[#D4AF37]/40 text-[#E8ECE8] shadow-sm'
                } hover:border-[#D4AF37]/60 hover:bg-[#243327]`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={item.sender.avatar}
                    alt={item.sender.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/40"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#121713] border border-[#3B4D3A]">
                    {getIcon(item.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="font-bold text-xs text-[#F3E5AB] truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#7E9180] shrink-0 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#B4C4B6] line-clamp-2">
                    {item.text}
                  </p>
                </div>

                {!item.read && (
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2 self-center" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
