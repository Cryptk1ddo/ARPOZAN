import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'
import { User, Package, Settings, Heart, Bell, Shield, Edit, Camera, Truck, RefreshCw, Clock, Check, Star, Award, TrendingUp, Calendar, MapPin, Download, Eye, Lock, Trash2, Gift, Target, Activity, BarChart3, Zap, Crown } from 'lucide-react'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'Алексей Петров',
    email: 'alexey.petrov@gmail.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-05-15',
    avatar: '/assets/imgs/Artur.jpg',
    address: 'Москва, ул. Примерная, д. 123, кв. 45',
    memberSince: '2024-03-15',
    loyaltyPoints: 2450,
    totalSpent: 45780,
    preferences: {
      notifications: true,
      newsletter: true,
      promotions: false,
      darkMode: true,
      language: 'ru',
    }
  })

  const [stats] = useState({
    totalOrders: 12,
    successfulDeliveries: 11,
    avgOrderValue: 3815,
    favoriteProduct: 'ULTIMATE MEN\'S PACK',
    healthGoalsAchieved: 8,
    streakDays: 45,
  })

  const [achievements] = useState([
    { id: 1, name: 'Первый заказ', description: 'Совершен первый заказ', icon: '🎯', earned: true, date: '2024-03-20' },
    { id: 2, name: 'Постоянный клиент', description: '5+ заказов за год', icon: '⭐', earned: true, date: '2024-08-15' },
    { id: 3, name: 'Здоровый выбор', description: 'Заказан Ultimate Pack', icon: '💪', earned: true, date: '2025-08-28' },
    { id: 4, name: 'Ранний птица', description: '30 дней подряд с продуктами', icon: '🌅', earned: false, progress: 75 },
    { id: 5, name: 'Эксперт здоровья', description: 'Попробованы все продукты', icon: '🧬', earned: false, progress: 60 },
  ])

  const [orders] = useState([
    {
      id: '#ARZ-001',
      date: '2025-09-10',
      status: 'delivered',
      total: 2990,
      trackingNumber: 'TRK789456123',
      deliveryDate: '2025-09-12',
      rating: 5,
      items: [
        { name: 'ARPOZAN Tongkat Ali', quantity: 1, price: 2990, image: '/assets/imgs/Tongkat Ali.png' }
      ]
    },
    {
      id: '#ARZ-002',
      date: '2025-08-28',
      status: 'shipping',
      total: 7990,
      trackingNumber: 'TRK456789012',
      estimatedDelivery: '2025-09-16',
      items: [
        { name: 'ULTIMATE MEN\'S PACK', quantity: 1, price: 7990, image: '/assets/imgs/Ultimate Pack.png' }
      ]
    },
    {
      id: '#ARZ-003',
      date: '2025-08-15',
      status: 'processing',
      total: 3980,
      items: [
        { name: 'ARPOZAN Maca', quantity: 1, price: 1990, image: '/assets/imgs/Maka peruvian.png' },
        { name: 'ARPOZAN Zinc', quantity: 1, price: 1990, image: '/assets/imgs/Zink.png' }
      ]
    }
  ])

  const [recentActivity] = useState([
    { type: 'order', text: 'Заказ #ARZ-001 доставлен', date: '2 дня назад', icon: Package },
    { type: 'points', text: '+150 баллов лояльности', date: '2 дня назад', icon: Star },
    { type: 'achievement', text: 'Получено достижение "Здоровый выбор"', date: '5 дней назад', icon: Award },
    { type: 'review', text: 'Оставлен отзыв на Tongkat Ali', date: '1 неделя назад', icon: Heart },
  ])

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to backend
    console.log('Profile saved:', userData)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-5 h-5 text-green-400" />
      case 'shipping':
        return <Truck className="w-5 h-5 text-blue-400" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <Package className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Доставлен'
      case 'shipping':
        return 'В пути'
      case 'processing':
        return 'Обрабатывается'
      default:
        return 'Неизвестно'
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Дашборд', icon: BarChart3 },
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'orders', name: 'Заказы', icon: Package },
    { id: 'achievements', name: 'Достижения', icon: Award },
    { id: 'wishlist', name: 'Избранное', icon: Heart },
    { id: 'settings', name: 'Настройки', icon: Settings },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-heading mb-4">
                Личный <span className="gradient-text">кабинет</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 mx-auto mb-6"></div>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Управляйте своим профилем, отслеживайте заказы и настраивайте предпочтения
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl bg-black/80">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap border-b-2 ${
                      activeTab === tab.id
                        ? 'text-white border-white bg-white/5'
                        : 'text-gray-400 border-transparent hover:text-white hover:border-white/30'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                      <Image
                        src={userData.avatar}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Добро пожаловать, <span className="gradient-text">{userData.name.split(' ')[0]}</span>!
                      </h2>
                      <p className="text-gray-300">
                        Клиент с {new Date(userData.memberSince).toLocaleDateString('ru-RU')} • {stats.streakDays} дней с продуктами
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-bold text-white mb-1">{stats.totalOrders}</div>
                      <div className="text-gray-300 text-sm">Заказов</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-bold text-white mb-1">{userData.loyaltyPoints.toLocaleString()}</div>
                      <div className="text-gray-300 text-sm">Баллов</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-bold text-white mb-1">{userData.totalSpent.toLocaleString()}₽</div>
                      <div className="text-gray-300 text-sm">Потрачено</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-bold text-white mb-1">{stats.healthGoalsAchieved}</div>
                      <div className="text-gray-300 text-sm">Целей</div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">VIP Статус</h3>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold gradient-text mb-2">GOLD</div>
                    <p className="text-gray-300 text-sm mb-4">До Platinum осталось 2550 баллов</p>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check size={16} className="text-green-400" />
                      Скидка 10% на все заказы
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check size={16} className="text-green-400" />
                      Приоритетная доставка
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check size={16} className="text-green-400" />
                      Персональный менеджер
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Недавняя активность</h3>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{activity.text}</p>
                            <p className="text-gray-400 text-xs">{activity.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Статистика здоровья</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Энергия</p>
                        <p className="text-gray-300 text-sm">Прогресс за месяц</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">+35%</div>
                        <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Выносливость</p>
                        <p className="text-gray-300 text-sm">Прогресс за месяц</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">+28%</div>
                        <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Концентрация</p>
                        <p className="text-gray-300 text-sm">Прогресс за месяц</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">+42%</div>
                        <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div className="bg-purple-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Быстрые действия</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-200 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <RefreshCw size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">Повторить заказ</span>
                  </button>
                  <Link href="/" className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-200 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Package size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">Новый заказ</span>
                  </Link>
                  <button onClick={() => setActiveTab('orders')} className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-200 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Truck size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">Отследить</span>
                  </button>
                  <button onClick={() => setActiveTab('achievements')} className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-200 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                      <Award size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">Достижения</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <div className="glass-card rounded-3xl p-8 mb-8 border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 group-hover:border-white/40 transition-colors">
                      <Image
                        src={userData.avatar}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
                    <p className="text-gray-300 mb-4">{userData.email}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center justify-center gap-2 glass-card border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:border-white/40 backdrop-blur-xl"
                      >
                        <Edit size={16} />
                        {isEditing ? 'Отменить' : 'Редактировать'}
                      </button>
                      {isEditing && (
                        <button
                          onClick={handleSaveProfile}
                          className="glow-button text-black font-medium px-6 py-3 rounded-xl"
                        >
                          Сохранить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white mb-6">Личная информация</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Имя</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Телефон</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Дата рождения</label>
                      <input
                        type="date"
                        value={userData.birthDate}
                        onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
                        disabled={!isEditing}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white mb-6">Адрес доставки</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Адрес</label>
                      <textarea
                        value={userData.address}
                        onChange={(e) => setUserData({...userData, address: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-white/40 focus:outline-none disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">История заказов</h2>
                  <p className="text-gray-300">Отслеживайте статус и управляйте заказами</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{orders.length}</div>
                    <div className="text-gray-300 text-sm">Всего</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">{orders.filter(o => o.status === 'delivered').length}</div>
                    <div className="text-gray-300 text-sm">Доставлено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{stats.avgOrderValue.toLocaleString()}₽</div>
                    <div className="text-gray-300 text-sm">Средний чек</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="text-white font-bold text-lg">{order.id}</span>
                        </div>
                        <div className="text-gray-300">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-gray-400 text-sm">
                            Трек: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          order.status === 'shipping' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {getStatusText(order.status)}
                        </span>
                        <div className="text-white font-bold text-2xl">
                          {order.total.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    {order.status !== 'processing' && (
                      <div className="mb-6 p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-4">Статус доставки</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                              <Check size={16} className="text-white" />
                            </div>
                            <span className="text-xs text-center text-green-400">Заказ<br/>принят</span>
                          </div>
                          <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' || order.status === 'shipping' ? 'bg-green-500' : 'bg-white/20'}`}></div>
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                              order.status === 'delivered' || order.status === 'shipping' ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              <Package size={16} className="text-white" />
                            </div>
                            <span className={`text-xs text-center ${
                              order.status === 'delivered' || order.status === 'shipping' ? 'text-green-400' : 'text-gray-400'
                            }`}>Собран<br/>на складе</span>
                          </div>
                          <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' ? 'bg-green-500' : 'bg-white/20'}`}></div>
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                              order.status === 'delivered' ? 'bg-green-500' : order.status === 'shipping' ? 'bg-blue-500 animate-pulse' : 'bg-white/20'
                            }`}>
                              <Truck size={16} className="text-white" />
                            </div>
                            <span className={`text-xs text-center ${
                              order.status === 'delivered' ? 'text-green-400' : order.status === 'shipping' ? 'text-blue-400' : 'text-gray-400'
                            }`}>В пути</span>
                          </div>
                          <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' ? 'bg-green-500' : 'bg-white/20'}`}></div>
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                              order.status === 'delivered' ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              <MapPin size={16} className="text-white" />
                            </div>
                            <span className={`text-xs text-center ${
                              order.status === 'delivered' ? 'text-green-400' : 'text-gray-400'
                            }`}>Доставлен</span>
                          </div>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="mt-4 text-center">
                            <span className="text-gray-300 text-sm">
                              Ожидаемая доставка: <span className="text-white font-medium">{new Date(order.estimatedDelivery).toLocaleDateString('ru-RU')}</span>
                            </span>
                          </div>
                        )}
                        {order.deliveryDate && (
                          <div className="mt-4 text-center">
                            <span className="text-gray-300 text-sm">
                              Доставлено: <span className="text-green-400 font-medium">{new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{item.name}</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Кол-во: {item.quantity}</span>
                              <span className="text-white font-bold">{item.price.toLocaleString()} ₽</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex items-center justify-center gap-2 glass-card border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:border-white/40 backdrop-blur-xl">
                        <RefreshCw size={16} />
                        Заказать снова
                      </button>
                      {order.trackingNumber && (
                        <button className="flex items-center justify-center gap-2 glass-card border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:border-white/40 backdrop-blur-xl">
                          <Truck size={16} />
                          Отследить посылку
                        </button>
                      )}
                      {order.status === 'delivered' && !order.rating && (
                        <button className="flex items-center justify-center gap-2 glass-card border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:border-white/40 backdrop-blur-xl">
                          <Star size={16} />
                          Оставить отзыв
                        </button>
                      )}
                      {order.rating && (
                        <div className="flex items-center gap-2 px-6 py-3">
                          <span className="text-gray-300">Ваша оценка:</span>
                          <div className="flex">
                            {[...Array(order.rating)].map((_, i) => (
                              <Star key={i} size={16} className="text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      )}
                      <button className="flex items-center justify-center gap-2 glass-card border border-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:border-white/40 backdrop-blur-xl">
                        <Download size={16} />
                        Скачать чек
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Достижения</h2>
                  <p className="text-gray-300">Отслеживайте свой прогресс и получайте награды</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}/{achievements.length}</div>
                  <div className="text-gray-300 text-sm">Получено</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`glass-card rounded-2xl p-6 border transition-all duration-300 backdrop-blur-xl ${
                      achievement.earned 
                        ? 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className={`text-4xl mb-3 ${achievement.earned ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${achievement.earned ? 'text-yellow-400' : 'text-white'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{achievement.description}</p>
                    </div>

                    {achievement.earned ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                          <Check size={16} />
                          <span className="text-sm font-medium">Получено</span>
                        </div>
                        <div className="text-gray-400 text-xs">{achievement.date}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 text-sm">Прогресс</span>
                          <span className="text-white text-sm font-medium">{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-white/60 to-white/80 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Achievement Rewards */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">Награды за достижения</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-2xl mb-2">🎁</div>
                    <div className="text-white font-medium mb-1">Скидка 5%</div>
                    <div className="text-gray-300 text-sm">За первое достижение</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="text-white font-medium mb-1">500 баллов</div>
                    <div className="text-gray-300 text-sm">За 5 достижений</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-2xl mb-2">👑</div>
                    <div className="text-white font-medium mb-1">VIP статус</div>
                    <div className="text-gray-300 text-sm">За все достижения</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="max-w-4xl mx-auto text-center">
              <div className="glass-card rounded-3xl p-12 border border-white/10 backdrop-blur-xl">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Список желаний пуст</h2>
                <p className="text-gray-300 mb-8">
                  Добавляйте понравившиеся товары в избранное, чтобы не потерять их
                </p>
                <Link href="/" className="glow-button text-black font-bold px-8 py-3 rounded-xl inline-block">
                  Перейти к покупкам
                </Link>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {/* Account Preferences */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Настройки аккаунта</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Язык интерфейса</label>
                      <select
                        value={userData.preferences.language}
                        onChange={(e) => setUserData({
                          ...userData,
                          preferences: { ...userData.preferences, language: e.target.value }
                        })}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                      >
                        <option value="ru" className="bg-black">Русский</option>
                        <option value="en" className="bg-black">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Часовой пояс</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white/40 focus:outline-none">
                        <option value="msk" className="bg-black">Москва (UTC+3)</option>
                        <option value="spb" className="bg-black">Санкт-Петербург (UTC+3)</option>
                        <option value="ekb" className="bg-black">Екатеринбург (UTC+5)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Уведомления</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Уведомления о заказах</h4>
                        <p className="text-gray-300 text-sm">Получать информацию о статусе заказов в реальном времени</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.notifications}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: { ...userData.preferences, notifications: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Новостная рассылка</h4>
                        <p className="text-gray-300 text-sm">Получать новости о продуктах и здоровье</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.newsletter}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: { ...userData.preferences, newsletter: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Рекламные предложения</h4>
                        <p className="text-gray-300 text-sm">Получать персональные скидки и акции</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.promotions}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: { ...userData.preferences, promotions: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Push-уведомления</h4>
                        <p className="text-gray-300 text-sm">Мгновенные уведомления в браузере</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Приватность и безопасность</h3>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Lock size={20} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-white font-medium block">Изменить пароль</span>
                          <span className="text-gray-300 text-sm">Последнее изменение: 3 месяца назад</span>
                        </div>
                      </div>
                      <Edit size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-white font-medium block">Двухфакторная аутентификация</span>
                          <span className="text-green-400 text-sm">Включена</span>
                        </div>
                      </div>
                      <Edit size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Eye size={20} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-white font-medium block">Активные сессии</span>
                          <span className="text-gray-300 text-sm">Управление устройствами</span>
                        </div>
                      </div>
                      <Edit size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Download className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Управление данными</h3>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Download size={20} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-white font-medium block">Экспорт данных</span>
                          <span className="text-gray-300 text-sm">Скачать все ваши данные в JSON</span>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-gray-400" />
                        <div className="text-left">
                          <span className="text-white font-medium block">История активности</span>
                          <span className="text-gray-300 text-sm">Просмотр логов входов и действий</span>
                        </div>
                      </div>
                      <Eye size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Subscription Management */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <RefreshCw className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Подписки и автозаказы</h3>
                  </div>
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">Автозаказы не настроены</h4>
                    <p className="text-gray-300 mb-6">Настройте регулярную доставку ваших любимых продуктов</p>
                    <button className="glow-button text-black font-bold px-6 py-3 rounded-xl">
                      Настроить автозаказ
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="glass-card rounded-2xl p-6 border border-red-500/20 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-red-400 mb-6">Опасная зона</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Trash2 size={20} className="text-red-400" />
                        <div className="text-left">
                          <span className="text-red-400 font-medium block">Удалить аккаунт</span>
                          <span className="text-gray-300 text-sm">Это действие нельзя отменить</span>
                        </div>
                      </div>
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}