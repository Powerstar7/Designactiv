import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import { PricingSection } from '../components/PricingSection';
import AgencySection from '../components/AgencySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTABanner from '../components/CTABanner';
import FeaturesHighlight from '../components/FeaturesHighlight';

export function HomePage() {
  const navigate = useNavigate();
  const onNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'pricing') navigate('/pricing');
    else if (page === 'account' || page === 'login') navigate('/login');
    else navigate(`/${page}`);
  };
  const onToolSelect = (toolId: string) => navigate(`/tool/${toolId}`);

  return (
    <>
      <Hero onNavigate={onNavigate} />
      <FeaturesHighlight />
      <ProductsSection onToolSelect={onToolSelect} />
      <PricingSection />
      <AgencySection onNavigate={onNavigate} />
      <TestimonialsSection />
      <CTABanner onNavigate={onNavigate} />
    </>
  );
}

export default HomePage;
