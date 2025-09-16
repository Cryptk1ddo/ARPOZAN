import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ResponsiveContainer 
} from 'recharts';

// Reports View - Analytics and reporting
const ReportsView = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setReportData({
        sales: [
          { month: 'Янв', revenue: 2400000, orders: 120 },
          { month: 'Фев', revenue: 2100000, orders: 98 },
          { month: 'Мар', revenue: 2800000, orders: 140 },
          { month: 'Апр', revenue: 3200000, orders: 165 },
          { month: 'Май', revenue: 2900000, orders: 155 },
          { month: 'Июн', revenue: 3400000, orders: 180 }
        ],
        products: [
          { name: 'TONGKAT ALI', sales: 45, fill: '#8884d8' },
          { name: 'YOHIMBINE HCL', sales: 30, fill: '#82ca9d' },
          { name: 'MACA ROOT', sales: 15, fill: '#ffc658' },
          { name: 'ZINC', sales: 10, fill: '#ff7300' }
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

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
      className="p-4 md:p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Отчеты и аналитика
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Детальная аналитика продаж и производительности
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Выручка по месяцам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData?.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sales */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Продажи по продуктам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData?.products}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="sales"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {reportData?.products.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Количество заказов</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData?.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Сводная статистика</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Общая выручка:</span>
              <span className="font-bold text-gray-900 dark:text-white">₽16.8M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Всего заказов:</span>
              <span className="font-bold text-gray-900 dark:text-white">858</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Средний чек:</span>
              <span className="font-bold text-gray-900 dark:text-white">₽19,580</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Конверсия:</span>
              <span className="font-bold text-green-600 dark:text-green-400">3.2%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsView;