import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { signIn, signUp, profile } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!email || !password) {
      setError(t('account.fillFields'));
      return;
    }
    if (mode === 'register' && !name) {
      setError(t('account.enterName'));
      return;
    }
    if (password.length < 6) {
      setError(t('account.passwordLength'));
      return;
    }
    setLoading(true);
    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      if (profile?.is_admin) {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    } else {
      const { error: err } = await signUp(email, password, name);
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      setSuccess(t('account.accountCreated'));
      setMode('login');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500/20 border border-brand-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? t('account.welcomeBack') : t('account.createAccount')}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? t('account.signInDesc') : t('account.joinDesc')}
          </p>
        </div>

        <div className="card-dark rounded-2xl p-8">
          <div className="flex bg-[#1e1540] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === 'login' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('account.signIn')}
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === 'register' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('account.create')}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-xs">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-1.5">{t('account.fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('account.namePlaceholder')}
                    className="w-full bg-[#1e1540] border border-[#3d2a6e] text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1.5">{t('account.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('account.emailPlaceholder')}
                  className="w-full bg-[#1e1540] border border-[#3d2a6e] text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-1.5">{t('account.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-[#1e1540] border border-[#3d2a6e] text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  {t('account.signIn')}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  {t('account.create')}
                </>
              )}
            </button>
          </div>

          {mode === 'login' && (
            <p className="text-center text-gray-600 text-sm mt-4">
              <button className="text-brand-400 hover:text-brand-300 transition-colors">{t('account.forgot')}</button>
            </p>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          {t('account.agreeTerms')}{' '}
          <span onClick={() => onNavigate('terms')} className="text-brand-400 cursor-pointer hover:underline">{t('account.termsLink')}</span> {t('account.andText')}{' '}
          <span onClick={() => onNavigate('privacy')} className="text-brand-400 cursor-pointer hover:underline">{t('account.privacyLink')}</span>
        </p>
      </div>
    </div>
  );
}
