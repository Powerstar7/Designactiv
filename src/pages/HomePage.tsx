import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import PricingSection from '../components/PricingSection';
import AgencySection from '../components/AgencySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTABanner from '../components/CTABanner';
import FeaturesHighlight from '../components/FeaturesHighlight';

interface HomePageProps {
  onToolSelect: (toolId: string) => void;
  onNavigate: (page: string) => void;
}

export default function HomePage({ onToolSelect, onNavigate }: HomePageProps) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <FeaturesHighlight />
      <ProductsSection onToolSelect={onToolSelect} />
      <PricingSection onNavigate={onNavigate} />
      <AgencySection onNavigate={onNavigate} />
      <TestimonialsSection />
      <CTABanner onNavigate={onNavigate} />
    </>
  );
}
