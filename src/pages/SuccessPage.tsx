import React, { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { stripeProducts } from '../stripe-config';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data: orders } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .eq('checkout_session_id', sessionId)
          .single();

        if (orders) {
          setOrderDetails(orders);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  const product = stripeProducts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. You now have lifetime access to all 9 premium design tools.
        </p>

        {loading ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : orderDetails ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  ${(orderDetails.amount_total / 100).toFixed(2)} {orderDetails.currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 capitalize">{orderDetails.payment_status}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Access Your Tools
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}