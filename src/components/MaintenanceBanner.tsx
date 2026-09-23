import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, X, Sparkles } from 'lucide-react';

export const MaintenanceBanner: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementActive || dismissed) return null;

  const isLight = settings.colorMode === 'light';

  return (
    <div
      className={`relative w-full border-b text-xs md:text-sm py-2 px-3 sm:px-4 text-center overflow-hidden transition-colors ${
        isLight
          ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 border-indigo-500/40 text-white shadow-sm'
          : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-indigo-500/20 text-slate-200'
      }`}
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-2 pe-8 ps-2 text-[11px] sm:text-xs md:text-sm">
        <span
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider border shrink-0 ${
            isLight
              ? 'bg-white/20 text-amber-200 border-white/30 font-bold'
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          Special
        </span>
        <span
          className={`font-medium truncate sm:overflow-visible sm:whitespace-normal ${
            isLight ? 'text-white font-semibold' : 'text-slate-200'
          }`}
        >
          {settings.announcementText}
        </span>
        <span
          className={`hidden sm:inline-flex items-center gap-1 font-bold cursor-pointer hover:underline shrink-0 ${
            isLight ? 'text-cyan-200' : 'text-cyan-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          Code: BHS10
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className={`absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors cursor-pointer ${
          isLight ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-white'
        }`}
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
