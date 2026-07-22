import { Shield, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CTABanner() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #160f2e 50%, #0f0a1e 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-6">
          <Zap className="w-4 h-4 text-brand-400" fill="currentColor" />
          <span className="text-brand-400 text-sm font-semibold">{t('cta.badge')}</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
          {t('cta.title1')}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{t('cta.titleHighlight')}</span>
          {t('cta.title2')}
        </h2>

        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => navigate('/checkout')}
            className="animate-pulse-btn bg-brand-500 hover:bg-brand-600 text-white font-black text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl glow-brand"
          >
            {t('cta.button')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { icon: Shield, title: t('cta.guarantee'), desc: t('cta.guaranteeDesc'), color: 'text-green-400' },
            { icon: Globe, title: t('cta.cloud'), desc: t('cta.cloudDesc'), color: 'text-cyan-400' },
            { icon: Zap, title: t('cta.instant'), desc: t('cta.instantDesc'), color: 'text-brand-400' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <p className="text-white font-bold text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
