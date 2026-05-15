import { Check, Star, Zap, Gift, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { stripeProducts } from '../stripe-config';
import { useCheckout } from '../hooks/useCheckout';

const powerfulApps = [
  '1-Click Background Remover',
  'All-In-One Design & Mockup Tool',
  'Animated Ad Builder',
  'Logo Creator',
  'Smart Object Remover',
  'Advanced Image Editor',
];

const bonusApps = ['Video Survey Pro', '3D Live Motion Photos', 'Image to SVG Converter'];

export function PricingSection() {
  const { t } = useLanguage();
  const { createCheckoutSession, isLoading } = useCheckout();
  const product = stripeProducts[0]; // Get the main product

  const handlePurchase = async () => {
    await createCheckoutSession(product.priceId);
  };

  const includedFeatures = [
    t('pricing.allTools'),
    t('pricing.unlimited'),
    t('pricing.commercial'),
    t('pricing.cloud'),
    t('pricing.support'),
    t('pricing.templates'),
    t('pricing.agency'),
  ];

  return (
    <section className="py-20 bg-[#0f0a1e] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-5">
            <Star className="w-4 h-4 text-brand-400" fill="currentColor" />
            <span className="text-brand-400 text-sm font-bold">{t('pricing.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {t('pricing.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
              {t('pricing.titleHighlight')}
            </span>{' '}
            {t('pricing.title2')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
        </div>

        <div
          className="rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/20"
          style={{ background: 'linear-gradient(135deg, #160f2e 0%, #1e1540 100%)', border: '2px solid rgba(168, 85, 247, 0.4)' }}
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-center">
            <span className="text-white font-black text-sm uppercase tracking-widest">
              {t('pricing.packTitle')}
            </span>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-400 text-2xl font-bold">$</span>
                  <span className="text-white text-7xl font-black leading-none">{product.price}</span>
                  <div className="ml-2">
                    <p className="text-gray-500 text-xs">/</p>
                    <p className="text-gray-400 text-sm font-medium">{t('pricing.lifetimeAccess')}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mt-6 mb-4">
                  {t('pricing.whatsIncluded')}
                </p>
                <ul className="space-y-2.5">
                  {includedFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white text-sm font-semibold">{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="mt-8 w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/40 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : t('pricing.buyNow')}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span>{t('pricing.moneyBack')}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-brand-400" fill="currentColor" />
                    <p className="text-white font-black text-sm uppercase tracking-wide">
                      {t('pricing.powerfulApps')}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {powerfulApps.map((app) => (
                      <li key={app} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                        <span className="text-gray-200 text-sm">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 font-black text-sm uppercase tracking-wide">
                      {t('pricing.bonusApps')}
                    </p>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {bonusApps.map((app) => (
                      <li key={app} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="text-green-100 text-sm">{app}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-green-300 text-xs font-medium">{t('pricing.bonusNote')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;