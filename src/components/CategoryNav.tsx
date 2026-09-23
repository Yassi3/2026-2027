import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Gamepad2,
  Laptop,
  Tv,
  ShieldCheck,
  Cpu,
  CreditCard,
  ArrowUpDown,
  Layers
} from 'lucide-react';

export const CategoryNav: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    sortBy,
    setSortBy,
    filteredProducts,
    t,
    currentLanguage
  } = useStore();

  const getCategoryName = (cat: { id: string; name: string }) => {
    if (cat.id === 'all') return t('catalog.allProducts');
    if (currentLanguage === 'ar') {
      const arMap: Record<string, string> = {
        'operating-systems': 'أنظمة التشغيل',
        'antivirus-security': 'الحماية ومكافحة الفيروسات',
        'gaming-keys': 'ألعاب ومفاتيح ستيم',
        'ai-subscriptions': 'الذكاء الاصطناعي',
        'vpn-privacy': 'شبكات VPN والخصوصية',
        'entertainment': 'الترفيه والاشتراكات',
        'office-productivity': 'برامج الأوفيس',
        'developer-tools': 'أدوات المطورين',
        'design-creative': 'التصميم والمونتاج'
      };
      return arMap[cat.id] || cat.name;
    }
    if (currentLanguage === 'fr') {
      const frMap: Record<string, string> = {
        'operating-systems': "Systèmes d'Exploitation",
        'antivirus-security': 'Antivirus & Sécurité',
        'gaming-keys': 'Jeux & Clés Steam',
        'ai-subscriptions': 'IA & Productivité',
        'vpn-privacy': 'VPN & Confidentialité',
        'entertainment': 'Divertissement & Streaming',
        'office-productivity': 'Bureautique & Office',
        'developer-tools': 'Outils Développeur',
        'design-creative': 'Création & Graphisme'
      };
      return frMap[cat.id] || cat.name;
    }
    return cat.name;
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const platforms = [
    { id: 'all', label: t('catalog.allPlatforms') },
    { id: 'Steam', label: 'Steam' },
    { id: 'Windows', label: 'Windows' },
    { id: 'Xbox', label: 'Xbox' },
    { id: 'Multiplatform', label: 'Multi-Device' },
    { id: 'Web/Cloud', label: 'Cloud / Web' }
  ];

  return (
    <div id="catalog-section" className="pt-6 pb-4 space-y-4">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-cyan-400'}>
                {getCategoryIcon(category.icon)}
              </span>
              <span>{getCategoryName(category)}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Platform Chips + Sort By + Item Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        {/* Platform selection */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 rtl:mr-0 rtl:ml-1">
            <Layers className="w-3.5 h-3.5" />
            {t('catalog.platform')}
          </span>
          {platforms.map((plat) => {
            const isSelected = selectedPlatform === plat.id;
            return (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {plat.label}
              </button>
            );
          })}
        </div>

        {/* Right side: Count & Sort selection */}
        <div className="flex items-center gap-3 ml-auto rtl:ml-0 rtl:mr-auto">
          <span className="text-xs text-slate-400 font-medium">
            {t('catalog.showing')} <strong className="text-white">{filteredProducts.length}</strong> {t('catalog.products')}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-slate-900 text-slate-200">{t('catalog.sort.featured')}</option>
              <option value="price_asc" className="bg-slate-900 text-slate-200">{t('catalog.sort.priceAsc')}</option>
              <option value="price_desc" className="bg-slate-900 text-slate-200">{t('catalog.sort.priceDesc')}</option>
              <option value="rating" className="bg-slate-900 text-slate-200">{t('catalog.sort.rating')}</option>
              <option value="newest" className="bg-slate-900 text-slate-200">{t('catalog.sort.newest')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
