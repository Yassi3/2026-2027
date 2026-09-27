import { Product, Category, PaymentGateway, Currency, StoreSettings } from '../types';

export const INITIAL_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound', flag: '🇬🇧' },
  { code: 'MAD', symbol: 'DH', rate: 10.05, name: 'Moroccan Dirham', flag: '🇲🇦' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products', slug: 'all', description: 'Browse our entire catalog of instant digital items', icon: 'Sparkles', itemCount: 0, isPopular: true },
  { id: 'gaming', name: 'Game Keys & Passes', slug: 'gaming', description: 'Official Steam, Xbox, PlayStation & EA activation codes', icon: 'Gamepad2', itemCount: 0, isPopular: true },
  { id: 'software', name: 'OS & Software', slug: 'software', description: 'Genuine retail licenses for Windows, Office, and creative suites', icon: 'Laptop', itemCount: 0, isPopular: true },
  { id: 'streaming', name: 'Streaming & Media', slug: 'streaming', description: 'Netflix, Spotify, YouTube & Disney+ memberships', icon: 'Tv', itemCount: 0, isPopular: true },
  { id: 'vpn', name: 'VPN & Security', slug: 'vpn', description: 'Encrypted ultra-fast VPNs and enterprise antivirus licenses', icon: 'ShieldCheck', itemCount: 0, isPopular: false },
  { id: 'ai-dev', name: 'AI & Developer Tools', slug: 'ai-dev', description: 'ChatGPT Plus, Copilot, Midjourney and cloud dev credits', icon: 'Cpu', itemCount: 0, isPopular: true },
  { id: 'giftcards', name: 'Digital Gift Cards', slug: 'giftcards', description: 'Instant balance cards for Steam, Apple, PlayStation & Amazon', icon: 'CreditCard', itemCount: 0, isPopular: false },
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'moroccan_bank',
    name: 'Virement Bancaire Maroc (MAD)',
    iconName: 'CreditCard',
    description: 'Virement bancaire direct au Maroc (CIH, Attijariwafa, Banque Populaire, etc.)',
    feePercentage: 0,
    badge: 'MAROC • SANS FRAIS',
    enabled: true,
    instructions: 'Effectuez le virement sur l\'un de nos comptes bancaires au Maroc. Les clés sont envoyées dès confirmation.',
    bankName: 'CIH Bank',
    accountHolder: 'BHSS SHOP DIGITAL',
    ribNumber: '230 780 00012345678901 23',
    bankAccounts: [
      {
        id: 'bank-cih-1',
        bankName: 'CIH Bank',
        accountHolder: 'BHSS SHOP DIGITAL',
        ribNumber: '230 780 00012345678901 23',
        badge: 'Instantané CIH',
        isDefault: true
      },
      {
        id: 'bank-attijari-2',
        bankName: 'Attijariwafa Bank',
        accountHolder: 'BHSS SHOP DIGITAL',
        ribNumber: '007 780 00045612398711 55',
        badge: 'Attijari Mobile',
        isDefault: false
      },
      {
        id: 'bank-bcp-3',
        bankName: 'Banque Populaire (BCP)',
        accountHolder: 'BHSS SHOP DIGITAL',
        ribNumber: '190 780 00088992211443 89',
        badge: 'Chaabi Net',
        isDefault: false
      }
    ],
    type: 'moroccan_bank'
  },
  {
    id: 'binance_pay',
    name: 'Binance Pay (Pay ID)',
    iconName: 'Wallet',
    description: 'Paiement direct sans frais de gas via l\'application mobile Binance',
    feePercentage: 0,
    badge: 'RAPIDE • 0% FRAIS',
    enabled: true,
    instructions: 'Ouvrez Binance App > Payez > Saisissez le Pay ID du marchand ou scannez le QR code.',
    binancePayId: '88492019',
    type: 'binance'
  },
  {
    id: 'crypto_usdt',
    name: 'USDT (Tether TRC20 / BEP20)',
    iconName: 'Coins',
    description: 'Instant zero-fee transfer via TRC20 or BEP20 with live QR code',
    feePercentage: 0,
    badge: '0% FEE',
    enabled: false,
    instructions: 'Envoyez le montant exact USDT à l\'adresse ci-dessous. Scannez le QR code ou collez l\'adresse sur Binance, TrustWallet ou MetaMask.',
    walletAddress: 'TYr3K9qV3b5Nx8Lp21WkBhsshopTron98',
    network: 'TRC20 (Tron Network)',
    type: 'crypto'
  },
  {
    id: 'paypal',
    name: 'PayPal (Direct & Sécurisé)',
    iconName: 'DollarSign',
    description: 'Payez avec votre solde PayPal ou carte bancaire avec protection acheteur',
    feePercentage: 2.9,
    badge: 'BUYER PROTECTION',
    enabled: true,
    instructions: 'Cliquez pour ouvrir la passerelle PayPal sécurisée pour régler la commande.',
    paypalEmailOrLink: 'bouhsousse.16@gmail.com',
    type: 'paypal'
  },
  {
    id: 'credit_card',
    name: 'Carte Bancaire (Visa / MasterCard)',
    iconName: 'CreditCard',
    description: 'Paiement sécurisé par carte avec cryptage 256-bit SSL & 3D Secure',
    feePercentage: 1.9,
    badge: '3D SECURE',
    enabled: true,
    instructions: 'Saisissez les coordonnées de votre carte pour un débit immédiat et sécurisé.',
    type: 'card'
  },
  {
    id: 'crypto_btc_eth',
    name: 'Bitcoin / Solana / Ethereum',
    iconName: 'Zap',
    description: 'Paiement direct en BTC, SOL ou ETH avec conversion en temps réel',
    feePercentage: 0,
    badge: 'ON-CHAIN',
    enabled: true,
    instructions: 'Scannez le QR code ou copiez l\'adresse pour envoyer la crypto sélectionnée.',
    walletAddress: 'bc1q9bhsshop883018kmd821094821',
    network: 'Bitcoin Native SegWit',
    type: 'crypto'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'BHSS Shop',
  announcementActive: true,
  announcementText: '🔥 FLASH SALE: Use coupon code "BHS10" at checkout for an instant 10% OFF all digital keys! ⚡ 100% Genuine Digital Licenses.',
  supportEmail: 'support@bhsshop.com',
  telegramHandle: '@BHSS_Support',
  discordInvite: 'discord.gg/bhsshop',
  autoDeliveryEnabled: false,
  requireManualPaymentVerification: true,
  maintenanceMode: false,
  activeTheme: 'cyber-indigo'
};

export const STORE_STATS = [
  { label: 'Happy Customers', value: '48,000+', icon: 'Users' },
  { label: 'Keys Delivered', value: '120,000+', icon: 'Zap' },
  { label: 'Avg Delivery Speed', value: '4.8 Seconds', icon: 'Clock' },
  { label: 'TrustScore Rating', value: '4.9 / 5.0', icon: 'ShieldCheck' }
];

export interface StoreFaqItem {
  q: string;
  a: string;
  q_ar?: string;
  a_ar?: string;
  q_fr?: string;
  a_fr?: string;
}

export const STORE_FAQS: StoreFaqItem[] = [
  {
    q: 'How does digital key delivery work?',
    a: 'All product keys and licenses are delivered directly to your screen and saved permanently in your personal Digital Vault. You also receive full activation instructions immediately.',
    q_ar: 'كيف تتم عملية تسليم المفاتيح الرقمية والتراخيص؟',
    a_ar: 'بمجرد تأكيد طلبك، تظهر المفاتيح الرقمية وبيانات التفعيل فوراً على شاشتك وتُحفظ بشكل دائم في "خزنتك الرقمية (Digital Vault)" الخاصة بك لتتمكن من الوصول إليها في أي وقت.',
    q_fr: 'Comment fonctionne la livraison des clés numériques ?',
    a_fr: 'Dès confirmation de la commande, vos clés et instructions d’activation s’affichent instantanément à l’écran et sont conservées en toute sécurité dans votre Digital Vault.'
  },
  {
    q: 'How do I pay using Moroccan Bank Transfer (CIH, Attijariwafa, BCP, Cash Plus)?',
    a: 'Select "Virement Bancaire Maroc" at checkout. Make a standard bank transfer or mobile app transfer to our RIB number. Enter your transfer reference, and our team confirms and unlocks your keys within minutes.',
    q_ar: 'كيف أقوم بالدفع عبر التحويل البنكي المغربي (CIH، التجاري، الشعبي، كاش بلوس)؟',
    a_ar: 'اختر "تحويل بنكي مغربي" عند إتمام الطلب، ثم قم بالتحويل من تطبيق بنكك (CIH Mobile، Attijari Mobile، Chaabi Net أو Cash Plus) إلى رقم الحساب (RIB). بعد إدخال اسمك أو رقم العملية يتم تفعيل وتسليم المفاتيح مباشرة.',
    q_fr: 'Comment payer par virement bancaire marocain (CIH, Attijari, BCP, Cash Plus) ?',
    a_fr: 'Sélectionnez "Virement Bancaire Maroc" lors du paiement. Effectuez le virement sur notre RIB depuis votre application bancaire. Dès saisie de la référence, vos clés sont débloquées.'
  },
  {
    q: 'Are the product keys genuine and backed by warranty?',
    a: 'Yes, 100%. All keys and software licenses are genuine retail codes obtained from official channels, covered by an instant replacement or refund warranty if any issue arises.',
    q_ar: 'هل المفاتيح والتراخيص أصلية ومضمونة؟',
    a_ar: 'نعم 100%، جميع التراخيص والمفاتيح أصلية ورسمية، ومرفوقة بضمان تشغيل كامل ودعم فني لاستبدال أي مفتاح فوراً في حال مواجهة أي صعوبة.',
    q_fr: 'Les licences et clés sont-elles officielles et garanties ?',
    a_fr: 'Oui, à 100%. Toutes nos licences proviennent de canaux officiels et bénéficient d’une garantie complète de fonctionnement et de remplacement immédiat.'
  },
  {
    q: 'What other payment methods are supported?',
    a: 'We accept Moroccan Bank Transfers (CIH, Attijariwafa, BCP), Binance Pay (0% fees), Visa, MasterCard, PayPal, and major cryptocurrencies (USDT, BTC, SOL).',
    q_ar: 'ما هي طرق الدفع الأخرى المتوفرة بالمتجر؟',
    a_ar: 'ندعم التحويل البنكي المغربي المباشر، بينانس باي (Binance Pay) بدون أي رسوم، البطاقات البنكية الدولية (Visa/Mastercard)، وبايبال (PayPal).'
  }
];
