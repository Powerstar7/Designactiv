import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { stripeProducts } from '../stripe-config';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you might verify the session with your backend
      setIsVerified(true);
    }
  }, [sessionId]);

  const product = stripeProducts[0];

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Welcome to DesignActiv</p>
          </div>
          
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You now have lifetime access to {product.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Access Your Tools</div>
                    <div className="text-gray-600 text-sm">
                      Navigate to the Tools section to start using your design applications
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-2 mr-4 mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Commercial License Included</div>
                    <div className="text-gray-600 text-sm">
                      Use these tools for client projects and keep 100% of the profits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Link
                to="/tools"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Access Your Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <div className="text-sm text-gray-500">
                Need help? Contact our support team at support@designactiv.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}