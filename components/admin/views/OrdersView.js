import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

// Orders View - Complete order management
const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'Алексей Иванов',
        customerEmail: 'alex@example.com',
        customerPhone: '+7 (999) 123-45-67',
        status: 'delivered',
        paymentStatus: 'paid',
        total: 5980,
        items: [
          { id: 1, name: 'ULTIMATE PACK', quantity: 1, price: 5980 }
        ],
        shippingAddress: 'Москва, ул. Ленина, д. 123, кв. 45',
        trackingNumber: 'TRK123456789',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-18T14:20:00'),
        deliveredAt: new Date('2024-01-18T14:20:00'),
        notes: 'Быстрая доставка'
      },
      {
        id: 'ORD-002',
        customerName: 'Михаил Петров',
        customerEmail: 'mike@example.com',
        customerPhone: '+7 (999) 234-56-78',
        status: 'shipping',
        paymentStatus: 'paid',
        total: 4560,
        items: [
          { id: 1, name: 'TONGKAT ALI Premium', quantity: 1, price: 2980 },
          { id: 2, name: 'MACA ROOT Organic', quantity: 1, price: 1580 }
        ],
        shippingAddress: 'СПб, Невский пр., д. 45, оф. 12',
        trackingNumber: 'TRK987654321',
        createdAt: new Date('2024-01-14T16:45:00'),
        updatedAt: new Date('2024-01-16T09:15:00'),
        estimatedDelivery: new Date('2024-01-19T12:00:00'),
        notes: 'Срочная доставка'
      }
    ];
    
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="p-4 md:p-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Управление заказами
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {orders.length} заказов • {selectedOrders.length} выбрано
        </p>
      </div>

      {/* Orders content would go here - simplified for modularization */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          Заказы загружены. Полная функциональность будет добавлена после рефакторинга.
        </p>
        <div className="mt-4 space-y-2">
          {orders.map(order => (
            <div key={order.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium">{order.id} - {order.customerName}</span>
                <span className="text-sm text-gray-500">₽{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersView;