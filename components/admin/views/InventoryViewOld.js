import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import SearchFilterSystem from '../shared/SearchFilterSystem';
import Icon from '../shared/Icon';

const InventoryView = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [inventoryMetrics, setInventoryMetrics] = useState({});
  const [stockMovements, setStockMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  // Mock inventory data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'TONGKAT ALI',
        sku: 'TA-001',
        category: 'Энергия',
        currentStock: 145,
        minStock: 50,
        maxStock: 500,
        unitCost: 1200,
        sellingPrice: 3000,
        supplier: 'BioSupplier Ltd',
        location: 'Склад A-1',
        status: 'in_stock',
        lastRestocked: new Date('2025-09-10'),
        expiryDate: new Date('2026-09-10'),
        batchNumber: 'TA240901',
        description: 'Натуральный экстракт Тонгкат Али',
        image: '/api/placeholder/64/64',
        salesVelocity: 12, // units per day
        stockDays: 12, // days until out of stock
        turnoverRate: 24, // times per year
        profitMargin: 60 // percentage
      },
      {
        id: 2,
        name: 'MACA',
        sku: 'MC-001',
        category: 'Либидо',
        currentStock: 23,
        minStock: 40,
        maxStock: 300,
        unitCost: 800,
        sellingPrice: 2000,
        supplier: 'Natural Herbs Co',
        location: 'Склад B-2',
        status: 'low_stock',
        lastRestocked: new Date('2025-08-15'),
        expiryDate: new Date('2026-08-15'),
        batchNumber: 'MC240815',
        description: 'Органическая Мака перуанская',
        image: '/api/placeholder/64/64',
        salesVelocity: 8,
        stockDays: 3,
        turnoverRate: 18,
        profitMargin: 60
      },
      {
        id: 3,
        name: 'YOHIMBINE',
        sku: 'YH-001',
        category: 'Либидо',
        currentStock: 89,
        minStock: 30,
        maxStock: 200,
        unitCost: 1500,
        sellingPrice: 3500,
        supplier: 'Premium Extracts',
        location: 'Склад A-3',
        status: 'in_stock',
        lastRestocked: new Date('2025-09-05'),
        expiryDate: new Date('2026-09-05'),
        batchNumber: 'YH240905',
        description: 'Экстракт Йохимбе высокой концентрации',
        image: '/api/placeholder/64/64',
        salesVelocity: 6,
        stockDays: 15,
        turnoverRate: 15,
        profitMargin: 57
      },
      {
        id: 4,
        name: 'ZINC',
        sku: 'ZN-001',
        category: 'Минералы',
        currentStock: 234,
        minStock: 100,
        maxStock: 600,
        unitCost: 300,
        sellingPrice: 1500,
        supplier: 'Mineral Solutions',
        location: 'Склад C-1',
        status: 'in_stock',
        lastRestocked: new Date('2025-09-12'),
        expiryDate: new Date('2027-09-12'),
        batchNumber: 'ZN240912',
        description: 'Цинк хелат высокого качества',
        image: '/api/placeholder/64/64',
        salesVelocity: 15,
        stockDays: 16,
        turnoverRate: 20,
        profitMargin: 80
      },
      {
        id: 5,
        name: 'ULTIMATE PACK',
        sku: 'UP-001',
        category: 'Комплексы',
        currentStock: 12,
        minStock: 20,
        maxStock: 100,
        unitCost: 3500,
        sellingPrice: 8000,
        supplier: 'Multiple',
        location: 'Склад Premium',
        status: 'critical',
        lastRestocked: new Date('2025-08-20'),
        expiryDate: new Date('2026-08-20'),
        batchNumber: 'UP240820',
        description: 'Премиальный комплекс всех добавок',
        image: '/api/placeholder/64/64',
        salesVelocity: 3,
        stockDays: 4,
        turnoverRate: 12,
        profitMargin: 56
      }
    ];

    const mockSuppliers = [
      {
        id: 1,
        name: 'BioSupplier Ltd',
        contact: '+7 (495) 123-45-67',
        email: 'orders@biosupplier.com',
        address: 'Москва, ул. Поставщиков, 15',
        rating: 4.8,
        reliability: 95,
        avgDeliveryTime: 7,
        products: ['TONGKAT ALI'],
        lastOrder: new Date('2025-09-01'),
        totalOrders: 24,
        status: 'active'
      },
      {
        id: 2,
        name: 'Natural Herbs Co',
        contact: '+7 (812) 987-65-43',
        email: 'supply@naturalherbs.ru',
        address: 'СПб, пр. Натуральный, 8',
        rating: 4.6,
        reliability: 88,
        avgDeliveryTime: 10,
        products: ['MACA'],
        lastOrder: new Date('2025-08-15'),
        totalOrders: 18,
        status: 'active'
      },
      {
        id: 3,
        name: 'Premium Extracts',
        contact: '+7 (383) 456-78-90',
        email: 'orders@premiumextracts.com',
        address: 'Новосибирск, ул. Экстрактов, 42',
        rating: 4.9,
        reliability: 98,
        avgDeliveryTime: 5,
        products: ['YOHIMBINE'],
        lastOrder: new Date('2025-09-05'),
        totalOrders: 36,
        status: 'active'
      }
    ];

    const mockStockMovements = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockStockMovements.push({
        date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        incoming: Math.floor(Math.random() * 50) + 10,
        outgoing: Math.floor(Math.random() * 40) + 15,
        net: 0
      });
    }
    
    mockStockMovements.forEach(movement => {
      movement.net = movement.incoming - movement.outgoing;
    });

    setProducts(mockProducts);
    setSuppliers(mockSuppliers);
    setStockMovements(mockStockMovements);
    
    // Calculate metrics
    const totalValue = mockProducts.reduce((sum, p) => sum + (p.currentStock * p.unitCost), 0);
    const lowStockCount = mockProducts.filter(p => p.currentStock <= p.minStock).length;
    const criticalStockCount = mockProducts.filter(p => p.status === 'critical').length;
    const avgTurnover = mockProducts.reduce((sum, p) => sum + p.turnoverRate, 0) / mockProducts.length;

    setInventoryMetrics({
      totalValue,
      totalProducts: mockProducts.length,
      lowStockCount,
      criticalStockCount,
      avgTurnover: avgTurnover.toFixed(1)
    });

    // Set alerts for low stock items
    setLowStockAlerts(mockProducts.filter(p => p.currentStock <= p.minStock));

    setTimeout(() => setLoading(false), 500);
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
        max: Math.max(...products.map(p => p.currentStock)),
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
        max: Math.max(...products.map(p => p.unitCost)),
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
    averageStock: products.reduce((sum, p) => sum + p.currentStock, 0) / products.length,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-medium text-red-800 dark:text-red-300">
              Предупреждения о запасах ({lowStockAlerts.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockAlerts.map(product => (
              <span key={product.id} className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-sm rounded">
                {product.name} (осталось {product.currentStock} шт.)
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Общая стоимость</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₽{(inventoryMetrics.totalValue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon path="M7 7h10l4 12H3l4-12z" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Всего товаров</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventoryMetrics.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Мало запасов</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventoryMetrics.lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Критично</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventoryMetrics.criticalStockCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Оборачиваемость</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventoryMetrics.avgTurnover}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Movements */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            📊 Движение запасов (30 дней)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockMovements}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line type="monotone" dataKey="incoming" stroke="#10b981" strokeWidth={2} name="Поступления" />
              <Line type="monotone" dataKey="outgoing" stroke="#ef4444" strokeWidth={2} name="Расход" />
              <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Чистое изменение" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            🏷️ Распределение по категориям
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Энергия', value: 1, color: '#3b82f6' },
                  { name: 'Либидо', value: 2, color: '#8b5cf6' },
                  { name: 'Минералы', value: 1, color: '#10b981' },
                  { name: 'Комплексы', value: 1, color: '#f59e0b' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[
                  { name: 'Энергия', value: 1, color: '#3b82f6' },
                  { name: 'Либидо', value: 2, color: '#8b5cf6' },
                  { name: 'Минералы', value: 1, color: '#10b981' },
                  { name: 'Комплексы', value: 1, color: '#f59e0b' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию или артикулу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Все товары</option>
              <option value="in_stock">В наличии</option>
              <option value="low_stock">Мало запасов</option>
              <option value="critical">Критично</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">По названию</option>
              <option value="stock">По количеству</option>
              <option value="value">По стоимости</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Icon 
                path={sortOrder === 'asc' ? "M3 4l9 16 9-16H3z" : "M21 20L12 4 3 20h18z"} 
                className="w-4 h-4" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Товар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Артикул
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Запас
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Стоимость
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Поставщик
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {product.name.substring(0, 2)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.currentStock} шт.
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Мин: {product.minStock} | Макс: {product.maxStock}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                    {product.stockDays <= 7 && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                        ~{product.stockDays} дней
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ₽{(product.currentStock * product.unitCost).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ₽{product.unitCost} за шт.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      Просмотр
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3">
                      Пополнить
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');

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
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {product.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{product.sku} • {product.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Информация о товаре
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Описание</label>
                  <div className="text-gray-900 dark:text-white">{product.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Текущий запас</label>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{product.currentStock} шт.</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Местоположение</label>
                    <div className="text-gray-900 dark:text-white">{product.location}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Мин. запас</label>
                    <div className="text-gray-900 dark:text-white">{product.minStock} шт.</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Макс. запас</label>
                    <div className="text-gray-900 dark:text-white">{product.maxStock} шт.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Финансовые показатели
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Себестоимость</label>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₽{product.unitCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Цена продажи</label>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₽{product.sellingPrice.toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Маржа</label>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{product.profitMargin}%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Общая стоимость</label>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ₽{(product.currentStock * product.unitCost).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Скорость продаж</label>
                    <div className="text-gray-900 dark:text-white">{product.salesVelocity} шт/день</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Оборачиваемость</label>
                    <div className="text-gray-900 dark:text-white">{product.turnoverRate}x в год</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Поставщик</label>
                <div className="text-gray-900 dark:text-white">{product.supplier}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Последнее пополнение</label>
                <div className="text-gray-900 dark:text-white">
                  {product.lastRestocked.toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Срок годности</label>
                <div className="text-gray-900 dark:text-white">
                  {product.expiryDate.toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InventoryView;