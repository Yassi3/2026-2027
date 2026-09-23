import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const {
    selectedProductDetails,
    setSelectedProductDetails,
    addToCart,
    setIsCheckoutOpen,
    formatPrice,
    t
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'guarantee'>('overview');

  if (!selectedProductDetails) return null;

  const product = selectedProductDetails;

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    setSelectedProductDetails(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: 'var(--theme-card-bg, #111827)',
          borderColor: 'var(--theme-border, #1f293d)',
          borderRadius: 'var(--theme-radius, 24px)',
          boxShadow: '0 25px 60px -15px var(--theme-glow, rgba(0, 0, 0, 0.7))'
        }}
        className="relative w-full max-w-3xl border shadow-2xl overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetails(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Media */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div
            style={{
              background: 'linear-gradient(to top, var(--theme-card-bg, #111827) 0%, rgba(10, 15, 30, 0.4) 60%, transparent 100%)'
            }}
            className="absolute inset-0"
          />

          {/* Badges Over Image */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                style={{
                  background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                  boxShadow: '0 4px 14px -2px var(--theme-glow, rgba(99, 102, 241, 0.35))'
                }}
                className="px-3 py-1 rounded-lg text-white text-xs font-bold shadow"
              >
                {product.platform}
              </span>
              <span
                style={{
                  backgroundColor: 'var(--theme-bg-subtle, rgba(9, 13, 22, 0.85))',
                  borderColor: 'var(--theme-border, #1f293d)',
                  color: 'var(--theme-accent, #06b6d4)'
                }}
                className="px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 backdrop-blur-md"
              >
                <Zap className="w-3.5 h-3.5" style={{ fill: 'var(--theme-accent, #06b6d4)' }} />
                {product.deliveryTime}
              </span>
            </div>

            {discountPercentage > 0 && (
              <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20">
                SAVE {discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              <span style={{ color: 'var(--theme-primary, #6366f1)' }}>{product.category}</span>
              <span className="text-slate-500">•</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({product.reviewsCount} {t('product.reviews')})
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h2>
          </div>

          {/* Price & Quantity & CTA Bar */}
          <div
            style={{
              backgroundColor: 'var(--theme-bg-subtle, #0e1424)',
              borderColor: 'var(--theme-border, #1f293d)',
              borderRadius: 'calc(var(--theme-radius, 16px) * 0.9)'
            }}
            className="p-4 border flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">{t('details.instantDigitalKey')}</div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <div
                style={{ borderColor: 'var(--theme-border, #1f293d)' }}
                className="flex items-center bg-slate-900/80 border rounded-xl p-1"
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleAddToCart}
                style={{
                  borderColor: 'var(--theme-border, #1f293d)'
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border text-white font-semibold text-xs transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" style={{ color: 'var(--theme-primary, #6366f1)' }} />
                <span>{t('product.addToCart')}</span>
              </button>

              <button
                onClick={handleInstantBuy}
                style={{
                  background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                  boxShadow: '0 8px 20px -3px var(--theme-glow, rgba(99, 102, 241, 0.45))'
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t('product.buyNow')}</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs: Overview, Activation Instructions, Warranty */}
          <div
            style={{ borderColor: 'var(--theme-border, #1f293d)' }}
            className="border-b flex gap-4"
          >
            <button
              onClick={() => setActiveTab('overview')}
              style={
                activeTab === 'overview'
                  ? {
                      borderColor: 'var(--theme-primary, #6366f1)',
                      color: 'var(--theme-primary, #6366f1)'
                    }
                  : undefined
              }
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'overview'
                  ? ''
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('details.keyHighlights')}
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              style={
                activeTab === 'instructions'
                  ? {
                      borderColor: 'var(--theme-primary, #6366f1)',
                      color: 'var(--theme-primary, #6366f1)'
                    }
                  : undefined
              }
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'instructions'
                  ? ''
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('details.activationGuide')}
            </button>
            <button
              onClick={() => setActiveTab('guarantee')}
              style={
                activeTab === 'guarantee'
                  ? {
                      borderColor: 'var(--theme-primary, #6366f1)',
                      color: 'var(--theme-primary, #6366f1)'
                    }
                  : undefined
              }
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'guarantee'
                  ? ''
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('details.warrantyAndSupport')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-slate-300 leading-relaxed min-h-36">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p>{product.description}</p>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('details.keyHighlights')}:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-200">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: 'var(--theme-primary, #10b981)' }}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-3">
                <div
                  style={{
                    backgroundColor: 'var(--theme-bg-subtle, #0e1424)',
                    borderColor: 'var(--theme-border, #1f293d)'
                  }}
                  className="p-4 rounded-xl border text-xs font-mono text-slate-300 whitespace-pre-line"
                >
                  {product.instructions ||
                    'Standard digital redemption instructions will be provided in your vault and order confirmation.'}
                </div>
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--theme-accent, #06b6d4)' }}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>24/7 Live Support available via Telegram & Discord if you need help activating.</span>
                </div>
              </div>
            )}

            {activeTab === 'guarantee' && (
              <div className="space-y-3">
                <div
                  style={{
                    backgroundColor: 'var(--theme-bg-subtle, #0e1424)',
                    borderColor: 'var(--theme-border, #1f293d)'
                  }}
                  className="p-4 rounded-xl border text-xs space-y-2"
                >
                  <div
                    className="flex items-center gap-2 font-bold"
                    style={{ color: 'var(--theme-primary, #6366f1)' }}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{product.warranty}</span>
                  </div>
                  <p className="text-slate-300">
                    All keys are guaranteed 100% genuine and verified against official servers. In the rare event of any activation difficulty, our automated system provides an instant replacement key.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
