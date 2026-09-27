import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Users
} from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const {
    currentLanguage,
    subscribeNewsletter,
    applyPromoCode,
    newsletterSubscribers,
    exportSubscribers,
    isAdmin,
    showToast
  } = useStore();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedPromo, setSubscribedPromo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = subscribeNewsletter(email);
      setIsSubmitting(false);
      if (res.success) {
        setSubscribedPromo(res.promoCode || 'BHS10');
        setEmail('');
      }
    }, 400);
  };

  const handleCopyCode = () => {
    if (!subscribedPromo) return;
    navigator.clipboard.writeText(subscribedPromo);
    setCopied(true);
    showToast('Promo code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyNow = () => {
    if (!subscribedPromo) return;
    applyPromoCode(subscribedPromo);
  };

  // Translations
  const tContent = {
    badge: {
      en: 'VIP NEWSLETTER & FLASH OFFERS',
      ar: 'النشرة البريدية والعروض الحصرية',
      fr: 'NEWSLETTER VIP & VENTES FLASH'
    },
    titlePrefix: {
      en: 'Subscribe & Get',
      ar: 'اشترك الآن واحصل على',
      fr: 'Abonnez-vous & Recevez'
    },
    titleHighlight: {
      en: '10% OFF Instantly',
      ar: 'خصم 10% فوراً',
      fr: '10% de Réduction Immédiate'
    },
    description: {
      en: 'Join our marketing list to receive secret promo codes, weekend flash drops, and notifications about new game keys and software licenses.',
      ar: 'انضم إلى قائمتنا البريدية لتصلك أحدث العروض الترويجية، كوبونات الخصم السرية، وإشعارات توفر المفاتيح والتراخيص الجديدة.',
      fr: 'Rejoignez notre liste VIP pour recevoir des codes promo exclusifs, des réductions flash et les nouveautés en avant-première.'
    },
    placeholder: {
      en: 'Enter your email address...',
      ar: 'أدخل بريدك الإلكتروني...',
      fr: 'Entrez votre adresse email...'
    },
    buttonText: {
      en: 'Get 10% Coupon',
      ar: 'احصل على الخصم',
      fr: 'Obtenir les 10%'
    },
    submitting: {
      en: 'Subscribing...',
      ar: 'جاري الاشتراك...',
      fr: 'Inscription...'
    },
    successTitle: {
      en: "🎉 You're subscribed! Here is your 10% discount code:",
      ar: '🎉 تم اشتراكك بنجاح! إليك كود الخصم الخاص بك (10%):',
      fr: '🎉 Inscription réussie ! Voici votre code promo (-10%) :'
    },
    copyCode: {
      en: 'Copy Code',
      ar: 'نسخ الكود',
      fr: 'Copier'
    },
    applyToCart: {
      en: 'Apply to Cart',
      ar: 'تطبيق في السلة',
      fr: 'Appliquer au panier'
    },
    privacyNotice: {
      en: 'Zero spam. Unsubscribe with 1 click anytime.',
      ar: 'بدون أي رسائل مزعجة. يمكنك إلغاء الاشتراك بنقرة واحدة.',
      fr: 'Zéro spam. Désabonnement en 1 clic à tout moment.'
    }
  };

  const lang = (currentLanguage === 'ar' || currentLanguage === 'fr') ? currentLanguage : 'en';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/80 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div
        style={{ backgroundColor: 'var(--theme-primary, #6366f1)' }}
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
      />
      <div
        style={{ backgroundColor: 'var(--theme-accent, #06b6d4)' }}
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
          {/* Left Text / Value Prop */}
          <div className="space-y-3 flex-1 text-center md:text-left rtl:md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[11px] font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{tContent.badge[lang]}</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
              {tContent.titlePrefix[lang]}{' '}
              <span
                style={{
                  backgroundImage: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))'
                }}
                className="bg-clip-text text-transparent"
              >
                {tContent.titleHighlight[lang]}
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {tContent.description[lang]}
            </p>

            <div className="flex items-center justify-center md:justify-start rtl:md:justify-start gap-4 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {tContent.privacyNotice[lang]}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-slate-500 font-mono">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                4,800+ VIPs
              </span>
            </div>
          </div>

          {/* Right Form / Success Banner */}
          <div className="w-full md:w-auto md:min-w-[340px] lg:min-w-[400px]">
            {subscribedPromo ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{tContent.successTitle[lang]}</span>
                </div>

                <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-mono text-base font-extrabold text-white tracking-widest px-2">
                    {subscribedPromo}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tContent.copyCode[lang]}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleApplyNow}
                    style={{
                      background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))'
                    }}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-bold transition hover:scale-[1.02] cursor-pointer"
                  >
                    {tContent.applyToCart[lang]}
                  </button>
                </div>

                <button
                  onClick={() => setSubscribedPromo(null)}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {lang === 'ar' ? 'تسجيل بريد إلكتروني آخر' : 'Subscribe another email'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tContent.placeholder[lang]}
                      className="w-full ps-10 pe-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: 'var(--theme-gradient, linear-gradient(135deg, #6366f1 0%, #06b6d4 100%))',
                      boxShadow: '0 4px 15px -2px var(--theme-glow, rgba(99, 102, 241, 0.35))'
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-md"
                  >
                    {isSubmitting ? (
                      <span>{tContent.submitting[lang]}</span>
                    ) : (
                      <>
                        <span>{tContent.buttonText[lang]}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Admin Marketing Toolbar: Export Captured Emails */}
            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-cyan-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>{newsletterSubscribers.length} captured emails</span>
                </span>
                <button
                  type="button"
                  onClick={exportSubscribers}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer font-medium"
                  title="Download captured emails as CSV for marketing"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
