import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  Key, 
  Gauge, 
  Zap,
  Radio
} from 'lucide-react';
import { engineSound } from '../utils/engineSound';

interface StartupSplashAnimationProps {
  onComplete: () => void;
  isFirstAccess: boolean;
}

export const StartupSplashAnimation: React.FC<StartupSplashAnimationProps> = ({
  onComplete,
  isFirstAccess
}) => {
  const [phase, setPhase] = useState<'standby' | 'cranking' | 'ignition' | 'revving' | 'ready'>('standby');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const completedRef = useRef(false);

  // Trigger engine ignition sequence
  const startIgnitionSequence = () => {
    if (completedRef.current) return;
    setHasUserStarted(true);
    setPhase('cranking');

    if (soundEnabled) {
      engineSound.playIgnitionStartup((stage) => {
        if (stage === 'crank') {
          setPhase('cranking');
        } else if (stage === 'ignition') {
          setPhase('ignition');
        } else if (stage === 'rev') {
          setPhase('revving');
        } else if (stage === 'idle') {
          setPhase('ready');
        }
      }, 5.8);
    }

    // Step progression timers matching the full audio curve
    const startTime = Date.now();
    const duration = 5800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgressPercent(progress);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 50);

    return () => clearInterval(interval);
  };

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  // Attempt auto-start on mount with fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      startIgnitionSequence();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut (Enter or Space to start/skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!hasUserStarted) {
          startIgnitionSequence();
        } else {
          handleFinish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUserStarted]);

  return (
    <div className="fixed inset-0 z-9999 bg-[#0B0F0C] text-[#E8ECE8] flex flex-col items-center justify-between p-6 select-none overflow-hidden font-sans-body">
      
      {/* Background Radial Glow & Carbon/Vintage Mesh Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient deep green & gold light shafts */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#1C2C20]/40 via-[#D4AF37]/10 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />
        
        {/* Subtle vintage garage grid overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Dynamic Combustion Flare during ignition */}
        {(phase === 'ignition' || phase === 'revving') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial from-[#FFB800]/25 via-[#FF6B00]/15 to-transparent rounded-full blur-2xl animate-ping" />
        )}
      </div>

      {/* Top Header info */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141C15]/80 border border-[#3B4D3A]/60 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-[#B5C4B7] uppercase">
            Garage 95 V8 Ignition System
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141C15]/80 border border-[#3B4D3A]/60 text-[#D4AF37] hover:text-[#FFF] hover:border-[#D4AF37]/80 text-xs font-mono transition-all cursor-pointer"
          title={soundEnabled ? 'Silenciar som do motor' : 'Ativar som do motor'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 text-[#7E9180]" />}
          <span className="hidden sm:inline text-[11px]">{soundEnabled ? 'Áudio V8 Ativo' : 'Mudo'}</span>
        </button>
      </div>

      {/* Centerpiece: Animated App Emblem Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        
        {/* Main Emblem Chassis */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          
          {/* Outer Polished Golden & Bronze Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#2A3B2D] bg-[#0E1510] shadow-[0_0_60px_rgba(0,0,0,0.95),inset_0_0_35px_rgba(212,175,55,0.2)] flex items-center justify-center">
            
            {/* Golden Metallic Bezel */}
            <div className="absolute inset-1.5 rounded-full border-2 border-[#D4AF37]/60 pointer-events-none" />

            {/* Central Animated Wheel Logo */}
            <div className={`relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center transition-transform duration-700 ${
              phase === 'revving' ? 'scale-105 rotate-12' : phase === 'ignition' ? 'scale-102 rotate-3' : 'scale-100'
            }`}>
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="splashGoldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF4C2" />
                    <stop offset="35%" stopColor="#E5C158" />
                    <stop offset="65%" stopColor="#C9A227" />
                    <stop offset="100%" stopColor="#7E600E" />
                  </linearGradient>
                  <radialGradient id="splashTire" cx="45%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#3A403B" />
                    <stop offset="60%" stopColor="#1C201D" />
                    <stop offset="100%" stopColor="#0B0E0C" />
                  </radialGradient>
                </defs>

                {/* Tire */}
                <circle cx="100" cy="100" r="94" fill="url(#splashTire)" stroke="#111" strokeWidth="3" />
                
                {/* Tread notches */}
                {[...Array(16)].map((_, i) => {
                  const angle = (i * 360) / 16;
                  return (
                    <rect
                      key={i}
                      x="97"
                      y="8"
                      width="6"
                      height="10"
                      rx="2"
                      fill="#0A0D0B"
                      transform={`rotate(${angle} 100 100)`}
                    />
                  );
                })}

                {/* Rim Background */}
                <circle cx="100" cy="100" r="70" fill="#121A14" stroke="url(#splashGoldMetal)" strokeWidth="4" />

                {/* 5 Classic Gold Spokes */}
                {[0, 72, 144, 216, 288].map((rot, idx) => (
                  <g key={idx} transform={`rotate(${rot} 100 100)`}>
                    <path
                      d="M 85 78 L 89 36 Q 100 33 111 36 L 115 78 Z"
                      fill="url(#splashGoldMetal)"
                      stroke="#4A3805"
                      strokeWidth="1.5"
                    />
                    <line x1="100" y1="42" x2="100" y2="72" stroke="#684D05" strokeWidth="2" />
                  </g>
                ))}

                {/* Center Hub */}
                <circle cx="100" cy="100" r="28" fill="#151D16" stroke="url(#splashGoldMetal)" strokeWidth="3" />
                <circle cx="100" cy="100" r="23" fill="#18221A" />
                <text
                  x="100"
                  y="106"
                  textAnchor="middle"
                  fill="url(#splashGoldMetal)"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    fontSize: '15px',
                    letterSpacing: '0.5px'
                  }}
                >
                  G95
                </text>
              </svg>
            </div>

          </div>

          {/* Combustion Spark particles effect around wheel */}
          {(phase === 'ignition' || phase === 'revving') && (
            <div className="absolute -inset-4 rounded-full border border-[#FFB800]/40 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Brand Title & Subtitle */}
        <div className="mt-8 text-center space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-widest text-[#F3E5AB] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              GARAGE <span className="text-[#D4AF37]">95</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-[#F3E5AB]/90 tracking-wider">
            o clube da cultura automotiva
          </p>
        </div>

        {/* Live Status & Phase Progress Bar */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* Progress Bar */}
          <div className="w-64 h-1.5 bg-[#18221A] rounded-full overflow-hidden border border-[#3B4D3A]/40">
            <div 
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#4ADE80] transition-all duration-100 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Subtle Status Indicator (No required button clicks) */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-2 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] animate-pulse">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Iniciando acervo e abrindo Feed...</span>
        </div>
      </div>

    </div>
  );
};
