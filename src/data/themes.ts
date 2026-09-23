import { FullThemeCustomization, ThemeId, ColorMode } from '../types';

export type { ThemeId, ColorMode };

export interface ThemeColors {
  bg: string;
  bgSubtle: string;
  cardBg: string;
  headerBg: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  textColor: string;
  textMutedColor: string;
  glow: string;
  gradient: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameFr: string;
  nameAr: string;
  subtitle: string;
  badge: string;
  colors: ThemeColors;
  lightColors?: ThemeColors;
  previewColors: string[]; // [primary, accent, bg, cardBg]
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'cyber-indigo',
    name: 'Cyber Indigo',
    nameFr: 'Cyber Indigo (Défaut)',
    nameAr: 'سايبر إنديجو (الافتراضي)',
    subtitle: 'Néon Indigo & Cyan Cyberpunk - Thème signature BHSS Shop',
    badge: 'SIGNATURE',
    colors: {
      bg: '#090d16',
      bgSubtle: '#0e1424',
      cardBg: '#111827',
      headerBg: 'rgba(9, 13, 22, 0.90)',
      border: '#1f293d',
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      accent: '#06b6d4',
      textColor: '#f1f5f9',
      textMutedColor: '#94a3b8',
      glow: 'rgba(99, 102, 241, 0.45)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)'
    },
    lightColors: {
      bg: '#f8fafc',
      bgSubtle: '#f1f5f9',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#e2e8f0',
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      accent: '#0284c7',
      textColor: '#0f172a',
      textMutedColor: '#64748b',
      glow: 'rgba(79, 70, 229, 0.22)',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)'
    },
    previewColors: ['#6366f1', '#06b6d4', '#090d16', '#111827']
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    nameFr: 'Emerald Matrix (Razer Green)',
    nameAr: 'ماتريكس إميرالد (أخضر ريزر)',
    subtitle: 'Vert Émeraude & Lime Cyberpunk - Style Razer Gaming',
    badge: 'GAMING',
    colors: {
      bg: '#051109',
      bgSubtle: '#091c10',
      cardBg: '#0d2817',
      headerBg: 'rgba(5, 17, 9, 0.92)',
      border: '#164227',
      primary: '#10b981',
      primaryHover: '#059669',
      accent: '#84cc16',
      textColor: '#ecfdf5',
      textMutedColor: '#6ee7b7',
      glow: 'rgba(16, 185, 129, 0.45)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #84cc16 100%)'
    },
    lightColors: {
      bg: '#f0fdf4',
      bgSubtle: '#dcfce7',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#bbf7d0',
      primary: '#059669',
      primaryHover: '#047857',
      accent: '#65a30d',
      textColor: '#064e3b',
      textMutedColor: '#047857',
      glow: 'rgba(5, 150, 105, 0.22)',
      gradient: 'linear-gradient(135deg, #059669 0%, #65a30d 100%)'
    },
    previewColors: ['#10b981', '#84cc16', '#051109', '#0d2817']
  },
  {
    id: 'crimson-rog',
    name: 'Crimson ROG',
    nameFr: 'Crimson ROG (Blood Red)',
    nameAr: 'روج كريمسون (أحمر قرمزي)',
    subtitle: 'Rouge Rubis & Crimson - Style Asus ROG & HyperX',
    badge: 'EDGY',
    colors: {
      bg: '#120508',
      bgSubtle: '#1d090e',
      cardBg: '#270c14',
      headerBg: 'rgba(18, 5, 8, 0.92)',
      border: '#451523',
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      accent: '#fb7185',
      textColor: '#fff1f2',
      textMutedColor: '#fda4af',
      glow: 'rgba(244, 63, 94, 0.45)',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)'
    },
    lightColors: {
      bg: '#fff1f2',
      bgSubtle: '#ffe4e6',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#fecdd3',
      primary: '#e11d48',
      primaryHover: '#be123c',
      accent: '#f43f5e',
      textColor: '#881337',
      textMutedColor: '#9f1239',
      glow: 'rgba(225, 29, 72, 0.22)',
      gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)'
    },
    previewColors: ['#f43f5e', '#fb7185', '#120508', '#270c14']
  },
  {
    id: 'amethyst-nebula',
    name: 'Amethyst Nebula',
    nameFr: 'Amethyst Nebula (Galaxy Purple)',
    nameAr: 'سديم الجمشت (بنفسجي جلاكسي)',
    subtitle: 'Violet Profond & Fuchsia Néon - Style Twitch & Streamer',
    badge: 'VIP',
    colors: {
      bg: '#0c0616',
      bgSubtle: '#160b29',
      cardBg: '#21103c',
      headerBg: 'rgba(12, 6, 22, 0.92)',
      border: '#3f1f72',
      primary: '#a855f7',
      primaryHover: '#9333ea',
      accent: '#ec4899',
      textColor: '#faf5ff',
      textMutedColor: '#d8b4fe',
      glow: 'rgba(168, 85, 247, 0.45)',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    lightColors: {
      bg: '#faf5ff',
      bgSubtle: '#f3e8ff',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#e9d5ff',
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      accent: '#c026d3',
      textColor: '#3b0764',
      textMutedColor: '#6b21a8',
      glow: 'rgba(124, 58, 237, 0.22)',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)'
    },
    previewColors: ['#a855f7', '#ec4899', '#0c0616', '#21103c']
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    nameFr: 'Sunset Amber (Cyber Gold)',
    nameAr: 'العنبر الذهبي (سايبر جولد)',
    subtitle: 'Or Pur & Ambre Chaud - Édition Collector & Luxe',
    badge: 'GOLD',
    colors: {
      bg: '#120c04',
      bgSubtle: '#1f1507',
      cardBg: '#2c1e0a',
      headerBg: 'rgba(18, 12, 4, 0.92)',
      border: '#4e3512',
      primary: '#f59e0b',
      primaryHover: '#d97706',
      accent: '#fb923c',
      textColor: '#fffbeb',
      textMutedColor: '#fde68a',
      glow: 'rgba(245, 158, 11, 0.45)',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)'
    },
    lightColors: {
      bg: '#fffbeb',
      bgSubtle: '#fef3c7',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#fde68a',
      primary: '#d97706',
      primaryHover: '#b45309',
      accent: '#ea580c',
      textColor: '#451a03',
      textMutedColor: '#92400e',
      glow: 'rgba(217, 119, 6, 0.22)',
      gradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)'
    },
    previewColors: ['#f59e0b', '#fb923c', '#120c04', '#2c1e0a']
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    nameFr: 'Midnight Sapphire (PlayStation Blue)',
    nameAr: 'الياقوت الليلي (أزرق بلايستيشن)',
    subtitle: 'Bleu Royal & Cyan Glacé - Style PlayStation & Tech Pro',
    badge: 'PRO',
    colors: {
      bg: '#050c18',
      bgSubtle: '#09152b',
      cardBg: '#0f2042',
      headerBg: 'rgba(5, 12, 24, 0.92)',
      border: '#19366e',
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      accent: '#38bdf8',
      textColor: '#eff6ff',
      textMutedColor: '#93c5fd',
      glow: 'rgba(37, 99, 235, 0.45)',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)'
    },
    lightColors: {
      bg: '#f0f9ff',
      bgSubtle: '#e0f2fe',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#bae6fd',
      primary: '#0284c7',
      primaryHover: '#0369a1',
      accent: '#2563eb',
      textColor: '#082f49',
      textMutedColor: '#0369a1',
      glow: 'rgba(2, 132, 199, 0.22)',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
    },
    previewColors: ['#2563eb', '#38bdf8', '#050c18', '#0f2042']
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    nameFr: 'Cyberpunk 2077 (Neo Tokyo)',
    nameAr: 'سايبربانك 2077 (أصفر ونيون)',
    subtitle: 'Jaune Électrique & Cyan Néon - Style Cyberpunk 2077 Night City',
    badge: 'CYBER',
    colors: {
      bg: '#0a0a0c',
      bgSubtle: '#14141a',
      cardBg: '#1b1b22',
      headerBg: 'rgba(10, 10, 12, 0.92)',
      border: '#373747',
      primary: '#fcee09',
      primaryHover: '#e0d308',
      accent: '#00f0ff',
      textColor: '#ffffff',
      textMutedColor: '#cbd5e1',
      glow: 'rgba(252, 238, 9, 0.55)',
      gradient: 'linear-gradient(135deg, #fcee09 0%, #00f0ff 100%)'
    },
    lightColors: {
      bg: '#fefce8',
      bgSubtle: '#fef9c3',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#fde047',
      primary: '#ca8a04',
      primaryHover: '#a16207',
      accent: '#0891b2',
      textColor: '#422006',
      textMutedColor: '#713f12',
      glow: 'rgba(202, 138, 4, 0.22)',
      gradient: 'linear-gradient(135deg, #ca8a04 0%, #0891b2 100%)'
    },
    previewColors: ['#fcee09', '#00f0ff', '#0a0a0c', '#1b1b22']
  },
  {
    id: 'monochrome-stealth',
    name: 'Monochrome Stealth',
    nameFr: 'Monochrome Stealth (OLED Dark)',
    nameAr: 'ستيلث أحادي اللون (أسود أوليد)',
    subtitle: 'Noir Pur OLED & Titane Argenté - Minimaliste & Épuré',
    badge: 'OLED',
    colors: {
      bg: '#000000',
      bgSubtle: '#0a0a0d',
      cardBg: '#131317',
      headerBg: 'rgba(0, 0, 0, 0.94)',
      border: '#24242c',
      primary: '#e2e8f0',
      primaryHover: '#cbd5e1',
      accent: '#94a3b8',
      textColor: '#ffffff',
      textMutedColor: '#94a3b8',
      glow: 'rgba(255, 255, 255, 0.25)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
    },
    lightColors: {
      bg: '#f8fafc',
      bgSubtle: '#f1f5f9',
      cardBg: '#ffffff',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      border: '#cbd5e1',
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#475569',
      textColor: '#0f172a',
      textMutedColor: '#64748b',
      glow: 'rgba(15, 23, 42, 0.15)',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)'
    },
    previewColors: ['#e2e8f0', '#94a3b8', '#000000', '#131317']
  }
];

export const DEFAULT_THEME_ID: ThemeId = 'cyber-indigo';

export const getThemeById = (id?: string): ThemeConfig => {
  const found = AVAILABLE_THEMES.find((t) => t.id === id);
  return found || AVAILABLE_THEMES[0];
};

/**
 * Maps border radius keyword to CSS pixel value
 */
export const getRadiusValue = (radius?: string): string => {
  switch (radius) {
    case 'none':
      return '0px';
    case 'small':
      return '8px';
    case 'large':
      return '24px';
    case 'full':
      return '9999px';
    case 'medium':
    default:
      return '16px';
  }
};

/**
 * Maps glow intensity keyword to opacity value
 */
export const getGlowAlpha = (glow?: string): number => {
  switch (glow) {
    case 'none':
      return 0;
    case 'subtle':
      return 0.2;
    case 'high':
      return 0.8;
    case 'medium':
    default:
      return 0.45;
  }
};

/**
 * Converts HEX color string to RGB numbers
 */
export const hexToRgb = (hex: string): string => {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '99, 102, 241';
};

/**
 * Injects CSS variables onto document.documentElement to immediately update
 * all store styling, colors, background, surfaces, borders, glow, and font.
 */
export const applyThemeToDocument = (
  themeId?: ThemeId,
  customPrimary?: string,
  customAccent?: string,
  customTheme?: FullThemeCustomization,
  colorMode: ColorMode = 'dark'
): void => {
  if (typeof document === 'undefined') return;

  const baseTheme = getThemeById(themeId);
  const root = document.documentElement;
  const isLight = colorMode === 'light';

  // Toggle CSS class and data attribute on root
  if (isLight) {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-color-mode', 'light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-color-mode', 'dark');
    root.style.colorScheme = 'dark';
  }

  // Pick base palette based on mode
  const activePalette = (isLight && baseTheme.lightColors) ? baseTheme.lightColors : baseTheme.colors;

  // Compute final colors with full mode awareness
  // In light mode, strictly use the curated high-contrast light palette
  const bg = isLight ? (baseTheme.lightColors?.bg || '#f8fafc') : (customTheme?.bg || activePalette.bg);
  const bgSubtle = isLight ? (baseTheme.lightColors?.bgSubtle || '#f1f5f9') : (customTheme?.bgSubtle || activePalette.bgSubtle);
  const cardBg = isLight ? (baseTheme.lightColors?.cardBg || '#ffffff') : (customTheme?.cardBg || activePalette.cardBg);
  const headerBg = isLight ? (baseTheme.lightColors?.headerBg || 'rgba(255, 255, 255, 0.94)') : (customTheme?.headerBg || activePalette.headerBg);
  const border = isLight ? (baseTheme.lightColors?.border || '#e2e8f0') : (customTheme?.border || activePalette.border);
  
  const primary = isLight ? (baseTheme.lightColors?.primary || activePalette.primary) : (customTheme?.primary || customPrimary || activePalette.primary);
  const primaryHover = isLight ? (baseTheme.lightColors?.primaryHover || activePalette.primaryHover) : (customTheme?.primaryHover || activePalette.primaryHover);
  const accent = isLight ? (baseTheme.lightColors?.accent || activePalette.accent) : (customTheme?.accent || customAccent || activePalette.accent);

  const textColor = isLight ? (baseTheme.lightColors?.textColor || '#0f172a') : (customTheme?.textColor || activePalette.textColor);
  const textMutedColor = isLight ? (baseTheme.lightColors?.textMutedColor || '#64748b') : (customTheme?.textMutedColor || activePalette.textMutedColor);

  // Glow calculation
  const glowAlpha = getGlowAlpha(customTheme?.glowIntensity);
  const glow = glowAlpha === 0
    ? 'none'
    : `rgba(${hexToRgb(primary)}, ${isLight ? glowAlpha * 0.45 : glowAlpha})`;

  // Gradient calculation
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`;

  // Radius calculation
  const radius = getRadiusValue(customTheme?.borderRadius);

  // Set CSS Variables
  root.style.setProperty('--theme-bg', bg);
  root.style.setProperty('--theme-bg-subtle', bgSubtle);
  root.style.setProperty('--theme-card-bg', cardBg);
  root.style.setProperty('--theme-header-bg', headerBg);
  root.style.setProperty('--theme-border', border);
  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-primary-rgb', hexToRgb(primary));
  root.style.setProperty('--theme-primary-hover', primaryHover);
  root.style.setProperty('--theme-accent', accent);
  root.style.setProperty('--theme-accent-rgb', hexToRgb(accent));
  root.style.setProperty('--theme-text', textColor);
  root.style.setProperty('--theme-text-muted', textMutedColor);
  root.style.setProperty('--theme-glow', glow);
  root.style.setProperty('--theme-gradient', gradient);
  root.style.setProperty('--theme-radius', radius);

  // Font family selection
  if (customTheme?.fontFamily === 'outfit') {
    root.style.setProperty('--theme-font-main', "'Outfit', sans-serif");
  } else if (customTheme?.fontFamily === 'mono') {
    root.style.setProperty('--theme-font-main', "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace");
  } else {
    root.style.setProperty('--theme-font-main', "'Plus Jakarta Sans', system-ui, sans-serif");
  }

  // Update body background and text
  document.body.style.backgroundColor = bg;
  document.body.style.color = textColor;
  root.setAttribute('data-theme', baseTheme.id);

  // Update browser mobile header color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isLight ? headerBg : primary);
  }
};

/**
 * Generates an inspiring harmonic gaming color palette
 */
export const generateRandomHarmoniousTheme = (): FullThemeCustomization => {
  const hues = [
    { name: 'Neon Cyber', primary: '#00f2fe', accent: '#4facfe', bg: '#060d19', card: '#0b162c' },
    { name: 'Toxic Lime', primary: '#10b981', accent: '#a3e635', bg: '#041108', card: '#0a2312' },
    { name: 'Vampire Red', primary: '#ff0055', accent: '#ff5500', bg: '#120408', card: '#250810' },
    { name: 'Cosmic Gold', primary: '#fbbf24', accent: '#f43f5e', bg: '#130c04', card: '#251708' },
    { name: 'Synthwave 80s', primary: '#d946ef', accent: '#06b6d4', bg: '#11051b', card: '#220b36' },
    { name: 'Deep Aqua', primary: '#14b8a6', accent: '#3b82f6', bg: '#041113', card: '#082327' },
    { name: 'Ultra Violet', primary: '#8b5cf6', accent: '#ec4899', bg: '#0d071a', card: '#1b0e36' }
  ];

  const pick = hues[Math.floor(Math.random() * hues.length)];

  return {
    primary: pick.primary,
    accent: pick.accent,
    bg: pick.bg,
    bgSubtle: `${pick.card}99`,
    cardBg: pick.card,
    headerBg: `${pick.bg}ea`,
    border: `${pick.primary}33`,
    textColor: '#ffffff',
    textMutedColor: '#94a3b8',
    glowIntensity: 'medium',
    borderRadius: 'medium',
    enableCyberBlobs: true
  };
};
