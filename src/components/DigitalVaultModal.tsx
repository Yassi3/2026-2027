import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  KeyRound,
  Copy,
  Check,
  Search,
  Download,
  ShieldCheck,
  Zap,
  ExternalLink,
  Layers,
  Sparkles,
  Clock,
  Landmark
} from 'lucide-react';

export const DigitalVaultModal: React.FC = () => {
  const { isVaultOpen, setIsVaultOpen, vaultItems, myOrders, lookupAndRestoreCustomerOrders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isVaultOpen) return null;

  const pendingOrders = myOrders.filter((o) => o.status === 'pending');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupQuery.trim()) {
      lookupAndRestoreCustomerOrders(lookupQuery);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredItems = vaultItems.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.productTitle.toLowerCase().includes(term) ||
      item.keyOrCredential.toLowerCase().includes(term) ||
      item.orderNumber.toLowerCase().includes(term) ||
      item.platform.toLowerCase().includes(term)
    );
  });

  const handleExportAll = () => {
    if (vaultItems.length === 0) return;
    const content = `
==============================================
BHSS SHOP - PERSONAL DIGITAL VAULT EXPORT
Export Date: ${new Date().toLocaleDateString()}
Total Keys Stored: ${vaultItems.length}
==============================================

${vaultItems
  .map(
    (item, index) => `
[${index + 1}] ${item.productTitle} (${item.platform})
Order: ${item.orderNumber} | Purchased: ${item.datePurchased}
License Key / Credential:
${item.keyOrCredential}

Activation Instructions:
${item.instructions}
----------------------------------------------
`
  )
  .join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BHSS-Vault-Backup-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
        className="relative w-full max-w-3xl border shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div 
          style={{
            backgroundColor: 'var(--theme-bg-subtle, rgba(15, 23, 42, 0.5))',
            borderColor: 'var(--theme-border, #1f293d)'
          }}
          className="p-5 md:p-6 border-b flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-3">
            <div 
              style={{
                backgroundColor: 'rgba(var(--theme-primary-rgb, 99, 102, 241), 0.15)',
                borderColor: 'var(--theme-border, #1f293d)',
                color: 'var(--theme-primary, #6366f1)'
              }}
              className="p-2.5 rounded-2xl border"
            >
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-white">My Digital Key Vault</h2>
                <span 
                  style={{
                    backgroundColor: 'rgba(var(--theme-primary-rgb, 99, 102, 241), 0.15)',
                    color: 'var(--theme-primary, #6366f1)',
                    borderColor: 'var(--theme-border, #1f293d)'
                  }}
                  className="px-2 py-0.5 rounded-full font-bold text-xs border"
                >
                  {vaultItems.length} active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Encrypted permanent storage for all your purchased activation licenses.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVaultOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search + Export */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys, titles, or order numbers..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExportAll}
            disabled={vaultItems.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (.txt)</span>
          </button>
        </div>

        {/* Keys List */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
          {/* Pending Bank Transfer Alert */}
          {pendingOrders.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-300">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                <span>
                  <strong>{pendingOrders.length} commande(s) par virement en attente de validation :</strong> Les clés seront déverrouillées et ajoutées ici dès confirmation du virement par l'administrateur.
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase shrink-0 border border-amber-500/30 self-start sm:self-auto">
                Vérification en cours
              </span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                <KeyRound className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-200">
                  {searchTerm ? 'No matching keys found' : 'Your Digital Key Vault is Empty'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchTerm
                    ? 'Try searching with another keyword or order number.'
                    : 'Any digital license or game key you purchase on this device will be stored here with instant copy and instructions.'}
                </p>
              </div>

              {/* Order Recovery Box */}
              {!searchTerm && (
                <div className="pt-2 max-w-md mx-auto">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-left">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Already bought? Retrieve your keys:</span>
                    </div>
                    <form onSubmit={handleLookup} className="flex gap-2">
                      <input
                        type="text"
                        value={lookupQuery}
                        onChange={(e) => setLookupQuery(e.target.value)}
                        placeholder="Enter your email or Order # (e.g. BHS-123456)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                      >
                        Restore
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 md:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Item header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase">
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span className="text-slate-400">Order: {item.orderNumber}</span>
                        <span>•</span>
                        <span className="text-slate-500">{item.datePurchased}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{item.productTitle}</h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    ACTIVATED
                  </span>
                </div>

                {/* Key Box */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-cyan-300 font-bold text-xs md:text-sm">
                  <span className="truncate select-all">{item.keyOrCredential}</span>
                  <button
                    onClick={() => handleCopy(item.keyOrCredential, item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-semibold transition-all shrink-0 cursor-pointer"
                  >
                    {copiedId === item.id ? (
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

                {/* Activation Instructions */}
                <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg">
                  <span className="text-slate-300 font-semibold">Redemption: </span>
                  {item.instructions}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
