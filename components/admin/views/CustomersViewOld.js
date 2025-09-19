import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import SearchFilterSystem from '../shared/SearchFilterSystem';
import { apiClient, handleApiError } from '../../../lib/apiClient';

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
        setError(handleApiError(err));
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
      {
        id: 1,
        name: 'Алексей Петров',
        email: 'alexey@email.com',
        phone: '+7 (999) 123-45-67',
        avatar: '/api/placeholder/64/64',
        status: 'active',
        tier: 'premium',
        totalOrders: 15,
        totalSpent: 45600,
        lastOrder: new Date('2024-09-15'),
        joinDate: new Date('2024-03-15'),
        birthDate: new Date('1988-05-20'),
        location: 'Москва, Россия',
        preferences: ['TONGKAT ALI', 'MACA'],
        notes: 'VIP клиент, предпочитает экспресс доставку',
        tags: ['vip', 'frequent-buyer'],
        loyaltyPoints: 1250,
        orders: [
          { id: 101, date: '2024-09-15', total: 2580, status: 'delivered' },
          { id: 98, date: '2024-09-01', total: 3200, status: 'delivered' },
          { id: 89, date: '2024-08-15', total: 1900, status: 'delivered' }
        ]
      },
      {
        id: 2,
        name: 'Мария Сидорова',
        email: 'maria@email.com',
        phone: '+7 (999) 987-65-43',
        avatar: '/api/placeholder/64/64',
        status: 'active',
        tier: 'gold',
        totalOrders: 8,
        totalSpent: 19400,
        lastOrder: new Date('2024-09-14'),
        joinDate: new Date('2024-07-10'),
        birthDate: new Date('1992-11-08'),
        location: 'Санкт-Петербург, Россия',
        preferences: ['YOHIMBINE', 'ZINC'],
        notes: 'Интересуется новинками',
        tags: ['health-focused'],
        loyaltyPoints: 680,
        orders: [
          { id: 99, date: '2024-09-14', total: 1800, status: 'delivered' },
          { id: 92, date: '2024-08-28', total: 2100, status: 'delivered' }
        ]
      },
      {
        id: 3,
        name: 'Дмитрий Козлов',
        email: 'dmitry@email.com',
        phone: '+7 (999) 456-78-90',
        avatar: '/api/placeholder/64/64',
        status: 'inactive',
        tier: 'silver',
        totalOrders: 3,
        totalSpent: 7800,
        lastOrder: new Date('2024-07-20'),
        joinDate: new Date('2024-11-20'),
        birthDate: new Date('1985-03-12'),
        location: 'Екатеринбург, Россия',
        preferences: ['MACA'],
        notes: 'Не заказывал более 2 месяцев',
        tags: ['at-risk'],
        loyaltyPoints: 150,
        orders: [
          { id: 67, date: '2024-07-20', total: 2600, status: 'delivered' },
          { id: 45, date: '2024-05-15', total: 3200, status: 'delivered' }
        ]
      },
      {
        id: 4,
        name: 'Елена Васильева',
        email: 'elena@email.com',
        phone: '+7 (999) 111-22-33',
        avatar: '/api/placeholder/64/64',
        status: 'active',
        tier: 'premium',
        totalOrders: 22,
        totalSpent: 67800,
        lastOrder: new Date('2024-12-10'),
        joinDate: new Date('2024-01-20'),
        birthDate: new Date('1990-08-14'),
        location: 'Новосибирск, Россия',
        preferences: ['YOHIMBINE', 'TONGKAT ALI', 'ZINC'],
        notes: 'Постоянный клиент, покупает для семьи',
        tags: ['vip', 'family-buyer'],
        loyaltyPoints: 2100,
        orders: [
          { id: 105, date: '2024-12-10', total: 4200, status: 'delivered' },
          { id: 102, date: '2024-11-25', total: 3800, status: 'delivered' }
        ]
      },
      {
        id: 5,
        name: 'Игорь Смирнов',
        email: 'igor@email.com',
        phone: '+7 (999) 555-66-77',
        avatar: '/api/placeholder/64/64',
        status: 'active',
        tier: 'gold',
        totalOrders: 12,
        totalSpent: 28900,
        lastOrder: new Date('2024-12-05'),
        joinDate: new Date('2024-05-08'),
        birthDate: new Date('1987-12-03'),
        location: 'Казань, Россия',
        preferences: ['MACA', 'ZINC'],
        notes: 'Спортсмен, интересуется добавками для тренировок',
        tags: ['athlete', 'regular'],
        loyaltyPoints: 890,
        orders: [
          { id: 104, date: '2024-12-05', total: 2700, status: 'processing' },
          { id: 96, date: '2024-11-20', total: 3100, status: 'delivered' }
        ]
      }
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  // Enhanced search and filter configuration
  const searchConfig = {
    searchableFields: ['name', 'email', 'phone', 'location', 'notes'],
    filters: [
      {
        key: 'status',
        label: 'Статус',
        type: 'select',
        options: [
          { value: 'all', label: 'Все статусы' },
          { value: 'active', label: 'Активные' },
          { value: 'inactive', label: 'Неактивные' }
        ]
      },
      {
        key: 'tier',
        label: 'Уровень',
        type: 'multiselect',
        options: [
          { value: 'premium', label: 'Premium' },
          { value: 'gold', label: 'Gold' },
          { value: 'silver', label: 'Silver' }
        ]
      },
      {
        key: 'totalSpent',
        label: 'Сумма покупок',
        type: 'range',
        min: 0,
        max: 100000,
        step: 1000
      },
      {
        key: 'totalOrders',
        label: 'Количество заказов',
        type: 'range',
        min: 0,
        max: 50,
        step: 1
      },
      {
        key: 'joinDate',
        label: 'Дата регистрации',
        type: 'daterange'
      },
      {
        key: 'tags',
        label: 'Теги',
        type: 'multiselect',
        options: [
          { value: 'vip', label: 'VIP' },
          { value: 'frequent-buyer', label: 'Частый покупатель' },
          { value: 'health-focused', label: 'Здоровье' },
          { value: 'at-risk', label: 'Группа риска' },
          { value: 'athlete', label: 'Спортсмен' },
          { value: 'family-buyer', label: 'Семейные покупки' },
          { value: 'regular', label: 'Постоянный' }
        ]
      },
      {
        key: 'preferences',
        label: 'Предпочтения',
        type: 'multiselect',
        options: [
          { value: 'TONGKAT ALI', label: 'Tongkat Ali' },
          { value: 'MACA', label: 'Maca' },
          { value: 'YOHIMBINE', label: 'Yohimbine' },
          { value: 'ZINC', label: 'Zinc' }
        ]
      }
    ],
    sortOptions: [
      { value: 'name', label: 'По имени' },
      { value: 'totalSpent', label: 'По сумме покупок' },
      { value: 'totalOrders', label: 'По количеству заказов' },
      { value: 'lastOrder', label: 'По последнему заказу' },
      { value: 'joinDate', label: 'По дате регистрации' },
      { value: 'loyaltyPoints', label: 'По бонусным баллам' }
    ]
  };

  // Handle search and filter results
  const handleSearchResults = (results, isActive) => {
    setFilteredCustomers(results);
    setSearchFiltersActive(isActive);
  };

  // Export customers data
  const handleExportCustomers = (format, filteredData) => {
    const dataToExport = filteredData.map(customer => ({
      'ID': customer.id,
      'Имя': customer.name,
      'Email': customer.email,
      'Телефон': customer.phone,
      'Статус': customer.status === 'active' ? 'Активный' : 'Неактивный',
      'Уровень': customer.tier,
      'Заказов': customer.totalOrders,
      'Потрачено': customer.totalSpent,
      'Последний заказ': customer.lastOrder.toLocaleDateString('ru-RU'),
      'Дата регистрации': customer.joinDate.toLocaleDateString('ru-RU'),
      'Местоположение': customer.location,
      'Бонусные баллы': customer.loyaltyPoints,
      'Теги': customer.tags.join(', '),
      'Предпочтения': customer.preferences.join(', '),
      'Заметки': customer.notes
    }));

    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `customers_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Управление клиентами
          </h1>
          <p className="text-gray-600 mt-1">
            CRM система для работы с клиентской базой
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
            Добавить клиента
          </button>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <SearchFilterSystem
        data={customers}
        config={searchConfig}
        onResults={handleSearchResults}
        onExport={handleExportCustomers}
        placeholder="Поиск клиентов по имени, email, телефону..."
        className="mb-6"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {searchFiltersActive ? 'Найдено клиентов' : 'Всего клиентов'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchFiltersActive ? filteredCustomers.length : customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Активных</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(searchFiltersActive ? filteredCustomers : customers).filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon path="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP клиентов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(searchFiltersActive ? filteredCustomers : customers).filter(c => c.tags.includes('vip')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₽{Math.round((searchFiltersActive ? filteredCustomers : customers).reduce((sum, c) => sum + c.totalSpent, 0) / (searchFiltersActive ? filteredCustomers : customers).length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {searchFiltersActive && filteredCustomers.length !== customers.length && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                Применены фильтры: {filteredCustomers.length} из {customers.length}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid' 
                ? 'bg-black text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Сетка"
          >
            <Icon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 transition-colors ${
              viewMode === 'table' 
                ? 'bg-black text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Таблица"
          >
            <Icon path="M4 6h16M4 10h16M4 14h16M4 18h16" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchFiltersActive ? 'Клиенты не найдены' : 'Нет клиентов'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchFiltersActive 
                  ? 'Попробуйте изменить критерии поиска или фильтры'
                  : 'Добавьте первого клиента для начала работы'
                }
              </p>
              {!searchFiltersActive && (
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                >
                  <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
                  Добавить клиента
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {customer.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{customer.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                    {customer.tags.includes('vip') && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                        VIP
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-4 h-4 mr-1" />
                        Заказов:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{customer.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 mr-1" />
                        Потрачено:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">₽{customer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 mr-1" />
                        Последний:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white text-xs">
                        {customer.lastOrder.toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Icon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" className="w-4 h-4 mr-1" />
                        Баллы:
                      </span>
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">{customer.loyaltyPoints}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {customer.location}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Просмотр"
                      >
                        <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit customer functionality
                        }}
                        className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        title="Редактировать"
                      >
                        <Icon path="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Заказов
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Потрачено
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Последний заказ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr 
                      key={customer.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {customer.status === 'active' && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.email}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customer.tier)}`}>
                            {customer.tier}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status === 'active' ? 'Активен' : 'Неактивен'}
                          </span>
                          {customer.tags.includes('vip') && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                              VIP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {customer.totalOrders}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          заказов
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₽{customer.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          средний: ₽{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {customer.lastOrder.toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {customer.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Просмотр"
                          >
                            <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Edit customer functionality
                            }}
                            className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Icon path="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Customer Detail Modal Component
const CustomerDetailModal = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              {customer.status === 'active' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-gray-900 rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {customer.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{customer.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(customer.tier)}`}>
                  {customer.tier}
                </span>
                {customer.tags.includes('vip') && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                    VIP
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Обзор', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'orders', label: 'Заказы', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'analytics', label: 'Аналитика', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black dark:border-white dark:text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon path={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Customer Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {customer.totalOrders}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Заказов</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₽{customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Потрачено</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Icon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {customer.loyaltyPoints}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Баллов</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₽{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Средний чек</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Icon path="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 mr-2" />
                    Личная информация
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Телефон:</span>
                        <span className="text-gray-900 dark:text-white">{customer.phone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Местоположение:</span>
                        <span className="text-gray-900 dark:text-white">{customer.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Дата рождения:</span>
                        <span className="text-gray-900 dark:text-white">
                          {customer.birthDate.toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Регистрация:</span>
                        <span className="text-gray-900 dark:text-white">
                          {customer.joinDate.toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Последний заказ:</span>
                        <span className="text-gray-900 dark:text-white">
                          {customer.lastOrder.toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Icon path="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" className="w-5 h-5 mr-2" />
                    Предпочтения и теги
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Любимые продукты:</label>
                        <div className="flex flex-wrap gap-2">
                          {customer.preferences.map((pref) => (
                            <span key={pref} className="px-3 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm rounded-full border border-gray-300 dark:border-gray-600">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Теги:</label>
                        <div className="flex flex-wrap gap-2">
                          {customer.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-sm rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-5 h-5 mr-2" />
                  Заметки
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                    {customer.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-5 h-5 mr-2" />
                  История заказов ({customer.orders.length})
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Общая сумма: ₽{customer.totalSpent.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-3">
                {customer.orders.map((order, index) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Заказ #{order.id}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
                            <span className="flex items-center">
                              <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 mr-1" />
                              {order.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ₽{order.total.toLocaleString()}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        }`}>
                          {order.status === 'delivered' ? 'Доставлен' : 
                           order.status === 'processing' ? 'В обработке' : 'В процессе'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {customer.orders.length === 0 && (
                <div className="text-center py-8">
                  <Icon path="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">У этого клиента пока нет заказов</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 mr-2" />
                Аналитика клиента
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Average Order Value */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Средний чек</h4>
                    <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ₽{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    За {customer.totalOrders} заказов
                  </div>
                </div>

                {/* Customer Lifetime Value */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Lifetime Value</h4>
                    <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ₽{customer.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    С {customer.joinDate.toLocaleDateString('ru-RU')}
                  </div>
                </div>

                {/* Order Frequency */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Частота заказов</h4>
                    <Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    ~{Math.round(customer.totalOrders / 12)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    заказов в месяц
                  </div>
                </div>

                {/* Loyalty Status */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Лояльность</h4>
                    <Icon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {customer.loyaltyPoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    бонусных баллов
                  </div>
                </div>

                {/* Customer Tier */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Уровень</h4>
                    <Icon path="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                    {customer.tier}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {customer.tags.includes('vip') ? 'VIP клиент' : 'Постоянный клиент'}
                  </div>
                </div>

                {/* Days Since Last Order */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Последняя активность</h4>
                    <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {Math.floor((new Date() - customer.lastOrder) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    дней назад
                  </div>
                </div>
              </div>

              {/* Engagement Insights */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Icon path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" className="w-5 h-5 mr-2" />
                  Анализ поведения
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Статус активности:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {customer.status === 'active' ? 'Активный' : 'Неактивный'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Средний интервал:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      ~{Math.round(365 / customer.totalOrders)} дней между заказами
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Предпочтения:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {customer.preferences.length} продуктов
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Рекомендации:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {customer.tags.includes('at-risk') ? 'Реактивация' : 
                       customer.tags.includes('vip') ? 'VIP программа' : 'Увеличение частоты'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomersView;