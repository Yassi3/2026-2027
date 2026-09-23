import React from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BHSSLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const { settings } = useStore();

  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  const customLogo = settings?.customLogoUrl;

  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none group ${className}`}>
      {/* Brand Emblem */}
      <div className={`${iconDimensions} relative shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {customLogo ? (
          <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg shadow-indigo-500/20 p-0.5 flex items-center justify-center">
            <img
              src={customLogo}
              alt={settings?.storeName || 'BHSS SHOP'}
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-indigo-600/40 to-fuchsia-500/30 rounded-2xl blur-md group-hover:blur-lg transition-all opacity-80" />

            {/* Futuristic Vector Shield Badge */}
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="45%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>

                <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e0e7ff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                <radialGradient id="centerLight" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="100%" stopColor="#090d16" />
                </radialGradient>
              </defs>

              {/* Shield Base */}
              <polygon
                points="24,3 43,10 40,33 24,45 8,33 5,10"
                fill="url(#centerLight)"
                stroke="url(#borderGrad)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Inner Facet Lines */}
              <path
                d="M24,3 L24,45 M5,10 L43,10 M8,33 L40,33"
                stroke="#4338ca"
                strokeWidth="0.7"
                strokeOpacity="0.5"
              />

              {/* Stylized "BHSS" Monogram Emblem */}
              {/* Bold B glyph with cyber-cuts */}
              <path
                d="M15 13 H24 C28 13 30 15 30 18 C30 20 28.5 21.5 26.5 22 C29.5 22.5 31 24.5 31 27.5 C31 31 28 33 24 33 H15 Z"
                fill="none"
                stroke="url(#shieldGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Center Diamond / Core Spark */}
              <polygon
                points="24,20 27,24 24,28 21,24"
                fill="url(#glyphGrad)"
              />

              {/* Lightning Core Accent */}
              <path
                d="M25 15 L20 25 H25 L23 31"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-tight ${titleSizes} flex items-center gap-1.5`}>
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-extrabold tracking-wider">
            {settings?.storeName ? settings.storeName.split(' ')[0] : 'BHSS'}
          </span>
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent font-black tracking-normal">
            {settings?.storeName ? settings.storeName.split(' ').slice(1).join(' ') || 'SHOP' : 'SHOP'}
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-0.5 shadow-sm shadow-cyan-400" />
        </div>

        {showSubtitle && (
          <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5">
            Instant Digital Goods
          </span>
        )}
      </div>
    </div>
  );
};
