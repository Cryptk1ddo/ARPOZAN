import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Area,
  Bar,
  Pie,
  Cell
} from 'recharts';
import SearchFilterSystem from '../shared/SearchFilterSystem';
import { apiClient, handleApiError } from '../../../lib/apiClient';

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
  const [viewMode, setViewMode] = useState('table'); // table, cards, detailed
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1month');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

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
          status: statusFilter !== 'all' ? statusFilter : undefined,
          timeframe: timeRange
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
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page, pagination.limit, searchTerm, statusFilter, timeRange]);

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
      setError(handleApiError(err));
      throw err;
    }
  };

  // Add loading and error handling
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
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  // Computed analytics data from real orders
  const analyticsData = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totals.total, 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totals.total, 0) / orders.length : 0,
    completionRate: orders.length > 0 ? (orders.filter(order => order.status === 'delivered').length / orders.length) * 100 : 0,
    statusDistribution: [
      { name: 'Обработка', value: orders.filter(order => order.status === 'pending').length, color: '#fbbf24' },
      { name: 'Подтвержден', value: orders.filter(order => order.status === 'confirmed').length, color: '#3b82f6' },
      { name: 'В работе', value: orders.filter(order => order.status === 'processing').length, color: '#8b5cf6' },
      { name: 'Отправлен', value: orders.filter(order => order.status === 'shipped').length, color: '#10b981' },
      { name: 'Доставлен', value: orders.filter(order => order.status === 'delivered').length, color: '#059669' },
      { name: 'Отменен', value: orders.filter(order => order.status === 'cancelled').length, color: '#ef4444' }
    ]
  };
    {
      id: '2024-001',
      customerName: 'Александр Петров',
      customerEmail: 'alex@example.com',
      customerPhone: '+7 (999) 123-45-67',
      status: 'completed',
      total: 4500,
      products: ['Йохимбин HCl', 'Цинк'],
      quantity: 3,
      orderDate: '2024-01-15T10:30:00Z',
      shippingAddress: 'Москва, ул. Тверская, 12',
      paymentMethod: 'card',
      trackingNumber: 'RU123456789',
      notes: 'Доставка до подъезда'
    },
    {
      id: '2024-002',
      customerName: 'Мария Сидорова',
      customerEmail: 'maria@example.com',
      customerPhone: '+7 (999) 234-56-78',
      status: 'processing',
      total: 3200,
      products: ['Мака перуанская'],
      quantity: 2,
      orderDate: '2024-01-16T14:20:00Z',
      shippingAddress: 'СПб, Невский пр., 45',
      paymentMethod: 'transfer',
      trackingNumber: null,
      notes: ''
    },
    {
      id: '2024-003',
      customerName: 'Дмитрий Иванов',
      customerEmail: 'dmitry@example.com',
      customerPhone: '+7 (999) 345-67-89',
      status: 'shipped',
      total: 7800,
      products: ['Тонгкат Али', 'Комплект витаминов'],
      quantity: 4,
      orderDate: '2024-01-17T09:15:00Z',
      shippingAddress: 'Екатеринбург, ул. Ленина, 78',
      paymentMethod: 'card',
      trackingNumber: 'RU987654321',
      notes: 'Хрупкий товар'
    },
    {
      id: '2024-004',
      customerName: 'Анна Козлова',
      customerEmail: 'anna@example.com',
      customerPhone: '+7 (999) 456-78-90',
      status: 'pending',
      total: 2100,
      products: ['Цинк'],
      quantity: 1,
      orderDate: '2024-01-18T16:45:00Z',
      shippingAddress: 'Новосибирск, ул. Красный пр., 123',
      paymentMethod: 'cash',
      trackingNumber: null,
      notes: 'Оплата при получении'
    },
    {
      id: '2024-005',
      customerName: 'Сергей Волков',
      customerEmail: 'sergey@example.com',
      customerPhone: '+7 (999) 567-89-01',
      status: 'cancelled',
      total: 5600,
      products: ['Йохимбин HCl', 'Мака перуанская'],
      quantity: 3,
      orderDate: '2024-01-19T11:30:00Z',
      shippingAddress: 'Казань, ул. Баумана, 67',
      paymentMethod: 'card',
      trackingNumber: null,
      notes: 'Отмена по запросу клиента'
    }
  ], []);

  // Analytics data
  const analyticsData = useMemo(() => ({
    totalOrders: ordersData.length,
    totalRevenue: ordersData.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue: ordersData.reduce((sum, order) => sum + order.total, 0) / ordersData.length,
    completionRate: (ordersData.filter(order => order.status === 'completed').length / ordersData.length) * 100,
    dailyOrders: [
      { date: '2024-01-15', orders: 12, revenue: 28400 },
      { date: '2024-01-16', orders: 15, revenue: 31200 },
      { date: '2024-01-17', orders: 18, revenue: 42300 },
      { date: '2024-01-18', orders: 14, revenue: 29800 },
      { date: '2024-01-19', orders: 16, revenue: 35900 }
    ],
    statusDistribution: [
      { status: 'Выполнено', count: ordersData.filter(o => o.status === 'completed').length, color: '#10b981' },
      { status: 'В обработке', count: ordersData.filter(o => o.status === 'processing').length, color: '#3b82f6' },
      { status: 'Отправлено', count: ordersData.filter(o => o.status === 'shipped').length, color: '#8b5cf6' },
      { status: 'Ожидает', count: ordersData.filter(o => o.status === 'pending').length, color: '#f59e0b' },
      { status: 'Отменено', count: ordersData.filter(o => o.status === 'cancelled').length, color: '#ef4444' }
    ],
    paymentMethods: [
      { method: 'Карта', count: ordersData.filter(o => o.paymentMethod === 'card').length },
      { method: 'Перевод', count: ordersData.filter(o => o.paymentMethod === 'transfer').length },
      { method: 'Наличные', count: ordersData.filter(o => o.paymentMethod === 'cash').length }
    ]
  }), [ordersData]);

  // Enhanced orders SearchFilterSystem configuration
  const ordersConfig = {
    filters: [
      {
        key: 'id',
        type: 'text',
        label: 'Номер заказа',
        placeholder: 'Поиск по номеру заказа...',
        searchKeys: ['id']
      },
      {
        key: 'customerName',
        type: 'text',
        label: 'Клиент',
        placeholder: 'Поиск по имени клиента...',
        searchKeys: ['customerName', 'customerEmail', 'customerPhone']
      },
      {
        key: 'status',
        type: 'select',
        label: 'Статус заказа',
        options: [
          { value: 'all', label: 'Все статусы' },
          { value: 'pending', label: 'Ожидает обработки' },
          { value: 'processing', label: 'В обработке' },
          { value: 'shipped', label: 'Отправлен' },
          { value: 'completed', label: 'Выполнен' },
          { value: 'cancelled', label: 'Отменен' }
        ]
      },
      {
        key: 'paymentMethod',
        type: 'select',
        label: 'Способ оплаты',
        options: [
          { value: 'all', label: 'Все способы' },
          { value: 'card', label: 'Банковская карта' },
          { value: 'transfer', label: 'Банковский перевод' },
          { value: 'cash', label: 'Наличные при получении' }
        ]
      },
      {
        key: 'total',
        type: 'range',
        label: 'Сумма заказа (₽)',
        min: 0,
        max: 50000,
        step: 500
      },
      {
        key: 'orderDate',
        type: 'date',
        label: 'Дата заказа'
      }
    ],
    export: {
      filename: 'orders-export',
      columns: ['id', 'customerName', 'customerEmail', 'status', 'total', 'orderDate', 'paymentMethod']
    }
  };

  const handleOrdersResults = (results) => {
    setFilteredOrders(results);
  };

  const handleExportOrders = (data, format) => {
    console.log(`Exporting ${data.length} orders as ${format}`);
    if (window.toast) {
      window.toast.success(`Экспорт заказов в формате ${format.toUpperCase()} начат`);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
      processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' },
      shipped: { label: 'Отправлен', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m0-9.75h2.25m0 0H6.375a1.125 1.125 0 011.125-1.125V3M7.5 21V9a6 6 0 0112 0v12a1.5 1.5 0 01-1.5 1.5H9m1.5-12H6.375' },
      completed: { label: 'Выполнен', color: 'bg-green-100 text-green-800 border-green-200', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800 border-red-200', icon: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // In real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    
    if (window.toast) {
      window.toast.success(`Статус заказа ${orderId} изменен на "${getStatusInfo(newStatus).label}"`);
    }
  };

  const exportOrders = (format) => {
    // In real app, this would generate and download the file
    console.log(`Exporting ${filteredOrders.length} orders in ${format} format`);
    
    if (window.toast) {
      window.toast.success(`Экспорт заказов в формате ${format.toUpperCase()} начат`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Управление заказами
          </h1>
          <p className="text-gray-600">
            Комплексная система управления заказами и аналитика продаж
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="1week">Последняя неделя</option>
            <option value="1month">Последний месяц</option>
            <option value="3months">Последние 3 месяца</option>
            <option value="6months">Последние 6 месяцев</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { mode: 'table', icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 0A2.25 2.25 0 015.625 3.375h13.5A2.25 2.25 0 0121.375 5.625m0 0v12.75m0 0a1.125 1.125 0 01-1.125 1.125M12 7.5h6v6H12V7.5z', label: 'Таблица' },
              { mode: 'cards', icon: 'M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v7.5A2.25 2.25 0 006.75 18.75h10.5A2.25 2.25 0 0019.5 16.5V9a2.25 2.25 0 00-1.5-2.122', label: 'Карточки' }
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === mode 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={label}
              >
                <Icon path={icon} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <SearchFilterSystem
        data={ordersData}
        config={ordersConfig}
        onResults={handleOrdersResults}
        onExport={handleExportOrders}
        placeholder="Поиск заказов по номеру, клиенту, email, телефону..."
        className="mb-6"
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Обзор', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'orders', label: 'Заказы', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
            { id: 'analytics', label: 'Аналитика', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon path={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                      <p className="text-3xl font-bold text-black">{analyticsData.totalOrders}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +8.2%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Общая выручка</p>
                      <p className="text-3xl font-bold text-black">{formatCurrency(analyticsData.totalRevenue)}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +12.5%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Средний чек</p>
                      <p className="text-3xl font-bold text-black">{formatCurrency(analyticsData.averageOrderValue)}</p>
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <Icon path="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" className="w-4 h-4 mr-1" />
                        -1.8%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Уровень завершения</p>
                      <p className="text-3xl font-bold text-black">{analyticsData.completionRate.toFixed(1)}%</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 mr-1" />
                        +2.4%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Orders Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <Icon path="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" className="w-5 h-5 mr-2" />
                    Заказы по дням
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={analyticsData.dailyOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="orders" fill="#000000" name="Заказы" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#6b7280" strokeWidth={2} name="Выручка" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <Icon path="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" className="w-5 h-5 mr-2" />
                    Распределение по статусам
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        label={({status, count}) => `${status}: ${count}`}
                      >
                        {analyticsData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Показано {filteredOrders.length} из {ordersData.length} заказов
                </p>
                
                {filteredOrders.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Общая сумма: {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.total, 0))}
                  </div>
                )}
              </div>

              {/* Orders Display */}
              <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Заказ</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Клиент</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Статус</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Сумма</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Дата</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                              <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="font-medium text-black">{order.id}</div>
                                    <div className="text-sm text-gray-500">
                                      {order.products.join(', ')}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="font-medium text-black">{order.customerName}</div>
                                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                    <Icon path={statusInfo.icon} className="w-3 h-3" />
                                    <span>{statusInfo.label}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-black">
                                  {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {formatDate(order.orderDate)}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                      title="Просмотр деталей"
                                    >
                                      <Icon path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-black">{order.id}</h3>
                              <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                            </div>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              <Icon path={statusInfo.icon} className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-black">{order.customerName}</p>
                              <p className="text-sm text-gray-500">{order.customerEmail}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-1">Товары:</p>
                              <p className="text-sm text-black">{order.products.join(', ')}</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <span className="font-semibold text-black">{formatCurrency(order.total)}</span>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                Детали
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Способы оплаты</h3>
                  <div className="space-y-4">
                    {analyticsData.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-black">{method.method}</div>
                          <div className="text-sm text-gray-600">{method.count} заказов</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-black">{((method.count / analyticsData.totalOrders) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Trend */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-4">Тренд выручки</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.dailyOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        fill="#000000" 
                        fillOpacity={0.1}
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Заказ #{selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                    <Icon path={getStatusInfo(selectedOrder.status).icon} className="w-4 h-4" />
                    <span>{getStatusInfo(selectedOrder.status).label}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedOrder.orderDate)}
                  </span>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Информация о клиенте</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Имя:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-gray-500">Телефон:</span> {selectedOrder.customerPhone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Доставка и оплата</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Адрес:</span> {selectedOrder.shippingAddress}</p>
                      <p><span className="text-gray-500">Способ оплаты:</span> {
                        {
                          card: 'Банковская карта',
                          transfer: 'Банковский перевод',
                          cash: 'Наличные'
                        }[selectedOrder.paymentMethod]
                      }</p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="text-gray-500">Трек-номер:</span> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Товары</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {selectedOrder.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-900">{product}</span>
                          <span className="text-sm text-gray-500">1 шт.</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center font-medium">
                          <span>Итого:</span>
                          <span>{formatCurrency(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Примечания</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => {
                      if (window.toast) {
                        window.toast.success('Уведомление отправлено клиенту');
                      }
                    }}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Уведомить клиента
                  </button>
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
