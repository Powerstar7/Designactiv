import React, { useEffect, useState } from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { stripeProducts } from '../stripe-config';

interface SubscriptionData {
  subscription_status: string | null;
  price_id: string | null;
}

const UserSubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('subscription_status, price_id')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription:', error);
        } else {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (!user || loading) {
    return null;
  }

  // Check if user has active subscription or completed order
  const hasAccess = subscription?.subscription_status === 'active' || 
                   subscription?.price_id === stripeProducts[0].priceId;

  if (!hasAccess) {
    return null;
  }

  const product = stripeProducts.find(p => p.priceId === subscription?.price_id) || stripeProducts[0];

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Crown className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-900">
              {product.name}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Lifetime access to all design tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSubscriptionStatus;