import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import type { StripeProduct } from '../stripe-config';

interface CheckoutButtonProps {
  product: StripeProduct;
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ product, className = '', children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.priceId,
          mode: product.mode,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
        bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
        text-white shadow-lg hover:shadow-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          {children || 'Get Access Now'}
        </>
      )}
    </button>
  );
}