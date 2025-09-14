import { useState, useEffect } from 'react'
import { X, Check, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const productsData = {
  maca: {
    id: 'maca',
    name: 'Мака перуанская',
    price: { oneTime: 1990, subscription: 2691 },
    benefits: [
      'Повышает либидо',
      'Увеличивает энергию',
      'Улучшает выносливость',
      'Поддерживает гормональный баланс',
    ],
    ingredients: ['Мака перуанская', 'Витамины группы B', 'Аминокислоты'],
    rating: 4.8,
    reviews: 1247,
  },
  yohimbin: {
    id: 'yohimbin',
    name: 'Йохимбин Premium',
    price: { oneTime: 1990, subscription: 2691 },
    benefits: [
      'Сжигает жир',
      'Повышает энергию',
      'Улучшает концентрацию',
      'Стимулирует метаболизм',
    ],
    ingredients: ['Йохимбин', 'Кофеин', 'Зеленый чай'],
    rating: 4.7,
    reviews: 892,
  },
  zinc: {
    id: 'zinc',
    name: 'Цинк пиколинат',
    price: { oneTime: 1990, subscription: 2691 },
    benefits: [
      'Поддерживает тестостерон',
      'Укрепляет иммунитет',
      'Улучшает кожу',
      'Повышает фертильность',
    ],
    ingredients: ['Цинк пиколинат', 'Витамин C', 'Медь'],
    rating: 4.6,
    reviews: 654,
  },
  'long-jack': {
    id: 'long-jack',
    name: 'Тонгкат Али',
    price: { oneTime: 1990, subscription: 2691 },
    benefits: [
      'Повышает тестостерон',
      'Увеличивает силу',
      'Улучшает восстановление',
      'Повышает либидо',
    ],
    ingredients: ['Тонгкат Али', 'Эурипептиды', 'Гликосапонины'],
    rating: 4.9,
    reviews: 1103,
  },
}

export default function ProductComparison({
  isOpen,
  onClose,
  initialProducts = [],
}) {
  const [selectedProducts, setSelectedProducts] = useState(initialProducts)

  useEffect(() => {
    setSelectedProducts(initialProducts)
  }, [initialProducts])

  const addProduct = (productId) => {
    if (selectedProducts.length < 3 && !selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((id) => id !== productId))
  }

  const getProductData = (id) => productsData[id]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900/95 backdrop-blur-md rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Сравнение продуктов
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          <div className="overflow-auto max-h-[calc(90vh-80px)]">
            {selectedProducts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 mb-6">
                  Выберите продукты для сравнения
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(productsData).map(([id, product]) => (
                    <button
                      key={id}
                      onClick={() => addProduct(id)}
                      className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                      <h3 className="text-white font-medium mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        От {product.price.oneTime}₽
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-2 text-gray-400 font-medium">
                          Характеристики
                        </th>
                        {selectedProducts.map((productId) => {
                          const product = getProductData(productId)
                          return (
                            <th
                              key={productId}
                              className="text-center py-4 px-2 min-w-[200px]"
                            >
                              <div className="relative">
                                <button
                                  onClick={() => removeProduct(productId)}
                                  className="absolute -top-2 -right-2 p-1 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                                >
                                  <X size={14} className="text-red-400" />
                                </button>
                                <h3 className="text-white font-medium mb-2">
                                  {product.name}
                                </h3>
                                <div className="flex items-center justify-center space-x-1 mb-2">
                                  <Star
                                    size={14}
                                    className="text-yellow-500 fill-current"
                                  />
                                  <span className="text-sm text-gray-300">
                                    {product.rating}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({product.reviews})
                                  </span>
                                </div>
                                <p className="text-yellow-500 font-bold">
                                  {product.price.oneTime}₽
                                </p>
                              </div>
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 px-2 text-gray-300 font-medium">
                          Преимущества
                        </td>
                        {selectedProducts.map((productId) => {
                          const product = getProductData(productId)
                          return (
                            <td key={productId} className="py-4 px-2">
                              <ul className="space-y-1">
                                {product.benefits.map((benefit, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-2 text-sm text-gray-300"
                                  >
                                    <Check
                                      size={14}
                                      className="text-green-500 flex-shrink-0"
                                    />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          )
                        })}
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 px-2 text-gray-300 font-medium">
                          Ингредиенты
                        </td>
                        {selectedProducts.map((productId) => {
                          const product = getProductData(productId)
                          return (
                            <td key={productId} className="py-4 px-2">
                              <ul className="space-y-1">
                                {product.ingredients.map(
                                  (ingredient, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-300"
                                    >
                                      • {ingredient}
                                    </li>
                                  )
                                )}
                              </ul>
                            </td>
                          )
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Add More Products */}
                {selectedProducts.length < 3 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-4">
                      Добавить к сравнению:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(productsData)
                        .filter(([id]) => !selectedProducts.includes(id))
                        .map(([id, product]) => (
                          <button
                            key={id}
                            onClick={() => addProduct(id)}
                            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
                          >
                            + {product.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
