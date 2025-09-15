import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Панель управления', icon: LayoutDashboard, id: 'Панель управления' },
    { name: 'Продукты', icon: Package, id: 'Продукты' },
    { name: 'Заказы', icon: ShoppingCart, id: 'Заказы' },
    { name: 'Отчеты', icon: BarChart3, id: 'Отчеты' },
    { name: 'Настройки', icon: Settings, id: 'Настройки' }
  ];

  return (
    <motion.div
      className={`fixed left-0 top-16 bottom-0 z-40 glass-card bg-black/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      {/* Collapse Toggle */}
      <div className="absolute top-4 -right-3 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 glass-card bg-gray-800/90 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  className="text-sm font-medium truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.name}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Brand Section */}
      {!isCollapsed && (
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="glass-card bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-center">
              <h3 className="text-white font-semibold text-sm mb-2">ARPOZAN Admin</h3>
              <p className="text-gray-400 text-xs mb-3">
                Управление премиальными добавками для мужского здоровья
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-white to-gray-300"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Система активна</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;