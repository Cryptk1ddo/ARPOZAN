import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Real-time Activity Feed Component
const RealtimeActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const generateActivity = () => {
      const types = [
        { type: 'order', icon: '🛒', color: 'text-green-600', message: 'Новый заказ' },
        { type: 'user', icon: '👤', color: 'text-blue-600', message: 'Новый пользователь' },
        { type: 'payment', icon: '💳', color: 'text-purple-600', message: 'Платеж получен' },
        { type: 'review', icon: '⭐', color: 'text-yellow-600', message: 'Новый отзыв' },
        { type: 'inventory', icon: '📦', color: 'text-orange-600', message: 'Обновление склада' },
      ];
      
      const products = ['TONGKAT ALI', 'YOHIMBINE HCL', 'MACA ROOT', 'ZINC', 'ULTIMATE PACK'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      return {
        id: Date.now() + Math.random(),
        ...randomType,
        product: randomProduct,
        time: new Date(),
        amount: randomType.type === 'order' || randomType.type === 'payment' ? Math.floor(Math.random() * 5000) + 500 : null
      };
    };

    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities);

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg">{activity.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {activity.message}
              {activity.amount && <span className="text-green-600 dark:text-green-400"> ₽{activity.amount}</span>}
            </p>
            <p className="text-xs text-gray-500 truncate">{activity.product}</p>
          </div>
          <span className="text-xs text-gray-400">
            {activity.time.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </motion.div>
      ))}
    </>
  );
};

export default RealtimeActivityFeed;