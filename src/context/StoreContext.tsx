import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  DigitalVaultItem,
  Currency,
  PaymentGateway,
  StoreSettings,
  AuthUser,
  AdminAccount,
  Language,
  LanguageCode,
  ColorMode
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CURRENCIES,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_SETTINGS
} from '../data/mockData';
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  TranslationKey
} from '../data/translations';
import { applyThemeToDocument } from '../data/themes';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PromoCodeResult {
  valid: boolean;
  code: string;
  discountPercentage: number;
  message: string;
}

interface StoreContextType {
  // Catalog
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  
  // Promo code
  activePromo: PromoCodeResult | null;
  applyPromoCode: (code: string) => PromoCodeResult;
  removePromoCode: () => void;
  cartDiscountAmount: number;
  cartTotal: number;

  // Currencies
  currentCurrency: Currency;
  setCurrencyCode: (code: 'USD' | 'EUR' | 'GBP' | 'MAD') => void;
  currencies: Currency[];
  formatPrice: (amountUSD: number) => string;
  convertPrice: (amountUSD: number) => number;

  // Languages & Localization
  currentLanguage: LanguageCode;
  currentLanguageObj: Language;
  setLanguageCode: (code: LanguageCode) => void;
  languages: Language[];
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';

  // Vault & Orders
  vaultItems: DigitalVaultItem[];
  myVaultItems: DigitalVaultItem[];
  allVaultItems: DigitalVaultItem[];
  orders: Order[];
  myOrders: Order[];
  allOrders: Order[];
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerOrderIds: string[];
  lookupAndRestoreCustomerOrders: (query: string) => { found: number; message: string };
  placeOrder: (details: {
    email: string;
    name?: string;
    discord?: string;
    paymentMethod: string;
    paymentTxId?: string;
    bankTransferRef?: string;
    bankName?: string;
    requiresVerification?: boolean;
  }) => Promise<Order>;
  approveOrderAndDispatchKeys: (orderId: string) => { success: boolean; message: string };
  rejectOrder: (orderId: string, reason?: string) => { success: boolean; message: string };
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Modals & Navigation
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductDetails: Product | null;
  setSelectedProductDetails: (product: Product | null) => void;
  isVaultOpen: boolean;
  setIsVaultOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isDbStatusOpen: boolean;
  setIsDbStatusOpen: (open: boolean) => void;
  isSuccessOpen: boolean;
  setIsSuccessOpen: (open: boolean) => void;

  // Admin & Settings & Auth
  currentUser: AuthUser | null;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  loginAsAdmin: (credentials: { email: string; passkey: string }) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  toggleAdmin: () => void;
  adminAccounts: AdminAccount[];
  addAdminAccount: (data: { email: string; name: string; passkey: string }) => { success: boolean; message: string };
  updateAdminPassword: (email: string, newPasskey: string) => { success: boolean; message: string };
  deleteAdminAccount: (id: string) => { success: boolean; message: string };
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  paymentGateways: PaymentGateway[];
  updatePaymentGateway: (id: string, updates: Partial<PaymentGateway>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaults: () => void;

  // Notifications
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial products from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('bhsshop_products', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync item counts with INITIAL_CATEGORIES
          return INITIAL_CATEGORIES;
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const sanitizeOrders = (ordersList: any[]): Order[] => {
    if (!Array.isArray(ordersList)) return [];
    return ordersList.filter((o) => {
      if (!o || typeof o !== 'object') return false;
      if (o.id === 'ord-bank-pending-1' || o.id === 'ord-completed-crypto-2') return false;
      if (o.orderNumber === 'BHS-934812' || o.orderNumber === 'BHS-820194') return false;
      if (o.customerEmail === 'yassine.gamer21@gmail.com') return false;
      return true;
    });
  };

  const sanitizeVault = (vaultList: any[]): DigitalVaultItem[] => {
    if (!Array.isArray(vaultList)) return [];
    return vaultList.filter((v) => {
      if (!v || typeof v !== 'object') return false;
      if (v.id === 'vlt-sample-1' || v.orderId === 'bhs-demo-init' || v.orderNumber === 'BHS-882910') return false;
      if (v.keyOrCredential === 'VK7JG-NPHTM-C97JM-9MPGT-3V66T') return false;
      return true;
    });
  };

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeOrders(parsed);
      }
      return [];
    } catch {
      return [];
    }
  });

  const [vaultItems, setVaultItems] = useState<DigitalVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_vault');
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeVault(parsed);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Track orders belonging specifically to THIS customer / device
  const [customerOrderIds, setCustomerOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_my_order_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter(
              (id) =>
                id !== 'BHS-934812' &&
                id !== 'BHS-820194' &&
                id !== 'ord-bank-pending-1' &&
                id !== 'ord-completed-crypto-2'
            )
          : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [customerEmail, setCustomerEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_customer_email');
      if (saved && saved !== 'yassine.gamer21@gmail.com') return saved;
      return '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_my_order_ids', JSON.stringify(customerOrderIds));
    } catch (e) {
      console.warn('Failed to save customer order IDs:', e);
    }
  }, [customerOrderIds]);

  useEffect(() => {
    try {
      if (customerEmail) {
        localStorage.setItem('bhsshop_customer_email', customerEmail);
      } else {
        localStorage.removeItem('bhsshop_customer_email');
      }
    } catch (e) {
      console.warn('Failed to save customer email:', e);
    }
  }, [customerEmail]);

  // Customer-scoped orders: ONLY orders made by this user/device or looked up with their email
  const myOrders = useMemo(() => {
    if (customerOrderIds.length === 0 && !customerEmail.trim()) {
      return [];
    }
    const emailLower = customerEmail.trim().toLowerCase();
    return orders.filter(
      (o) =>
        customerOrderIds.includes(o.id) ||
        customerOrderIds.includes(o.orderNumber) ||
        (emailLower && o.customerEmail?.trim().toLowerCase() === emailLower)
    );
  }, [orders, customerOrderIds, customerEmail]);

  // Customer-scoped vault items: ONLY keys belonging to this customer's orders
  const myVaultItems = useMemo(() => {
    if (myOrders.length === 0 && customerOrderIds.length === 0 && !customerEmail.trim()) {
      return [];
    }
    const myOrderNumbers = new Set([
      ...myOrders.map((o) => o.orderNumber),
      ...myOrders.map((o) => o.id),
      ...customerOrderIds
    ]);
    return vaultItems.filter(
      (item) =>
        myOrderNumbers.has(item.orderNumber) ||
        myOrderNumbers.has(item.orderId)
    );
  }, [vaultItems, myOrders, customerOrderIds, customerEmail]);

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          requireManualPaymentVerification: parsed.requireManualPaymentVerification ?? true,
          autoDeliveryEnabled: parsed.autoDeliveryEnabled ?? false
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_color_mode');
      if (saved === 'light' || saved === 'dark') return saved;
      return settings.colorMode || 'dark';
    } catch {
      return 'dark';
    }
  });

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    try {
      localStorage.setItem('bhsshop_color_mode', mode);
    } catch (e) {
      console.warn('Failed to save color mode:', e);
    }
    applyThemeToDocument(
      settings.activeTheme,
      settings.customPrimaryColor,
      settings.customAccentColor,
      settings.customTheme,
      mode
    );
    setSettings((prev) => ({ ...prev, colorMode: mode }));
  };

  const toggleColorMode = () => {
    const nextMode: ColorMode = colorMode === 'dark' ? 'light' : 'dark';
    setColorMode(nextMode);
  };

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_gateways');
      if (saved) {
        const parsed: PaymentGateway[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultMb = INITIAL_PAYMENT_GATEWAYS.find((g) => g.id === 'moroccan_bank');
          return parsed.map((gw) => {
            if (gw.type === 'moroccan_bank' || gw.id === 'moroccan_bank') {
              const hasBankAccounts = Array.isArray(gw.bankAccounts) && gw.bankAccounts.length > 0;
              const isOldFixedName = gw.name === 'CIH Bank / Virement Maroc (MAD)';
              return {
                ...gw,
                name: isOldFixedName ? 'Virement Bancaire Maroc (MAD)' : gw.name,
                bankAccounts: hasBankAccounts
                  ? gw.bankAccounts
                  : defaultMb?.bankAccounts || [
                      {
                        id: 'bank-cih-1',
                        bankName: gw.bankName || 'CIH Bank',
                        accountHolder: gw.accountHolder || 'BHSS SHOP DIGITAL',
                        ribNumber: gw.ribNumber || '230 780 00012345678901 23',
                        badge: 'Instantané CIH',
                        isDefault: true
                      },
                      {
                        id: 'bank-attijari-2',
                        bankName: 'Attijariwafa Bank',
                        accountHolder: gw.accountHolder || 'BHSS SHOP DIGITAL',
                        ribNumber: '007 780 00045612398711 55',
                        badge: 'Attijari Mobile',
                        isDefault: false
                      },
                      {
                        id: 'bank-bcp-3',
                        bankName: 'Banque Populaire (BCP)',
                        accountHolder: gw.accountHolder || 'BHSS SHOP DIGITAL',
                        ribNumber: '190 780 00088992211443 89',
                        badge: 'Chaabi Net',
                        isDefault: false
                      }
                    ]
              };
            }
            return gw;
          });
        }
      }
      return INITIAL_PAYMENT_GATEWAYS;
    } catch {
      return INITIAL_PAYMENT_GATEWAYS;
    }
  });

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const defaultAdmins: AdminAccount[] = [
      {
        id: 'admin-owner-01',
        email: 'bouhsousse.16@gmail.com',
        name: 'Bouhsousse (Store Owner)',
        passkey: 'admin123',
        role: 'admin',
        isOwner: true,
        createdAt: '2026-01-15'
      },
      {
        id: 'admin-staff-02',
        email: 'admin@bhsshop.com',
        name: 'BHSS Manager',
        passkey: 'bhsshop2026',
        role: 'admin',
        isOwner: false,
        createdAt: '2026-02-01'
      }
    ];
    try {
      const saved = localStorage.getItem('bhsshop_admin_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return defaultAdmins;
    } catch {
      return defaultAdmins;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_admin_accounts', JSON.stringify(adminAccounts));
    } catch (e) {
      console.warn('Failed to save admin accounts:', e);
    }
  }, [adminAccounts]);

  const [currentCurrencyCode, setCurrentCurrencyCode] = useState<'USD' | 'EUR' | 'GBP' | 'MAD'>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [activePromo, setActivePromo] = useState<PromoCodeResult | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpenState, setIsAdminOpenState] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isDbStatusOpen, setIsDbStatusOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Authenticated user state - customers are unauthenticated / null by default
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'admin') {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === 'admin';

  // Protected setter: non-admins cannot open the admin dashboard
  const setIsAdminOpen = (open: boolean) => {
    if (open) {
      if (!currentUser || currentUser.role !== 'admin') {
        setIsAdminOpenState(false);
        setIsAdminLoginOpen(true);
        return;
      }
    }
    setIsAdminOpenState(open);
  };

  // Route protection: monitors #admin, ?admin=true, /admin
  useEffect(() => {
    const handleRouteProtection = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const pathname = (window.location.pathname || '').toLowerCase();

      const isAdminRequested =
        hash === '#admin' ||
        hash.includes('admin') ||
        search.includes('admin=true') ||
        search.includes('view=admin') ||
        pathname === '/admin';

      if (isAdminRequested) {
        if (currentUser && currentUser.role === 'admin') {
          setIsAdminOpenState(true);
          setIsAdminLoginOpen(false);
        } else {
          // Block non-admin and present authentication gate
          setIsAdminOpenState(false);
          setIsAdminLoginOpen(true);
        }
      }
    };

    handleRouteProtection();
    window.addEventListener('hashchange', handleRouteProtection);
    window.addEventListener('popstate', handleRouteProtection);
    return () => {
      window.removeEventListener('hashchange', handleRouteProtection);
      window.removeEventListener('popstate', handleRouteProtection);
    };
  }, [currentUser]);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_vault', JSON.stringify(vaultItems));
    } catch (e) {
      console.warn('Failed to save vault:', e);
    }
  }, [vaultItems]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
    applyThemeToDocument(
      settings.activeTheme,
      settings.customPrimaryColor,
      settings.customAccentColor,
      settings.customTheme,
      colorMode
    );
  }, [settings, colorMode]);

  useEffect(() => {
    try {
      localStorage.setItem('bhsshop_gateways', JSON.stringify(paymentGateways));
    } catch (e) {
      console.warn('Failed to save gateways:', e);
    }
  }, [paymentGateways]);

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Language & Internationalization
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('bhsshop_language');
      if (saved && (saved === 'en' || saved === 'fr' || saved === 'ar')) {
        return saved as LanguageCode;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  const languages = SUPPORTED_LANGUAGES;
  const currentLanguageObj = languages.find((l) => l.code === currentLanguage) || languages[0];
  const dir = currentLanguageObj.dir;

  const setLanguageCode = (code: LanguageCode) => {
    setCurrentLanguage(code);
    try {
      localStorage.setItem('bhsshop_language', code);
    } catch (e) {
      console.warn('Failed to save language:', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = dir;
  }, [currentLanguage, dir]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    // @ts-ignore
    let text: string = langDict[key] || TRANSLATIONS.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return text;
  };

  // Currency conversion
  const currentCurrency = INITIAL_CURRENCIES.find((c) => c.code === currentCurrencyCode) || INITIAL_CURRENCIES[0];

  const convertPrice = (amountUSD: number): number => {
    return Number((amountUSD * currentCurrency.rate).toFixed(2));
  };

  const formatPrice = (amountUSD: number): string => {
    const converted = convertPrice(amountUSD);
    if (currentCurrency.code === 'MAD') {
      return `${converted.toFixed(2)} DH`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(2)}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title}" to cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Promo code
  const applyPromoCode = (code: string): PromoCodeResult => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'BHS10' || cleaned === 'FLASH10') {
      const result: PromoCodeResult = {
        valid: true,
        code: cleaned,
        discountPercentage: 10,
        message: '10% discount successfully applied!'
      };
      setActivePromo(result);
      showToast('10% discount applied!', 'success');
      return result;
    } else if (cleaned === 'BHSS20' || cleaned === 'VIP20') {
      const result: PromoCodeResult = {
        valid: true,
        code: cleaned,
        discountPercentage: 20,
        message: 'VIP 20% discount applied!'
      };
      setActivePromo(result);
      showToast('20% VIP discount applied!', 'success');
      return result;
    } else if (cleaned === 'WELCOME5') {
      const result: PromoCodeResult = {
        valid: true,
        code: cleaned,
        discountPercentage: 5,
        message: '5% welcome discount applied!'
      };
      setActivePromo(result);
      showToast('5% discount applied!', 'success');
      return result;
    } else {
      const result: PromoCodeResult = {
        valid: false,
        code: cleaned,
        discountPercentage: 0,
        message: 'Invalid promo code'
      };
      showToast('Invalid promo code. Try "BHS10" or "BHSS20"', 'error');
      return result;
    }
  };

  const removePromoCode = () => {
    setActivePromo(null);
    showToast('Promo code removed', 'info');
  };

  const cartDiscountAmount = activePromo ? (cartSubtotal * activePromo.discountPercentage) / 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmount);

  // Filtering & Sorting products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    // Platform filter
    if (selectedPlatform !== 'all' && product.platform !== selectedPlatform) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      const matchCategory = product.category.toLowerCase().includes(query);
      const matchTags = product.tags?.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchCategory && !matchTags) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') {
      const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    }
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Key generator helper for order fulfillment
  const generateRealisticKey = (product: Product): string => {
    if (product.sampleKeys && product.sampleKeys.length > 0) {
      const randomIndex = Math.floor(Math.random() * product.sampleKeys.length);
      return product.sampleKeys[randomIndex];
    }
    // Generate clean alphanumeric 5x5 key
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  };

  // Place Order & instant digital delivery fulfillment (with Bank Transfer verification safeguard)
  const placeOrder = async (details: {
    email: string;
    name?: string;
    discord?: string;
    paymentMethod: string;
    paymentTxId?: string;
    bankTransferRef?: string;
    bankName?: string;
    requiresVerification?: boolean;
  }): Promise<Order> => {
    const orderNumber = `BHS-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDate = new Date().toISOString().split('T')[0];
    const deliveredKeysList: DigitalVaultItem[] = [];
    const deliveredItemsSummary = [];

    // Fulfill each item in cart
    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        const keyGenerated = generateRealisticKey(item.product);
        const vaultItem: DigitalVaultItem = {
          id: `vlt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          orderId: orderNumber,
          orderNumber: orderNumber,
          datePurchased: orderDate,
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.image,
          category: item.product.category,
          platform: item.product.platform,
          deliveryType: item.product.deliveryType,
          keyOrCredential: keyGenerated,
          instructions: item.product.instructions || 'Follow product activation guide.',
          warranty: item.product.warranty || 'Lifetime Replacement Guarantee',
          status: 'active'
        };

        deliveredKeysList.push(vaultItem);
        deliveredItemsSummary.push({
          productId: item.product.id,
          productTitle: item.product.title,
          keyOrData: keyGenerated,
          deliveryType: item.product.deliveryType,
          instructions: item.product.instructions || 'Standard digital redemption guide.'
        });
      }
    }

    const isVerificationNeeded =
      details.requiresVerification ??
      (settings.requireManualPaymentVerification !== false ||
        !settings.autoDeliveryEnabled ||
        details.paymentMethod.toLowerCase().includes('bank') ||
        details.paymentMethod.toLowerCase().includes('cih') ||
        details.paymentMethod.toLowerCase().includes('virement'));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: orderDate,
      customerEmail: details.email,
      customerName: details.name || details.email.split('@')[0],
      customerDiscord: details.discord,
      items: [...cart],
      total: cartTotal,
      currency: currentCurrency.code,
      paymentMethod: details.paymentMethod,
      status: isVerificationNeeded ? 'pending' : 'completed',
      deliveredKeys: deliveredItemsSummary,
      paymentTxId: details.paymentTxId || `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      bankTransferRef: details.bankTransferRef,
      bankName: details.bankName,
      requiresVerification: isVerificationNeeded,
      vaultUnlocked: !isVerificationNeeded,
      discountApplied: activePromo
        ? {
            code: activePromo.code,
            percentage: activePromo.discountPercentage,
            amount: cartDiscountAmount
          }
        : undefined
    };

    // Save order to store
    setOrders((prev) => [newOrder, ...prev]);

    // Save to customer's personal device orders
    setCustomerOrderIds((prev) => Array.from(new Set([newOrder.orderNumber, newOrder.id, ...prev])));
    if (details.email) {
      setCustomerEmail(details.email);
    }

    // Save to user's digital vault ONLY if payment is already confirmed and doesn't require bank transfer check!
    if (!isVerificationNeeded) {
      setVaultItems((prev) => [...deliveredKeysList, ...prev]);
    }

    // Decrement stock for purchased items
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stockCount - cartMatch.quantity);
          return { ...prod, stockCount: newStock, inStock: newStock > 0 };
        }
        return prod;
      })
    );

    // Clear cart and promo
    clearCart();
    setActivePromo(null);

    // Set last completed order & trigger modal
    setLastCompletedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);

    if (isVerificationNeeded) {
      showToast(
        `Commande ${orderNumber} enregistrée ! En attente de confirmation de la réception du paiement.`,
        'info'
      );
    } else {
      showToast(`Order ${orderNumber} confirmed! Keys delivered to vault.`, 'success');
    }

    return newOrder;
  };

  // Admin approves bank transfer / manual order and immediately releases digital keys
  const approveOrderAndDispatchKeys = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!targetOrder) {
      showToast('Commande introuvable.', 'error');
      return { success: false, message: 'Order not found' };
    }

    if (targetOrder.status === 'completed' && targetOrder.vaultUnlocked) {
      showToast('Cette commande a déjà été validée et débloquée.', 'info');
      return { success: true, message: 'Already approved' };
    }

    // Generate vault items for customer
    const newVaultItems: DigitalVaultItem[] = targetOrder.deliveredKeys.map((k, idx) => ({
      id: `vlt-approved-${Date.now()}-${idx}`,
      orderId: targetOrder.orderNumber,
      orderNumber: targetOrder.orderNumber,
      datePurchased: targetOrder.date,
      productId: k.productId,
      productTitle: k.productTitle,
      productImage:
        targetOrder.items.find((i) => i.product.id === k.productId)?.product.image ||
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
      category: targetOrder.items.find((i) => i.product.id === k.productId)?.product.category || 'software',
      platform: targetOrder.items.find((i) => i.product.id === k.productId)?.product.platform || 'Multiplatform',
      deliveryType: k.deliveryType,
      keyOrCredential: k.keyOrData,
      instructions: k.instructions || 'Standard digital redemption guide.',
      warranty: 'Verified by BHSS Admin Guarantee',
      status: 'active'
    }));

    setVaultItems((prev) => [...newVaultItems, ...prev]);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? {
              ...o,
              status: 'completed',
              vaultUnlocked: true,
              verifiedAt: new Date().toISOString(),
              verifiedBy: currentUser?.email || 'admin'
            }
          : o
      )
    );

    showToast(`Commande ${targetOrder.orderNumber} validée ! Clés débloquées dans le Digital Vault.`, 'success');
    return { success: true, message: 'Order approved and keys released' };
  };

  // Admin rejects / refunds bank transfer order
  const rejectOrder = (orderId: string, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!targetOrder) {
      showToast('Commande introuvable.', 'error');
      return { success: false, message: 'Order not found' };
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? {
              ...o,
              status: 'refunded',
              verifiedAt: new Date().toISOString(),
              verifiedBy: currentUser?.email || 'admin'
            }
          : o
      )
    );

    // Restore inventory stock
    setProducts((prev) =>
      prev.map((prod) => {
        const match = targetOrder.items.find((i) => i.product.id === prod.id);
        if (match) {
          const restored = prod.stockCount + match.quantity;
          return { ...prod, stockCount: restored, inStock: restored > 0 };
        }
        return prod;
      })
    );

    showToast(`Commande ${targetOrder.orderNumber} annulée/rejetée. Stock rétabli.`, 'info');
    return { success: true, message: 'Order rejected and stock restored' };
  };

  // Customer order lookup & recovery
  const lookupAndRestoreCustomerOrders = (query: string): { found: number; message: string } => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      showToast('Please enter an email or order number.', 'error');
      return { found: 0, message: 'Empty query' };
    }

    const matched = orders.filter(
      (o) =>
        (o.customerEmail && o.customerEmail.toLowerCase() === clean) ||
        (o.orderNumber && o.orderNumber.toLowerCase() === clean) ||
        (o.id && o.id.toLowerCase() === clean)
    );

    if (matched.length > 0) {
      const orderNums = matched.map((o) => o.orderNumber);
      const orderIds = matched.map((o) => o.id);
      const primaryEmail = matched[0].customerEmail;

      setCustomerOrderIds((prev) => Array.from(new Set([...orderNums, ...orderIds, ...prev])));
      if (primaryEmail) setCustomerEmail(primaryEmail);

      showToast(
        `${matched.length} order(s) found! Keys loaded into your vault.`,
        'success'
      );
      return { found: matched.length, message: `Found ${matched.length} orders.` };
    } else {
      showToast(
        `No orders found matching "${query}". Please check your email or order number.`,
        'error'
      );
      return { found: 0, message: 'No orders found' };
    }
  };

  // Admin authentication and authorization actions
  const loginAsAdmin = async (credentials: {
    email: string;
    passkey: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanKey = credentials.passkey.trim();

    // Check against dynamically managed admin accounts or fallback to owner/manager
    const matchedAccount = adminAccounts.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanEmail || cleanEmail === 'admin') &&
        acc.passkey === cleanKey
    );

    if (!matchedAccount) {
      showToast('Authentication failed: Invalid admin email or passkey.', 'error');
      return { success: false, message: 'Invalid admin email address or passkey.' };
    }

    const adminUser: AuthUser = {
      id: matchedAccount.id,
      email: matchedAccount.email,
      name: matchedAccount.name,
      role: 'admin'
    };

    setCurrentUser(adminUser);
    localStorage.setItem('bhsshop_admin_session', JSON.stringify(adminUser));
    setIsAdminLoginOpen(false);
    setIsAdminOpenState(true);
    showToast(`Welcome back, ${matchedAccount.name}!`, 'success');
    return { success: true, message: 'Authenticated successfully.' };
  };

  const addAdminAccount = (data: { email: string; name: string; passkey: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return { success: false, message: 'Invalid email address.' };
    }
    if (!data.passkey || data.passkey.length < 4) {
      showToast('Password must be at least 4 characters.', 'error');
      return { success: false, message: 'Passkey too short (minimum 4 chars).' };
    }
    const exists = adminAccounts.some((a) => a.email.toLowerCase() === cleanEmail);
    if (exists) {
      showToast('An admin with this email already exists.', 'error');
      return { success: false, message: 'Admin account already exists.' };
    }

    const newAcc: AdminAccount = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      name: data.name.trim() || cleanEmail.split('@')[0],
      passkey: data.passkey.trim(),
      role: 'admin',
      isOwner: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdminAccounts((prev) => [...prev, newAcc]);
    showToast(`Admin account "${newAcc.name}" created successfully!`, 'success');
    return { success: true, message: 'Admin account created successfully!' };
  };

  const updateAdminPassword = (email: string, newPasskey: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanKey = newPasskey.trim();

    if (!cleanKey || cleanKey.length < 4) {
      showToast('Password must be at least 4 characters.', 'error');
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const found = adminAccounts.some((a) => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      showToast('Admin account not found.', 'error');
      return { success: false, message: 'Admin account not found.' };
    }

    setAdminAccounts((prev) =>
      prev.map((a) => (a.email.toLowerCase() === cleanEmail ? { ...a, passkey: cleanKey } : a))
    );
    showToast('Admin password updated successfully!', 'success');
    return { success: true, message: 'Password updated successfully!' };
  };

  const deleteAdminAccount = (id: string) => {
    const acc = adminAccounts.find((a) => a.id === id);
    if (!acc) return { success: false, message: 'Account not found.' };
    if (acc.isOwner || acc.email.toLowerCase() === 'bouhsousse.16@gmail.com') {
      showToast('Cannot delete primary store owner account.', 'error');
      return { success: false, message: 'Store owner account is protected.' };
    }

    setAdminAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast(`Removed admin "${acc.name}".`, 'info');
    return { success: true, message: 'Admin account removed.' };
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
    localStorage.removeItem('bhsshop_admin_session');
    setIsAdminOpenState(false);
    setIsAdminLoginOpen(false);
    if (window.location.hash.includes('admin') || window.location.search.includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    showToast('Logged out of Admin Mode', 'info');
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      logoutAdmin();
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to update settings', 'error');
      return;
    }
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated successfully', 'success');
  };

  const updatePaymentGateway = (id: string, updates: Partial<PaymentGateway>) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to update payment settings', 'error');
      return;
    }
    setPaymentGateways((prev) =>
      prev.map((gw) => (gw.id === id ? { ...gw, ...updates } : gw))
    );
    showToast('Payment gateway updated', 'success');
  };

  const addProduct = (newProduct: Omit<Product, 'id'>): Product => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to publish products', 'error');
      throw new Error('Unauthorized');
    }
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.title}" published!`, 'success');
    return created;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to update products', 'error');
      return;
    }
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to delete products', 'error');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from store', 'info');
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to add categories', 'error');
      return;
    }
    const newCat: Category = {
      ...cat,
      id: cat.slug || `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added`, 'success');
  };

  const deleteCategory = (id: string) => {
    if (!isAdmin) {
      showToast('Unauthorized: Admin role required to delete categories', 'error');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setSettings(INITIAL_SETTINGS);
    setPaymentGateways(INITIAL_PAYMENT_GATEWAYS);
    showToast('Store restored to default catalog state', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPlatform,
        setSelectedPlatform,
        sortBy,
        setSortBy,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,

        activePromo,
        applyPromoCode,
        removePromoCode,
        cartDiscountAmount,
        cartTotal,

        currentCurrency,
        setCurrencyCode: (code) => setCurrentCurrencyCode(code),
        currencies: INITIAL_CURRENCIES,
        formatPrice,
        convertPrice,

        currentLanguage,
        currentLanguageObj,
        setLanguageCode,
        languages,
        t,
        dir,

        vaultItems: myVaultItems,
        myVaultItems,
        allVaultItems: vaultItems,
        orders,
        myOrders,
        allOrders: orders,
        customerEmail,
        setCustomerEmail,
        customerOrderIds,
        lookupAndRestoreCustomerOrders,
        placeOrder,
        approveOrderAndDispatchKeys,
        rejectOrder,
        lastCompletedOrder,
        setLastCompletedOrder,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductDetails,
        setSelectedProductDetails,
        isVaultOpen,
        setIsVaultOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAdminOpen: isAdminOpenState,
        setIsAdminOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isDbStatusOpen,
        setIsDbStatusOpen,
        isSuccessOpen,
        setIsSuccessOpen,

        currentUser,
        isAdmin,
        setIsAdmin: (val: boolean) => {
          if (!val) logoutAdmin();
        },
        loginAsAdmin,
        logoutAdmin,
        toggleAdmin,
        adminAccounts,
        addAdminAccount,
        updateAdminPassword,
        deleteAdminAccount,
        settings,
        updateSettings,
        colorMode,
        setColorMode,
        toggleColorMode,
        paymentGateways,
        updatePaymentGateway,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        resetToDefaults,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
