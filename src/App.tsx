import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { MaintenanceBanner } from './components/MaintenanceBanner';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { DigitalVaultModal } from './components/DigitalVaultModal';
import { UserAccountModal } from './components/UserAccountModal';
import { DatabaseStatusModal } from './components/DatabaseStatusModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MobileNavBar } from './components/MobileNavBar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { STORE_FAQS, STORE_STATS } from './data/mockData';
import {
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Headphones,
  SearchX
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    filteredProducts,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedPlatform,
    isAdmin,
    dir,
    t,
    currentLanguage
  } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div
      dir={dir}
      style={{ backgroundColor: 'var(--theme-bg, #090d16)', color: 'var(--theme-text, #f1f5f9)' }}
      className="min-h-screen flex flex-col font-sans relative w-full overflow-x-hidden transition-colors duration-300"
    >
      {/* Top Banner */}
      <MaintenanceBanner />

      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Spotlight Hero Section */}
        <HeroBanner />

        {/* Catalog & Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <CategoryNav />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 space-y-4 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('catalog.noProducts')}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {t('catalog.noProductsDesc')}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer"
              >
                {t('catalog.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Global Store Stats Bar */}
        <section className="mt-16 py-12 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent font-mono">
                  125,000+
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('stats.keysDelivered')}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent font-mono">
                  99.8%
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('stats.satisfaction')}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent font-mono">
                  &lt; 5s
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('stats.avgDelivery')}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-300 via-cyan-300 to-white bg-clip-text text-transparent font-mono">
                  100%
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('stats.genuineGuaranteed')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ & Buyer Protection Accordion */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('faq.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t('faq.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-3">
            {STORE_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left rtl:text-right text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 rtl:ml-0 rtl:mr-2 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNavBar />

      {/* Interactive Modals */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <DigitalVaultModal />
      <UserAccountModal />
      <DatabaseStatusModal />
      <AdminLoginModal />
      {isAdmin && <AdminDashboard />}

      {/* Global Toast Alert Layer */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
