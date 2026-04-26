import { Mail, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  const go = (path: string) => () => navigate(path);

  return (
    <footer className="bg-[#080515] border-t border-[#2a1f5c]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <button onClick={go('/')} className="inline-block mb-4" aria-label="DesignActiv Home">
              <img
                src="/design-activ-5-300x121.png"
                alt="DesignActiv"
                className="h-10 w-auto bg-white rounded-lg px-3 py-1.5 hover:scale-105 transition-transform"
              />
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
                  <button onClick={go('/')} className="text-gray-500 hover:text-brand-400 transition-colors text-sm">
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
                { label: t('footer.home'), path: '/' },
                { label: t('footer.dashboard'), path: '/dashboard' },
                { label: 'Pricing', path: '/pricing' },
                { label: t('footer.account'), path: '/login' },
                { label: t('footer.privacy'), path: '/privacy' },
                { label: t('footer.terms'), path: '/terms' },
              ].map((item) => (
                <li key={item.path}>
                  <button onClick={go(item.path)} className="text-gray-500 hover:text-brand-400 transition-colors text-sm">
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

export default Footer;
