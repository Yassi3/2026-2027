import React from 'react';
import { useStore } from '../context/StoreContext';
import { BHSSLogo } from './BHSSLogo';
import {
  Search,
  ShoppingCart,
  KeyRound,
  User,
  Shield,
  Activity,
  X,
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    vaultItems,
    setIsVaultOpen,
    setIsAccountOpen,
    setIsAdminOpen,
    setIsDbStatusOpen,
    isAdmin,
    setSelectedCategory,
    setSelectedPlatform,
    colorMode,
    toggleColorMode,
    t
  } = useStore();

  const handleHomeClick = () => {
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div onClick={handleHomeClick} className="shrink-0">
          <BHSSLogo size="md" />
        </div>

        {/* Global Search Bar (Desktop - lg screens and above) */}
        <div className="flex-1 max-w-md min-w-[240px] hidden lg:block mx-4">
          <div className="relative group">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full ps-10 pe-9 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleColorMode}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
            title={colorMode === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            aria-label="Toggle Dark / Light Mode"
          >
            {colorMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Database & Cloud Status Button (Desktop only) */}
          <button
            onClick={() => setIsDbStatusOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition-all cursor-pointer"
            title="Database & Service Health"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">18ms</span>
          </button>

          {/* Digital Vault Button */}
          <button
            onClick={() => setIsVaultOpen(true)}
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 hover:bg-indigo-950/20 hover:text-indigo-300 transition-all cursor-pointer relative group"
            title={t('nav.myVault')}
          >
            <KeyRound className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="hidden xl:inline">{t('nav.myVault')}</span>
            {vaultItems.length > 0 && (
              <span
                style={{ background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))' }}
                className="flex items-center justify-center px-1.5 py-0.2 text-white text-[10px] font-bold rounded-full min-w-4.5"
              >
                {vaultItems.length}
              </span>
            )}
          </button>

          {/* User Account Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="hidden sm:flex p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title={t('nav.account')}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Admin Control Center - only visible to authenticated admin */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl border bg-amber-500/20 border-amber-500/40 text-amber-300 transition-all cursor-pointer relative shrink-0"
              title={t('nav.adminCenter')}
            >
              <Shield className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            </button>
          )}

          {/* Cart Drawer Trigger - Never overflows on any screen */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
              boxShadow: '0 4px 14px -2px var(--theme-glow, rgba(99, 102, 241, 0.35))'
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-white font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer relative shrink-0"
            title={t('nav.cart')}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 bg-white text-slate-900 font-extrabold text-[10px] sm:text-[11px] rounded-full shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Full-width search bar for screens below lg (mobile & tablet) */}
      <div className="lg:hidden px-3 sm:px-6 pb-2.5 pt-0.5">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholderMobile')}
            className="w-full ps-9 pe-8 py-2 bg-slate-900/95 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              aria-label="Clear mobile search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
