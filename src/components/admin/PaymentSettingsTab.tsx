import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BankAccount, PaymentGateway } from '../../types';
import {
  Coins,
  CreditCard,
  DollarSign,
  Wallet,
  Check,
  Building,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Star,
  Landmark,
  X
} from 'lucide-react';

const MOROCCAN_BANK_PRESETS = [
  { name: 'Attijariwafa Bank', badge: 'Attijari Mobile' },
  { name: 'CIH Bank', badge: 'Instantané CIH' },
  { name: 'Banque Populaire (BCP)', badge: 'Chaabi Net' },
  { name: 'Bank of Africa (BMCE)', badge: 'BMCE Direct' },
  { name: 'Al Barid Bank', badge: 'Barid Bank' },
  { name: 'CFG Bank', badge: 'CFG Mobile' },
  { name: 'Société Générale Maroc', badge: 'SGMB' },
  { name: 'BMCI', badge: 'BMCI Connect' },
  { name: 'Crédit du Maroc', badge: 'CDM' }
];

export const PaymentSettingsTab: React.FC = () => {
  const { paymentGateways, updatePaymentGateway, showToast } = useStore();

  // Moroccan bank account form state
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [editingBankAccountId, setEditingBankAccountId] = useState<string | null>(null);
  const [bankFormName, setBankFormName] = useState('');
  const [bankFormHolder, setBankFormHolder] = useState('');
  const [bankFormRib, setBankFormRib] = useState('');
  const [bankFormBadge, setBankFormBadge] = useState('');
  const [bankFormIsDefault, setBankFormIsDefault] = useState(false);

  const resetBankForm = () => {
    setIsAddingBank(false);
    setEditingBankAccountId(null);
    setBankFormName('');
    setBankFormHolder('');
    setBankFormRib('');
    setBankFormBadge('');
    setBankFormIsDefault(false);
  };

  const handleOpenAddBank = (defaultHolder: string) => {
    setEditingBankAccountId(null);
    setBankFormName('');
    setBankFormHolder(defaultHolder || 'BHSS SHOP DIGITAL');
    setBankFormRib('');
    setBankFormBadge('Instantané (0 DH)');
    setBankFormIsDefault(false);
    setIsAddingBank(true);
  };

  const handleOpenEditBank = (bank: BankAccount) => {
    setEditingBankAccountId(bank.id);
    setBankFormName(bank.bankName);
    setBankFormHolder(bank.accountHolder);
    setBankFormRib(bank.ribNumber);
    setBankFormBadge(bank.badge || '');
    setBankFormIsDefault(Boolean(bank.isDefault));
    setIsAddingBank(true);
  };

  const handleSaveBankAccount = (gw: PaymentGateway) => {
    if (!bankFormName.trim() || !bankFormRib.trim()) {
      showToast('Veuillez remplir au moins le nom de la banque et le RIB.', 'error');
      return;
    }

    const currentAccounts: BankAccount[] =
      gw.bankAccounts && gw.bankAccounts.length > 0
        ? [...gw.bankAccounts]
        : [
            {
              id: 'bank-default',
              bankName: gw.bankName || 'CIH Bank',
              accountHolder: gw.accountHolder || 'BHSS SHOP DIGITAL',
              ribNumber: gw.ribNumber || '230 780 00012345678901 23',
              badge: 'Instantané',
              isDefault: true
            }
          ];

    let updatedAccounts: BankAccount[] = [];

    if (editingBankAccountId) {
      // Editing existing account
      updatedAccounts = currentAccounts.map((acc) => {
        if (acc.id === editingBankAccountId) {
          return {
            ...acc,
            bankName: bankFormName.trim(),
            accountHolder: bankFormHolder.trim() || 'BHSS SHOP DIGITAL',
            ribNumber: bankFormRib.trim(),
            badge: bankFormBadge.trim() || undefined,
            isDefault: bankFormIsDefault ? true : acc.isDefault
          };
        }
        return bankFormIsDefault ? { ...acc, isDefault: false } : acc;
      });
    } else {
      // Adding new account
      const newAcc: BankAccount = {
        id: `bank-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bankName: bankFormName.trim(),
        accountHolder: bankFormHolder.trim() || 'BHSS SHOP DIGITAL',
        ribNumber: bankFormRib.trim(),
        badge: bankFormBadge.trim() || undefined,
        isDefault: bankFormIsDefault || currentAccounts.length === 0
      };

      if (newAcc.isDefault) {
        updatedAccounts = currentAccounts.map((a) => ({ ...a, isDefault: false }));
        updatedAccounts.push(newAcc);
      } else {
        updatedAccounts = [...currentAccounts, newAcc];
      }
    }

    const defaultAcc = updatedAccounts.find((a) => a.isDefault) || updatedAccounts[0];

    updatePaymentGateway(gw.id, {
      bankAccounts: updatedAccounts,
      bankName: defaultAcc?.bankName || bankFormName.trim(),
      accountHolder: defaultAcc?.accountHolder || bankFormHolder.trim(),
      ribNumber: defaultAcc?.ribNumber || bankFormRib.trim()
    });

    showToast(`Compte bancaire "${bankFormName}" enregistré !`, 'success');
    resetBankForm();
  };

  const handleDeleteBankAccount = (gw: PaymentGateway, accountId: string) => {
    const currentAccounts: BankAccount[] = gw.bankAccounts || [];
    if (currentAccounts.length <= 1) {
      showToast('Vous devez garder au moins un compte bancaire configuré.', 'error');
      return;
    }

    const updatedAccounts = currentAccounts.filter((a) => a.id !== accountId);
    if (!updatedAccounts.some((a) => a.isDefault)) {
      updatedAccounts[0].isDefault = true;
    }

    const defaultAcc = updatedAccounts.find((a) => a.isDefault) || updatedAccounts[0];

    updatePaymentGateway(gw.id, {
      bankAccounts: updatedAccounts,
      bankName: defaultAcc.bankName,
      accountHolder: defaultAcc.accountHolder,
      ribNumber: defaultAcc.ribNumber
    });

    showToast('Compte bancaire supprimé.', 'info');
  };

  const handleSetDefaultBank = (gw: PaymentGateway, accountId: string) => {
    const currentAccounts: BankAccount[] = gw.bankAccounts || [];
    const updatedAccounts = currentAccounts.map((a) => ({
      ...a,
      isDefault: a.id === accountId
    }));
    const target = updatedAccounts.find((a) => a.id === accountId);

    if (target) {
      updatePaymentGateway(gw.id, {
        bankAccounts: updatedAccounts,
        bankName: target.bankName,
        accountHolder: target.accountHolder,
        ribNumber: target.ribNumber
      });
      showToast(`"${target.bankName}" défini comme compte principal.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Modes de Paiement & Passerelles Réelles</h3>
          <p className="text-xs text-slate-400">
            Personnalisez vos comptes bancaires au Maroc (CIH, Attijariwafa, Chaabi, etc.), vos adresses crypto (USDT/BTC), Binance Pay, PayPal et Cartes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentGateways.map((gw) => {
          const isMoroccan = gw.id.includes('moroccan') || gw.type === 'moroccan_bank';
          const qrTarget =
            gw.walletAddress ||
            gw.binancePayId ||
            (gw.ribNumber ? `RIB:${gw.ribNumber}` : '') ||
            gw.paypalEmailOrLink;

          const bankAccountsList: BankAccount[] =
            gw.bankAccounts && gw.bankAccounts.length > 0
              ? gw.bankAccounts
              : isMoroccan
              ? [
                  {
                    id: 'bank-default',
                    bankName: gw.bankName || 'Virement Bancaire Maroc',
                    accountHolder: gw.accountHolder || 'BHSS SHOP DIGITAL',
                    ribNumber: gw.ribNumber || '230 780 00012345678901 23',
                    badge: 'Sans frais',
                    isDefault: true
                  }
                ]
              : [];

          return (
            <div
              key={gw.id}
              className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                isMoroccan ? 'md:col-span-2' : ''
              } ${
                gw.enabled
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                    {gw.id.includes('crypto') ? (
                      <Coins className="w-4 h-4 text-cyan-400" />
                    ) : gw.id.includes('binance') ? (
                      <Wallet className="w-4 h-4 text-amber-400" />
                    ) : isMoroccan ? (
                      <Landmark className="w-4 h-4 text-emerald-400" />
                    ) : gw.id.includes('paypal') ? (
                      <DollarSign className="w-4 h-4 text-blue-400" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={gw.name}
                        onChange={(e) => updatePaymentGateway(gw.id, { name: e.target.value })}
                        className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 rounded"
                        title="Cliquez pour renommer cette passerelle"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block px-1">
                      {isMoroccan
                        ? `${bankAccountsList.length} banque(s) configurée(s) • ${gw.badge || 'MAROC • SANS FRAIS'}`
                        : gw.badge || 'Active Gateway'}
                    </span>
                  </div>
                </div>

                {/* Toggle Enable/Disable */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={gw.enabled}
                    onChange={(e) => updatePaymentGateway(gw.id, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-xs">
                {/* Description & Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400">Description affichée au client</label>
                    <input
                      type="text"
                      value={gw.description}
                      onChange={(e) => updatePaymentGateway(gw.id, { description: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Frais de Passerelle (%)</label>
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
                </div>

                {/* Crypto Protocol/Network */}
                {gw.network !== undefined && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">Réseau / Network</label>
                    <input
                      type="text"
                      value={gw.network}
                      placeholder="TRC20 / BEP20"
                      onChange={(e) => updatePaymentGateway(gw.id, { network: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-300 font-mono"
                    />
                  </div>
                )}

                {/* Crypto Wallet Address */}
                {gw.walletAddress !== undefined && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400">
                      Adresse Crypto de Réception (USDT/BTC/ETH)
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

                {/* MOROCCAN BANK: CUSTOM BANKS MANAGER (NOT FIXED TO CIH) */}
                {isMoroccan && (
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5" />
                          <span>Gestion des Banques & Comptes Marocains (Non fixé à CIH)</span>
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Définissez vos propres banques (Attijariwafa, CIH, Chaabi, BMCE, Barid...) et RIBs. Le client choisit sa banque au paiement.
                        </p>
                      </div>

                      {!isAddingBank && (
                        <button
                          type="button"
                          onClick={() => handleOpenAddBank(gw.accountHolder || 'BHSS SHOP DIGITAL')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer self-start sm:self-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une banque</span>
                        </button>
                      )}
                    </div>

                    {/* Add / Edit Bank Form */}
                    {isAddingBank && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5" />
                            {editingBankAccountId ? 'Modifier la banque' : 'Ajouter une nouvelle banque'}
                          </span>
                          <button
                            type="button"
                            onClick={resetBankForm}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick preset chips for Moroccan Banks */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            Sélection rapide d'une banque marocaine (ou écrivez votre nom personnalisé) :
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {MOROCCAN_BANK_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  setBankFormName(preset.name);
                                  if (!bankFormBadge) setBankFormBadge(preset.badge);
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                                  bankFormName === preset.name
                                    ? 'bg-emerald-600 text-white border-emerald-400'
                                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">
                              Nom de la Banque *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankFormName}
                              onChange={(e) => setBankFormName(e.target.value)}
                              placeholder="Ex: Attijariwafa Bank / CIH / Chaabi..."
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">
                              Titulaire du compte (Nom & Prénom / Société) *
                            </label>
                            <input
                              type="text"
                              required
                              value={bankFormHolder}
                              onChange={(e) => setBankFormHolder(e.target.value)}
                              placeholder="Ex: BHSS SHOP / Votre Nom"
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">
                              Badge / Note (optionnel)
                            </label>
                            <input
                              type="text"
                              value={bankFormBadge}
                              onChange={(e) => setBankFormBadge(e.target.value)}
                              placeholder="Ex: Sans frais • 0 DH"
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-slate-400">
                              Relevé d'Identité Bancaire (RIB - 24 chiffres) *
                            </label>
                            <span className="text-[10px] font-mono text-slate-500">
                              {bankFormRib.replace(/\s+/g, '').length} / 24 chiffres
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            value={bankFormRib}
                            onChange={(e) => setBankFormRib(e.target.value)}
                            placeholder="Ex: 007 780 00012345678901 23"
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                            <input
                              type="checkbox"
                              checked={bankFormIsDefault}
                              onChange={(e) => setBankFormIsDefault(e.target.checked)}
                              className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>Définir comme compte principal par défaut</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={resetBankForm}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveBankAccount(gw)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer"
                            >
                              {editingBankAccountId ? 'Enregistrer les modifications' : 'Ajouter cette banque'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* List of configured bank accounts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {bankAccountsList.map((acc) => (
                        <div
                          key={acc.id}
                          className={`p-3 rounded-xl border relative transition-all flex flex-col justify-between ${
                            acc.isDefault
                              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-emerald-400" />
                                {acc.bankName}
                              </span>
                              {acc.isDefault ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                                  Principal
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultBank(gw, acc.id)}
                                  className="text-[9px] text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
                                  title="Définir comme principal"
                                >
                                  <Star className="w-2.5 h-2.5" /> Définir par défaut
                                </button>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400">
                              Titulaire: <span className="text-slate-200 font-medium">{acc.accountHolder}</span>
                            </div>

                            <div className="text-[10px] font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate">
                              RIB: {acc.ribNumber}
                            </div>

                            {acc.badge && (
                              <span className="inline-block text-[9px] text-emerald-400 font-mono">
                                • {acc.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-slate-800/60">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBank(acc)}
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              title="Modifier ce compte"
                            >
                              <Edit2 className="w-2.5 h-2.5 text-cyan-400" /> Modifier
                            </button>
                            {bankAccountsList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBankAccount(gw, acc.id)}
                                className="p-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[10px] flex items-center gap-1 cursor-pointer"
                                title="Supprimer ce compte"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
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
                        <span>Code QR Scannable Actif</span>
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
