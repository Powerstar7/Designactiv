import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SuccessPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Welcome to DesignActiv! Your lifetime access has been activated.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent you a confirmation email with your receipt and access instructions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Access Your Tools</h3>
                <p className="text-gray-600">
                  Your account has been upgraded with lifetime access to all 9 design tools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Start Creating</h3>
                <p className="text-gray-600">
                  Begin using your professional design tools immediately. No additional setup required.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Designing?</h2>
          <p className="mb-6 opacity-90">
            Access all your premium design tools now and start creating amazing content.
          </p>
          
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@designactiv.com" className="text-blue-600 hover:underline">
              support@designactiv.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}