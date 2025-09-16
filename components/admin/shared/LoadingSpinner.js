import { motion } from 'framer-motion';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen w-full bg-gray-50 dark:bg-black">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} 
      className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full"
    />
  </div>
);

export default LoadingSpinner;