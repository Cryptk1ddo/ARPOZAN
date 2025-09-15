import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Подтвердите действие",
  message = "Вы уверены, что хотите выполнить это действие?",
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "default" // "default", "danger", "warning"
}) => {
  if (!isOpen) return null;

  const variants = {
    default: {
      buttonClass: "glow-button text-black font-semibold",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    danger: {
      buttonClass: "bg-red-500 hover:bg-red-600 text-white font-semibold",
      iconColor: "text-red-400", 
      bgColor: "bg-red-500/20"
    },
    warning: {
      buttonClass: "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold",
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card bg-white/10 border border-white/20 rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${currentVariant.bgColor} rounded-lg flex items-center justify-center`}>
              <AlertTriangle className={`h-5 w-5 ${currentVariant.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${currentVariant.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;