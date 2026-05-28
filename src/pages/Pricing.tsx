import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingCard } from '../components/PricingCard';
import { useAuth } from '../context/AuthContext';

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Lifetime Access to All Design Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create professional designs, remove backgrounds, 
            animate photos, and build stunning graphics - all in one package.
          </p>
        </div>

        <div className="flex justify-center">
          <PricingCard onPurchase={handlePurchase} />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            What's Included in Your Purchase
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Design Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Background Remover</li>
                <li>• All-in-One Design App</li>
                <li>• Logo Creator</li>
                <li>• Advanced Image Editor</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Animation & Effects</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 3D Live Motion Photos</li>
                <li>• Ad Banner Animator</li>
                <li>• Smart Object Remover</li>
                <li>• Image to SVG Converter</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Business Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Video Survey Pro</li>
                <li>• Commercial License</li>
                <li>• Unlimited Usage</li>
                <li>• Cloud-Based Access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}