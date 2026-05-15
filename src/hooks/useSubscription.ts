import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { stripeProducts } from '../stripe-config';

interface SubscriptionData {
  hasAccess: boolean;
  planName: string | null;
  status: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    hasAccess: false,
    planName: null,
    status: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Check profile access
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_access')
          .eq('id', user.id)
          .single();

        if (profile?.has_access) {
          // User has access, get the product name
          const product = stripeProducts[0];
          setSubscription({
            hasAccess: true,
            planName: product.name,
            status: 'active',
          });
        } else {
          setSubscription({
            hasAccess: false,
            planName: null,
            status: null,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return { subscription, loading };
}