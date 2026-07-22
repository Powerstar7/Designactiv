import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Search, Filter, Plus, Eye, Ban, CreditCard } from 'lucide-react';

interface Affiliate {
  id: string;
  user_id: string;
  code: string;
  name: string;
  email: string;
  commission_rate: number;
  status: string;
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
  status: string;
  stripe_session_id: string;
  created_at: string;
  affiliates?: { name: string; code: string };
}

interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  affiliates?: { name: string; email: string };
}

type TabType = 'overview' | 'affiliates' | 'sales' | 'payouts';

export function AffiliateAdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [sales, setSales] = useState<AffiliateSale[]>([]);
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showManualSaleModal, setShowManualSaleModal] = useState(false);
  const [manualSale, setManualSale] = useState({
    affiliate_id: '',
    customer_email: '',
    amount: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    totalSales: 0,
    totalCommissionsPaid: 0,
    pendingPayouts: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [affiliates, sales, payouts]);

  async function fetchAllData() {
    setLoading(true);
    await Promise.all([fetchAffiliates(), fetchSales(), fetchPayouts()]);
    setLoading(false);
  }

  async function fetchAffiliates() {
    const { data, error } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAffiliates(data);
    }
  }

  async function fetchSales() {
    const { data, error } = await supabase
      .from('affiliate_sales')
      .select('*, affiliates(name, code)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSales(data);
    }
  }

  async function fetchPayouts() {
    const { data, error } = await supabase
      .from('affiliate_payouts')
      .select('*, affiliates(name, email)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPayouts(data);
    }
  }

  function calculateStats() {
    const totalAffiliates = affiliates.length;
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCommissionsPaid = payouts
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayouts = payouts
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({ totalAffiliates, totalSales, totalCommissionsPaid, pendingPayouts });
  }

  async function toggleAffiliateStatus(affiliate: Affiliate) {
    const newStatus = affiliate.status === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('affiliates')
      .update({ status: newStatus })
      .eq('id', affiliate.id);

    if (!error) {
      setAffiliates((prev) =>
        prev.map((a) => (a.id === affiliate.id ? { ...a, status: newStatus } : a))
      );
    }
  }

  async function markPayoutAsPaid(payoutId: string) {
    const { error } = await supabase
      .from('affiliate_payouts')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', payoutId);

    if (!error) {
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === payoutId ? { ...p, status: 'paid', paid_at: new Date().toISOString() } : p
        )
      );
    }
  }

  async function registerManualSale() {
    if (!manualSale.affiliate_id || !manualSale.customer_email || !manualSale.amount) return;

    const affiliate = affiliates.find((a) => a.id === manualSale.affiliate_id);
    if (!affiliate) return;

    const amount = parseFloat(manualSale.amount);
    const commission = amount * (affiliate.commission_rate / 100);

    const { error } = await supabase.from('affiliate_sales').insert({
      affiliate_id: manualSale.affiliate_id,
      customer_email: manualSale.customer_email,
      amount,
      commission,
      status: 'completed',
      stripe_session_id: `manual_${Date.now()}`,
    });

    if (!error) {
      // Update affiliate totals
      await supabase
        .from('affiliates')
        .update({
          total_sales: affiliate.total_sales + 1,
          total_earnings: affiliate.total_earnings + commission,
        })
        .eq('id', affiliate.id);

      setShowManualSaleModal(false);
      setManualSale({ affiliate_id: '', customer_email: '', amount: '' });
      fetchAllData();
    }
  }

  const filteredAffiliates = affiliates.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Affiliate Program Admin</h1>
          <p className="text-gray-400 mt-1">Manage affiliates, track sales, and process payouts</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-[#160f2e] p-1 rounded-lg border border-[#2a1f5c] w-fit">
          {(['overview', 'affiliates', 'sales', 'payouts'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2a1f5c]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Users className="w-6 h-6 text-purple-400" />}
                label="Total Affiliates"
                value={stats.totalAffiliates.toString()}
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                label="Total Sales"
                value={`$${stats.totalSales.toFixed(2)}`}
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6 text-blue-400" />}
                label="Commissions Paid"
                value={`$${stats.totalCommissionsPaid.toFixed(2)}`}
              />
              <StatCard
                icon={<Clock className="w-6 h-6 text-yellow-400" />}
                label="Pending Payouts"
                value={`$${stats.pendingPayouts.toFixed(2)}`}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sales */}
              <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Sales</h3>
                <div className="space-y-3">
                  {sales.slice(0, 5).map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between py-2 border-b border-[#2a1f5c] last:border-0"
                    >
                      <div>
                        <p className="text-sm text-white">{sale.customer_email}</p>
                        <p className="text-xs text-gray-400">
                          via {sale.affiliates?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">
                          ${sale.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Commission: ${sale.commission.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {sales.length === 0 && (
                    <p className="text-gray-500 text-sm">No sales yet</p>
                  )}
                </div>
              </div>

              {/* Top Affiliates */}
              <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Affiliates</h3>
                <div className="space-y-3">
                  {[...affiliates]
                    .sort((a, b) => b.total_earnings - a.total_earnings)
                    .slice(0, 5)
                    .map((affiliate) => (
                      <div
                        key={affiliate.id}
                        className="flex items-center justify-between py-2 border-b border-[#2a1f5c] last:border-0"
                      >
                        <div>
                          <p className="text-sm text-white">{affiliate.name}</p>
                          <p className="text-xs text-gray-400">Code: {affiliate.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-purple-400">
                            ${affiliate.total_earnings.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {affiliate.total_sales} sales
                          </p>
                        </div>
                      </div>
                    ))}
                  {affiliates.length === 0 && (
                    <p className="text-gray-500 text-sm">No affiliates yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Affiliates Tab */}
        {activeTab === 'affiliates' && (
          <div>
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#160f2e] border border-[#2a1f5c] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-[#160f2e] border border-[#2a1f5c] rounded-lg text-white appearance-none focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Affiliates Table */}
            <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a1f5c]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Total Sales
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAffiliates.map((affiliate) => (
                      <tr
                        key={affiliate.id}
                        className="border-b border-[#2a1f5c] last:border-0 hover:bg-[#1a1335]"
                      >
                        <td className="px-6 py-4 text-sm text-white">{affiliate.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{affiliate.email}</td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-[#2a1f5c] px-2 py-1 rounded text-purple-300">
                            {affiliate.code}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={affiliate.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-white">{affiliate.total_sales}</td>
                        <td className="px-6 py-4 text-sm text-green-400">
                          ${affiliate.total_earnings.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleAffiliateStatus(affiliate)}
                              className={`p-1.5 rounded-md transition-colors ${
                                affiliate.status === 'active'
                                  ? 'text-red-400 hover:bg-red-400/10'
                                  : 'text-green-400 hover:bg-green-400/10'
                              }`}
                              title={
                                affiliate.status === 'active' ? 'Deactivate' : 'Activate'
                              }
                            >
                              {affiliate.status === 'active' ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#2a1f5c] transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAffiliates.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No affiliates found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Sales Log</h2>
              <button
                onClick={() => setShowManualSaleModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Register Manual Sale
              </button>
            </div>

            {/* Sales Table */}
            <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a1f5c]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Affiliate
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Session ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-b border-[#2a1f5c] last:border-0 hover:bg-[#1a1335]"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {sale.affiliates?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {sale.customer_email}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          ${sale.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-400">
                          ${sale.commission.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={sale.status} />
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs text-gray-400 truncate max-w-[120px] block">
                            {sale.stripe_session_id}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sales.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No sales recorded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Payout Management</h2>

            {/* Payouts Table */}
            <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a1f5c]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Affiliate
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Paid At
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="border-b border-[#2a1f5c] last:border-0 hover:bg-[#1a1335]"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(payout.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <div>
                            <p>{payout.affiliates?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400">
                              {payout.affiliates?.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          ${payout.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={payout.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {payout.paid_at
                            ? new Date(payout.paid_at).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {payout.status === 'pending' && (
                            <button
                              onClick={() => markPayoutAsPaid(payout.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 text-green-400 rounded-md hover:bg-green-600/30 transition-colors text-sm"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Mark Paid
                            </button>
                          )}
                          {payout.status === 'paid' && (
                            <span className="flex items-center gap-1.5 text-sm text-green-400">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Paid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payouts.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No payouts to process</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Sale Modal */}
      {showManualSaleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Register Manual Sale</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Affiliate</label>
                <select
                  value={manualSale.affiliate_id}
                  onChange={(e) =>
                    setManualSale({ ...manualSale, affiliate_id: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#0f0a1e] border border-[#2a1f5c] rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select an affiliate</option>
                  {affiliates
                    .filter((a) => a.status === 'active')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={manualSale.customer_email}
                  onChange={(e) =>
                    setManualSale({ ...manualSale, customer_email: e.target.value })
                  }
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 bg-[#0f0a1e] border border-[#2a1f5c] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Sale Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={manualSale.amount}
                  onChange={(e) =>
                    setManualSale({ ...manualSale, amount: e.target.value })
                  }
                  placeholder="99.00"
                  className="w-full px-3 py-2 bg-[#0f0a1e] border border-[#2a1f5c] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {manualSale.affiliate_id && manualSale.amount && (
                <div className="bg-[#0f0a1e] border border-[#2a1f5c] rounded-lg p-3">
                  <p className="text-sm text-gray-400">
                    Commission:{' '}
                    <span className="text-green-400 font-medium">
                      $
                      {(
                        parseFloat(manualSale.amount) *
                        ((affiliates.find((a) => a.id === manualSale.affiliate_id)
                          ?.commission_rate || 0) /
                          100)
                      ).toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      (
                      {affiliates.find((a) => a.id === manualSale.affiliate_id)
                        ?.commission_rate || 0}
                      %)
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowManualSaleModal(false);
                  setManualSale({ affiliate_id: '', customer_email: '', amount: '' });
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={registerManualSale}
                disabled={
                  !manualSale.affiliate_id || !manualSale.customer_email || !manualSale.amount
                }
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Register Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#160f2e] border border-[#2a1f5c] rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-400/10 text-green-400',
    inactive: 'bg-red-400/10 text-red-400',
    pending: 'bg-yellow-400/10 text-yellow-400',
    completed: 'bg-green-400/10 text-green-400',
    paid: 'bg-blue-400/10 text-blue-400',
  };

  const icons: Record<string, React.ReactNode> = {
    active: <CheckCircle className="w-3 h-3" />,
    inactive: <XCircle className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
    paid: <CheckCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        styles[status] || 'bg-gray-400/10 text-gray-400'
      }`}
    >
      {icons[status] || <Clock className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
