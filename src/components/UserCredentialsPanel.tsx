import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase, Profile, UserToolCredential } from '../lib/supabase';
import { tools, localizeTool } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ToolIcon from './ToolIcon';

interface Props {
  user: Profile;
  onBack: () => void;
}

type Draft = {
  external_login: string;
  external_password: string;
  platform_url: string;
  notes: string;
  is_active: boolean;
};

const emptyDraft = (): Draft => ({
  external_login: '',
  external_password: '',
  platform_url: '',
  notes: '',
  is_active: false,
});

export default function UserCredentialsPanel({ user, onBack }: Props) {
  const { t, lang } = useLanguage();
  const { profile: adminProfile } = useAuth();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savedFlags, setSavedFlags] = useState<Record<string, boolean>>({});
  const [savingToolId, setSavingToolId] = useState<string | null>(null);
  const [revealPw, setRevealPw] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [user.id]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_tool_credentials')
      .select('*')
      .eq('user_id', user.id);

    const existing = new Map<string, UserToolCredential>();
    (data ?? []).forEach((row: UserToolCredential) => existing.set(row.tool_id, row));

    const next: Record<string, Draft> = {};
    tools.forEach((tool) => {
      const row = existing.get(tool.id);
      next[tool.id] = row
        ? {
            external_login: row.external_login,
            external_password: row.external_password,
            platform_url: row.platform_url,
            notes: row.notes,
            is_active: row.is_active,
          }
        : emptyDraft();
    });
    setDrafts(next);
    setLoading(false);
  };

  const update = (toolId: string, patch: Partial<Draft>) => {
    setDrafts((d) => ({ ...d, [toolId]: { ...d[toolId], ...patch } }));
    setSavedFlags((f) => ({ ...f, [toolId]: false }));
  };

  const save = async (toolId: string) => {
    const draft = drafts[toolId];
    if (!draft) return;
    setSavingToolId(toolId);
    const { error } = await supabase.from('user_tool_credentials').upsert(
      {
        user_id: user.id,
        tool_id: toolId,
        external_login: draft.external_login,
        external_password: draft.external_password,
        platform_url: draft.platform_url,
        notes: draft.notes,
        is_active: draft.is_active,
        updated_at: new Date().toISOString(),
        updated_by: adminProfile?.id,
      },
      { onConflict: 'user_id,tool_id' }
    );
    setSavingToolId(null);
    if (!error) {
      setSavedFlags((f) => ({ ...f, [toolId]: true }));
      setTimeout(() => setSavedFlags((f) => ({ ...f, [toolId]: false })), 2500);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('admin.backToUsers')}
      </button>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black">
          {(user.full_name || user.email)[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{user.full_name || user.email}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">{t('admin.selectUserHint')}</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map((baseTool) => {
            const tool = localizeTool(baseTool, lang);
            const draft = drafts[tool.id] ?? emptyDraft();
            const isSaving = savingToolId === tool.id;
            const isSaved = savedFlags[tool.id];
            return (
              <div
                key={tool.id}
                className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: tool.color + '22', border: `1px solid ${tool.color}55` }}
                    >
                      <ToolIcon iconName={tool.icon} size={20} color={tool.color} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{tool.name}</p>
                      <p className="text-gray-500 text-xs">{tool.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(tool.id, { is_active: !draft.is_active })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all inline-flex items-center gap-1.5 ${
                        draft.is_active
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {draft.is_active ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> {t('admin.toolActive')}</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> {t('admin.toolInactive')}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs font-semibold block mb-1.5">
                      {t('admin.platformUrl')}
                    </label>
                    <input
                      type="url"
                      value={draft.platform_url}
                      onChange={(e) => update(tool.id, { platform_url: e.target.value })}
                      placeholder="https://app.example.com"
                      className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold block mb-1.5">
                      {t('admin.externalLogin')}
                    </label>
                    <input
                      type="text"
                      value={draft.external_login}
                      onChange={(e) => update(tool.id, { external_login: e.target.value })}
                      autoComplete="off"
                      className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold block mb-1.5">
                      {t('admin.externalPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={revealPw[tool.id] ? 'text' : 'password'}
                        value={draft.external_password}
                        onChange={(e) => update(tool.id, { external_password: e.target.value })}
                        autoComplete="new-password"
                        className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setRevealPw((r) => ({ ...r, [tool.id]: !r[tool.id] }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {revealPw[tool.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-semibold block mb-1.5">
                      {t('admin.credentialsNotes')}
                    </label>
                    <input
                      type="text"
                      value={draft.notes}
                      onChange={(e) => update(tool.id, { notes: e.target.value })}
                      className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  {isSaved && (
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t('admin.credentialsSaved')}
                    </span>
                  )}
                  <button
                    onClick={() => save(tool.id)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {t('admin.saveAll')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
