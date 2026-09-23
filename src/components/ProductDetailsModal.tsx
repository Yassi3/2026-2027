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
    formatPrice
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
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Badges Over Image */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow">
                {product.platform}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950/80 text-cyan-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                {product.deliveryTime}
              </span>
            </div>

            {discountPercentage > 0 && (
              <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black">
                SAVE {discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h2>
          </div>

          {/* Price & Quantity & CTA Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Instant Digital Price</div>
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
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 font-bold"
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-indigo-400" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleInstantBuy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs: Overview, Activation Instructions, Warranty */}
          <div className="border-b border-slate-800 flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'instructions'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Redemption Guide
            </button>
            <button
              onClick={() => setActiveTab('guarantee')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'guarantee'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Warranty & Delivery
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-slate-300 leading-relaxed min-h-36">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's Included:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line">
                  {product.instructions || 'Standard digital redemption instructions will be provided in your vault and order confirmation.'}
                </div>
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>24/7 Live Support available via Telegram & Discord if you need help activating.</span>
                </div>
              </div>
            )}

            {activeTab === 'guarantee' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold">
                    <ShieldCheck className="w-4 h-4" />
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
