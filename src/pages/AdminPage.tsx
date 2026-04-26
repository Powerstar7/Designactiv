import { useState, useEffect } from 'react';
import { Shield, Users, Video, LogOut, ChevronRight, Search, CheckCircle2, XCircle, CreditCard as Edit3, Save, X, RefreshCw, BarChart3, Eye, EyeOff, UserCheck, Key, TrendingUp, Home, Wrench, ExternalLink } from 'lucide-react';
import { supabase, Profile, ToolVideo } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { tools } from '../data/tools';
import { useLanguage } from '../context/LanguageContext';
import UserCredentialsPanel from '../components/UserCredentialsPanel';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AdminTab = 'overview' | 'users' | 'videos';

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<Profile[]>([]);
  const [videos, setVideos] = useState<ToolVideo[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [videoEdits, setVideoEdits] = useState<Record<string, { youtube_video_id: string; title: string; description: string }>>({});
  const [savingVideo, setSavingVideo] = useState<string | null>(null);
  const [togglingUser, setTogglingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [credentialsCount, setCredentialsCount] = useState(0);

  useEffect(() => {
    loadUsers();
    loadVideos();
    loadCredentialsCount();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'videos') loadVideos();
  }, [activeTab]);

  const loadCredentialsCount = async () => {
    const { count } = await supabase
      .from('user_tool_credentials')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    setCredentialsCount(count ?? 0);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data ?? []);
    setLoadingUsers(false);
  };

  const loadVideos = async () => {
    setLoadingVideos(true);
    const { data } = await supabase.from('tool_videos').select('*');
    const videoMap: Record<string, ToolVideo> = {};
    (data ?? []).forEach((v: ToolVideo) => { videoMap[v.tool_id] = v; });
    setVideos(data ?? []);
    const edits: Record<string, { youtube_video_id: string; title: string; description: string }> = {};
    tools.forEach((tool) => {
      const saved = videoMap[tool.id];
      edits[tool.id] = {
        youtube_video_id: saved?.youtube_video_id ?? tool.videoId,
        title: saved?.title ?? tool.name,
        description: saved?.description ?? tool.description,
      };
    });
    setVideoEdits(edits);
    setLoadingVideos(false);
  };

  const saveVideo = async (toolId: string) => {
    setSavingVideo(toolId);
    const edit = videoEdits[toolId];
    const { error } = await supabase.from('tool_videos').upsert({
      tool_id: toolId,
      youtube_video_id: edit.youtube_video_id,
      title: edit.title,
      description: edit.description,
      updated_at: new Date().toISOString(),
      updated_by: profile?.id,
    }, { onConflict: 'tool_id' });
    if (!error) setEditingVideo(null);
    setSavingVideo(null);
  };

  const toggleAccess = async (userId: string, current: boolean) => {
    setTogglingUser(userId);
    await supabase.from('profiles').update({ has_access: !current }).eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, has_access: !current } : u));
    setTogglingUser(null);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  const filteredUsers = users.filter(
    (u) => u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const accessUsers = users.filter((u) => u.has_access).length;
  const adminUsers = users.filter((u) => u.is_admin).length;

  return (
    <div className="min-h-screen bg-[#080515] flex">
      <aside className="w-64 bg-[#0f0a1e] border-r border-[#2a1f5c] flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-[#2a1f5c]">
          <div className="bg-white rounded-xl p-2 mb-3 flex items-center justify-center">
            <img src="/design-activ-5-300x121.png" alt="DesignActiv" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2 px-1">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <p className="text-brand-400 font-bold text-xs uppercase tracking-wider">{t('nav.adminPanel')}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {([
            { id: 'overview', label: t('admin.overview'), icon: BarChart3 },
            { id: 'users', label: t('admin.users'), icon: Users },
            { id: 'videos', label: t('admin.videos'), icon: Video },
          ] as { id: AdminTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeTab === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2a1f5c] space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm font-semibold"
          >
            <Home className="w-4 h-4" />
            {t('admin.viewSite')}
            <ExternalLink className="w-3 h-3 ml-auto" />
          </button>
          <div className="px-4 py-3 rounded-xl bg-[#160f2e]">
            <p className="text-white text-xs font-bold truncate">{profile?.full_name || 'Admin'}</p>
            <p className="text-gray-500 text-xs truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            {t('admin.signOut')}
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">{t('admin.dashboard')}</h1>
            <p className="text-gray-500 text-sm mb-8">{t('admin.welcome')} {profile?.full_name || 'Admin'}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: t('admin.totalUsers'), value: totalUsers, icon: Users, color: 'brand' },
                { label: t('admin.paidUsers'), value: accessUsers, icon: UserCheck, color: 'green' },
                { label: t('admin.configuredVideos'), value: videos.length, icon: Video, color: 'cyan' },
                { label: t('admin.credentialsActive'), value: credentialsCount, icon: Key, color: 'amber' },
              ].map(({ label, value, icon: Icon, color }) => {
                const colorMap: Record<string, { bg: string; text: string }> = {
                  brand: { bg: 'bg-brand-500/15', text: 'text-brand-400' },
                  green: { bg: 'bg-green-500/15', text: 'text-green-400' },
                  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
                  amber: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
                };
                const c = colorMap[color];
                return (
                  <div key={label} className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl p-5 hover:border-brand-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-500 text-xs font-semibold">{label}</p>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg}`}>
                        <Icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white mb-2">{value}</p>
                    <div className="inline-flex items-center gap-1 text-xs text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-semibold">{t('admin.active')}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-black flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-400" />
                    {t('admin.recentUsers')}
                  </h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
                  >
                    {t('admin.viewAll')}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs mb-4">{t('admin.recentUsersDesc')}</p>

                {loadingUsers ? (
                  <div className="flex items-center justify-center py-10">
                    <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-600 text-sm py-6 text-center">{t('admin.noRecentUsers')}</p>
                ) : (
                  <ul className="divide-y divide-[#2a1f5c]">
                    {users.slice(0, 5).map((u) => (
                      <li key={u.id} className="flex items-center gap-3 py-3">
                        <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black text-xs flex-shrink-0">
                          {(u.full_name || u.email)[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{u.full_name || '—'}</p>
                          <p className="text-gray-500 text-xs truncate">{u.email}</p>
                        </div>
                        <span className="text-gray-500 text-xs flex-shrink-0">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl p-6">
                <h3 className="text-white font-black mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-400" />
                  {t('admin.systemActivity')}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{t('admin.activityDesc')}</p>

                <ul className="space-y-3">
                  {[
                    { label: t('admin.toolsAvailable'), value: `${tools.length} ${t('admin.apps')}`, icon: Wrench, color: 'text-brand-400' },
                    { label: t('admin.videosConfigured'), value: `${videos.length} / ${tools.length}`, icon: Video, color: 'text-cyan-400' },
                    { label: t('admin.totalCredentials'), value: `${credentialsCount} ${t('admin.active')}`, icon: Key, color: 'text-amber-400' },
                    { label: t('admin.adminAccounts'), value: `${adminUsers}`, icon: Shield, color: 'text-blue-400' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <li key={label} className="flex items-center gap-3 py-2 border-b border-[#2a1f5c] last:border-b-0">
                      <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                      <span className="text-gray-300 text-sm flex-1">{label}</span>
                      <span className="text-white text-sm font-bold">{value}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-5 border-t border-[#2a1f5c] space-y-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1e1540] hover:bg-[#2a1f5c] transition-all text-sm text-gray-300 hover:text-white"
                  >
                    <Users className="w-4 h-4 text-brand-400" />
                    {t('admin.manageUsers')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1e1540] hover:bg-[#2a1f5c] transition-all text-sm text-gray-300 hover:text-white"
                  >
                    <Video className="w-4 h-4 text-brand-400" />
                    {t('admin.updateVideos')}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && selectedUser && (
          <UserCredentialsPanel user={selectedUser} onBack={() => setSelectedUser(null)} />
        )}

        {activeTab === 'users' && !selectedUser && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-white mb-1">{t('admin.userManagement')}</h1>
                <p className="text-gray-500 text-sm">{totalUsers} {t('admin.registeredUsers')}</p>
              </div>
              <button
                onClick={loadUsers}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t('admin.refresh')}
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchPlaceholder')}
                className="w-full bg-[#160f2e] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-16">
                <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a1f5c]">
                      <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">{t('admin.user')}</th>
                      <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">{t('admin.joined')}</th>
                      <th className="text-center text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">{t('admin.adminCol')}</th>
                      <th className="text-center text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">{t('admin.access')}</th>
                      <th className="text-center text-gray-500 text-xs font-semibold uppercase tracking-wider px-6 py-4">{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a1f5c]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500 text-sm py-12">{t('admin.noUsers')}</td>
                      </tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-black text-xs">
                              {(u.full_name || u.email)[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">{u.full_name || '—'}</p>
                              <p className="text-gray-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.is_admin ? (
                            <span className="inline-flex items-center gap-1 text-brand-400 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="text-gray-600 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.has_access ? (
                            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> {t('admin.active')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 text-xs font-semibold px-2 py-1 rounded-full">
                              <XCircle className="w-3 h-3" /> {t('admin.inactive')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleAccess(u.id, u.has_access)}
                              disabled={togglingUser === u.id || u.is_admin}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
                                u.has_access
                                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              }`}
                            >
                              {togglingUser === u.id ? (
                                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                              ) : u.has_access ? (
                                <><EyeOff className="w-3 h-3 inline mr-1" />{t('admin.revoke')}</>
                              ) : (
                                <><Eye className="w-3 h-3 inline mr-1" />{t('admin.grant')}</>
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedUser(u)}
                              disabled={u.is_admin}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all disabled:opacity-40 inline-flex items-center gap-1"
                            >
                              <Key className="w-3 h-3" />
                              {t('admin.credentials')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-white mb-1">{t('admin.toolVideos')}</h1>
                <p className="text-gray-500 text-sm">{t('admin.videoDesc')}</p>
              </div>
              <button
                onClick={loadVideos}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t('admin.refresh')}
              </button>
            </div>

            {loadingVideos ? (
              <div className="flex items-center justify-center py-16">
                <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {tools.map((tool) => {
                  const isEditing = editingVideo === tool.id;
                  const edit = videoEdits[tool.id] ?? { youtube_video_id: tool.videoId, title: tool.name, description: tool.description };
                  const saved = videos.find((v) => v.tool_id === tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs"
                            style={{ backgroundColor: tool.color + '33', border: `1px solid ${tool.color}55` }}
                          >
                            <Video className="w-4 h-4" style={{ color: tool.color }} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{tool.name}</p>
                            <p className="text-gray-500 text-xs">{tool.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {saved && (
                            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{t('admin.saved')}</span>
                          )}
                          {!isEditing ? (
                            <button
                              onClick={() => setEditingVideo(tool.id)}
                              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs font-semibold transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              {t('admin.edit')}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveVideo(tool.id)}
                                disabled={savingVideo === tool.id}
                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                              >
                                {savingVideo === tool.id ? (
                                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <Save className="w-3.5 h-3.5" />
                                )}
                                {t('admin.save')}
                              </button>
                              <button
                                onClick={() => setEditingVideo(null)}
                                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-semibold transition-colors px-2"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="px-5 pb-5 border-t border-[#2a1f5c] pt-4 space-y-3">
                          <div>
                            <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('admin.videoId')}</label>
                            <input
                              type="text"
                              value={edit.youtube_video_id}
                              onChange={(e) => setVideoEdits({ ...videoEdits, [tool.id]: { ...edit, youtube_video_id: e.target.value } })}
                              placeholder="e.g. HdCDDWl9ymM"
                              className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                            />
                            <p className="text-gray-600 text-xs mt-1">From youtube.com/watch?v=<strong className="text-gray-400">VIDEO_ID</strong></p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('admin.titleOverride')}</label>
                            <input
                              type="text"
                              value={edit.title}
                              onChange={(e) => setVideoEdits({ ...videoEdits, [tool.id]: { ...edit, title: e.target.value } })}
                              className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('admin.description')}</label>
                            <textarea
                              value={edit.description}
                              onChange={(e) => setVideoEdits({ ...videoEdits, [tool.id]: { ...edit, description: e.target.value } })}
                              rows={2}
                              className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                            />
                          </div>
                          {edit.youtube_video_id && (
                            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                              <iframe
                                src={`https://www.youtube.com/embed/${edit.youtube_video_id}`}
                                className="w-full h-full"
                                allowFullScreen
                                title="Preview"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
