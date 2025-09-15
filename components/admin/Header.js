import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  MessageSquare,
  Search,
  Menu
} from 'lucide-react';

const Header = ({ theme, toggleTheme, user, onLogout, onChatOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Новый заказ ARZ-004', time: '2 мин назад', unread: true },
    { id: 2, text: 'Товар "Мака" заканчивается', time: '15 мин назад', unread: true },
    { id: 3, text: 'Отчет за неделю готов', time: '1 час назад', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-white to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-sm">A</span>
              </div>
              <div>
                <h1 className="text-white font-black text-lg">ARPOZAN</h1>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск товаров, заказов..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* AI Chat Button */}
            <button
              onClick={onChatOpen}
              className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              title="ИИ Ассистент"
            >
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              title={`Переключить на ${theme === 'dark' ? 'светлую' : 'тёмную'} тему`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
                title="Уведомления"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 glass-card bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Уведомления</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                          notification.unread ? 'bg-white/2' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-blue-400' : 'bg-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-white text-sm">{notification.text}</p>
                            <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Посмотреть все
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-gray-400/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">Admin</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 glass-card bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
                >
                  <div className="p-2">
                    <button className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Настройки</span>
                    </button>
                    <button 
                      onClick={onLogout}
                      className="flex items-center space-x-2 w-full p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Выйти</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;