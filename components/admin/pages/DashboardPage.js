import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  RefreshCw, 
  Zap,
  Info,
  Brain,
  Sparkles
} from 'lucide-react';
import { fetchDashboardMetrics } from '../../../lib/adminData';
import { generateAIRecommendations } from '../../../lib/gemini';

const MetricCard = ({ metric, onInfoClick }) => {
  const isPositive = metric.change.startsWith('+');
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const bgColor = `bg-${metric.color}-500/10`;
  const borderColor = `border-${metric.color}-500/20`;

  return (
    <motion.div
      className={`glass-card ${bgColor} border ${borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all duration-200`}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{metric.label}</h3>
        <button
          onClick={() => onInfoClick(metric)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-black text-white mb-1">{metric.value}</p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${changeColor}`}>
              {metric.change}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIActionCenter = ({ actionItems, isLoading, onRefresh }) => {
  return (
    <motion.div
      className="glass-card bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Центр действий ИИ</h3>
            <p className="text-gray-400 text-sm">Умные рекомендации для вашего бизнеса</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-purple-400 hover:text-purple-300 transition-colors hover:bg-purple-500/10 rounded-lg"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="h-4 bg-gray-600 rounded flex-1"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {actionItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{item}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const QuickStats = ({ orders }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => order.date === today);
  const pendingOrders = orders.filter(order => order.status === 'В ожидании');

  const stats = [
    { label: 'Заказы сегодня', value: todayOrders.length, color: 'blue' },
    { label: 'В ожидании', value: pendingOrders.length, color: 'orange' },
    { label: 'Всего заказов', value: orders.length, color: 'green' },
    { label: 'Выручка сегодня', value: `₽${todayOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`glass-card bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl p-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
          <p className="text-white text-2xl font-black mt-1">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

const DashboardPage = ({ user, isMobile, onNavigate }) => {
  const [metrics, setMetrics] = useState({
    growth: [],
    key: [],
    inventory: [],
    isPaused: false
  });
  const [orders, setOrders] = useState([]);
  const [aiActionItems, setAIActionItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDashboardMetrics();
      setMetrics({
        growth: data.growthMetrics,
        key: data.keyMetrics,
        inventory: data.inventory,
        isPaused: false
      });

      // Generate AI recommendations
      const recommendations = await generateAIRecommendations();
      setAIActionItems(recommendations);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      window.showToast?.('Ошибка загрузки данных панели управления', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onMetricInfoClick = (metric) => {
    window.showExplanation?.(
      `Информация о метрике: ${metric.label}`,
      `Текущее значение: ${metric.value}\nИзменение: ${metric.change}\n\nЭта метрика показывает текущее состояние и динамику изменений за выбранный период.`,
      [
        {
          label: 'Подробный отчет',
          onClick: () => onNavigate('reports'),
          variant: 'primary'
        }
      ]
    );
  };

  const onRefreshInsight = async () => {
    setIsInsightLoading(true);
    try {
      const recommendations = await generateAIRecommendations();
      setAIActionItems(recommendations);
    } catch (error) {
      console.error('Error refreshing insights:', error);
      window.showToast?.('Ошибка обновления рекомендаций', 'error');
    } finally {
      setIsInsightLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка панели управления...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Панель управления</h1>
          <p className="text-gray-400">Добро пожаловать в административную панель ARPOZAN</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMetrics(prev => ({ ...prev, isPaused: !prev.isPaused }))}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              metrics.isPaused
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            {metrics.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span>{metrics.isPaused ? 'Возобновить' : 'Пауза'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats orders={orders} />

      {/* Growth Metrics */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Показатели роста</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.growth.map((metric, index) => (
            <MetricCard 
              key={`growth-${index}`} 
              metric={metric} 
              onInfoClick={onMetricInfoClick}
            />
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Ключевые метрики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.key.map((metric, index) => (
            <MetricCard 
              key={`key-${index}`} 
              metric={metric} 
              onInfoClick={onMetricInfoClick}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Metrics */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Складские остатки</h2>
          <div className="grid grid-cols-2 gap-4">
            {metrics.inventory.map((metric, index) => (
              <MetricCard 
                key={`inventory-${index}`} 
                metric={metric} 
                onInfoClick={onMetricInfoClick}
              />
            ))}
          </div>
        </div>

        {/* AI Action Center */}
        <AIActionCenter 
          actionItems={aiActionItems}
          isLoading={isInsightLoading}
          onRefresh={onRefreshInsight}
        />
      </div>
    </div>
  );
};

export default DashboardPage;