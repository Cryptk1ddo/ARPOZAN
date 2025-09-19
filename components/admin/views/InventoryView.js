import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Icon component for SVG paths
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const InventoryView = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for inventory
  const mockProducts = [
    {
      id: 1,
      sku: 'LJ-001',
      name: 'Long Jack Extract',
      category: 'Добавки',
      currentStock: 45,
      minStock: 20,
      unitCost: 25.99,
      supplier: 'NutriPharma',
      status: 'in_stock',
      lastRestocked: new Date('2024-01-15'),
      expiryDate: new Date('2025-01-15'),
      salesVelocity: 3.2,
      turnoverRate: 4.5,
      description: 'Премиальный экстракт Тонгкат Али'
    },
    {
      id: 2,
      sku: 'MACA-002',
      name: 'Maca Root Powder',
      category: 'Добавки',
      currentStock: 12,
      minStock: 15,
      unitCost: 18.50,
      supplier: 'Herbal Solutions',
      status: 'low_stock',
      lastRestocked: new Date('2024-01-10'),
      expiryDate: new Date('2025-01-10'),
      salesVelocity: 2.8,
      turnoverRate: 3.2,
      description: 'Органический порошок корня маки'
    },
    {
      id: 3,
      sku: 'YOH-003',
      name: 'Yohimbine HCl',
      category: 'Добавки',
      currentStock: 8,
      minStock: 25,
      unitCost: 32.00,
      supplier: 'PharmaGrade',
      status: 'critical',
      lastRestocked: new Date('2024-01-08'),
      expiryDate: new Date('2025-01-08'),
      salesVelocity: 4.1,
      turnoverRate: 5.8,
      description: 'Йохимбин гидрохлорид фармацевтического качества'
    },
    {
      id: 4,
      sku: 'ZINC-004',
      name: 'Zinc Bisglycinate',
      category: 'Минералы',
      currentStock: 67,
      minStock: 30,
      unitCost: 12.75,
      supplier: 'MineralMax',
      status: 'in_stock',
      lastRestocked: new Date('2024-01-20'),
      expiryDate: new Date('2025-01-20'),
      salesVelocity: 2.5,
      turnoverRate: 3.8,
      description: 'Хелатированный цинк высокой биодоступности'
    },
    {
      id: 5,
      sku: 'VIT-005',
      name: 'Vitamin D3',
      category: 'Витамины',
      currentStock: 23,
      minStock: 40,
      unitCost: 15.99,
      supplier: 'VitaHealth',
      status: 'low_stock',
      lastRestocked: new Date('2024-01-12'),
      expiryDate: new Date('2025-01-12'),
      salesVelocity: 3.7,
      turnoverRate: 4.2,
      description: 'Витамин D3 холекальциферол'
    },
    {
      id: 6,
      sku: 'OMEGA-006',
      name: 'Omega-3 Fish Oil',
      category: 'Жирные кислоты',
      currentStock: 34,
      minStock: 25,
      unitCost: 28.50,
      supplier: 'Ocean Pure',
      status: 'in_stock',
      lastRestocked: new Date('2024-01-18'),
      expiryDate: new Date('2025-01-18'),
      salesVelocity: 2.9,
      turnoverRate: 3.5,
      description: 'Очищенный рыбий жир с высоким содержанием EPA/DHA'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      
      // Set alerts for low stock items
      setLowStockAlerts(mockProducts.filter(p => p.currentStock <= p.minStock));
      
      setLoading(false);
    }, 500);
  }, []);

  // SearchFilterSystem configuration
  const searchConfig = {
    data: products,
    searchFields: ['name', 'sku', 'category', 'supplier', 'description'],
    filters: [
      {
        id: 'status',
        label: 'Статус запасов',
        type: 'select',
        options: [
          { value: 'all', label: 'Все статусы' },
          { value: 'in_stock', label: 'В наличии' },
          { value: 'low_stock', label: 'Мало' },
          { value: 'critical', label: 'Критично' }
        ],
        filterFn: (item, value) => {
          if (value === 'all') return true;
          if (value === 'low_stock') return item.currentStock <= item.minStock;
          if (value === 'critical') return item.status === 'critical';
          return item.status === value;
        }
      },
      {
        id: 'category',
        label: 'Категория',
        type: 'select',
        options: [
          { value: 'all', label: 'Все категории' },
          ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
            value: cat,
            label: cat
          }))
        ],
        filterFn: (item, value) => value === 'all' || item.category === value
      },
      {
        id: 'supplier',
        label: 'Поставщик',
        type: 'select',
        options: [
          { value: 'all', label: 'Все поставщики' },
          ...Array.from(new Set(products.map(p => p.supplier))).map(supplier => ({
            value: supplier,
            label: supplier
          }))
        ],
        filterFn: (item, value) => value === 'all' || item.supplier === value
      },
      {
        id: 'stockRange',
        label: 'Уровень запасов',
        type: 'range',
        min: 0,
        max: Math.max(...products.map(p => p.currentStock), 100),
        filterFn: (item, value) => {
          const [min, max] = value;
          return item.currentStock >= min && item.currentStock <= max;
        }
      },
      {
        id: 'priceRange',
        label: 'Диапазон цен',
        type: 'range',
        min: 0,
        max: Math.max(...products.map(p => p.unitCost), 50),
        filterFn: (item, value) => {
          const [min, max] = value;
          return item.unitCost >= min && item.unitCost <= max;
        }
      }
    ],
    sortOptions: [
      { value: 'name', label: 'По названию' },
      { value: 'currentStock', label: 'По количеству' },
      { value: 'unitCost', label: 'По цене' },
      { value: 'totalValue', label: 'По общей стоимости' },
      { value: 'category', label: 'По категории' }
    ],
    defaultSort: 'name',
    exportConfig: {
      filename: 'inventory-data',
      columns: [
        { key: 'sku', label: 'SKU' },
        { key: 'name', label: 'Название' },
        { key: 'category', label: 'Категория' },
        { key: 'currentStock', label: 'В наличии' },
        { key: 'minStock', label: 'Мин. запас' },
        { key: 'unitCost', label: 'Цена за единицу' },
        { key: 'supplier', label: 'Поставщик' },
        { key: 'status', label: 'Статус' }
      ]
    }
  };

  const handleSearchResults = (results) => {
    setFilteredProducts(results);
  };

  // Analytics calculations
  const analytics = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.unitCost), 0),
    lowStockItems: products.filter(p => p.currentStock <= p.minStock).length,
    criticalItems: products.filter(p => p.status === 'critical').length,
    topCategories: products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {}),
    supplierCount: new Set(products.map(p => p.supplier)).size,
    averageStock: products.reduce((sum, p) => sum + p.currentStock, 0) / products.length || 0,
    turnoverRate: 85.2 // Mock data
  };

  // Tab handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Analytics data for charts
  const categoryChartData = Object.entries(analytics.topCategories).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / products.length) * 100).toFixed(1)
  }));

  const stockLevelData = [
    { name: 'Критично', value: analytics.criticalItems, color: '#ef4444' },
    { name: 'Мало', value: analytics.lowStockItems - analytics.criticalItems, color: '#f59e0b' },
    { name: 'В наличии', value: products.length - analytics.lowStockItems, color: '#10b981' }
  ];

  const monthlyData = [
    { month: 'Янв', orders: 145, revenue: 12400, stock: 890 },
    { month: 'Фев', orders: 167, revenue: 15200, stock: 920 },
    { month: 'Мар', orders: 198, revenue: 18900, stock: 856 },
    { month: 'Апр', orders: 223, revenue: 21300, stock: 923 },
    { month: 'Май', orders: 189, revenue: 17800, stock: 945 },
    { month: 'Июн', orders: 234, revenue: 23400, stock: 978 }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_stock': return 'В наличии';
      case 'low_stock': return 'Мало';
      case 'critical': return 'Критично';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            📦 Управление складом
          </h1>
          <p className="text-gray-600 mt-1">
            Контроль запасов, поставщики и аналитика склада
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4 mr-2" />
            Поставщики
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4 mr-2" />
            Добавить товар
          </button>
        </div>
      </div>

      {/* Alerts */}
      {lowStockAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <Icon 
              path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
            />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Внимание! Низкий уровень запасов
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>У следующих товаров критически низкий уровень запасов:</p>
                <ul className="mt-1 list-disc list-inside">
                  {lowStockAlerts.slice(0, 3).map(product => (
                    <li key={product.id}>
                      {product.name} - осталось {product.currentStock} шт.
                    </li>
                  ))}
                </ul>
                {lowStockAlerts.length > 3 && (
                  <p className="mt-1">И еще {lowStockAlerts.length - 3} товаров...</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Обзор', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'inventory', label: 'Склад', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { id: 'analytics', label: 'Аналитика', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <Icon path={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Всего товаров</p>
                    <p className="text-3xl font-bold text-blue-900">{analytics.totalProducts}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {analytics.supplierCount} поставщиков
                    </p>
                  </div>
                  <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Общая стоимость</p>
                    <p className="text-3xl font-bold text-green-900">
                      ${analytics.totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Средний запас: {Math.round(analytics.averageStock)} шт
                    </p>
                  </div>
                  <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Мало запасов</p>
                    <p className="text-3xl font-bold text-yellow-900">{analytics.lowStockItems}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {((analytics.lowStockItems / analytics.totalProducts) * 100).toFixed(1)}% от общего
                    </p>
                  </div>
                  <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-8 h-8 text-yellow-500" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Критично</p>
                    <p className="text-3xl font-bold text-red-900">{analytics.criticalItems}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Оборачиваемость: {analytics.turnoverRate}%
                    </p>
                  </div>
                  <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 mr-2" />
                  Распределение по категориям
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" className="w-5 h-5 mr-2" />
                  Статус запасов
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={(entry) => entry.color} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Simple Search */}
            <div className="bg-white p-4 rounded-lg shadow">
              <input
                type="text"
                placeholder="Поиск товаров по названию, SKU, категории..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.sku.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                  );
                  setFilteredProducts(filtered);
                }}
              />
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">В наличии:</span>
                      <span className="font-semibold">{product.currentStock} шт</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Мин. запас:</span>
                      <span className="font-semibold">{product.minStock} шт</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Цена:</span>
                      <span className="font-semibold">${product.unitCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Стоимость:</span>
                      <span className="font-semibold">${(product.currentStock * product.unitCost).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Поставщик:</span>
                      <span className="font-medium">{product.supplier}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-gray-900 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      Подробнее
                    </button>
                    <button className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Обновить
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика запасов</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="stock" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика продаж и выручки</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="orders" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Аналитика эффективности</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analytics.turnoverRate}%</div>
                  <div className="text-sm text-gray-600 mt-1">Оборачиваемость</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${Math.round(analytics.totalValue / analytics.totalProducts).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">Средняя стоимость товара</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{Math.round(analytics.averageStock)}</div>
                  <div className="text-sm text-gray-600 mt-1">Средний запас</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">SKU</label>
                    <div className="text-gray-900">{selectedProduct.sku}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Категория</label>
                    <div className="text-gray-900">{selectedProduct.category}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Текущий запас</label>
                    <div className="text-gray-900">{selectedProduct.currentStock} шт</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Минимальный запас</label>
                    <div className="text-gray-900">{selectedProduct.minStock} шт</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Цена за единицу</label>
                    <div className="text-gray-900">${selectedProduct.unitCost}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Общая стоимость</label>
                    <div className="text-gray-900">${(selectedProduct.currentStock * selectedProduct.unitCost).toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Поставщик</label>
                    <div className="text-gray-900">{selectedProduct.supplier}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Последнее пополнение</label>
                    <div className="text-gray-900">
                      {selectedProduct.lastRestocked.toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Срок годности</label>
                    <div className="text-gray-900">
                      {selectedProduct.expiryDate.toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InventoryView;