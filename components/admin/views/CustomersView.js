import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { SupabaseApiClient } from '../../../lib/apiClient';

const CustomersView = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Initialize Supabase API client
  const apiClient = new SupabaseApiClient();

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          tier: tierFilter !== 'all' ? tierFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        };
        
        const response = await apiClient.getAdminCustomers(params);
        
        if (response.success) {
          setCustomers(response.data.customers);
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [pagination.page, pagination.limit, searchTerm, tierFilter, statusFilter]);

  // Calculate analytics from real customer data
  const analytics = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, customer) => sum + (customer.analytics?.totalSpent || 0), 0),
    averageOrderValue: customers.length > 0 ? customers.reduce((sum, customer) => sum + (customer.analytics?.totalSpent || 0), 0) / customers.length : 0,
    tierDistribution: {
      bronze: customers.filter(c => c.tier === 'bronze').length,
      silver: customers.filter(c => c.tier === 'silver').length,
      gold: customers.filter(c => c.tier === 'gold').length,
      platinum: customers.filter(c => c.tier === 'platinum').length
    }
  };

  // Get tier configuration
  const getTierConfig = (tier) => {
    const configs = {
      bronze: { label: 'Бронза', color: 'bg-orange-100 text-orange-800', icon: '🥉' },
      silver: { label: 'Серебро', color: 'bg-gray-100 text-gray-800', icon: '🥈' },
      gold: { label: 'Золото', color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
      platinum: { label: 'Платина', color: 'bg-purple-100 text-purple-800', icon: '💎' }
    };
    return configs[tier] || configs.bronze;
  };

  // Handle search and filters
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleTierFilter = (tier) => {
    setTierFilter(tier);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
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
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
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
      className="space-y-6 bg-gray-900 min-h-screen p-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            👥 Управление клиентами
          </h1>
          <p className="text-gray-400">
            Просматривайте и управляйте базой клиентов
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
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-400">Всего клиентов</h3>
              <p className="text-2xl font-bold text-white">{analytics.totalCustomers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Активные</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeCustomers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Общая выручка</h3>
              <p className="text-2xl font-bold text-gray-900">₽{analytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Средний чек</h3>
              <p className="text-2xl font-bold text-gray-900">₽{Math.round(analytics.averageOrderValue).toLocaleString()}</p>
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
              placeholder="Поиск клиентов..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          
          <select
            value={tierFilter}
            onChange={(e) => handleTierFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">Все уровни</option>
            <option value="bronze">Бронза</option>
            <option value="silver">Серебро</option>
            <option value="gold">Золото</option>
            <option value="platinum">Платина</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon path="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 0A2.25 2.25 0 015.625 3.375h13.5A2.25 2.25 0 0121.375 5.625m-19.5 0v.243a2.25 2.25 0 011.915 2.207h15.17a2.25 2.25 0 011.915-2.207V5.625m-19.5 0V18.375M21.375 5.625v12.75m0 0a1.125 1.125 0 01-1.125 1.125m1.125-1.125v.243a2.25 2.25 0 01-1.915 2.207H4.915a2.25 2.25 0 01-1.915-2.207v-.243M21.375 18.375V5.625" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Customers Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customers.map((customer, index) => {
            const tierConfig = getTierConfig(customer.tier);
            return (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Уровень:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tierConfig.color}`}>
                      <span className="mr-1">{tierConfig.icon}</span>
                      {tierConfig.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Заказов:</span>
                    <span className="text-sm font-medium">{customer.analytics?.totalOrders || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Потрачено:</span>
                    <span className="text-sm font-medium">₽{(customer.analytics?.totalSpent || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Статус:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status === 'active' ? '✅ Активен' : '⏸️ Неактивен'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Уровень
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказы
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Потрачено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer, index) => {
                  const tierConfig = getTierConfig(customer.tier);
                  return (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierConfig.color}`}>
                          <span className="mr-1">{tierConfig.icon}</span>
                          {tierConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.analytics?.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₽{(customer.analytics?.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status === 'active' ? '✅ Активен' : '⏸️ Неактивен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Просмотр
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total} клиентов
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

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Клиент: {selectedCustomer.name}</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-3">Основная информация</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Телефон:</span>
                      <p className="font-medium">{selectedCustomer.phone || 'Не указан'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Дата регистрации:</span>
                      <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Уровень:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierConfig(selectedCustomer.tier).color}`}>
                        <span className="mr-1">{getTierConfig(selectedCustomer.tier).icon}</span>
                        {getTierConfig(selectedCustomer.tier).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div>
                  <h3 className="font-medium mb-3">Статистика</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedCustomer.analytics?.totalOrders || 0}</p>
                      <p className="text-sm text-gray-500">Заказов</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">₽{(selectedCustomer.analytics?.totalSpent || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Потрачено</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">₽{Math.round((selectedCustomer.analytics?.totalSpent || 0) / Math.max(selectedCustomer.analytics?.totalOrders || 1, 1)).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Средний чек</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders (if available) */}
                {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Последние заказы</h3>
                    <div className="space-y-2">
                      {selectedCustomer.recentOrders.slice(0, 5).map((order, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                          </div>
                          <p className="font-medium">₽{order.total.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomersView;