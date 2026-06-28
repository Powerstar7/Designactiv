import React from 'react';
import { Check } from 'lucide-react';
import { StripeProduct } from '../stripe-config';

interface PricingCardProps {
  product: StripeProduct;
  featured?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ product, featured = false }) => {
  const handleCheckout = () => {
    window.location.href = product.checkoutUrl;
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-xl p-8 ${
      featured ? 'ring-2 ring-blue-500 scale-105' : ''
    }`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="mb-8">
          <span className="text-5xl font-bold text-gray-900">
            {product.currencySymbol}{product.price}
          </span>
          {product.mode === 'payment' && (
            <span className="text-gray-500 ml-2">one-time</span>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Access to all 9 design tools</span>
          </li>
          <li className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Lifetime access</span>
          </li>
          <li className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Commercial license included</span>
          </li>
          <li className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Priority customer support</span>
          </li>
        </ul>

        <button
          onClick={handleCheckout}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            featured
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          } flex items-center justify-center`}
        >
          Get Lifetime Access
        </button>
      </div>
    </div>
  );
};
