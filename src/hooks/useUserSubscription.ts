import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface UserSubscription {
  price_id: string | null;
  subscription_status: string | null;
}

export const useUserSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('has_access')
          .eq('id', user.id)
          .maybeSingle();

        if (data?.has_access) {
          setSubscription({ price_id: null, subscription_status: 'active' });
        } else {
          setSubscription(null);
        }
      } catch {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    hasActiveSubscription: subscription?.subscription_status === 'active',
  };
};
