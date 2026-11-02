import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple,cardano,polkadot,solana,dogecoin&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await res.json();
      setPrices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const coinMap = {
    bitcoin: { symbol: 'BTC', icon: <span className="text-orange-500">₿</span> },
    ethereum: { symbol: 'ETH', icon: <span className="text-gray-700">Ξ</span> },
    litecoin: { symbol: 'LTC', icon: <span className="text-silver-500">Ł</span> },
    ripple: { symbol: 'XRP', icon: <span className="text-blue-500">✕</span> },
    cardano: { symbol: 'ADA', icon: <span className="text-blue-600">ₐ</span> },
    polkadot: { symbol: 'DOT', icon: <span className="text-red-500">●</span> },
    solana: { symbol: 'SOL', icon: <span className="text-purple-500">◐</span> },
    dogecoin: { symbol: 'DOGE', icon: <span className="text-yellow-500">Ð</span> },
  };

  const getPrice = (coinId) => {
    const data = prices[coinId];
    if (!data) return 0;
    return data.usd || 0;
  };

  const getChange = (coinId) => {
    const data = prices[coinId];
    if (!data) return 0;
    return data.usd_24h_change || 0;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Track Your Crypto Portfolio
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Monitor prices, manage your portfolio, and track transactions in real-time
            </p>
            {!isAuthenticated ? (
              <div className="flex justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <Link
                  to="/portfolio"
                  className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Go to Portfolio
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crypto Prices */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Prices (USD)</h2>
          <button
            onClick={fetchPrices}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw size={16} className="animate-spin" /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(coinMap).map(([coinId, info]) => {
            const price = getPrice(coinId);
            const change = getChange(coinId);
            return (
              <div
                key={coinId}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{info.symbol}</h3>
                      <p className="text-xs text-gray-500">{coinId}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium">
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      change >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: Math.min(Math.abs(change) * 5, 100) + '%' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-time Prices</h3>
              <p className="text-gray-600 text-sm">Track live crypto prices in USD</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Portfolio Tracking</h3>
              <p className="text-gray-600 text-sm">Buy, sell, and track your crypto investments</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is protected with industry-standard security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;