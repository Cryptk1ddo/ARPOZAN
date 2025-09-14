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
    icon: '🌿',
  },
  {
    id: 'yohimbin',
    name: 'Йохимбин Premium',
    description: 'Сжигатель жира и стимулятор энергии',
    href: '/Yohimbin',
    category: 'energy',
    icon: '⚡',
  },
  {
    id: 'zinc',
    name: 'Цинк пиколинат',
    description: 'Поддержка тестостерона и иммунитета',
    href: '/zinc',
    category: 'testosterone',
    icon: '💪',
  },
  {
    id: 'long-jack',
    name: 'Тонгкат Али',
    description: 'Натуральный стимулятор тестостерона',
    href: '/Long-jack',
    category: 'testosterone',
    icon: '🌿',
  },
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

    const filtered = products.filter(
      (product) =>
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

          {/* Search Modal - Enhanced Mobile Top Slide Style */}
          <motion.div
            initial={{ opacity: 0, y: '-100%', scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '-100%', scale: 0.98 }}
            transition={{
              type: 'tween',
              duration: 0.35,
              ease: [0.23, 1, 0.32, 1], // Enhanced easing curve
              scale: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
            className="fixed inset-x-0 top-0 md:top-16 md:left-1/2 md:transform md:-translate-x-1/2 md:w-full md:max-w-2xl md:mx-4 md:rounded-lg bg-gradient-to-b from-black via-black/98 to-black/95 border-b md:border border-white/10 z-50 shadow-2xl backdrop-blur-xl"
            style={{
              minHeight: 'calc(100vh - 0px)',
              maxHeight: 'calc(100vh - 0px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxShadow: `
                0 25px 60px rgba(0, 0, 0, 0.8),
                0 8px 32px rgba(0, 0, 0, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.08),
                inset 0 0 0 1px rgba(255, 255, 255, 0.03)
              `,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Enhanced background pattern */}
            <div className="absolute inset-0 opacity-5 md:hidden">
              <div className="absolute top-8 left-10 w-32 h-32 bg-gradient-to-br from-white to-gray-300 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute bottom-8 right-10 w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: '1.5s' }}
              ></div>
              <div
                className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-white/50 to-gray-300/50 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: '3s' }}
              ></div>
              <div
                className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-white/30 to-gray-200/30 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: '4.5s' }}
              ></div>
            </div>

            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 md:hidden">
              <button
                onClick={onClose}
                className="flex items-center space-x-3 text-white/60 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95"
                style={{
                  animation: isOpen
                    ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                    : 'none',
                  animationDelay: '0.08s',
                  opacity: 0,
                }}
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Назад</span>
              </button>
              <h2
                className="gradient-text font-bold text-lg"
                style={{
                  animation: isOpen
                    ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                    : 'none',
                  animationDelay: '0.12s',
                  opacity: 0,
                }}
              >
                Поиск
              </h2>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            <div className="p-6 md:p-6">
              {/* Search Input - Enhanced */}
              <div
                className="relative mb-6"
                style={{
                  animation: isOpen
                    ? `enhancedSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                    : 'none',
                  animationDelay: '0.16s',
                  opacity: 0,
                  transform: 'translateY(15px)',
                }}
              >
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40"
                  size={20}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Поиск продуктов..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-12 py-4 md:py-3 bg-white/8 border border-white/10 rounded-2xl md:rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:bg-white/12 text-base md:text-sm backdrop-blur-sm transition-all duration-300 focus:scale-[1.01]"
                  style={{
                    fontSize: '16px',
                    background:
                      'linear-gradient(135deg, rgba(248, 248, 248, 0.08) 0%, rgba(248, 248, 248, 0.04) 100%)',
                    boxShadow:
                      '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 248, 0.05)',
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Results - Enhanced with animations */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="max-h-[calc(100vh-300px)] md:max-h-96 overflow-y-auto"
                    style={{
                      animation: isOpen
                        ? `enhancedSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                        : 'none',
                      animationDelay: '0.2s',
                      opacity: 0,
                      transform: 'translateY(10px)',
                    }}
                  >
                    <div className="space-y-3 md:space-y-2">
                      {results.map((product, idx) => (
                        <Link
                          key={product.id}
                          href={product.href}
                          onClick={onClose}
                          className="block p-4 md:p-3 rounded-2xl md:rounded-lg hover:bg-white/8 active:bg-white/12 transition-all duration-200 border border-white/5 hover:border-white/15 group hover:scale-[1.01] active:scale-[0.99]"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(248, 248, 248, 0.03) 0%, rgba(248, 248, 248, 0.01) 100%)',
                            boxShadow:
                              '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(248, 248, 248, 0.03)',
                            animation: isOpen
                              ? `enhancedSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                              : 'none',
                            animationDelay: `${0.24 + idx * 0.04}s`,
                            opacity: 0,
                            transform: 'translateX(-10px)',
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 md:w-10 md:h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-white/15 group-hover:to-white/8 transition-all duration-200 border border-white/5 group-hover:scale-105">
                              <span className="text-xl md:text-lg">
                                {product.icon}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-base md:text-sm leading-tight mb-1 group-hover:text-blue-400 transition-colors duration-200">
                                {product.name}
                              </h3>
                              <p className="text-white/60 text-sm md:text-xs line-clamp-2 group-hover:text-white/70 transition-colors">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-white/80 text-xs md:text-xs capitalize font-medium px-3 py-1 bg-white/8 rounded-full group-hover:bg-white/12 group-hover:text-white transition-all duration-200 border border-white/5">
                                {product.category}
                              </div>
                              <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-blue-400/50 transition-all duration-200 mt-2 group-hover:scale-125"></div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Results - Enhanced */}
              {query && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:py-8"
                  style={{
                    animation: isOpen
                      ? `enhancedFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                      : 'none',
                    animationDelay: '0.4s',
                    opacity: 0,
                  }}
                >
                  <div className="w-16 h-16 md:w-12 md:h-12 bg-white/8 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                    <Search size={24} className="text-white/30" />
                  </div>
                  <p className="text-white/60 text-base md:text-sm font-light">
                    Ничего не найдено для
                  </p>
                  <p className="text-white font-medium text-lg md:text-base mt-1">
                    &quot;{query}&quot;
                  </p>
                  <p className="text-white/40 text-sm mt-2 font-light">
                    Попробуйте другие ключевые слова
                  </p>
                </motion.div>
              )}

              {/* Popular Searches - Enhanced */}
              {!query && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                  style={{
                    animation: isOpen
                      ? `enhancedSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                      : 'none',
                    animationDelay: '0.5s',
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                >
                  <h4 className="text-white font-medium mb-4 text-base md:text-sm gradient-text">
                    Популярные запросы
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'Мака',
                      'Йохимбин',
                      'Цинк',
                      'Тонгкат Али',
                      'Энергия',
                      'Либидо',
                    ].map((term, idx) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-white/8 hover:bg-white/12 text-white/80 hover:text-white rounded-full text-sm transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm font-light active:scale-95"
                        style={{
                          animation: isOpen
                            ? `enhancedSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                            : 'none',
                          animationDelay: `${0.6 + idx * 0.05}s`,
                          opacity: 0,
                          transform: 'translateX(-10px)',
                        }}
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
