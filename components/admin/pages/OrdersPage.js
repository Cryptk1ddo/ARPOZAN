import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../../lib/adminData';const OrderCard = ({ order, onView, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Доставлен':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Отправлен':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'В ожидании':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Отменен':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Доставлен':
        return <CheckCircle className="h-4 w-4" />;
      case 'Отправлен':
        return <Truck className="h-4 w-4" />;
      case 'В ожидании':
        return <Clock className="h-4 w-4" />;
      case 'Отменен':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      className="glass-card bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.01] transition-all duration-200"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">Заказ {order.id}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{order.users?.first_name} {order.users?.last_name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(order)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Просмотр"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(order)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            title="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Сумма заказа:</span>
          <span className="text-white font-semibold">₽{order.total_amount?.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Товаров:</span>
          <span className="text-white">{order.items?.length || 0} шт.</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Статус:</span>
          <span className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-gray-400 text-xs font-medium uppercase mb-2">Товары в заказе:</p>
        <div className="space-y-1">
          {order.items?.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{item.name}</span>
              <span className="text-gray-400">{item.quantity} × ₽{item.price}</span>
            </div>
          ))}
          {order.items?.length > 2 && (
            <p className="text-gray-500 text-xs">+{order.items.length - 2} товара(ов)</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const OrderModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative glass-card bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Заказ {order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Информация о заказе</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Дата заказа:</span>
                <span className="text-white">{formatDate(order.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Сумма:</span>
                <span className="text-white font-semibold">₽{order.total?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Статус:</span>
                <span className="text-white">{order.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Данные клиента</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-white">{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-white">{order.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Товары в заказе</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <p className="text-gray-400 text-sm">Количество: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">₽{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">₽{item.price} за шт.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            Закрыть
          </button>
          <button className="flex-1 glow-button text-black font-semibold py-2 rounded-lg">
            Изменить статус
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrdersPage = ({ user, isMobile, onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load orders on mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await fetchOrders(currentPage, 10, statusFilter, searchTerm);
      setOrders(result.orders || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Error loading orders:', error);
      window.showToast?.('Ошибка загрузки заказов', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        await loadOrders(); // Reload orders
        window.showToast?.('Статус заказа обновлен', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      window.showToast?.('Ошибка обновления статуса', 'error');
    }
  };

  const filteredOrders = orders; // Already filtered by server-side search

  const statusOptions = [...new Set(orders.map(o => o.status))];

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    console.log('Edit order:', order);
    // Implement edit functionality
  };

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'В ожидании').length;
  const deliveredOrders = orders.filter(o => o.status === 'Доставлен').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Управление заказами</h1>
        <p className="text-gray-400">Всего заказов: {totalOrders}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-blue-400 text-sm font-medium mb-2">Всего заказов</h3>
          <p className="text-2xl font-bold text-white">{totalOrders}</p>
        </div>
        <div className="glass-card bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <h3 className="text-orange-400 text-sm font-medium mb-2">В ожидании</h3>
          <p className="text-2xl font-bold text-white">{pendingOrders}</p>
        </div>
        <div className="glass-card bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <h3 className="text-green-400 text-sm font-medium mb-2">Доставлено</h3>
          <p className="text-2xl font-bold text-white">{deliveredOrders}</p>
        </div>
        <div className="glass-card bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <h3 className="text-purple-400 text-sm font-medium mb-2">Выручка</h3>
          <p className="text-2xl font-bold text-white">₽{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру заказа, клиенту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
          >
            <option value="">Все статусы</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <Package className="h-4 w-4" />
          <span className="text-sm">Найдено: {filteredOrders.length} заказов</span>
        </div>
      </div>

      {/* Orders Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Заказы не найдены</h3>
          <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <OrderModal
            order={selectedOrder}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;