export type PlatformType = 'Steam' | 'Windows' | 'Xbox' | 'PlayStation' | 'EA App' | 'Ubisoft' | 'Epic Games' | 'Rockstar' | 'Multiplatform' | 'Web/Cloud';

export type DeliveryType = 'instant_key' | 'account' | 'download_link' | 'subscription';

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  passkey: string;
  role: 'admin';
  isOwner?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number; // in USD
  originalPrice?: number;
  category: string;
  subcategory?: string;
  platform: PlatformType;
  deliveryType: DeliveryType;
  deliveryTime: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  image: string;
  images?: string[];
  features: string[];
  instructions?: string;
  systemRequirements?: {
    os?: string;
    processor?: string;
    memory?: string;
    graphics?: string;
    storage?: string;
  };
  sampleKeys?: string[];
  warranty: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  itemCount?: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderDeliveredItem {
  productId: string;
  productTitle: string;
  keyOrData: string;
  deliveryType: DeliveryType;
  instructions: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerEmail: string;
  customerName?: string;
  customerDiscord?: string;
  items: CartItem[];
  total: number;
  currency: string;
  paymentMethod: string;
  status: 'completed' | 'processing' | 'pending' | 'refunded';
  deliveredKeys: OrderDeliveredItem[];
  paymentTxId?: string;
  bankTransferRef?: string;
  requiresVerification?: boolean;
  vaultUnlocked?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  discountApplied?: {
    code: string;
    percentage: number;
    amount: number;
  };
}

export interface DigitalVaultItem {
  id: string;
  orderId: string;
  orderNumber: string;
  datePurchased: string;
  productId: string;
  productTitle: string;
  productImage: string;
  category: string;
  platform: PlatformType;
  deliveryType: DeliveryType;
  keyOrCredential: string;
  instructions: string;
  warranty: string;
  status: 'active' | 'redeemed';
}

export type LanguageCode = 'en' | 'fr' | 'ar';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export interface Currency {
  code: 'USD' | 'EUR' | 'GBP' | 'MAD';
  symbol: string;
  rate: number; // relative to 1 USD
  name: string;
  flag: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  iconName: string;
  description: string;
  feePercentage: number;
  badge?: string;
  enabled: boolean;
  instructions: string;
  walletAddress?: string;
  network?: string;
  binancePayId?: string;
  paypalEmailOrLink?: string;
  bankName?: string;
  accountHolder?: string;
  ribNumber?: string;
  stripePaymentLink?: string;
  type?: 'crypto' | 'binance' | 'paypal' | 'moroccan_bank' | 'card';
}

export interface StoreSettings {
  storeName: string;
  customLogoUrl?: string;
  announcementActive: boolean;
  announcementText: string;
  supportEmail: string;
  telegramHandle: string;
  discordInvite: string;
  autoDeliveryEnabled: boolean;
  requireManualPaymentVerification?: boolean;
  maintenanceMode: boolean;
}
