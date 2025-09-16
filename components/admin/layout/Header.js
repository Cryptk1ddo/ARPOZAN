import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import NotificationCenter from '../shared/NotificationCenter';
import NotificationSettings from '../shared/NotificationSettings';
import BackupExportCenter from '../shared/BackupExportCenter';

// Enhanced Header Component with Notification System
const Header = ({ theme, toggleTheme, toggleSidebar, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [backupExportOpen, setBackupExportOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Simulate real-time notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every second
        setUnreadCount(prev => prev + 1);
        
        // Trigger toast notification if available
        if (window.toast) {
          const notifications = [
            { type: 'info', message: 'Новый заказ получен', title: 'Заказ #' + Math.floor(Math.random() * 10000) },
            { type: 'warning', message: 'Низкий остаток товара', title: 'Склад' },
            { type: 'success', message: 'Платеж подтвержден', title: 'Оплата' }
          ];
          const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
          window.toast[randomNotification.type](randomNotification.message, randomNotification.title);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const openNotificationCenter = () => {
    setNotificationCenterOpen(true);
    setMenuOpen(false);
  };

  const openNotificationSettings = () => {
    setNotificationSettingsOpen(true);
    setMenuOpen(false);
  };

  const openBackupExport = () => {
    setBackupExportOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -64 }} 
        animate={{ y: 0 }} 
        className="bg-white/95 backdrop-blur-sm text-black py-4 px-6 shadow-lg fixed top-0 w-full z-30 border-b border-gray-200"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar} 
              className="lg:block hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5"/>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-black">
                  ARPOZAN
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Notification Bell */}
            <div className="relative">
              <button 
                onClick={openNotificationCenter}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Центр уведомлений"
              >
                <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white" 
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Поиск"
            >
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            </button>

            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Чат с поддержкой"
            >
              <Icon path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            </button>

            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <Icon path={menuOpen ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} className="w-4 h-4 text-gray-600 transition-transform" />
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-black">Администратор</p>
                          <p className="text-sm text-gray-600">{user?.email || 'admin@arpozan.com'}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">Онлайн</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button 
                        onClick={openNotificationCenter}
                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium">Уведомления</span>
                          <div className="text-xs text-gray-500">Центр уведомлений</div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <button 
                        onClick={openNotificationSettings}
                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-medium">Настройки</span>
                          <div className="text-xs text-gray-500">Управление уведомлениями</div>
                        </div>
                      </button>

                      <button 
                        onClick={openBackupExport}
                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium">Резервные копии</span>
                          <div className="text-xs text-gray-500">Экспорт и бэкапы</div>
                        </div>
                      </button>

                      <button 
                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium">Профиль</span>
                          <div className="text-xs text-gray-500">Личные данные</div>
                        </div>
                      </button>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={onLogout} 
                          className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3"
                        >
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium">Выйти</span>
                            <div className="text-xs text-red-400">Завершить сеанс</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Notification Components */}
      <NotificationCenter 
        isOpen={notificationCenterOpen} 
        onClose={() => {
          setNotificationCenterOpen(false);
          setUnreadCount(0); // Mark all as read when center is closed
        }} 
      />
      
      <NotificationSettings 
        isOpen={notificationSettingsOpen} 
        onClose={() => setNotificationSettingsOpen(false)} 
      />
    </>
  );
};

export default Header;