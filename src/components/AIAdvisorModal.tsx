import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User as UserIcon, 
  Wrench, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Car, 
  RefreshCw, 
  Copy, 
  Check, 
  BookOpen,
  Volume2
} from 'lucide-react';
import { User, Vehicle } from '../types';
import { engineSound } from '../utils/engineSound';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  userVehicles: Vehicle[];
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      role: 'model',
      text: `Olá ${currentUser.name}! Sou o **Curador Chefe & Consultor Técnico da Garage 95**.\n\nEstou à sua disposição para analisar critérios de **Placa Preta (FIVA/FBVA)**, regular carburação e ponto de ignição, auditar matching numbers, projetar valorização de mercado ou orientar restaurações de alto nível.\n\nComo posso ajudar seu acervo hoje?`,
      timestamp: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      label: 'Critérios Placa Preta FIVA',
      icon: Award,
      text: 'Quais são os critérios mais rigorosos da pontuação para obter o Certificado de Placa Preta com 90+ pontos?'
    },
    {
      label: 'Regulagem de Carburador Holley / Weber',
      icon: Wrench,
      text: 'Qual o procedimento ideal para regular a mistura e pressão de combustível em carburadores clássicos de corpo quádruplo e duplo?'
    },
    {
      label: 'Tendência de Valorização',
      icon: TrendingUp,
      text: 'Quais clássicos nacionais e esportivos importados dos anos 70 e 80 têm maior potencial de valorização nos próximos anos?'
    },
    {
      label: 'Ponto de Ignição & Tuchos',
      icon: Car,
      text: 'Como ajustar o ponto inicial e avanço a vácuo para evitar detonação com a gasolina atual com etanol?'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const selectedCar = userVehicles.find((v) => v.id === selectedVehicleId);
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          vehicleContext: selectedCar
            ? {
                brand: selectedCar.brand,
                model: selectedCar.model,
                year: selectedCar.year,
                engine: selectedCar.engine,
                plateType: selectedCar.plateType
              }
            : undefined
        })
      });

      const data = await res.json();
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || 'Recebi sua pergunta e estou consultando nossos manuais de época.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: `bot_err_${Date.now()}`,
        role: 'model',
        text: 'Não foi possível conectar ao curador no momento. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSoundSample = () => {
    engineSound.playEngineProfile('v8_rumble', 3.0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[750px] bg-[#141C15] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-[#3B4D3A]/60 bg-[#101711]">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#263628] to-[#121713] border border-[#D4AF37]/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#141C15]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-heading font-bold text-base text-[#F3E5AB]">
                  Curador & Especialista IA Garage 95
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#263628] text-[#D4AF37] border border-[#D4AF37]/30">
                  FIVA Certified Engine
                </span>
              </div>
              <p className="text-[11px] text-[#8EA290]">
                Consultoria técnica, certificação de originalidade e avaliação de mercado em tempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSoundSample}
              title="Testar som de motor V8"
              className="p-2 rounded-lg bg-[#1A241C] hover:bg-[#263628] text-[#D4AF37] border border-[#3B4D3A] transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1A241C] hover:bg-[#263628] text-[#8EA290] hover:text-[#E8ECE8] border border-[#3B4D3A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Selection Context Bar */}
        {userVehicles.length > 0 && (
          <div className="bg-[#172218] px-5 py-2.5 border-b border-[#3B4D3A]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#8EA290]">
              <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Consultar sobre carro específico da sua garagem:</span>
            </div>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="px-2.5 py-1 bg-[#101411] border border-[#3B4D3A] rounded-lg text-xs text-[#F3E5AB] focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="">Nenhum (Consulta geral de antigomobilismo)</option>
              {userVehicles.map((veh) => (
                <option key={veh.id} value={veh.id}>
                  {veh.year} {veh.brand} {veh.model} ({veh.plateType === 'preta' ? 'Placa Preta' : 'Coleção'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-gradient-to-b from-[#141C15] to-[#0E130F]">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-[#1C271E] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#D4AF37] shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-md ${
                    isBot
                      ? 'bg-[#18231A] border border-[#3B4D3A]/70 text-[#E8ECE8]'
                      : 'bg-gradient-to-r from-[#C9A227] to-[#AA820A] text-[#121713] font-medium'
                  }`}
                >
                  {/* Message formatted with markdown bold and lines */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-[#F3E5AB]">{line.replace(/\*\*/g, '')}</p>;
                      }
                      return (
                        <p key={i}>
                          {line.split('**').map((chunk, j) =>
                            j % 2 === 1 ? (
                              <strong key={j} className={isBot ? 'text-[#F3E5AB] font-bold' : 'font-bold'}>
                                {chunk}
                              </strong>
                            ) : (
                              chunk
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className={`mt-2.5 pt-1.5 flex items-center justify-between border-t text-[10px] ${
                    isBot ? 'border-[#3B4D3A]/40 text-[#7E9180]' : 'border-black/10 text-black/70'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-[#F3E5AB] transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Parecer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] shrink-0 mt-0.5">
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#D4AF37] p-2 bg-[#18231A] rounded-xl w-fit border border-[#3B4D3A]/50 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>O Curador está analisando referências e manuais técnicos...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#121813] border-t border-[#3B4D3A]/40 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
          {quickPrompts.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(chip.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A241C] hover:bg-[#263628] text-[11px] text-[#B4C4B6] hover:text-[#F3E5AB] border border-[#3B4D3A]/60 whitespace-nowrap transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-[#D4AF37]" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#101711] border-t border-[#3B4D3A]/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pergunte sobre mecânica, originalidade, carburação, FIVA ou valor de mercado..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#151D16] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] placeholder-[#7E9180] focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Consultar</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
