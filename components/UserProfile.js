import { useState } from 'react'
import { User, Settings, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { useCart } from '../lib/CartContext'
import { useWishlist } from '../lib/WishlistContext'

export default function UserProfile({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isOpen || !user) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'wishlist', label: 'Избранное', icon: Heart },
    { id: 'settings', label: 'Настройки', icon: Settings }
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
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Личная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Имя</label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Телефон</label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg">{user.phone || 'Не указан'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Дата регистрации</label>
                    <p className="text-white bg-gray-800/50 px-3 py-2 rounded-lg">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">История заказов</h3>
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div key={order.id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-medium">Заказ #{order.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {order.status === 'completed' ? 'Выполнен' :
                           order.status === 'processing' ? 'В обработке' : 'Ожидает'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.date).toLocaleDateString('ru-RU')} • {order.total}₽
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">У вас пока нет заказов</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Избранные товары</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <div key={product.id} className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">{product.name}</h4>
                      <p className="text-gray-400 text-sm">{product.price}₽</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Ваш список избранного пуст</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Настройки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Уведомления</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-white text-sm">Email уведомления о заказах</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-white text-sm">Уведомления о скидках</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
