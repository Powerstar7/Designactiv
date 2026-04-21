import { Check, Shield, Zap, Gift, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { tools, localizeTool } from '../data/tools';

interface PricingSectionProps {
  onNavigate: (page: string) => void;
}

const mainAppIds = [
  'background-remover',
  'all-in-one-design',
  'ad-banner-animator',
  'logo-creator',
  'smart-object-remover',
  'advanced-image-editor',
];

const bonusAppIds = ['video-survey-pro', '3d-motion-photos', 'image-to-svg'];

export default function PricingSection({ onNavigate }: PricingSectionProps) {
  const { t, lang } = useLanguage();

  const appLabel = (id: string) => {
    const tool = tools.find((x) => x.id === id);
    if (!tool) return id;
    return localizeTool(tool, lang).subtitle;
  };

  const mainApps = mainAppIds.map(appLabel);
  const bonusApps = bonusAppIds.map(appLabel);

  const planFeatures = [
    t('pricing.allTools'),
    t('pricing.unlimited'),
    t('pricing.commercial'),
    t('pricing.cloud'),
    t('pricing.support'),
    t('pricing.templates'),
    t('pricing.agency'),
  ];

  return (
    <section className="bg-[#0f0a1e] py-16 px-4" id="pricing">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-4">
            <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">{t('pricing.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {t('pricing.title')} <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{t('pricing.titleHighlight')}</span> {t('pricing.title2')}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #160f2e, #1e1540)',
            border: '2px solid #7c3aed',
            boxShadow: '0 0 60px rgba(124,58,237,0.2)',
          }}
        >
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 py-3 px-6 text-center">
            <span className="text-white font-black text-sm tracking-widest uppercase">
              {t('pricing.packTitle')}
            </span>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-gray-400 text-2xl font-bold">$</span>
                  <span className="text-7xl font-black text-white leading-none">49</span>
                  <div className="text-gray-400 text-sm leading-tight ml-1">
                    <div>/</div>
                    <div>{t('pricing.lifetimeAccess')}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">{t('pricing.whatsIncluded')}</p>
                  <ul className="space-y-2.5">
                    {planFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-200 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  {t('pricing.buyNow')}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-green-400 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('pricing.moneyBack')}</span>
                </div>
              </div>

              <div className="flex-1 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-brand-400" />
                    <p className="text-white font-black text-sm uppercase tracking-wide">{t('pricing.powerfulApps')}</p>
                  </div>
                  <ul className="space-y-2">
                    {mainApps.map((app) => (
                      <li key={app} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 font-black text-sm uppercase tracking-wide">{t('pricing.bonusApps')}</p>
                  </div>
                  <ul className="space-y-2">
                    {bonusApps.map((app) => (
                      <li key={app} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="text-green-300 text-sm font-medium">{app}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-green-500 text-xs mt-3 font-semibold">
                    {t('pricing.bonusNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { label: t('pricing.oneTime'), sub: t('pricing.noSubs') },
            { label: t('pricing.lifetime'), sub: t('pricing.payOnce') },
            { label: t('pricing.nineApps'), sub: t('pricing.sixPlusThree') },
          ].map((item) => (
            <div key={item.label} className="bg-[#160f2e] rounded-xl p-4 border border-[#2a1f5c]">
              <p className="text-white font-black text-sm">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
