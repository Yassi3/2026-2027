import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  X,
  User,
  Package,
  KeyRound,
  ShieldCheck,
  Send,
  MessageSquare,
  Mail,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Clock,
  Globe
} from 'lucide-react';

export const UserAccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    orders,
    vaultItems,
    setIsVaultOpen,
    formatPrice,
    settings,
    resetToDefaults,
    isAdmin,
    setIsAdminOpen,
    setIsAdminLoginOpen,
    logoutAdmin,
    t
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'support' | 'settings'>('orders');

  if (!isAccountOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-black">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Customer Account & Orders</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Verified Buyer</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{vaultItems.length} Keys Owned</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Support & Help
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            App Preferences
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">No orders yet</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Purchased keys will appear here along with instant download links and invoices.
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{ord.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
                        COMPLETED
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/60">
                      {ord.items.map((item, i) => (
                        <div key={i} className="py-2 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">
                            {item.quantity}x {item.product.title}
                          </span>
                          <span className="font-mono text-slate-200">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <div className="text-slate-400">
                        Paid via <strong className="text-slate-200">{ord.paymentMethod}</strong>
                      </div>
                      <div className="font-black text-white text-sm">
                        Total: {formatPrice(ord.total)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">24/7 Priority Support</h4>
                <p className="text-slate-400">
                  Encounter an issue with your key or activation? Contact our team directly on Telegram or Discord for instantaneous resolution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <Send className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white">Telegram Support</div>
                    <div className="text-slate-400 text-[11px]">{settings.telegramHandle}</div>
                  </div>
                </a>

                <a
                  href={`https://${settings.discordInvite}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-white">Discord Community</div>
                    <div className="text-slate-400 text-[11px]">{settings.discordInvite}</div>
                  </div>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-white">Email Desk</div>
                  <div className="text-slate-400 text-[11px]">{settings.supportEmail}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs">
              {/* Language Preferences */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>{t('nav.selectLanguage')}</span>
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    English, Français, العربية
                  </p>
                </div>
                <LanguageSwitcher showLabel={true} />
              </div>

              {isAdmin ? (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-amber-300 text-sm">Admin Session Active</h4>
                      <p className="text-[11px] text-slate-400">You are logged in as a store administrator.</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                      ADMIN
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        setIsAdminOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Open Admin Center
                    </button>
                    <button
                      onClick={logoutAdmin}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                    >
                      Logout Admin
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Demo Data & Catalog State</h4>
                <p className="text-slate-400 leading-relaxed">
                  Reset product inventory, sample keys, and test data back to default demonstration state.
                </p>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Restore Initial Catalog</span>
                </button>
              </div>

              {!isAdmin && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsAdminLoginOpen(true);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-400 underline underline-offset-4 cursor-pointer"
                  >
                    Staff & Admin Access
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
