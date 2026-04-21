import { useState, useRef, useEffect } from 'react';
import { Menu, X, Zap, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Profile } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Lang } from '../context/LanguageContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  profile: Profile | null;
  onSignOut: () => void;
}

const langOptions: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'EN' },
  { code: 'pt', flag: '\u{1F1E7}\u{1F1F7}', label: 'PT' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', label: 'ES' },
];

export default function Header({ currentPage, onNavigate, user, profile, onSignOut }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const links = [
    { label: t('nav.home'), page: 'home' },
    { label: t('nav.dashboard'), page: 'dashboard' },
    { label: t('nav.shop'), page: 'shop' },
  ];

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
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

  return (
    <header className="bg-[#080515] border-b border-[#2a1f5c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              design<span className="text-brand-500">activ</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`nav-link text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? 'text-brand-400'
                    : 'text-gray-300 hover:text-white'
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
                {profile?.is_admin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 rounded-full hover:bg-brand-500/20 transition-all"
                  >
                    <LayoutDashboard className="w-3 h-3" />
                    {t('nav.admin')}
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black text-xs">
                    {(profile?.full_name || user.email || 'U')[0]?.toUpperCase()}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title={t('nav.signOut')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('account')}
                className={`nav-link text-sm font-medium transition-colors ${
                  currentPage === 'account' ? 'text-brand-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                {t('nav.account')}
              </button>
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
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.page
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
                    onClick={() => { onNavigate('admin'); setMobileOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-brand-400 hover:bg-brand-500/10 transition-colors"
                  >
                    {t('nav.adminPanel')}
                  </button>
                )}
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <button
                onClick={() => { onNavigate('account'); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'account'
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t('nav.account')}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
