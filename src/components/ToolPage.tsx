import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, CreditCard, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { Tool, localizeTool } from '../data/tools';
import ToolIcon from './ToolIcon';
import YouTubePlayer from './YouTubePlayer';
import { useLanguage } from '../context/LanguageContext';

interface ToolPageProps {
  tool: Tool;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function CTABlock({ onNavigate }: { onNavigate: (p: string) => void; color: string }) {
  const { t } = useLanguage();

  return (
    <div className="text-center py-8">
      <button
        onClick={() => onNavigate('shop')}
        className="animate-pulse-btn inline-block bg-red-600 hover:bg-red-700 text-white font-black text-xl py-5 px-14 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl mb-4"
      >
        {t('tool.getAccess')}
      </button>
      <div className="flex items-center justify-center gap-4 flex-wrap mt-3">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <CreditCard className="w-4 h-4" />
          <span>PayPal · Visa · Mastercard · Amex · Stripe</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-xs border border-green-700/40 bg-green-900/20 rounded-full px-3 py-1">
          <Shield className="w-3.5 h-3.5" />
          <span>{t('tool.moneyBack')}</span>
        </div>
      </div>
    </div>
  );
}

export default function ToolPage({ tool: baseTool, onBack, onNavigate }: ToolPageProps) {
  const { t, lang } = useLanguage();
  const tool = localizeTool(baseTool, lang);
  const [activeCategory, setActiveCategory] = useState(tool.exampleCategories[0]);

  useEffect(() => {
    setActiveCategory(tool.exampleCategories[0]);
  }, [lang, baseTool.id]);

  const leftFeatures = tool.features.slice(0, Math.ceil(tool.features.length / 2));
  const rightFeatures = tool.features.slice(Math.ceil(tool.features.length / 2));

  return (
    <div className="min-h-screen" style={{ background: '#0f0a1e' }}>
      <div className="bg-[#160f2e] border-b border-[#2a1f5c] py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('tool.backToProducts')}
          </button>
        </div>
      </div>

      <div
        className="relative py-10 px-4"
        style={{
          background: `linear-gradient(135deg, ${tool.color}22 0%, #0f0a1e 60%)`,
          borderBottom: `1px solid ${tool.color}30`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div
              className="bg-white rounded-2xl px-8 py-5 shadow-2xl inline-flex items-center gap-4 mx-auto"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tool.color + '18', border: `2px solid ${tool.color}50` }}
              >
                <ToolIcon iconName={tool.icon} size={30} color={tool.color} />
              </div>
              <div className="text-left">
                <h2 className="font-black text-gray-900 text-base leading-tight">{tool.name}</h2>
                <p className="text-gray-500 text-xs mt-0.5">{tool.subtitle}</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 max-w-3xl mx-auto leading-tight">
            {tool.heroTitle}
          </h1>
          <p className="font-bold text-lg" style={{ color: tool.accentColor }}>
            {tool.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <YouTubePlayer videoId={tool.videoId} accentColor={tool.color} />
      </div>

      <div
        className="py-5 px-4 text-center"
        style={{ backgroundColor: tool.color }}
      >
        <h2 className="text-white font-black text-xl md:text-2xl">
          {tool.competitionTitle}
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {leftFeatures.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-brand-500 hover:bg-brand-600 transition-colors rounded-full px-5 py-3 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white font-bold text-sm">{feature}</span>
            </div>
          ))}
          {rightFeatures.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition-colors rounded-full px-5 py-3 cursor-default"
            >
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white font-bold text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <CTABlock onNavigate={onNavigate} color={tool.color} />

      <div className="max-w-4xl mx-auto px-4 py-4">
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            border: `2px solid ${tool.color}50`,
            background: `linear-gradient(135deg, ${tool.color}08, transparent)`,
          }}
        >
          <h3 className="text-white font-black text-xl text-center mb-5">
            {tool.benefitTitle}
          </h3>
          <div
            className="rounded-xl p-6 space-y-4"
            style={{
              backgroundColor: tool.color + '10',
              border: `1px solid ${tool.color}25`,
            }}
          >
            {tool.benefitBody.map((para, i) => (
              <p key={i} className="text-gray-300 text-sm leading-relaxed">
                {i === 0 ? (
                  <strong className="text-white">{para}</strong>
                ) : (
                  para
                )}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div
        className="py-4 px-4 text-white font-black text-lg text-center"
        style={{ backgroundColor: tool.color }}
      >
        {t('tool.examplesTitle')}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {tool.exampleCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={
                activeCategory === cat
                  ? { backgroundColor: tool.color, color: '#fff' }
                  : { backgroundColor: '#2a1f5c', color: '#9ca3af' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <div className="bg-gray-700 text-center py-2 text-xs text-gray-300 font-bold tracking-wide uppercase">
              {t('tool.beforeDesign')}
            </div>
            <div className="aspect-video relative overflow-hidden">
              <img
                src={tool.beforeImage}
                alt="Before"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: tool.color + '60' }}>
            <div
              className="text-center py-2 text-xs text-white font-bold tracking-wide uppercase"
              style={{ backgroundColor: tool.color }}
            >
              {t('tool.afterDesign')}
            </div>
            <div className="aspect-video relative overflow-hidden">
              <img
                src={tool.afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#160f2e] border-t border-b border-[#2a1f5c] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white font-black text-2xl md:text-3xl text-center mb-8">
            {t('tool.unlockTitle')} <span style={{ color: tool.accentColor }}>{t('tool.unlockHighlight')}</span> {t('tool.unlockSuffix')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {tool.profitItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tool.color + '20' }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: tool.color }} />
                </div>
                <span className="text-gray-300 font-semibold text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div
          className="rounded-2xl p-6 md:p-8 mb-8"
          style={{
            background: `linear-gradient(135deg, ${tool.color}15, ${tool.accentColor}08)`,
            border: `2px solid ${tool.color}30`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: tool.color + '20', border: `3px solid ${tool.color}` }}
            >
              <Shield className="w-10 h-10" style={{ color: tool.color }} />
            </div>
            <div>
              <p className="text-white font-black text-xl mb-2 text-center md:text-left">
                {t('tool.guaranteeTitle')}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t('tool.guaranteeBody')}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-5 mb-8"
          style={{ backgroundColor: '#1e1540', border: `1px solid ${tool.color}30` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-brand-400" />
            <p className="text-brand-400 font-black text-sm uppercase tracking-wide">
              {t('tool.hurryTitle')}
            </p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{tool.urgencyText}</p>
        </div>
      </div>

      <CTABlock onNavigate={onNavigate} color={tool.color} />

      <div className="pb-12" />
    </div>
  );
}
