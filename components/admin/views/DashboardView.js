import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart 
} from 'recharts';
import { SupabaseApiClient } from '../../../lib/apiClient';

// Icon Component
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);

// Enhanced Dashboard View
const DashboardView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeView, setActiveView] = useState('executive');
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    revenue: 2500000,
    orders: 1200,
    customers: 650,
    conversion: 3.2,
    lastUpdate: new Date()
  });

  // Initialize Supabase API client
  const apiClient = new SupabaseApiClient();

  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getAdminAnalytics(selectedTimeRange);
        
        if (response.success) {
          setAnalyticsData(response.data);
          
          // Transform API data into component format
          const transformedMetrics = [
            {
              name: 'Общая выручка',
              value: `₽${(response.data.revenue.total / 1000000).toFixed(1)}M`,
              change: `${response.data.revenue.growth >= 0 ? '+' : ''}${response.data.revenue.growth.toFixed(1)}%`,
              icon: '💰',
              trend: response.data.revenue.growth >= 0 ? 'up' : 'down',
              rawValue: response.data.revenue.total,
              prediction: 'Прогноз на основе тренда'
            },
            {
              name: 'Заказы',
              value: response.data.orders.total.toLocaleString(),
              change: `${response.data.orders.growth >= 0 ? '+' : ''}${response.data.orders.growth.toFixed(1)}%`,
              icon: '📦',
              trend: response.data.orders.growth >= 0 ? 'up' : 'down',
              rawValue: response.data.orders.total,
              prediction: 'Динамика заказов'
            },
            {
              name: 'Клиенты',
              value: response.data.customers.total.toLocaleString(),
              change: `${response.data.customers.new >= 0 ? '+' : ''}${response.data.customers.new}`,
              icon: '👥',
              trend: response.data.customers.new >= 0 ? 'up' : 'down',
              rawValue: response.data.customers.total,
              prediction: `Новые: ${response.data.customers.new}`
            },
            {
              name: 'Конверсия',
              value: `${response.data.conversion.rate.toFixed(1)}%`,
              change: `${response.data.conversion.growth >= 0 ? '+' : ''}${response.data.conversion.growth.toFixed(1)}%`,
              icon: '📈',
              trend: response.data.conversion.growth >= 0 ? 'up' : 'down',
              rawValue: response.data.conversion.rate,
              prediction: 'Средняя конверсия'
            }
          ];
          
          setMetrics(transformedMetrics);
          
          // Transform chart data
          if (response.data.chartData) {
            setChartData(response.data.chartData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedTimeRange]);

  // Mock unified data (will be replaced gradually)
  const [unifiedData] = useState({
    executiveSummary: [
      {
        title: 'Общая выручка',
        value: '₽2.4M',
        change: '+12.3%',
        trend: 'up',
        icon: '💰',
        source: 'Все каналы продаж'
      },
      {
        title: 'Заказы',
        value: '1,234',
        change: '+8.7%',
        trend: 'up',
        icon: '📦',
        source: 'За последние 30 дней'
      },
      {
        title: 'Клиенты',
        value: '856',
        change: '+15.2%',
        trend: 'up',
        icon: '👥',
        source: 'Активные клиенты'
      },
      {
        title: 'Конверсия',
        value: '3.2%',
        change: '+0.5%',
        trend: 'up',
        icon: '📈',
        source: 'Среднее за период'
      },
      {
        title: 'AOV',
        value: '₽1,946',
        change: '-2.1%',
        trend: 'down',
        icon: '💳',
        source: 'Средний чек'
      }
    ],
    realTimeMetrics: [
      { id: 1, value: '₽847K', label: 'Выручка сегодня', change: '+5.2%' },
      { id: 2, value: '67', label: 'Заказов сегодня', change: '+12' },
      { id: 3, value: '234', label: 'Посетителей онлайн', change: '+8' },
      { id: 4, value: '4.1%', label: 'Конверсия сейчас', change: '+0.3%' }
    ],
    widgetNavigation: [
      { id: 1, title: 'Продукты', description: 'Каталог и склад', icon: '📦', count: 156, link: '#products' },
      { id: 2, title: 'Заказы', description: 'Управление заказами', icon: '📋', count: 1234, link: '#orders' },
      { id: 3, title: 'Клиенты', description: 'База клиентов', icon: '👥', count: 856, link: '#customers' },
      { id: 4, title: 'Аналитика', description: 'Отчеты и метрики', icon: '📊', count: 47, link: '#analytics' },
      { id: 5, title: 'Маркетинг', description: 'Кампании и каналы', icon: '📢', count: 23, link: '#marketing' },
      { id: 6, title: 'Финансы', description: 'Доходы и расходы', icon: '💰', count: 89, link: '#finance' }
    ],
    aiInsights: [
      {
        type: 'opportunity',
        icon: '🚀',
        title: 'Рост продаж TONGKAT ALI',
        description: 'Спрос вырос на 25% за неделю. Рекомендуется увеличить рекламный бюджет.',
        confidence: 92,
        source: 'ML модель',
        action: 'Увеличить бюджет'
      },
      {
        type: 'warning',
        icon: '⚠️',
        title: 'Низкие остатки YOHIMBINE',
        description: 'Текущих запасов хватит на 3 дня при текущей скорости продаж.',
        confidence: 87,
        source: 'Система склада',
        action: 'Заказать товар'
      },
      {
        type: 'recommendation',
        icon: '💡',
        title: 'Оптимизация времени акций',
        description: 'Лучшее время для запуска промо: вторник-четверг, 15:00-17:00.',
        confidence: 94,
        source: 'Поведенческая аналитика',
        action: 'Запланировать'
      }
    ]
  });

  // Generate mock chart data
  useEffect(() => {
    const generateChartData = () => {
      const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
      const data = [];
      const baseRevenue = 80000;
      const baseOrders = 50;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayVariance = Math.sin(i * 0.1) * 0.3 + Math.random() * 0.4;
        const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
        
        data.push({
          date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
          revenue: Math.round(baseRevenue * (1 + dayVariance) * weekendMultiplier),
          orders: Math.round(baseOrders * (1 + dayVariance) * weekendMultiplier),
          customers: Math.round(baseOrders * 0.8 * (1 + dayVariance) * weekendMultiplier),
          conversion: (2.5 + dayVariance * 2).toFixed(1),
          avgOrderValue: Math.round((baseRevenue / baseOrders) * (1 + dayVariance * 0.5))
        });
      }
      
      setChartData(data);
    };

    generateChartData();
  }, [selectedTimeRange]);

  // Real-time data simulation
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const variance = 0.02;
        const newData = {
          revenue: Math.max(2000000, prev.revenue + (Math.random() - 0.5) * prev.revenue * variance),
          orders: Math.max(1000, prev.orders + Math.floor((Math.random() - 0.5) * 10)),
          customers: Math.max(500, prev.customers + Math.floor((Math.random() - 0.5) * 5)),
          conversion: Math.max(1, Math.min(10, prev.conversion + (Math.random() - 0.5) * 0.2)),
          lastUpdate: new Date()
        };
        
        // Update metrics with real-time data
        setMetrics([
          { 
            name: 'Общая выручка', 
            value: `₽${(newData.revenue / 1000000).toFixed(1)}M`, 
            change: `${newData.revenue > prev.revenue ? '+' : ''}${((newData.revenue - prev.revenue) / prev.revenue * 100).toFixed(1)}%`,
            icon: '💰', 
            trend: newData.revenue > prev.revenue ? 'up' : 'down',
            rawValue: newData.revenue,
            prediction: 'Прогноз: +12% к концу месяца'
          },
          { 
            name: 'Заказы', 
            value: newData.orders.toLocaleString(), 
            change: `${newData.orders > prev.orders ? '+' : ''}${newData.orders - prev.orders}`,
            icon: '📦', 
            trend: newData.orders > prev.orders ? 'up' : 'down',
            rawValue: newData.orders,
            prediction: 'Пик в 18:00-20:00'
          },
          { 
            name: 'Клиенты', 
            value: newData.customers.toLocaleString(), 
            change: `${newData.customers > prev.customers ? '+' : ''}${newData.customers - prev.customers}`,
            icon: '👥', 
            trend: newData.customers > prev.customers ? 'up' : 'down',
            rawValue: newData.customers,
            prediction: 'Новые: 15-20 в день'
          },
          { 
            name: 'Конверсия', 
            value: `${newData.conversion.toFixed(1)}%`, 
            change: `${newData.conversion > prev.conversion ? '+' : ''}${(newData.conversion - prev.conversion).toFixed(1)}%`,
            icon: '📈', 
            trend: newData.conversion > prev.conversion ? 'up' : 'down',
            rawValue: newData.conversion,
            prediction: 'Цель: 4.5% до Q4'
          }
        ]);

        return newData;
      });
      setLastUpdate(new Date());
    }, 3000);

    // Initial load
    setTimeout(() => setLoading(false), 1000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const timeRanges = [
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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
      className="space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Панель управления
          </h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{liveUpdates ? 'Обновляется в реальном времени' : 'Обновления остановлены'}</span>
            </div>
            <span>Последнее обновление: {lastUpdate.toLocaleTimeString('ru-RU')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-600 dark:bg-white text-white dark:text-black rounded-lg">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5" />
            <span className="text-sm font-medium">AI активен</span>
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-white focus:ring-1 focus:ring-blue-500 dark:focus:ring-white"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <button
            onClick={() => setLiveUpdates(!liveUpdates)}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              liveUpdates 
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-black dark:text-white dark:border-black dark:hover:bg-gray-900' 
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-50'
            }`}
          >
            {liveUpdates ? 'Пауза' : 'Старт'}
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📈 Основные метрики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {unifiedData.executiveSummary.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-black text-white">
                  <span className="text-xl">{kpi.icon}</span>
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trend !== 'neutral' && (
                    <Icon 
                      path={kpi.trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                      className="w-4 h-4 mr-1" 
                    />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <p className="text-2xl font-bold text-black">{kpi.value}</p>
                <div className="text-xs text-gray-500">{kpi.source}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Analytics Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">📊 Динамика продаж</h2>
            <div className="flex space-x-2">
              {['revenue', 'orders', 'customers'].map((metric) => (
                <button
                  key={metric}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {metric === 'revenue' ? 'Выручка' : metric === 'orders' ? 'Заказы' : 'Клиенты'}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  color: 'black'
                }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#e5e7eb" name="Заказы" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} name="Выручка" />
              <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} name="Клиенты" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Widget Navigation */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">🎛️ Быстрая навигация</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {unifiedData.widgetNavigation.map((widget, index) => (
            <motion.button
              key={widget.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => console.log(`Navigate to ${widget.link}`)}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-300 text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{widget.icon}</div>
              <div className="font-medium text-black text-sm mb-1">{widget.title}</div>
              <div className="text-xs text-gray-600 mb-2">{widget.description}</div>
              <div className="text-xs font-medium text-blue-600">{widget.count} записей</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics Stream */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">🔴 Метрики в реальном времени</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">{liveUpdates ? 'Обновляется каждые 3 сек' : 'Остановлено'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {unifiedData.realTimeMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <div className={`text-xs font-medium ${
                metric.change.startsWith('+') ? 'text-green-600' : 
                metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change} за последний час
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-black rounded-lg">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-black">🤖 AI Рекомендации</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {unifiedData.aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity' ? 'bg-green-50 border-green-500' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                insight.type === 'recommendation' ? 'bg-blue-50 border-blue-500' :
                'bg-purple-50 border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{insight.icon}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                  insight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  insight.type === 'recommendation' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {insight.confidence}% точность
                </span>
              </div>
              <h3 className="font-medium text-black mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{insight.source}</span>
                <button className="text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                  {insight.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;