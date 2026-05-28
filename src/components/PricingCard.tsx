import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';

interface PricingCardProps {
  onPurchase: (priceId: string) => Promise<void>;
}

export function PricingCard({ onPurchase }: PricingCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const product = stripeProducts[0]; // Single product

  const handlePurchase = async (priceId: string) => {
    setLoading(priceId);
    try {
      await onPurchase(priceId);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const features = [
    'Background Remover Tool',
    '3D Live Motion Photos',
    'All-In-One Design App',
    'Ad Banner Animator',
    'Logo Creator',
    'Smart Object Remover',
    'Image to SVG Converter',
    'Advanced Image Editor',
    'Video Survey Pro'
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <div className="text-4xl font-bold mb-2">
            {product.currencySymbol}{product.price}
          </div>
          <p className="text-blue-100">One-time payment</p>
        </div>
        
        <div className="px-6 py-8">
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => handlePurchase(product.priceId)}
            disabled={loading === product.priceId}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading === product.priceId ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Lifetime Access'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}