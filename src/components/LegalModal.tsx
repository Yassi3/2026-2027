import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, RotateCcw, Lock } from 'lucide-react';

export type LegalTabType = 'terms' | 'privacy' | 'refund';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: LegalTabType;
  setActiveTab: (tab: LegalTabType) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white">Trust, Legal & Buyer Protection</h2>
              <p className="text-xs text-slate-400">
                Official policies governing purchases, warranties, and privacy on BHSS Shop.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/30 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'refund'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refund & Replacement Guarantee</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">1. Instant Digital Delivery</h3>
              <p>
                All digital game keys, retail software licenses, and subscription credentials sold on BHSS Shop are delivered instantly via our automated dispatch system upon confirmed payment, and are securely archived in your personal <strong>Digital Vault</strong>.
              </p>
              <h3 className="text-sm font-bold text-white">2. Bank Transfers & Verifications</h3>
              <p>
                Orders paid via Moroccan Bank Transfer (CIH Bank / Virement Bancaire) are queued in pending status until payment verification is confirmed by the store administration, ensuring safety for both parties before key release.
              </p>
              <h3 className="text-sm font-bold text-white">3. Authorized Products</h3>
              <p>
                All keys and passes are 100% genuine retail items sourced through authorized distribution partners, with lifetime activation guarantee unless explicitly marked as a timed subscription (e.g. 1-Year or 3-Month passes).
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
              <p>
                We only collect your email address for digital delivery receipts and order tracking, and optional Discord username for real-time customer support. We never collect or store banking passwords or credit card numbers.
              </p>
              <h3 className="text-sm font-bold text-white">2. Data Encryption</h3>
              <p>
                All customer orders, transactions, and license keys are encrypted in transit via SSL/TLS and stored in isolated storage with strict access control.
              </p>
              <h3 className="text-sm font-bold text-white">3. Zero Selling of Data</h3>
              <p>
                BHSS Shop never sells, rents, or shares customer information with any third-party advertisers.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-emerald-300 font-bold text-xs">100% Buyer Guarantee</h4>
                  <p className="text-[11px] text-slate-300">
                    If an activation key is invalid or fails to activate, our team will replace it immediately or issue a full refund within 24 hours.
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white">1. Valid Replacement Conditions</h3>
              <p>
                In the rare event that a digital license is non-functional or revoked by the platform provider, our 24/7 support will issue a brand-new replacement key directly to your Digital Vault upon verification.
              </p>
              <h3 className="text-sm font-bold text-white">2. Bank Transfer Protection</h3>
              <p>
                If a bank transfer cannot be fulfilled due to out-of-stock items, the total amount transferred in MAD is refunded in full to the customer's bank account with zero deduction fees.
              </p>
              <h3 className="text-sm font-bold text-white">3. Customer Support Response</h3>
              <p>
                Our team responds to all warranty tickets via Telegram (@bouhsousse_support) and Discord within 15 minutes.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
