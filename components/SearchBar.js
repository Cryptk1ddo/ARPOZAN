import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const products = [
  {
    id: 'maca',
    name: 'Мака перуанская',
    description: 'Природный бустер либидо и энергии',
    href: '/maca',
    category: 'libido',
    icon: '🌿'
  },
  {
    id: 'yohimbin',
    name: 'Йохимбин Premium',
    description: 'Сжигатель жира и стимулятор энергии',
    href: '/Yohimbin',
    category: 'energy',
    icon: '⚡'
  },
  {
    id: 'zinc',
    name: 'Цинк пиколинат',
    description: 'Поддержка тестостерона и иммунитета',
    href: '/zinc',
    category: 'testosterone',
    icon: '💪'
  },
  {
    id: 'long-jack',
    name: 'Тонгкат Али',
    description: 'Натуральный стимулятор тестостерона',
    href: '/Long-jack',
    category: 'testosterone',
    icon: '🌿'
  }
]

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const searchRef = useRef(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
  }, [query])

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance

    // Close search on left swipe
    if (isLeftSwipe) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Search Modal - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-16 md:top-20 md:left-1/2 md:transform md:-translate-x-1/2 md:w-full md:max-w-2xl md:mx-4 md:bottom-auto md:rounded-lg bg-gray-900/95 backdrop-blur-md border-t md:border border-gray-700 z-50"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 md:hidden">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Назад</span>
              </button>
              <h2 className="text-white font-semibold">Поиск</h2>
              <div className="w-12"></div> {/* Spacer for centering */}
            </div>

            <div className="p-4 md:p-6">
              {/* Search Input - Mobile Optimized */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Поиск продуктов..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-12 py-4 md:py-3 bg-gray-800/50 border border-gray-600 rounded-xl md:rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 text-base md:text-sm"
                  style={{ fontSize: '16px' }} // Prevents zoom on iOS
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Results - Mobile Optimized */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-h-[calc(100vh-200px)] md:max-h-96 overflow-y-auto"
                  >
                    <div className="space-y-3 md:space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={product.href}
                          onClick={onClose}
                          className="block p-4 md:p-3 rounded-xl md:rounded-lg hover:bg-gray-800/50 active:bg-gray-800/70 transition-all duration-200 border border-transparent hover:border-gray-600"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 md:w-10 md:h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-xl md:text-lg">{product.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-base md:text-sm leading-tight mb-1">{product.name}</h3>
                              <p className="text-gray-400 text-sm md:text-xs line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-yellow-500 text-xs md:text-xs capitalize font-medium px-2 py-1 bg-yellow-500/10 rounded-full">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Results - Mobile Optimized */}
              {query && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:py-8"
                >
                  <div className="w-16 h-16 md:w-12 md:h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400 text-base md:text-sm">Ничего не найдено для</p>
                  <p className="text-white font-medium text-lg md:text-base mt-1">&quot;{query}&quot;</p>
                  <p className="text-gray-500 text-sm mt-2">Попробуйте другие ключевые слова</p>
                </motion.div>
              )}

              {/* Popular Searches - Mobile Optimized */}
              {!query && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <h4 className="text-white font-medium mb-4 text-base md:text-sm">Популярные запросы</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Мака', 'Йохимбин', 'Цинк', 'Тонгкат Али', 'Энергия', 'Либидо'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-full text-sm transition-colors border border-gray-600/50 hover:border-gray-500"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
