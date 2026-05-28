import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import { PricingSection } from '../components/PricingSection';
import AgencySection from '../components/AgencySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTABanner from '../components/CTABanner';
import FeaturesHighlight from '../components/FeaturesHighlight';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const onNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'pricing') navigate('/pricing');
  };

  return (
    <>
      <Hero />
      <div>
        {user ? (
          <Link
            to="/tools"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            {t('home.hero.cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        ) : (
          <Link
            to="/pricing"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <Link
            to="/tools"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Access Your Tools
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        ) : (
          <Link
            to="/pricing"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            {t('home.cta.button')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        )}
      </div>
      <ProductsSection />
      <PricingSection />
      <AgencySection />
      <FeaturesHighlight />
      <TestimonialsSection />
      <CTABanner onNavigate={onNavigate} />
    </>
  );
}

export default HomePage;