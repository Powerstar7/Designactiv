import React from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export function SubscriptionStatus() {
  const { subscription, loading, getSubscriptionPlan, hasLifetimeAccess } = useSubscription();

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="animate-pulse flex items-center">
          <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !hasLifetimeAccess()) {
    return null;
  }

  const planName = getSubscriptionPlan();

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center">
        <Crown className="w-5 h-5 text-yellow-600 mr-3" />
        <div>
          <div className="font-medium text-yellow-800">
            {planName || '9 Apps All-in-one Design Pack'}
          </div>
          <div className="text-sm text-yellow-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Lifetime Access Active
          </div>
        </div>
      </div>
    </div>
  );
}