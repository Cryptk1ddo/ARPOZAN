import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, Search, User, Heart } from 'lucide-react'
import { useCart } from '../lib/CartContext'
import { useWishlist } from '../lib/WishlistContext'
import { useAuth } from '../lib/AuthContext'
import CartDrawer from './CartDrawer'
import SearchBar from './SearchBar'
import UserProfile from './UserProfile'
import BackToTop from './BackToTop'
import ToastContainer from './ToastContainer'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const searchInputRef = useRef(null)

  // Destructure functions from hooks
  const { getTotalItems } = useCart()
  const { getWishlistCount } = useWishlist()

  // Handle search submission (prevents default; search logic handled by SearchBar)
  const handleSearch = (e) => {
    e.preventDefault()
    // Additional search logic can be added here if needed
  }

  // Handle menu opening with loading state
  const handleMenuToggle = () => {
    if (!isMenuOpen) {
      setMenuLoading(true)
      setTimeout(() => {
        setIsMenuOpen(true)
        setMenuLoading(false)
      }, 150)
    } else {
      setIsMenuOpen(false)
    }
  }

  // Keyboard navigation for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e) => {
      const focusableElements = document.querySelectorAll(
        '.mobile-menu-focusable'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Handle search input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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

    // Close menu on left swipe
    if (isLeftSwipe && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Maca', href: '/maca' },
    { name: 'Yohimbin', href: '/Yohimbin' },
    { name: 'Zinc', href: '/zinc' },
    { name: 'Long Jack', href: '/Long-jack' },
    ]

  return (
    <div className="min-h-screen bg-black">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              ARPOZAN
            </Link>

            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Search size={24} />
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="relative text-white hover:text-blue-400 transition-colors"
              >
                <User size={24} />
              </button>

              <div className="relative">
                <Link href="/wishlist" className="text-white hover:text-blue-400 transition-colors">
                  <Heart size={24} />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {getWishlistCount()}
                    </span>
                  )}
                </Link>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-blue-400 transition-colors"
              >
                <ShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={handleMenuToggle}
                disabled={menuLoading}
                className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center text-white hover:text-amber-400 transition-all duration-300 group rounded-lg hover:bg-white/10 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMenuOpen}
              >
                {menuLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className={`w-5 h-0.5 bg-current transition-all duration-300 transform ${
                      isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}></div>
                    <div className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                      isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}></div>
                    <div className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                      isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}></div>

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-20 group-active:bg-white transition-opacity duration-150"></div>
                  </>
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div
              className="md:hidden fixed inset-0 z-40 mobile-menu-backdrop animate-in fade-in duration-300"
              role="dialog"
              aria-modal="true"
              aria-label="Мобильная навигация"
              onClick={(e) => {
                // Close menu when clicking on backdrop
                if (e.target === e.currentTarget) {
                  setIsMenuOpen(false)
                }
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-32 right-10 w-24 h-24 bg-yellow-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              <div className="flex flex-col h-full relative">
                {/* Subtle scroll indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 opacity-30">
                  <div className="w-1 h-8 bg-gradient-to-b from-transparent via-white to-transparent rounded-full"></div>
                  <div className="w-1 h-12 bg-gradient-to-b from-white via-white to-transparent rounded-full"></div>
                  <div className="w-1 h-6 bg-gradient-to-b from-transparent via-white to-transparent rounded-full"></div>
                </div>
                {/* Header with close button */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-black/50 to-transparent">
                  <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
                    ARPOZAN
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-menu-focusable text-white hover:text-amber-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/10 hover:rotate-90"
                    aria-label="Закрыть меню"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-white/5">
                  <form onSubmit={handleSearch} className="relative">
                    <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                      <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInput}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Поиск товаров..."
                        className="mobile-search-input w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all duration-300"
                        aria-label="Поиск товаров"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          aria-label="Очистить поиск"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col justify-center px-6">
                  <nav className="space-y-6">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="mobile-menu-focusable group block text-white text-2xl font-medium hover:text-amber-400 transition-all duration-300 transform hover:translate-x-3 relative overflow-hidden"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animation: 'slideInFromRight 0.6s ease-out forwards'
                        }}
                      >
                        <span className="relative z-10 flex items-center">
                          {item.name}
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 group-hover:w-full transition-all duration-500"></div>
                      </Link>
                    ))}
                  </nav>

                  {/* Quick Actions */}
                  <div className="mt-8 space-y-3">
                    <div className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Быстрые действия</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setIsSearchOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="mobile-menu-focusable quick-action-btn flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
                      >
                        <Search size={20} />
                        <span className="text-xs">Поиск</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="mobile-menu-focusable quick-action-btn flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-green-500/20 to-teal-500/20 hover:from-green-500/30 hover:to-teal-500/30 text-white py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
                      >
                        <User size={20} />
                        <span className="text-xs">Профиль</span>
                      </button>

                      <Link
                        href="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-focusable quick-action-btn flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-white py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 relative"
                      >
                        <Heart size={20} />
                        <span className="text-xs">Избранное</span>
                        {getWishlistCount() > 0 && (
                          <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-bounce">
                            {getWishlistCount()}
                          </span>
                        )}
                      </Link>

                      <button
                        onClick={() => {
                          setIsCartOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="mobile-menu-focusable quick-action-btn flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-white py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10 relative"
                      >
                        <ShoppingCart size={20} />
                        <span className="text-xs">Корзина</span>
                        {getTotalItems() > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                            {getTotalItems()}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Featured Products */}
                  <div className="mt-8">
                    <div className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Популярные товары</div>
                    <div className="space-y-3">
                      {[
                        { name: 'ARPOZAN Yohimbe', href: '/Yohimbin', icon: '⚡' },
                        { name: 'ARPOZAN Maca', href: '/maca', icon: '🌿' },
                        { name: 'ARPOZAN Zinc', href: '/zinc', icon: '💪' }
                      ].map((product, index) => (
                        <Link
                          key={product.name}
                          href={product.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="mobile-menu-focusable featured-product-item flex items-center space-x-3 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:translate-x-2 group"
                          style={{
                            animationDelay: `${(navigation.length + index) * 0.1}s`,
                            animation: 'slideInFromRight 0.6s ease-out forwards'
                          }}
                        >
                          <span className="text-lg">{product.icon}</span>
                          <span className="flex-1">{product.name}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex justify-between items-center">
                    <p className="text-white/60 text-sm">
                      © 2025 ARPOZAN
                    </p>
                    <div className="flex space-x-4">
                      <button className="text-white/60 hover:text-white transition-colors text-sm">
                        Контакты
                      </button>
                      <button className="text-white/60 hover:text-white transition-colors text-sm">
                        Поддержка
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-16">
        {children}
      </main>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <BackToTop />

      <ToastContainer />
    </div>
  )
}