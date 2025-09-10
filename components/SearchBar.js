import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const products = [
  {
    id: 'maca',
    name: 'Мака перуанская',
    description: 'Природный бустер либидо и энергии',
    href: '/maca',
    category: 'libido'
  },
  {
    id: 'yohimbin',
    name: 'Йохимбин Premium',
    description: 'Сжигатель жира и стимулятор энергии',
    href: '/Yohimbin',
    category: 'energy'
  },
  {
    id: 'zinc',
    name: 'Цинк пиколинат',
    description: 'Поддержка тестостерона и иммунитета',
    href: '/zinc',
    category: 'testosterone'
  },
  {
    id: 'long-jack',
    name: 'Тонгкат Али',
    description: 'Натуральный стимулятор тестостерона',
    href: '/Long-jack',
    category: 'testosterone'
  }
]

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const searchRef = useRef(null)

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-md rounded-lg border border-gray-700 z-50"
          >
            <div className="p-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Поиск продуктов..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 max-h-96 overflow-y-auto"
                  >
                    <div className="space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={product.href}
                          onClick={onClose}
                          className="block p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <h3 className="text-white font-medium">{product.name}</h3>
                              <p className="text-gray-400 text-sm">{product.description}</p>
                            </div>
                            <div className="text-yellow-500 text-sm capitalize">
                              {product.category}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Results */}
              {query && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center py-8"
                >
                  <p className="text-gray-400">Ничего не найдено для "{query}"</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
