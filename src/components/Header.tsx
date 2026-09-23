import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BHSSLogo } from './BHSSLogo';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div onClick={handleHomeClick}>
          <BHSSLogo size="md" />
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title={t('nav.selectCurrency')}
            >
              <span className="text-sm">{currentCurrency.flag}</span>
              <span>{currentCurrency.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-38 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 origin-top-right rtl:origin-top-left">
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

          {/* Database & Cloud Status Button */}
          <button
            onClick={() => setIsDbStatusOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:border-emerald-500/40 hover:text-white transition-all cursor-pointer"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-indigo-500/50 hover:bg-indigo-950/20 hover:text-indigo-300 transition-all cursor-pointer relative group"
            title={t('nav.myVault')}
          >
            <KeyRound className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">{t('nav.myVault')}</span>
            {vaultItems.length > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-bold rounded-full min-w-4.5">
                {vaultItems.length}
              </span>
            )}
          </button>

          {/* User Account / Orders Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title={t('nav.account')}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Admin Control Center - only visible to authenticated admin */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-xl border bg-amber-500/20 border-amber-500/40 text-amber-300 transition-all cursor-pointer relative"
              title={t('nav.adminCenter')}
            >
              <Shield className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            </button>
          )}

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-white text-indigo-900 font-extrabold text-[11px] rounded-full shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar visible on small devices */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholderMobile')}
            className="w-full pl-10 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
