import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Загрузка...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full`}
      />
      {text && (
        <p className={`text-gray-300 ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;