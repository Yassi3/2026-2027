import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  ShoppingBag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartDiscountAmount,
    cartTotal,
    activePromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    formatPrice
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          style={{
            backgroundColor: 'var(--theme-card-bg, #111827)',
            borderColor: 'var(--theme-border, #1f293d)'
          }}
          className="w-screen max-w-md border-l shadow-2xl flex flex-col"
        >
          {/* Drawer Header */}
          <div 
            style={{ borderColor: 'var(--theme-border, #1f293d)' }}
            className="p-5 border-b flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" style={{ color: 'var(--theme-primary, #6366f1)' }} />
              <h2 className="text-base font-extrabold text-white">Your Shopping Cart</h2>
              <span 
                style={{
                  backgroundColor: 'rgba(var(--theme-primary-rgb, 99, 102, 241), 0.15)',
                  color: 'var(--theme-primary, #6366f1)',
                  borderColor: 'var(--theme-border, #1f293d)'
                }}
                className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Browse our digital collection of game keys, licenses, and subscriptions.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 flex gap-3.5 items-center justify-between"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-900 shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase">
                          <span>{item.product.platform}</span>
                          <span>•</span>
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> Instant
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-xs font-extrabold text-white mt-1">
                          {formatPrice(item.product.price)}
                        </div>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Calculations */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
              {/* Promo code form */}
              {activePromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-300">{activePromo.code}</span>
                      <span className="text-[10px] text-emerald-400 ml-1">
                        (-{activePromo.discountPercentage}%)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Discount code (try: BHS10)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 uppercase font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-200">{formatPrice(cartSubtotal)}</span>
                </div>

                {activePromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({activePromo.discountPercentage}%)</span>
                    <span>-{formatPrice(cartDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-semibold">Free Instant Digital (0.00)</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-xl bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Security & Instant Delivery Guarantee note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keys unlocked automatically upon payment completion.</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                style={{
                  background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                  boxShadow: '0 10px 25px -4px var(--theme-glow, rgba(99, 102, 241, 0.35))'
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-extrabold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
