import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, X, Sparkles } from 'lucide-react';

export const MaintenanceBanner: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementActive || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-b border-indigo-500/20 text-xs md:text-sm py-2 px-4 text-center overflow-hidden">
      {/* Background neon shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-2 text-slate-200 pr-6">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] uppercase tracking-wider border border-indigo-500/30">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Special
        </span>
        <span className="font-medium text-slate-300">
          {settings.announcementText}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-cyan-400 font-semibold cursor-pointer hover:underline">
          <Sparkles className="w-3.5 h-3.5" />
          Code: BHS10
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
