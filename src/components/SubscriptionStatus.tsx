import React from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import { useUserSubscription } from '../hooks/useUserSubscription';
import { stripeProducts, getProductByPriceId } from '../stripe-config';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, loading, hasActiveSubscription } = useUserSubscription();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
    );
  }

  if (!hasActiveSubscription) {
    return null;
  }

  const product = subscription?.price_id 
    ? getProductByPriceId(subscription.price_id)
    : stripeProducts[0]; // Fallback to first product

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
      <Crown className="w-5 h-5 text-yellow-600" />
      <span className="text-sm font-medium text-yellow-800">
        {product?.name || 'Premium Access'}
      </span>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </div>
  );
};