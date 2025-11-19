import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Coins, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';

interface TokenTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refill' | 'bonus' | 'refund';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export function Tokens() {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchTransactions();
    }
  }, [profile]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: TokenTransaction['type'], amount: number) => {
    if (amount > 0) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (amount: number) => {
    if (amount > 0) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Management</h1>
          <p className="text-gray-600">Track your token balance and usage history</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">{profile?.token_balance || 0}</div>
            <div className="text-blue-100">Current Balance</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {profile?.total_tokens_purchased || 0}
            </div>
            <div className="text-gray-600">Total Purchased</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {profile?.total_tokens_used || 0}
            </div>
            <div className="text-gray-600">Total Used</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      {getTransactionIcon(transaction.type, transaction.amount)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${getTransactionColor(transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </div>
                    <div className="text-sm text-gray-500">
                      Balance: {transaction.balance_after}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Need more tokens?</h3>
          <p className="text-gray-600 mb-4">
            Upgrade your subscription to get more tokens every month and unlock premium features.
          </p>
          <a
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Plans
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
