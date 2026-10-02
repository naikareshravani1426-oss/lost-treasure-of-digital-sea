import React from 'react';

// Ornate Golden Ship Helm Wheel
export function GoldenHelm({ className = "w-10 h-10", size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="45%" stopColor="#e5a93b" />
          <stop offset="85%" stopColor="#9a6514" />
          <stop offset="100%" stopColor="#5a3804" />
        </radialGradient>
        <filter id="helmGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>
      <g filter="url(#helmGlow)">
        {/* Spokes and handles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <rect x="47.5" y="6" width="5" height="88" rx="2" fill="url(#goldGrad)" stroke="#3a2208" strokeWidth="1" />
            <circle cx="50" cy="5" r="4.5" fill="url(#goldGrad)" stroke="#ffd700" strokeWidth="1" />
            <circle cx="50" cy="95" r="4.5" fill="url(#goldGrad)" stroke="#ffd700" strokeWidth="1" />
          </g>
        ))}
        {/* Outer Wheel Rim */}
        <circle cx="50" cy="50" r="32" stroke="url(#goldGrad)" strokeWidth="6" fill="none" filter="drop-shadow(0 0 2px #000)" />
        <circle cx="50" cy="50" r="35" stroke="#3d2208" strokeWidth="1.2" fill="none" />
        <circle cx="50" cy="50" r="29" stroke="#3d2208" strokeWidth="1.2" fill="none" />
        
        {/* Inner Wheel Rim */}
        <circle cx="50" cy="50" r="22" stroke="url(#goldGrad)" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="24" stroke="#3d2208" strokeWidth="1" fill="none" />
        
        {/* Center Hub */}
        <circle cx="50" cy="50" r="14" fill="url(#goldGrad)" stroke="#3d2208" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="8" fill="#2d1505" stroke="#ffd700" strokeWidth="1" />
        <circle cx="50" cy="50" r="4" fill="url(#goldGrad)" />
      </g>
    </svg>
  );
}

// Pirate Skull with Crossed Cutlasses
export function SkullCutlasses({ size = 42, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="boneGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e2d4be" />
          <stop offset="100%" stopColor="#8c785d" />
        </radialGradient>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#b0b5bc" />
          <stop offset="100%" stopColor="#555a62" />
        </linearGradient>
      </defs>
      {/* Crossed Cutlasses */}
      <g filter="drop-shadow(0 2px 3px rgba(0,0,0,0.8))">
        {/* Sword 1 */}
        <path d="M10 54 L52 12 Q54 10 56 12 Q56 16 52 20 L16 56 Z" fill="url(#bladeGrad)" stroke="#222" strokeWidth="0.8" />
        <path d="M12 52 L8 56 Q6 58 8 60 Q10 62 12 60 L16 56" stroke="#c99738" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sword 2 */}
        <path d="M54 54 L12 12 Q10 10 8 12 Q8 16 12 20 L48 56 Z" fill="url(#bladeGrad)" stroke="#222" strokeWidth="0.8" />
        <path d="M52 52 L56 56 Q58 58 56 60 Q54 62 52 60 L48 56" stroke="#c99738" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Pirate Skull */}
      <g filter="drop-shadow(0 3px 4px rgba(0,0,0,0.9))">
        {/* Red Bandana */}
        <path d="M18 25 C18 16 24 10 32 10 C40 10 46 16 46 25 C42 22 36 21 32 21 C28 21 22 22 18 25 Z" fill="#9e1a1a" stroke="#4a0000" strokeWidth="1" />
        <circle cx="44" cy="27" r="2.5" fill="#c42525" />
        {/* Cranium */}
        <path d="M20 25 C20 18 25 15 32 15 C39 15 44 18 44 25 C44 32 40 37 38 39 L38 43 L26 43 L26 39 C24 37 20 32 20 25 Z" fill="url(#boneGrad)" stroke="#3a2a18" strokeWidth="1" />
        {/* Eye sockets */}
        <ellipse cx="27" cy="28" rx="3.5" ry="4.5" fill="#181008" />
        <ellipse cx="37" cy="28" rx="3.5" ry="4.5" fill="#181008" />
        {/* Nose cavity */}
        <path d="M32 32 L30 36 L34 36 Z" fill="#181008" />
        {/* Teeth */}
        <rect x="28" y="40" width="2" height="3" fill="#181008" />
        <rect x="31" y="40" width="2" height="3" fill="#181008" />
        <rect x="34" y="40" width="2" height="3" fill="#181008" />
      </g>
    </svg>
  );
}

// Ornate Compass Rose Star (Watermark / Accent)
export function CompassRose({ size = 32, className = "", opacity = 0.85 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ opacity }}>
      <defs>
        <linearGradient id="goldLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d88b" />
          <stop offset="100%" stopColor="#ab7b28" />
        </linearGradient>
        <linearGradient id="goldDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8f601b" />
          <stop offset="100%" stopColor="#4e3108" />
        </linearGradient>
      </defs>
      {/* 8-point compass star */}
      {/* North */}
      <polygon points="50,5 50,50 43,45" fill="url(#goldLight)" />
      <polygon points="50,5 50,50 57,45" fill="url(#goldDark)" />
      {/* South */}
      <polygon points="50,95 50,50 57,55" fill="url(#goldLight)" />
      <polygon points="50,95 50,50 43,55" fill="url(#goldDark)" />
      {/* East */}
      <polygon points="95,50 50,50 55,43" fill="url(#goldLight)" />
      <polygon points="95,50 50,50 55,57" fill="url(#goldDark)" />
      {/* West */}
      <polygon points="5,50 50,50 45,57" fill="url(#goldLight)" />
      <polygon points="5,50 50,50 45,43" fill="url(#goldDark)" />

      {/* NE */}
      <polygon points="82,18 50,50 55,42" fill="url(#goldLight)" />
      <polygon points="82,18 50,50 58,48" fill="url(#goldDark)" />
      {/* NW */}
      <polygon points="18,18 50,50 42,45" fill="url(#goldLight)" />
      <polygon points="18,18 50,50 45,38" fill="url(#goldDark)" />
      {/* SE */}
      <polygon points="82,82 50,50 58,52" fill="url(#goldLight)" />
      <polygon points="82,82 50,50 52,58" fill="url(#goldDark)" />
      {/* SW */}
      <polygon points="18,82 50,50 45,58" fill="url(#goldLight)" />
      <polygon points="18,82 50,50 38,52" fill="url(#goldDark)" />

      {/* Center rings */}
      <circle cx="50" cy="50" r="12" stroke="#ab7b28" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="6" fill="url(#goldLight)" stroke="#3e2306" strokeWidth="1" />
      <circle cx="50" cy="50" r="2" fill="#2d1703" />
    </svg>
  );
}

// Pirate Ship Galleon Icon
export function PirateShipIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 17C4 16 6 18 8 18C10 18 12 16 14 16C16 16 18 18 20 18C21.5 18 22.5 17.5 23 17L21 21C16 22 8 22 3 21L2 17Z" fill="#ffdf79" stroke="#5a3804" strokeWidth="1" />
      <path d="M12 2V15M7 6V15M17 7V15" stroke="#ffe79a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 3C15 3 16 7 16 9C14 9 12 8 12 8" fill="#fff" opacity="0.9" stroke="#9a6514" strokeWidth="0.8" />
      <path d="M12 9C16 9 17 14 17 14C14 14 12 13 12 13" fill="#fff" opacity="0.9" stroke="#9a6514" strokeWidth="0.8" />
      <path d="M7 7C9.5 7 10.5 10 10.5 11C9 11 7 10.5 7 10.5" fill="#fff" opacity="0.9" stroke="#9a6514" strokeWidth="0.8" />
      <path d="M17 8C19 8 19.8 11 19.8 12C18.5 12 17 11.5 17 11.5" fill="#fff" opacity="0.9" stroke="#9a6514" strokeWidth="0.8" />
    </svg>
  );
}

// Crossed Swords Icon
export function CrossedSwords({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 20L19 5M19 5L20 9L15 4L19 5Z" stroke="#ffdf79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20L5 5M5 5L4 9L9 4L5 5Z" stroke="#ffdf79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="20" r="1.5" fill="#e5a93b" />
      <circle cx="20" cy="20" r="1.5" fill="#e5a93b" />
    </svg>
  );
}

// Small Skull Icon
export function SmallSkull({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 3C7.58 3 4 6.58 4 11C4 14.5 6.2 17.5 9.5 18.6V21H14.5V18.6C17.8 17.5 20 14.5 20 11C20 6.58 16.42 3 12 3Z" fill="#ffdf79" stroke="#5a3804" strokeWidth="1" />
      <circle cx="9" cy="11" r="2" fill="#2d1505" />
      <circle cx="15" cy="11" r="2" fill="#2d1505" />
      <path d="M12 13L11 15H13L12 13Z" fill="#2d1505" />
    </svg>
  );
}
