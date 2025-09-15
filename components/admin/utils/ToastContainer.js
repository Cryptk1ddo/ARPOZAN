import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      text: 'text-green-100'
    },
    error: {
      bg: 'bg-red-500/20', 
      border: 'border-red-500/30',
      icon: 'text-red-400',
      text: 'text-red-100'
    },
    warning: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30', 
      icon: 'text-yellow-400',
      text: 'text-yellow-100'
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      icon: 'text-blue-400', 
      text: 'text-blue-100'
    }
  };

  const Icon = icons[toast.type];
  const colorScheme = colors[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`glass-card ${colorScheme.bg} border ${colorScheme.border} rounded-lg p-4 shadow-lg max-w-sm w-full`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${colorScheme.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={`font-medium ${colorScheme.text} mb-1`}>
              {toast.title}
            </p>
          )}
          <p className={`text-sm ${colorScheme.text} opacity-90`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className={`${colorScheme.icon} hover:opacity-75 transition-opacity flex-shrink-0`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Global toast function
  useEffect(() => {
    window.showToast = (message, type = 'info', title = null, duration = 5000) => {
      const id = Date.now() + Math.random();
      const toast = { id, message, type, title, duration };
      
      setToasts(prev => [...prev, toast]);
    };

    return () => {
      delete window.showToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;