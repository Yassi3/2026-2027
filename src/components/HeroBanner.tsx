import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Plus
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    isAdmin,
    setIsAdminOpen,
    setIsVaultOpen,
    settings,
    t,
    currentLanguage
  } = useStore();

  const handleExploreClick = () => {
    const element = document.getElementById('catalog-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-8 md:pt-12 md:pb-10 border-b border-slate-800/80">
      {/* Background cyber grid & glow effects */}
      {(settings.customTheme?.enableCyberBlobs ?? true) && (
        <>
          <div
            style={{ backgroundColor: 'var(--theme-primary, #6366f1)' }}
            className="absolute top-0 left-1/3 w-96 h-96 opacity-15 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-500"
          />
          <div
            style={{ backgroundColor: 'var(--theme-accent, #06b6d4)' }}
            className="absolute bottom-0 right-1/3 w-96 h-96 opacity-15 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-500"
          />
        </>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('hero.badge')}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          {t('hero.titlePrefix')}{' '}
          <span
            style={{
              backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))'
            }}
            className="bg-clip-text text-transparent"
          >
            {t('hero.titleHighlight')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={handleExploreClick}
            style={{
              background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
              boxShadow: '0 10px 25px -4px var(--theme-glow, rgba(99, 102, 241, 0.4))'
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>{t('hero.exploreBtn')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => setIsVaultOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>{t('hero.openVaultBtn')}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLanguage === 'ar' ? 'إضافة منتج' : 'Ajouter Produit'}</span>
            </button>
          )}
        </div>

        {/* Trust Badges Bar (Clean & Compact) */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CIH • Attijari • BCP • Cash Plus</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{currentLanguage === 'ar' ? 'تسليم رقمي فوري 100%' : 'Livraison Immédiate'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>{currentLanguage === 'ar' ? 'تراخيص أصلية مع الضمان' : 'Licences Officielles Garanties'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

