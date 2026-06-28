import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useLanguage, Lang } from '../context/LanguageContext';
import { SubscriptionStatus } from './SubscriptionStatus';

const langOptions: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'EN' },
  { code: 'pt', flag: '\u{1F1E7}\u{1F1F7}', label: 'PT' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'ES' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();
  const { subscription } = useSubscription();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.replace(/^\//, '') || 'home';

  const links = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.dashboard'), path: '/dashboard' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentFlag = langOptions.find((o) => o.code === lang)?.flag ?? '\u{1F1EC}\u{1F1E7}';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#080515] border-b border-[#2a1f5c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center group"
            aria-label="DesignActiv Home"
          >
            <img
              src="/design-activ-5-300x121.png"
              alt="DesignActiv"
              className="h-9 w-auto bg-white rounded-lg px-2 py-1 group-hover:scale-105 transition-transform"
            />
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`nav-link text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-brand-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
              >
                <Globe className="w-4 h-4" />
                <span>{currentFlag}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#160f2e] border border-[#2a1f5c] rounded-xl shadow-xl py-1 min-w-[120px] z-50">
                  {langOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setLang(opt.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                        lang === opt.code
                          ? 'text-brand-400 bg-brand-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{opt.flag}</span>
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block">
                  <SubscriptionStatus />
                </div>
                {subscription?.subscription_status === 'active' && (
                  <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Premium
                  </span>
                )}
                {profile?.is_admin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 rounded-full hover:bg-brand-500/20 transition-all"
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    Admin
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black text-xs">
                    {(profile?.full_name || user.email || 'U')[0]?.toUpperCase()}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Get Access
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className={`nav-link text-sm font-medium transition-colors ${
                    currentPath === 'login' ? 'text-brand-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#2a1f5c] py-4 space-y-1">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="flex items-center gap-2 px-4 py-2.5">
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => setLang(opt.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    lang === opt.code
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span className="font-medium text-xs">{opt.label}</span>
                </button>
              ))}
            </div>

            {user ? (
              <>
                {profile?.is_admin && (
                  <button
                    onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-brand-400 hover:bg-brand-500/10 transition-colors"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;