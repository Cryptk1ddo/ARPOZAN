import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { SupabaseApiClient } from '../../../lib/apiClient';

// Products View
const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Initialize Supabase API client
  const apiClient = new SupabaseApiClient();
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sortBy,
          sortOrder
        };
        
        const response = await apiClient.getAdminProducts(params);
        
        if (response.success) {
          setProducts(response.data.products);
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          });
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, pagination.limit, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Handle product creation
  const handleCreateProduct = async (productData) => {
    try {
      setError(null);
      const response = await apiClient.createProduct(productData);
      
      if (response.success) {
        // Refresh products list
        const refreshResponse = await apiClient.getAdminProducts({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sortBy,
          sortOrder
        });
        
        if (refreshResponse.success) {
          setProducts(refreshResponse.data.products);
          setPagination(prev => ({
            ...prev,
            total: refreshResponse.data.pagination.total,
            totalPages: refreshResponse.data.pagination.totalPages
          }));
        }
        
        setShowAddModal(false);
        return response;
      }
    } catch (err) {
      setError(err.message || 'Failed to create product');
      throw err;
    }
  };

  // Handle product update
  const handleUpdateProduct = async (productId, productData) => {
    try {
      setError(null);
      const response = await apiClient.updateProduct(productId, productData);
      
      if (response.success) {
        // Update local state
        setProducts(prev => prev.map(product => 
          product._id === productId ? { ...product, ...productData } : product
        ));
        return response;
      }
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      setError(null);
      const response = await apiClient.deleteProduct(productId);
      
      if (response.success) {
        // Remove from local state
        setProducts(prev => prev.filter(product => product._id !== productId));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
        return response;
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    }
  };

  // Handle search and filters (data already filtered on server side)
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'supplements', label: 'Добавки' },
    { value: 'minerals', label: 'Минералы' },
    { value: 'bundles', label: 'Наборы' }
  ];

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { label: 'Нет в наличии', color: 'text-red-600 bg-red-100' };
    if (stock <= threshold) return { label: 'Мало', color: 'text-orange-600 bg-orange-100' };
    return { label: 'В наличии', color: 'text-green-600 bg-green-100' };
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length 
        ? [] 
        : products.map(p => p._id)
    );
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl animate-pulse">
              <div className="h-40 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-6 bg-white dark:bg-gray-900 min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Управление продуктами
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} товаров • {selectedProducts.length} выбрано
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по названию или SKU..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              handleSortChange(field, order);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="name-asc">Название ↑</option>
            <option value="name-desc">Название ↓</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
            <option value="stock-asc">Остаток ↑</option>
            <option value="stock-desc">Остаток ↓</option>
            <option value="createdAt-desc">Новые</option>
            <option value="createdAt-asc">Старые</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Icon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Icon path="M4 6h16M4 10h16M4 14h16M4 18h16" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">
                {selectedProducts.length} товар(ов) выбрано
              </span>
              <button className="px-3 py-1 text-sm bg-green-900/30 text-green-400 rounded">
                Активировать
              </button>
              <button className="px-3 py-1 text-sm bg-gray-800 text-gray-400 rounded">
                Деактивировать
              </button>
              <button className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                Удалить
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Products Grid/Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-700 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  
                  {/* Selection checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {product.tags.includes('bestseller') && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        ⭐ Хит
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {product.status === 'active' ? 'Активен' : 'Черновик'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3">
                    SKU: {product.sku}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">
                        ₽{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Остаток: {product.stock}
                      </span>
                      <span className="text-gray-400">
                        Продано: {product.analytics?.sales || 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 text-xs bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50 transition-colors">
                      Редактировать
                    </button>
                    <button className="px-3 py-2 text-xs bg-gray-800 text-gray-400 rounded hover:bg-gray-700 transition-colors">
                      <Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // Table View
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="w-8 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Товар
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Остаток
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Продажи
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-800"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">📦</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {product.sku}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        ₽{product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-white">
                            {product.stock}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {product.analytics?.sales || 0}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {product.status === 'active' ? 'Активен' : 'Черновик'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Icon path="M19 7l-.867.5A7 7 0 111.286 7.5L1 7m0 0v3m0-3h3" className="w-4 h-4" />
                          </button>
                        </div>
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
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-500">
            Показано {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total} товаров
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
    </motion.div>
  );
};

export default ProductsView;