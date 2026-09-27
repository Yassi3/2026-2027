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
import { AdminTopBar } from './components/AdminTopBar';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { OfflineIndicator } from './components/OfflineIndicator';
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
    products,
    filteredProducts,
    isLoadingProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedPlatform,
    isAdmin,
    setIsAdminOpen,
    setIsAdminLoginOpen,
    isProductModalOpen,
    setIsProductModalOpen,
    productToEdit,
    setProductToEdit,
    openAddProduct,
    dir,
    t,
    currentLanguage
  } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getFaqQ = (faq: any) => {
    if (currentLanguage === 'ar' && faq.q_ar) return faq.q_ar;
    if (currentLanguage === 'fr' && faq.q_fr) return faq.q_fr;
    return faq.q;
  };

  const getFaqA = (faq: any) => {
    if (currentLanguage === 'ar' && faq.a_ar) return faq.a_ar;
    if (currentLanguage === 'fr' && faq.a_fr) return faq.a_fr;
    return faq.a;
  };

  return (
    <div
      dir={dir}
      style={{ backgroundColor: 'var(--theme-bg, #090d16)', color: 'var(--theme-text, #f1f5f9)' }}
      className="min-h-screen flex flex-col font-sans relative w-full overflow-x-hidden transition-colors duration-300"
    >
      {/* Top Admin Quick Bar (when logged in as admin) */}
      <AdminTopBar />

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

          {/* Product Grid / Loading / Empty States */}
          {isLoadingProducts && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-slate-800/80" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                  </div>
                  <div className="h-9 bg-slate-800/70 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {products.length === 0
                  ? (isAdmin
                      ? (currentLanguage === 'ar' ? 'لوحة المالك: المتجر جاهز' : 'Espace Vendeur: Prêt')
                      : (currentLanguage === 'ar' ? 'مرحباً بكم في متجر BHSS Shop' : 'Bienvenue sur BHSS Shop'))
                  : t('catalog.noProducts')}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {products.length === 0
                  ? (isAdmin
                      ? (currentLanguage === 'ar'
                          ? 'يمكنك إدارة متجرك والمنتجات من لوحة تحكم المشرف.'
                          : 'Gérez votre boutique et vos offres depuis le panneau d’administration.')
                      : (currentLanguage === 'ar'
                          ? 'سيتم توفير عروض رقمية واشتراكات حصرية قريباً جداً.'
                          : 'De nouvelles offres et abonnements digitaux seront bientôt disponibles.'))
                  : t('catalog.noProductsDesc')}
              </p>
              
              {/* Reset filter button (available whenever products exist in catalog) */}
              {products.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPlatform('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mx-auto hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>
                    {currentLanguage === 'ar'
                      ? `عرض جميع المنتجات (${products.length})`
                      : `Afficher tous les produits (${products.length})`}
                  </span>
                </button>
              )}

              {/* If catalog is truly empty and user is admin, allow opening the Admin Dashboard */}
              {products.length === 0 && isAdmin && (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <span>{currentLanguage === 'ar' ? 'فتح لوحة التحكم (Admin Dashboard)' : 'Ouvrir le panneau admin'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* FAQ & Buyer Protection Accordion */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
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
                    <span>{getFaqQ(faq)}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 rtl:ml-0 rtl:mr-2 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {getFaqA(faq)}
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
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

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
