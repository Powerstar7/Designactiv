import React, { useState, useEffect } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserSubscription {
  subscription_status: string | null;
  price_id: string | null;
}

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchSubscriptionStatus();
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  // Check if user has active access (either through subscription or direct purchase)
  const hasAccess = subscription?.subscription_status === 'active' || 
                   subscription?.price_id === 'price_1TQvbhHfhBIMfl3suBOCxGSX';

  if (hasAccess) {
    return (
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 px-3 py-1 rounded-full">
        <Crown className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">Premium Access</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
      <AlertCircle className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium text-gray-600">Free Access</span>
    </div>
  );
}