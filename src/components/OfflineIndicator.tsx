import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { currentLanguage } = useStore();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 start-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 text-slate-950 backdrop-blur-md px-3.5 py-2 text-xs font-bold shadow-xl border border-amber-400 animate-in slide-in-from-bottom duration-300">
      <WifiOff className="w-4 h-4 shrink-0 text-slate-950 animate-pulse" />
      <span>
        {currentLanguage === 'ar'
          ? 'وضع عدم الاتصال — يتم استخدام البيانات المحفوظة في التطبيق'
          : currentLanguage === 'fr'
          ? 'Mode Hors Ligne — Données en cache utilisées'
          : 'Offline Mode — Cached data is being used'}
      </span>
    </div>
  );
};
