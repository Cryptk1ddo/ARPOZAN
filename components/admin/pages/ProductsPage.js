import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, mockProducts } from '../../../lib/adminData';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const getStatusInfo = (stockQuantity) => {
    if (stockQuantity === 0) {
      return {
        text: 'Нет в наличии',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: <XCircle className="h-4 w-4" />
      };
    } else if (stockQuantity < 10) {
      return {
        text: 'Мало на складе',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: <AlertTriangle className="h-4 w-4" />
      };
    } else {
      return {
        text: 'В наличии',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: <CheckCircle className="h-4 w-4" />
      };
    }
  };

  const statusInfo = getStatusInfo(product.stock_quantity);

  return (
    <motion.div
      className="glass-card bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition-all duration-200"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-400 text-sm">{product.category}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(product)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Просмотр"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            title="Редактировать"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Цена:</span>
          <span className="text-white font-semibold">₽{product.price?.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Остаток:</span>
          <span className="text-white font-semibold">{product.stock_quantity} шт.</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Статус:</span>
          <span className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </span>
        </div>
      </div>

      {product.stock_quantity < 10 && product.stock_quantity > 0 && (
        <motion.div
          className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Требуется пополнение</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      price: '',
      stock: '',
      category: '',
      image: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative glass-card bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-md mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <h2 className="text-xl font-bold text-white mb-6">
          {product ? 'Редактировать товар' : 'Добавить товар'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название товара
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Цена (₽)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Остаток
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            >
              <option value="">Выберите категорию</option>
              <option value="Добавки">Добавки</option>
              <option value="Комплексы">Комплексы</option>
              <option value="Витамины">Витамины</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL изображения
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 glow-button text-black font-semibold py-2 rounded-lg"
            >
              {product ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProductsPage = ({ user, isMobile, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchProducts(currentPage, 12, searchTerm, selectedCategory);
      setProducts(result.products || mockProducts);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to mock data
      setProducts(mockProducts);
      window.showToast?.('Ошибка загрузки товаров. Показаны демо-данные.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.success) {
        await loadProducts(); // Reload products
        setIsModalOpen(false);
        setEditingProduct(null);
        window.showToast?.(
          editingProduct ? 'Товар успешно обновлен' : 'Товар успешно создан', 
          'success'
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      window.showToast?.('Ошибка сохранения товара', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        await loadProducts(); // Reload products
        window.showToast?.('Товар успешно удален', 'success');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      window.showToast?.('Ошибка удаления товара', 'error');
    }
  };

  const handleRequestDelete = (productId) => {
    const product = products.find(p => p.id === productId);
    window.showConfirm?.(
      'Удалить товар',
      `Вы уверены, что хотите удалить товар "${product?.name}"? Это действие нельзя отменить.`,
      () => handleDeleteProduct(productId),
      'danger'
    );
  };

  const filteredProducts = products; // Already filtered by server-side search

  const categories = [...new Set(products.map(p => p.category))];

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Управление товарами</h1>
          <p className="text-gray-400">Всего товаров: {products.length}</p>
          {(lowStockCount > 0 || outOfStockCount > 0) && (
            <div className="flex items-center space-x-4 mt-2">
              {lowStockCount > 0 && (
                <span className="flex items-center space-x-1 text-orange-400 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{lowStockCount} товара(ов) заканчивается</span>
                </span>
              )}
              {outOfStockCount > 0 && (
                <span className="flex items-center space-x-1 text-red-400 text-sm">
                  <XCircle className="h-4 w-4" />
                  <span>{outOfStockCount} товара(ов) нет в наличии</span>
                </span>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleAdd}
          className="glow-button text-black font-semibold px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Добавить товар</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">Найдено: {filteredProducts.length} товаров</span>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleRequestDelete}
              onView={() => console.log('View product:', product)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Товары не найдены</h3>
          <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;