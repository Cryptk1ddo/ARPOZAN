import { useState } from 'react'
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  LogOut,
  X,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '../lib/AuthContext'
import { useCart } from '../lib/CartContext'
import { useWishlist } from '../lib/WishlistContext'

export default function UserProfile({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const { cart, addToCart } = useCart()
  const { wishlist, removeFromWishlist } = useWishlist()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isOpen || !user) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'wishlist', label: 'Избранное', icon: Heart },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900/95 backdrop-blur-md rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <User size={28} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">
                  Онлайн
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <div className="text-xs text-gray-400">Уровень</div>
              <div className="text-yellow-500 font-semibold">Gold</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:rotate-90 transform"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 bg-gray-900/30">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-yellow-500 bg-yellow-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.id === 'wishlist' && wishlist.length > 0 && (
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Overview */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User size={32} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {user.name}
                    </h3>
                    <p className="text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-400">Активен</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">
                      {wishlist.length}
                    </div>
                    <div className="text-xs text-gray-400">Избранное</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">
                      {cart.length}
                    </div>
                    <div className="text-xs text-gray-400">В корзине</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">
                      {user.orders?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Заказов</div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <User size={20} />
                  <span>Личная информация</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Имя
                    </label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Email
                    </label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Телефон
                    </label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                      {user.phone || 'Не указан'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Дата регистрации
                    </label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                      {new Date(
                        user.createdAt || Date.now()
                      ).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Недавняя активность
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Heart size={16} className="text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        Добавлено в избранное
                      </p>
                      <p className="text-gray-400 text-xs">2 часа назад</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <ShoppingCart size={16} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Просмотр корзины</p>
                      <p className="text-gray-400 text-xs">5 часов назад</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <ShoppingBag size={20} />
                  <span>История заказов</span>
                </h3>
                <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  {user.orders?.length || 0} заказов
                </span>
              </div>

              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-white font-medium">
                            Заказ #{order.id}
                          </span>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.date).toLocaleDateString('ru-RU')} в{' '}
                            {new Date(order.date).toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : order.status === 'processing'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : order.status === 'shipped'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {order.status === 'completed'
                            ? 'Выполнен'
                            : order.status === 'processing'
                              ? 'В обработке'
                              : order.status === 'shipped'
                                ? 'Отправлен'
                                : 'Ожидает'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-white font-semibold text-lg">
                          {order.total}₽
                        </div>
                        <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors">
                          Подробнее →
                        </button>
                      </div>

                      {order.items && (
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                          <p className="text-gray-400 text-sm">
                            {order.items.length} товар
                            {order.items.length !== 1 ? 'а' : ''} • Доставка:{' '}
                            {order.delivery || 'Стандартная'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={32} className="text-blue-500/60" />
                  </div>
                  <h4 className="text-white font-medium text-lg mb-2">
                    У вас пока нет заказов
                  </h4>
                  <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                    Ваши будущие заказы будут отображаться здесь
                  </p>
                  <Link
                    href="/#catalog"
                    onClick={onClose}
                    className="inline-flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    <span>Начать покупки</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Избранные товары
                </h3>
                <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  {wishlist.length} товаров
                </span>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">
                            {product.icon || '💊'}
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={product.href || '#'}
                            className="block group-hover:text-yellow-400 transition-colors"
                            onClick={onClose}
                          >
                            <h4 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
                              {product.name}
                            </h4>
                          </Link>

                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-yellow-500 font-semibold text-sm">
                              {product.price}₽
                            </span>
                            {product.originalPrice && (
                              <span className="text-gray-500 text-xs line-through">
                                {product.originalPrice}₽
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${
                                  i < (product.rating || 4)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">
                              {(product.rating || 4.2).toFixed(1)}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium"
                            >
                              <ShoppingCart size={14} />
                              <span>В корзину</span>
                            </button>

                            <button
                              onClick={() =>
                                handleRemoveFromWishlist(product.id)
                              }
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                              title="Удалить из избранного"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={32} className="text-yellow-500/60" />
                  </div>
                  <h4 className="text-white font-medium text-lg mb-2">
                    Ваш список избранного пуст
                  </h4>
                  <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                    Добавляйте товары в избранное, чтобы быстро находить их
                    позже
                  </p>
                  <Link
                    href="/#catalog"
                    onClick={onClose}
                    className="inline-flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    <span>Перейти к каталогу</span>
                  </Link>
                </div>
              )}

              {/* Wishlist Stats */}
              {wishlist.length > 0 && (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <h4 className="text-white font-medium mb-3">
                    Статистика избранного
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {wishlist.length}
                      </div>
                      <div className="text-xs text-gray-400">Всего товаров</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        {wishlist.reduce(
                          (sum, item) => sum + (item.price || 0),
                          0
                        )}
                        ₽
                      </div>
                      <div className="text-xs text-gray-400">
                        Общая стоимость
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Settings size={20} />
                <h3 className="text-lg font-semibold text-white">
                  Настройки аккаунта
                </h3>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                  <span>🔔</span>
                  <span>Уведомления</span>
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        defaultChecked
                      />
                      <div>
                        <span className="text-white text-sm font-medium">
                          Email уведомления о заказах
                        </span>
                        <p className="text-gray-400 text-xs">
                          Получайте информацию о статусе ваших заказов
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        defaultChecked
                      />
                      <div>
                        <span className="text-white text-sm font-medium">
                          Уведомления о скидках
                        </span>
                        <p className="text-gray-400 text-xs">
                          Будьте в курсе специальных предложений
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                      />
                      <div>
                        <span className="text-white text-sm font-medium">
                          Push уведомления
                        </span>
                        <p className="text-gray-400 text-xs">
                          Получайте уведомления в браузере
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Приватность</span>
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        defaultChecked
                      />
                      <div>
                        <span className="text-white text-sm font-medium">
                          Показывать профиль
                        </span>
                        <p className="text-gray-400 text-xs">
                          Разрешить другим видеть ваш профиль
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                      />
                      <div>
                        <span className="text-white text-sm font-medium">
                          Аналитика использования
                        </span>
                        <p className="text-gray-400 text-xs">
                          Помогите улучшить сервис
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Действия с аккаунтом</span>
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-white text-sm">
                    Изменить пароль
                  </button>
                  <button className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-white text-sm">
                    Экспорт данных
                  </button>
                  <button className="w-full text-left p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 text-sm border border-red-500/20">
                    Удалить аккаунт
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-400">
                Последний вход: {new Date().toLocaleDateString('ru-RU')}
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">
                Помощь
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/30"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
