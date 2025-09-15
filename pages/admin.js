import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, auth } from '../lib/supabase'

// Enhanced Admin Panel based on adminpanelfull.jsx design
const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('Панель управления');
  const [theme, setTheme] = useState('dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auth state management
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setCurrentView('Панель управления');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage onAuth={(userData) => setUser(userData)} />;
  }

  return (
    <>
      <Head>
        <title>ARPOZAN - Административная панель</title>
        <meta name="description" content="Административная панель ARPOZAN" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-black font-sans">
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
          user={user}
          onLogout={() => auth.signOut()}
          onChatOpen={() => console.log('Chat opened')}
        />
        
        {!isMobile && (
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}

        <main 
          className={`transition-all duration-300 ${
            !isMobile ? (isCollapsed ? 'ml-20' : 'ml-64') : ''
          } pt-16 ${isMobile ? 'pb-16' : ''}`}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {currentView === 'Панель управления' && <DashboardView key="dashboard" />}
              {currentView === 'Продукты' && <ProductsView key="products" />}
              {currentView === 'Заказы' && <OrdersView key="orders" />}
              {currentView === 'Отчеты' && <ReportsView key="reports" />}
              {currentView === 'Настройки' && <SettingsView key="settings" />}
            </AnimatePresence>
          </div>
        </main>

        {isMobile && (
          <BottomNavBar 
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        )}
      </div>
    </>
  );
};

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

// Auth Page Component
const AuthPage = ({ onAuth }) => {
  const [email, setEmail] = useState('admin@arpozan.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;
      if (data.user) {
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="p-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white rounded-xl flex items-center justify-center mb-4">
            <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-8 h-8 text-white dark:text-black" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-gray-900 dark:text-gray-100">
            ARPOZAN
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Административная панель</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 text-gray-900 dark:text-gray-100 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 text-gray-900 dark:text-gray-100 transition-all"
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-2"></div>
                Вход...
              </div>
            ) : (
              'Войти'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 text-sm text-center">
            <strong>Demo:</strong> admin@arpozan.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Icon Component
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);

// Header Component
const Header = ({ theme, toggleTheme, toggleSidebar, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Новый заказ',
      message: 'Заказ #1234 на сумму ₽2,580',
      time: '2 мин назад',
      type: 'order',
      read: false
    },
    {
      id: 2,
      title: 'Низкий запас',
      message: 'TONGKAT ALI заканчивается (осталось 5 шт.)',
      time: '15 мин назад',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'Платеж получен',
      message: 'Оплата заказа #1233 подтверждена',
      time: '1 час назад',
      type: 'success',
      read: true
    },
    {
      id: 4,
      title: 'Обновление системы',
      message: 'Система будет обновлена завтра в 3:00',
      time: '2 часа назад',
      type: 'info',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-600 dark:text-blue-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'info': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.header 
      initial={{ y: -64 }} 
      animate={{ y: 0 }} 
      className="bg-white/80 dark:bg-black/50 backdrop-blur-sm text-gray-800 dark:text-white py-4 px-6 shadow-lg fixed top-0 w-full z-30 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar} 
            className="lg:block hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5"/>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white rounded-xl flex items-center justify-center shadow-lg">
              <Icon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-gray-900 dark:text-gray-100">
                ARPOZAN
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" 
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 max-h-96 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Уведомления</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Прочитать все
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Нет новых уведомлений</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Показать все уведомления
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat */}
          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <Icon path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" className="w-5 h-5" />
          </button>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
          >
            <span className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <Icon path="M19 9l-7 7-7-7" className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                    <p className="font-semibold text-gray-900 dark:text-white">Администратор</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || 'admin@arpozan.com'}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={onLogout} 
                      className="w-full text-left p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-4 h-4" />
                      <span>Выйти из системы</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Sidebar Component
const Sidebar = ({ currentView, setCurrentView, isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: 'Панель управления', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'from-blue-500 to-purple-500' },
    { name: 'Продукты', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', color: 'from-green-500 to-blue-500' },
    { name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'from-orange-500 to-red-500' },
    { name: 'Отчеты', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z', color: 'from-purple-500 to-pink-500' },
    { name: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20 pt-20 flex flex-col shadow-xl"
    >
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <motion.button 
            key={item.name} 
            onClick={() => setCurrentView(item.name)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              currentView === item.name 
                ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
              />
            )}
          </motion.button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
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

// Bottom Navigation for Mobile
const BottomNavBar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { name: 'Панель управления', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', short: 'Главная' },
    { name: 'Продукты', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', short: 'Товары' },
    { name: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', short: 'Заказы' },
    { name: 'Отчеты', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z', short: 'Отчеты' },
    { name: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', short: 'Настр.' },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }} 
      animate={{ y: 0 }} 
      className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-30 shadow-lg"
    >
      <div className="flex justify-around items-center py-1">
        {navItems.map((item, index) => (
          <motion.button 
            key={item.name} 
            onClick={() => setCurrentView(item.name)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={`relative flex flex-col items-center justify-center p-3 text-xs transition-all duration-200 rounded-xl min-w-0 flex-1 max-w-20 ${
              currentView === item.name 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <motion.div
              className="relative"
              animate={{
                y: currentView === item.name ? -2 : 0,
              }}
            >
              <Icon path={item.icon} className="w-5 h-5 mb-1" />
            </motion.div>
            <span className="font-medium truncate">{item.short}</span>
            {currentView === item.name && (
              <motion.div
                layoutId="mobileActiveIndicator"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Safe area for devices with home indicators */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900"></div>
    </motion.nav>
  );
};

// Dashboard View
const DashboardView = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    revenue: 2400000,
    orders: 1234,
    customers: 856,
    conversion: 3.2,
    lastUpdate: new Date()
  });
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Real-time data simulation
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const variance = 0.02; // 2% variance
        const newData = {
          revenue: Math.max(2000000, prev.revenue + (Math.random() - 0.5) * prev.revenue * variance),
          orders: Math.max(1000, prev.orders + Math.floor((Math.random() - 0.5) * 10)),
          customers: Math.max(500, prev.customers + Math.floor((Math.random() - 0.5) * 5)),
          conversion: Math.max(1, Math.min(10, prev.conversion + (Math.random() - 0.5) * 0.2)),
          lastUpdate: new Date()
        };
        
        // Update metrics with new data
        setMetrics([
          { 
            name: 'Общая выручка', 
            value: `₽${(newData.revenue / 1000000).toFixed(1)}M`, 
            change: `${newData.revenue > prev.revenue ? '+' : ''}${((newData.revenue - prev.revenue) / prev.revenue * 100).toFixed(1)}%`,
            icon: '💰', 
            color: 'from-green-500 to-blue-500',
            trend: newData.revenue > prev.revenue ? 'up' : 'down',
            rawValue: newData.revenue
          },
          { 
            name: 'Заказы', 
            value: newData.orders.toLocaleString(), 
            change: `${newData.orders > prev.orders ? '+' : ''}${newData.orders - prev.orders}`,
            icon: '📦', 
            color: 'from-blue-500 to-purple-500',
            trend: newData.orders > prev.orders ? 'up' : 'down',
            rawValue: newData.orders
          },
          { 
            name: 'Клиенты', 
            value: newData.customers.toLocaleString(), 
            change: `${newData.customers > prev.customers ? '+' : ''}${newData.customers - prev.customers}`,
            icon: '👥', 
            color: 'from-purple-500 to-pink-500',
            trend: newData.customers > prev.customers ? 'up' : 'down',
            rawValue: newData.customers
          },
          { 
            name: 'Конверсия', 
            value: `${newData.conversion.toFixed(1)}%`, 
            change: `${newData.conversion > prev.conversion ? '+' : ''}${(newData.conversion - prev.conversion).toFixed(1)}%`,
            icon: '📈', 
            color: 'from-orange-500 to-red-500',
            trend: newData.conversion > prev.conversion ? 'up' : 'down',
            rawValue: newData.conversion
          },
        ]);

        return newData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [liveUpdates]);

  // Initial data load
  useEffect(() => {
    const initialMetrics = [
      { name: 'Общая выручка', value: '₽2.4M', change: '+12%', icon: '💰', color: 'from-green-500 to-blue-500', trend: 'up', rawValue: 2400000 },
      { name: 'Заказы', value: '1,234', change: '+8%', icon: '📦', color: 'from-blue-500 to-purple-500', trend: 'up', rawValue: 1234 },
      { name: 'Клиенты', value: '856', change: '+15%', icon: '👥', color: 'from-purple-500 to-pink-500', trend: 'up', rawValue: 856 },
      { name: 'Конверсия', value: '3.2%', change: '+5%', icon: '📈', color: 'from-orange-500 to-red-500', trend: 'up', rawValue: 3.2 },
    ];
    
    setTimeout(() => {
      setMetrics(initialMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6"
    >
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Панель управления</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Добро пожаловать в административную панель ARPOZAN</p>
          </div>
          
          {/* Real-time controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {liveUpdates ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                liveUpdates 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {liveUpdates ? 'Pause Updates' : 'Resume Updates'}
            </button>
            <span className="text-xs text-gray-400">
              Last: {realTimeData.lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Real-time indicator */}
            {liveUpdates && (
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Trend indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`p-1 rounded-full ${
                    metric.trend === 'up' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <Icon 
                    path={metric.trend === 'up' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                    className={`w-3 h-3 ${
                      metric.trend === 'up' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`} 
                  />
                </motion.div>
                
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <motion.h3 
              key={metric.value}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
            >
              {metric.value}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{metric.name}</p>
            
            {/* Sparkline effect */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ИИ Рекомендации</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">AI Active</span>
            </div>
          </div>
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <span className="text-green-500">✨</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Увеличить запасы TONGKAT ALI</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Продажи выросли на 25% за последнюю неделю. Рекомендуется пополнить запас на 150 единиц.</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Высокий приоритет</span>
                  <span className="text-xs text-gray-500">Потенциал: +₽150K</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <span className="text-blue-500">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Создать промо для YOHIMBINE HCL</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Низкие остатки при высоком спросе. Скидка 15% может увеличить конверсию.</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Средний приоритет</span>
                  <span className="text-xs text-gray-500">Потенциал: +₽80K</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
            >
              <span className="text-purple-500">📊</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Оптимизировать мобильную конверсию</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Мобильный трафик составляет 65%, но конверсия ниже на 12%.</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">Низкий приоритет</span>
                  <span className="text-xs text-gray-500">Потенциал: +₽45K</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Activity</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <RealtimeActivityFeed />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Real-time Activity Feed Component
const RealtimeActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const generateActivity = () => {
      const types = [
        { type: 'order', icon: '🛒', color: 'text-green-600', message: 'Новый заказ' },
        { type: 'user', icon: '👤', color: 'text-blue-600', message: 'Новый пользователь' },
        { type: 'payment', icon: '💳', color: 'text-purple-600', message: 'Платеж получен' },
        { type: 'review', icon: '⭐', color: 'text-yellow-600', message: 'Новый отзыв' },
        { type: 'inventory', icon: '📦', color: 'text-orange-600', message: 'Обновление склада' },
      ];
      
      const products = ['TONGKAT ALI', 'YOHIMBINE HCL', 'MACA ROOT', 'ZINC', 'ULTIMATE PACK'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      return {
        id: Date.now() + Math.random(),
        ...randomType,
        product: randomProduct,
        time: new Date(),
        amount: type === 'order' || type === 'payment' ? Math.floor(Math.random() * 5000) + 500 : null
      };
    };

    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities);

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg">{activity.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {activity.message}
              {activity.amount && <span className="text-green-600 dark:text-green-400"> ₽{activity.amount}</span>}
            </p>
            <p className="text-xs text-gray-500 truncate">{activity.product}</p>
          </div>
          <span className="text-xs text-gray-400">
            {activity.time.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </motion.div>
      ))}
    </>
  );
};

// Products View
const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Mock product data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'TONGKAT ALI Premium',
        sku: 'TA-001',
        category: 'supplements',
        price: 2980,
        stock: 45,
        lowStockThreshold: 10,
        status: 'active',
        image: '/api/placeholder/200/200',
        description: 'Премиум экстракт Тонгкат Али для мужского здоровья',
        sales: 234,
        rating: 4.8,
        lastUpdated: new Date('2024-01-15'),
        tags: ['bestseller', 'premium', 'male-health']
      },
      {
        id: 2,
        name: 'YOHIMBINE HCL',
        sku: 'YH-002',
        category: 'supplements',
        price: 1980,
        stock: 8,
        lowStockThreshold: 15,
        status: 'active',
        image: '/api/placeholder/200/200',
        description: 'Чистый йохимбин гидрохлорид высокого качества',
        sales: 156,
        rating: 4.6,
        lastUpdated: new Date('2024-01-12'),
        tags: ['low-stock', 'performance']
      },
      {
        id: 3,
        name: 'MACA ROOT Organic',
        sku: 'MR-003',
        category: 'supplements',
        price: 1580,
        stock: 67,
        lowStockThreshold: 20,
        status: 'active',
        image: '/api/placeholder/200/200',
        description: 'Органический корень маки из Перу',
        sales: 89,
        rating: 4.4,
        lastUpdated: new Date('2024-01-10'),
        tags: ['organic', 'energy']
      },
      {
        id: 4,
        name: 'ZINC Chelate',
        sku: 'ZN-004',
        category: 'minerals',
        price: 890,
        stock: 23,
        lowStockThreshold: 25,
        status: 'draft',
        image: '/api/placeholder/200/200',
        description: 'Хелатированный цинк для лучшего усвоения',
        sales: 45,
        rating: 4.2,
        lastUpdated: new Date('2024-01-08'),
        tags: ['minerals', 'immunity']
      },
      {
        id: 5,
        name: 'ULTIMATE PACK',
        sku: 'UP-005',
        category: 'bundles',
        price: 5980,
        stock: 12,
        lowStockThreshold: 5,
        status: 'active',
        image: '/api/placeholder/200/200',
        description: 'Комплексный набор для мужского здоровья',
        sales: 78,
        rating: 4.9,
        lastUpdated: new Date('2024-01-14'),
        tags: ['bundle', 'bestseller', 'premium']
      }
    ];
    
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sales':
          comparison = a.sales - b.sales;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'supplements', label: 'Добавки' },
    { value: 'minerals', label: 'Минералы' },
    { value: 'bundles', label: 'Наборы' }
  ];

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { label: 'Нет в наличии', color: 'text-red-600 bg-red-100' };
    if (stock <= threshold) return { label: 'Мало', color: 'text-orange-600 bg-orange-100' };
    return { label: 'В наличии', color: 'text-green-600 bg-green-100' };
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? [] 
        : filteredProducts.map(p => p.id)
    );
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Управление продуктами
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} товаров • {selectedProducts.length} выбрано
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по названию или SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="name-asc">Название ↑</option>
            <option value="name-desc">Название ↓</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
            <option value="stock-asc">Остаток ↑</option>
            <option value="stock-desc">Остаток ↓</option>
            <option value="sales-desc">Продажи ↓</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon path="M4 6h16M4 10h16M4 14h16M4 18h16" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProducts.length} товар(ов) выбрано
              </span>
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                Активировать
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded">
                Деактивировать
              </button>
              <button className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                Удалить
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Products Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  
                  {/* Selection checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {product.tags.includes('bestseller') && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        ⭐ Хит
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {product.status === 'active' ? 'Активен' : 'Черновик'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    SKU: {product.sku}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₽{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Остаток: {product.stock}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Продано: {product.sales}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      Редактировать
                    </button>
                    <button className="px-3 py-2 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // Table View
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="w-8 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Товар
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Остаток
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Продажи
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-lg">📦</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {product.sku}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        ₽{product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {product.stock}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {product.sales}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {product.status === 'active' ? 'Активен' : 'Черновик'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Orders View
const OrdersView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Управление заказами</h1>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Раздел в разработке</h3>
        <p className="text-gray-600 dark:text-gray-400">Скоро здесь появится управление заказами</p>
      </div>
    </motion.div>
  );
};

// Reports View
const ReportsView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Отчеты и аналитика</h1>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Раздел в разработке</h3>
        <p className="text-gray-600 dark:text-gray-400">Скоро здесь появится система отчетов</p>
      </div>
    </motion.div>
  );
};

// Settings View
const SettingsView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Настройки системы</h1>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl">⚙️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Раздел в разработке</h3>
        <p className="text-gray-600 dark:text-gray-400">Скоро здесь появятся настройки системы</p>
      </div>
    </motion.div>
  );
};

export default AdminPanel;