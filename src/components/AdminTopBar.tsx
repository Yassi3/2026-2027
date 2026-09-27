import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Shield,
  Plus,
  Landmark,
  ShoppingCart,
  Package,
  Mail,
  LogOut,
  Sliders,
  DollarSign,
  ExternalLink
} from 'lucide-react';

export const AdminTopBar: React.FC = () => {
  const {
    isAdmin,
    setIsAdminOpen,
    products,
    orders,
    newsletterSubscribers,
    formatPrice,
    logoutAdmin,
    currentUser
  } = useStore();

  if (!isAdmin) {
    return null;
  }

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingBankCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="w-full bg-slate-950 border-b border-amber-500/30 text-xs px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/40 z-50 sticky top-0">
      {/* Left: Admin Badge & Store Status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>BHSS Admin</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <span className="hidden md:inline text-slate-400 text-[11px] font-mono">
          {currentUser?.name || 'Owner'} • Mode Administration Actif
        </span>
      </div>

      {/* Center: Horizontal Metrics Ticker (mstf ofo9i) */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{formatPrice(totalRevenue)}</span>
          <span className="text-[10px] text-slate-500 font-sans">mداخيل</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          <Package className="w-3.5 h-3.5" />
          <span>{products.length}</span>
          <span className="text-[10px] text-slate-500 font-sans">منتجات</span>
        </div>

        <div className="flex items-center gap-1.5 text-indigo-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{orders.length}</span>
          <span className="text-[10px] text-slate-500 font-sans">طلبيات</span>
        </div>

        {pendingBankCount > 0 ? (
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/40 animate-pulse cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{pendingBankCount} في انتظار التحقق</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">الأبناك جاهزة</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-rose-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          <Mail className="w-3.5 h-3.5" />
          <span>{newsletterSubscribers.length}</span>
          <span className="text-[10px] text-slate-500 font-sans">زبائن بالنشرة</span>
        </div>
      </div>

      {/* Right: Fast Horizontal Action Shortcuts */}
      <div className="flex items-center gap-2 shrink-0 ms-auto sm:ms-0">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-sm shadow-indigo-600/30"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>لوحة التحكم الكاملة (Dashboard)</span>
        </button>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-800 text-xs transition cursor-pointer"
          title="خروج من وضع الإدارة"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </div>
  );
};
