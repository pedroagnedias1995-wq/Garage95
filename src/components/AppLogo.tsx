import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'emblem' | 'compact' | 'horizontal';
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'horizontal'
}) => {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  const wheelSvg = (
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`gold-metal-sm-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="35%" stopColor="#E5C158" />
            <stop offset="65%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#7E600E" />
          </linearGradient>
          <radialGradient id={`tire-sm-${size}`} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#353A36" />
            <stop offset="60%" stopColor="#1C201D" />
            <stop offset="100%" stopColor="#0B0E0C" />
          </radialGradient>
        </defs>

        {/* Tire */}
        <circle cx="100" cy="100" r="94" fill={`url(#tire-sm-${size})`} stroke="#111" strokeWidth="3" />
        
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
              fill="#0F1210"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* Rim Background */}
        <circle cx="100" cy="100" r="70" fill="#121A14" stroke={`url(#gold-metal-sm-${size})`} strokeWidth="4" />

        {/* 5 Spokes */}
        {[0, 72, 144, 216, 288].map((rot, idx) => (
          <g key={idx} transform={`rotate(${rot} 100 100)`}>
            <path
              d="M 85 78 L 89 36 Q 100 33 111 36 L 115 78 Z"
              fill={`url(#gold-metal-sm-${size})`}
              stroke="#4A3805"
              strokeWidth="1.5"
            />
            <line x1="100" y1="42" x2="100" y2="72" stroke="#684D05" strokeWidth="2" />
          </g>
        ))}

        {/* Center G95 Hub */}
        <circle cx="100" cy="100" r="26" fill="#151D16" stroke={`url(#gold-metal-sm-${size})`} strokeWidth="2.5" />
        <circle cx="100" cy="100" r="21" fill="#18221A" />
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fill={`url(#gold-metal-sm-${size})`}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '0.5px'
          }}
        >
          G95
        </text>
      </svg>
    </div>
  );

  const brandText = showText && (
    <div className="flex items-center">
      <span className={`font-serif-heading font-black ${textSizes[size]} text-[#F3E5AB] tracking-wider drop-shadow-sm leading-none`}>
        GARAGE <span className="text-[#D4AF37]">95</span>
      </span>
    </div>
  );

  if (variant === 'emblem') {
    return (
      <div className={`flex flex-col items-center gap-2 select-none ${className}`}>
        {wheelSvg}
        {brandText}
      </div>
    );
  }

  // Horizontal / Default
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {wheelSvg}
      {brandText}
    </div>
  );
};

