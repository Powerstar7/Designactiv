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
  };

  return (
    <>
      <Hero />
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