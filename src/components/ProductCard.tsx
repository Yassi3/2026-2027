import React, { useRef } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  Zap,
  ShoppingCart,
  ShieldCheck,
  Eye,
  Check
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    setSelectedProductDetails,
    setIsCheckoutOpen,
    cart,
    t
  } = useStore();

  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInCart = cart.some((item) => item.product.id === product.id);

  const handleInstantBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart) {
      addToCart(product, 1);
    }
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Subtle 3D tilt and scale interaction on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle max tilt (±6.5 degrees) for sleek, non-disruptive feedback
    const maxTilt = 6.5;
    const rotateY = Number((((x - centerX) / centerX) * maxTilt).toFixed(2));
    const rotateX = Number((-((y - centerY) / centerY) * maxTilt).toFixed(2));

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;

    if (glareRef.current) {
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16), rgba(99, 102, 241, 0.08) 35%, transparent 70%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.12s ease-out, border-color 0.25s ease, box-shadow 0.25s ease';
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.25s ease, box-shadow 0.25s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedProductDetails(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/15 overflow-hidden cursor-pointer backdrop-blur-sm will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic Cursor Light Glare / Specular Highlight */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300"
      />
      {/* Top Image Section */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Platform Tag */}
          <span className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-slate-200 border border-slate-800 shadow">
            {product.platform}
          </span>

          {/* Discount Tag */}
          {discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-black tracking-wide shadow-lg shadow-emerald-500/20">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Bottom Delivery Tag inside image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/90 text-cyan-300 font-semibold border border-indigo-500/30 backdrop-blur-sm">
            <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            {product.deliveryTime}
          </span>

          <span className="text-[10px] text-slate-400 font-medium bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {product.stockCount > 0 ? `${product.stockCount} ${t('product.inStock')}` : t('product.outOfStock')}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
            <span className="uppercase tracking-wider font-semibold text-indigo-400">
              {product.subcategory || product.category}
            </span>

            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" />
              Instant
            </span>
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isInCart
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('product.added')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('product.addToCart')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstantBuy}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{t('product.buyNow')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
