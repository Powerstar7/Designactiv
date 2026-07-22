import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, DollarSign, TrendingUp, Users, Clock, CheckCircle, ExternalLink, BarChart3, Wallet, ArrowUpRight, Calendar } from 'lucide-react';

interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  name: string;
  email: string;
  commission_rate: number;
  status: 'active' | 'pending' | 'inactive';
  total_earnings: number;
  total_sales: number;
  created_at: string;
}

interface AffiliateSale {
  id: string;
  affiliate_id: string;
  customer_email: string;
  amount: number;
  commission: number;
  status: 'pending' | 'paid' | 'cancelled';
  stripe_session_id: string;
  created_at: string;
}

interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  paid_at: string | null;
  created_at: string;
}

interface MonthlyEarning {
  month: string;
  amount: number;
}

export function AffiliateDashboardPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  async function fetchAffiliateData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Fetch affiliate profile
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateError || !affiliateData) {
        window.location.href = '/affiliate/register';
        return;
      }

      setAffiliate(affiliateData);

      // Fetch sales
      const { data: salesData } = await supabase
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (salesData) setSales(salesData);

      // Fetch payouts
      const { data: payoutsData } = await supabase
        .from('affiliate_payouts')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (payoutsData) setPayouts(payoutsData);

      // Calculate monthly earnings from sales
      if (salesData && salesData.length > 0) {
        const earningsByMonth: Record<string, number> = {};
        salesData.forEach((sale) => {
          if (sale.status !== 'cancelled') {
            const date = new Date(sale.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            earningsByMonth[monthKey] = (earningsByMonth[monthKey] || 0) + sale.commission;
          }
        });

        const sortedMonths = Object.entries(earningsByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6)
          .map(([month, amount]) => ({
            month: formatMonthLabel(month),
            amount,
          }));

        setMonthlyEarnings(sortedMonths);
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }

  function getReferralLink(): string {
    if (!affiliate) return '';
    return `${window.location.origin}?ref=${affiliate.code}`;
  }

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function getConversionRate(): string {
    if (!affiliate || affiliate.total_sales === 0) return '0%';
    // Conversion rate is a simplified metric based on sales
    return `${((affiliate.total_sales / Math.max(affiliate.total_sales * 5, 1)) * 100).toFixed(1)}%`;
  }

  function getPendingCommission(): number {
    return sales
      .filter((s) => s.status === 'pending')
      .reduce((sum, s) => sum + s.commission, 0);
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
        {status === 'active' && <CheckCircle className="w-3 h-3" />}
        {status === 'pending' && <Clock className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  function getSaleStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  function getPayoutStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      paid: 'bg-green-500/20 text-green-400',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return null;
  }

  const maxEarning = Math.max(...monthlyEarnings.map((e) => e.amount), 1);

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Affiliate Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {affiliate.name}! Here's your performance overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(affiliate.status)}
            <span className="text-sm text-gray-400">
              Commission: <span className="text-purple-400 font-semibold">{(affiliate.commission_rate * 100).toFixed(0)}%</span>
            </span>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-medium text-gray-300">Your Referral Link</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-[#0f0a1e] border border-[#2a1f5c] rounded-lg px-4 py-2.5 text-gray-300 text-sm font-mono truncate">
              {getReferralLink()}
            </div>
            <button
              onClick={copyReferralLink}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earnings */}
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Total Earnings</span>
                <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                ${affiliate.total_earnings.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Lifetime earnings</span>
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Total Sales</span>
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {affiliate.total_sales}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400">Referred customers</span>
              </div>
            </div>
          </div>

          {/* Pending Commission */}
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Pending Commission</span>
                <div className="w-9 h-9 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                ${getPendingCommission().toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Wallet className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">Awaiting payout</span>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Conversion Rate</span>
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {getConversionRate()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <BarChart3 className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400">Click to sale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Earnings Chart */}
          <div className="lg:col-span-2 bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Monthly Earnings</h2>
            </div>

            {monthlyEarnings.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {monthlyEarnings.map((earning, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">
                      ${earning.amount.toFixed(0)}
                    </span>
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-300 group-hover:from-purple-500 group-hover:to-purple-300 min-h-[4px]"
                        style={{
                          height: `${(earning.amount / maxEarning) * 140}px`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{earning.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <BarChart3 className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No earnings data yet</p>
                <p className="text-xs mt-1">Start sharing your referral link to see earnings here</p>
              </div>
            )}
          </div>

          {/* Payout History */}
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Payout History</h2>
            </div>

            {payouts.length > 0 ? (
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-3 bg-[#0f0a1e] rounded-lg border border-[#2a1f5c]/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        ${payout.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(payout.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getPayoutStatusBadge(payout.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Wallet className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No payouts yet</p>
                <p className="text-xs mt-1">Payouts are processed monthly</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales History Table */}
        <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Recent Sales</h2>
            </div>
            {sales.length > 0 && (
              <span className="text-xs text-gray-500">{sales.length} total</span>
            )}
          </div>

          {sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a1f5c]">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Commission
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a1f5c]/50">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[#1a1335] transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-sm text-gray-300">{sale.customer_email}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-white font-medium">
                          ${sale.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-green-400 font-medium">
                          +${sale.commission.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{getSaleStatusBadge(sale.status)}</td>
                      <td className="py-3">
                        <span className="text-sm text-gray-500">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">No sales yet</p>
              <p className="text-xs mt-1 text-center max-w-sm">
                Share your referral link with potential customers. When they make a purchase, you'll earn a {(affiliate.commission_rate * 100).toFixed(0)}% commission!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
