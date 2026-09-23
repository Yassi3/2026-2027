import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { products, setSelectedProductDetails, addToCart, formatPrice, settings, t } = useStore();

  // Find a hot deal to feature
  const featuredProduct = products.find((p) => p.id === 'prod-win11-pro') || products[0];

  return (
    <section className="relative overflow-hidden pt-6 pb-10 md:py-12 border-b border-slate-800/80">
      {/* Background cyber grid & glow effects */}
      {(settings.customTheme?.enableCyberBlobs ?? true) && (
        <>
          <div
            style={{ backgroundColor: 'var(--theme-primary, #6366f1)' }}
            className="absolute top-0 left-1/4 w-96 h-96 opacity-20 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-500"
          />
          <div
            style={{ backgroundColor: 'var(--theme-accent, #06b6d4)' }}
            className="absolute bottom-0 right-1/4 w-96 h-96 opacity-15 rounded-full blur-3xl pointer-events-none -z-10 transition-colors duration-500"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Pitch & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {t('hero.titlePrefix')}{' '}
              <span
                style={{
                  backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))'
                }}
                className="bg-clip-text text-transparent"
              >
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left rtl:text-right">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{t('hero.feature2')}</div>
                  <div className="text-[10px] text-slate-400">Digital Vault</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left rtl:text-right">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{t('hero.feature1')}</div>
                  <div className="text-[10px] text-slate-400">Lifetime Warranty</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left rtl:text-right">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{t('hero.feature3')}</div>
                  <div className="text-[10px] text-slate-400">Virement Maroc / USDT</div>
                </div>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  const element = document.getElementById('catalog-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                  boxShadow: '0 10px 25px -4px var(--theme-glow, rgba(99, 102, 241, 0.4))'
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{t('hero.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{t('hero.trustBadge')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Deal Spotlight Card */}
          {featuredProduct && (
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Glow border effect */}
                <div
                  style={{
                    background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))'
                  }}
                  className="absolute -inset-0.5 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"
                />

                <div
                  style={{
                    backgroundColor: 'var(--theme-card-bg, rgba(15, 23, 42, 0.95))',
                    borderColor: 'var(--theme-border, #1f293d)',
                    borderRadius: 'var(--theme-radius, 16px)'
                  }}
                  className="relative border p-5 sm:p-6 shadow-2xl backdrop-blur-xl"
                >
                  {/* Deal Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
                      Deal of the Day
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      SAVE 92%
                    </span>
                  </div>

                  {/* Product Card Inside */}
                  <div className="py-4 space-y-4">
                    <div className="relative h-44 rounded-xl overflow-hidden group/img">
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white text-xs font-bold backdrop-blur-sm shadow">
                          {featuredProduct.platform}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-300 text-[11px] font-medium border border-slate-700">
                          ⚡ {featuredProduct.deliveryTime}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white leading-snug hover:text-indigo-300 transition-colors cursor-pointer"
                        onClick={() => setSelectedProductDetails(featuredProduct)}
                      >
                        {featuredProduct.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {featuredProduct.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-2xl font-black text-white">
                          {formatPrice(featuredProduct.price)}
                        </div>
                        {featuredProduct.originalPrice && (
                          <div className="text-xs text-slate-500 line-through">
                            Original: {formatPrice(featuredProduct.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductDetails(featuredProduct)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(featuredProduct)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Instant Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Micro warranty guarantee footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock ({featuredProduct.stockCount} keys left)
                    </span>
                    <span className="text-slate-400">Official Retail License</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
