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
  Edit3
} from 'lucide-react';
import { Order } from '../../types';

export const BankTransfersTab: React.FC = () => {
  const {
    orders,
    approveOrderAndDispatchKeys,
    rejectOrder,
    formatPrice,
    paymentGateways,
    updatePaymentGateway
  } = useStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'refunded'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [editingBankConfig, setEditingBankConfig] = useState(false);

  // Find Moroccan bank gateway
  const bankGateway = paymentGateways.find(
    (g) => g.type === 'moroccan_bank' || g.id === 'moroccan_bank_cih'
  );

  const [bankName, setBankName] = useState(bankGateway?.bankName || 'CIH Bank Maroc');
  const [accountHolder, setAccountHolder] = useState(bankGateway?.accountHolder || 'BHSS SHOP DIGITAL');
  const [ribNumber, setRibNumber] = useState(bankGateway?.ribNumber || '230 780 00012345678901 23');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankGateway) {
      updatePaymentGateway(bankGateway.id, {
        bankName,
        accountHolder,
        ribNumber
      });
      setEditingBankConfig(false);
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
      return matchNumber || matchEmail || matchRef || matchTx;
    }
    return true;
  });

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
                CIH / Virement
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
          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{editingBankConfig ? 'إغلاق الإعدادات' : 'تعديل بيانات الحساب البنكي (RIB)'}</span>
        </button>
      </div>

      {/* Edit Bank Config Modal/Section */}
      {editingBankConfig && (
        <form
          onSubmit={handleSaveBankConfig}
          className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <span>إعدادات الحساب البنكي المعتمد في المتجر</span>
            </h4>
            <span className="text-[11px] text-slate-400">تظهر هذه المعلومات للزبناء عند الدفع عبر Virement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">اسم البنك</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="CIH Bank / Attijariwafa"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">اسم صاحب الحساب (Titulaire)</label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                placeholder="BHSS SHOP / Nom & Prénom"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">رقم الـ RIB (24 رقماً)</label>
              <input
                type="text"
                required
                value={ribNumber}
                onChange={(e) => setRibNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                placeholder="230 780 00012345678901 23"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingBankConfig(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
            >
              حفظ بيانات الـ RIB
            </button>
          </div>
        </form>
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
            <span className="text-[10px] font-semibold text-slate-400 uppercase">حساب التحويل النشط</span>
            <span className="text-[10px] text-emerald-400 font-bold">نشط 24/7</span>
          </div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>{bankGateway?.bankName || 'CIH Bank Maroc'}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            RIB: {bankGateway?.ribNumber || '230 780 00012345678901 23'}
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
          <p className="text-[11px] text-slate-600">أي طلبية تتم عبر CIH Bank أو التحويل البنكي ستظهر هنا فوراً.</p>
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

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من رغبتك في إلغاء الطلبية ${order.orderNumber} وإرجاع المخزون؟`)) {
                          rejectOrder(order.id);
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
                    >
                      رفض الطلب (Rejeter)
                    </button>

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
