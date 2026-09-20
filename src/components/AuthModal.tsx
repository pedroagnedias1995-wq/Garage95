import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Award, 
  KeyRound, 
  Globe, 
  Instagram, 
  Volume2, 
  Wrench,
  X,
  AlertCircle
} from 'lucide-react';
import { User, Vehicle } from '../types';
import { NEUTRAL_USER } from '../data/mockData';
import { engineSound } from '../utils/engineSound';
import confetti from 'canvas-confetti';
import { AppLogo } from './AppLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: User, initialVehicle?: Partial<Vehicle>) => void;
  canDismiss?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  canDismiss = false
}) => {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);

  // Social Auth Sub-modals (Google & Meta interactive dialogs)
  const [socialModalType, setSocialModalType] = useState<'google' | 'meta' | null>(null);
  const [socialStep, setSocialStep] = useState<'select' | 'authorizing'>('select');

  // Custom Form Fields
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    location: 'São Paulo, SP',
    collectorTier: 'Entusiasta Clássico' as User['collectorTier'],
    bio: 'Colecionador e apaixonado pela história automotiva e mecânica clássica.',
    addFirstCar: false,
    carBrand: 'Ford',
    carModel: 'Mustang Fastback',
    carYear: 1967,
    carPlateType: 'preta' as const,
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle manual registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const cleanHandle = formData.handle.trim() 
      ? (formData.handle.startsWith('@') ? formData.handle : `@${formData.handle.toLowerCase().replace(/\s+/g, '_')}`)
      : `@${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_95`;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: formData.name.trim(),
      handle: cleanHandle,
      email: formData.email.trim(),
      avatar: '',
      coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
      bio: formData.bio || 'Membro oficial da comunidade Garage 95.',
      location: formData.location || 'Brasil',
      collectorTier: formData.collectorTier,
      memberSince: '2026',
      garageCount: formData.addFirstCar ? 1 : 0,
      followersCount: 1,
      followingCount: 4,
      totalLikes: 0,
      reputationScore: 95,
      verifiedCollector: true,
      authProvider: 'email',
      linkedProviders: ['email'],
      originalityScore: 92,
      specialty: 'Automóveis Históricos & Colecionismo',
      trophies: [
        {
          title: 'Credencial Oficial Garage 95',
          year: 2026,
          event: 'Inauguração & Registro de Acervo',
          category: 'Membro Fundador'
        }
      ]
    };

    let initialVehicle: Partial<Vehicle> | undefined;
    if (formData.addFirstCar && formData.carBrand && formData.carModel) {
      initialVehicle = {
        id: `veh_${Date.now()}`,
        ownerId: newUser.id,
        ownerName: newUser.name,
        ownerAvatar: newUser.avatar,
        brand: formData.carBrand,
        model: formData.carModel,
        year: Number(formData.carYear) || 1975,
        category: 'carro',
        plateType: formData.carPlateType,
        engine: 'V8 302 / 5.0L',
        horsepower: 220,
        transmission: 'Manual 4 Marchas',
        fuel: 'Gasolina',
        mileage: 48000,
        color: 'Azul Metálico',
        photos: ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1000&auto=format&fit=crop&q=80'],
        coverPhoto: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1000&auto=format&fit=crop&q=80',
        status: 'garage',
        valuationEstimate: 'R$ 280.000',
        authenticityScore: 95,
        restorationHistory: 'Cadastrado e certificado no acervo Garage 95.'
      };
    }

    // Engine sound & celebratory effects
    try {
      engineSound.playRev();
    } catch {
      // Audio context might be restricted before interaction
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E5C158', '#4E7A53', '#FFFFFF']
    });

    onSuccess(newUser, initialVehicle);
  };

  // Handle Quick Login with mock user or email
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Por favor, informe seu e-mail ou nome de usuário.');
      return;
    }

    // Match existing or create login session
    const loggedUser: User = {
      ...NEUTRAL_USER,
      name: loginEmail.split('@')[0].toUpperCase(),
      email: loginEmail,
      handle: `@${loginEmail.split('@')[0].toLowerCase()}`
    };

    try {
      engineSound.playRev();
    } catch {
      // Ignored
    }

    onSuccess(loggedUser);
  };

  // Trigger Google Account Linking Simulation
  const handleSelectGoogleAccount = (googleAccount: { name: string; email: string; avatar: string }) => {
    setSocialStep('authorizing');
    setTimeout(() => {
      const newUser: User = {
        id: `usr_google_${Date.now()}`,
        name: googleAccount.name,
        handle: `@${googleAccount.email.split('@')[0].toLowerCase()}`,
        email: googleAccount.email,
        avatar: googleAccount.avatar,
        coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
        bio: 'Entusiasta conectado via Google Workspace & Garage 95.',
        location: 'São Paulo, SP',
        collectorTier: 'Colecionador Ouro',
        memberSince: '2026',
        garageCount: 2,
        followersCount: 12,
        followingCount: 8,
        totalLikes: 45,
        reputationScore: 98,
        verifiedCollector: true,
        authProvider: 'google',
        linkedProviders: ['google'],
        originalityScore: 94,
        specialty: 'Muscle Cars & Certificação FIVA',
        trophies: [
          {
            title: 'Membro Verificado Google Auth',
            year: 2026,
            event: 'Garage 95 Pass',
            category: 'Identidade Segura'
          }
        ]
      };

      try {
        engineSound.playRev();
      } catch {
        // Ignored
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#D4AF37']
      });

      setSocialModalType(null);
      onSuccess(newUser);
    }, 900);
  };

  // Trigger Meta (Instagram / Facebook) Account Linking Simulation
  const handleSelectMetaAccount = (metaAccount: { name: string; instagram: string; avatar: string }) => {
    setSocialStep('authorizing');
    setTimeout(() => {
      const newUser: User = {
        id: `usr_meta_${Date.now()}`,
        name: metaAccount.name,
        handle: metaAccount.instagram.startsWith('@') ? metaAccount.instagram : `@${metaAccount.instagram}`,
        email: `${metaAccount.instagram.replace('@', '')}@meta.garage95.com`,
        avatar: metaAccount.avatar,
        coverImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1600&auto=format&fit=crop&q=80',
        bio: 'Colecionador de clássicos esportivos conectado via Meta & Instagram.',
        location: 'Curitiba, PR',
        collectorTier: 'Piloto Histórico',
        memberSince: '2026',
        garageCount: 2,
        followersCount: 48,
        followingCount: 19,
        totalLikes: 180,
        reputationScore: 99,
        verifiedCollector: true,
        instagram: metaAccount.instagram,
        authProvider: 'meta',
        linkedProviders: ['meta'],
        originalityScore: 96,
        specialty: 'Veículos Esportivos Raros & Track Days',
        trophies: [
          {
            title: 'Credencial Verificada Meta Connect',
            year: 2026,
            event: 'Garage 95 Club',
            category: 'Passe VIP'
          }
        ]
      };

      try {
        engineSound.playRev();
      } catch {
        // Ignored
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0081FB', '#833AB4', '#FD1D1D', '#FCAF45', '#D4AF37']
      });

      setSocialModalType(null);
      onSuccess(newUser);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-[#2E4A33]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl bg-[#141C15] border-2 border-[#D4AF37]/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden my-auto text-[#E8ECE8]">
        
        {/* Optional dismiss button if allowed */}
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1C271E]/80 text-[#8EA290] hover:text-[#F3E5AB] hover:bg-[#263628] transition-colors cursor-pointer"
            title="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header & Brand Badge */}
        <div className="relative p-6 sm:p-8 pb-5 text-center bg-gradient-to-b from-[#1C291E] via-[#162118] to-[#141C15] border-b border-[#3B4D3A]/60">
          <div className="flex items-center justify-center py-2">
            <AppLogo size="md" variant="horizontal" className="scale-110 sm:scale-125" />
          </div>

          <p className="text-xs sm:text-sm text-[#A3B8A6] max-w-md mx-auto mt-2 font-sans">
            O clube exclusivo para colecionadores, restauradores e apreciadores de automóveis clássicos e esportivos.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#0E150F] p-1 rounded-2xl border border-[#3B4D3A]/60 max-w-xs mx-auto mt-5">
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#C9A227] text-[#121713] shadow-md'
                  : 'text-[#8EA290] hover:text-[#E8ECE8]'
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#C9A227] text-[#121713] shadow-md'
                  : 'text-[#8EA290] hover:text-[#E8ECE8]'
              }`}
            >
              Já sou Membro
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Social Linking / OAuth Section */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider text-center font-mono">
              {authMode === 'register' ? 'Vincular e Criar Conta com um Clique' : 'Acessar com sua Conta Vinculada'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Google Linking Button */}
              <button
                type="button"
                id="btn-auth-google"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('google');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#1A241C] hover:bg-[#233126] border border-[#3B4D3A] hover:border-[#4285F4]/80 text-[#E8ECE8] text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="group-hover:text-white transition-colors">Continuar com Google</span>
              </button>

              {/* Meta Linking Button */}
              <button
                type="button"
                id="btn-auth-meta"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('meta');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#1A241C] hover:bg-[#233126] border border-[#3B4D3A] hover:border-[#0081FB]/80 text-[#E8ECE8] text-xs font-bold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16.666 4C14.498 4 13.064 5.388 12 6.786 10.936 5.388 9.502 4 7.334 4 3.754 4 1 6.96 1 11.233c0 4.887 3.518 8.767 7.778 8.767 2.138 0 3.784-1.042 4.672-2.146.888 1.104 2.534 2.146 4.672 2.146 4.26 0 7.778-3.88 7.778-8.767C25.9 6.96 23.146 4 19.566 4h-2.9zm-9.332 13.8c-3.12 0-5.5-2.818-5.5-6.567 0-3.748 2.38-6.566 5.5-6.566 2.054 0 3.498 1.487 4.394 2.946l.272.443.272-.443C13.168 5.72 14.612 4.233 16.666 4.233c3.12 0 5.5 2.818 5.5 6.567 0 3.748-2.38 6.566-5.5 6.566-2.054 0-3.498-1.487-4.394-2.946l-.272-.443-.272.443c-.896 1.459-2.34 2.946-4.394 2.946z"
                    fill="url(#metaGradient)"
                  />
                  <defs>
                    <linearGradient id="metaGradient" x1="1" y1="4" x2="25.9" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0064E0" />
                      <stop offset="0.5" stopColor="#0081FB" />
                      <stop offset="1" stopColor="#00C4FA" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="group-hover:text-white transition-colors">Continuar com Meta</span>
              </button>

            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-[#7E9180] tracking-wider font-mono">
                ou preencha com e-mail
              </span>
              <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
            </div>
          </div>

          {/* Form: Register Mode */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Nome Completo</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Pedro Dias"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <span>Nome de Usuário (@handle)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    placeholder="@pedrodias_95"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-mail</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Senha de Acesso</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-[#8EA290] hover:text-[#D4AF37] cursor-pointer"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Cidade / Estado</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Perfil de Colecionador</span>
                  </label>
                  <select
                    value={formData.collectorTier}
                    onChange={(e) => setFormData({ ...formData, collectorTier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  >
                    <option value="Entusiasta Clássico">Entusiasta Clássico</option>
                    <option value="Colecionador Ouro">Colecionador Ouro</option>
                    <option value="Mestre Restaurador">Mestre Restaurador</option>
                    <option value="Piloto Histórico">Piloto Histórico</option>
                    <option value="Membro Fundador">Membro Fundador</option>
                  </select>
                </div>
              </div>

              {/* Optional First Classic Vehicle Setup */}
              <div className="pt-2 border-t border-[#3B4D3A]/50">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.addFirstCar}
                    onChange={(e) => setFormData({ ...formData, addFirstCar: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] bg-[#1A241C] border-[#3B4D3A] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#D4AF37]" />
                    Já quero cadastrar meu 1º carro na Garagem 95 agora
                  </span>
                </label>

                {formData.addFirstCar && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#1A241C] border border-[#D4AF37]/30 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-[#A2B3A4] mb-1 font-semibold">Marca</label>
                        <input
                          type="text"
                          value={formData.carBrand}
                          onChange={(e) => setFormData({ ...formData, carBrand: e.target.value })}
                          placeholder="Ford, Chevrolet, VW..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A2B3A4] mb-1 font-semibold">Modelo</label>
                        <input
                          type="text"
                          value={formData.carModel}
                          onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                          placeholder="Mustang, Opala, SP2..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A2B3A4] mb-1 font-semibold">Ano</label>
                        <input
                          type="number"
                          value={formData.carYear}
                          onChange={(e) => setFormData({ ...formData, carYear: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[11px] text-[#A2B3A4] font-semibold">Certificação:</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="plate"
                          checked={formData.carPlateType === 'preta'}
                          onChange={() => setFormData({ ...formData, carPlateType: 'preta' })}
                          className="text-[#D4AF37] focus:ring-0"
                        />
                        <span className="text-[#F3E5AB]">Placa Preta de Coleção</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="plate"
                          checked={formData.carPlateType === 'mercosul'}
                          onChange={() => setFormData({ ...formData, carPlateType: 'mercosul' })}
                          className="text-[#D4AF37] focus:ring-0"
                        />
                        <span className="text-[#E8ECE8]">Placa Mercosul</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                id="btn-submit-registration"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer group"
              >
                <span>Concluir Cadastro & Entrar na Garage 95</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          )}

          {/* Form: Login Mode */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-mail ou Nome de Usuário</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="pedro@exemplo.com ou @carlos_v8"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Senha</span>
                  </span>
                  <a href="#recuperar" onClick={(e) => { e.preventDefault(); setErrorMsg('Instruções de redefinição foram enviadas para seu e-mail.'); }} className="text-[10px] text-[#D4AF37] hover:underline">
                    Esqueceu a senha?
                  </a>
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#6E8070]"
                />
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#AA820A] hover:from-[#E5C158] hover:to-[#C9A227] text-[#121713] text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer group"
              >
                <span>Acessar Garage 95</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="pt-4 border-t border-[#3B4D3A]/40 text-center text-[11px] text-[#8EA290]">
                Demo accounts disabled.
              </p>

            </form>
          )}

        </div>

        {/* Footer info & pledge */}
        <div className="px-6 py-4 bg-[#0E150F] border-t border-[#3B4D3A]/50 flex items-center justify-between text-[11px] text-[#7E9180]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Rede Segura & Certificação Placa Preta</span>
          </div>
          <span className="font-mono text-[#D4AF37]">Garage 95 &copy; 2026</span>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* Interactive Google OAuth Dialog Simulation */}
      {/* ---------------------------------------------------- */}
      {socialModalType === 'google' && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] text-[#202124] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95">
            
            <button
              onClick={() => setSocialModalType(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="font-semibold text-lg text-gray-800">Fazer login com o Google</h3>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Para vincular e continuar no aplicativo <strong className="text-gray-900">Garage 95</strong>, escolha ou confirme sua conta do Google:
            </p>

            {socialStep === 'authorizing' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-700">Autenticando e sincronizando perfil com a Garage 95...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Pedro Agne Dias',
                    email: 'pedroagnedias1995@gmail.com',
                    avatar: ''
                  },
                  {
                    name: 'Carlos "Caito" Pires',
                    email: 'carlos.pires.garage@gmail.com',
                    avatar: ''
                  }
                ].map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#263628] border border-[#D4AF37] flex items-center justify-center text-[#8EA290]">
                      {acc.avatar ? <img src={acc.avatar} alt={acc.name} className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{acc.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                  </button>
                ))}

                <button
                  onClick={() => handleSelectGoogleAccount({
                    name: 'Novo Colecionador Google',
                    email: 'novo.membro@gmail.com',
                    avatar: ''
                  })}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gray-300 hover:bg-gray-50 text-xs font-medium text-gray-600 text-center cursor-pointer"
                >
                  + Usar outra conta Google
                </button>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>Privacidade & Termos Google</span>
              <span>Garage 95 API OAuth</span>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Interactive Meta OAuth Dialog Simulation */}
      {/* ---------------------------------------------------- */}
      {socialModalType === 'meta' && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18191a] text-[#e4e6eb] rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#3a3b3c] animate-in zoom-in-95">
            
            <button
              onClick={() => setSocialModalType(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#3a3b3c] text-gray-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0064E0] to-[#00C4FA] flex items-center justify-center font-bold text-white text-xs">
                ∞
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">Conectar com Meta</h3>
                <p className="text-[11px] text-gray-400">Instagram & Facebook Accounts</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              A <strong className="text-[#D4AF37]">Garage 95</strong> solicita permissão para importar seu nome, biografia de colecionador e foto de perfil.
            </p>

            {socialStep === 'authorizing' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#0081FB] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-200">Vinculando com seu perfil Meta / Instagram...</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Pedro Dias',
                    instagram: '@pedrodias_95',
                    avatar: ''
                  },
                  {
                    name: 'Helena von Sternberg',
                    instagram: '@helenasternberg_sp2',
                    avatar: ''
                  }
                ].map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectMetaAccount(acc)}
                    className="w-full p-3 rounded-xl bg-[#242526] hover:bg-[#3a3b3c] border border-[#3e4042] flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#263628] border border-[#D4AF37] flex items-center justify-center text-[#8EA290]">
                      {acc.avatar ? <img src={acc.avatar} alt={acc.name} className="w-full h-full rounded-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-white group-hover:text-[#0081FB] transition-colors">{acc.name}</p>
                      <p className="text-[11px] text-[#D4AF37] font-mono">{acc.instagram}</p>
                    </div>
                    <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  </button>
                ))}

                <button
                  onClick={() => handleSelectMetaAccount({
                    name: 'Entusiasta Meta',
                    instagram: '@garage95_driver',
                    avatar: ''
                  })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#242526] hover:bg-[#3a3b3c] border border-dashed border-[#3e4042] text-xs font-medium text-gray-300 text-center cursor-pointer"
                >
                  + Vincular com outra conta do Instagram / Meta
                </button>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-[#3a3b3c] text-[11px] text-gray-400 flex justify-between">
              <span>Meta Graph API v20.0</span>
              <span>Garage 95 Verified</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
