import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import BuySellDialog from '../components/BuySellDialog';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const symbol = '$';

  const coinIcons = {
    BTC: <span className="text-orange-500">₿</span>,
    ETH: <span className="text-gray-700">Ξ</span>,
    LTC: <span className="text-silver-500">Ł</span>,
    XRP: <span className="text-blue-500">✕</span>,
    ADA: <span className="text-blue-600">ₐ</span>,
    DOT: <span className="text-red-500">●</span>,
    SOL: <span className="text-purple-500">◐</span>,
    DOGE: <span className="text-yellow-500">Ð</span>,
  };

  const safeNumber = (val, decimals = 2) => {
    if (val == null || isNaN(val)) return '0'.padEnd(decimals + 2, '0').replace('.', '.');
    return parseFloat(val).toFixed(decimals);
  };

  const safeCurrency = (val) => {
    if (val == null || isNaN(val)) return `$0.00`;
    return `$${parseFloat(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const safePercent = (val) => {
    if (val == null || isNaN(val)) return '0.00%';
    const p = parseFloat(val);
    return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
  };

  const fetchPrices = async () => {
    try {
      const coinIds = ['bitcoin', 'ethereum', 'litecoin', 'ripple', 'cardano', 'polkadot', 'solana', 'dogecoin'];
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
      );
      const data = await res.json();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [txRes, portfolioRes] = await Promise.all([
        axios.get('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/transactions/portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(txRes.data);
      setPortfolio(portfolioRes.data);
      await fetchPrices();
    } catch (error) {
      toast.error('Failed to load portfolio data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionAdded = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const coinIdMap = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    LTC: 'litecoin',
    XRP: 'ripple',
    ADA: 'cardano',
    DOT: 'polkadot',
    SOL: 'solana',
    DOGE: 'dogecoin',
  };

  const getCurrentPriceUSD = (coinSymbol) => {
    const coinId = coinIdMap[coinSymbol];
    if (!coinId || !prices[coinId]) return 0;
    return prices[coinId].usd || 0;
  };

  const calculatePnL = (coin, coinTransactions) => {
    const totalBought = coin.totalBought || 0;
    const totalSold = coin.totalSold || 0;
    const netHoldings = coin.netHoldings || 0;
    const totalInvested = coin.totalInvested || 0;
    const totalFees = coin.totalFees || 0;

    // Calculate average buy price from buy transactions only (in USD)
    const buyTxns = coinTransactions.filter((t) => t.type === 'buy');
    const sellTxns = coinTransactions.filter((t) => t.type === 'sell');

    let totalBuyCost = 0;
    let totalBuyQty = 0;
    buyTxns.forEach((t) => {
      totalBuyCost += t.price * t.quantity + t.fees;
      totalBuyQty += t.quantity;
    });

    const avgBuyPrice = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;

    let totalSellRevenue = 0;
    let totalSellQty = 0;
    sellTxns.forEach((t) => {
      totalSellRevenue += t.price * t.quantity;
      totalSellQty += t.quantity;
    });

    const avgSellPrice = totalSellQty > 0 ? totalSellRevenue / totalSellQty : 0;

    // Get current price in USD for accurate PnL calculation
    const currentPriceUSD = getCurrentPriceUSD(coin.coin);

    // Realised Profit = (Sell Price - Buy Price) * Amount Sold (in USD)
    const realisedProfit = totalSellQty > 0
      ? (avgSellPrice - avgBuyPrice) * totalSellQty
      : 0;

    // Unrealised Profit = (Current Price - Buy Price) * Amount Held (in USD)
    const unrealisedProfit = netHoldings > 0
      ? (currentPriceUSD - avgBuyPrice) * netHoldings
      : 0;

    // All-time Profit = Realised + Unrealised (in USD)
    const allTimeProfit = realisedProfit + unrealisedProfit;

    // Calculate percentage PnL based on total invested
    const pnlPercent = totalInvested > 0 ? (allTimeProfit / totalInvested) * 100 : 0;

    return {
      realisedProfit,
      unrealisedProfit,
      allTimeProfit,
      pnlPercent,
      currentPriceUSD,
      avgBuyPrice,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your portfolio</p>
        </div>
      </div>
    );
  }

  const totalInvested = portfolio.reduce(
    (sum, coin) => sum + (coin.totalInvested || 0),
    0
  );
  const totalFees = portfolio.reduce((sum, coin) => sum + (coin.totalFees || 0), 0);
  const totalCoins = portfolio.length;

  // Calculate total PnL for all coins
  const totalRealisedProfitUSD = portfolio.reduce((sum, coin) => {
    const coinTxns = transactions.filter((t) => t.coin === coin.coin);
    return sum + calculatePnL(coin, coinTxns).realisedProfit;
  }, 0);
  const totalUnrealisedProfitUSD = portfolio.reduce((sum, coin) => {
    const coinTxns = transactions.filter((t) => t.coin === coin.coin);
    return sum + calculatePnL(coin, coinTxns).unrealisedProfit;
  }, 0);
  const totalAllTimeProfitUSD = totalRealisedProfitUSD + totalUnrealisedProfitUSD;
  const totalPnLPercent = totalInvested > 0 ? (totalAllTimeProfitUSD / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Tracker</h1>
            <p className="text-gray-600">Manage your cryptocurrency transactions</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} /> Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeCurrency(totalInvested)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium">Total Fees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeCurrency(totalFees)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                <Clock size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium">Coins Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{totalCoins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-orange-500">₿</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium">Total PnL</p>
                <p className={`text-2xl font-bold ${totalAllTimeProfitUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {safeCurrency(totalAllTimeProfitUSD)} ({safePercent(totalPnLPercent)})
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                <ArrowUp size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="bg-white rounded-xl border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">₿</span> Holdings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Coin</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Net Holdings</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Total Bought</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Total Sold</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Invested</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Fees</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {portfolio.map((coin) => {
                  const coinTxns = transactions.filter((t) => t.coin === coin.coin);
                  const pnl = calculatePnL(coin, coinTxns);
                  return (
                    <tr key={coin.coin} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            {coinIcons[coin.coin] || <ShieldAlert size={20} className="text-gray-500" />}
                          </div>
                          <span className="font-medium text-gray-900">{coin.coin}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          (coin.netHoldings || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {safeNumber(coin.netHoldings, 6)} {coin.coin}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {safeNumber(coin.totalBought, 6)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {safeNumber(coin.totalSold, 6)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {safeCurrency(coin.totalInvested)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {safeCurrency(coin.totalFees)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 ${
                          pnl.allTimeProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <span className="font-medium">
                            {pnl.allTimeProfit >= 0 ? '+' : ''}{safeCurrency(pnl.allTimeProfit)}
                          </span>
                          <span className="text-xs opacity-70">
                            ({pnl.pnlPercent >= 0 ? '+' : ''}{pnl.pnlPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {portfolio.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No holdings yet. Add your first transaction!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-gray-500" /> Transaction History
            </h2>
            <button
              onClick={fetchData}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Coin</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Quantity</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Fees</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatDate(tx.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                          {coinIcons[tx.coin] || <ShieldAlert size={16} className="text-gray-500" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{tx.coin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'buy'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {safeCurrency(tx.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {safeNumber(tx.quantity, 6)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {safeCurrency(tx.fees)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {safeCurrency(tx.price * tx.quantity + tx.fees)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No transactions yet. Add your first buy or sell!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <BuySellDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
    </div>
  );
};

export default Portfolio;