import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductByPriceId } from '../stripe-config';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [productName, setProductName] = useState<string>('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // In a real implementation, you might want to verify the session with your backend
      // For now, we'll just show a success message
    }

    // Try to get product info from URL params if available
    const priceId = searchParams.get('price_id');
    if (priceId) {
      const product = getProductByPriceId(priceId);
      if (product) {
        setProductName(product.name);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-gray-600">
            Obrigado pela sua compra. Seu acesso foi ativado com sucesso.
          </p>
        </div>

        {productName && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              Produto adquirido: {productName}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-700">
            Você já pode acessar todas as ferramentas disponíveis em sua conta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Acessar Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            
            <Link
              to="/"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Você receberá um email de confirmação em breve com os detalhes da sua compra.
          </p>
        </div>
      </div>
    </div>
  );
}