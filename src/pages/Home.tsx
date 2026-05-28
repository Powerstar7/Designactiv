import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Layers, Zap, Crown } from 'lucide-react';
import { stripeProducts } from '../stripe-config';

export function Home() {
  const product = stripeProducts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Design Tools for
            <span className="text-indigo-600 block">Creative Professionals</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get lifetime access to our complete suite of 9 professional design applications. 
            Create stunning visuals, prototypes, and designs with industry-leading tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
            >
              <Crown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Get Lifetime Access - {product.currencySymbol}{product.price}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive design suite includes all the tools professional designers use daily
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Palette className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Vector Graphics
            </h3>
            <p className="text-gray-600">
              Create scalable vector illustrations, logos, and icons with precision tools
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Layers className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              UI/UX Design
            </h3>
            <p className="text-gray-600">
              Design beautiful user interfaces and prototypes with advanced layout tools
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Zap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Photo Editing
            </h3>
            <p className="text-gray-600">
              Professional photo editing and manipulation with powerful filters and effects
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            One-Time Payment, Lifetime Access
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Everything you need for professional design work
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-yellow-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {product.currencySymbol}{product.price}
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
            >
              Get Lifetime Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Design Workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of designers who have upgraded their creative process
          </p>
          <Link
            to="/pricing"
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 inline-flex items-center"
          >
            View Pricing
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}