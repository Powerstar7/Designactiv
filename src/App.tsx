import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolPage } from './pages/ToolPage';
import { AdminPage } from './pages/AdminPage';
import { AffiliateRegisterPage } from './pages/AffiliateRegisterPage';
import { AffiliateDashboardPage } from './pages/AffiliateDashboardPage';
import { AffiliateAdminPage } from './pages/AffiliateAdminPage';
import ShopPage from './pages/ShopPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AffiliateTracker } from './components/AffiliateTracker';

function ChromeHeader() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Header />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AffiliateTracker />
          <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
            <ChromeHeader />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/affiliate/register" element={<AffiliateRegisterPage />} />
                <Route
                  path="/affiliate/dashboard"
                  element={
                    <ProtectedRoute>
                      <AffiliateDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tool/:id"
                  element={
                    <ProtectedRoute>
                      <ToolPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/affiliates"
                  element={
                    <AdminRoute>
                      <AffiliateAdminPage />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
