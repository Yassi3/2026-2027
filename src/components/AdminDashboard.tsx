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
  Bell,
  LogOut,
  Upload,
  Key,
  Landmark,
  Clock,
  Palette,
  XCircle
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
    deleteProduct,
    orders,
    approveOrderAndDispatchKeys,
    rejectOrder,
    allVaultItems,
    formatPrice,
    settings,
    updateSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'transfers' | 'gateways' | 'themes' | 'security' | 'database' | 'settings'>('overview');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [rejectConfirmOrderId, setRejectConfirmOrderId] = useState<string | null>(null);

  // Protect Admin Dashboard: Only authenticated users with admin role can access
  if (!isAdminOpen || !isAdmin || currentUser?.role !== 'admin') {
    return null;
  }

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingBankCount = orders.filter((o) => o.status === 'pending').length;

  const handleEditProduct = (p: Product) => {
    setProductToEdit(p);
    setProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
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

  const filteredAdminProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Dashboard Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white">BHSS Admin Center</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  LIVE STORE
                </span>
              </div>
              <p className="text-xs text-slate-400">Inventory, orders, license fulfillment & store control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/60 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            {
              id: 'transfers',
              label: pendingBankCount > 0 ? `Vérifications (${pendingBankCount} En attente)` : 'Vérifications des Paiements',
              icon: Landmark,
              highlight: pendingBankCount > 0
            },
            { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
            { id: 'themes', label: 'Thèmes & Design', icon: Palette },
            { id: 'security', label: 'Admins & Passwords', icon: Key },
            { id: 'database', label: 'Cloud DB', icon: Database },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                    : tab.highlight
                    ? 'border-amber-500/50 text-amber-400 hover:text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Sales Volume</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Real-time instant settlements
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Completed Orders</span>
                    <ShoppingCart className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-indigo-400">100% Automated fulfillment</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Catalog Products</span>
                    <Package className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {products.length}
                  </div>
                  <div className="text-[10px] text-cyan-400">Active marketplace listings</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Keys Dispatched</span>
                    <KeyRound className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {allVaultItems.length}
                  </div>
                  <div className="text-[10px] text-amber-400">Stored in customer vaults</div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">Quick Administration</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handleNewProduct}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                    <button
                      onClick={() => setCategoryModalOpen(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Manage Categories</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-slate-400">No orders placed yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 3).map((ord) => (
                        <div
                          key={ord.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                            <span className="text-slate-400 ml-2">{ord.customerEmail}</span>
                          </div>
                          <span className="font-mono text-cyan-300 font-bold">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Search inventory..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCategoryModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Categories
                  </button>
                  <button
                    onClick={handleNewProduct}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAdminProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-9 h-9 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="font-bold text-white max-w-xs truncate">
                            {p.title}
                          </div>
                        </td>
                        <td className="p-3 text-indigo-300 font-semibold">{p.category}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold">
                            {p.platform}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          {formatPrice(p.price)}
                        </td>
                        <td className="p-3 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stockCount > 5
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {p.stockCount} in stock
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Customer Orders</h3>
              {orders.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No orders recorded in database yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                          <span className="text-slate-400">{ord.customerEmail}</span>
                          <span className="text-slate-500">{ord.date}</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-extrabold text-sm">
                          {formatPrice(ord.total)}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-slate-300 space-y-1">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex justify-between">
                            <span>
                              {it.quantity}x {it.product.title}
                            </span>
                            <span className="font-mono text-slate-400">
                              {formatPrice(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivered Key preview or Pending notice */}
                      {ord.status === 'pending' ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs">
                          <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>Paiement en attente ({ord.paymentMethod} - {ord.bankTransferRef || ord.paymentTxId || 'Sans réf'})</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {rejectConfirmOrderId === ord.id ? (
                              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/80 border border-rose-500/60 animate-in fade-in">
                                <span className="text-[11px] text-rose-200 font-bold px-1">رفض الدفع؟</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    rejectOrder(ord.id);
                                    setRejectConfirmOrderId(null);
                                  }}
                                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black transition cursor-pointer"
                                >
                                  نعم، رفض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectConfirmOrderId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition cursor-pointer"
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
                                <span>رفض الدفع</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => approveOrderAndDispatchKeys(ord.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تأكيد استلام المبلغ</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Delivered Keys ({ord.deliveredKeys.length}):</span>
                          </span>
                          <span className="text-slate-400 truncate max-w-xs">
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

          {/* TAB: BANK TRANSFERS & VERIFICATIONS */}
          {activeTab === 'transfers' && <BankTransfersTab />}

          {/* TAB: PAYMENT GATEWAYS */}
          {activeTab === 'gateways' && <PaymentSettingsTab />}

          {/* TAB: THEMES & DESIGN */}
          {activeTab === 'themes' && <ThemesTab />}

          {/* TAB: SECURITY & ADMINS */}
          {activeTab === 'security' && <AdminSecurityTab />}

          {/* TAB 5: DATABASE */}
          {activeTab === 'database' && <SupabasePlanTab />}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-xl text-xs">
              {/* Theme Quick Shortcut Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">
                      Thème & Palette du Magasin
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Personnalisez les couleurs, le fond et l'ambiance néon de la boutique.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('themes')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-md shadow-indigo-600/30"
                >
                  Changer le Thème →
                </button>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => updateSettings({ storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              {/* Store Logo Branding */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-xs">Store Logo Branding</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload an image, enter an image link, or use the cyber shield vector badge.
                    </p>
                  </div>
                  <div className="shrink-0 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <BHSSLogo size="sm" showSubtitle={false} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Direct Logo Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={settings.customLogoUrl || ''}
                    onChange={(e) => updateSettings({ customLogoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo from Device</span>
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
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                    >
                      Reset to Vector Emblem
                    </button>
                  )}
                </div>
              </div>

              {/* Mandatory Payment Verification Setting */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>تأكيد استلام المبلغ يدوياً قبل إرسال المفاتيح (Vérification obligatoire)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      عند تفعيل هذا الخيار، لا يتم إرسال أي كود أو حساب للزبون حتى تتأكد من دخول الأموال في حسابك (CIH / Crypto / Binance / PayPal) وتضغط على "تأكيد استلام المبلغ".
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
                      settings.requireManualPaymentVerification !== false
                        ? 'bg-emerald-600'
                        : 'bg-slate-700'
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
                <div className="text-[10px] text-emerald-400 font-medium">
                  {settings.requireManualPaymentVerification !== false
                    ? '✓ مفعل: لا تخرج أي مفاتيح للزبون إلا بعد أن تتأكد من استلام المبلغ في يدك وتضغط تأكيد.'
                    : '⚡ تسليم تلقائي: يتم تسليم المفاتيح فوراً عند إنهاء الشراء.'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300">Announcement Banner Text</label>
                <textarea
                  rows={2}
                  value={settings.announcementText}
                  onChange={(e) => updateSettings({ announcementText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Telegram Handle</label>
                  <input
                    type="text"
                    value={settings.telegramHandle}
                    onChange={(e) => updateSettings({ telegramHandle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Discord Invite</label>
                  <input
                    type="text"
                    value={settings.discordInvite}
                    onChange={(e) => updateSettings({ discordInvite: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
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

      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product?"
        message="Are you sure you want to remove this digital product from the marketplace? Active customer keys will remain in their vaults."
      />
    </div>
  );
};
