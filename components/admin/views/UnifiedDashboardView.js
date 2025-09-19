import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import Icon from '../shared/Icon';
import SearchFilterSystem from '../SearchFilterSystem';

const UnifiedDashboardView = () => {
  const [loading, setLoading] = useState(true);
  const [activeWidget, setActiveWidget] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Unified data from all views
  const [dashboardData, setDashboardData] = useState({
    customers: { total: 0, active: 0, new: 0, retention: 0 },
    products: { total: 0, active: 0, lowStock: 0, revenue: 0 },
    orders: { total: 0, completed: 0, pending: 0, revenue: 0 },
    inventory: { totalItems: 0, totalValue: 0, lowStock: 0, suppliers: 0 },
    users: { total: 0, active: 0, roles: 0, permissions: 0 },
    reports: { generated: 0, exported: 0, scheduled: 0 },
    realtime: { visitors: 0, conversionRate: 0, avgOrderValue: 0 }
  });

  // Mock unified data
  useEffect(() => {
    const loadUnifiedData = () => {
      setDashboardData({
        customers: {
          total: 2847,
          active: 2456,
          new: 89,
          retention: 78.5,
          growth: 12.3,
          segments: [
            { name: 'VIP', count: 234, revenue: 1200000 },
            { name: 'Regular', count: 1456, revenue: 2800000 },
            { name: 'New', count: 1157, revenue: 650000 }
          ]
        },
        products: {
          total: 156,
          active: 142,
          lowStock: 8,
          revenue: 4650000,
          topProducts: [
            { name: 'TONGKAT ALI', sales: 234, revenue: 890000 },
            { name: 'MACA', sales: 189, revenue: 567000 },
            { name: 'YOHIMBIN', sales: 156, revenue: 468000 }
          ]
        },
        orders: {
          total: 3456,
          completed: 2987,
          pending: 234,
          cancelled: 156,
          revenue: 4650000,
          avgOrderValue: 1345,
          fulfillmentRate: 94.2
        },
        inventory: {
          totalItems: 156,
          totalValue: 2340000,
          lowStock: 8,
          suppliers: 23,
          warehouses: 3,
          turnoverRate: 6.8
        },
        users: {
          total: 23,
          active: 19,
          roles: 5,
          permissions: 23,
          loginActivity: 89.5,
          securityAlerts: 2
        },
        reports: {
          generated: 145,
          exported: 89,
          scheduled: 23,
          insights: 34
        },
        realtime: {
          visitors: 234,
          conversionRate: 3.8,
          avgOrderValue: 1345,
          cartAbandonment: 67.2
        }
      });
      setLoading(false);
    };

    loadUnifiedData();
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setDashboardData(prev => ({
        ...prev,
        realtime: {
          ...prev.realtime,
          visitors: prev.realtime.visitors + Math.floor(Math.random() * 5) - 2,
          conversionRate: Math.max(0, prev.realtime.conversionRate + (Math.random() - 0.5) * 0.2)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  // Chart data generation
  const revenueData = [
    { month: 'Янв', customers: 120000, products: 180000, orders: 200000, total: 500000 },
    { month: 'Фев', customers: 150000, products: 220000, orders: 280000, total: 650000 },
    { month: 'Мар', customers: 180000, products: 250000, orders: 320000, total: 750000 },
    { month: 'Апр', customers: 210000, products: 280000, orders: 360000, total: 850000 },
    { month: 'Май', customers: 250000, products: 320000, orders: 420000, total: 990000 },
    { month: 'Июн', customers: 280000, products: 350000, orders: 450000, total: 1080000 }
  ];

  const performanceData = [
    { metric: 'Customer Acquisition', current: 89, target: 100, progress: 89 },
    { metric: 'Order Fulfillment', current: 94, target: 95, progress: 99 },
    { metric: 'Product Availability', current: 95, target: 98, progress: 97 },
    { metric: 'User Engagement', current: 78, target: 85, progress: 92 },
    { metric: 'Inventory Turnover', current: 6.8, target: 7.5, progress: 91 }
  ];

  const departmentData = [
    { department: 'Продажи', efficiency: 92, revenue: 2100000, color: '#10b981' },
    { department: 'Склад', efficiency: 87, revenue: 0, color: '#3b82f6' },
    { department: 'Маркетинг', efficiency: 94, revenue: 1200000, color: '#8b5cf6' },
    { department: 'IT', efficiency: 89, revenue: 0, color: '#f59e0b' },
    { department: 'Аналитика', efficiency: 96, revenue: 0, color: '#ef4444' }
  ];

  const activityData = [
    { time: '00:00', orders: 12, customers: 45, products: 23 },
    { time: '04:00', orders: 8, customers: 32, products: 18 },
    { time: '08:00', orders: 34, customers: 89, products: 45 },
    { time: '12:00', orders: 67, customers: 134, products: 78 },
    { time: '16:00', orders: 89, customers: 167, products: 92 },
    { time: '20:00', orders: 45, customers: 98, products: 56 }
  ];

  // Widget configurations
  const widgets = [
    { id: 'overview', label: 'Обзор', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'revenue', label: 'Выручка', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
    { id: 'performance', label: 'Эффективность', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'realtime', label: 'Онлайн', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            🚀 Единая панель управления
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <p className="text-gray-600">
              Последнее обновление: {lastUpdate.toLocaleTimeString('ru-RU')}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {liveUpdates ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="90d">90 дней</option>
          </select>
          <button
            onClick={() => setLiveUpdates(!liveUpdates)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              liveUpdates 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4 mr-2" />
            {liveUpdates ? 'Live' : 'Обновить'}
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">+{dashboardData.customers.growth}%</span>
          </div>
          <p className="text-lg font-bold text-blue-900">{dashboardData.customers.total.toLocaleString()}</p>
          <p className="text-xs text-blue-600">Клиентов</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-6 h-6 text-green-600" />
            <span className="text-xs text-green-600 font-medium">{dashboardData.products.active}/{dashboardData.products.total}</span>
          </div>
          <p className="text-lg font-bold text-green-900">{dashboardData.products.total}</p>
          <p className="text-xs text-green-600">Продуктов</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-6 h-6 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">{dashboardData.orders.fulfillmentRate}%</span>
          </div>
          <p className="text-lg font-bold text-purple-900">{dashboardData.orders.total.toLocaleString()}</p>
          <p className="text-xs text-purple-600">Заказов</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" className="w-6 h-6 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">{dashboardData.inventory.turnoverRate}x</span>
          </div>
          <p className="text-lg font-bold text-yellow-900">{(dashboardData.inventory.totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-yellow-600">Склад ₽</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" className="w-6 h-6 text-red-600" />
            <span className="text-xs text-red-600 font-medium">{dashboardData.users.loginActivity}%</span>
          </div>
          <p className="text-lg font-bold text-red-900">{dashboardData.users.active}/{dashboardData.users.total}</p>
          <p className="text-xs text-red-600">Пользователи</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">₽{dashboardData.orders.avgOrderValue}</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{(dashboardData.orders.revenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-600">Выручка ₽</p>
        </motion.div>
      </div>

      {/* Widget Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {widgets.map((widget) => (
            <button
              key={widget.id}
              onClick={() => setActiveWidget(widget.id)}
              className={`${
                activeWidget === widget.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <Icon path={widget.icon} className="w-4 h-4 mr-2" />
              {widget.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Widget Content */}
      <motion.div
        key={activeWidget}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeWidget === 'overview' && (
          <div className="space-y-6">
            {/* Cross-View Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Общая эффективность</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Эффективность отделов</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="efficiency"
                      label={({ department, efficiency }) => `${department}: ${efficiency}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">📈 Топ продукты</h4>
                <div className="space-y-3">
                  {dashboardData.products.topProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{product.name}</span>
                      <span className="font-medium">₽{(product.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">👥 Сегменты клиентов</h4>
                <div className="space-y-3">
                  {dashboardData.customers.segments.map((segment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{segment.name} ({segment.count})</span>
                      <span className="font-medium">₽{(segment.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">⚠️ Требует внимания</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Мало товара</span>
                    <span className="text-red-600 font-medium">{dashboardData.inventory.lowStock}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ожидают заказы</span>
                    <span className="text-yellow-600 font-medium">{dashboardData.orders.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Безопасность</span>
                    <span className="text-orange-600 font-medium">{dashboardData.users.securityAlerts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeWidget === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Выручка по источникам</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="total" fill="#10b981" stroke="#10b981" fillOpacity={0.3} />
                  <Bar dataKey="customers" fill="#3b82f6" />
                  <Bar dataKey="products" fill="#8b5cf6" />
                  <Bar dataKey="orders" fill="#f59e0b" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeWidget === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность систем</h3>
                <div className="space-y-4">
                  {performanceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{item.metric}</span>
                        <span className="font-medium">{item.current}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность по времени</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="products" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeWidget === 'realtime' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Посетители онлайн</p>
                    <p className="text-3xl font-bold text-green-900">{dashboardData.realtime.visitors}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Конверсия</p>
                    <p className="text-3xl font-bold text-blue-900">{dashboardData.realtime.conversionRate.toFixed(1)}%</p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Средний чек</p>
                    <p className="text-3xl font-bold text-purple-900">₽{dashboardData.realtime.avgOrderValue}</p>
                  </div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Брошенные корзины</p>
                    <p className="text-3xl font-bold text-yellow-900">{dashboardData.realtime.cartAbandonment}%</p>
                  </div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </motion.div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Живая активность</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <p className="text-lg font-semibold">Система работает</p>
                  <p className="text-sm text-gray-600">Все сервисы онлайн</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UnifiedDashboardView;