import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
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
  AlertCircle,
  ArrowLeft,
  Camera,
  Upload,
  Check,
  Flame,
  Car,
  Compass,
  FileText,
  ShieldAlert,
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import { User, Vehicle } from '../types';
import { NEUTRAL_USER } from '../data/mockData';
import { engineSound } from '../utils/engineSound';
import confetti from 'canvas-confetti';
import { AppLogo } from './AppLogo';

export type AuthGateStep = 'welcome' | 'register_manual' | 'login' | 'basic_profile' | 'celebration';

interface WelcomeAuthGateProps {
  isOpen: boolean;
  onComplete: (user: User, initialVehicle?: Partial<Vehicle>) => void;
  onClose?: () => void;
  onLogout?: () => void;
  currentUser?: User;
}

// Preset classic avatars for 1-click selection in basic profile
const PRESET_AVATARS = [
  { id: 'av1', label: 'Colecionador Piloto', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Entusiasta Clássico', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Pilota Aircooled', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Mestre Restaurador', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Piloto Vintage', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Colecionadora Rara', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'av7', label: 'Especialista V8', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80' },
  { id: 'av8', label: 'Curador Histórico', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
];

const INTEREST_TAGS = [
  'Muscle Cars V8',
  'Aircooled & Fusca',
  'Esportivos Europeus',
  'Nacionais Clássicos (Opala, Maverick, Dodge)',
  'Hot Rods & Custom',
  'Motos Vintage',
  'Italianos & Scuderia',
  'Utilitários & Picapes Antigas',
  'Restauração & Mecânica'
];

const ERA_TAGS = [
  'Anos 50 & Pré-Guerra',
  'Anos 60 (Era Dourada)',
  'Anos 70 (Muscle & Crise do Petróleo)',
  'Anos 80 (Youngtimers & Turbos)',
  'Anos 90 (Lendas Japonesas & Supercarros)',
  'Anos 2000+ (Clássicos Modernos)'
];

const LOCATION_SUGGESTIONS = [
  'São Paulo, SP',
  'Curitiba, PR',
  'Belo Horizonte, MG',
  'Rio de Janeiro, RJ',
  'Porto Alegre, RS',
  'Brasília, DF',
  'Campinas, SP',
  'Florianópolis, SC',
  'Salvador, BA'
];

export const WelcomeAuthGate: React.FC<WelcomeAuthGateProps> = ({
  isOpen,
  onComplete,
  onClose,
  currentUser
}) => {
  // Step state with local storage persistence
  const [currentStep, setCurrentStep] = useState<AuthGateStep>(() => {
    try {
      const savedStep = localStorage.getItem('garage95_onboarding_step') as AuthGateStep;
      if (savedStep && ['welcome', 'register_manual', 'login', 'basic_profile', 'celebration'].includes(savedStep)) {
        return savedStep;
      }
    } catch {
      // ignore
    }
    return 'welcome';
  });

  // Intermediate pending user state
  const [pendingUserData, setPendingUserData] = useState<Partial<User>>(() => {
    try {
      const saved = localStorage.getItem('garage95_pending_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: '',
      email: '',
      handle: '',
      avatar: '',
      location: 'São Paulo, SP',
      bio: '',
      specialty: 'Muscle Cars V8',
      favoriteEra: 'Anos 70 (Muscle & Crise do Petróleo)',
      instagram: '',
      authProvider: 'email'
    };
  });

  // Manual Register form inputs
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation touched states
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirmPassword, setTouchedConfirmPassword] = useState(false);
  const [touchedTerms, setTouchedTerms] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Basic Profile form inputs (Tela 3)
  const [profileAvatar, setProfileAvatar] = useState<string>(pendingUserData.avatar || '');
  const [profileName, setProfileName] = useState<string>(pendingUserData.name || '');
  const [profileHandle, setProfileHandle] = useState<string>(pendingUserData.handle || '');
  const [profileLocation, setProfileLocation] = useState<string>(pendingUserData.location || 'São Paulo, SP');
  const [profileBio, setProfileBio] = useState<string>(pendingUserData.bio || '');
  const [profileInterest, setProfileInterest] = useState<string>(pendingUserData.specialty || 'Muscle Cars V8');
  const [profileEra, setProfileEra] = useState<string>(pendingUserData.favoriteEra || 'Anos 70 (Muscle & Crise do Petróleo)');
  const [profileInstagram, setProfileInstagram] = useState<string>(pendingUserData.instagram || '');
  const [garageBrand, setGarageBrand] = useState('');
  const [garageModel, setGarageModel] = useState('');
  const [garageYear, setGarageYear] = useState('');
  const [garageCategory, setGarageCategory] = useState<'carro' | 'moto'>('carro');
  const [showOptionalFields, setShowOptionalFields] = useState(true);
  const [profileError, setProfileError] = useState('');

  // Social Auth Modal states
  const [socialModalType, setSocialModalType] = useState<'google' | 'meta' | null>(null);
  const [socialStep, setSocialStep] = useState<'select' | 'authorizing'>('select');

  // Terms & Privacy Modals
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('garage95_onboarding_step', currentStep);
    } catch {
      // ignore
    }
  }, [currentStep]);

  useEffect(() => {
    try {
      localStorage.setItem('garage95_pending_user', JSON.stringify(pendingUserData));
    } catch {
      // ignore
    }
  }, [pendingUserData]);

  // Keep Profile form updated if pendingUserData changes
  useEffect(() => {
    if (pendingUserData.name && !profileName) {
      setProfileName(pendingUserData.name);
    }
    if (pendingUserData.handle && !profileHandle) {
      setProfileHandle(pendingUserData.handle);
    }
    if (pendingUserData.avatar && !profileAvatar) {
      setProfileAvatar(pendingUserData.avatar);
    }
    if (pendingUserData.email && !registerEmail) {
      setRegisterEmail(pendingUserData.email);
    }
  }, [pendingUserData]);

  // Auto-generate clean handle from name if not manually modified
  const handleNameChange = (val: string) => {
    setProfileName(val);
    if (!profileHandle || profileHandle === generateHandleFromName(profileName)) {
      setProfileHandle(generateHandleFromName(val));
    }
  };

  const generateHandleFromName = (nameStr: string) => {
    if (!nameStr.trim()) return '@membro_95';
    const clean = nameStr
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    return `@${clean || 'colecionador'}`;
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vazia', color: 'bg-neutral-600', textClass: 'text-neutral-500' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) score += 1;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-red-500', textClass: 'text-red-400' };
    if (score === 2) return { score: 2, label: 'Média', color: 'bg-amber-500', textClass: 'text-amber-400' };
    return { score: 3, label: 'Forte & Segura', color: 'bg-emerald-500', textClass: 'text-emerald-400' };
  };

  // Validation functions
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Check if email is already in registered database
  const getExistingAccounts = (): User[] => {
    try {
      const saved = localStorage.getItem('garage95_accounts_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  };

  const saveAccountToDb = (newUser: User) => {
    try {
      const existing = getExistingAccounts();
      const filtered = existing.filter(u => u.id !== newUser.id && u.email !== newUser.email);
      const updated = [newUser, ...filtered];
      localStorage.setItem('garage95_accounts_db', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // ----------------------------------------------------
  // Action Handlers
  // ----------------------------------------------------

  // 1. Submit Manual Register (Tela 2a)
  const handleManualRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedName(true);
    setTouchedEmail(true);
    setTouchedPassword(true);
    setTouchedConfirmPassword(true);
    setTouchedTerms(true);
    setRegisterError('');

    if (!registerName.trim()) {
      setRegisterError('Por favor, informe seu nome completo.');
      return;
    }
    if (!isEmailValid(registerEmail)) {
      setRegisterError('Por favor, insira um e-mail válido.');
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('As senhas digitadas não coincidem.');
      return;
    }
    if (!acceptTerms) {
      setRegisterError('Você deve aceitar os Termos de Uso e Política de Privacidade para continuar.');
      return;
    }

    // Check if email already exists -> suggest login
    const allAccounts = getExistingAccounts();
    const existing = allAccounts.find(u => u.email?.toLowerCase() === registerEmail.trim().toLowerCase());
    if (existing) {
      setLoginIdentifier(existing.email || existing.handle);
      setLoginError(`O e-mail ${registerEmail} já possui cadastro. Faça login ou use o login social.`);
      setCurrentStep('login');
      return;
    }

    // Create partial user for next step (Tela 3)
    const suggestedHandle = generateHandleFromName(registerName);
    const updatedPending: Partial<User> = {
      id: `usr_${Date.now()}`,
      name: registerName.trim(),
      email: registerEmail.trim(),
      handle: suggestedHandle,
      avatar: '',
      location: 'São Paulo, SP',
      bio: 'Entusiasta de carros clássicos e preservação histórica.',
      specialty: 'Muscle Cars V8',
      favoriteEra: 'Anos 70 (Muscle & Crise do Petróleo)',
      authProvider: 'email',
      linkedProviders: ['email']
    };

    setPendingUserData(updatedPending);
    setProfileName(updatedPending.name || '');
    setProfileHandle(suggestedHandle);
    setProfileAvatar('');
    setCurrentStep('basic_profile');
  };

  // 2. Google OAuth Simulation (2b)
  const handleSelectGoogleAccount = (googleAccount: { name: string; email: string; avatar: string }) => {
    setSocialStep('authorizing');
    setTimeout(() => {
      // Check if user already exists
      const allAccounts = getExistingAccounts();
      const existing = allAccounts.find(u => u.email?.toLowerCase() === googleAccount.email.toLowerCase());

      if (existing) {
        // Direct login to feed
        try {
          engineSound.playRev();
        } catch {}
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#D4AF37']
        });
        setSocialModalType(null);
        onComplete(existing);
        return;
      }

      // New account -> Import Name, Email, Avatar and proceed to Tela 3 (Basic Profile)
      const suggestedHandle = `@${googleAccount.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const newPending: Partial<User> = {
        id: `usr_google_${Date.now()}`,
        name: googleAccount.name,
        email: googleAccount.email,
        handle: suggestedHandle,
        avatar: googleAccount.avatar,
        location: 'São Paulo, SP',
        bio: 'Membro certificado conectado via Google Workspace.',
        specialty: 'Veículos Históricos & Esportivos',
        favoriteEra: 'Anos 60 (Era Dourada)',
        authProvider: 'google',
        linkedProviders: ['google']
      };

      setPendingUserData(newPending);
      setProfileName(newPending.name || '');
      setProfileHandle(suggestedHandle);
      setProfileAvatar(googleAccount.avatar);
      setSocialModalType(null);
      setCurrentStep('basic_profile');
    }, 700);
  };

  // 3. Meta / Instagram OAuth Simulation (2b)
  const handleSelectMetaAccount = (metaAccount: { name: string; instagram: string; avatar: string }) => {
    setSocialStep('authorizing');
    setTimeout(() => {
      const metaEmail = `${metaAccount.instagram.replace('@', '')}@meta.garage95.com`;
      const allAccounts = getExistingAccounts();
      const existing = allAccounts.find(u => u.email?.toLowerCase() === metaEmail.toLowerCase() || u.handle?.toLowerCase() === metaAccount.instagram.toLowerCase());

      if (existing) {
        try {
          engineSound.playRev();
        } catch {}
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0081FB', '#833AB4', '#FD1D1D', '#FCAF45', '#D4AF37']
        });
        setSocialModalType(null);
        onComplete(existing);
        return;
      }

      const newPending: Partial<User> = {
        id: `usr_meta_${Date.now()}`,
        name: metaAccount.name,
        email: metaEmail,
        handle: metaAccount.instagram.startsWith('@') ? metaAccount.instagram : `@${metaAccount.instagram}`,
        avatar: metaAccount.avatar,
        location: 'Curitiba, PR',
        instagram: metaAccount.instagram,
        bio: 'Colecionador de esportivos clássicos conectado via Meta.',
        specialty: 'Porsche & Aircooled',
        favoriteEra: 'Anos 80 (Youngtimers & Turbos)',
        authProvider: 'meta',
        linkedProviders: ['meta']
      };

      setPendingUserData(newPending);
      setProfileName(newPending.name || '');
      setProfileHandle(newPending.handle || '');
      setProfileAvatar(metaAccount.avatar);
      setProfileInstagram(metaAccount.instagram);
      setSocialModalType(null);
      setCurrentStep('basic_profile');
    }, 700);
  };

  // 4. Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('Por favor, informe seu e-mail ou @handle.');
      return;
    }

    const allAccounts = getExistingAccounts();
    const cleanId = loginIdentifier.trim().toLowerCase();
    const matched = allAccounts.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.handle && u.handle.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );

    if (matched) {
      try {
        engineSound.playRev();
      } catch {}
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C158', '#4E7A53', '#FFFFFF']
      });
      onComplete(matched);
      return;
    }

    // If not found in known accounts, generate session
    const fallbackUser: User = {
      ...NEUTRAL_USER,
      id: `usr_${Date.now()}`,
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0].toUpperCase() : loginIdentifier,
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier.replace(/[^a-z0-9]/gi, '')}@garage95.com`,
      handle: loginIdentifier.startsWith('@') ? loginIdentifier : `@${loginIdentifier.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`,
      location: 'São Paulo, SP',
      collectorTier: 'Entusiasta Clássico'
    };

    try {
      engineSound.playRev();
    } catch {}
    saveAccountToDb(fallbackUser);
    onComplete(fallbackUser);
  };

  // 5. Complete Basic Profile (Tela 3) -> Transition to Celebration
  const handleCompleteBasicProfile = () => {
    setProfileError('');

    if (!profileName.trim()) {
      setProfileError('O Nome de exibição é obrigatório.');
      return;
    }
    if (!profileHandle.trim()) {
      setProfileError('O @handle de usuário é obrigatório.');
      return;
    }
    if (!profileLocation.trim()) {
      setProfileError('A Localização (Cidade/Estado) é obrigatória.');
      return;
    }
    if (!profileAvatar.trim()) {
      setProfileError('Por favor, selecione ou envie uma foto de perfil.');
      return;
    }

    const cleanHandle = profileHandle.startsWith('@') 
      ? profileHandle.trim() 
      : `@${profileHandle.trim().toLowerCase().replace(/\s+/g, '_')}`;

    const completedUser: User = {
      id: pendingUserData.id || `usr_${Date.now()}`,
      name: profileName.trim(),
      handle: cleanHandle,
      email: pendingUserData.email || `${cleanHandle.replace('@', '')}@garage95.com`,
      avatar: profileAvatar.trim(),
      coverImage: pendingUserData.coverImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80',
      bio: profileBio.trim() || 'Membro oficial da comunidade Garage 95.',
      location: profileLocation.trim(),
      collectorTier: 'Entusiasta Clássico',
      memberSince: '2026',
      garageCount: 0,
      followersCount: 1,
      followingCount: 3,
      totalLikes: 0,
      reputationScore: 95,
      verifiedCollector: true,
      authProvider: pendingUserData.authProvider || 'email',
      linkedProviders: pendingUserData.linkedProviders || ['email'],
      originalityScore: 92,
      specialty: profileInterest || 'Automóveis Históricos & Colecionismo',
      favoriteEra: profileEra || 'Anos 70 (Muscle & Crise do Petróleo)',
      instagram: profileInstagram.trim() ? (profileInstagram.startsWith('@') ? profileInstagram : `@${profileInstagram}`) : undefined,
      trophies: [
        {
          title: 'Credencial Oficial Garage 95',
          year: 2026,
          event: 'Inauguração & Registro de Acervo',
          category: 'Membro Fundador'
        }
      ]
    };

    const initialVehicle: Partial<Vehicle> | undefined = garageBrand.trim() && garageModel.trim()
      ? {
          brand: garageBrand.trim(),
          model: garageModel.trim(),
          year: Number(garageYear) || 2000,
          category: garageCategory,
          color: 'A definir',
          plateType: 'nao_informado',
          status: 'garage'
        }
      : undefined;

    // Save to account database & pending state
    saveAccountToDb(completedUser);
    setPendingUserData(completedUser);

    // Audio & celebratory effects
    try {
      engineSound.playRev();
    } catch {}

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#E5C158', '#4E7A53', '#FFFFFF', '#141C15']
    });

    // Advance to transition / celebration splash
    setCurrentStep('celebration');

    // Auto-redirect to Feed after 2.6 seconds
    setTimeout(() => {
      onComplete(completedUser, initialVehicle);
    }, 2600);
  };

  // Image Upload handler for Avatar
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setProfileAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick switch between demo accounts for instant test
  const handleQuickDemoLogin = (user: User) => {
    try {
      engineSound.playRev();
    } catch {}
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#263628', '#F3E5AB']
    });
    onComplete(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0F0B] flex flex-col justify-between text-[#E8ECE8] selection:bg-[#D4AF37] selection:text-[#121713]">
      
      {/* Immersive Vintage Classic Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F0B]/95 via-[#0E150F]/90 to-[#0A0F0B]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-[#2E4A33]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Top Header Branding */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo size="md" variant="horizontal" />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#162118] border border-[#D4AF37]/30 text-xs text-[#D4AF37] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Comunidade & Acervo FIVA</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#141C15] hover:bg-[#263628] text-[#8EA290] hover:text-[#F3E5AB] border border-[#3B4D3A]/60 transition-colors cursor-pointer"
              title="Fechar e explorar a plataforma"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 flex-1 flex flex-col justify-center">

        {/* ========================================================================= */}
        {/* TELA 1 — BOAS-VINDAS / CADASTRO (WELCOME GATE) */}
        {/* ========================================================================= */}
        {currentStep === 'welcome' && (
          <div className="w-full bg-[#141C15]/95 border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in fade-in duration-300">
            
            {/* Header / Value Proposition */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-[#263628] to-[#162118] border border-[#D4AF37]/40 text-[#D4AF37] shadow-inner mb-1">
                <Car className="w-8 h-8 text-[#D4AF37]" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-serif-heading font-black text-[#F3E5AB] tracking-tight">
                o clube da cultura automotiva
              </h1>
              
              <p className="text-xs sm:text-sm text-[#A3B8A6] max-w-md mx-auto leading-relaxed">
                A rede exclusiva para colecionadores, restauradores e entusiastas de veículos históricos, clássicos e esportivos.
              </p>
            </div>

            {/* Three Access Buttons (Requested Exact Order & Visual Hierarchy) */}
            <div className="space-y-3.5 max-w-md mx-auto">
              
              {/* 1. Continuar com Google (Branco/Neutro padrão Google) */}
              <button
                type="button"
                id="btn-welcome-google"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('google');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-medium text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span className="font-semibold text-neutral-800">Continuar com Google</span>
              </button>

              {/* 2. Continuar com Meta/Facebook (Azul oficial Meta) */}
              <button
                type="button"
                id="btn-welcome-meta"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('meta');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-semibold text-white">Continuar com Meta / Facebook</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-[#7E9180] tracking-wider font-mono">
                  ou registro manual
                </span>
                <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
              </div>

              {/* 3. Cadastrar com e-mail (Estilo dourado, ação principal da plataforma) */}
              <button
                type="button"
                id="btn-welcome-email"
                onClick={() => {
                  setRegisterError('');
                  setCurrentStep('register_manual');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#141C15] font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer group active:scale-[0.99]"
              >
                <Mail className="w-4 h-4 text-[#141C15]" />
                <span>Cadastrar com e-mail</span>
                <ArrowRight className="w-4 h-4 text-[#141C15] group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Subtle Link: Already have an account? Login */}
            <div className="mt-8 text-center pt-5 border-t border-[#3B4D3A]/50">
              <p className="text-xs text-[#8EA290]">
                Já tem uma conta de colecionador?{' '}
                <button
                  type="button"
                  id="link-go-login"
                  onClick={() => {
                    setLoginError('');
                    setCurrentStep('login');
                  }}
                  className="text-[#D4AF37] font-bold hover:text-[#F3E5AB] underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Entrar agora
                </button>
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TELA 2a — CADASTRO MANUAL ("Cadastrar com e-mail") */}
        {/* ========================================================================= */}
        {currentStep === 'register_manual' && (
          <div className="w-full bg-[#141C15]/95 border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in fade-in duration-300">
            
            {/* Header & Back Button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3B4D3A]/50">
              <button
                type="button"
                onClick={() => setCurrentStep('welcome')}
                className="flex items-center gap-1.5 text-xs text-[#8EA290] hover:text-[#F3E5AB] font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar às opções</span>
              </button>

              <span className="text-[11px] font-mono text-[#D4AF37] bg-[#202E22] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                Passo 1 de 2 • Nova Conta
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif-heading font-black text-[#F3E5AB]">
                Cadastrar com E-mail
              </h2>
              <p className="text-xs text-[#A3B8A6]">
                Crie sua credencial de acesso ao acervo Garage 95. Os dados são protegidos.
              </p>
            </div>

            {registerError && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleManualRegisterSubmit} className="space-y-4">
              
              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                  Nome completo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    id="register-input-name"
                    value={registerName}
                    onBlur={() => setTouchedName(true)}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Ex: Pedro Agne Dias"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border focus:outline-none transition-colors placeholder-[#5A6D5C] ${
                      touchedName && !registerName.trim()
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-[#3B4D3A] focus:border-[#D4AF37]'
                    }`}
                  />
                </div>
                {touchedName && !registerName.trim() && (
                  <p className="text-[11px] text-red-400 mt-1">O nome completo é obrigatório.</p>
                )}
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    id="register-input-email"
                    value={registerEmail}
                    onBlur={() => setTouchedEmail(true)}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border focus:outline-none transition-colors placeholder-[#5A6D5C] ${
                      touchedEmail && !isEmailValid(registerEmail)
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-[#3B4D3A] focus:border-[#D4AF37]'
                    }`}
                  />
                </div>
                {touchedEmail && !isEmailValid(registerEmail) && (
                  <p className="text-[11px] text-red-400 mt-1">Insira um endereço de e-mail válido.</p>
                )}
              </div>

              {/* Senha + Indicador de Força */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#D4AF37]">
                    Senha de Acesso <span className="text-red-400">*</span>
                  </label>
                  {registerPassword && (
                    <span className={`text-[11px] font-mono font-bold ${getPasswordStrength(registerPassword).textClass}`}>
                      Força: {getPasswordStrength(registerPassword).label}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="register-input-password"
                    value={registerPassword}
                    onBlur={() => setTouchedPassword(true)}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border focus:outline-none transition-colors placeholder-[#5A6D5C] ${
                      touchedPassword && registerPassword.length < 6
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-[#3B4D3A] focus:border-[#D4AF37]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E9180] hover:text-[#D4AF37] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Visual Bar */}
                {registerPassword && (
                  <div className="mt-1.5 flex gap-1 h-1.5 w-full bg-[#18221A] rounded-full overflow-hidden">
                    <div className={`h-full flex-1 transition-all ${getPasswordStrength(registerPassword).score >= 1 ? getPasswordStrength(registerPassword).color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${getPasswordStrength(registerPassword).score >= 2 ? getPasswordStrength(registerPassword).color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${getPasswordStrength(registerPassword).score >= 3 ? getPasswordStrength(registerPassword).color : 'bg-transparent'}`} />
                  </div>
                )}
                {touchedPassword && registerPassword.length < 6 && (
                  <p className="text-[11px] text-red-400 mt-1">A senha deve ter pelo menos 6 caracteres.</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                  Confirmar Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    id="register-input-confirm-password"
                    value={registerConfirmPassword}
                    onBlur={() => setTouchedConfirmPassword(true)}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Repita a senha digitada"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border focus:outline-none transition-colors placeholder-[#5A6D5C] ${
                      touchedConfirmPassword && registerPassword !== registerConfirmPassword
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-[#3B4D3A] focus:border-[#D4AF37]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E9180] hover:text-[#D4AF37] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touchedConfirmPassword && registerPassword !== registerConfirmPassword && (
                  <p className="text-[11px] text-red-400 mt-1">As senhas não conferem.</p>
                )}
              </div>

              {/* Checkbox de Termos de Uso */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="register-checkbox-terms"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      setTouchedTerms(true);
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-[#D4AF37] bg-[#1A241C] border-[#3B4D3A] focus:ring-[#D4AF37] focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#B4C4B6] leading-snug">
                    Declaro que li e concordo com os{' '}
                    <button
                      type="button"
                      onClick={() => setTermsModalOpen(true)}
                      className="text-[#D4AF37] underline hover:text-[#F3E5AB] cursor-pointer"
                    >
                      Termos de Uso
                    </button>{' '}
                    e a{' '}
                    <button
                      type="button"
                      onClick={() => setPrivacyModalOpen(true)}
                      className="text-[#D4AF37] underline hover:text-[#F3E5AB] cursor-pointer"
                    >
                      Política de Privacidade
                    </button>{' '}
                    do Clube Garage 95. <span className="text-red-400">*</span>
                  </span>
                </label>
                {touchedTerms && !acceptTerms && (
                  <p className="text-[11px] text-red-400 mt-1">O aceite dos termos é obrigatório.</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-register"
                className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#141C15] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Criar Conta & Configurar Perfil</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="mt-6 text-center pt-4 border-t border-[#3B4D3A]/40">
              <p className="text-xs text-[#8EA290]">
                Já possui cadastro?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentStep('login')}
                  className="text-[#D4AF37] font-bold hover:text-[#F3E5AB] underline cursor-pointer"
                >
                  Fazer Login
                </button>
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TELA DE LOGIN ("Já sou Membro") */}
        {/* ========================================================================= */}
        {currentStep === 'login' && (
          <div className="w-full bg-[#141C15]/95 border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in fade-in duration-300">
            
            {/* Back Button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3B4D3A]/50">
              <button
                type="button"
                onClick={() => setCurrentStep('welcome')}
                className="flex items-center gap-1.5 text-xs text-[#8EA290] hover:text-[#F3E5AB] font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao início</span>
              </button>

              <span className="text-[11px] font-mono text-[#D4AF37] bg-[#202E22] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                Acesso de Membro
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif-heading font-black text-[#F3E5AB]">
                Entrar na Garage 95
              </h2>
              <p className="text-xs text-[#A3B8A6]">
                Acesse sua garagem, mensagens e publicações no clube.
              </p>
            </div>

            {/* Social Buttons for quick login */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('google');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSocialStep('select');
                  setSocialModalType('meta');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Meta / Facebook</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
              <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-[#7E9180] tracking-wider font-mono">
                ou com e-mail/handle
              </span>
              <div className="flex-grow border-t border-[#3B4D3A]/60"></div>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                  E-mail ou @handle
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    id="login-input-identifier"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="seu.email@exemplo.com ou @handle"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#5A6D5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E9180]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="login-input-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-[#5A6D5C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7E9180] hover:text-[#D4AF37] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                className="w-full mt-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#141C15] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Acessar o Clube</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Switch to register */}
            <div className="mt-6 text-center pt-4 border-t border-[#3B4D3A]/40">
              <p className="text-xs text-[#8EA290]">
                Ainda não possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentStep('register_manual')}
                  className="text-[#D4AF37] font-bold hover:text-[#F3E5AB] underline cursor-pointer"
                >
                  Cadastre-se agora
                </button>
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TELA 3 — PREENCHIMENTO DO PERFIL BÁSICO (OBRIGATÓRIO MINI-WIZARD) */}
        {/* ========================================================================= */}
        {currentStep === 'basic_profile' && (
          <div className="w-full bg-[#141C15]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-in fade-in duration-300">
            
            {/* Wizard Step Indicator & Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#F3E5AB] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  Passo 2 de 2 • Configuração da Identidade
                </span>
                <span className="font-mono text-[#D4AF37] font-bold">100% Obrigatório</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#18221A] rounded-full overflow-hidden border border-[#3B4D3A]/60">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] transition-all duration-500 rounded-full"
                  style={{
                    width: profileAvatar && profileName.trim() && profileHandle.trim() && profileLocation.trim() ? '100%' : '65%'
                  }}
                />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif-heading font-black text-[#F3E5AB]">
                Complete seu Perfil de Colecionador
              </h2>
              <p className="text-xs text-[#A3B8A6]">
                Para manter a alta qualidade e segurança do clube, defina sua foto, nome de exibição e localização antes de acessar o Feed.
              </p>
            </div>

            {profileError && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <div className="space-y-6">
              
              {/* 1. SEÇÃO DE FOTO DE PERFIL (OBRIGATÓRIA) */}
              <div className="p-4 rounded-2xl bg-[#18221A] border border-[#3B4D3A]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#D4AF37]" />
                    <span>Foto de Perfil</span> <span className="text-red-400">*</span>
                  </label>
                  {pendingUserData.authProvider && pendingUserData.authProvider !== 'email' && (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Importada via {pendingUserData.authProvider === 'google' ? 'Google' : 'Meta'} ✓
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Current Selected Avatar Display */}
                  <div className="relative shrink-0">
                    {profileAvatar ? (
                      <img
                        src={profileAvatar}
                        alt="Avatar selecionado"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg shadow-black/60"
                      />
                    ) : (
                      <div
                        aria-label="Nenhuma foto selecionada"
                        className="w-20 h-20 rounded-full bg-[#141C15] border-2 border-dashed border-[#D4AF37]/70 flex items-center justify-center text-[#8EA290]"
                      >
                        <Camera className="w-7 h-7" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Fazer upload de foto própria"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </div>

                  <p className="flex-1 text-[11px] text-[#8EA290]">
                    O cadastro por e-mail exige o upload de uma foto real do seu dispositivo.
                  </p>
                </div>
              </div>

              {/* 2. CAMPOS OBRIGATÓRIOS: NOME, @HANDLE E LOCALIZAÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nome de Exibição */}
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5">
                    Nome de Exibição <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="profile-input-name"
                    value={profileName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Pedro Dias"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>

                {/* Nome de Usuário / @handle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#D4AF37]">
                      @Handle no Clube <span className="text-red-400">*</span>
                    </label>
                    {profileHandle && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> disponível
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    id="profile-input-handle"
                    value={profileHandle}
                    onChange={(e) => setProfileHandle(e.target.value)}
                    placeholder="@pedrodias_95"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Localização (Cidade / Estado) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Localização (Cidade e Estado)</span> <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    id="profile-input-location"
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A241C] text-sm text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none transition-colors mb-2"
                  />

                  {/* Quick location chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {LOCATION_SUGGESTIONS.map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setProfileLocation(loc)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          profileLocation === loc
                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold'
                            : 'bg-[#18221A] border-[#3B4D3A]/40 text-[#8EA290] hover:text-[#E8ECE8]'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. CAMPOS OPCIONAIS (Acordeão / Seletor não bloqueante) */}
              <div className="pt-2 border-t border-[#3B4D3A]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#E8ECE8] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Preferências & Personalização</span>
                    <span className="text-[10px] text-[#8EA290] font-normal font-mono">[Opcionais]</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    {showOptionalFields ? 'Recolher opcionais' : 'Expandir opcionais'}
                  </button>
                </div>

                {showOptionalFields && (
                  <div className="space-y-4 p-4 rounded-2xl bg-[#18221A]/80 border border-[#3B4D3A]/40 animate-in fade-in duration-200">
                    
                    {/* Biografia Curta */}
                    <div>
                      <label className="block text-xs font-medium text-[#B4C4B6] mb-1">
                        Biografia curta
                      </label>
                      <textarea
                        rows={2}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Conte brevemente sobre sua paixão ou seus projetos de restauração..."
                        className="w-full px-3 py-2 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none resize-none placeholder-[#5A6D5C]"
                      />
                    </div>

                    {/* Interesse Principal */}
                    <div>
                      <label className="block text-xs font-medium text-[#B4C4B6] mb-2 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Principal Interesse no Clube:</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {INTEREST_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setProfileInterest(tag)}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                              profileInterest === tag
                                ? 'bg-[#C9A227] text-[#121713] font-bold border-[#C9A227] shadow-sm'
                                : 'bg-[#141C15] text-[#8EA290] border-[#3B4D3A]/50 hover:border-[#D4AF37]/50 hover:text-[#E8ECE8]'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Era Favorita */}
                    <div>
                      <label className="block text-xs font-medium text-[#B4C4B6] mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Era Automotiva Favorita:</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ERA_TAGS.map(era => (
                          <button
                            key={era}
                            type="button"
                            onClick={() => setProfileEra(era)}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                              profileEra === era
                                ? 'bg-[#D4AF37]/20 text-[#F3E5AB] font-bold border-[#D4AF37]'
                                : 'bg-[#141C15] text-[#8EA290] border-[#3B4D3A]/50 hover:border-[#D4AF37]/50 hover:text-[#E8ECE8]'
                            }`}
                          >
                            {era}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-xs font-medium text-[#B4C4B6] mb-1 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Instagram (para cross-divulgação de acervo)</span>
                      </label>
                      <input
                        type="text"
                        value={profileInstagram}
                        onChange={(e) => setProfileInstagram(e.target.value)}
                        placeholder="@seu_instagram"
                        className="w-full px-3 py-2 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                  </div>
                )}
              </div>

              {/* 4. PRIMEIRA GARAGEM: cadastro rápido e opcional */}
              <div className="p-4 rounded-2xl bg-[#18221A] border border-[#D4AF37]/40 space-y-3">
                <div className="flex items-start gap-2">
                  <Car className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#D4AF37]">Comece pela sua Garagem</p>
                    <p className="text-[11px] text-[#8EA290]">
                      Cadastre apenas o essencial agora. Você poderá completar a ficha depois.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={garageBrand}
                    onChange={(e) => setGarageBrand(e.target.value)}
                    placeholder="Marca (ex.: Ford)"
                    aria-label="Marca do primeiro veículo"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={garageModel}
                    onChange={(e) => setGarageModel(e.target.value)}
                    placeholder="Modelo (ex.: Mustang)"
                    aria-label="Modelo do primeiro veículo"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2026"
                    value={garageYear}
                    onChange={(e) => setGarageYear(e.target.value)}
                    placeholder="Ano"
                    aria-label="Ano do primeiro veículo"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <select
                    value={garageCategory}
                    onChange={(e) => setGarageCategory(e.target.value as 'carro' | 'moto')}
                    aria-label="Categoria do primeiro veículo"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141C15] text-xs text-[#E8ECE8] border border-[#3B4D3A] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
              </div>

              {/* Botão de Conclusão Obrigatório */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  id="btn-complete-onboarding"
                  onClick={handleCompleteBasicProfile}
                  disabled={!profileName.trim() || !profileHandle.trim() || !profileLocation.trim() || !profileAvatar.trim()}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                    profileName.trim() && profileHandle.trim() && profileLocation.trim() && profileAvatar.trim()
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C9A227] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] text-[#141C15] cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-[#263628] text-[#7E9180] border border-[#3B4D3A]/40 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Award className="w-5 h-5 text-[#141C15]" />
                  <span>{garageBrand.trim() && garageModel.trim() ? 'Criar minha Garagem & Entrar' : 'Concluir Cadastro & Entrar na Garage 95'}</span>
                  <ArrowRight className="w-4 h-4 text-[#141C15]" />
                </button>

                <p className="text-center text-[11px] text-[#7E9180]">
                  Seus dados e fotos poderão ser alterados a qualquer momento no seu Perfil.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TELA DE CELEBRAÇÃO & TRANSIÇÃO (SPLASH DE BOAS-VINDAS) */}
        {/* ========================================================================= */}
        {currentStep === 'celebration' && (
          <div className="w-full max-w-md mx-auto text-center bg-[#141C15] border-2 border-[#D4AF37] rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(212,175,55,0.4)] backdrop-blur-2xl animate-in zoom-in-95 duration-500">
            
            <div className="relative inline-block mb-4">
              {pendingUserData.avatar ? (
                <img
                  src={pendingUserData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37] shadow-2xl mx-auto"
                />
              ) : (
                <div
                  aria-label="Foto de perfil não definida"
                  className="w-24 h-24 rounded-full border-4 border-dashed border-[#D4AF37] bg-[#263628] text-[#8EA290] flex items-center justify-center shadow-2xl mx-auto"
                >
                  <Camera className="w-8 h-8" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#C9A227] text-[#121713] shadow-md animate-bounce">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#263628] px-3 py-1 rounded-full border border-[#D4AF37]/40">
                Credencial de Membro Emitida
              </span>
              
              <h2 className="text-2xl sm:text-3xl font-serif-heading font-black text-[#F3E5AB]">
                Bem-vindo(a) ao Garage 95!
              </h2>
              
              <p className="text-sm font-bold text-[#E8ECE8]">
                {pendingUserData.name || 'Colecionador'} <span className="text-[#D4AF37] font-mono">{pendingUserData.handle}</span>
              </p>

              <p className="text-xs text-[#A3B8A6] max-w-xs mx-auto pt-2">
                Sua conta oficial foi registrada com sucesso. Redirecionando para a linha do tempo...
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-[#D4AF37] font-mono">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span>Acessando o Feed Principal...</span>
              </div>

              <button
                type="button"
                id="btn-celebration-feed"
                onClick={() => {
                  const targetUser = (pendingUserData.name ? (pendingUserData as User) : (currentUser || NEUTRAL_USER));
                  onComplete(targetUser);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#141C15] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Car className="w-4 h-4 text-[#141C15]" />
                <span>Ir para o Feed Agora</span>
                <ArrowRight className="w-4 h-4 text-[#141C15]" />
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer Legal Links */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 text-center text-xs text-[#7E9180] border-t border-[#263628]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Garage 95 Club • Todos os direitos reservados.</p>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTermsModalOpen(true)}
            className="hover:text-[#D4AF37] transition-colors underline underline-offset-4 cursor-pointer"
          >
            Termos de Uso
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setPrivacyModalOpen(true)}
            className="hover:text-[#D4AF37] transition-colors underline underline-offset-4 cursor-pointer"
          >
            Política de Privacidade
          </button>
          <span>•</span>
          <span className="text-[#5A6D5C]">Homologação & Proteção FIVA</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SOCIAL OAUTH SIMULATION MODAL (GOOGLE / META) */}
      {/* ========================================================================= */}
      {socialModalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#162018] border-2 border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#3B4D3A]/50">
              <div className="flex items-center gap-2">
                {socialModalType === 'google' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <h3 className="font-bold text-sm text-[#F3E5AB]">
                  {socialModalType === 'google' ? 'Entrar com Google' : 'Entrar com Meta'}
                </h3>
              </div>

              <button
                onClick={() => setSocialModalType(null)}
                className="p-1 rounded-lg text-[#7E9180] hover:text-[#E8ECE8] hover:bg-[#202E22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {socialStep === 'select' ? (
              <div className="space-y-3">
                <p className="text-xs text-[#B4C4B6]">
                  Selecione a conta para autenticar e sincronizar sua credencial:
                </p>

                {socialModalType === 'google' ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectGoogleAccount({
                        name: 'Pedro Agne Dias',
                        email: 'pedroagnedias1995@gmail.com',
                        avatar: ''
                      })}
                      className="w-full p-3 rounded-xl bg-[#1E2B20] hover:bg-[#263729] border border-[#3B4D3A] flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#263628] border border-[#D4AF37] flex items-center justify-center text-[#8EA290]">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#E8ECE8]">Pedro Agne Dias</p>
                          <p className="text-[11px] text-[#8EA290]">pedroagnedias1995@gmail.com</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectGoogleAccount({
                        name: 'Eduardo Vasconcellos',
                        email: 'edu.vasconcellos@gmail.com',
                        avatar: ''
                      })}
                      className="w-full p-3 rounded-xl bg-[#1E2B20] hover:bg-[#263729] border border-[#3B4D3A] flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#263628] border border-[#D4AF37] flex items-center justify-center text-[#8EA290]">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#E8ECE8]">Eduardo Vasconcellos</p>
                          <p className="text-[11px] text-[#8EA290]">edu.vasconcellos@gmail.com</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectMetaAccount({
                        name: 'Pedro Agne Dias',
                        instagram: '@pedrodias_v8',
                        avatar: ''
                      })}
                      className="w-full p-3 rounded-xl bg-[#1E2B20] hover:bg-[#263729] border border-[#3B4D3A] flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#263628] border border-[#D4AF37] flex items-center justify-center text-[#8EA290]">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#E8ECE8]">Pedro Agne Dias</p>
                          <p className="text-[11px] text-[#8EA290]">Instagram: @pedrodias_v8</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#F3E5AB]">Autorizando acesso seguro...</p>
                <p className="text-[11px] text-[#8EA290]">Sincronizando foto e dados do perfil com a Garage 95.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TERMOS DE USO MODAL */}
      {/* ========================================================================= */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#141C15] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[80vh] flex flex-col text-xs text-[#B4C4B6]">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#3B4D3A]/60">
              <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                <FileText className="w-5 h-5" />
                <span>Termos de Uso • Garage 95</span>
              </div>
              <button
                onClick={() => setTermsModalOpen(false)}
                className="p-1 rounded-lg text-[#7E9180] hover:text-[#E8ECE8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar flex-1">
              <h4 className="font-bold text-[#F3E5AB]">1. Propósito da Comunidade</h4>
              <p>
                A Garage 95 é uma plataforma digital dedicada ao antigomobilismo, catalogação de veículos históricos, trocas de peças originais e fomento a encontros de colecionadores.
              </p>

              <h4 className="font-bold text-[#F3E5AB]">2. Veracidade de Dados & Placa Preta</h4>
              <p>
                O membro se compromete a fornecer informações autênticas sobre o estado de conservação, motorização e originalidade dos veículos cadastrados no acervo.
              </p>

              <h4 className="font-bold text-[#F3E5AB]">3. Negociações no Marketplace</h4>
              <p>
                A plataforma oferece o ambiente de conexão entre colecionadores. A conferência física e documental do veículo é de responsabilidade mútua entre as partes.
              </p>

              <h4 className="font-bold text-[#F3E5AB]">4. Conduta & Respeito</h4>
              <p>
                Prezamos pela camaradagem, preservação da memória automotiva e respeito à história mecânica de cada exemplar.
              </p>
            </div>

            <button
              onClick={() => {
                setAcceptTerms(true);
                setTermsModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs transition-colors cursor-pointer"
            >
              Compreendi e Concordo
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POLÍTICA DE PRIVACIDADE MODAL */}
      {/* ========================================================================= */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#141C15] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[80vh] flex flex-col text-xs text-[#B4C4B6]">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#3B4D3A]/60">
              <div className="flex items-center gap-2 text-[#D4AF37] font-serif font-bold text-base">
                <ShieldAlert className="w-5 h-5" />
                <span>Política de Privacidade & Proteção</span>
              </div>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-lg text-[#7E9180] hover:text-[#E8ECE8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar flex-1">
              <h4 className="font-bold text-[#F3E5AB]">1. Proteção de Chassi e Placas</h4>
              <p>
                Os números de chassi e caracteres sensíveis de placas são mascarados por padrão (ex: ***-XXXX) para segurança patrimonial contra clonagem.
              </p>

              <h4 className="font-bold text-[#F3E5AB]">2. Dados de Localização</h4>
              <p>
                A localização exibida no perfil restringe-se a Cidade/Estado (ex: São Paulo, SP), não revelando endereços residenciais exatos onde os veículos repousam.
              </p>

              <h4 className="font-bold text-[#F3E5AB]">3. Não Compartilhamento</h4>
              <p>
                A Garage 95 não vende nem repassa dados para terceiros ou listas de telemarketing.
              </p>
            </div>

            <button
              onClick={() => {
                setAcceptTerms(true);
                setPrivacyModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#121713] font-bold text-xs transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
