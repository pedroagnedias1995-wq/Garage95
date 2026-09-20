import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Search, 
  Car, 
  DollarSign, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  offerAmount?: number;
  listingContext?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

export interface ChatConversation {
  id: string;
  recipient: User;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string, offerAmount?: number) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage
}) => {
  if (!isOpen) return null;

  const [messageInput, setMessageInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const currentConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentConv) return;

    onSendMessage(currentConv.id, messageInput);
    setMessageInput('');
  };

  const handleAcceptOffer = (amount: number) => {
    if (!currentConv) return;
    onSendMessage(currentConv.id, `✅ Proposta de R$ ${amount.toLocaleString('pt-BR')} ACEITA! Vamos combinar os detalhes da transferência e laudo de vistoria.`);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C9A227', '#4F6650']
      });
    } catch {}
  };

  const filteredConversations = conversations.filter(c => 
    c.recipient.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.recipient.handle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[700px] bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button Mobile/Desktop */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-[#8EA290] hover:text-[#E8ECE8] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sidebar: Conversations List */}
        <div className={`w-full md:w-80 bg-[#141C15] border-r border-[#3B4D3A]/60 flex flex-col ${currentConv && 'hidden md:flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-[#3B4D3A]/50">
            <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
              Mensagens & Negociações
            </h3>
            <p className="text-[11px] text-[#8EA290]">Chat privado entre colecionadores</p>
            
            {/* Search */}
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 text-[#7E9180] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar contatos..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#3B4D3A]/30">
            {filteredConversations.map((conv) => {
              const isSelected = currentConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#1C271E] border-l-3 border-[#D4AF37]' : 'hover:bg-[#18221A]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.recipient.avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/50"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A227] text-[#121713] text-[9px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#E8ECE8] truncate">{conv.recipient.name}</span>
                      <span className="text-[10px] text-[#7E9180] shrink-0">{conv.lastTimestamp}</span>
                    </div>
                    <p className="text-[10px] text-[#D4AF37] truncate">{conv.recipient.collectorTier}</p>
                    <p className="text-xs text-[#8EA290] truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        {currentConv ? (
          <div className="flex-1 flex flex-col bg-[#172018] h-full overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-3.5 sm:p-4 bg-[#141C15] border-b border-[#3B4D3A]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectConversation('')}
                  className="md:hidden p-1.5 rounded-lg bg-[#263628] text-white text-xs"
                >
                  Voltar
                </button>
                <img
                  src={currentConv.recipient.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#E8ECE8]">{currentConv.recipient?.name || 'Membro'}</h4>
                    <span className="text-[10px] text-[#7E9180]">{currentConv.recipient?.handle || ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-[#D4AF37] font-semibold">{currentConv.recipient?.collectorTier || 'Colecionador'}</span>
                    {currentConv.recipient?.location && (
                      <span className="text-[#8EA290]">• {currentConv.recipient.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Flow */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5">
              {currentConv.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {/* Attached Listing Card if present */}
                    {msg.listingContext && (
                      <div className="mb-1.5 p-2 bg-[#121713] border border-[#D4AF37]/50 rounded-xl max-w-xs flex items-center gap-2.5 shadow-md">
                        <img
                          src={msg.listingContext.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-[#3B4D3A]"
                        />
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-[#D4AF37] font-semibold uppercase">Item Negociado</p>
                          <p className="text-xs font-bold text-[#E8ECE8] truncate">{msg.listingContext.title}</p>
                          <p className="text-xs font-serif font-black text-[#F3E5AB]">
                            R$ {msg.listingContext.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Official Offer Card if offer was sent */}
                    {msg.offerAmount && (
                      <div className="mb-1.5 p-3 rounded-xl bg-gradient-to-r from-[#263628] to-[#172018] border border-[#D4AF37] max-w-xs text-xs space-y-1.5 shadow-lg">
                        <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
                          <DollarSign className="w-4 h-4" />
                          <span>PROPOSTA OFICIAL DE COMPRA</span>
                        </div>
                        <p className="text-lg font-serif font-black text-[#F3E5AB]">
                          R$ {msg.offerAmount.toLocaleString('pt-BR')}
                        </p>
                        {!isMe && (
                          <div className="pt-1 flex gap-2">
                            <button
                              onClick={() => handleAcceptOffer(msg.offerAmount!)}
                              className="px-3 py-1 bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] text-[11px] font-bold rounded-lg cursor-pointer"
                            >
                              Aceitar Proposta
                            </button>
                            <button
                              onClick={() => onSendMessage(currentConv.id, `Olá! Agradeço a proposta de R$ ${msg.offerAmount?.toLocaleString('pt-BR')}, mas consigo fechar por um valor intermediário.`)}
                              className="px-2.5 py-1 bg-[#141C15] text-[#E8ECE8] text-[11px] rounded-lg border border-[#3B4D3A] cursor-pointer"
                            >
                              Fazer Contraproposta
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text Message Bubble */}
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#263628] text-[#F3E5AB] border border-[#D4AF37]/40 rounded-tr-xs'
                          : 'bg-[#141C15] text-[#D1DCD2] border border-[#3B4D3A]/60 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-[9px] ${isMe ? 'text-[#8EA290] justify-end' : 'text-[#7E9180]'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#D4AF37]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 bg-[#141C15] border-t border-[#3B4D3A]/60 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Mensagem para ${currentConv.recipient.name}...`}
                className="flex-1 px-4 py-2.5 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] placeholder-[#7E9180] focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] disabled:opacity-40 text-[#121713] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-[#8EA290]">
            <p className="text-xs">Selecione uma conversa ao lado para visualizar as mensagens.</p>
          </div>
        )}

      </div>
    </div>
  );
};
