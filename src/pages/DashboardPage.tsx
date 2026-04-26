import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Play, BookOpen, Award, ChevronRight, Key, Copy, Check, ExternalLink, Eye, EyeOff, Lock } from 'lucide-react';
import { tools, localizeTool } from '../data/tools';
import ToolIcon from '../components/ToolIcon';
import { useLanguage } from '../context/LanguageContext';
import { supabase, UserToolCredential } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const onToolSelect = (toolId: string) => navigate(`/tool/${toolId}`);
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const localizedTools = tools.map((x) => localizeTool(x, lang));
  const [credentials, setCredentials] = useState<Record<string, UserToolCredential>>({});
  const [loadingCreds, setLoadingCreds] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingCreds(true);
      const { data } = await supabase
        .from('user_tool_credentials')
        .select('*')
        .eq('user_id', user.id);
      const map: Record<string, UserToolCredential> = {};
      (data ?? []).forEach((c: UserToolCredential) => { map[c.tool_id] = c; });
      setCredentials(map);
      setLoadingCreds(false);
    })();
  }, [user]);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField((c) => (c === key ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  };

  const stats = [
    { label: t('dashboard.toolsAvail'), value: '9', color: 'text-brand-400' },
    { label: t('dashboard.totalLessons'), value: '95', color: 'text-cyan-400' },
    { label: t('dashboard.projectsCreated'), value: '0', color: 'text-green-400' },
    { label: t('dashboard.daysActive'), value: '1', color: 'text-yellow-400' },
  ];

  const steps = [
    t('dashboard.step1'),
    t('dashboard.step2'),
    t('dashboard.step3'),
    t('dashboard.step4'),
  ];

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-500/20 border border-brand-500/40 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{t('dashboard.title')}</h1>
            <p className="text-gray-500 text-sm">{t('dashboard.welcome')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="card-dark rounded-xl p-5 text-center">
              <p className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-black text-white">{t('dashboard.myCredentials')}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">{t('dashboard.credentialsDesc')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localizedTools.map((tool) => {
              const cred = credentials[tool.id];
              const isActive = !loadingCreds && cred?.is_active && (cred.external_login || cred.external_password);
              return (
                <div
                  key={tool.id}
                  className="card-dark rounded-2xl p-5"
                  style={{ borderColor: tool.color + '30' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tool.color + '20' }}
                    >
                      <ToolIcon iconName={tool.icon} size={20} color={tool.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">{tool.name}</h3>
                      <p className="text-gray-500 text-xs truncate">{tool.subtitle}</p>
                    </div>
                  </div>

                  {loadingCreds ? (
                    <div className="h-24 rounded-xl bg-[#1e1540] animate-pulse" />
                  ) : !isActive ? (
                    <div className="flex items-center gap-2 bg-[#1e1540]/60 border border-[#2a1f5c] rounded-xl p-3 text-gray-500 text-xs">
                      <Lock className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {cred && !cred.is_active
                          ? t('dashboard.accessInactive')
                          : t('dashboard.noCredentialsYet')}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cred.platform_url && (
                        <a
                          href={cred.platform_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full text-xs font-bold py-2.5 rounded-xl transition-colors"
                          style={{ backgroundColor: tool.color, color: '#fff' }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {t('dashboard.openPlatform')}
                        </a>
                      )}
                      <CredRow
                        label={t('dashboard.login')}
                        value={cred.external_login}
                        onCopy={() => copy(`${tool.id}-login`, cred.external_login)}
                        copied={copiedField === `${tool.id}-login`}
                        copyText={t('dashboard.copy')}
                        copiedText={t('dashboard.copied')}
                      />
                      <CredRow
                        label={t('dashboard.password')}
                        value={cred.external_password}
                        isSecret
                        revealed={!!revealed[tool.id]}
                        onToggleReveal={() => setRevealed((r) => ({ ...r, [tool.id]: !r[tool.id] }))}
                        onCopy={() => copy(`${tool.id}-pw`, cred.external_password)}
                        copied={copiedField === `${tool.id}-pw`}
                        copyText={t('dashboard.copy')}
                        copiedText={t('dashboard.copied')}
                      />
                      {cred.notes && (
                        <div className="text-xs text-gray-400 bg-[#1e1540] border border-[#2a1f5c] rounded-xl p-3">
                          <p className="text-gray-500 font-semibold mb-1">{t('dashboard.notes')}</p>
                          {cred.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Play className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-black text-white">{t('dashboard.yourTools')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localizedTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className="card-dark rounded-xl p-5 text-left hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                style={{ borderColor: tool.color + '30' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tool.color + '20' }}
                  >
                    <ToolIcon iconName={tool.icon} size={22} color={tool.color} />
                  </div>
                  <h3 className="text-white font-black text-sm leading-tight">{tool.name}</h3>
                </div>
                <p className="text-gray-400 text-xs mb-3">{tool.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: tool.color }} />
                    <span className="text-xs font-semibold" style={{ color: tool.color }}>
                      {tool.lessons} {t('dashboard.lessons')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card-dark rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-brand-400" />
            <h3 className="text-white font-bold">{t('dashboard.gettingStarted')}</h3>
          </div>
          <ul className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-400 text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface CredRowProps {
  label: string;
  value: string;
  isSecret?: boolean;
  revealed?: boolean;
  onToggleReveal?: () => void;
  onCopy: () => void;
  copied: boolean;
  copyText: string;
  copiedText: string;
}

function CredRow({ label, value, isSecret, revealed, onToggleReveal, onCopy, copied, copyText, copiedText }: CredRowProps) {
  if (!value) return null;
  const display = isSecret && !revealed ? '•'.repeat(Math.min(value.length, 12)) : value;
  return (
    <div className="flex items-center gap-2 bg-[#1e1540] border border-[#2a1f5c] rounded-xl px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">{label}</p>
        <p className="text-white text-sm font-mono truncate">{display}</p>
      </div>
      {isSecret && (
        <button
          type="button"
          onClick={onToggleReveal}
          className="text-gray-500 hover:text-gray-300 p-1.5"
          aria-label="toggle"
        >
          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 px-2 py-1 rounded"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? copiedText : copyText}
      </button>
    </div>
  );
}


export default DashboardPage;
