import React, { useEffect, useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface SubscriptionData {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface OrderData {
  order_status: string;
  payment_status: string;
  order_date: string;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch subscription data
      const { data: subData } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (subData) {
        setSubscription(subData);
      }

      // Fetch order data
      const { data: orderData } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (orderData) {
        setOrders(orderData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Check if user has active subscription or completed order
  const hasActiveSubscription = subscription?.subscription_status === 'active';
  const hasCompletedOrder = orders.some(order => 
    order.order_status === 'completed' && order.payment_status === 'paid'
  );

  if (hasActiveSubscription || hasCompletedOrder) {
    const product = subscription?.price_id ? getProductByPriceId(subscription.price_id) : null;
    
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Crown className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Active Plan</h3>
        </div>
        
        <div className="flex items-center mb-2">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-gray-700 font-medium">
            {product?.name || '9 Apps All-in-one Design Pack'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600">
          {hasActiveSubscription ? 'Active Subscription' : 'Lifetime Access'}
        </p>
        
        {hasActiveSubscription && subscription?.current_period_end && (
          <p className="text-sm text-gray-500 mt-2">
            {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
            {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Plan</h3>
      <p className="text-gray-600">
        Purchase the 9 Apps All-in-one Design Pack to access all tools.
      </p>
    </div>
  );
}