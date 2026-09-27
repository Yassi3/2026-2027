import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'button' | 'banner' | 'nav';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { currentLanguage } = useStore();

  // If already running in standalone mode (already installed as PWA), hide completely
  if (isInstalled) {
    return null;
  }

  // Label translations
  const label =
    currentLanguage === 'ar'
      ? 'تثبيت التطبيق'
      : currentLanguage === 'fr'
      ? 'Installer l\'App'
      : 'Install App';

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In case beforeinstallprompt hasn't fired yet or browser requires manual trigger
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* 1. Header Variant */}
      {variant === 'header' && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 hover:from-indigo-600/40 hover:to-cyan-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] ${className}`}
          title={label}
        >
          <Download className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline">{label}</span>
        </button>
      )}

      {/* 2. Banner Variant (e.g. In footer or Hero) */}
      {variant === 'banner' && (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {currentLanguage === 'ar'
                  ? 'تطبيق BHSS Shop على هاتفك (PWA)'
                  : 'Installez BHSS Shop sur votre téléphone'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentLanguage === 'ar'
                  ? 'تصفح أسرع، إشعارات الطلبيات، وفتح الخزينة الرقمية بدون متصفح.'
                  : 'Accès rapide hors-ligne, notifications et livraison instantanée.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{label}</span>
          </button>
        </div>
      )}

      {/* 3. Mobile Nav Variant */}
      {variant === 'nav' && (
        <button
          onClick={handleClick}
          className={`flex flex-col items-center justify-center py-1 text-[10px] font-medium text-slate-400 hover:text-white transition cursor-pointer ${className}`}
        >
          <Download className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span>{label}</span>
        </button>
      )}

      {/* 4. Default Standard Button */}
      {variant === 'button' && (
        <button
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{label}</span>
        </button>
      )}

      {/* iOS & Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 end-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Smartphone className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {currentLanguage === 'ar' ? 'تثبيت تطبيق BHSS Shop' : 'Installer l\'application'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentLanguage === 'ar' ? 'تطبيق PWA سريع على الشاشة الرئيسية' : 'Application PWA pour mobile'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  1
                </div>
                <div>
                  {currentLanguage === 'ar' ? (
                    <span>
                      اضغط على زر <strong>المشاركة (Share)</strong> <Share className="inline w-3.5 h-3.5 text-cyan-400 mx-1" /> في متصفح Safari بالأسفل (أو إعدادات المتصفح).
                    </span>
                  ) : (
                    <span>
                      Appuyez sur le bouton <strong>Partager</strong> <Share className="inline w-3.5 h-3.5 text-cyan-400 mx-1" /> dans la barre de votre navigateur.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  2
                </div>
                <div>
                  {currentLanguage === 'ar' ? (
                    <span>
                      انزل لأسفل واضغط على <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong> <PlusSquare className="inline w-3.5 h-3.5 text-indigo-400 mx-1" />.
                    </span>
                  ) : (
                    <span>
                      Faites défiler et sélectionnez <strong>Sur l'écran d'accueil</strong> <PlusSquare className="inline w-3.5 h-3.5 text-indigo-400 mx-1" />.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  ✓
                </div>
                <div>
                  {currentLanguage === 'ar' ? (
                    <span className="text-emerald-300 font-medium">
                      سيظهر رمز التطبيق مباشرة على هاتفك لتسوق سريع دون الحاجة للمتصفح!
                    </span>
                  ) : (
                    <span className="text-emerald-300 font-medium">
                      L'icône BHSS Shop apparaîtra directement sur votre écran d'accueil !
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-indigo-600/30"
            >
              {currentLanguage === 'ar' ? 'فهمت، حسناً' : 'Compris'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
