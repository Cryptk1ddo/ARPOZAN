import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

const ToastNotification = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onRemove]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return { path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: 'text-green-500' };
      case 'error':
        return { path: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", color: 'text-red-500' };
      case 'warning':
        return { path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.267 16.5c-.77.833.192 2.5 1.732 2.5z", color: 'text-yellow-500' };
      case 'info':
        return { path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: 'text-blue-500' };
      default:
        return { path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: 'text-gray-500' };
    }
  };

  const getToastBackground = (type) => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-gray-800 border-green-500 shadow-green-100 dark:shadow-green-900/20';
      case 'error':
        return 'bg-white dark:bg-gray-800 border-red-500 shadow-red-100 dark:shadow-red-900/20';
      case 'warning':
        return 'bg-white dark:bg-gray-800 border-yellow-500 shadow-yellow-100 dark:shadow-yellow-900/20';
      case 'info':
        return 'bg-white dark:bg-gray-800 border-blue-500 shadow-blue-100 dark:shadow-blue-900/20';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-gray-100 dark:shadow-gray-900/20';
    }
  };

  const icon = getToastIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-start p-4 rounded-lg border-l-4 shadow-lg ${getToastBackground(notification.type)} max-w-sm w-full`}
    >
      <div className="flex-shrink-0">
        <Icon path={icon.path} className={`w-6 h-6 ${icon.color}`} />
      </div>
      <div className="ml-3 flex-1">
        {notification.title && (
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {notification.title}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {notification.message}
        </p>
        {notification.action && (
          <button
            onClick={notification.action.callback}
            className="mt-2 text-sm bg-blue-600 dark:bg-black text-white px-3 py-1 rounded hover:bg-blue-700 dark:hover:bg-gray-800 transition-colors"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => onRemove(notification.id)}
          className="rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
        >
          <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Global toast function
  useEffect(() => {
    window.toast = {
      success: (message, title, options = {}) => addNotification({
        type: 'success',
        message,
        title,
        ...options
      }),
      error: (message, title, options = {}) => addNotification({
        type: 'error',
        message,
        title,
        ...options
      }),
      warning: (message, title, options = {}) => addNotification({
        type: 'warning',
        message,
        title,
        ...options
      }),
      info: (message, title, options = {}) => addNotification({
        type: 'info',
        message,
        title,
        ...options
      })
    };

    return () => {
      delete window.toast;
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 z-50 p-6 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastNotification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;