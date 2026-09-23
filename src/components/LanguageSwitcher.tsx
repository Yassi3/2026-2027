import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode } from '../types';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  showLabel?: boolean;
  direction?: 'up' | 'down';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  showLabel = false,
  direction = 'down'
}) => {
  const { currentLanguage, currentLanguageObj, setLanguageCode, languages, t } = useStore();
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

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguageCode(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
        title={t('nav.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm select-none" role="img" aria-label={currentLanguageObj.name}>
          {currentLanguageObj.flag}
        </span>
        <span className="uppercase tracking-wider font-bold text-xs text-slate-200 group-hover:text-indigo-300 transition-colors">
          {currentLanguageObj.code}
        </span>
        {showLabel && (
          <span className="hidden xl:inline text-slate-400 font-normal">
            ({currentLanguageObj.nativeName})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
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
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{t('nav.selectLanguage')}</span>
            </span>
          </div>

          <div className="py-1 space-y-0.5">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  role="menuitem"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base select-none">{lang.flag}</span>
                    <span className="font-semibold">{lang.nativeName}</span>
                    {lang.code === 'ar' && (
                      <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                        RTL
                      </span>
                    )}
                  </span>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
