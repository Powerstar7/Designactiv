import React, { useState } from 'react';
import { Check, CreditCard } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handlePurchase = async (priceId: string, productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingProductId(productId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        navigate('/login');
        return;
      }

      const product = stripeProducts.find(p => p.priceId === priceId);
      if (!product) {
        throw new Error('Product not found');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {stripeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                <p className="mt-4 text-gray-600">{product.description}</p>
                
                <div className="mt-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {product.currencySymbol}{product.price}
                    </span>
                    {product.mode === 'subscription' && (
                      <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">Access to all tools</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">Commercial license included</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">Cloud-based platform</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-700">24/7 customer support</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handlePurchase(product.priceId, product.id)}
                    disabled={loadingProductId === product.id}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {loadingProductId === product.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Get Started
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}