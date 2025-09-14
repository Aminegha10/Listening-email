"use client";
import { useState, useMemo } from 'react';
import { Users, DollarSign, ShoppingCart, TrendingUp, Filter, Star } from 'lucide-react';

const mockClients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    revenue: 125000,
    orderFrequency: 'Weekly',
    averageOrderValue: 2500,
    totalOrders: 50,
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    company: 'Global Enterprises',
    revenue: 98000,
    orderFrequency: 'Monthly',
    averageOrderValue: 4900,
    totalOrders: 20,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    company: 'Innovation Labs',
    revenue: 156000,
    orderFrequency: 'Daily',
    averageOrderValue: 1200,
    totalOrders: 130,
    avatar: 'ER'
  },
  {
    id: 4,
    name: 'David Kim',
    company: 'Future Systems',
    revenue: 87500,
    orderFrequency: 'Weekly',
    averageOrderValue: 3500,
    totalOrders: 25,
    avatar: 'DK'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    company: 'Prime Industries',
    revenue: 234000,
    orderFrequency: 'Daily',
    averageOrderValue: 1800,
    totalOrders: 130,
    avatar: 'LT'
  },
  {
    id: 6,
    name: 'James Wilson',
    company: 'Alpha Corp',
    revenue: 45000,
    orderFrequency: 'Monthly',
    averageOrderValue: 2250,
    totalOrders: 20,
    avatar: 'JW'
  },
  {
    id: 7,
    name: 'Maria Garcia',
    company: 'Beta Solutions',
    revenue: 67000,
    orderFrequency: 'Weekly',
    averageOrderValue: 1675,
    totalOrders: 40,
    avatar: 'MG'
  },
  {
    id: 8,
    name: 'Robert Brown',
    company: 'Gamma Technologies',
    revenue: 189000,
    orderFrequency: 'Daily',
    averageOrderValue: 2100,
    totalOrders: 90,
    avatar: 'RB'
  },
  {
    id: 9,
    name: 'Jennifer Davis',
    company: 'Delta Innovations',
    revenue: 112000,
    orderFrequency: 'Weekly',
    averageOrderValue: 2800,
    totalOrders: 40,
    avatar: 'JD'
  },
  {
    id: 10,
    name: 'Christopher Lee',
    company: 'Epsilon Ventures',
    revenue: 78000,
    orderFrequency: 'Monthly',
    averageOrderValue: 3900,
    totalOrders: 20,
    avatar: 'CL'
  },
  {
    id: 11,
    name: 'Amanda White',
    company: 'Zeta Corporation',
    revenue: 145000,
    orderFrequency: 'Daily',
    averageOrderValue: 1450,
    totalOrders: 100,
    avatar: 'AW'
  },
  {
    id: 12,
    name: 'Daniel Martinez',
    company: 'Theta Group',
    revenue: 92000,
    orderFrequency: 'Weekly',
    averageOrderValue: 2300,
    totalOrders: 40,
    avatar: 'DM'
  },
  {
    id: 13,
    name: 'Ashley Taylor',
    company: 'Iota Systems',
    revenue: 67500,
    orderFrequency: 'Monthly',
    averageOrderValue: 3375,
    totalOrders: 20,
    avatar: 'AT'
  },
  {
    id: 14,
    name: 'Kevin Anderson',
    company: 'Kappa Industries',
    revenue: 198000,
    orderFrequency: 'Daily',
    averageOrderValue: 1650,
    totalOrders: 120,
    avatar: 'KA'
  },
  {
    id: 15,
    name: 'Stephanie Clark',
    company: 'Lambda Enterprises',
    revenue: 134000,
    orderFrequency: 'Weekly',
    averageOrderValue: 2680,
    totalOrders: 50,
    avatar: 'SC'
  }
];

function TopSalesAgents() {
  const [revenueFilter, setRevenueFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [avgOrderFilter, setAvgOrderFilter] = useState('all');

  const filteredAndSortedClients = useMemo(() => {
    let filtered = mockClients.filter(client => {
      if (revenueFilter !== 'all') {
        switch (revenueFilter) {
          case 'low':
            if (client.revenue >= 100000) return false;
            break;
          case 'medium':
            if (client.revenue < 100000 || client.revenue >= 200000) return false;
            break;
          case 'high':
            if (client.revenue < 200000) return false;
            break;
        }
      }

      if (frequencyFilter !== 'all' && client.orderFrequency !== frequencyFilter) {
        return false;
      }

      if (avgOrderFilter !== 'all') {
        switch (avgOrderFilter) {
          case 'low':
            if (client.averageOrderValue >= 2000) return false;
            break;
          case 'medium':
            if (client.averageOrderValue < 2000 || client.averageOrderValue >= 4000) return false;
            break;
          case 'high':
            if (client.averageOrderValue < 4000) return false;
            break;
        }
      }

      return true;
    });

    filtered.sort((a, b) => b.revenue - a.revenue);
    return filtered.slice(0, 10);
  }, [revenueFilter, frequencyFilter, avgOrderFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'Daily': return 'bg-green-100 text-green-800';
      case 'Weekly': return 'bg-blue-100 text-blue-800';
      case 'Monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Star className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Top Valuable Clients</h1>
          </div>
          <p className="text-slate-600">Track and analyze your most valuable client relationships</p>
        </div> */}

        {/* Filters */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Revenue Range</label>
              <select 
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Revenue</option>
                <option value="low">Under $100K</option>
                <option value="medium">$100K - $200K</option>
                <option value="high">$200K+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order Frequency</label>
              <select 
                value={frequencyFilter}
                onChange={(e) => setFrequencyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Frequencies</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Avg Order Value</label>
              <select 
                value={avgOrderFilter}
                onChange={(e) => setAvgOrderFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Values</option>
                <option value="low">Under $2K</option>
                <option value="medium">$2K - $4K</option>
                <option value="high">$4K+</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Clients Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Top 10 Clients</h3>
                  <p className="text-sm text-slate-500">Showing {filteredAndSortedClients.length} of {mockClients.length} clients</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <TrendingUp className="h-4 w-4" />
                Ranked by total revenue
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredAndSortedClients.map((client, index) => (
              <div key={client.id} className="p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-slate-100 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {client.avatar}
                    </div>
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-slate-900 truncate">{client.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFrequencyColor(client.orderFrequency)}`}>
                        {client.orderFrequency}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm truncate">{client.company}</p>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-slate-500 mb-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-xs font-medium">Revenue</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(client.revenue)}</p>
                    </div>

                    {/* <div className="min-w-0">
                      <div className="flex items-center gap-1 text-slate-500 mb-1">
                        <ShoppingCart className="h-3 w-3" />
                        <span className="text-xs font-medium">Avg Order</span>
                      </div>
                      <p className="text-lg font-bold text-slate-700">{formatCurrency(client.averageOrderValue)}</p>
                    </div> */}

                    {/* <div className="min-w-0">
                      <div className="flex items-center gap-1 text-slate-500 mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-medium">Orders</span>
                      </div>
                      <p className="text-lg font-bold text-slate-700">{client.totalOrders}</p>
                    </div> */}
                  </div>
                </div>

                <div className="mt-4 ml-24">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 group-hover:from-indigo-600 group-hover:to-indigo-700"
                      style={{ width: `${Math.min((client.revenue / 250000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedClients.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No clients found</h3>
              <p className="text-slate-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
  );
}

export { TopSalesAgents };
