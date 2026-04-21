import { Zap, Mail, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#080515] border-t border-[#2a1f5c]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-white font-black text-xl">
                design<span className="text-brand-500">activ</span>
              </span>
            </button>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
              <Mail className="w-4 h-4" />
              <span>support@designactiv.com</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{t('footer.products')}</h4>
            <ul className="space-y-2">
              {[
                'Background Remover',
                '3D Live Motion Photos',
                'All-In-One Design App',
                'Ad Banner Animator',
                'Logo Creator',
                'Smart Object Remover',
                'Image to SVG Converter',
                'Advanced Image Editor',
                'Video Survey Pro',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-gray-500 hover:text-brand-400 transition-colors text-sm"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {[
                { label: t('footer.home'), page: 'home' },
                { label: t('footer.shop'), page: 'shop' },
                { label: t('footer.dashboard'), page: 'dashboard' },
                { label: t('footer.account'), page: 'account' },
                { label: t('footer.privacy'), page: 'privacy' },
                { label: t('footer.terms'), page: 'terms' },
                { label: t('footer.support'), page: 'support' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-gray-500 hover:text-brand-400 transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a1f5c] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {year} DesignActiv. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{t('footer.secured')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
