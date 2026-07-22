import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DollarSign, TrendingUp, Users, Gift, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function AffiliateRegisterPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [alreadyAffiliate, setAlreadyAffiliate] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || '');

        // Check if user is already an affiliate
        const { data: existing } = await supabase
          .from('affiliates')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existing) {
          setAlreadyAffiliate(true);
        }
      }
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  }

  function generateAffiliateCode(name: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 6);
    const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    return slug ? `${slug}-${randomPart.slice(0, 4)}` : randomPart;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const code = generateAffiliateCode(name);

      const { error: insertError } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          code,
          name: name.trim(),
          email: email.trim(),
          commission_rate: 0.30,
          status: 'pending',
          total_earnings: 0,
          total_sales: 0,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('You are already registered as an affiliate.');
        } else {
          setError(insertError.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      navigate('/affiliate/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const benefits = [
    {
      icon: DollarSign,
      title: '30% Commission',
      description: 'Earn 30% on every sale you refer. No caps, no limits — the more you share, the more you earn.',
    },
    {
      icon: TrendingUp,
      title: 'Passive Income',
      description: 'Share once and earn repeatedly. Your referral link works around the clock, generating income while you sleep.',
    },
    {
      icon: Users,
      title: 'Lifetime Referrals',
      description: 'Once someone signs up through your link, they are your referral forever. Every future purchase counts.',
    },
    {
      icon: Gift,
      title: 'Exclusive Perks',
      description: 'Get early access to new products, exclusive discounts, and priority support as a valued affiliate partner.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <DollarSign className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Affiliate Program</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Earn 30% Commission on Every Sale
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join our affiliate program and turn your network into a revenue stream. 
            Share products you love and earn generous commissions with every referral.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Instant tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Monthly payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Become an Affiliate?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="card-dark p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-300">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-400 text-sm">Register below and get your unique referral link instantly.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-300">2</span>
              </div>
              <h3 className="font-semibold mb-2">Share</h3>
              <p className="text-gray-400 text-sm">Share your link with your audience, friends, or community.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-300">3</span>
              </div>
              <h3 className="font-semibold mb-2">Earn</h3>
              <p className="text-gray-400 text-sm">Get 30% commission for every sale made through your link.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="card-dark p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-center mb-2">
              Become an Affiliate
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Fill in your details below to join our program.
            </p>

            {!user ? (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">
                  You need to be logged in to register as an affiliate.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors"
                >
                  Log In to Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : alreadyAffiliate ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  You are already registered as an affiliate!
                </p>
                <button
                  onClick={() => navigate('/affiliate/dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl text-gray-900 bg-white placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl text-gray-900 bg-white placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Join Affiliate Program
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By registering, you agree to our affiliate terms and conditions.
                  Your account will be reviewed and activated within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How much can I earn?',
                a: 'You earn 30% commission on every sale made through your unique referral link. There is no cap on earnings — the more you refer, the more you make.',
              },
              {
                q: 'When do I get paid?',
                a: 'Payouts are processed monthly. Once your balance reaches the minimum threshold, you will receive payment via your preferred method.',
              },
              {
                q: 'How do I track my referrals?',
                a: 'Your affiliate dashboard provides real-time tracking of clicks, conversions, and earnings. You can monitor performance at any time.',
              },
              {
                q: 'Is there a cost to join?',
                a: 'No! Our affiliate program is completely free to join. There are no hidden fees or requirements.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="card-dark p-5 rounded-xl border border-white/5"
              >
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
