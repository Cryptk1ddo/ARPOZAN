import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import Icon from '../shared/Icon';
import SearchFilterSystem from '../shared/SearchFilterSystem';

// Reports View - Analytics and reporting
const ReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchFiltersActive, setSearchFiltersActive] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate comprehensive data loading
    setTimeout(() => {
      const mockData = {
        sales: [
          { month: 'Янв', revenue: 2400000, orders: 120, customers: 89, avgOrder: 20000, refunds: 5 },
          { month: 'Фев', revenue: 2100000, orders: 98, customers: 76, avgOrder: 21429, refunds: 3 },
          { month: 'Мар', revenue: 2800000, orders: 140, customers: 112, avgOrder: 20000, refunds: 7 },
          { month: 'Апр', revenue: 3200000, orders: 165, customers: 134, avgOrder: 19394, refunds: 8 },
          { month: 'Май', revenue: 2900000, orders: 155, customers: 121, avgOrder: 18710, refunds: 6 },
          { month: 'Июн', revenue: 3400000, orders: 180, customers: 145, avgOrder: 18889, refunds: 9 }
        ],
        products: [
          { name: 'TONGKAT ALI', sales: 45, revenue: 1340000, orders: 234, fill: '#1f2937' },
          { name: 'YOHIMBINE HCL', sales: 30, revenue: 890000, orders: 156, fill: '#4b5563' },
          { name: 'MACA ROOT', sales: 15, revenue: 456000, orders: 89, fill: '#6b7280' },
          { name: 'ZINC', sales: 10, revenue: 234000, orders: 45, fill: '#9ca3af' }
        ],
        customers: [
          { segment: 'VIP', count: 45, revenue: 2100000, avgOrder: 46667 },
          { segment: 'Premium', count: 123, revenue: 1890000, avgOrder: 15366 },
          { segment: 'Regular', count: 267, revenue: 1456000, avgOrder: 5454 },
          { segment: 'New', count: 89, revenue: 234000, avgOrder: 2629 }
        ],
        traffic: [
          { source: 'Organic', sessions: 12500, conversions: 456, revenue: 1890000 },
          { source: 'Direct', sessions: 8900, conversions: 234, revenue: 1234000 },
          { source: 'Social', sessions: 5600, conversions: 123, revenue: 567000 },
          { source: 'Email', sessions: 3400, conversions: 89, revenue: 345000 },
          { source: 'Ads', sessions: 2100, conversions: 56, revenue: 234000 }
        ],
        performance: [
          { metric: 'Bounce Rate', value: 35.2, trend: -2.1, good: true },
          { metric: 'Session Duration', value: 245, trend: 12.3, good: true },
          { metric: 'Pages per Session', value: 3.4, trend: 0.8, good: true },
          { metric: 'Cart Abandonment', value: 67.8, trend: -4.2, good: true }
        ]
      };
      setReportData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // Analytics SearchFilterSystem config
  const analyticsConfig = {
    searchableFields: ['month', 'name', 'segment', 'source'],
    filters: [
      {
        key: 'timeRange',
        label: 'Период',
        type: 'select',
        options: [
          { value: '1month', label: 'Последний месяц' },
          { value: '3months', label: 'Последние 3 месяца' },
          { value: '6months', label: 'Последние 6 месяцев' },
          { value: '1year', label: 'Последний год' }
        ]
      },
      {
        key: 'revenue',
        label: 'Выручка',
        type: 'range',
        min: 0,
        max: 5000000,
        step: 100000
      },
      {
        key: 'orders',
        label: 'Заказы',
        type: 'range',
        min: 0,
        max: 200,
        step: 10
      },
      {
        key: 'customers',
        label: 'Клиенты',
        type: 'range',
        min: 0,
        max: 200,
        step: 10
      }
    ],
    sortOptions: [
      { value: 'month', label: 'По месяцам' },
      { value: 'revenue', label: 'По выручке' },
      { value: 'orders', label: 'По заказам' },
      { value: 'customers', label: 'По клиентам' }
    ]
  };

  // Handle analytics data filtering
  const handleAnalyticsResults = (results, isActive) => {
    // Since analytics data is more complex, we'll handle filtering differently
    setSearchFiltersActive(isActive);
    if (isActive && results) {
      // Apply filters to analytics data structure
      setFilteredData(reportData);
    } else {
      setFilteredData(reportData);
    }
  };

  // Export analytics data
  const handleExportAnalytics = (format, data) => {
    const salesData = filteredData?.sales || [];
    const productsData = filteredData?.products || [];
    
    if (format === 'csv') {
      const csvContent = [
        'Тип,Период,Выручка,Заказы,Клиенты,Средний чек',
        ...salesData.map(item => `Продажи,${item.month},${item.revenue},${item.orders},${item.customers},${item.avgOrder}`),
        '',
        'Продукт,Продажи,Выручка,Заказы',
        ...productsData.map(item => `${item.name},${item.sales},${item.revenue},${item.orders}`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="p-4 md:p-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Аналитика и отчеты
          </h1>
          <p className="text-gray-600">
            Комплексная аналитика бизнес-показателей и производительности
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="1month">Последний месяц</option>
            <option value="3months">Последние 3 месяца</option>
            <option value="6months">Последние 6 месяцев</option>
            <option value="1year">Последний год</option>
          </select>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <SearchFilterSystem
        data={filteredData?.sales || []}
        config={analyticsConfig}
        onResults={handleAnalyticsResults}
        onExport={handleExportAnalytics}
        placeholder="Поиск по периодам, продуктам, сегментам..."
        className="mb-6"
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Обзор', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'sales', label: 'Продажи', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'customers', label: 'Клиенты', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { id: 'performance', label: 'Производительность', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon path={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Общая выручка</p>
                      <p className="text-3xl font-bold text-black">₽16.8M</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +12.5%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                      <p className="text-3xl font-bold text-black">858</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +8.2%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Средний чек</p>
                      <p className="text-3xl font-bold text-black">₽19,580</p>
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <Icon path="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" className="w-4 h-4 mr-1" />
                        -2.1%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Конверсия</p>
                      <p className="text-3xl font-bold text-black">3.2%</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +0.3%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-5 h-5 mr-2" />
                    Тренд выручки
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredData?.sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        fill="#000000" 
                        fillOpacity={0.1}
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Product Performance */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-5 h-5 mr-2" />
                    Продажи по продуктам
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={filteredData?.products}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="sales"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {filteredData?.products.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-6">
              {/* Sales Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Выручка и заказы</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={filteredData?.sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#000000" name="Выручка" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#6b7280" strokeWidth={2} name="Заказы" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Средний чек</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData?.sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="avgOrder" 
                        stroke="#000000" 
                        strokeWidth={3}
                        dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Сегменты клиентов</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredData?.customers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="segment" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Источники трафика</h3>
                  <div className="space-y-4">
                    {filteredData?.traffic.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-black">{source.source}</div>
                          <div className="text-sm text-gray-600">{source.sessions.toLocaleString()} сессий</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-black">₽{(source.revenue / 1000).toFixed(0)}K</div>
                          <div className="text-sm text-gray-600">{source.conversions} конверсий</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData?.performance.map((metric, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-black">{metric.metric}</h4>
                        <p className="text-3xl font-bold text-black mt-2">
                          {metric.metric === 'Session Duration' ? `${metric.value}s` : 
                           metric.metric.includes('Rate') ? `${metric.value}%` : metric.value}
                        </p>
                        <p className={`text-sm flex items-center mt-2 ${
                          metric.good ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <Icon 
                            path={metric.good ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                            className="w-4 h-4 mr-1" 
                          />
                          {metric.trend > 0 ? '+' : ''}{metric.trend}%
                        </p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportsView;