import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  AVAILABLE_THEMES,
  ThemeConfig,
  ThemeId,
  getThemeById,
  generateRandomHarmoniousTheme,
  getRadiusValue,
  getGlowAlpha
} from '../../data/themes';
import { FullThemeCustomization } from '../../types';
import {
  Palette,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Eye,
  Info,
  Wand2,
  Download,
  Upload,
  Copy,
  Layout,
  SunMedium,
  Type,
  Square,
  Flame,
  ShoppingCart,
  Sun,
  Moon
} from 'lucide-react';
import { BHSSLogo } from '../BHSSLogo';

export const ThemesTab: React.FC = () => {
  const { settings, updateSettings, showToast, formatPrice, colorMode, setColorMode } = useStore();

  const currentThemeId = (settings.activeTheme as ThemeId) || 'cyber-indigo';
  const currentBaseTheme = getThemeById(currentThemeId);

  // Active sub-tab in Themes Studio
  const [studioTab, setStudioTab] = useState<'presets' | 'colors' | 'atmosphere' | 'geometry' | 'json'>('presets');

  // Full customizable state initialized from settings.customTheme or base theme
  const [customTheme, setCustomTheme] = useState<FullThemeCustomization>(() => {
    return {
      bg: settings.customTheme?.bg || currentBaseTheme.colors.bg,
      bgSubtle: settings.customTheme?.bgSubtle || currentBaseTheme.colors.bgSubtle,
      cardBg: settings.customTheme?.cardBg || currentBaseTheme.colors.cardBg,
      headerBg: settings.customTheme?.headerBg || currentBaseTheme.colors.headerBg,
      border: settings.customTheme?.border || currentBaseTheme.colors.border,
      primary: settings.customTheme?.primary || settings.customPrimaryColor || currentBaseTheme.colors.primary,
      primaryHover: settings.customTheme?.primaryHover || currentBaseTheme.colors.primaryHover,
      accent: settings.customTheme?.accent || settings.customAccentColor || currentBaseTheme.colors.accent,
      textColor: settings.customTheme?.textColor || currentBaseTheme.colors.textColor,
      textMutedColor: settings.customTheme?.textMutedColor || currentBaseTheme.colors.textMutedColor,
      borderRadius: settings.customTheme?.borderRadius || 'medium',
      glowIntensity: settings.customTheme?.glowIntensity || 'medium',
      fontFamily: settings.customTheme?.fontFamily || 'default',
      enableCyberBlobs: settings.customTheme?.enableCyberBlobs ?? true,
      enableHeaderGlass: settings.customTheme?.enableHeaderGlass ?? true
    };
  });

  // JSON Import/Export state
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Keep JSON string in sync when opening the JSON tab
  useEffect(() => {
    if (studioTab === 'json') {
      setJsonText(JSON.stringify(customTheme, null, 2));
      setJsonError('');
    }
  }, [studioTab, customTheme]);

  // Handle preset selection
  const handleSelectPreset = (preset: ThemeConfig) => {
    const updatedCustom: FullThemeCustomization = {
      bg: preset.colors.bg,
      bgSubtle: preset.colors.bgSubtle,
      cardBg: preset.colors.cardBg,
      headerBg: preset.colors.headerBg,
      border: preset.colors.border,
      primary: preset.colors.primary,
      primaryHover: preset.colors.primaryHover,
      accent: preset.colors.accent,
      textColor: preset.colors.textColor,
      textMutedColor: preset.colors.textMutedColor,
      borderRadius: customTheme.borderRadius || 'medium',
      glowIntensity: customTheme.glowIntensity || 'medium',
      fontFamily: customTheme.fontFamily || 'default',
      enableCyberBlobs: customTheme.enableCyberBlobs ?? true,
      enableHeaderGlass: customTheme.enableHeaderGlass ?? true
    };

    setCustomTheme(updatedCustom);

    updateSettings({
      activeTheme: preset.id,
      customPrimaryColor: undefined,
      customAccentColor: undefined,
      customTheme: updatedCustom
    });

    showToast(`Thème appliqué : "${preset.nameFr}" !`, 'success');
  };

  // Update a single property and immediately persist/reflect
  const updateCustomProp = <K extends keyof FullThemeCustomization>(
    key: K,
    value: FullThemeCustomization[K]
  ) => {
    const nextTheme: FullThemeCustomization = {
      ...customTheme,
      [key]: value
    };
    setCustomTheme(nextTheme);
    updateSettings({
      customTheme: nextTheme,
      customPrimaryColor: nextTheme.primary,
      customAccentColor: nextTheme.accent
    });
  };

  // Generate random harmonious palette
  const handleGenerateHarmonious = () => {
    const generated = generateRandomHarmoniousTheme();
    const nextTheme: FullThemeCustomization = {
      ...customTheme,
      ...generated
    };
    setCustomTheme(nextTheme);
    updateSettings({
      customTheme: nextTheme,
      customPrimaryColor: nextTheme.primary,
      customAccentColor: nextTheme.accent
    });
    showToast('Nouvelle palette harmonieuse générée ! 🎲', 'info');
  };

  // Reset to original Cyber Indigo preset
  const handleResetToDefault = () => {
    const defaultTheme = getThemeById('cyber-indigo');
    const resetCustom: FullThemeCustomization = {
      bg: defaultTheme.colors.bg,
      bgSubtle: defaultTheme.colors.bgSubtle,
      cardBg: defaultTheme.colors.cardBg,
      headerBg: defaultTheme.colors.headerBg,
      border: defaultTheme.colors.border,
      primary: defaultTheme.colors.primary,
      primaryHover: defaultTheme.colors.primaryHover,
      accent: defaultTheme.colors.accent,
      textColor: defaultTheme.colors.textColor,
      textMutedColor: defaultTheme.colors.textMutedColor,
      borderRadius: 'medium',
      glowIntensity: 'medium',
      fontFamily: 'default',
      enableCyberBlobs: true,
      enableHeaderGlass: true
    };
    setCustomTheme(resetCustom);
    updateSettings({
      activeTheme: 'cyber-indigo',
      customPrimaryColor: undefined,
      customAccentColor: undefined,
      customTheme: resetCustom
    });
    showToast('Thème réinitialisé aux réglages d\'origine !', 'info');
  };

  // Apply JSON theme import
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Le JSON doit être un objet valide');
      }
      setCustomTheme(parsed);
      updateSettings({
        customTheme: parsed,
        customPrimaryColor: parsed.primary,
        customAccentColor: parsed.accent
      });
      setJsonError('');
      showToast('Thème importé avec succès depuis le JSON !', 'success');
    } catch (err: any) {
      setJsonError(err.message || 'JSON invalide');
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(customTheme, null, 2));
    showToast('Configuration du thème copiée dans le presse-papier ! 📋', 'success');
  };

  // Helpers for live preview box
  const previewRadius = getRadiusValue(customTheme.borderRadius);
  const previewGlowAlpha = getGlowAlpha(customTheme.glowIntensity);
  const previewGlow = previewGlowAlpha > 0 ? `0 0 25px -4px ${customTheme.primary}77` : 'none';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Studio de Contrôle Thème Complet
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Personnalisable
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Modifiez chaque couleur, fond, bordure, rayon des coins, police et halo néon de la boutique. Les changements s'appliquent instantanément en direct sur tout le site.
            </p>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleGenerateHarmonious}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition cursor-pointer"
            title="Générer une combinaison de couleurs harmonieuse"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Palette Aléatoire</span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setColorMode('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                colorMode === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Mode Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setColorMode('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                colorMode === 'light'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Mode Light</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer"
            title="Réinitialiser au thème Cyber Indigo par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setStudioTab('presets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            studioTab === 'presets'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Thèmes Prédéfinis ({AVAILABLE_THEMES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioTab('colors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            studioTab === 'colors'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Couleurs & Fonds Détaillés</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioTab('atmosphere')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            studioTab === 'atmosphere'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <SunMedium className="w-4 h-4" />
          <span>Ambiance & Halos Néon</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioTab('geometry')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            studioTab === 'geometry'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Square className="w-4 h-4" />
          <span>Formes & Typographie</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioTab('json')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            studioTab === 'json'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>Import / Export JSON</span>
        </button>
      </div>

      {/* Grid: Left Settings / Right Interactive Live Store Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: PRESET THEMES */}
          {studioTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Choisissez une ambiance prête à l'emploi (1 clic) :
                </span>
                <span className="text-[11px] text-slate-500">
                  Actuel: <strong className="text-indigo-400">{currentBaseTheme.nameFr}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {AVAILABLE_THEMES.map((theme) => {
                  const isCurrent = settings.activeTheme === theme.id;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectPreset(theme)}
                      className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 pb-2">
                        <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                          {theme.nameFr}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                            {theme.badge}
                          </span>
                          {isCurrent && (
                            <span className="p-1 rounded-full bg-emerald-500 text-white shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 my-2 leading-relaxed">
                        {theme.subtitle}
                      </p>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.colors.primary }}
                            title="Couleur Primaire"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.colors.accent }}
                            title="Couleur Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.colors.bg }}
                            title="Couleur Fond"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.colors.cardBg }}
                            title="Couleur Cartes"
                          />
                        </div>

                        <span className="text-[10px] font-bold text-indigo-400 group-hover:underline">
                          {isCurrent ? 'Actif' : 'Appliquer →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED COLORS & BACKGROUNDS */}
          {studioTab === 'colors' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  Contrôle Intégral des Couleurs & Surfaces
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ajustez avec précision chaque zone de l'application via sélecteur ou code Hexadécimal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Main Background */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Fond Principal (Body)</label>
                    <span className="text-[11px] font-mono text-slate-400">{customTheme.bg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.bg || '#090d16'}
                      onChange={(e) => updateCustomProp('bg', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.bg || ''}
                      onChange={(e) => updateCustomProp('bg', e.target.value)}
                      placeholder="#090d16"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {/* 2. Card Background */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Fond des Cartes (Cards)</label>
                    <span className="text-[11px] font-mono text-slate-400">{customTheme.cardBg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.cardBg || '#111827'}
                      onChange={(e) => updateCustomProp('cardBg', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.cardBg || ''}
                      onChange={(e) => updateCustomProp('cardBg', e.target.value)}
                      placeholder="#111827"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {/* 3. Primary Color */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Couleur Primaire (Boutons)</label>
                    <span className="text-[11px] font-mono text-indigo-400 font-bold">{customTheme.primary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.primary || '#6366f1'}
                      onChange={(e) => {
                        updateCustomProp('primary', e.target.value);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.primary || ''}
                      onChange={(e) => updateCustomProp('primary', e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {/* 4. Accent Color */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Couleur Accent (Néon / Badges)</label>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{customTheme.accent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.accent || '#06b6d4'}
                      onChange={(e) => updateCustomProp('accent', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.accent || ''}
                      onChange={(e) => updateCustomProp('accent', e.target.value)}
                      placeholder="#06b6d4"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {/* 5. Border Color */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Couleur des Bordures</label>
                    <span className="text-[11px] font-mono text-slate-400">{customTheme.border}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.border || '#1f293d'}
                      onChange={(e) => updateCustomProp('border', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.border || ''}
                      onChange={(e) => updateCustomProp('border', e.target.value)}
                      placeholder="#1f293d"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>

                {/* 6. Text Color */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">Texte Principal</label>
                    <span className="text-[11px] font-mono text-slate-400">{customTheme.textColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.textColor || '#f1f5f9'}
                      onChange={(e) => updateCustomProp('textColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                    />
                    <input
                      type="text"
                      value={customTheme.textColor || ''}
                      onChange={(e) => updateCustomProp('textColor', e.target.value)}
                      placeholder="#f1f5f9"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATMOSPHERE & GLOW EFFECTS */}
          {studioTab === 'atmosphere' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <SunMedium className="w-4 h-4 text-amber-400" />
                  Ambiance Néon & Éclairage Cyberpunk
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Définissez l'intensité des halos néon et des effets visuels d'arrière-plan.
                </p>
              </div>

              {/* Glow Intensity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">
                  Intensité du Halo Néon (Glow Box-Shadow) :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Aucun (0%)', desc: 'Minimaliste' },
                    { id: 'subtle', label: 'Subtil (20%)', desc: 'Léger halo' },
                    { id: 'medium', label: 'Équilibré (45%)', desc: 'Recommandé' },
                    { id: 'high', label: 'Maximum (80%)', desc: 'Néon intense' }
                  ].map((level) => {
                    const isSelected = (customTheme.glowIntensity || 'medium') === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => updateCustomProp('glowIntensity', level.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{level.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{level.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cyber Blobs Toggle */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">
                    Sphères lumineuses d'ambiance (Cyber Blobs)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Affiche de douces vagues lumineuses colorées en haut et en bas de page.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={customTheme.enableCyberBlobs ?? true}
                  onChange={(e) => updateCustomProp('enableCyberBlobs', e.target.checked)}
                  className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Header Glassmorphism */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">
                    Effet Verre Dépoli sur l'En-tête (Glassmorphism)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Donne un rendu flouté translucide à la barre de navigation supérieure.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={customTheme.enableHeaderGlass ?? true}
                  onChange={(e) => updateCustomProp('enableHeaderGlass', e.target.checked)}
                  className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: GEOMETRY & TYPOGRAPHY */}
          {studioTab === 'geometry' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Square className="w-4 h-4 text-cyan-400" />
                  Géométrie des Coins & Style de Police
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Définissez la rondeur des boutons, des cartes et le style typographique global.
                </p>
              </div>

              {/* Border Radius Control */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">
                  Arrondi des Coins (Border Radius) :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Carré (0px)', desc: 'Style Brut / Retro' },
                    { id: 'small', label: 'Discret (8px)', desc: 'Style Compact' },
                    { id: 'medium', label: 'Moderne (16px)', desc: 'Style Signature' },
                    { id: 'large', label: 'Très Arrondi (24px)', desc: 'Style Doux / Pill' }
                  ].map((rad) => {
                    const isSelected = (customTheme.borderRadius || 'medium') === rad.id;
                    return (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() => updateCustomProp('borderRadius', rad.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{rad.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rad.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-200">
                  Style Typographique :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'default',
                      label: 'Plus Jakarta Sans',
                      desc: 'Moderne, ultra lisible et équilibré'
                    },
                    {
                      id: 'outfit',
                      label: 'Outfit Gaming',
                      desc: 'Titres futuristes & gaming'
                    },
                    {
                      id: 'mono',
                      label: 'Cyber Monospace',
                      desc: 'Style Terminal & Matrix'
                    }
                  ].map((font) => {
                    const isSelected = (customTheme.fontFamily || 'default') === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => updateCustomProp('fontFamily', font.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5" />
                          {font.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{font.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: JSON IMPORT / EXPORT */}
          {studioTab === 'json' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Copy className="w-4 h-4 text-indigo-400" />
                    Exporter ou Importer votre Configuration
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Partagez votre thème ou collez du JSON personnalisé pour une configuration instantanée.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </button>
              </div>

              <textarea
                rows={10}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
              />

              {jsonError && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                  Erreur : {jsonError}
                </div>
              )}

              <button
                type="button"
                onClick={handleImportJson}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Appliquer la Configuration JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Store Simulator */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Simulateur Boutique en Direct
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Temps Réel
            </span>
          </div>

          {/* Simulated App Container with live CSS attributes */}
          <div
            style={{
              backgroundColor: customTheme.bg,
              borderColor: customTheme.border,
              boxShadow: previewGlow
            }}
            className="p-4 rounded-2xl border transition-all duration-300 space-y-4 overflow-hidden shadow-2xl"
          >
            {/* 1. Header Preview */}
            <div
              style={{
                backgroundColor: customTheme.headerBg,
                borderColor: customTheme.border,
                borderRadius: previewRadius
              }}
              className="p-3 border flex items-center justify-between gap-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BHSSLogo size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.primary} 0%, ${customTheme.accent} 100%)`,
                    borderRadius: '9999px'
                  }}
                  className="px-2.5 py-1 text-[10px] font-black text-white flex items-center gap-1 shadow"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Panier (2)</span>
                </div>
              </div>
            </div>

            {/* 2. Hero Snippet */}
            <div
              style={{
                backgroundColor: customTheme.cardBg,
                borderColor: customTheme.border,
                borderRadius: previewRadius
              }}
              className="p-3.5 border relative overflow-hidden space-y-2"
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${customTheme.primary} 0%, ${customTheme.accent} 100%)`
                }}
                className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black text-white"
              >
                PROMO FLASH -40%
              </div>
              <h5
                style={{ color: customTheme.textColor }}
                className="text-xs font-black tracking-tight"
              >
                Offres Cyber Gaming Officielles
              </h5>
              <p
                style={{ color: customTheme.textMutedColor }}
                className="text-[10px] leading-relaxed"
              >
                Licences numériques authentiques livrées en 30 secondes.
              </p>
            </div>

            {/* 3. Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <span
                style={{
                  background: `linear-gradient(135deg, ${customTheme.primary} 0%, ${customTheme.accent} 100%)`,
                  borderRadius: previewRadius
                }}
                className="px-2.5 py-1 text-[10px] font-bold text-white shadow-sm shrink-0"
              >
                Tous les Produits
              </span>
              <span
                style={{
                  backgroundColor: customTheme.cardBg,
                  borderColor: customTheme.border,
                  color: customTheme.textMutedColor,
                  borderRadius: previewRadius
                }}
                className="px-2.5 py-1 text-[10px] font-medium border shrink-0"
              >
                Windows 11
              </span>
              <span
                style={{
                  backgroundColor: customTheme.cardBg,
                  borderColor: customTheme.border,
                  color: customTheme.textMutedColor,
                  borderRadius: previewRadius
                }}
                className="px-2.5 py-1 text-[10px] font-medium border shrink-0"
              >
                Office 2024
              </span>
            </div>

            {/* 4. Product Card Preview */}
            <div
              style={{
                backgroundColor: customTheme.cardBg,
                borderColor: customTheme.border,
                borderRadius: previewRadius
              }}
              className="p-3 border space-y-2.5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                  Microsoft
                </span>
                <span
                  style={{ color: customTheme.accent }}
                  className="text-[10px] font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Livraison Immédiate
                </span>
              </div>

              <div>
                <div
                  style={{ color: customTheme.textColor }}
                  className="text-xs font-black"
                >
                  Windows 11 Professional Key
                </div>
                <div
                  style={{ color: customTheme.textMutedColor }}
                  className="text-[10px]"
                >
                  Clé numérique à vie - Multilingue
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <div
                    style={{ color: customTheme.textColor }}
                    className="text-sm font-black"
                  >
                    149 DH
                  </div>
                  <div className="text-[9px] text-slate-500 line-through">
                    299 DH
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    background: `linear-gradient(135deg, ${customTheme.primary} 0%, ${customTheme.accent} 100%)`,
                    borderRadius: previewRadius,
                    boxShadow: previewGlow
                  }}
                  className="px-3 py-1.5 text-[11px] font-black text-white flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Acheter</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[10px] text-slate-500">
                ✨ L'ensemble du site est actualisé en temps réel selon ces paramètres.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
