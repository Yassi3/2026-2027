import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  Zap,
  Download,
  ExternalLink,
  Sparkles,
  Clock,
  Landmark,
  Lock,
  AlertTriangle
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    isSuccessOpen,
    setIsSuccessOpen,
    lastCompletedOrder,
    setIsVaultOpen,
    formatPrice
  } = useStore();

  const [copiedKeyIndex, setCopiedKeyIndex] = useState<number | null>(null);

  if (!isSuccessOpen || !lastCompletedOrder) return null;

  const order = lastCompletedOrder;
  const isPendingVerification = order.status === 'pending' || (order.requiresVerification && !order.vaultUnlocked);
  const totalInMad = (order.total * 10.15).toFixed(2);

  const handleCopyKey = (key: string, index: number) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyIndex(index);
    setTimeout(() => setCopiedKeyIndex(null), 2500);
  };

  const handleDownloadInvoice = () => {
    const textContent = `
=========================================
BHSS SHOP - OFFICIAL PURCHASE RECEIPT
=========================================
Order Number: ${order.orderNumber}
Date: ${order.date}
Customer: ${order.customerName} (${order.customerEmail})
Payment Method: ${order.paymentMethod}
Status: ${order.status.toUpperCase()}
Reference / Motif: ${order.bankTransferRef || order.paymentTxId || 'N/A'}
Total Amount: ${formatPrice(order.total)} (≈ ${totalInMad} MAD)

${
  isPendingVerification
    ? 'NOTE: Bank transfer pending admin verification. Keys will be unlocked upon receipt of payment.\n'
    : 'DELIVERED PRODUCT KEYS & LICENSES:\n-----------------------------------------\n' +
      order.deliveredKeys
        .map(
          (k, i) =>
            `Item #${i + 1}: ${k.productTitle}\nKey / License: ${k.keyOrData}\nInstructions: ${k.instructions}\n`
        )
        .join('\n-----------------------------------------\n')
}

Thank you for choosing BHSS Shop!
24/7 Support: support@bhsshop.com
=========================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BHSS-Receipt-${order.orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={() => setIsSuccessOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration / Status Header */}
        <div
          className={`p-6 md:p-8 text-center border-b border-slate-800/80 space-y-3 ${
            isPendingVerification
              ? 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900'
              : 'bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-900'
          }`}
        >
          <div
            className={`w-16 h-16 mx-auto rounded-2xl p-[2px] shadow-xl ${
              isPendingVerification
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20'
            }`}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isPendingVerification ? (
                <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isPendingVerification
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isPendingVerification ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>En attente de vérification du paiement ({order.paymentMethod})</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Instant Digital Delivery Confirmed</span>
              </>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isPendingVerification ? 'Commande Enregistrée avec Succès !' : 'Thank You for Your Order!'}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            {isPendingVerification ? (
              <span>
                La commande <strong className="text-white font-mono">{order.orderNumber}</strong> a été enregistrée. Vos licences sont réservées et seront débloquées dès confirmation de la réception des fonds par l'administrateur.
              </span>
            ) : (
              <span>
                Order <strong className="text-white font-mono">{order.orderNumber}</strong> has been fulfilled. Your digital keys have been dispatched to{' '}
                <strong className="text-cyan-400">{order.customerEmail}</strong> and stored in your Digital Vault.
              </span>
            )}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-5">
          {/* If Pending Verification: Display Instruction Card */}
          {isPendingVerification ? (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Procédure de vérification du paiement ({order.paymentMethod}) :</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  En attente de validation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Montant :</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {formatPrice(order.total)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">≈ {totalInMad} MAD</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mode de paiement :</span>
                  <span className="text-xs font-bold text-white truncate block">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Référence / Preuve :</span>
                  <span className="text-xs font-mono font-bold text-cyan-300 truncate block">
                    {order.bankTransferRef || order.paymentTxId || order.orderNumber}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Délai moyen de vérification : 2 à 15 minutes</span>
                </div>
                <p className="text-slate-400">
                  L'administrateur vérifie la réception des fonds sur le compte ou la crypto-adresse avant déblocage. Une fois validé, vos clés apparaîtront automatiquement dans votre <strong>Digital Vault</strong> et vous recevrez un email de confirmation.
                </p>
                <div className="text-[11px] text-amber-400 font-medium pt-1 border-t border-slate-800">
                  💡 تذكير: المفاتيح لا تسلّم إلا بعد تأكيد دخول المبلغ لحساب المتجر لحماية المشتري والبائع.
                </div>
              </div>
            </div>
          ) : null}

          {/* Keys Section or Locked Reserved items */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>
                {isPendingVerification
                  ? `Articles réservés (${order.deliveredKeys.length})`
                  : `Your Activated License Keys (${order.deliveredKeys.length})`}
              </span>
            </h3>

            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text Receipt</span>
            </button>
          </div>

          <div className="space-y-3">
            {order.deliveredKeys.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.productTitle}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isPendingVerification
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isPendingVerification ? 'RÉSERVÉ • EN ATTENTE' : 'GENUINE RETAIL'}
                  </span>
                </div>

                {/* Key container or Locked container */}
                {isPendingVerification ? (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-amber-500/30 font-mono text-amber-300 text-xs">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-sans font-medium text-slate-300">
                        Clé verrouillée jusqu'à confirmation de la réception des fonds (تأكيد استلام المبلغ).
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold shrink-0">
                      Vérification en cours
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-cyan-300 font-bold text-xs md:text-sm">
                    <span className="truncate select-all">{item.keyOrData}</span>
                    <button
                      onClick={() => handleCopyKey(item.keyOrData, index)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-semibold transition-all shrink-0 cursor-pointer"
                    >
                      {copiedKeyIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Instructions snippet */}
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Guide d'activation: </span>
                  {item.instructions}
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setIsSuccessOpen(false);
                setIsVaultOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Consulter mon Digital Vault</span>
            </button>

            <button
              onClick={() => setIsSuccessOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
            >
              <span>Continuer mes achats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

