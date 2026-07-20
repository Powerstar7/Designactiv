import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, CreditCard, Copy, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { stripeProducts } from '../stripe-config';

type PaymentMethod = 'pix' | 'stripe';

const PIX_KEY = '00819975745';

function generatePixPayload(pixKey: string, amount: number, merchantName: string): string {
  const formatField = (id: string, value: string) => {
    return `${id}${value.length.toString().padStart(2, '0')}${value}`;
  };

  const merchantAccountInfo =
    formatField('00', 'br.gov.bcb.pix') +
    formatField('01', pixKey);

  let payload =
    formatField('00', '01') +
    formatField('26', merchantAccountInfo) +
    formatField('52', '0000') +
    formatField('53', '986') +
    formatField('54', amount.toFixed(2)) +
    formatField('58', 'BR') +
    formatField('59', merchantName.substring(0, 25)) +
    formatField('60', 'SAO PAULO');

  const additionalData = formatField('05', '***');
  payload += formatField('62', additionalData);

  payload += '6304';

  const crc = crc16(payload);
  payload += crc;

  return payload;
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function CheckoutPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const product = stripeProducts[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe');
  const [pixCopied, setPixCopied] = useState(false);

  const pixPayload = generatePixPayload(PIX_KEY, product.price, 'DESIGNACTIV');

  const handleStripeCheckout = () => {
    if (product.checkoutUrl) {
      window.open(product.checkoutUrl, '_blank');
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
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
          <div className="bg-gradient-to-r from-green-600/80 to-green-700/80 border-b border-green-500/30 px-6 py-3 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
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
              <div className="grid grid-cols-2 gap-3">
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

                <div className="flex justify-center mb-4">
                  <div className="bg-white p-3 rounded-xl">
                    <QRCodeSVG
                      value={pixPayload}
                      size={180}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                <p className="text-gray-400 text-xs text-center mb-4">
                  Escaneie o QR Code acima com o app do seu banco
                </p>

                <div className="bg-[#0f0a1e] rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">{t('checkout.pixKey')}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-white text-sm font-mono">{PIX_KEY}</code>
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

            {selectedMethod === 'stripe' && (
              <div className="bg-[#1e1540]/60 rounded-xl p-5 border border-[#2a1f5c]">
                <h3 className="text-white font-bold mb-1">{t('checkout.stripeTitle')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('checkout.stripeCards')}</p>

                <button
                  onClick={handleStripeCheckout}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> {t('checkout.stripeButton')}
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
