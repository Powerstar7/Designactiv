import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SubscriptionStatus } from './SubscriptionStatus';

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              DesignActiv
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <SubscriptionStatus />
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Pricing
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}