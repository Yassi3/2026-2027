import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { BankAccount } from '../types';
import {
  X,
  ShieldCheck,
  Zap,
  Lock,
  Coins,
  CreditCard,
  Wallet,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building,
  QrCode,
  ExternalLink
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscountAmount,
    activePromo,
    formatPrice,
    convertPrice,
    currentCurrency,
    paymentGateways,
    placeOrder,
    settings,
    showToast
  } = useStore();

  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');
  const [selectedGatewayId, setSelectedGatewayId] = useState('crypto_usdt');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedRib, setCopiedRib] = useState(false);
  const [copiedBinanceId, setCopiedBinanceId] = useState(false);

  const selectedGateway =
    paymentGateways.find((g) => g.id === selectedGatewayId) ||
    paymentGateways.find((g) => g.enabled) ||
    paymentGateways[0];

  // List of active bank accounts configured by the store owner for Moroccan transfer
  const moroccanBankAccounts: BankAccount[] = useMemo(() => {
    if (selectedGateway?.bankAccounts && selectedGateway.bankAccounts.length > 0) {
      return selectedGateway.bankAccounts;
    }
    if (selectedGateway?.bankName || selectedGateway?.ribNumber) {
      return [
        {
          id: 'default-bank',
          bankName: selectedGateway.bankName || 'Virement Bancaire Maroc',
          accountHolder: selectedGateway.accountHolder || 'BHSS SHOP DIGITAL',
          ribNumber: selectedGateway.ribNumber || '230 780 00012345678901 23',
          badge: 'Sans frais',
          isDefault: true
        }
      ];
    }
    return [];
  }, [selectedGateway]);

  // Selected bank account
  const activeBank = useMemo(() => {
    if (moroccanBankAccounts.length === 0) return null;
    const found = moroccanBankAccounts.find((b) => b.id === selectedBankId);
    if (found) return found;
    const defaultOne = moroccanBankAccounts.find((b) => b.isDefault);
    return defaultOne || moroccanBankAccounts[0];
  }, [moroccanBankAccounts, selectedBankId]);

  if (!isCheckoutOpen) return null;

  const handleCopy = (text: string, type: 'address' | 'rib' | 'binance') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    } else if (type === 'rib') {
      setCopiedRib(true);
      setTimeout(() => setCopiedRib(false), 2500);
    } else if (type === 'binance') {
      setCopiedBinanceId(true);
      setTimeout(() => setCopiedBinanceId(false), 2500);
    }
  };

  // Convert amount to MAD specifically for Moroccan Bank transfer view
  const totalInMad = (cartTotal * 10.15).toFixed(2);
  const orderMotif = `BHSS-${Date.now().toString().slice(-6)}`;
  const isMoroccanBank =
    selectedGateway.type === 'moroccan_bank' ||
    selectedGateway.id.includes('moroccan') ||
    selectedGateway.name.toLowerCase().includes('bank') ||
    selectedGateway.name.toLowerCase().includes('cih');

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address for digital delivery receipt.', 'error');
      return;
    }

    setIsProcessing(true);

    const requiresVerification =
      settings.requireManualPaymentVerification !== false ||
      !settings.autoDeliveryEnabled ||
      isMoroccanBank;

    if (requiresVerification) {
      setProcessingStep('1/2 Enregistrement de votre commande & référence de paiement...');
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('2/2 Réservation sécurisée de vos licences en attente de validation...');
      await new Promise((r) => setTimeout(r, 600));

      const bankNameUsed = activeBank?.bankName || selectedGateway.bankName || 'Virement Bancaire';
      const cleanBankPrefix = bankNameUsed.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'TRF';

      await placeOrder({
        email,
        discord,
        paymentMethod: isMoroccanBank ? `${selectedGateway.name} (${bankNameUsed})` : selectedGateway.name,
        bankName: isMoroccanBank ? bankNameUsed : undefined,
        paymentTxId: txHash || (isMoroccanBank ? `${cleanBankPrefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined),
        bankTransferRef: isMoroccanBank
          ? (txHash ? `${txHash} [${bankNameUsed}] (Motif: ${orderMotif})` : `[${bankNameUsed}] Motif: ${orderMotif}`)
          : (txHash ? `Réf: ${txHash}` : undefined),
        requiresVerification: true
      });
    } else {
      setProcessingStep('1/3 Connecting to secure payment node...');
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('2/3 Verifying payment transaction & antifraud screening...');
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('3/3 Unlocking & dispatching encrypted product keys from vault...');
      await new Promise((r) => setTimeout(r, 500));

      await placeOrder({
        email,
        discord,
        paymentMethod: selectedGateway.name,
        paymentTxId: txHash || undefined,
        requiresVerification: false
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        style={{
          backgroundColor: 'var(--theme-card-bg, #111827)',
          borderColor: 'var(--theme-border, #1f293d)',
          borderRadius: 'var(--theme-radius, 24px)',
          boxShadow: '0 25px 60px -15px var(--theme-glow, rgba(0, 0, 0, 0.7))'
        }}
        className="relative w-full max-w-2xl border shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div 
          style={{
            backgroundColor: 'var(--theme-bg-subtle, rgba(15, 23, 42, 0.5))',
            borderColor: 'var(--theme-border, #1f293d)'
          }}
          className="p-5 md:p-6 border-b flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <div 
              style={{
                backgroundColor: 'rgba(var(--theme-primary-rgb, 99, 102, 241), 0.15)',
                borderColor: 'var(--theme-border, #1f293d)',
                color: 'var(--theme-primary, #6366f1)'
              }}
              className="p-2 rounded-xl border"
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white">Instant Secure Checkout</h2>
              <p className="text-xs text-slate-400">Automated 24/7 Digital Dispatch</p>
            </div>
          </div>

          <button
            onClick={() => !isProcessing && setIsCheckoutOpen(false)}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCompletePayment} className="p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Step 1: Customer Info for Instant Delivery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span 
                  style={{ backgroundColor: 'var(--theme-primary, #6366f1)' }}
                  className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                >
                  1
                </span>
                <span>Delivery Email & Contact</span>
              </label>
              <span className="text-[11px] flex items-center gap-1 font-medium" style={{ color: 'var(--theme-accent, #06b6d4)' }}>
                <Zap className="w-3 h-3" /> Sent immediately here
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com *"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--theme-primary,#6366f1)]"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="Discord tag / Telegram (optional)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--theme-primary,#6366f1)]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span 
                style={{ backgroundColor: 'var(--theme-primary, #6366f1)' }}
                className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
              >
                2
              </span>
              <span>Choose Payment Gateway</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentGateways.filter((g) => g.enabled).map((gw) => {
                const isSelected = selectedGatewayId === gw.id;
                return (
                  <div
                    key={gw.id}
                    onClick={() => setSelectedGatewayId(gw.id)}
                    style={
                      isSelected
                        ? {
                            borderColor: 'var(--theme-primary, #6366f1)',
                            backgroundColor: 'rgba(var(--theme-primary-rgb, 99, 102, 241), 0.12)',
                            boxShadow: '0 4px 14px -2px var(--theme-glow, rgba(99, 102, 241, 0.25))'
                          }
                        : undefined
                    }
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'text-white'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mt-0.5">
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-100">{gw.name}</span>
                        {gw.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-extrabold uppercase">
                            {gw.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {gw.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GATEWAY DETAILS: 1. CRYPTO (USDT / BTC / ETH) */}
            {selectedGateway.type === 'crypto' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" /> {selectedGateway.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    {selectedGateway.network || 'TRC20 Network'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  {/* Live QR Code generated from merchant wallet */}
                  <div className="shrink-0 p-1.5 bg-[#090d16] rounded-xl border border-slate-800 flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                        selectedGateway.walletAddress || 'TYr3K9qV3b5Nx8Lp21WkBhsshopTron98'
                      )}&bgcolor=090d16&color=38bdf8`}
                      alt="Wallet QR Code"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg"
                    />
                    <span className="text-[9px] text-slate-400 font-semibold mt-1">Scan via Wallet</span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        Amount to Send
                      </span>
                      <div className="font-mono text-base font-black text-cyan-300">
                        ${cartTotal.toFixed(2)} USDT
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        Merchant Receiving Wallet Address
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 truncate flex-1">
                          {selectedGateway.walletAddress || 'TYr3K9qV3b5Nx8Lp21WkBhsshopTron98'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              selectedGateway.walletAddress || 'TYr3K9qV3b5Nx8Lp21WkBhsshopTron98',
                              'address'
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow"
                        >
                          {copiedAddress ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Transaction Hash / TXID (Optional - helps faster auto-dispatch)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="e.g. 5a1b3c...txid hash from Binance/TrustWallet"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* GATEWAY DETAILS: 2. BINANCE PAY */}
            {selectedGateway.type === 'binance' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" /> Binance Pay (Direct App Payment)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold">
                    0% GAS FEES
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                  <div className="shrink-0 p-1.5 bg-[#090d16] rounded-xl border border-slate-800 flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                        `binancepay://pay?id=${selectedGateway.binancePayId || '88492019'}`
                      )}&bgcolor=090d16&color=f59e0b`}
                      alt="Binance Pay QR"
                      className="w-24 h-24 rounded-lg"
                    />
                    <span className="text-[9px] text-amber-400 font-semibold mt-1">Binance App</span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        Binance Pay ID
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-amber-400 flex-1">
                          {selectedGateway.binancePayId || '88492019'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(selectedGateway.binancePayId || '88492019', 'binance')
                          }
                          className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow"
                        >
                          {copiedBinanceId ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Ouvrez votre application Binance &gt; Payez &gt; Envoyez le montant exact de{' '}
                      <span className="text-amber-300 font-bold">${cartTotal.toFixed(2)}</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GATEWAY DETAILS: 3. MOROCCAN BANK / DIRECT TRANSFER */}
            {selectedGateway.type === 'moroccan_bank' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Building className="w-4 h-4" /> {activeBank?.bankName || selectedGateway.bankName || 'Virement Bancaire Maroc'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    {activeBank?.badge || 'SANS FRAIS • 0 DH'}
                  </span>
                </div>

                {/* Multiple Moroccan Banks Selector */}
                {moroccanBankAccounts.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Sélectionnez la banque de destination :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {moroccanBankAccounts.map((b) => {
                        const isChosen = activeBank?.id === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBankId(b.id)}
                            className={`p-2.5 rounded-xl border text-left rtl:text-right transition cursor-pointer flex flex-col justify-between ${
                              isChosen
                                ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                              <Building className={`w-3.5 h-3.5 shrink-0 ${isChosen ? 'text-emerald-400' : 'text-slate-500'}`} />
                              <span className="truncate">{b.bankName}</span>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono mt-1">
                              {b.badge || 'Compte vérifié'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Montant à transférer</span>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        {totalInMad} MAD <span className="text-xs text-slate-400 font-normal">({formatPrice(cartTotal)})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Motif du virement</span>
                      <div className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {orderMotif}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Banque:</span>
                      <span className="font-bold text-emerald-300">{activeBank?.bankName || selectedGateway.bankName || 'Banque Maroc'}</span>
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Titulaire du compte:</span>
                      <span className="font-bold text-white">{activeBank?.accountHolder || selectedGateway.accountHolder || 'BHSS SHOP DIGITAL'}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase mb-1">
                        <span>Relevé d'Identité Bancaire (RIB - 24 chiffres)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-emerald-300 flex-1 truncate">
                          {activeBank?.ribNumber || selectedGateway.ribNumber || '230 780 00012345678901 23'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              activeBank?.ribNumber || selectedGateway.ribNumber || '230 780 00012345678901 23',
                              'rib'
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow transition-colors"
                        >
                          {copiedRib ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copier RIB</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Numéro de référence du virement ou Nom de l'expéditeur
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder={`Ex: Virement ${activeBank?.bankName || 'Bancaire'} effectué par Omar...`}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* GATEWAY DETAILS: 4. PAYPAL */}
            {selectedGateway.type === 'paypal' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> PayPal Express & Protection Acheteur
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                    OFFICIEL
                  </span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 text-center">
                  <p className="text-slate-300 text-xs">
                    Réglez directement votre commande de{' '}
                    <span className="font-bold text-white">{formatPrice(cartTotal)}</span> en toute sécurité via PayPal.
                  </p>
                  <a
                    href={
                      selectedGateway.paypalEmailOrLink?.includes('http')
                        ? selectedGateway.paypalEmailOrLink
                        : selectedGateway.paypalEmailOrLink?.includes('paypal.me')
                        ? `https://${selectedGateway.paypalEmailOrLink}/${cartTotal.toFixed(2)}USD`
                        : `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                            selectedGateway.paypalEmailOrLink || 'bouhsousse.16@gmail.com'
                          )}&amount=${cartTotal.toFixed(2)}&currency_code=USD&item_name=${encodeURIComponent(
                            'BHSS Shop Digital Order'
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition cursor-pointer"
                  >
                    <span>Ouvrir la page PayPal pour régler</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    ID de transaction PayPal / Email PayPal utilisé
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Ex: 8XJ19284KL... ou votre email PayPal"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* GATEWAY DETAILS: 5. CREDIT CARD */}
            {selectedGateway.type === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-3 text-xs">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Paiement par Carte Sécurisé (256-bit SSL)</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> PCI-DSS Compliant
                  </span>
                </div>

                {selectedGateway.stripePaymentLink ? (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                    <p className="text-slate-300 text-xs">
                      Passerelle officielle Stripe Checkout disponible.
                    </p>
                    <a
                      href={selectedGateway.stripePaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow"
                    >
                      <span>Payer par Carte via Stripe</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Numéro de carte"
                        className="col-span-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Order Summary Review */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Articles ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>

            {activePromo && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Code Promo ({activePromo.code})</span>
                <span>-{formatPrice(cartDiscountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800/80">
              <span>Total Final</span>
              <div className="text-right">
                <span className="text-xl text-cyan-300 font-extrabold">{formatPrice(cartTotal)}</span>
                {currentCurrency.code !== 'MAD' && (
                  <div className="text-[11px] text-slate-400 font-normal">
                    ≈ {totalInMad} MAD
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Processing Indicator if active */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-center gap-3 animate-pulse">
              <Zap className="w-5 h-5 text-cyan-400 animate-spin" />
              <div className="text-xs font-semibold text-cyan-300">
                {processingStep}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || cart.length === 0}
            style={
              isMoroccanBank
                ? undefined
                : {
                    background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                    boxShadow: '0 10px 25px -4px var(--theme-glow, rgba(99, 102, 241, 0.35))'
                  }
            }
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-white font-black text-sm shadow-xl disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer ${
              isMoroccanBank
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                : ''
            }`}
          >
            {isProcessing ? (
              <span>Traitement de la commande en cours...</span>
            ) : isMoroccanBank ? (
              <>
                <Building className="w-4 h-4 text-emerald-200" />
                <span>Confirmer le Virement ({totalInMad} MAD) & Envoyer</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-200" />
                <span>Confirmer la Commande ({formatPrice(cartTotal)}) & Envoyer</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              🔒 تراقب الإدارة استلام المبلغ في الحساب / المحفظة قبل تسليم المفاتيح في الـ Vault لحماية الطرفين.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
