import React, { useEffect, useState } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface SubscriptionData {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end, cancel_at_period_end')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse flex items-center">
          <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status !== 'active') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
          <span className="text-yellow-800 font-medium">No active subscription</span>
        </div>
      </div>
    );
  }

  const product = getProductByPriceId(subscription.price_id);
  const productName = product?.name || 'Premium Plan';

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <div className="flex items-center">
        <Crown className="w-5 h-5 text-indigo-600 mr-3" />
        <div>
          <span className="text-indigo-800 font-medium">{productName}</span>
          {subscription.cancel_at_period_end && (
            <span className="text-sm text-indigo-600 ml-2">(Canceling)</span>
          )}
        </div>
      </div>
    </div>
  );
}