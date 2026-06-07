import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, CreditCard, Copy, Mail, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { stripeProducts } from '../stripe-config';
import { supabase } from '../lib/supabase';

type PaymentMethod = 'pix' | 'paypal' | 'stripe';

export function CheckoutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const product = stripeProducts[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Could not start Stripe checkout');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Could not start Stripe checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaypalCheckout = () => {
    window.open('https://www.paypal.com/paypalme/designactiv/49', '_blank');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('+5511999999999');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('checkout.back')}</span>
        </button>

        <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-brand-500/20 to-brand-700/20 border-b border-[#2a1f5c] px-6 py-3 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-brand-300 text-xs font-semibold uppercase tracking-wider">
              {t('checkout.badge')}
            </span>
          </div>

          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
                ${product.price}
              </div>
              <h1 className="text-2xl font-black text-white mb-1">{t('checkout.title')}</h1>
              <p className="text-gray-400 text-sm">{t('checkout.subtitle')}</p>
            </div>

            <div className="bg-[#1e1540]/60 rounded-xl p-4 mb-6 border border-[#2a1f5c]">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">{t('checkout.orderSummary')}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">{t('checkout.mainApps')}</span>
                <span className="text-white font-semibold">${product.price}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 text-sm">{t('checkout.bonusApps')}</span>
                <span className="text-green-400 font-semibold">$0</span>
              </div>
              <div className="border-t border-[#2a1f5c] pt-3 flex justify-between items-center">
                <span className="text-white font-bold">{t('checkout.total')}</span>
                <div className="text-right">
                  <span className="text-white font-black text-xl">${product.price}</span>
                  <p className="text-gray-500 text-xs">{t('checkout.oneTime')}</p>
                </div>
              </div>
            </div>

            <p className="text-green-400 text-xs text-center mb-6 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {t('checkout.guarantee')}
            </p>

            <div className="mb-6">
              <h2 className="text-white font-bold text-lg mb-4">{t('checkout.selectMethod')}</h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedMethod('pix')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    selectedMethod === 'pix'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-[#2a1f5c] hover:border-[#3d2d6e]'
                  }`}
                >
                  <div className="text-lg mb-1">BR</div>
                  <p className="text-white font-bold text-xs">PIX</p>
                  <p className="text-gray-500 text-[10px]">{t('checkout.pixDesc')}</p>
                </button>
                <button
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    selectedMethod === 'paypal'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-[#2a1f5c] hover:border-[#3d2d6e]'
                  }`}
                >
                  <div className="text-lg mb-1">P</div>
                  <p className="text-white font-bold text-xs">PayPal</p>
                  <p className="text-gray-500 text-[10px]">{t('checkout.paypalDesc')}</p>
                </button>
                <button
                  onClick={() => setSelectedMethod('stripe')}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    selectedMethod === 'stripe'
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-[#2a1f5c] hover:border-[#3d2d6e]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <p className="text-white font-bold text-xs">Stripe / Card</p>
                  <p className="text-gray-500 text-[10px]">{t('checkout.stripeDesc')}</p>
                </button>
              </div>
            </div>

            {selectedMethod === 'pix' && (
              <div className="bg-[#1e1540]/60 rounded-xl p-5 border border-[#2a1f5c]">
                <h3 className="text-white font-bold mb-1">{t('checkout.pixBadge')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t('checkout.pixInstructions')} <span className="text-white font-bold">${product.price}</span>
                </p>

                <div className="bg-[#0f0a1e] rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">{t('checkout.pixKey')}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white text-sm font-mono">+5511999999999</code>
                    <button
                      onClick={handleCopyPix}
                      className="flex items-center gap-1 text-brand-400 text-xs hover:text-brand-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {pixCopied ? 'Copiado!' : t('checkout.pixStep1')}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-400 text-xs font-bold uppercase">{t('checkout.pixHowTo')}</p>
                  <ol className="space-y-1.5 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold text-xs mt-0.5">1.</span>
                      {t('checkout.pixStep1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold text-xs mt-0.5">2.</span>
                      {t('checkout.pixStep2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold text-xs mt-0.5">3.</span>
                      {t('checkout.pixStep3')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold text-xs mt-0.5">4.</span>
                      {t('checkout.pixStep4')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold text-xs mt-0.5">5.</span>
                      {t('checkout.pixStep5')}
                    </li>
                  </ol>
                </div>

                <a
                  href="mailto:support@designactiv.com?subject=PIX Payment Receipt&body=I made a PIX payment of $49 for the Design Pack."
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {t('checkout.pixSendReceipt')}
                </a>
              </div>
            )}

            {selectedMethod === 'paypal' && (
              <div className="bg-[#1e1540]/60 rounded-xl p-5 border border-[#2a1f5c]">
                <h3 className="text-white font-bold mb-1">{t('checkout.paypalTitle')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('checkout.paypalDesc2')}</p>

                <p className="text-gray-400 text-xs mb-4">{t('checkout.paypalRedirect')}</p>

                <button
                  onClick={handlePaypalCheckout}
                  className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {t('checkout.paypalButton')}
                </button>
              </div>
            )}

            {selectedMethod === 'stripe' && (
              <div className="bg-[#1e1540]/60 rounded-xl p-5 border border-[#2a1f5c]">
                <h3 className="text-white font-bold mb-1">{t('checkout.stripeTitle')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('checkout.stripeCards')}</p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-300 text-sm font-semibold">Could not start Stripe checkout</p>
                      <p className="text-red-400/80 text-xs mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStripeCheckout}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {isLoading ? 'Processing...' : `${t('checkout.stripeButton')}`}
                </button>

                <p className="text-gray-500 text-xs text-center mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  {t('checkout.stripeSecured')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
