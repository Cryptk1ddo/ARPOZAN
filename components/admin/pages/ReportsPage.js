import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from 'lucide-react';
import { fetchReportsData } from '../../../lib/adminData';const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change?.startsWith('+');
  
  return (
    <motion.div
      className={`glass-card bg-${color}-500/10 border border-${color}-500/20 rounded-xl p-6`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-400`} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
};

const Chart = ({ title, data, type = 'bar' }) => {
  return (
    <div className="glass-card bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Download className="h-4 w-4" />
        </button>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-2 flex-1"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 200}px` }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            />
            <span className="text-xs text-gray-400">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TopProductsTable = ({ products, orders }) => {
  // Calculate top products based on orders
  const productSales = {};
  
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (productSales[item.name]) {
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      } else {
        productSales[item.name] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="glass-card bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Топ продаж</h3>
        <Package className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <motion.div
            key={product.name}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
              </div>
              <div>
                <h4 className="text-white font-medium">{product.name}</h4>
                <p className="text-gray-400 text-sm">Продано: {product.quantity} шт.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">₽{product.revenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">выручка</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ReportsPage = ({ user, isMobile, onNavigate }) => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    salesChart: [],
    topProducts: [],
    totalRevenue: 0,
    totalOrders: 0
  });

  // Load reports data
  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const data = await fetchReportsData();
      setReportsData(data);
    } catch (error) {
      console.error('Error loading reports data:', error);
      window.showToast?.('Ошибка загрузки отчетов', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from loaded data
  const totalRevenue = reportsData.totalRevenue;
  const totalOrders = reportsData.totalOrders;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveredOrders = Math.floor(totalOrders * 0.8); // Assuming 80% delivery rate

  // Use loaded data for charts
  const salesData = reportsData.salesChart.map(item => ({
    label: item.month,
    value: item.sales
  }));

  const revenueData = reportsData.salesChart;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-80 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Аналитика и отчеты</h1>
          <p className="text-gray-400">Детальная аналитика продаж и производительности</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="7">Последние 7 дней</option>
            <option value="30">Последние 30 дней</option>
            <option value="90">Последние 90 дней</option>
            <option value="365">Последний год</option>
          </select>
          
          <button className="glow-button text-black font-semibold px-4 py-2 rounded-lg flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Общая выручка"
          value={`₽${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Всего заказов"
          value={totalOrders.toString()}
          change="+8.2%"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Средний чек"
          value={`₽${Math.round(averageOrderValue).toLocaleString()}`}
          change="+5.1%"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Конверсия"
          value={`${((deliveredOrders / totalOrders) * 100).toFixed(1)}%`}
          change="+2.3%"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Chart title="Продажи по дням" data={salesData} />
        <Chart title="Выручка по месяцам" data={revenueData} />
      </div>

      {/* Top Products and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsTable products={products} orders={orders} />
        
        <div className="space-y-6">
          {/* Order Status Distribution */}
          <div className="glass-card bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Распределение заказов</h3>
            <div className="space-y-4">
              {['Доставлен', 'Отправлен', 'В ожидании', 'Отменен'].map((status, index) => {
                const count = orders.filter(o => o.status === status).length;
                const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                const colors = ['green', 'blue', 'orange', 'red'];
                
                return (
                  <motion.div
                    key={status}
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{status}</span>
                      <span className="text-white font-medium">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`bg-${colors[index]}-500 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-white">Ежемесячный отчет</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-green-400" />
                  <span className="text-white">Анализ продаж</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-white">Прогноз выручки</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;