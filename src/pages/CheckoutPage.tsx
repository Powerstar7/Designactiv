import React from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { CheckoutButton } from '../components/CheckoutButton';
import { stripeProducts, formatPrice } from '../stripe-config';

export function CheckoutPage() {
  const product = stripeProducts[0]; // We only have one product

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get All Design Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access all 9 professional design applications with one simple purchase
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(product.price, product.currencySymbol)}
                </span>
                <span className="text-blue-200">one-time</span>
              </div>
              <p className="text-blue-100">{product.description}</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Background Remover</h3>
                    <p className="text-gray-600 text-sm">AI-powered background removal</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">3D Motion Photos</h3>
                    <p className="text-gray-600 text-sm">Transform photos into dynamic videos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">All-in-One Design Tool</h3>
                    <p className="text-gray-600 text-sm">Complete design suite with templates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Animated Ad Builder</h3>
                    <p className="text-gray-600 text-sm">Create eye-catching animated banners</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Logo Creator</h3>
                    <p className="text-gray-600 text-sm">Professional logo design tool</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">+ 4 More Tools</h3>
                    <p className="text-gray-600 text-sm">Object remover, SVG converter, image editor & video survey</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  What's Included
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Lifetime access to all 9 design tools</li>
                  <li>• Commercial license included</li>
                  <li>• No monthly fees or subscriptions</li>
                  <li>• Cloud-based - works on any device</li>
                  <li>• Regular updates and new features</li>
                </ul>
              </div>

              <CheckoutButton 
                product={product}
                className="w-full py-4 text-lg"
              >
                Get Lifetime Access - {formatPrice(product.price, product.currencySymbol)}
              </CheckoutButton>

              <p className="text-center text-sm text-gray-500 mt-4">
                Secure payment processed by Stripe. 30-day money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}