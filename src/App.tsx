import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DashboardPage from './pages/DashboardPage';
import PrivacyPage from './pages/PrivacyPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import ToolPage from './components/ToolPage';
import CheckoutPage from './pages/CheckoutPage';
import TermsPage from './pages/TermsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { tools } from './data/tools';

type Page =
  | 'home'
  | 'shop'
  | 'dashboard'
  | 'privacy'
  | 'account'
  | 'admin'
  | 'terms'
  | 'support'
  | 'checkout'
  | 'tool';

function getInitialPage(): Page {
  const path = window.location.pathname.replace(/^\//, '') || 'home';
  const valid: Page[] = ['home', 'shop', 'dashboard', 'privacy', 'account', 'admin', 'terms', 'support', 'checkout'];
  return valid.includes(path as Page) ? (path as Page) : 'home';
}

function SupportInline() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center px-4">
      <div className="card-dark rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-2xl font-black text-white mb-4">{t('support.title')}</h1>
        <p className="text-gray-400 mb-6 text-sm">{t('support.body')}</p>
        <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl p-4">
          <p className="text-brand-400 font-bold">support@designactiv.com</p>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedToolId(null);
    window.history.pushState(null, '', `/${page === 'home' ? '' : page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentPage('tool');
    window.history.pushState(null, '', '/tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'home';
      const valid: Page[] = ['home', 'shop', 'dashboard', 'privacy', 'account', 'admin', 'terms', 'support', 'checkout'];
      setCurrentPage(valid.includes(path as Page) ? (path as Page) : 'home');
      setSelectedToolId(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (!loading && user && profile) {
      if (currentPage === 'account') {
        if (profile.is_admin) {
          handleNavigate('admin');
        } else {
          handleNavigate('dashboard');
        }
      }
    }
  }, [user, profile, loading]);

  const selectedTool = selectedToolId ? tools.find((t) => t.id === selectedToolId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isAdminPage = currentPage === 'admin';
  const hideHeaderFooter = isAdminPage;

  const renderPage = () => {
    if (currentPage === 'tool' && selectedTool) {
      return (
        <ToolPage
          tool={selectedTool}
          onBack={() => handleNavigate('shop')}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onToolSelect={handleToolSelect} onNavigate={handleNavigate} />;
      case 'shop':
        return <ShopPage onToolSelect={handleToolSelect} onNavigate={handleNavigate} />;
      case 'dashboard':
        if (!loading && !user) { handleNavigate('account'); return null; }
        return <DashboardPage onToolSelect={handleToolSelect} />;
      case 'admin':
        if (!loading && (!user || !profile?.is_admin)) { handleNavigate('account'); return null; }
        return <AdminPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'account':
        return <AccountPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage />;
      case 'support':
        return <SupportInline />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onToolSelect={handleToolSelect} onNavigate={handleNavigate} />;
    }
  };

  if (hideHeaderFooter) {
    return <div className="min-h-screen bg-[#080515]">{renderPage()}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} user={user} profile={profile} onSignOut={() => handleNavigate('account')} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </LanguageProvider>
  );
}
