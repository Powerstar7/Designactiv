import React from 'react';
import { stripeProducts } from '../stripe-config';
import { PricingCard } from '../components/PricingCard';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Lifetime Access to All Design Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the complete collection of professional design tools with a single purchase. 
            No monthly fees, no limits, just unlimited creativity.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {stripeProducts.map((product) => (
              <PricingCard 
                key={product.id} 
                product={product} 
                featured={true}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              What's Included in Your Purchase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">9</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Design Tools</h4>
                <p className="text-gray-600">Complete suite of professional design applications</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">∞</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Usage</h4>
                <p className="text-gray-600">Create as many designs as you want, no restrictions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Commercial License</h4>
                <p className="text-gray-600">Use for client work and sell your creations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};