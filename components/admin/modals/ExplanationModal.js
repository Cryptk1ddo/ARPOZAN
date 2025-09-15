import { motion } from 'framer-motion';
import { Info, X, ExternalLink } from 'lucide-react';

const ExplanationModal = ({ 
  isOpen, 
  onClose, 
  title = "Объяснение",
  content,
  actions = []
}) => {
  if (!isOpen) return null;

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
        className="glass-card bg-white/10 border border-white/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Info className="h-5 w-5 text-blue-400" />
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {typeof content === 'string' ? (
            <div className="text-gray-300 whitespace-pre-wrap">{content}</div>
          ) : (
            content
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="p-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    action.variant === 'primary' 
                      ? 'glow-button text-black font-semibold'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  <span>{action.label}</span>
                  {action.external && <ExternalLink className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExplanationModal;