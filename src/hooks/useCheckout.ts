import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (priceId: string) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading,
  };
}