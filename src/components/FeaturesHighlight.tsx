import { Cpu, Globe, TrendingUp, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FeaturesHighlight() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: t('features.ai.title'),
      desc: t('features.ai.desc'),
      color: '#7c3aed',
      bg: 'from-brand-500/10 to-brand-600/5',
      border: 'border-brand-500/20',
    },
    {
      icon: Globe,
      title: t('features.lang.title'),
      desc: t('features.lang.desc'),
      color: '#06b6d4',
      bg: 'from-cyan-500/10 to-cyan-600/5',
      border: 'border-cyan-500/20',
    },
    {
      icon: TrendingUp,
      title: t('features.engagement.title'),
      desc: t('features.engagement.desc'),
      color: '#22c55e',
      bg: 'from-green-500/10 to-green-600/5',
      border: 'border-green-500/20',
    },
    {
      icon: DollarSign,
      title: t('features.commercial.title'),
      desc: t('features.commercial.desc'),
      color: '#fbbf24',
      bg: 'from-yellow-500/10 to-yellow-600/5',
      border: 'border-yellow-500/20',
    },
  ];

  return (
    <section className="bg-[#0f0a1e] py-16 px-4 border-b border-[#2a1f5c]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('features.title')} <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">DesignActiv</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${feature.bg} border ${feature.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: feature.color + '20' }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-white font-black text-base mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
