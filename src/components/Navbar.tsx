import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SubscriptionStatus } from './SubscriptionStatus';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.tools'), href: '/tools', protected: true },
    { name: 'Pricing', href: '/pricing' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/design-activ-5-300x121.png"
                alt="DesignActiv"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="es">ES</option>
            </select>

            <SubscriptionStatus />

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.signOut')}
                    </button>
                    {!user.email?.includes('@') && (
                      <Link
                        to="/checkout"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <CreditCard className="w-4 h-4" />
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/checkout"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Access
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {user && (
              <div className="px-3 py-2">
                <SubscriptionStatus />
              </div>
            )}
            {navigation.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {user ? (
              <div className="border-t pt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="border-t pt-4 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.signUp')}
                </Link>
              </div>
            )}

            {/* Language Selector */}
            <div className="px-3 py-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}