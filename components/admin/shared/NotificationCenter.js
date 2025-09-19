import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'alert',
        title: 'Низкий остаток товара',
        message: 'YOHIMBINE: осталось только 23 единицы. Рекомендуется пополнить запас.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        priority: 'high',
        action: 'Пополнить запас'
      },
      {
        id: 2,
        type: 'success',
        title: 'Цель продаж достигнута',
        message: 'TONGKAT ALI превысил месячную цель на 15.2%. Отличная работа!',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        priority: 'medium',
        action: null
      },
      {
        id: 3,
        type: 'warning',
        title: 'Высокий процент отказов',
        message: 'Конверсия снизилась до 2.8%. Проверьте работу сайта и процесс оформления заказа.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true,
        priority: 'high',
        action: 'Проверить сайт'
      },
      {
        id: 4,
        type: 'info',
        title: 'Новый отзыв',
        message: 'Получен новый 5-звездочный отзыв на MACA от Владимира К.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        read: true,
        priority: 'low',
        action: 'Посмотреть отзыв'
      },
      {
        id: 5,
        type: 'alert',
        title: 'Подозрительная активность',
        message: 'Обнаружены множественные попытки входа с неизвестного IP.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        priority: 'high',
        action: 'Проверить безопасность'
      },
      {
        id: 6,
        type: 'success',
        title: 'Рекламная кампания завершена',
        message: 'Кампания "ULTIMATE PACK Акция" достигла ROAS 6.3x. Бюджет исчерпан.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        priority: 'medium',
        action: 'Анализ результатов'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'high':
        return notifications.filter(n => n.priority === 'high');
      case 'alerts':
        return notifications.filter(n => n.type === 'alert');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'border-red-500 bg-red-50';
    }
    switch (type) {
      case 'alert':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  const filteredNotifications = getFilteredNotifications();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black dark:bg-black bg-opacity-50 dark:bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 dark:bg-black rounded-lg">
                  <Icon path="M15 17h5l-5 5v-5z M9 5H4l5-5v5z M11 19h5l-5 5v-5z" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Центр уведомлений</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все уведомления прочитаны'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 mt-4">
              {[
                { id: 'all', label: 'Все', count: notifications.length },
                { id: 'unread', label: 'Непрочитанные', count: unreadCount },
                { id: 'high', label: 'Важные', count: notifications.filter(n => n.priority === 'high').length },
                { id: 'alerts', label: 'Оповещения', count: notifications.filter(n => n.type === 'alert').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filter === filterOption.id
                      ? 'bg-blue-600 dark:bg-black text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors ml-auto"
                >
                  Прочитать все
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'У вас пока нет уведомлений' : 'Нет уведомлений в этой категории'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                      !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                    } hover:bg-opacity-75 transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-black' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.priority === 'high' ? 'Высокий' : 
                               notification.priority === 'medium' ? 'Средний' : 'Низкий'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {notification.action && (
                                <button className="text-xs bg-blue-600 dark:bg-black text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-gray-800 transition-colors">
                                  {notification.action}
                                </button>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  Прочитано
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-800 transition-colors"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
              </p>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  Настройки уведомлений
                </button>
                <button className="text-sm bg-blue-600 dark:bg-black text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-800 transition-colors">
                  Экспорт
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;