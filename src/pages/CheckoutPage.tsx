import { useState } from 'react';
import { Check, Shield, Gift, Copy, CheckCircle2, Zap, ArrowLeft, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
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

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>('pix');
  const [copied, setCopied] = useState(false);
  const [stripeForm, setStripeForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const { t } = useLanguage();

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
              style={{ background: 'linear-gradient(135deg, #160f2e, #1e1540)', border: '2px solid #7c3aed40' }}
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
                          ? { backgroundColor: '#7c3aed15', borderColor: '#7c3aed', color: '#fff' }
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
                      <p className="text-gray-400 text-sm">
                        {t('checkout.paypalDesc2')}
                      </p>
                    </div>

                    <div className="bg-[#1e1540] rounded-xl p-4 border border-[#2a1f5c] space-y-3">
                      <div>
                        <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.paypalEmail')}</label>
                        <input
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder={t('account.emailPlaceholder')}
                          className="w-full bg-[#0f0a1e] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                      <p className="text-blue-300 text-xs leading-relaxed">
                        {t('checkout.paypalRedirect')}
                      </p>
                    </div>

                    <button className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-black py-4 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                      <span className="text-xl">{'\u{1F17F}'}</span>
                      {t('checkout.paypalButton')}
                    </button>
                  </div>
                )}

                {selectedMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <p className="text-white font-black text-lg mb-1">{t('checkout.stripeTitle')}</p>
                      <p className="text-gray-400 text-xs">{t('checkout.stripeCards')}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.stripeName')}</label>
                        <input
                          type="text"
                          value={stripeForm.name}
                          onChange={(e) => setStripeForm({ ...stripeForm, name: e.target.value })}
                          placeholder="John Smith"
                          className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.stripeEmail')}</label>
                        <input
                          type="email"
                          value={stripeForm.email}
                          onChange={(e) => setStripeForm({ ...stripeForm, email: e.target.value })}
                          placeholder={t('account.emailPlaceholder')}
                          className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.stripeCard')}</label>
                        <input
                          type="text"
                          value={stripeForm.card}
                          onChange={(e) => setStripeForm({ ...stripeForm, card: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.stripeExpiry')}</label>
                          <input
                            type="text"
                            value={stripeForm.expiry}
                            onChange={(e) => setStripeForm({ ...stripeForm, expiry: e.target.value })}
                            placeholder="MM / YY"
                            maxLength={7}
                            className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs font-semibold block mb-1.5">{t('checkout.stripeCvv')}</label>
                          <input
                            type="text"
                            value={stripeForm.cvv}
                            onChange={(e) => setStripeForm({ ...stripeForm, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                            className="w-full bg-[#1e1540] border border-[#2a1f5c] text-white placeholder-gray-600 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Shield className="w-3.5 h-3.5 text-green-400" />
                      <span>{t('checkout.stripeSecured')}</span>
                    </div>

                    <button className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black py-4 rounded-xl transition-all hover:scale-105 text-lg">
                      {t('checkout.stripeButton')}
                    </button>
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
