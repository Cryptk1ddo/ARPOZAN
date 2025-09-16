import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList } from 'recharts';
import Icon from '../shared/Icon';
import RealtimeActivityFeed from '../shared/RealtimeActivityFeed';

// Enhanced Dashboard View with Advanced Analytics and AI Insights
const DashboardView = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [realTimeData, setRealTimeData] = useState({
    revenue: 2400000,
    orders: 1234,
    customers: 856,
    conversion: 3.2,
    lastUpdate: new Date()
  });
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [salesForecast, setSalesForecast] = useState([]);
  const [customerSegments, setCustomerSegments] = useState([]);
  const [cohortAnalysis, setCohortAnalysis] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [channelPerformance, setChannelPerformance] = useState([]);
  const [aiAlerts, setAiAlerts] = useState([]);
  const [predictiveMetrics, setPredictiveMetrics] = useState({});
  const [selectedChart, setSelectedChart] = useState('overview');
  const [comparisonMode, setComparisonMode] = useState(false);

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

    const generateProductPerformance = () => {
      const products = [
        { name: 'TONGKAT ALI', sales: 234, revenue: 702000, growth: 15.2, stock: 45 },
        { name: 'MACA', sales: 189, revenue: 378000, growth: 8.7, stock: 78 },
        { name: 'YOHIMBINE', sales: 156, revenue: 468000, growth: -2.1, stock: 23 },
        { name: 'ZINC', sales: 145, revenue: 217500, growth: 12.5, stock: 156 },
        { name: 'ULTIMATE PACK', sales: 67, revenue: 536000, growth: 25.8, stock: 12 }
      ];
      setProductPerformance(products);
    };

    const generateSalesForecast = () => {
      const forecast = [];
      const baseValue = 85000;
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const trend = i * 100;
        const seasonality = Math.sin(i * 0.2) * 5000;
        const randomVariance = (Math.random() - 0.5) * 10000;
        
        forecast.push({
          date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
          predicted: Math.round(baseValue + trend + seasonality + randomVariance),
          confidence: Math.round(85 + Math.random() * 10)
        });
      }
      
      setSalesForecast(forecast);
    };

    const generateCohortAnalysis = () => {
      const cohorts = [];
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
      
      months.forEach((month, index) => {
        cohorts.push({
          month,
          newCustomers: Math.floor(150 + Math.random() * 100),
          retention1M: Math.floor(65 + Math.random() * 20),
          retention3M: Math.floor(35 + Math.random() * 15),
          retention6M: Math.floor(20 + Math.random() * 10),
          ltv: Math.floor(8000 + Math.random() * 3000)
        });
      });
      
      setCohortAnalysis(cohorts);
    };

    const generateGeoData = () => {
      setGeoData([
        { region: 'Москва', revenue: 850000, orders: 312, growth: 12.5 },
        { region: 'СПб', revenue: 620000, orders: 245, growth: 8.7 },
        { region: 'Екатеринбург', revenue: 380000, orders: 156, growth: 15.2 },
        { region: 'Новосибирск', revenue: 290000, orders: 123, growth: 6.8 },
        { region: 'Казань', revenue: 260000, orders: 98, growth: 11.3 }
      ]);
    };

    const generateChannelPerformance = () => {
      setChannelPerformance([
        { channel: 'Яндекс Директ', revenue: 980000, cost: 156000, roas: 6.3, conversions: 423 },
        { channel: 'Google Ads', revenue: 750000, cost: 125000, roas: 6.0, conversions: 321 },
        { channel: 'VK Реклама', revenue: 420000, cost: 89000, roas: 4.7, conversions: 198 },
        { channel: 'Органика', revenue: 350000, cost: 0, roas: null, conversions: 156 },
        { channel: 'Email', revenue: 280000, cost: 15000, roas: 18.7, conversions: 134 }
      ]);
    };

    const generateAiAlerts = () => {
      setAiAlerts([
        {
          id: 1,
          type: 'opportunity',
          title: 'Возможность увеличения прибыли',
          message: 'TONGKAT ALI показывает рост 15.2%. Рекомендуется увеличить рекламный бюджет на 25%',
          confidence: 87,
          impact: 'high',
          action: 'Увеличить бюджет'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Снижение конверсии',
          message: 'YOHIMBINE: конверсия упала на 2.1%. Возможные причины: цена, отзывы, конкуренты',
          confidence: 92,
          impact: 'medium',
          action: 'Провести анализ'
        },
        {
          id: 3,
          type: 'insight',
          title: 'Оптимальное время акций',
          message: 'Пик активности: 15:00-17:00 (МСК). Конверсия выше на 23% в это время',
          confidence: 95,
          impact: 'low',
          action: 'Запланировать акции'
        }
      ]);
    };

    const generatePredictiveMetrics = () => {
      setPredictiveMetrics({
        nextMonthRevenue: { predicted: 3200000, confidence: 89, change: 12.5 },
        churnRisk: { high: 23, medium: 67, low: 156, totalCustomers: 246 },
        inventoryAlerts: { outOfStock: 3, lowStock: 8, overstocked: 2 },
        seasonalTrends: { 
          q4Boost: 25.8, 
          holidayPeak: '23-31 дек', 
          lowSeason: 'фев-мар' 
        }
      });
    };

    const generateCustomerSegments = () => {
      setCustomerSegments([
        { name: 'VIP клиенты', value: 156, color: '#8b5cf6', percentage: 18.2 },
        { name: 'Постоянные', value: 324, color: '#06b6d4', percentage: 37.8 },
        { name: 'Новые', value: 198, color: '#10b981', percentage: 23.1 },
        { name: 'Неактивные', value: 89, color: '#f59e0b', percentage: 10.4 },
        { name: 'Тестируют', value: 90, color: '#f97316', percentage: 10.5 }
      ]);
    };

    generateChartData();
    generateProductPerformance();
    generateSalesForecast();
    generateCustomerSegments();
    generateCohortAnalysis();
    generateGeoData();
    generateChannelPerformance();
    generateAiAlerts();
    generatePredictiveMetrics();
  }, [selectedTimeRange]);

  // Real-time data simulation with AI insights
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
        
        // Enhanced metrics with predictive insights
        setMetrics([
          { 
            name: 'Общая выручка', 
            value: `₽${(newData.revenue / 1000000).toFixed(1)}M`, 
            change: `${newData.revenue > prev.revenue ? '+' : ''}${((newData.revenue - prev.revenue) / prev.revenue * 100).toFixed(1)}%`,
            icon: '💰', 
            accent: 'purple',
            trend: newData.revenue > prev.revenue ? 'up' : 'down',
            rawValue: newData.revenue,
            prediction: 'Прогноз: +12% к концу месяца',
            aiInsight: 'Рост за счет ULTIMATE PACK'
          },
          { 
            name: 'Заказы', 
            value: newData.orders.toLocaleString(), 
            change: `${newData.orders > prev.orders ? '+' : ''}${newData.orders - prev.orders}`,
            icon: '📦', 
            accent: 'emerald',
            trend: newData.orders > prev.orders ? 'up' : 'down',
            rawValue: newData.orders,
            prediction: 'Пик в 18:00-20:00',
            aiInsight: 'Выше обычного на 8%'
          },
          { 
            name: 'Клиенты', 
            value: newData.customers.toLocaleString(), 
            change: `${newData.customers > prev.customers ? '+' : ''}${newData.customers - prev.customers}`,
            icon: '👥', 
            accent: 'rose',
            trend: newData.customers > prev.customers ? 'up' : 'down',
            rawValue: newData.customers,
            prediction: 'Новые: 15-20 в день',
            aiInsight: 'Отличная конверсия из рекламы'
          },
          { 
            name: 'Конверсия', 
            value: `${newData.conversion.toFixed(1)}%`, 
            change: `${newData.conversion > prev.conversion ? '+' : ''}${(newData.conversion - prev.conversion).toFixed(1)}%`,
            icon: '📈', 
            accent: 'blue',
            trend: newData.conversion > prev.conversion ? 'up' : 'down',
            rawValue: newData.conversion,
            prediction: 'Цель: 4.5% до Q4',
            aiInsight: 'Оптимизация чекаута помогла'
          }
        ]);

        return newData;
      });
    }, 3000);

    setTimeout(() => setLoading(false), 1000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const timeRanges = [
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 bg-white min-h-screen"
    >
      {/* Header with AI Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            🚀 Аналитическая панель
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <p className="text-gray-600">
              Последнее обновление: {realTimeData.lastUpdate.toLocaleTimeString('ru-RU')}
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
          <div className="flex items-center space-x-2 px-3 py-2 bg-black text-white rounded-lg border border-gray-200">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">AI активен</span>
          </div>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              comparisonMode 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            📊 Сравнение
          </button>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <button
            onClick={() => setLiveUpdates(!liveUpdates)}
            className={`px-4 py-2 rounded-lg transition-colors border ${
              liveUpdates 
                ? 'bg-black text-white border-black hover:bg-gray-900' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            {liveUpdates ? 'Пауза' : 'Старт'}
          </button>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-gray-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-black text-white border-2 ${
                metric.accent === 'purple' ? 'border-purple-500' :
                metric.accent === 'emerald' ? 'border-emerald-500' :
                metric.accent === 'rose' ? 'border-rose-500' :
                'border-blue-500'
              }`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <Icon 
                  path={metric.trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                  className="w-4 h-4" 
                />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">
                {metric.name}
              </h3>
              <p className="text-2xl font-bold text-black">
                {metric.value}
              </p>
              
              {/* AI Insights */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-black font-medium mb-1">
                  📊 {metric.prediction}
                </div>
                <div className="text-xs text-gray-500">
                  💡 {metric.aiInsight}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI-Powered Alerts */}
      <AnimatePresence>
        {aiAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">🚨 AI Уведомления</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'opportunity' ? 'bg-green-50 border-green-500' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.confidence}% точность
                    </span>
                    <span className={`text-xs font-medium ${
                      alert.impact === 'high' ? 'text-red-600' :
                      alert.impact === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {alert.impact === 'high' ? 'Высокий' : alert.impact === 'medium' ? 'Средний' : 'Низкий'} impact
                    </span>
                  </div>
                  <h4 className="font-medium text-black mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                  <button className="text-xs bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                    {alert.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Predictive Analytics Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold text-black mb-6">🔮 Предиктивная аналитика</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-black">₽{(predictiveMetrics.nextMonthRevenue?.predicted / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Прогноз на следующий месяц</div>
            <div className="text-xs text-purple-600 mt-1">{predictiveMetrics.nextMonthRevenue?.confidence}% уверенность</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-black">{predictiveMetrics.churnRisk?.high}</div>
            <div className="text-sm text-gray-600">Клиенты в зоне риска</div>
            <div className="text-xs text-red-600 mt-1">Высокий риск оттока</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-black">{predictiveMetrics.inventoryAlerts?.lowStock}</div>
            <div className="text-sm text-gray-600">Товары на исходе</div>
            <div className="text-xs text-yellow-600 mt-1">Требуют пополнения</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-black">+{predictiveMetrics.seasonalTrends?.q4Boost}%</div>
            <div className="text-sm text-gray-600">Сезонный рост Q4</div>
            <div className="text-xs text-green-600 mt-1">Пик: {predictiveMetrics.seasonalTrends?.holidayPeak}</div>
          </div>
        </div>
      </div>

      {/* Chart Selection Tabs */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">📊 Углубленная аналитика</h3>
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Обзор', icon: '📈' },
              { id: 'cohort', label: 'Когорты', icon: '👥' },
              { id: 'geo', label: 'География', icon: '🗺️' },
              { id: 'channels', label: 'Каналы', icon: '📱' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedChart(tab.id)}
                className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                  selectedChart === tab.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedChart === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Revenue & Orders Trend */}
              <div>
                <h4 className="text-md font-medium text-black mb-4">Тренды продаж</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        color: 'black',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="revenue" fill="#000000" fillOpacity={0.1} />
                    <Bar dataKey="orders" fill="#666666" opacity={0.7} />
                    <Line type="monotone" dataKey="conversion" stroke="#8b5cf6" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Customer Segments */}
              <div>
                <h4 className="text-md font-medium text-black mb-4">Сегменты клиентов</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {selectedChart === 'cohort' && (
            <motion.div
              key="cohort"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-md font-medium text-black mb-4">Когортный анализ</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Месяц</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Новых</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">1 мес</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">3 мес</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">6 мес</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">LTV</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cohortAnalysis.map((cohort, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-black">{cohort.month}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cohort.newCustomers}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cohort.retention1M}%</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cohort.retention3M}%</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cohort.retention6M}%</td>
                        <td className="px-4 py-3 text-sm font-medium text-black">₽{cohort.ltv.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedChart === 'geo' && (
            <motion.div
              key="geo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-md font-medium text-black mb-4">Продажи по регионам</h4>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geoData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="region" type="category" className="text-xs" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₽${(value / 1000).toFixed(0)}K` : value,
                      name === 'revenue' ? 'Выручка' : name === 'orders' ? 'Заказы' : 'Рост'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      color: 'black'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {selectedChart === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-md font-medium text-black mb-4">Эффективность каналов</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" className="text-xs" angle={-45} textAnchor="end" height={80} />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'roas' ? `${value}x` : `₽${(value / 1000).toFixed(0)}K`,
                        name === 'roas' ? 'ROAS' : name === 'revenue' ? 'Выручка' : 'Затраты'
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        color: 'black'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="#000000" />
                    <Bar dataKey="cost" fill="#666666" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {channelPerformance.map((channel, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-black">{channel.channel}</span>
                        <span className={`text-sm font-medium ${
                          channel.roas ? 
                            channel.roas > 5 ? 'text-green-600' : 
                            channel.roas > 3 ? 'text-yellow-600' : 'text-red-600'
                          : 'text-gray-600'
                        }`}>
                          {channel.roas ? `${channel.roas}x ROAS` : 'Органика'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Выручка: ₽{(channel.revenue / 1000).toFixed(0)}K • 
                        Конверсии: {channel.conversions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Performance Funnel */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-6">🎯 Продуктовая воронка</h3>
          <div className="space-y-4">
            {productPerformance.map((product, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-black">{product.name}</span>
                  <span className={`text-sm font-medium ${
                    product.growth > 10 ? 'text-green-600' : 
                    product.growth > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div 
                    className="bg-gradient-to-r from-black to-gray-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(product.sales / Math.max(...productPerformance.map(p => p.sales))) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{product.sales} продаж</span>
                  <span>₽{(product.revenue / 1000).toFixed(0)}K</span>
                  <span>Остаток: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Forecast */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-6">📊 Прогноз продаж</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesForecast.slice(0, 14)}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                formatter={(value, name) => [
                  `₽${(value / 1000).toFixed(0)}K`,
                  name === 'predicted' ? 'Прогноз' : 'Уверенность'
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  color: 'black'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#000000" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
              />
              <Area 
                type="monotone" 
                dataKey="confidence" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
        {/* Revenue & Orders Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-6">
            📈 Тренды продаж и заказов
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  color: 'black',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#000000" fill="#000000" fillOpacity={0.1} />
              <Area type="monotone" dataKey="orders" stackId="2" stroke="#666666" fill="#666666" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-6">
            👥 Сегменты клиентов
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: segment.color }}></div>
                <div className="text-sm">
                  <span className="text-gray-600">{segment.name}: </span>
                  <span className="font-medium text-black">{segment.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-black rounded-lg">
            <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black">
            🤖 AI Рекомендации
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-black mb-2">🚀 Возможности роста</h4>
            <p className="text-sm text-gray-600">
              Увеличить маркетинг ULTIMATE PACK. Прогнозируемый ROI: 340%
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-black mb-2">⚠️ Предупреждения</h4>
            <p className="text-sm text-gray-600">
              YOHIMBINE показывает снижение продаж на 2.1%. Проверить отзывы
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-black mb-2">💡 Оптимизации</h4>
            <p className="text-sm text-gray-600">
              Лучшее время для акций: 15:00-17:00. Конверсия выше на 23%
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold text-black mb-6">
          📊 Активность в реальном времени
        </h3>
        <RealtimeActivityFeed />
      </div>
    </motion.div>
  );
};

export default DashboardView;