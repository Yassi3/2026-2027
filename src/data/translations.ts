import { Language, LanguageCode } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇲🇦',
    dir: 'rtl'
  }
];

export const TRANSLATIONS = {
  en: {
    // Navigation & Header
    'nav.searchPlaceholder': 'Search Windows keys, Steam games, ChatGPT, VPNs...',
    'nav.searchPlaceholderMobile': 'Search game keys, licenses, subscriptions...',
    'nav.myVault': 'My Vault',
    'nav.cart': 'Cart',
    'nav.account': 'Account & Orders',
    'nav.selectCurrency': 'Select Currency',
    'nav.selectLanguage': 'Select Language',
    'nav.language': 'Language',
    'nav.latency': '18ms (Online)',
    'nav.adminCenter': 'Admin Control Center',

    // Hero Section
    'hero.badge': 'OFFICIAL DIGITAL LICENSES & KEYS',
    'hero.titlePrefix': 'Instant Digital Key Vault &',
    'hero.titleHighlight': 'Software Licenses',
    'hero.subtitle':
      'Genuine retail game keys, Windows & Office licenses, AI subscriptions, and premium VPNs delivered directly to your personal Digital Vault with instant warranty.',
    'hero.feature1': '100% Genuine Retail Keys',
    'hero.feature2': 'Direct Delivery to Vault',
    'hero.feature3': 'CIH Bank & Crypto Support',
    'hero.exploreBtn': 'Explore Catalog',
    'hero.openVaultBtn': 'Open My Vault',
    'hero.trustBadge': 'Moroccan Bank Transfer (CIH) • Crypto USDT • Fast 24/7 Human Support',

    // Category & Filter Bar
    'catalog.allProducts': 'All Products',
    'catalog.platform': 'Platform:',
    'catalog.allPlatforms': 'All Platforms',
    'catalog.sortBy': 'Sort By:',
    'catalog.sort.featured': 'Featured First',
    'catalog.sort.priceAsc': 'Price: Low to High',
    'catalog.sort.priceDesc': 'Price: High to Low',
    'catalog.sort.rating': 'Highest Rated',
    'catalog.sort.newest': 'Newest Arrivals',
    'catalog.showing': 'Showing',
    'catalog.products': 'products',
    'catalog.noProducts': 'No products found',
    'catalog.noProductsDesc': "We couldn't find any digital keys matching your filters or search query.",
    'catalog.resetFilters': 'Reset All Filters',
    'catalog.inStockBadge': 'In Stock',

    // Product Card
    'product.instantDelivery': 'Instant Delivery',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Sold Out',
    'product.addToCart': 'Add to Cart',
    'product.added': 'Added to Cart',
    'product.buyNow': 'Buy Now',
    'product.warranty': 'Warranty',
    'product.reviews': 'reviews',
    'product.viewDetails': 'View Details',

    // Product Details Modal
    'details.instantDigitalKey': 'Instant Digital Key',
    'details.platform': 'Platform',
    'details.category': 'Category',
    'details.delivery': 'Delivery',
    'details.warrantyAndSupport': 'Warranty & Support',
    'details.keyHighlights': 'Key Highlights & Features',
    'details.activationGuide': 'Redemption & Activation Guide',
    'details.systemRequirements': 'System Requirements',
    'details.os': 'OS',
    'details.processor': 'Processor',
    'details.memory': 'Memory',
    'details.graphics': 'Graphics',
    'details.storage': 'Storage',
    'details.close': 'Close',

    // Cart Drawer
    'cart.title': 'Your Cart',
    'cart.items': 'items',
    'cart.emptyTitle': 'Your cart is empty',
    'cart.emptySubtitle': 'Explore our collection of authentic software licenses, game keys, and subscriptions.',
    'cart.promoPrompt': 'Have a promo code?',
    'cart.promoPlaceholder': 'Enter code (e.g. BHSS10)',
    'cart.apply': 'Apply',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Promo Discount',
    'cart.total': 'Estimated Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.secureCheckoutNotice': 'Encrypted 256-bit checkout • Instant key reservation',

    // Checkout Modal
    'checkout.title': 'Secure Checkout',
    'checkout.subtitle': 'Enter your delivery details and choose your preferred payment method.',
    'checkout.emailLabel': 'Delivery Email Address',
    'checkout.emailPlaceholder': 'you@example.com (Keys dispatched here)',
    'checkout.discordLabel': 'Discord Handle / WhatsApp (Optional)',
    'checkout.discordPlaceholder': 'For instant direct VIP customer assistance',
    'checkout.paymentMethod': 'Select Payment Method',
    'checkout.bankTransferInfo': 'Moroccan Bank Transfer (CIH Bank)',
    'checkout.bankAccountHolder': 'Account Holder',
    'checkout.ribNumber': 'RIB Number',
    'checkout.transferMotif': 'Transfer Reference / Motif',
    'checkout.txidLabel': 'Transaction Hash / Sender Name / Payment Proof',
    'checkout.submitBank': 'Confirm Bank Transfer & Reserve Keys',
    'checkout.submitStandard': 'Confirm Order & Send for Verification',
    'checkout.processing': 'Processing Order...',
    'checkout.trustNotice': 'Safe & Verified: Payment is manually reviewed by store management before keys are unlocked in your vault.',

    // Digital Vault
    'vault.title': 'My Digital Key Vault',
    'vault.subtitle': 'Encrypted permanent storage for all your purchased activation licenses.',
    'vault.activeCount': 'active keys',
    'vault.searchPlaceholder': 'Search keys, titles, or order numbers...',
    'vault.exportBtn': 'Export Backup (.txt)',
    'vault.noKeys': 'No keys found in vault',
    'vault.noKeysDesc': 'Any digital license or game key you purchase will be permanently stored here.',
    'vault.instructions': 'Activation Instructions',
    'vault.copyKey': 'Copy Key',
    'vault.copied': 'Copied!',
    'vault.pendingNotice': 'order(s) awaiting payment verification: Keys will unlock in your vault once payment is confirmed.',

    // User Account & Orders
    'account.title': 'My Orders & Digital Keys',
    'account.subtitle': 'Track your order history, payment status, and access purchased keys.',
    'account.totalOrders': 'Total Orders',
    'account.delivered': 'Delivered',
    'account.pending': 'Pending Review',
    'account.noOrders': 'No orders yet',
    'account.orderNumber': 'Order #',
    'account.date': 'Date',
    'account.status': 'Status',
    'account.total': 'Total',

    // FAQ Section
    'faq.badge': 'Questions & Answers',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about our automated keys and buyer protection warranty.',

    // Stats Bar
    'stats.keysDelivered': 'Keys Delivered',
    'stats.satisfaction': 'Customer Satisfaction',
    'stats.avgDelivery': 'Avg. Delivery Speed',
    'stats.genuineGuaranteed': 'Genuine & Authentic',

    // Footer
    'footer.aboutTitle': 'About BHSS Shop',
    'footer.aboutText':
      'Premier digital marketplace for verified retail software licenses, genuine operating systems, game activation keys, and premium subscriptions with localized Moroccan and international payment support.',
    'footer.brandDesc':
      'BHSS Shop is the premier digital goods marketplace providing gamers, creators, and developers with instant, verified license keys, cloud software, and streaming access worldwide.',
    'footer.instantDelivery': 'Instant Automated Delivery',
    'footer.instantDeliveryDesc':
      'Our automated cluster dispatches licenses in under 5 seconds directly to your screen and vault.',
    'footer.genuine': '100% Genuine Retail Guarantee',
    'footer.genuineDesc':
      'Every software license, game code, and account is sourced via authorized channels with replacement warranty.',
    'footer.support': '24/7 Human & Automated Support',
    'footer.supportDesc':
      'Dedicated support team standing by around the clock on Telegram and Discord.',
    'footer.copyright': '© {year} BHSS Shop. All rights reserved. Registered trademark.',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.refund': 'Refund Guarantee',
    'footer.quickLinks': 'Quick Navigation',
    'footer.paymentsAccepted': 'Supported Payments',
    'footer.allRightsReserved': 'All Rights Reserved.',
    'footer.safeFulfillment': 'Safe, legal, and guaranteed digital fulfillment.',

    // Common
    'common.close': 'Close',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.verified': 'Verified'
  },
  fr: {
    // Navigation & Header
    'nav.searchPlaceholder': 'Rechercher clés Windows, jeux Steam, ChatGPT, VPNs...',
    'nav.searchPlaceholderMobile': 'Rechercher clés, licences, abonnements...',
    'nav.myVault': 'Mon Vault',
    'nav.cart': 'Panier',
    'nav.account': 'Compte & Commandes',
    'nav.selectCurrency': 'Choisir la Devise',
    'nav.selectLanguage': 'Choisir la Langue',
    'nav.language': 'Langue',
    'nav.latency': '18ms (En Ligne)',
    'nav.adminCenter': 'Panneau Administration',

    // Hero Section
    'hero.badge': 'LICENCES & CLÉS NUMÉRIQUES OFFICIELLES',
    'hero.titlePrefix': 'Boutique Officielle de Clés &',
    'hero.titleHighlight': 'Licences Numériques',
    'hero.subtitle':
      'Clés de jeux authentiques, licences Windows & Office certifiées, abonnements IA et VPNs premium délivrés directement dans votre Digital Vault personnel avec garantie.',
    'hero.feature1': '100% Clés Retail Authentiques',
    'hero.feature2': 'Livraison Directe dans le Vault',
    'hero.feature3': 'Support CIH Bank & Cryptos',
    'hero.exploreBtn': 'Explorer le Catalogue',
    'hero.openVaultBtn': 'Ouvrir Mon Vault',
    'hero.trustBadge': 'Virement CIH Bank Maroc • Crypto USDT • Support Humain Réactif 24/7',

    // Category & Filter Bar
    'catalog.allProducts': 'Tous les Produits',
    'catalog.platform': 'Plateforme :',
    'catalog.allPlatforms': 'Toutes Plateformes',
    'catalog.sortBy': 'Trier par :',
    'catalog.sort.featured': 'En Vedette',
    'catalog.sort.priceAsc': 'Prix : Croissant',
    'catalog.sort.priceDesc': 'Prix : Décroissant',
    'catalog.sort.rating': 'Mieux Notés',
    'catalog.sort.newest': 'Nouveautés',
    'catalog.showing': 'Affichage de',
    'catalog.products': 'produits',
    'catalog.noProducts': 'Aucun produit trouvé',
    'catalog.noProductsDesc': 'Aucune clé numérique ne correspond à vos filtres ou à votre recherche.',
    'catalog.resetFilters': 'Réinitialiser les Filtres',
    'catalog.inStockBadge': 'En Stock',

    // Product Card
    'product.instantDelivery': 'Livraison Immédiate',
    'product.inStock': 'En Stock',
    'product.outOfStock': 'Épuisé',
    'product.addToCart': 'Ajouter au Panier',
    'product.added': 'Ajouté au Panier',
    'product.buyNow': 'Acheter Maintenant',
    'product.warranty': 'Garantie',
    'product.reviews': 'avis',
    'product.viewDetails': 'Voir Détails',

    // Product Details Modal
    'details.instantDigitalKey': 'Clé Numérique Immédiate',
    'details.platform': 'Plateforme',
    'details.category': 'Catégorie',
    'details.delivery': 'Livraison',
    'details.warrantyAndSupport': 'Garantie & Support',
    'details.keyHighlights': 'Points Forts & Caractéristiques',
    'details.activationGuide': "Guide d'Activation & Utilisation",
    'details.systemRequirements': 'Configuration Requise',
    'details.os': 'Système',
    'details.processor': 'Processeur',
    'details.memory': 'Mémoire RAM',
    'details.graphics': 'Carte Graphique',
    'details.storage': 'Stockage',
    'details.close': 'Fermer',

    // Cart Drawer
    'cart.title': 'Votre Panier',
    'cart.items': 'articles',
    'cart.emptyTitle': 'Votre panier est vide',
    'cart.emptySubtitle': 'Découvrez notre collection de licences certifiées, jeux vidéo et abonnements premium.',
    'cart.promoPrompt': 'Vous avez un code promo ?',
    'cart.promoPlaceholder': 'Entrez le code (ex: BHSS10)',
    'cart.apply': 'Appliquer',
    'cart.subtotal': 'Sous-total',
    'cart.discount': 'Remise Promo',
    'cart.total': 'Total Estimé',
    'cart.checkout': 'Passer à la Caisse',
    'cart.continueShopping': 'Continuer les Achats',
    'cart.secureCheckoutNotice': 'Paiement chiffré 256-bit • Réservation immédiate des clés',

    // Checkout Modal
    'checkout.title': 'Commande Sécurisée',
    'checkout.subtitle': 'Indiquez votre email de réception et choisissez votre mode de paiement.',
    'checkout.emailLabel': 'Adresse Email de Réception',
    'checkout.emailPlaceholder': 'vous@exemple.com (Les clés y seront envoyées)',
    'checkout.discordLabel': 'Pseudo Discord / WhatsApp (Optionnel)',
    'checkout.discordPlaceholder': 'Pour un suivi et support VIP direct',
    'checkout.paymentMethod': 'Sélectionnez le Mode de Paiement',
    'checkout.bankTransferInfo': 'Virement Bancaire (CIH Bank Maroc)',
    'checkout.bankAccountHolder': 'Titulaire du Compte',
    'checkout.ribNumber': 'Numéro RIB',
    'checkout.transferMotif': 'Référence / Motif du Virement',
    'checkout.txidLabel': 'Hash de transaction / Nom expéditeur / Preuve',
    'checkout.submitBank': 'Confirmer le Virement & Réserver les Clés',
    'checkout.submitStandard': 'Confirmer la Commande & Envoyer',
    'checkout.processing': 'Traitement de la commande en cours...',
    'checkout.trustNotice': "Paiement sécurisé et contrôlé manuellement par l'administration avant déblocage dans votre Vault.",

    // Digital Vault
    'vault.title': 'Mon Digital Vault',
    'vault.subtitle': 'Coffre-fort chiffré et permanent pour toutes vos licences et clés d’activation.',
    'vault.activeCount': 'clés actives',
    'vault.searchPlaceholder': 'Rechercher clés, titres ou commandes...',
    'vault.exportBtn': 'Exporter Sauvegarde (.txt)',
    'vault.noKeys': 'Aucune clé dans votre Vault',
    'vault.noKeysDesc': 'Toutes les licences numériques achetées sont stockées ici de manière permanente.',
    'vault.instructions': "Instructions d'Activation",
    'vault.copyKey': 'Copier la Clé',
    'vault.copied': 'Copié !',
    'vault.pendingNotice': 'commande(s) en attente de vérification : Les clés seront débloquées dès validation du paiement.',

    // User Account & Orders
    'account.title': 'Mes Commandes & Clés',
    'account.subtitle': 'Consultez votre historique de commandes, statut de paiement et licences.',
    'account.totalOrders': 'Total Commandes',
    'account.delivered': 'Livrées',
    'account.pending': 'En Attente',
    'account.noOrders': 'Aucune commande pour le moment',
    'account.orderNumber': 'Commande n°',
    'account.date': 'Date',
    'account.status': 'Statut',
    'account.total': 'Total',

    // FAQ Section
    'faq.badge': 'Questions & Réponses',
    'faq.title': 'Foire Aux Questions',
    'faq.subtitle': 'Tout ce que vous devez savoir sur nos clés automatiques et notre garantie acheteur.',

    // Stats Bar
    'stats.keysDelivered': 'Clés Livrées',
    'stats.satisfaction': 'Satisfaction Client',
    'stats.avgDelivery': 'Délai Moyen',
    'stats.genuineGuaranteed': 'Authentique & Garanti',

    // Footer
    'footer.aboutTitle': 'À Propos de BHSS Shop',
    'footer.aboutText':
      'Place de marché numérique de référence pour les licences logicielles certifiées, systèmes d’exploitation, clés de jeux vidéo et abonnements premium avec support bancaire marocain et international.',
    'footer.brandDesc':
      'BHSS Shop est le premier marché de produits numériques fournissant aux joueurs, créateurs et développeurs des clés de licence instantanées et vérifiées dans le monde entier.',
    'footer.instantDelivery': 'Livraison Automatisée Instantanée',
    'footer.instantDeliveryDesc':
      'Notre système automatisé distribue les licences en moins de 5 secondes directement sur votre écran et dans votre vault.',
    'footer.genuine': 'Garantie Logiciels 100% Officiels',
    'footer.genuineDesc':
      'Chaque licence logicielle, clé de jeu et compte provient de canaux agréés avec garantie de remplacement immédiat.',
    'footer.support': 'Support 24/7 Humain & Automatisé',
    'footer.supportDesc':
      'Une équipe d’assistance dédiée disponible 24h/24 et 7j/7 sur Telegram et Discord.',
    'footer.copyright': '© {year} BHSS Shop. Tous droits réservés. Marque déposée.',
    'footer.terms': "Conditions d'Utilisation",
    'footer.privacy': 'Politique de Confidentialité',
    'footer.refund': 'Garantie de Remboursement',
    'footer.quickLinks': 'Navigation Rapide',
    'footer.paymentsAccepted': 'Paiements Acceptés',
    'footer.allRightsReserved': 'Tous Droits Réservés.',
    'footer.safeFulfillment': 'Livraison numérique sécurisée, légale et garantie.',

    // Common
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.loading': 'Chargement...',
    'common.verified': 'Vérifié'
  },
  ar: {
    // Navigation & Header
    'nav.searchPlaceholder': 'ابحث عن مفاتيح ويندوز، ألعاب ستيم، شات جي بي تي، VPN...',
    'nav.searchPlaceholderMobile': 'ابحث عن المفاتيح والتراخيص والاشتراكات...',
    'nav.myVault': 'خزنتي الرقمية',
    'nav.cart': 'السلة',
    'nav.account': 'حسابي وطلباتي',
    'nav.selectCurrency': 'اختر العملة',
    'nav.selectLanguage': 'اختر اللغة',
    'nav.language': 'اللغة',
    'nav.latency': '18 مللي ثانية (متصل)',
    'nav.adminCenter': 'لوحة تحكم الإدارة',

    // Hero Section
    'hero.badge': 'تراخيص ومفاتيح رقمية رسمية ومضمونة',
    'hero.titlePrefix': 'المتجر الرقمي المعتمد للمفاتيح و',
    'hero.titleHighlight': 'التراخيص الأصلية',
    'hero.subtitle':
      'مفاتيح ألعاب أصلية، تراخيص ويندوز وأوفيس معتمدة، اشتراكات الذكاء الاصطناعي وخدمات VPN تُسلّم فوراً في خزنتك الرقمية مع ضمان كامل.',
    'hero.feature1': 'مفاتيح ريتيل أصلية 100%',
    'hero.feature2': 'تسليم مباشر للخزنة الرقمية',
    'hero.feature3': 'دعم بنك CIH والعملات المشفرة',
    'hero.exploreBtn': 'تصفح الكتالوج',
    'hero.openVaultBtn': 'فتح خزنتي الرقمية',
    'hero.trustBadge': 'تحويل بنكي مغربي (CIH Bank) • كريبتو USDT • دعم فني مباشر وسريع',

    // Category & Filter Bar
    'catalog.allProducts': 'جميع المنتجات',
    'catalog.platform': 'المنصة:',
    'catalog.allPlatforms': 'كل المنصات',
    'catalog.sortBy': 'الترتيب حسب:',
    'catalog.sort.featured': 'المميزة أولاً',
    'catalog.sort.priceAsc': 'السعر: من الأقل للأعلى',
    'catalog.sort.priceDesc': 'السعر: من الأعلى للأقل',
    'catalog.sort.rating': 'الأعلى تقييماً',
    'catalog.sort.newest': 'الأحدث وصولاً',
    'catalog.showing': 'عرض',
    'catalog.products': 'منتجات',
    'catalog.noProducts': 'لم يتم العثور على منتجات',
    'catalog.noProductsDesc': 'لم نتمكن من العثور على أي مفاتيح رقمية مطابقة لبحثك أو الفلاتر المختارة.',
    'catalog.resetFilters': 'إعادة ضبط كل الفلاتر',
    'catalog.inStockBadge': 'متوفر',

    // Product Card
    'product.instantDelivery': 'تسليم رقمي فوري',
    'product.inStock': 'متوفر بالمخزون',
    'product.outOfStock': 'نفد المخزون',
    'product.addToCart': 'إضافة إلى السلة',
    'product.added': 'تمت الإضافة للسلة',
    'product.buyNow': 'شراء الآن',
    'product.warranty': 'الضمان',
    'product.reviews': 'تقييم',
    'product.viewDetails': 'تفاصيل المنتج',

    // Product Details Modal
    'details.instantDigitalKey': 'مفتاح رقمي أصلي',
    'details.platform': 'المنصة',
    'details.category': 'التصنيف',
    'details.delivery': 'نوع التسليم',
    'details.warrantyAndSupport': 'الضمان والدعم الفني',
    'details.keyHighlights': 'المميزات وأبرز النقاط',
    'details.activationGuide': 'طريقة التفعيل والاستخدام',
    'details.systemRequirements': 'متطلبات التشغيل',
    'details.os': 'نظام التشغيل',
    'details.processor': 'المعالج',
    'details.memory': 'الذاكرة العشوائية (RAM)',
    'details.graphics': 'كرت الشاشة',
    'details.storage': 'مساحة التخزين',
    'details.close': 'إغلاق',

    // Cart Drawer
    'cart.title': 'سلة المشتريات',
    'cart.items': 'عناصر',
    'cart.emptyTitle': 'سلة المشتريات فارغة',
    'cart.emptySubtitle': 'استكشف تشكيلتنا الواسعة من التراخيص البرمجية ومفاتيح الألعاب والاشتراكات.',
    'cart.promoPrompt': 'هل لديك كود خصم؟',
    'cart.promoPlaceholder': 'أدخل الكود (مثال: BHSS10)',
    'cart.apply': 'تطبيق',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.discount': 'خصم الكود',
    'cart.total': 'المجموع الكلي',
    'cart.checkout': 'متابعة الدفع وإنهاء الطلب',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.secureCheckoutNotice': 'دفع آمن ومشفر 256-bit • حجز فوري للمفاتيح',

    // Checkout Modal
    'checkout.title': 'إتمام الطلب بأمان',
    'checkout.subtitle': 'أدخل معلومات الاستلام واختر وسيلة الدفع المناسبة لك.',
    'checkout.emailLabel': 'البريد الإلكتروني لاستلام المفاتيح',
    'checkout.emailPlaceholder': 'you@example.com (ستصلك التراخيص هنا)',
    'checkout.discordLabel': 'معرف الديسكورد أو الواتساب (اختياري)',
    'checkout.discordPlaceholder': 'لتلقي الدعم الفني الفوري والمتابعة المباشرة',
    'checkout.paymentMethod': 'اختر وسيلة الدفع',
    'checkout.bankTransferInfo': 'التحويل البنكي (CIH Bank المغرب)',
    'checkout.bankAccountHolder': 'صاحب الحساب',
    'checkout.ribNumber': 'رقم الحساب (RIB)',
    'checkout.transferMotif': 'رمز / مرجع التحويل (Motif)',
    'checkout.txidLabel': 'مرجع التحويل / اسم المرسل / إثبات الدفع',
    'checkout.submitBank': 'تأكيد التحويل البنكي وحجز المفاتيح',
    'checkout.submitStandard': 'تأكيد الطلب وإرساله للمراجعة',
    'checkout.processing': 'جارٍ معالجة وتثبيت الطلب...',
    'checkout.trustNotice': 'دفع آمن ومحمي: تتم مراجعة استلام المبلغ من طرف الإدارة قبل فتح المفاتيح في خزنتك الرقمية.',

    // Digital Vault
    'vault.title': 'خزنتي الرقمية للمفاتيح',
    'vault.subtitle': 'مساحة مشفرة ودائمة لحفظ جميع مفاتيحك وتراخيصك الرقمية المشتراة.',
    'vault.activeCount': 'مفاتيح نشطة',
    'vault.searchPlaceholder': 'ابحث في المفاتيح، المنتجات، أو أرقام الطلبات...',
    'vault.exportBtn': 'تصدير نسخة احتياطية (.txt)',
    'vault.noKeys': 'لا توجد مفاتيح في الخزنة حالياً',
    'vault.noKeysDesc': 'أي ترخيص أو مفتاح ألعاب تشتريه يتم حفظه هنا بشكل دائم وآمن.',
    'vault.instructions': 'تعليمات التفعيل',
    'vault.copyKey': 'نسخ المفتاح',
    'vault.copied': 'تم النسخ بنجاح!',
    'vault.pendingNotice': 'طلب(ات) بانتظار تأكيد استلام المبلغ: ستظهر المفاتيح هنا فور تأكيد الإدارة للتحويل.',

    // User Account & Orders
    'account.title': 'طلباتي ومفاتيحي الرقمية',
    'account.subtitle': 'متابعة سجل الطلبات، حالة الدفع، وعرض المفاتيح المستلمة.',
    'account.totalOrders': 'إجمالي الطلبات',
    'account.delivered': 'تم التسليم',
    'account.pending': 'قيد المراجعة',
    'account.noOrders': 'لا توجد طلبات سابقة',
    'account.orderNumber': 'رقم الطلب',
    'account.date': 'التاريخ',
    'account.status': 'الحالة',
    'account.total': 'الإجمالي',

    // FAQ Section
    'faq.badge': 'الأسئلة والأجوبة',
    'faq.title': 'الأسئلة الأكثر شيوعاً',
    'faq.subtitle': 'كل ما تريد معرفته عن مفاتيحنا الأصلية، الضمان، وطريقة استلام الطلبات.',

    // Stats Bar
    'stats.keysDelivered': 'مفتاح تم تسليمه',
    'stats.satisfaction': 'نسبة رضا الزبناء',
    'stats.avgDelivery': 'سرعة التسليم',
    'stats.genuineGuaranteed': 'أصلي ومضمون 100%',

    // Footer
    'footer.aboutTitle': 'حول متجر BHSS Shop',
    'footer.aboutText':
      'المتجر الرقمي المعتمد والرائد لتوفير التراخيص البرمجية الأصلية، مفاتيح الألعاب، وأنظمة التشغيل، واشتراكات الذكاء الاصطناعي مع دعم الدفع البنكي المحلي والدولي.',
    'footer.brandDesc':
      'متجر BHSS هو الوجهة الأولى لشراء المفاتيح والتراخيص الرقمية الأصلية، البرامج المكتبية، واشتراكات الألعاب والذكاء الاصطناعي بأفضل الأسعار وبشكل فوري.',
    'footer.instantDelivery': 'تسليم رقمي فوري وآلي',
    'footer.instantDeliveryDesc':
      'نظامنا المؤتمت يرسل مفتاح التفعيل في أقل من 5 ثوانٍ مباشرة إلى شاشتك وخزنتك الرقمية.',
    'footer.genuine': 'ضمان ترخيص أصلي 100%',
    'footer.genuineDesc':
      'جميع التراخيص والمفاتيح رسمية ومستوردة من شركاء معتمدين مع ضمان استبدال فوري.',
    'footer.support': 'دعم فني بشري وآلي 24/7',
    'footer.supportDesc':
      'فريق الدعم الفني متواجد على مدار الساعة عبر تيليجرام وديسكورد لخدمتكم.',
    'footer.copyright': '© {year} متجر BHSS Shop. جميع الحقوق محفوظة.',
    'footer.terms': 'شروط الخدمة والاستخدام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.refund': 'ضمان استرجاع الأموال',
    'footer.quickLinks': 'روابط سريعة',
    'footer.paymentsAccepted': 'وسائل الدفع المعتمدة',
    'footer.allRightsReserved': 'جميع الحقوق محفوظة.',
    'footer.safeFulfillment': 'تسليم رقمي آمن، قانوني ومضمون بالكامل.',

    // Common
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.loading': 'جارٍ التحميل...',
    'common.verified': 'موثوق ومضمون'
  }
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)['en'];
