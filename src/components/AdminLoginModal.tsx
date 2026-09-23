import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Shield,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    loginAsAdmin,
    isAdmin,
    currentUser,
    logoutAdmin,
    setIsAdminOpen
  } = useStore();

  const [email, setEmail] = useState('bouhsousse.16@gmail.com');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleClose = () => {
    setIsAdminLoginOpen(false);
    setErrorMsg('');
    // Clear URL admin param/hash if present so customer isn't trapped
    if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await loginAsAdmin({ email, passkey });
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setPasskey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 md:p-7 text-center bg-gradient-to-b from-indigo-950/50 via-slate-900 to-slate-900 border-b border-slate-800/80 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Shield className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Staff & Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Protected administrative area. Valid store manager credentials required.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-7 space-y-5">
          {isAdmin && currentUser ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authenticated as Administrator</span>
                </div>
                <div className="text-xs font-mono text-slate-300">{currentUser.email}</div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setIsAdminOpen(true);
                  }}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Open Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logoutAdmin();
                    handleClose();
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bhsshop.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Security Passkey</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Authorized staff only</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter admin passkey..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-indigo-600 to-cyan-500 hover:from-amber-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Authenticating...' : 'Verify Admin Credentials'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Return to customer storefront
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
