import { useState } from 'react';
import { Check, Zap, Gift, Shield, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

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
  const product = stripeProducts[0];
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        },
        headers: session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : undefined,
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const includedFeatures = [
    t('pricing.allTools', 'All 6 Design Tools'),
    t('pricing.unlimited', 'Unlimited Usage'),
    t('pricing.commercial', 'Commercial License'),
    t('pricing.cloud', 'Cloud Based'),
    t('pricing.support', '24/7 VIP Support'),
    t('pricing.templates', 'All Bonus Templates'),
    t('pricing.agency', 'Agency License'),
  ];

  return (
    <section className="py-20 bg-[#0f0a1e] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/20"
          style={{ background: 'linear-gradient(135deg, #160f2e 0%, #1e1540 100%)', border: '2px solid rgba(168, 85, 247, 0.4)' }}
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-center">
            <span className="text-white font-black text-sm uppercase tracking-widest">
              {t('pricing.packTitle', 'Design Activ — All-in-One Pack')}
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
                    <p className="text-gray-400 text-sm font-medium">{t('pricing.lifetimeAccess', 'Lifetime Access')}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mt-6 mb-4">
                  {t('pricing.whatsIncluded', "WHAT'S INCLUDED")}
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
                  onClick={handleCheckout}
                  disabled={loading}
                  className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40 text-base flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>{t('pricing.buyNow', 'Buy Now')} — ${product.price} Lifetime</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span>{t('pricing.moneyBack', '30-Day Money Back Guarantee — No Questions Asked')}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-brand-400" fill="currentColor" />
                    <p className="text-white font-black text-sm uppercase tracking-wide">
                      {t('pricing.powerfulApps', '6 POWERFUL APPS')}
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
                      {t('pricing.bonusApps', '3 BONUS APPS — FREE!')}
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
                  <p className="text-green-300 text-xs font-medium">{t('pricing.bonusNote', 'Bonus apps included at no extra cost!')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
