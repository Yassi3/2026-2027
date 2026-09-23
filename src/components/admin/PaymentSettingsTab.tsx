import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Coins,
  CreditCard,
  DollarSign,
  Wallet,
  Check,
  Building,
  QrCode,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const PaymentSettingsTab: React.FC = () => {
  const { paymentGateways, updatePaymentGateway } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Real Payment Gateways & Accounts</h3>
          <p className="text-xs text-slate-400">
            Configure real crypto receiving addresses (USDT/BTC), Binance Pay ID, CIH Bank / Moroccan RIB, PayPal & Card links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentGateways.map((gw) => {
          const qrTarget =
            gw.walletAddress ||
            gw.binancePayId ||
            (gw.ribNumber ? `RIB:${gw.ribNumber}` : '') ||
            gw.paypalEmailOrLink;

          return (
            <div
              key={gw.id}
              className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                gw.enabled
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                    {gw.id.includes('crypto') ? (
                      <Coins className="w-4 h-4 text-cyan-400" />
                    ) : gw.id.includes('binance') ? (
                      <Wallet className="w-4 h-4 text-amber-400" />
                    ) : gw.id.includes('moroccan') ? (
                      <Building className="w-4 h-4 text-emerald-400" />
                    ) : gw.id.includes('paypal') ? (
                      <DollarSign className="w-4 h-4 text-blue-400" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{gw.name}</h4>
                    <span className="text-[10px] text-slate-400">{gw.badge || 'Active Gateway'}</span>
                  </div>
                </div>

                {/* Toggle Enable/Disable */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gw.enabled}
                    onChange={(e) => updatePaymentGateway(gw.id, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Fee percentage */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400">Gateway Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={gw.feePercentage}
                      onChange={(e) =>
                        updatePaymentGateway(gw.id, { feePercentage: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  {gw.network !== undefined && (
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400">Network / Protocol</label>
                      <input
                        type="text"
                        value={gw.network}
                        placeholder="TRC20 / BEP20"
                        onChange={(e) => updatePaymentGateway(gw.id, { network: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-300 font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Crypto Wallet Address */}
                {gw.walletAddress !== undefined && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">
                      Real Receiving Crypto Wallet Address
                    </label>
                    <input
                      type="text"
                      value={gw.walletAddress}
                      placeholder="e.g. TYr3K9qV3b...TRC20"
                      onChange={(e) => updatePaymentGateway(gw.id, { walletAddress: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono"
                    />
                  </div>
                )}

                {/* Binance Pay ID */}
                {gw.id.includes('binance') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">
                      Binance Pay ID / Merchant Account ID
                    </label>
                    <input
                      type="text"
                      value={gw.binancePayId || ''}
                      placeholder="e.g. 88492019"
                      onChange={(e) => updatePaymentGateway(gw.id, { binancePayId: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-amber-300 font-mono"
                    />
                  </div>
                )}

                {/* Moroccan Bank details */}
                {gw.id.includes('moroccan') && (
                  <div className="space-y-2 pt-1 border-t border-slate-900">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Nom de la Banque</label>
                      <input
                        type="text"
                        value={gw.bankName || ''}
                        placeholder="CIH Bank / Attijariwafa"
                        onChange={(e) => updatePaymentGateway(gw.id, { bankName: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Nom du Titulaire (Account Holder)</label>
                      <input
                        type="text"
                        value={gw.accountHolder || ''}
                        placeholder="Nom & Prénom / Société"
                        onChange={(e) => updatePaymentGateway(gw.id, { accountHolder: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">Relevé d'Identité Bancaire (RIB - 24 chiffres)</label>
                      <input
                        type="text"
                        value={gw.ribNumber || ''}
                        placeholder="230 780 00012345678901 23"
                        onChange={(e) => updatePaymentGateway(gw.id, { ribNumber: e.target.value })}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal link / email */}
                {gw.id.includes('paypal') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">
                      PayPal Email or PayPal.me link
                    </label>
                    <input
                      type="text"
                      value={gw.paypalEmailOrLink || ''}
                      placeholder="e.g. bouhsousse.16@gmail.com or paypal.me/yourname"
                      onChange={(e) => updatePaymentGateway(gw.id, { paypalEmailOrLink: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-blue-300 font-mono"
                    />
                  </div>
                )}

                {/* Stripe / Card payment link */}
                {gw.id.includes('card') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">
                      Stripe Direct Payment Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={gw.stripePaymentLink || ''}
                      placeholder="https://buy.stripe.com/..."
                      onChange={(e) => updatePaymentGateway(gw.id, { stripePaymentLink: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-300 font-mono"
                    />
                  </div>
                )}

                {/* Live QR Preview if address exists */}
                {qrTarget && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-900">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(
                        qrTarget
                      )}&bgcolor=090d16&color=38bdf8`}
                      alt="QR Code"
                      className="w-12 h-12 rounded-lg border border-slate-800 p-0.5 bg-[#090d16]"
                    />
                    <div className="text-[10px] text-slate-400">
                      <div className="font-semibold text-slate-300 flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-cyan-400" />
                        <span>Live Scannable QR Code Active</span>
                      </div>
                      <p className="truncate max-w-[220px] font-mono text-[9px] text-slate-500">
                        {qrTarget}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
