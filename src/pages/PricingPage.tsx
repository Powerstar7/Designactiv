import React from 'react';
import { PricingCard } from '../components/PricingCard';
import { useStripeCheckout } from '../hooks/useStripeCheckout';

export function PricingPage() {
  const { createCheckoutSession } = useStripeCheckout();

  const handlePurchase = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Lifetime Access to All Design Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your design workflow with our complete suite of professional tools. 
            One payment, lifetime access to everything you need.
          </p>
        </div>
        
        <PricingCard onPurchase={handlePurchase} />
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Why Choose Our Design Pack?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-900">Lifetime Access</div>
                <div>Pay once, use forever</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Commercial License</div>
                <div>Use for client projects</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Cloud-Based</div>
                <div>Works on any device</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}