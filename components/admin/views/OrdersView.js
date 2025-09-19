import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SupabaseApiClient } from '../../../lib/apiClient';

const Icon = ({ path, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Initialize Supabase API client
  const apiClient = new SupabaseApiClient();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined
        };
        
        const response = await apiClient.getAdminOrders(params);
        
        if (response.success) {
          setOrders(response.data.orders);
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus, trackingNumber = null) => {
    try {
      setError(null);
      const response = await apiClient.updateOrderStatus(orderId, newStatus, trackingNumber);
      
      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus, trackingNumber } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus, trackingNumber }));
        }
        
        return response;
      }
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      throw err;
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Обработка', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800', icon: '✅' },
      processing: { label: 'В работе', color: 'bg-purple-100 text-purple-800', icon: '⚙️' },
      shipped: { label: 'Отправлен', color: 'bg-green-100 text-green-800', icon: '📦' },
      delivered: { label: 'Доставлен', color: 'bg-emerald-100 text-emerald-800', icon: '🎉' },
      cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    return configs[status] || configs.pending;
  };

  // Calculate analytics
  const analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totals.total, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totals.total, 0) / orders.length : 0,
    completionRate: orders.length > 0 ? (orders.filter(order => order.status === 'delivered').length / orders.length) * 100 : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Ошибка загрузки</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-black text-white rounded-lg hover:bg-blue-700 dark:hover:bg-gray-800"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📦 Управление заказами
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Отслеживайте и управляйте всеми заказами
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-400">Всего заказов</h3>
              <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-400">Общая выручка</h3>
              <p className="text-2xl font-bold text-white">₽{analytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-400">Средний чек</h3>
              <p className="text-2xl font-bold text-white">₽{Math.round(analytics.averageOrderValue).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-emerald-900/30 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-400">Доставлено</h3>
              <p className="text-2xl font-bold text-white">{analytics.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon 
              path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Поиск заказов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Обработка</option>
            <option value="confirmed">Подтвержден</option>
            <option value="processing">В работе</option>
            <option value="shipped">Отправлен</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.items?.length || 0} товара
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.customer?.name || 'Неизвестно'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.customer?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ₽{order.totals.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Просмотр
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="ml-2 text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Обработка</option>
                          <option value="confirmed">Подтвержден</option>
                          <option value="processing">В работе</option>
                          <option value="shipped">Отправлен</option>
                          <option value="delivered">Доставлен</option>
                          <option value="cancelled">Отменен</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total} заказов
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNum = index + 1;
              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                      pagination.page === pageNum
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === pagination.page - 3 ||
                pageNum === pagination.page + 3
              ) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Заказ {selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Status */}
                <div>
                  <h3 className="font-medium mb-2">Статус заказа</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedOrder.status).color}`}>
                    <span className="mr-1">{getStatusConfig(selectedOrder.status).icon}</span>
                    {getStatusConfig(selectedOrder.status).label}
                  </span>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-2">Информация о клиенте</h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>Имя:</strong> {selectedOrder.customer?.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                    <p><strong>Телефон:</strong> {selectedOrder.customer?.phone}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium mb-2">Товары</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₽{item.itemTotal.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div>
                  <h3 className="font-medium mb-2">Итого</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Подытог:</span>
                      <span>₽{selectedOrder.totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Доставка:</span>
                      <span>₽{selectedOrder.totals.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Налог:</span>
                      <span>₽{selectedOrder.totals.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Общая сумма:</span>
                      <span>₽{selectedOrder.totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="font-medium mb-2">Адрес доставки</h3>
                  <p className="text-sm text-gray-600">
                    {[
                      selectedOrder.shippingAddress?.street,
                      selectedOrder.shippingAddress?.city,
                      selectedOrder.shippingAddress?.postalCode
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrdersView;