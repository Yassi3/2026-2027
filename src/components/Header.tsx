import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BHSSLogo } from './BHSSLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Search,
  ShoppingCart,
  KeyRound,
  User,
  Shield,
  Activity,
  Globe,
  X,
  SlidersHorizontal,
  ChevronDown
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
    currentCurrency,
    setCurrencyCode,
    currencies,
    isAdmin,
    setSelectedCategory,
    setSelectedPlatform,
    t
  } = useStore();

  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" direction="down" />

          {/* Currency Switcher */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-sm"
              title={t('nav.selectCurrency')}
            >
              <span className="text-sm select-none">{currentCurrency.flag}</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold">{currentCurrency.code}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-38 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 origin-top-right rtl:origin-top-left">
                <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 tracking-wider">
                  {t('nav.selectCurrency')}
                </div>
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrencyCode(curr.code);
                      setIsCurrencyMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      currentCurrency.code === curr.code
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <span className="flex items-center justify-center px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-bold rounded-full min-w-4.5">
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
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer relative shrink-0"
            title={t('nav.cart')}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 bg-white text-indigo-900 font-extrabold text-[10px] sm:text-[11px] rounded-full shadow-md animate-in zoom-in">
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
