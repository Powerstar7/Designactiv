import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { StripeProduct } from '../stripe-config';

interface ProductCardProps {
  product: StripeProduct;
  onPurchase: (priceId: string) => Promise<void>;
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase(product.priceId);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
        
        <div className="mb-8">
          <span className="text-4xl font-bold text-indigo-600">
            {product.currencySymbol}{product.price}
          </span>
          {product.mode === 'payment' && (
            <span className="text-gray-500 ml-2">one-time</span>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center text-green-600">
            <Check className="w-5 h-5 mr-2" />
            <span>Lifetime access</span>
          </div>
          <div className="flex items-center justify-center text-green-600">
            <Check className="w-5 h-5 mr-2" />
            <span>All design tools included</span>
          </div>
          <div className="flex items-center justify-center text-green-600">
            <Check className="w-5 h-5 mr-2" />
            <span>No monthly fees</span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
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
  );
}