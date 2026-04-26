import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Gift, Copy, CheckCircle2, Zap, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (selector: string | HTMLElement) => Promise<void> };
    };
  }
}

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
const CHECKOUT_PRICE = import.meta.env.VITE_CHECKOUT_PRICE_USD || '49';

let paypalSdkPromise: Promise<void> | null = null;

function loadPaypalSdk(): Promise<void> {
  if (paypalSdkPromise) return paypalSdkPromise;
  if (!PAYPAL_CLIENT_ID) return Promise.reject(new Error('paypal-not-configured'));
  paypalSdkPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('paypal-sdk') as HTMLScriptElement | null;
    if (existing) {
      if (window.paypal) resolve();
      else existing.addEventListener('load', () => resolve());
      return;
    }
    const s = document.createElement('script');
    s.id = 'paypal-sdk';
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&currency=USD&intent=capture`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('paypal-load-failed'));
    document.body.appendChild(s);
  });
  return paypalSdkPromise;
}

const mainApps = [
  '1-Click Background Remover',
  'All-In-One Design & Mockup Tool',
  'Animated Ad Builder',
  'Logo Creator',
  'Smart Object Remover',
  'Advanced Image Editor',
];

const bonusApps = [
  'Video Survey Pro',
  '3D Live Motion Photos',
  'Image to SVG Converter',
];

const PIX_KEY = '00819975745';

type PayMethod = 'pix' | 'paypal' | 'stripe';

export function CheckoutPage() {
  const navigate = useNavigate();
  const onNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'shop') navigate('/');
    else navigate(`/${page}`);
  };
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>('pix');
  const [copied, setCopied] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'success'>('idle');
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedMethod !== 'paypal') return;
    if (!PAYPAL_CLIENT_ID) {
      setPaypalStatus('error');
      setPaypalError('paypal-not-configured');
      return;
    }
    setPaypalStatus('loading');
    setPaypalError(null);
    loadPaypalSdk()
      .then(() => {
        if (!paypalRef.current || !window.paypal) return;
        paypalRef.current.innerHTML = '';
        window.paypal
          .Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal' },
            createOrder: (_data: unknown, actions: { order: { create: (o: unknown) => Promise<string> } }) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: { value: String(CHECKOUT_PRICE), currency_code: 'USD' },
                    description: 'DesignActiv — 9 Apps Pack',
                  },
                ],
              }),
            onApprove: async (_data: unknown, actions: { order: { capture: () => Promise<{ id: string }> } }) => {
              const details = await actions.order.capture();
              setPaypalOrderId(details.id);
              setPaypalStatus('success');
            },
            onError: () => {
              setPaypalStatus('error');
              setPaypalError('paypal-runtime-error');
            },
          })
          .render(paypalRef.current)
          .then(() => setPaypalStatus('ready'))
          .catch(() => {
            setPaypalStatus('error');
            setPaypalError('paypal-render-failed');
          });
      })
      .catch((e: Error) => {
        setPaypalStatus('error');
        setPaypalError(e.message);
      });
  }, [selectedMethod]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const methods: { id: PayMethod; label: string; icon: string; desc: string }[] = [
    { id: 'pix', label: 'PIX', icon: '\u{1F1E7}\u{1F1F7}', desc: t('checkout.pixDesc') },
    { id: 'paypal', label: 'PayPal', icon: '\u{1F17F}', desc: t('checkout.paypalDesc') },
    { id: 'stripe', label: 'Stripe / Card', icon: '\u{1F4B3}', desc: t('checkout.stripeDesc') },
  ];

  return (
    <div className="min-h-screen bg-[#0f0a1e] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('checkout.back')}
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-5 py-2 mb-4">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-brand-400 text-sm font-semibold">{t('checkout.badge')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t('checkout.title')}</h1>
          <p className="text-gray-400">{t('checkout.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #160f2e, #1e1540)', border: '2px solid #a855f740' }}
            >
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 flex items-center justify-between">
                <span className="text-white font-black text-sm uppercase tracking-wide">{t('checkout.orderSummary')}</span>
                <span className="text-white font-black text-lg">$49</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-brand-400" />
                    <p className="text-white font-bold text-sm">{t('checkout.mainApps')}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {mainApps.map((app) => (
                      <li key={app} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span className="text-gray-300 text-xs">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 font-bold text-sm">{t('checkout.bonusApps')}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {bonusApps.map((app) => (
                      <li key={app} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        <span className="text-green-300 text-xs">{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#2a1f5c] pt-4 space-y-2">
                  {['Unlimited Usage', 'Commercial License', 'Agency License', '24/7 VIP Support', 'All Bonus Templates', 'Cloud Based'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2a1f5c] pt-4 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{t('checkout.total')}</span>
                  <div className="text-right">
                    <span className="text-white font-black text-2xl">$49</span>
                    <p className="text-gray-500 text-xs">{t('checkout.oneTime')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-green-400 text-xs bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-3">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>{t('checkout.guarantee')}</span>
            </div>
          </div>

          <div>
            <div className="bg-[#160f2e] rounded-2xl border border-[#2a1f5c] overflow-hidden">
              <div className="p-6 border-b border-[#2a1f5c]">
                <h2 className="text-white font-black text-lg mb-4">{t('checkout.selectMethod')}</h2>
                <div className="grid grid-cols-3 gap-3">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className="rounded-xl p-3 text-center transition-all duration-200 border-2"
                      style={
                        selectedMethod === m.id
                          ? { backgroundColor: '#a855f715', borderColor: '#a855f7', color: '#fff' }
                          : { backgroundColor: '#1e1540', borderColor: '#2a1f5c', color: '#9ca3af' }
                      }
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <p className="font-black text-xs">{m.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {selectedMethod === 'pix' && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-4">
                        <span className="text-green-400 text-xs font-bold">{'\u{1F1E7}\u{1F1F7}'} {t('checkout.pixBadge')}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {t('checkout.pixInstructions')} <strong className="text-white">$49 (equivalente em R$)</strong> utilizando a chave PIX abaixo.
                        Apos o pagamento, envie o comprovante para receber acesso imediato.
                      </p>
                    </div>

                    <div className="bg-[#1e1540] rounded-2xl p-5 border border-[#2a1f5c]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-400 font-black text-sm">PIX</span>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{t('checkout.pixKey')}</p>
                          <p className="text-gray-500 text-xs">{t('checkout.pixInstant')}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center mb-4">
                        <div className="bg-white p-3 rounded-2xl shadow-lg shadow-green-500/10 border-2 border-green-500/30 mb-3">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PIX_KEY)}&bgcolor=ffffff&color=000000&qzone=1`}
                            alt="QR Code PIX"
                            width={180}
                            height={180}
                            className="rounded-lg"
                          />
                        </div>
                        <p className="text-green-400 text-xs font-semibold">{t('checkout.pixScan')}</p>
                      </div>

                      <div className="bg-[#0f0a1e] rounded-xl p-4 flex items-center justify-between gap-4 border border-[#2a1f5c]">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Chave PIX</p>
                          <p className="text-white font-black text-lg tracking-wider">{PIX_KEY}</p>
                        </div>
                        <button
                          onClick={handleCopyPix}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            copied
                              ? 'bg-green-600 text-white'
                              : 'bg-brand-500 hover:bg-brand-600 text-white'
                          }`}
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl p-4 space-y-2">
                      <p className="text-brand-400 font-bold text-sm">{t('checkout.pixHowTo')}</p>
                      {[
                        t('checkout.pixStep1'),
                        t('checkout.pixStep2'),
                        t('checkout.pixStep3'),
                        t('checkout.pixStep4'),
                        t('checkout.pixStep5'),
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-brand-500/30 text-brand-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-300 text-xs">{step}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="mailto:support@designactiv.com?subject=Comprovante PIX — 9 Apps Pack"
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all hover:scale-105"
                    >
                      {t('checkout.pixSendReceipt')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{'\u{1F17F}'}</div>
                      <p className="text-white font-black text-lg mb-1">{t('checkout.paypalTitle')}</p>
                      <p className="text-gray-400 text-sm">{t('checkout.paypalDesc2')}</p>
                    </div>

                    <div className="bg-[#1e1540] rounded-xl p-4 border border-[#2a1f5c]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-xs">{t('checkout.total')}</span>
                        <span className="text-white font-black text-lg">${CHECKOUT_PRICE} USD</span>
                      </div>

                      {paypalStatus === 'success' && paypalOrderId && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <p className="text-green-400 font-bold text-sm">Payment captured</p>
                          </div>
                          <p className="text-green-300 text-xs">Order ID: <code className="font-mono">{paypalOrderId}</code></p>
                        </div>
                      )}

                      {paypalStatus === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-400 font-bold text-xs mb-1">PayPal unavailable</p>
                            <p className="text-red-300 text-xs">
                              {paypalError === 'paypal-not-configured'
                                ? 'PayPal Client ID is not configured.'
                                : 'Could not load PayPal. Please try again.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {paypalStatus === 'loading' && (
                        <div className="flex items-center justify-center py-8">
                          <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                        </div>
                      )}

                      <div ref={paypalRef} className="paypal-button-host" />
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>{t('checkout.paypalRedirect')}</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <p className="text-white font-black text-lg mb-1">{t('checkout.stripeTitle')}</p>
                      <p className="text-gray-400 text-xs">{t('checkout.stripeCards')}</p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-200 leading-relaxed">
                        <p className="font-bold mb-1">Stripe checkout requires server-side keys.</p>
                        <p>To activate Stripe payments securely, click the button below to finish the official Stripe setup. After that, this section will be wired up automatically.</p>
                      </div>
                    </div>

                    <a
                      href="https://bolt.new/setup/stripe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black py-4 rounded-xl transition-all hover:scale-105 text-base"
                    >
                      <span>Configure Stripe</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>{t('checkout.stripeSecured')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default CheckoutPage;
