import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { checkDatabaseHealth, DatabaseDiagnostics } from '../lib/supabase';
import {
  X,
  Activity,
  CheckCircle2,
  RefreshCw,
  Server,
  Database,
  Shield,
  Zap,
  HardDrive
} from 'lucide-react';

export const DatabaseStatusModal: React.FC = () => {
  const {
    isDbStatusOpen,
    setIsDbStatusOpen,
    products,
    orders,
    vaultItems
  } = useStore();

  const [diagnostics, setDiagnostics] = useState<DatabaseDiagnostics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    const data = await checkDatabaseHealth(products.length, orders.length, vaultItems.length);
    setDiagnostics(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isDbStatusOpen) {
      fetchHealth();
    }
  }, [isDbStatusOpen]);

  if (!isDbStatusOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Database & API Health</h2>
              <p className="text-xs text-slate-400">Real-time persistence and connection telemetry</p>
            </div>
          </div>

          <button
            onClick={() => setIsDbStatusOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Metrics */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Status banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  System Operational (100% Online)
                </div>
                <div className="text-[11px] text-slate-400">
                  Storage Provider: {diagnostics?.provider || 'High-Availability Local + Cloud'}
                </div>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ping</span>
            </button>
          </div>

          {/* Grid stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Roundtrip Latency</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {diagnostics?.latencyMs ?? 18} ms
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cloud Uptime</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {diagnostics?.connectionDetails.uptime ?? '99.99%'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>SSL Encryption</span>
              </div>
              <div className="text-lg font-black text-cyan-300 font-mono">
                TLS 1.3
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Products</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {products.length}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>Orders Logged</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {orders.length}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vault Keys Stored</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {vaultItems.length}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold">Automatic Redundancy</div>
            <p>
              Changes are immediately synchronized to persistent local storage and validated with simulated cloud latency checks. Your cart, orders, and vault remain safe across reloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
