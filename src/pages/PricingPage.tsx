import { PricingSection } from '../components/PricingSection';
import { useLanguage } from '../context/LanguageContext';

export function PricingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      <div className="bg-gradient-to-r from-[#160f2e] to-[#1e1540] border-b border-[#2a1f5c]">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('pricing.title')} {t('pricing.titleHighlight')} {t('pricing.title2')}
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
      </div>

      <PricingSection />
    </div>
  );
}
