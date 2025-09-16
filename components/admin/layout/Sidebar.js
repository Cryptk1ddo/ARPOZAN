import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';

// Sidebar Component
const Sidebar = ({ currentView, setCurrentView, isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: 'Панель управления', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', accentColor: 'accent-purple-500' },
    { name: 'Продукты', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', accentColor: 'accent-emerald-500' },
    { name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', accentColor: 'accent-orange-500' },
    { name: 'Клиенты', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', accentColor: 'accent-rose-500' },
    { name: 'Склад', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', accentColor: 'accent-blue-500' },
    { name: 'Маркетинг', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', accentColor: 'accent-cyan-500' },
    { name: 'Мониторинг', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', accentColor: 'accent-teal-500' },
    { name: 'Пользователи', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', accentColor: 'accent-indigo-500' },
    { name: 'Отчеты', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z', accentColor: 'accent-violet-500' },
    { name: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', accentColor: 'accent-gray-500' },
  ];

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full bg-black border-r border-gray-800 z-20 pt-20 flex flex-col shadow-2xl"
    >
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <motion.button 
            key={item.name} 
            onClick={() => setCurrentView(item.name)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
              currentView === item.name 
                ? `bg-white text-black shadow-lg transform scale-105 ${item.accentColor}` 
                : 'hover:bg-gray-900 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <Icon path={item.icon} className="w-5 h-5 flex-shrink-0"/>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{opacity: 0, width: 0}} 
                  animate={{opacity: 1, width: 'auto'}} 
                  exit={{opacity: 0, width: 0}} 
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
            {currentView === item.name && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-0 w-1 h-8 bg-black rounded-l-full"
              />
            )}
          </motion.button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-gray-900 text-gray-300 hover:text-white transition-all duration-300 border border-gray-800 hover:border-gray-700"
        >
          <Icon path={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{opacity: 0, width: 0}} 
                animate={{opacity: 1, width: 'auto'}} 
                exit={{opacity: 0, width: 0}} 
                className="whitespace-nowrap overflow-hidden"
              >
                Свернуть
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;