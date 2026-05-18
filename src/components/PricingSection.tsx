import React, { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PricingSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripeProducts[0].priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const product = stripeProducts[0];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title', 'Simple, Transparent Pricing')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle', 'Get lifetime access to all our professional design tools at an unbeatable price')}
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2">
              <span className="font-semibold flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                {t('pricing.popular', 'Most Popular')}
                <Star className="w-4 h-4" />
              </span>
            </div>

            <div className="p-8 pt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-gray-500">
                    {t('pricing.oneTime', 'one-time')}
                  </span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {t('pricing.lifetime', 'Lifetime Access • No Monthly Fees')}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Access to all 9 professional design tools',
                  'Unlimited usage and exports',
                  'Commercial license included',
                  'Cloud-based - works on any device',
                  'Regular updates and new features',
                  'Priority customer support',
                  'No monthly subscription fees'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('pricing.processing', 'Processing...')}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    {t('pricing.getAccess', 'Get Instant Access')}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {t('pricing.secure', 'Secure payment powered by Stripe • 30-day money-back guarantee')}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {t('pricing.trusted', 'Trusted by thousands of designers and marketers worldwide')}
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">30-Day Guarantee</div>
            <div className="text-sm font-medium">Instant Access</div>
            <div className="text-sm font-medium">Lifetime Updates</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;