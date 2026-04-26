import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../context/AuthContext';

export function PricingSection() {
  const { user } = useAuth();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      alert('Por favor, faça login para continuar');
      return;
    }

    setLoadingPriceId(priceId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acesse todas as ferramentas profissionais de design com preços acessíveis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl p-8 relative border-2 border-transparent hover:border-blue-500 transition-all duration-300"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {product.currencySymbol}{product.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {product.mode === 'subscription' ? '/mês' : 'pagamento único'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Acesso a todas as ferramentas</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Licença comercial incluída</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Suporte técnico</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Atualizações gratuitas</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout(product.priceId)}
                disabled={loadingPriceId === product.priceId}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loadingPriceId === product.priceId ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Comprar Agora'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}