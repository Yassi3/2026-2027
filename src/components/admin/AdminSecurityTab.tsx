import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Shield,
  Key,
  UserPlus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';

export const AdminSecurityTab: React.FC = () => {
  const {
    adminAccounts,
    addAdminAccount,
    updateAdminPassword,
    deleteAdminAccount,
    currentUser
  } = useStore();

  // Change Password State
  const [selectedEmailForPassword, setSelectedEmailForPassword] = useState(
    currentUser?.email || 'bouhsousse.16@gmail.com'
  );
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // New Admin Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAdminPasskey, setNewAdminPasskey] = useState('');
  const [showAddPass, setShowAddPass] = useState(false);
  const [addStatusMsg, setAddStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Visible passkeys map for the list
  const [revealedKeys, setRevealedKeys] = useState<{ [id: string]: boolean }>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);

    if (!newPasskey || newPasskey.length < 4) {
      setPasswordStatusMsg({
        type: 'error',
        text: 'كلمة المرور يجب أن تتكون من 4 أحرف أو أرقام على الأقل.'
      });
      return;
    }

    if (newPasskey !== confirmPasskey) {
      setPasswordStatusMsg({
        type: 'error',
        text: 'كلمتا المرور غير متطابقتين، يرجى التأكد.'
      });
      return;
    }

    const res = updateAdminPassword(selectedEmailForPassword, newPasskey);
    if (res.success) {
      setPasswordStatusMsg({
        type: 'success',
        text: `تم تغيير كلمة المرور بنجاح للحساب: ${selectedEmailForPassword}`
      });
      setNewPasskey('');
      setConfirmPasskey('');
    } else {
      setPasswordStatusMsg({
        type: 'error',
        text: res.message
      });
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStatusMsg(null);

    if (!newEmail || !newEmail.includes('@')) {
      setAddStatusMsg({
        type: 'error',
        text: 'يرجى إدخال بريد إلكتروني صالح.'
      });
      return;
    }

    if (!newAdminPasskey || newAdminPasskey.length < 4) {
      setAddStatusMsg({
        type: 'error',
        text: 'كلمة المرور يجب أن تكون 4 خانات على الأقل.'
      });
      return;
    }

    const res = addAdminAccount({
      name: newName,
      email: newEmail,
      passkey: newAdminPasskey
    });

    if (res.success) {
      setAddStatusMsg({
        type: 'success',
        text: `تمت إضافة المشرف (${newEmail}) بنجاح!`
      });
      setNewName('');
      setNewEmail('');
      setNewAdminPasskey('');
    } else {
      setAddStatusMsg({
        type: 'error',
        text: res.message
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">إدارة المشرفين وحماية الحساب (Admin & Staff Security)</h3>
            <p className="text-xs text-slate-400">
              تغيير كلمة مرور المشرف (Passkey) وإضافة حسابات أدمن جديدة للتحكم في المتجر.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>المسجل حالياً: <strong className="text-white">{currentUser?.email}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: CHANGE PASSWORD */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Key className="w-4 h-4 text-amber-400" />
            <span>تغيير كلمة المرور (Modifier Mot de passe)</span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                اختر حساب المشرف المراد تغييره:
              </label>
              <select
                value={selectedEmailForPassword}
                onChange={(e) => setSelectedEmailForPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {adminAccounts.map((acc) => (
                  <option key={acc.id} value={acc.email}>
                    {acc.name} ({acc.email}) {acc.isOwner ? '★ المالك الرئيسي' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                كلمة المرور الجديدة (Nouveau Mot de passe / Passkey):
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                تأكيد كلمة المرور (Confirmer le mot de passe):
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                value={confirmPasskey}
                onChange={(e) => setConfirmPasskey(e.target.value)}
                placeholder="أعد إدخال كلمة المرور نفسها للتأكيد..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {passwordStatusMsg && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  passwordStatusMsg.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                }`}
              >
                {passwordStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordStatusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>حفظ كلمة المرور الجديدة</span>
            </button>
          </form>
        </div>

        {/* SECTION 2: ADD NEW ADMIN */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>إضافة مشرف جديد (Ajouter un Admin)</span>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                اسم المشرف (Nom & Prénom):
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="مثال: سعيد / شريك المتجر"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                البريد الإلكتروني للأدمن (Email):
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="partner@example.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                كلمة المرور الخاصة به (Mot de passe):
              </label>
              <div className="relative">
                <input
                  type={showAddPass ? 'text' : 'password'}
                  required
                  value={newAdminPasskey}
                  onChange={(e) => setNewAdminPasskey(e.target.value)}
                  placeholder="كلمة مرور الدخول للأدمن..."
                  className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAddPass(!showAddPass)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showAddPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {addStatusMsg && (
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  addStatusMsg.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                }`}
              >
                {addStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{addStatusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إنشاء حساب المشرف وتفعيله فوراً</span>
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 3: LIST OF ADMINS */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>قائمة المشرفين المصرح لهم (Comptes Administrateurs Actifs)</span>
          </div>
          <span className="text-xs text-slate-400">
            المجموع: <strong className="text-white">{adminAccounts.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {adminAccounts.map((acc) => {
            const isRevealed = revealedKeys[acc.id];
            const isOwner = acc.isOwner || acc.email.toLowerCase() === 'bouhsousse.16@gmail.com';

            return (
              <div
                key={acc.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{acc.name}</span>
                    {isOwner ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                        المالك الأساسي ★
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        مشرف (Admin)
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">{acc.email}</p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                    <span className="text-slate-500">كلمة المرور:</span>
                    <span className="text-cyan-300 font-bold">
                      {isRevealed ? acc.passkey : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(acc.id)}
                      className="text-slate-500 hover:text-slate-300 cursor-pointer ml-1"
                      title={isRevealed ? 'إخفاء' : 'إظهار كلمة المرور'}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  </div>
                </div>

                {!isOwner && (
                  deleteConfirmId === acc.id ? (
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/80 border border-rose-500/60 animate-in fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          deleteAdminAccount(acc.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        حذف
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(acc.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer shrink-0"
                      title="حذف هذا المشرف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
