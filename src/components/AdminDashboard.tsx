import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order } from '../types';
import { ProductFormModal } from './admin/ProductFormModal';
import { CategoryManagerModal } from './admin/CategoryManagerModal';
import { DeleteConfirmModal } from './admin/DeleteConfirmModal';
import { PaymentSettingsTab } from './admin/PaymentSettingsTab';
import { SupabasePlanTab } from './admin/SupabasePlanTab';
import { AdminSecurityTab } from './admin/AdminSecurityTab';
import { BankTransfersTab } from './admin/BankTransfersTab';
import { ThemesTab } from './admin/ThemesTab';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings,
  KeyRound,
  Shield,
  Layers,
  Database,
  CreditCard,
  CheckCircle2,
  Search,
  LogOut,
  Upload,
  Key,
  Landmark,
  Clock,
  Palette,
  XCircle,
  Mail,
  Download,
  Copy,
  Filter,
  ArrowRight,
  ExternalLink,
  Boxes,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { BHSSLogo } from './BHSSLogo';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdmin,
    currentUser,
    logoutAdmin,
    products,
    categories,
    addProduct,
    deleteProduct,
    clearAllProducts,
    orders,
    approveOrderAndDispatchKeys,
    rejectOrder,
    allVaultItems,
    formatPrice,
    settings,
    updateSettings,
    newsletterSubscribers,
    exportSubscribers,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'orders'
    | 'transfers'
    | 'marketing'
    | 'gateways'
    | 'themes'
    | 'security'
    | 'database'
    | 'settings'
  >('overview');

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);

  // Filters for Products
  const [searchProduct, setSearchProduct] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productPlatformFilter, setProductPlatformFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outofstock'>('all');

  // Filters for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'completed' | 'refunded'>('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [rejectConfirmOrderId, setRejectConfirmOrderId] = useState<string | null>(null);

  // Filters for Marketing
  const [searchSubscriber, setSearchSubscriber] = useState('');

  // Protect Admin Dashboard: Only authenticated users with admin role can access
  if (!isAdminOpen || !isAdmin || currentUser?.role !== 'admin') {
    return null;
  }

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingBankCount = orders.filter((o) => o.status === 'pending').length;
  const totalCatalogValue = products.reduce((sum, p) => sum + p.price * p.stockCount, 0);
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.stockCount, 0);

  const handleEditProduct = (p: Product) => {
    setProductToEdit(p);
    setProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleDuplicateProduct = (p: Product) => {
    try {
      const { id, ...rest } = p;
      addProduct({
        ...rest,
        title: `${p.title} (Copy)`
      });
      showToast(`Produit "${p.title}" dupliqué avec succès!`, 'success');
    } catch {
      showToast('Échec de duplication du produit', 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      deleteProduct(itemToDeleteId);
      setItemToDeleteId(null);
    }
  };

  const exportProducts = () => {
    if (products.length === 0) {
      showToast('No products to export', 'info');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Title,Category,Platform,Price,Stock\n' +
      products
        .map(
          (p) =>
            `"${p.id}","${p.title.replace(/"/g, '""')}","${p.category}","${p.platform}",${p.price},${p.stockCount}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bhsshop_products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${products.length} products to CSV!`, 'success');
  };

  const filteredAdminProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProduct.toLowerCase());
    const matchCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchPlatform = productPlatformFilter === 'all' || p.platform === productPlatformFilter;
    const matchStock =
      productStockFilter === 'all' ||
      (productStockFilter === 'instock' && p.stockCount > 0) ||
      (productStockFilter === 'lowstock' && p.stockCount > 0 && p.stockCount <= 3) ||
      (productStockFilter === 'outofstock' && p.stockCount === 0);

    return matchSearch && matchCategory && matchPlatform && matchStock;
  });

  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const cleanSearch = searchOrder.toLowerCase().trim();
    const matchSearch =
      !cleanSearch ||
      o.orderNumber.toLowerCase().includes(cleanSearch) ||
      o.customerEmail.toLowerCase().includes(cleanSearch) ||
      (o.bankTransferRef && o.bankTransferRef.toLowerCase().includes(cleanSearch));
    return matchStatus && matchSearch;
  });

  const filteredSubscribers = newsletterSubscribers.filter((s) =>
    s.email.toLowerCase().includes(searchSubscriber.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Full-width widescreen container (horizontal layout - mstf ofo9i) */}
      <div className="relative w-full max-w-[1580px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-[97vh]">
        {/* Horizontal Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          {/* Left Brand & Status */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">BHSS Admin Console</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE STORE</span>
                </span>
                <span className="hidden md:inline-flex text-[11px] text-slate-400 font-mono">
                  • {currentUser?.name || 'Store Owner'} ({currentUser?.email || 'Admin'})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">لوحة التحكم الأفقية لإدارة المتجر، المخزون، الطلبيات، والأبناك</p>
            </div>
          </div>

          {/* Center Horizontal Ticker (Desktop - mstf ofo9i) */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{formatPrice(totalRevenue)}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
              <span>{orders.length} orders</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <Package className="w-3.5 h-3.5" />
              <span>{products.length} products</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-rose-300">
              <Mail className="w-3.5 h-3.5" />
              <span>{newsletterSubscribers.length} leads</span>
            </div>
            {pendingBankCount > 0 && (
              <>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setActiveTab('transfers')}
                  className="flex items-center gap-1 text-amber-400 font-bold animate-pulse hover:underline cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>{pendingBankCount} pending</span>
                </button>
              </>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleNewProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Nouveau Produit</span>
              <span className="sm:hidden">+ Produit</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              title="Logout from Admin Mode"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Bar (Mstf Ofo9i - Categorized with Badges) */}
        <div className="px-5 py-2 border-b border-slate-800 bg-slate-950/90 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: 'لوحة التحكم (Overview)', icon: TrendingUp },
            { id: 'products', label: `المنتجات (${products.length})`, icon: Package, badge: products.length },
            { id: 'orders', label: `الطلبيات (${orders.length})`, icon: ShoppingCart, badge: orders.length },
            {
              id: 'transfers',
              label: pendingBankCount > 0 ? `التحقق البنكي (${pendingBankCount})` : 'التحقق البنكي (RIB)',
              icon: Landmark,
              highlight: pendingBankCount > 0,
              pulse: pendingBankCount > 0
            },
            { id: 'marketing', label: `التسويق والنشرة (${newsletterSubscribers.length})`, icon: Mail },
            { id: 'gateways', label: 'بوابات الدفع (Gateways)', icon: CreditCard },
            { id: 'themes', label: 'المظهر والتصميم (Themes)', icon: Palette },
            { id: 'settings', label: 'إعدادات المتجر (Settings)', icon: Settings },
            { id: 'security', label: 'المشرفين والأمان (Admins)', icon: Key },
            { id: 'database', label: 'قاعدة البيانات (Cloud DB)', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : tab.highlight
                    ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.pulse ? 'animate-bounce text-amber-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Quick Actions Strip (mstf ofo9i) */}
        <div className="px-5 py-2 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider hidden sm:inline">
              روابط سريعة:
            </span>
            <button
              onClick={handleNewProduct}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 font-semibold cursor-pointer transition"
            >
              <Plus className="w-3 h-3" />
              <span>+ إضافة منتج</span>
            </button>

            <button
              onClick={() => setCategoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 font-semibold cursor-pointer transition"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>إدارة التصنيفات</span>
            </button>

            <button
              onClick={() => setActiveTab('transfers')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition ${
                pendingBankCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Landmark className="w-3 h-3 text-amber-400" />
              <span>التحويلات البنكية ({pendingBankCount})</span>
            </button>

            <button
              onClick={exportProducts}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 font-semibold cursor-pointer transition"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>تصدير CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>مجموع المخزون: <strong className="text-white">{totalUnitsInStock}</strong> قطعة</span>
            <span>•</span>
            <span>القيمة التقديرية: <strong className="text-emerald-400">{formatPrice(totalCatalogValue)}</strong></span>
          </div>
        </div>

        {/* Horizontal Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-900/60">
          {/* TAB 1: OVERVIEW (HORIZONTAL MULTI-COLUMN) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* 5 KPI Metric cards in a single balanced horizontal row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>حجم المبيعات الإجمالي</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> تسوية فورية للطلبات
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>مجموع الطلبيات</span>
                    <ShoppingCart className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-indigo-400">تسليم أوتوماتيكي ومباشر</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>منتجات الكتالوج</span>
                    <Package className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {products.length}
                  </div>
                  <div className="text-[10px] text-cyan-400">منتجات رقمية نشطة</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>المفاتيح بالخزائن</span>
                    <KeyRound className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {allVaultItems.length}
                  </div>
                  <div className="text-[10px] text-amber-400">محفوظة في خزائن الزبائن</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>إيميلات التسويق</span>
                    <Mail className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">
                    {newsletterSubscribers.length}
                  </div>
                  <div className="text-[10px] text-rose-400">للحملات الترويجية</div>
                </div>
              </div>

              {/* Two balanced horizontal panels side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Quick Administration & Shortcuts */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>العمليات السريعة</span>
                    <span className="text-[11px] text-slate-500 font-normal">Fast Operations</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleNewProduct}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-600/25"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة منتج</span>
                    </button>

                    <button
                      onClick={() => setCategoryModalOpen(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700/60"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>التصنيفات</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('transfers')}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700/60"
                    >
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <span>الأبناك المغربية</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('marketing')}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-700/60"
                    >
                      <Mail className="w-4 h-4 text-rose-400" />
                      <span>النشرة البريدية</span>
                    </button>
                  </div>

                  {/* System & Verification status summary */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">التحقق اليدوي من وصول المال:</span>
                      <span
                        className={`font-bold ${
                          settings.requireManualPaymentVerification !== false ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {settings.requireManualPaymentVerification !== false ? 'نشط (حماية كاملة)' : 'إرسال فوري'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">التحويلات البنكية العالقة:</span>
                      <span className="font-bold font-mono text-amber-400">{pendingBankCount} في انتظار التأكيد</span>
                    </div>
                  </div>
                </div>

                {/* Right: Recent Customer Orders */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">آخر طلبيات الزبائن (Recent Orders)</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض كل الطلبيات ({orders.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 text-xs space-y-2">
                      <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>لا توجد طلبيات مسجلة بعد في المتجر.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 4).map((ord) => (
                        <div
                          key={ord.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded">
                              {ord.orderNumber}
                            </span>
                            <span className="text-slate-300">{ord.customerEmail}</span>
                            <span className="text-slate-500 text-[11px]">{ord.date}</span>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : ord.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {ord.status.toUpperCase()}
                            </span>
                            <span className="font-mono text-cyan-300 font-extrabold text-sm">
                              {formatPrice(ord.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS INVENTORY (HORIZONTAL TOOLBAR & WIDESCREEN TABLE) */}
          {activeTab === 'products' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              {/* Full horizontal controls toolbar - Mstf Ofo9i */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      placeholder="البحث بالاسم أو التصنيف..."
                      className="w-full ps-9 pe-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">كل التصنيفات ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Platform Filter */}
                  <select
                    value={productPlatformFilter}
                    onChange={(e) => setProductPlatformFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">كل المنصات</option>
                    <option value="Steam">Steam</option>
                    <option value="Windows">Windows</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Multiplatform">Multiplatform</option>
                    <option value="Web/Cloud">Web/Cloud</option>
                  </select>

                  {/* Stock Filter */}
                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">حالة المخزون (الكل)</option>
                    <option value="instock">متوفر بالمخزون</option>
                    <option value="lowstock">مخزون منخفض (3 أو أقل)</option>
                    <option value="outofstock">نفذ من المخزون</option>
                  </select>
                </div>

                {/* Horizontal Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportProducts}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700/60"
                    title="Export products list to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>

                  <button
                    onClick={() => setCategoryModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700/60"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>التصنيفات</span>
                  </button>

                  {products.length > 0 && (
                    <button
                      onClick={() => setClearAllConfirmOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold cursor-pointer transition"
                      title="Supprimer tous les produits du magasin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">حذف الكل</span>
                    </button>
                  )}

                  <button
                    onClick={handleNewProduct}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ إضافة منتج</span>
                  </button>
                </div>
              </div>

              {/* Product Table or Empty State */}
              {products.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                    <Package className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">المتجر جاهز لإضافة أول منتج</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      يمكنك البدء الآن في إضافة منتجاتك الرقمية بالصور والأسعار والمفاتيح وتسليمها تلقائياً للزبائن.
                    </p>
                  </div>
                  <button
                    onClick={handleNewProduct}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ إضافة أول منتج (Add First Product)</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">المنتج (Product)</th>
                        <th className="p-3.5">التصنيف</th>
                        <th className="p-3.5">المنصة</th>
                        <th className="p-3.5">السعر</th>
                        <th className="p-3.5">المخزون</th>
                        <th className="p-3.5">طريقة التسليم</th>
                        <th className="p-3.5 text-right">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredAdminProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                            لا توجد منتجات تطابق معايير البحث أو الفلترة.
                          </td>
                        </tr>
                      ) : (
                        filteredAdminProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800 hover:scale-105 transition"
                              />
                              <div className="max-w-xs sm:max-w-sm truncate">
                                <div className="font-bold text-white truncate flex items-center gap-1.5">
                                  <span>{p.title}</span>
                                  {p.isFeatured && (
                                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold">
                                      مميز
                                    </span>
                                  )}
                                </div>
                                {p.shortDescription && (
                                  <div className="text-[11px] text-slate-400 truncate">{p.shortDescription}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 text-indigo-300 font-semibold">{p.category}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold">
                                {p.platform}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-white">
                              <div>{formatPrice(p.price)}</div>
                              {p.originalPrice && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  {formatPrice(p.originalPrice)}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.stockCount > 5
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : p.stockCount > 0
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                  }`}
                              >
                                {p.stockCount} متوفر
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">⚡ {p.deliveryTime || 'فوري'}</td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleDuplicateProduct(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 border border-slate-800 transition"
                                  title="نسخ المنتج (Duplicate)"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleEditProduct(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-slate-800 transition"
                                  title="تعديل المنتج"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(p.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-slate-800 transition"
                                  title="حذف المنتج"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Horizontal Table Footer Summary */}
                  <div className="p-3.5 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
                    <div>
                      عرض <strong className="text-white">{filteredAdminProducts.length}</strong> من أصل{' '}
                      <strong className="text-white">{products.length}</strong> منتج
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span>إجمالي القطع: {totalUnitsInStock}</span>
                      <span>•</span>
                      <span>إجمالي القيمة: {formatPrice(totalCatalogValue)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS (HORIZONTAL FILTER BAR & FULL-WIDTH ROWS) */}
          {activeTab === 'orders' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              {/* Horizontal filter & search toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {/* Horizontal status pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[
                    { id: 'all', label: `كل الطلبيات (${orders.length})` },
                    {
                      id: 'pending',
                      label: `في انتظار التأكيد (${orders.filter((o) => o.status === 'pending').length})`
                    },
                    {
                      id: 'completed',
                      label: `مكتملة ومسلمة (${orders.filter((o) => o.status === 'completed').length})`
                    },
                    {
                      id: 'refunded',
                      label: `مسترجعة (${orders.filter((o) => o.status === 'refunded').length})`
                    }
                  ].map((s) => {
                    const isSelected = orderStatusFilter === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setOrderStatusFilter(s.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                {/* Order search input */}
                <div className="relative min-w-[240px]">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="البحث برقم الطلب أو الإيميل أو المرجع..."
                    className="w-full ps-9 pe-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>لا توجد طلبيات مطابقة للفلتر المحدد.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700/80 transition-colors"
                    >
                      {/* Top horizontal order row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                            {ord.orderNumber}
                          </span>
                          <span className="text-slate-300 font-semibold">{ord.customerEmail}</span>
                          <span className="text-slate-500 text-[11px]">{ord.date}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                            {ord.paymentMethod}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="font-mono text-cyan-300 font-extrabold text-base">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items Summary in horizontal layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {ord.items.map((it, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-300"
                          >
                            <span className="font-medium truncate mr-2">
                              {it.quantity}x {it.product.title}
                            </span>
                            <span className="font-mono text-slate-400 shrink-0">
                              {formatPrice(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action & Verification footer */}
                      {ord.status === 'pending' ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs">
                          <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            <span>
                              التحقق من الدفع: {ord.bankTransferRef || ord.paymentTxId || 'التحقق من وصول المبلغ'}
                            </span>
                          </span>

                          <div className="flex items-center gap-2">
                            {rejectConfirmOrderId === ord.id ? (
                              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950 border border-rose-500/60">
                                <span className="text-[11px] text-rose-200 font-bold px-1">رفض الطلب؟</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    rejectOrder(ord.id);
                                    setRejectConfirmOrderId(null);
                                  }}
                                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                                >
                                  نعم، رفض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectConfirmOrderId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRejectConfirmOrderId(ord.id)}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Refuser</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => approveOrderAndDispatchKeys(ord.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valider & Envoyer Clés</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>المفاتيح بالخزينة الرقمية ({ord.deliveredKeys.length}):</span>
                          </span>
                          <span className="text-slate-400 truncate max-w-md">
                            {ord.deliveredKeys.map((k) => k.keyOrData).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BANK TRANSFERS & VERIFICATIONS */}
          {activeTab === 'transfers' && <BankTransfersTab />}

          {/* TAB: MARKETING & NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'marketing' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>إيميلات الزبائن المسجلين بالنشرة ({newsletterSubscribers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إيميلات حقيقية تم جمعها من صندوق النشرة البريدية أسفل الموقع لاستخدامها في الحملات الإعلانية.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchSubscriber}
                      onChange={(e) => setSearchSubscriber(e.target.value)}
                      placeholder="البحث بالإيميل..."
                      className="ps-8 pe-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (newsletterSubscribers.length === 0) {
                        showToast('No emails to copy yet', 'info');
                        return;
                      }
                      const allEmails = newsletterSubscribers.map((s) => s.email).join(', ');
                      navigator.clipboard.writeText(allEmails);
                      showToast(`تم نسخ ${newsletterSubscribers.length} إيميل!`, 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700/60"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ كل الإيميلات</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportSubscribers}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير CSV</span>
                  </button>
                </div>
              </div>

              {/* Subscriber List Table */}
              {newsletterSubscribers.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Mail className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">لا توجد إيميلات مسجلة بعد</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    عندما يدخل زوار المتجر إيميلاتهم في الفوتر، ستسجل تلقائياً هنا مع التوقيت والخصم الممنوح لهم.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">إيميل الزبون (Email)</th>
                        <th className="py-3 px-4">تاريخ التسجيل</th>
                        <th className="py-3 px-4">كود الخصم الممنوح</th>
                        <th className="py-3 px-4 text-right">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {filteredSubscribers.map((sub, idx) => (
                        <tr key={sub.id || idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 text-slate-500 font-sans">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{sub.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'Recent'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                              BHS10 (-10%)
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(sub.email);
                                showToast(`تم نسخ ${sub.email}`, 'success');
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans transition cursor-pointer"
                            >
                              Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYMENT GATEWAYS */}
          {activeTab === 'gateways' && <PaymentSettingsTab />}

          {/* TAB 6: THEMES & DESIGN */}
          {activeTab === 'themes' && <ThemesTab />}

          {/* TAB 7: SECURITY & ADMINS */}
          {activeTab === 'security' && <AdminSecurityTab />}

          {/* TAB 8: DATABASE */}
          {activeTab === 'database' && <SupabasePlanTab />}

          {/* TAB 9: SETTINGS (3-COLUMN BALANCED HORIZONTAL GRID - MSTF OFO9I!) */}
          {activeTab === 'settings' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Top Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">ثيمات وألوان المتجر الرقمي</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      تخصيص كامل لألوان الأزرار والنيون والخطوط والخلفية في متجرك.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('themes')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-md shadow-indigo-600/30"
                >
                  تغيير الثيم →
                </button>
              </div>

              {/* 3-Column Balanced Horizontal Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                {/* Column 1: Store Identity & Branding */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    هوية المتجر والشعار (Store Identity)
                  </h3>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">اسم المتجر (Store Name)</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => updateSettings({ storeName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Logo Customization */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">شعار المتجر (Logo)</span>
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        <BHSSLogo size="sm" showSubtitle={false} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">رابط صورة الشعار (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={settings.customLogoUrl || ''}
                        onChange={(e) => updateSettings({ customLogoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع شعار من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  updateSettings({ customLogoUrl: event.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {settings.customLogoUrl && (
                        <button
                          type="button"
                          onClick={() => updateSettings({ customLogoUrl: '' })}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                        >
                          إعادة ضبط
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Support & Community Channels */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    قنوات الدعم والتواصل
                  </h3>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">حساب تيليجرام (Telegram)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={settings.telegramHandle}
                        onChange={(e) => updateSettings({ telegramHandle: e.target.value })}
                        placeholder="@BHSS_Support"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      {settings.telegramHandle && (
                        <a
                          href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400"
                          title="تجربة رابط تيليجرام"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">سيرفر ديسكورد (Discord Invite)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={settings.discordInvite}
                        onChange={(e) => updateSettings({ discordInvite: e.target.value })}
                        placeholder="discord.gg/bhsshop"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      {settings.discordInvite && (
                        <a
                          href={`https://${settings.discordInvite}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400"
                          title="تجربة رابط ديسكورد"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">إيميل الدعم الفني (Support Email)</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                      placeholder="support@bhsshop.com"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Column 3: Automation & Safeguards */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                    الأمان وحماية المداخيل
                  </h3>

                  {/* Mandatory Payment Verification Setting */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تأكيد يدوي لاستلام المبلغ</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          عدم إرسال المفاتيح إلا بعد التأكد من دخول المال لحسابك.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateSettings({
                            requireManualPaymentVerification:
                              settings.requireManualPaymentVerification !== false ? false : true,
                            autoDeliveryEnabled:
                              settings.requireManualPaymentVerification !== false ? true : false
                          })
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.requireManualPaymentVerification !== false ? 'bg-emerald-600' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.requireManualPaymentVerification !== false
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Announcement Banner */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300">شريط الإعلان أعلى المتجر (Banner)</label>
                      <button
                        type="button"
                        onClick={() => updateSettings({ announcementActive: !settings.announcementActive })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          settings.announcementActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {settings.announcementActive ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={settings.announcementText}
                      onChange={(e) => updateSettings({ announcementText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      <CategoryManagerModal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف المنتج ؟"
        message="هل أنت متأكد من رغبتك في حذف هذا المنتج من المتجر؟ المفاتيح التي تم شراؤها مسبقاً ستبقى في خزائن الزبائن."
      />

      <DeleteConfirmModal
        isOpen={clearAllConfirmOpen}
        onClose={() => setClearAllConfirmOpen(false)}
        onConfirm={() => {
          clearAllProducts();
          setClearAllConfirmOpen(false);
        }}
        title="Supprimer tous les produits ?"
        message="Êtes-vous sûr de vouloir supprimer tous les produits existants du magasin ? Le catalogue sera complètement vidé."
      />
    </div>
  );
};
