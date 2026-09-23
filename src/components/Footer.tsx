import React, { useState } from 'react';
import { BHSSLogo } from './BHSSLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useStore } from '../context/StoreContext';
import { LegalModal, LegalTabType } from './LegalModal';
import {
  ShieldCheck,
  Zap,
  Clock,
  HelpCircle,
  Coins,
  CreditCard,
  Send,
  MessageSquare,
  KeyRound,
  Building,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setSelectedCategory,
    setIsVaultOpen,
    setIsAccountOpen,
    setIsDbStatusOpen,
    settings,
    currentCurrency,
    t
  } = useStore();

  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('terms');

  const openLegal = (tab: LegalTabType) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pt-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 3 Trust Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('footer.instantDelivery')}</h4>
              <p className="text-slate-400 text-xs mt-1">
                {t('footer.instantDeliveryDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('footer.genuine')}</h4>
              <p className="text-slate-400 text-xs mt-1">
                {t('footer.genuineDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('footer.support')}</h4>
              <p className="text-slate-400 text-xs mt-1">
                {t('footer.supportDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <BHSSLogo size="lg" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footer.brandDesc')}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.telegramHandle}</span>
              </a>

              <a
                href={`https://${settings.discordInvite}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discord</span>
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Marketplace
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setSelectedCategory('gaming')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Steam & Console Game Keys
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('software')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Windows 11 & Office 2024
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('ai-dev')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ChatGPT Plus & Developer IDEs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('vpn')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  NordVPN & ExpressVPN
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('streaming')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Spotify & YouTube Premium
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Tools & Account */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Customer Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsVaultOpen(true)}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>My Digital Key Vault</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order History & Invoices
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsDbStatusOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Database & System Status
                </button>
              </li>
              <li>
                <span className="text-slate-400">Accepted Currencies: USD, EUR, GBP, MAD</span>
              </li>
            </ul>

            {/* Payment Badges */}
            <div className="pt-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                Supported Payments
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                  <Building className="w-3 h-3 text-emerald-400" />
                  CIH Bank (Morocco)
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  USDT (TRC20)
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  BTC / ETH / SOL
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Binance Pay
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Visa / Mastercard
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  PayPal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Language Settings Bar */}
        <div className="pt-6 pb-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{t('nav.selectLanguage')}:</span>
            </span>
            <LanguageSwitcher direction="up" showLabel={true} />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{t('nav.selectCurrency')}:</span>
            <span className="font-mono text-slate-200 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol})
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            {t('footer.copyright', { year: String(new Date().getFullYear()) })}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openLegal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('footer.terms')}
            </button>
            <span>•</span>
            <button
              onClick={() => openLegal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('footer.privacy')}
            </button>
            <span>•</span>
            <button
              onClick={() => openLegal('refund')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {t('footer.refund')}
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Buyer Protection Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        activeTab={legalTab}
        setActiveTab={setLegalTab}
      />
    </footer>
  );
};
