import { useNavigate } from 'react-router-dom';
import { tools } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { PricingSection } from '../components/PricingSection';
import CTABanner from '../components/CTABanner';
import { Zap, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ShopPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const onNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'pricing') navigate('/pricing');
    else if (page === 'account' || page === 'login') navigate('/login');
    else navigate(`/${page}`);
  };
  const onToolSelect = (toolId: string) => navigate(`/tool/${toolId}`);

  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      <div className="bg-gradient-to-r from-[#160f2e] to-[#1e1540] border-b border-[#2a1f5c]">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-2 mb-4">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">{t('shop.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t('shop.title')}</h1>
          <div className="bg-gradient-to-r from-brand-500 to-fuchsia-500 rounded-2xl p-6 max-w-3xl mx-auto">
            <p className="text-white font-black text-xl md:text-2xl leading-tight">
              {t('products.banner')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">{t('shop.allTools')} ({tools.length})</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Filter className="w-4 h-4" />
            <span>{t('shop.filter')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onToolSelect(tool.id)}
            />
          ))}
        </div>
      </div>

      <PricingSection />
      <CTABanner onNavigate={onNavigate} />
    </div>
  );
}
