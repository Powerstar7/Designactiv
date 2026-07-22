import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import YouTubePlayer from './YouTubePlayer';

const HERO_VIDEO_ID = 's9MvSFNVmzk';

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-[#080515] to-[#0f0a1e] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-6">
            <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">{t('hero.badge')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 max-w-5xl mx-auto">
            {t('hero.title1')} <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{t('hero.titleHighlight')}</span> {t('hero.title2')}
            <br className="hidden md:block" /> {t('hero.title3')}
            <br className="hidden md:block" />
            <span className="text-2xl md:text-4xl lg:text-5xl text-gray-300 font-bold">{t('hero.title4')}</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/checkout')}
              className="animate-pulse-btn bg-brand-500 hover:bg-brand-600 text-white font-black text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl glow-brand"
            >
              {t('hero.cta')}
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold transition-colors group"
            >
              {t('hero.viewTools')}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>{t('hero.noCreditCard')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>{t('hero.cloudBased')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>{t('hero.guarantee')}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <YouTubePlayer videoId={HERO_VIDEO_ID} accentColor="#a855f7" />
          <p className="text-center text-gray-500 text-sm mt-4">
            {t('hero.videoCaption')}
          </p>
        </div>
      </div>
    </section>
  );
}
