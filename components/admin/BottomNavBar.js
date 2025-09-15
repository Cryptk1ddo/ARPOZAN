import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const BottomNavBar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { name: 'Панель', icon: LayoutDashboard, id: 'Панель управления' },
    { name: 'Товары', icon: Package, id: 'Продукты' },
    { name: 'Заказы', icon: ShoppingCart, id: 'Заказы' },
    { name: 'Отчеты', icon: BarChart3, id: 'Отчеты' },
    { name: 'Настройки', icon: Settings, id: 'Настройки' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card bg-black/90 backdrop-blur-xl border-t border-white/10">
      <nav className="flex items-center justify-around py-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 border border-white/20'
                  : 'hover:bg-white/5'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavBar;