import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getProductByPriceId } from '../stripe-config';

interface SubscriptionData {
  customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSubscription(data || null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionPlan = () => {
    if (!subscription?.price_id) return null;
    
    const product = getProductByPriceId(subscription.price_id);
    return product?.name || 'Unknown Plan';
  };

  const hasActiveSubscription = () => {
    return subscription?.subscription_status === 'active' || 
           subscription?.subscription_status === 'trialing';
  };

  const hasLifetimeAccess = () => {
    // For one-time payments, check if user has any completed orders
    return subscription?.customer_id !== null;
  };

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    getSubscriptionPlan,
    hasActiveSubscription,
    hasLifetimeAccess,
  };
}