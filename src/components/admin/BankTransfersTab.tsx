import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Landmark,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Eye,
  KeyRound,
  Filter,
  DollarSign,
  ArrowRight,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  Edit2,
  Star,
  Building,
  X
} from 'lucide-react';
import { Order, BankAccount, PaymentGateway } from '../../types';

const MOROCCAN_BANK_PRESETS = [
  { name: 'Attijariwafa Bank', badge: 'Attijari Mobile' },
  { name: 'CIH Bank', badge: 'CIH Mobile' },
  { name: 'Banque Populaire (BCP)', badge: 'Chaabi Net' },
  { name: 'Bank of Africa (BMCE)', badge: 'BMCE Direct' },
  { name: 'Al Barid Bank', badge: 'Barid Bank' },
  { name: 'CFG Bank', badge: 'CFG Mobile' },
  { name: 'Société Générale Maroc', badge: 'SGMB' },
  { name: 'BMCI', badge: 'BMCI Connect' },
  { name: 'Crédit du Maroc', badge: 'CDM' }
];

export const BankTransfersTab: React.FC = () => {
  const {
    orders,
    approveOrderAndDispatchKeys,
    rejectOrder,
    formatPrice,
    paymentGateways,
    updatePaymentGateway,
    showToast
  } = useStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'refunded'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [editingBankConfig, setEditingBankConfig] = useState(false);
  const [rejectConfirmOrderId, setRejectConfirmOrderId] = useState<string | null>(null);

  // Bank Form State for adding/editing banks
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [formBankName, setFormBankName] = useState('');
  const [formHolder, setFormHolder] = useState('BHSS SHOP DIGITAL');
  const [formRib, setFormRib] = useState('');
  const [formBadge, setFormBadge] = useState('Instantané (0 DH)');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Find Moroccan bank gateway
  const bankGateway = paymentGateways.find(
    (g) => g.type === 'moroccan_bank' || g.id === 'moroccan_bank_cih'
  );

  const bankAccountsList: BankAccount[] =
    bankGateway?.bankAccounts && bankGateway.bankAccounts.length > 0
      ? bankGateway.bankAccounts
      : bankGateway
      ? [
          {
            id: 'bank-default',
            bankName: bankGateway.bankName || 'CIH Bank',
            accountHolder: bankGateway.accountHolder || 'BHSS SHOP DIGITAL',
            ribNumber: bankGateway.ribNumber || '230 780 00012345678901 23',
            badge: 'Instantané',
            isDefault: true
          }
        ]
      : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const resetForm = () => {
    setIsAddingBank(false);
    setEditingBankId(null);
    setFormBankName('');
    setFormHolder(bankGateway?.accountHolder || 'BHSS SHOP DIGITAL');
    setFormRib('');
    setFormBadge('');
    setFormIsDefault(false);
  };

  const handleOpenAdd = () => {
    setEditingBankId(null);
    setFormBankName('');
    setFormHolder(bankGateway?.accountHolder || 'BHSS SHOP DIGITAL');
    setFormRib('');
    setFormBadge('Sans frais • 0 DH');
    setFormIsDefault(false);
    setIsAddingBank(true);
  };

  const handleOpenEdit = (acc: BankAccount) => {
    setEditingBankId(acc.id);
    setFormBankName(acc.bankName);
    setFormHolder(acc.accountHolder);
    setFormRib(acc.ribNumber);
    setFormBadge(acc.badge || '');
    setFormIsDefault(Boolean(acc.isDefault));
    setIsAddingBank(true);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankGateway) return;

    if (!formBankName.trim() || !formRib.trim()) {
      showToast('يرجى إدخال اسم البنك ورقم الحساب (RIB).', 'error');
      return;
    }

    let updatedList: BankAccount[] = [];

    if (editingBankId) {
      updatedList = bankAccountsList.map((a) => {
        if (a.id === editingBankId) {
          return {
            ...a,
            bankName: formBankName.trim(),
            accountHolder: formHolder.trim() || 'BHSS SHOP DIGITAL',
            ribNumber: formRib.trim(),
            badge: formBadge.trim() || undefined,
            isDefault: formIsDefault ? true : a.isDefault
          };
        }
        return formIsDefault ? { ...a, isDefault: false } : a;
      });
    } else {
      const newAcc: BankAccount = {
        id: `bank-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bankName: formBankName.trim(),
        accountHolder: formHolder.trim() || 'BHSS SHOP DIGITAL',
        ribNumber: formRib.trim(),
        badge: formBadge.trim() || undefined,
        isDefault: formIsDefault || bankAccountsList.length === 0
      };

      if (newAcc.isDefault) {
        updatedList = bankAccountsList.map((a) => ({ ...a, isDefault: false }));
        updatedList.push(newAcc);
      } else {
        updatedList = [...bankAccountsList, newAcc];
      }
    }

    const defaultAcc = updatedList.find((a) => a.isDefault) || updatedList[0];

    updatePaymentGateway(bankGateway.id, {
      bankAccounts: updatedList,
      bankName: defaultAcc?.bankName || formBankName.trim(),
      accountHolder: defaultAcc?.accountHolder || formHolder.trim(),
      ribNumber: defaultAcc?.ribNumber || formRib.trim()
    });

    showToast(`تم حفظ حساب بنك "${formBankName}" بنجاح!`, 'success');
    resetForm();
  };

  const handleDeleteBank = (accountId: string) => {
    if (!bankGateway) return;
    if (bankAccountsList.length <= 1) {
      showToast('يجب الاحتفاظ بحساب بنكي واحد على الأقل للمتجر.', 'error');
      return;
    }

    const updatedList = bankAccountsList.filter((a) => a.id !== accountId);
    if (!updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }

    const defaultAcc = updatedList.find((a) => a.isDefault) || updatedList[0];

    updatePaymentGateway(bankGateway.id, {
      bankAccounts: updatedList,
      bankName: defaultAcc.bankName,
      accountHolder: defaultAcc.accountHolder,
      ribNumber: defaultAcc.ribNumber
    });

    showToast('تم حذف الحساب البنكي.', 'info');
  };

  const handleSetDefault = (accountId: string) => {
    if (!bankGateway) return;
    const updatedList = bankAccountsList.map((a) => ({
      ...a,
      isDefault: a.id === accountId
    }));
    const target = updatedList.find((a) => a.id === accountId);
    if (target) {
      updatePaymentGateway(bankGateway.id, {
        bankAccounts: updatedList,
        bankName: target.bankName,
        accountHolder: target.accountHolder,
        ribNumber: target.ribNumber
      });
      showToast(`تم تعيين بنك "${target.bankName}" كحساب رئيسي للمتجر.`, 'success');
    }
  };

  // Filter bank transfer & pending verification orders
  const bankOrders = orders.filter((o) => {
    const isBank =
      o.requiresVerification ||
      o.status === 'pending' ||
      o.paymentMethod.toLowerCase().includes('bank') ||
      o.paymentMethod.toLowerCase().includes('cih') ||
      o.paymentMethod.toLowerCase().includes('virement');
    return isBank;
  });

  const pendingOrders = bankOrders.filter((o) => o.status === 'pending');
  const completedOrders = bankOrders.filter((o) => o.status === 'completed');
  const pendingTotalMAD = pendingOrders.reduce((acc, o) => acc + o.total * 10.15, 0);
  const completedTotalMAD = completedOrders.reduce((acc, o) => acc + o.total * 10.15, 0);

  const filteredOrders = bankOrders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(term);
      const matchEmail = order.customerEmail.toLowerCase().includes(term);
      const matchRef = (order.bankTransferRef || '').toLowerCase().includes(term);
      const matchTx = (order.paymentTxId || '').toLowerCase().includes(term);
      const matchBank = (order.bankName || '').toLowerCase().includes(term);
      return matchNumber || matchEmail || matchRef || matchTx || matchBank;
    }
    return true;
  });

  const defaultBank = bankAccountsList.find((a) => a.isDefault) || bankAccountsList[0];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                التحويلات البنكية والتحقق من الدفع قبل الاستلام
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                {bankAccountsList.length} بنوك معتمدة • Virement
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مراقبة التحويلات البنكية الواردة، التحقق من وصول الأموال في حسابك، ثم إطلاق المفاتيح الرقمية بنقرة واحدة.
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditingBankConfig(!editingBankConfig)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Building className="w-3.5 h-3.5 text-emerald-400" />
          <span>{editingBankConfig ? 'إغلاق إدارة الأبناك' : 'إدارة حسابات الأبناك المغربية (RIB)'}</span>
        </button>
      </div>

      {/* Moroccan Bank Accounts Management Panel */}
      {editingBankConfig && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4" />
                <span>إدارة الحسابات البنكية المغربية المعتمدة (Attijariwafa, CIH, Chaabi, etc.)</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                يمكنك إضافة عدة أبناك أو تغيير اسم البنك ورقم الـ RIB بسهولة. يختار الزبون البنك المفضل له عند الشراء.
              </p>
            </div>

            {!isAddingBank && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بنك جديد</span>
              </button>
            )}
          </div>

          {/* Form to Add or Edit a Bank */}
          {isAddingBank && (
            <form
              onSubmit={handleSaveBank}
              className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  {editingBankId ? 'تعديل بيانات البنك' : 'إضافة حساب بنكي جديد'}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold">
                  اختر بنكاً مغربياً من القائمة السريعة (أو اكتب أي بنك تريده في الحقل أدناه):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {MOROCCAN_BANK_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setFormBankName(preset.name);
                        if (!formBadge) setFormBadge(preset.badge);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                        formBankName === preset.name
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">اسم البنك *</label>
                  <input
                    type="text"
                    required
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    placeholder="مثال: Attijariwafa Bank أو CIH Bank"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">صاحب الحساب (Titulaire) *</label>
                  <input
                    type="text"
                    required
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    placeholder="BHSS SHOP / الاسم الكامل"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">شارة / ملاحظة (اختياري)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="مثال: بدون اقتطاعات • فوري"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-400">رقم الحساب البنكي (RIB - 24 رقماً) *</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formRib.replace(/\s+/g, '').length} / 24 رقماً
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formRib}
                  onChange={(e) => setFormRib(e.target.value)}
                  placeholder="007 780 00012345678901 23"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formIsDefault}
                    onChange={(e) => setFormIsDefault(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>تعيين هذا الحساب كحساب رئيسي افتراضي</span>
                </label>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:text-white cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    {editingBankId ? 'حفظ التعديلات' : 'إضافة هذا البنك للمتجر'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* List of currently active banks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bankAccountsList.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border relative transition flex flex-col justify-between ${
                  b.isDefault
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                      {b.bankName}
                    </span>
                    {b.isDefault ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                        الافتراضي
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(b.id)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-3 h-3" /> تعيين رئيسي
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    صاحب الحساب: <span className="text-slate-200 font-medium">{b.accountHolder}</span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate">
                    RIB: {b.ribNumber}
                  </div>

                  {b.badge && (
                    <span className="inline-block text-[10px] text-emerald-400 font-mono">
                      • {b.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-cyan-400" /> تعديل
                  </button>
                  {bankAccountsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBank(b.id)}
                      className="px-2 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> حذف
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Pending */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>في انتظار التحقق (Pending)</span>
            </span>
            <div className="text-2xl font-black text-white">{pendingOrders.length} طلبية</div>
            <div className="text-[11px] text-amber-300 font-mono font-semibold">
              ≈ {pendingTotalMAD.toFixed(2)} MAD
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
            ⏳
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم التحقق وتسليم المفاتيح</span>
            </span>
            <div className="text-2xl font-black text-white">{completedOrders.length} طلبية</div>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold">
              ≈ {completedTotalMAD.toFixed(2)} MAD محصلة
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            ✓
          </div>
        </div>

        {/* Card 3: Active Bank Details */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">حسابات الأبناك للمتجر</span>
            <span className="text-[10px] text-emerald-400 font-bold">{bankAccountsList.length} بنوك نشطة</span>
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>{defaultBank?.bankName || 'Virement Bancaire Maroc'} (الافتراضي)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            RIB: {defaultBank?.ribNumber || '230 780 00012345678901 23'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({bankOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>معلقة للتأكيد ({pendingOrders.length})</span>
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'completed'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>مكتملة ({completedOrders.length})</span>
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الطلب، الإيميل، أو الـ Motif..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <Landmark className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-bold text-slate-400">لا توجد تحويلات بنكية مطابقة للبحث حالياً.</p>
          <p className="text-[11px] text-slate-600">أي طلبية تتم عبر التحويلات البنكية المغربية (Attijari, CIH, Chaabi...) ستظهر هنا فوراً.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isCompleted = order.status === 'completed';
            const isRefunded = order.status === 'refunded';
            const totalInMad = (order.total * 10.15).toFixed(2);

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-amber-950/15 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : isCompleted
                    ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    : 'bg-rose-950/10 border-rose-500/30'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-white">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">{order.date}</span>

                    {/* Status Badge */}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/40 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>في انتظار التحقق من استلام المبلغ</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تم التحقق ومسجلة في الـ Vault</span>
                      </span>
                    )}
                    {isRefunded && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/40">
                        <XCircle className="w-3 h-3" />
                        <span>مرفوضة / ملغاة</span>
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400 font-mono">
                      {totalInMad} MAD
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ({formatPrice(order.total)})
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                  {/* Customer Information */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">بيانات الزبون (Client)</div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الاسم:</span>
                      <span className="font-bold text-white">{order.customerName || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">البريد الإلكتروني:</span>
                      <span className="font-mono text-cyan-300">{order.customerEmail}</span>
                    </div>
                    {order.customerDiscord && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Discord / التواصل:</span>
                        <span className="text-indigo-300">{order.customerDiscord}</span>
                      </div>
                    )}
                  </div>

                  {/* Transfer Reference & Motif */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">معلومات التحويل البنكي (Preuve & Motif)</div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">طريقة الدفع:</span>
                      <span className="font-bold text-emerald-400">{order.paymentMethod}</span>
                    </div>
                    {order.bankName && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">البنك المختار:</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1 text-[11px]">
                          <Landmark className="w-3 h-3" />
                          {order.bankName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Motif / مرجع التحويل:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {order.bankTransferRef || order.paymentTxId || 'لم يحدد'}
                        </span>
                        {order.bankTransferRef && (
                          <button
                            onClick={() => handleCopy(order.bankTransferRef!)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                            title="نسخ المرجع"
                          >
                            {copiedText === order.bankTransferRef ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {order.verifiedBy && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">تم التحقق بواسطة:</span>
                        <span className="text-slate-300">{order.verifiedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items & Reserved Keys */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase">
                    <span>المنتجات المطلوبة والمفاتيح المحجوزة ({order.items.length})</span>
                    <span>
                      {isPending ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> محجوزة بانتظار التأكيد (Non délivrée)
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> تم الإرسال للـ Vault
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {order.deliveredKeys.map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-bold text-white">{item.productTitle}</span>
                        </div>
                        <div className="font-mono text-[11px] text-cyan-300 flex items-center gap-2">
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {item.keyOrData}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons for Pending Orders */}
                {isPending && (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400">
                      هل تأكدت من وصول مبلغ <strong className="text-emerald-400">{formatPrice(order.total)} ({totalInMad} MAD)</strong> في حسابك / محفظتك ({order.paymentMethod})؟
                    </span>

                    {rejectConfirmOrderId === order.id ? (
                      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-rose-950/80 border border-rose-500/60 animate-in fade-in">
                        <span className="text-xs text-rose-200 font-bold px-1.5">
                          تأكيد رفض الدفع والطلب؟
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            rejectOrder(order.id);
                            setRejectConfirmOrderId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow transition cursor-pointer"
                        >
                          نعم، رفض الآن
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectConfirmOrderId(null)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRejectConfirmOrderId(order.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>رفض الدفع (Rejeter)</span>
                      </button>
                    )}

                    <button
                      onClick={() => approveOrderAndDispatchKeys(order.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تأكيد استلام المبلغ وإرسال المفاتيح فوراً</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
