import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import { PricingSection } from '../components/PricingSection';
import AgencySection from '../components/AgencySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTABanner from '../components/CTABanner';
import FeaturesHighlight from '../components/FeaturesHighlight';

export function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <PricingSection />
      <AgencySection />
      <FeaturesHighlight />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}

export default HomePage;
