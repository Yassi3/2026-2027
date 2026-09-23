import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Check, Coins } from 'lucide-react';
import { Currency } from '../types';

interface CurrencySwitcherProps {
  variant?: 'compact' | 'full';
  showLabel?: boolean;
  direction?: 'up' | 'down';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  showLabel = false,
  direction = 'down'
}) => {
  const { currentCurrency, setCurrencyCode, currencies, t } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCurrency = (code: Currency['code']) => {
    setCurrencyCode(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
        title={t('nav.selectCurrency')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors shrink-0" />
        <span className="text-sm select-none">{currentCurrency.flag}</span>
        <span className="font-mono font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors">
          {currentCurrency.code}
        </span>
        {showLabel && (
          <span className="text-slate-400 font-mono text-[11px]">
            ({currentCurrency.symbol})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
            isOpen ? (direction === 'up' ? '' : 'rotate-180') : (direction === 'up' ? 'rotate-180' : '')
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 rtl:right-auto rtl:left-0 ${
            direction === 'up'
              ? 'bottom-full mb-2 origin-bottom-right rtl:origin-bottom-left'
              : 'mt-2 origin-top-right rtl:origin-top-left'
          } w-44 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 divide-y divide-slate-800/60`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3 h-3 text-amber-400" />
              <span>{t('nav.selectCurrency')}</span>
            </span>
          </div>

          <div className="py-1 space-y-0.5">
            {currencies.map((curr) => {
              const isSelected = currentCurrency.code === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleSelectCurrency(curr.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">{curr.flag}</span>
                    <div className="text-left rtl:text-right">
                      <div className="font-bold text-xs">{curr.code}</div>
                      <div className="text-[10px] text-slate-400">{curr.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-slate-400 text-xs">{curr.symbol}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
