import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, Search, User, Heart } from 'lucide-react'
import { useCart } from '../lib/CartContext'
import { useWishlist } from '../lib/WishlistContext'
import { useAuth } from '../lib/AuthContext'
import CartDrawer from './CartDrawer'
import SearchBar from './SearchBar'
import ToastContainer from './ToastContainer'
import Footer from './Footer'
import PromoBar from './PromoBar'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [promoBarVisible, setPromoBarVisible] = useState(true)
  const [promoBarHeight, setPromoBarHeight] = useState(40) // Default height for SSR
  const [navTransitioning, setNavTransitioning] = useState(false)
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
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
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

  // Combined useEffect for scroll handling and promo bar logic with enhanced sync
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)

      // Check promo bar visibility and adjust nav position with transition
      const dismissed =
        typeof window !== 'undefined'
          ? localStorage.getItem('promoBarDismissed')
          : null
      const height = dismissed
        ? 0
        : parseInt(
            (typeof window !== 'undefined'
              ? localStorage.getItem('promoBarHeight')
              : null) || '40'
          )
      const newPromoBarVisible = scrollTop <= 10 && !dismissed

      // Trigger transition state when promo bar visibility changes
      if (newPromoBarVisible !== promoBarVisible) {
        setNavTransitioning(true)
        setTimeout(() => setNavTransitioning(false), 300) // Match animation duration
      }

      setPromoBarVisible(newPromoBarVisible)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check (runs once on mount)
    const dismissed =
      typeof window !== 'undefined'
        ? localStorage.getItem('promoBarDismissed')
        : null
    const height = dismissed
      ? 0
      : parseInt(
          (typeof window !== 'undefined'
            ? localStorage.getItem('promoBarHeight')
            : null) || '40'
        )
    setPromoBarHeight(height)
    setPromoBarVisible(window.scrollY <= 10 && !dismissed)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [promoBarVisible])

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

  // Prevent body scroll when mobile menu is open (removed for dropdown menu)
  // useEffect(() => {
  //   if (isMenuOpen) {
  //     document.body.style.overflow = 'hidden'
  //   } else {
  //     document.body.style.overflow = 'unset'
  //   }
  //   return () => {
  //     document.body.style.overflow = 'unset'
  //   }
  // }, [isMenuOpen])

  const navigation = [
    { name: 'Maca', href: '/maca' },
    { name: 'Yohimbin', href: '/Yohimbin' },
    { name: 'Zinc', href: '/zinc' },
    { name: 'Long Jack', href: '/Long-jack' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <PromoBar />

      <nav
        className={`fixed w-full z-40 backdrop-blur-md transition-all duration-300 ease-out ${
          promoBarVisible ? 'top-[40px]' : 'top-0'
        } ${navTransitioning ? 'nav-syncing' : ''} ${
          isScrolled ? 'bg-black/90 shadow-2xl shadow-black/50' : 'bg-black/80'
        }`}
        style={{
          borderBottom: isScrolled
            ? '1px solid rgba(248, 248, 248, 0.08)'
            : 'none',
          boxShadow: isScrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(248, 248, 248, 0.05)'
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between items-center h-16">
            {/* Logo - Left */}
            <Link
              href="/"
              className="text-xl font-bold gradient-text transition-all duration-200 hover:scale-105"
            >
              ARPOZAN
            </Link>

            {/* Search, Cart and Hamburger Icons - Right */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative text-white hover:text-blue-400 transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95"
                aria-label="Поиск"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-blue-400 transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95"
                aria-label="Корзина"
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Enhanced Hamburger Menu */}
              <button
                onClick={handleMenuToggle}
                disabled={menuLoading}
                className="relative w-11 h-11 flex flex-col justify-center items-center text-white transition-all duration-200 group rounded-xl p-2 disabled:opacity-50 disabled:cursor-not-allowed z-50 hover:bg-white/5"
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={isMenuOpen}
                style={{
                  transform: isMenuOpen ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                {menuLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {/* Enhanced hamburger lines with better animation */}
                    <div
                      className={`w-5 h-0.5 bg-current transition-all duration-300 ease-out transform ${
                        isMenuOpen
                          ? 'rotate-45 translate-y-0 absolute'
                          : 'relative -translate-y-1.5'
                      }`}
                    ></div>
                    <div
                      className={`w-5 h-0.5 bg-current transition-all duration-200 ease-out ${
                        isMenuOpen
                          ? 'opacity-0 scale-0'
                          : 'opacity-100 scale-100'
                      }`}
                    ></div>
                    <div
                      className={`w-5 h-0.5 bg-current transition-all duration-300 ease-out transform ${
                        isMenuOpen
                          ? '-rotate-45 translate-y-0 absolute'
                          : 'relative translate-y-1.5'
                      }`}
                    ></div>

                    {/* Touch feedback ripple */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:bg-white transition-all duration-150 ease-out scale-75 group-active:scale-100"></div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              ARPOZAN
            </Link>

            <div className="flex space-x-8">
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

              <Link
                href="/profile"
                className="relative text-white hover:text-blue-400 transition-colors"
              >
                <User size={24} />
              </Link>

              <div className="relative">
                <Link
                  href="/wishlist"
                  className="text-white hover:text-blue-400 transition-colors"
                >
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
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div
              className="absolute top-full left-0 right-0 z-30 bg-gradient-to-b from-black via-black/95 to-black/90 border-t border-white/10 shadow-2xl backdrop-blur-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Мобильная навигация"
              style={{
                animation: isMenuOpen
                  ? 'enhancedMenuEnter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                  : 'enhancedMenuExit 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                minHeight: 'calc(100vh - 64px)',
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Enhanced background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-10 w-32 h-32 bg-gradient-to-br from-white to-gray-300 rounded-full blur-3xl animate-pulse"></div>
                <div
                  className="absolute bottom-8 right-10 w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full blur-2xl animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>
                <div
                  className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-white/50 to-gray-300/50 rounded-full blur-xl animate-pulse"
                  style={{ animationDelay: '2s' }}
                ></div>
              </div>

              {/* Menu content with enhanced spacing */}
              <div className="relative px-6 py-8">
                {/* Welcome message */}
                <div
                  className="mb-6 text-center"
                  style={{
                    animation: isMenuOpen
                      ? `enhancedFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                      : 'none',
                    animationDelay: '0.1s',
                    opacity: 0,
                  }}
                >
                  <p className="text-gray-400 text-sm">Добро пожаловать в</p>
                  <h3 className="gradient-text text-lg font-bold">ARPOZAN</h3>
                </div>

                {/* Navigation items with enhanced styling */}
                <ul className="space-y-3 mb-8" role="none">
                  {navigation.map((item, idx) => (
                    <li
                      key={item.name}
                      className="mobile-menu-focusable"
                      role="listitem"
                      style={{
                        animation: isMenuOpen
                          ? `enhancedSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                          : 'none',
                        animationDelay: isMenuOpen
                          ? `${0.2 + idx * 0.08}s`
                          : '0s',
                        opacity: 0,
                        transform: 'translateX(-20px)',
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between text-white text-lg font-medium py-4 px-5 rounded-2xl hover:bg-white/8 active:bg-white/12 transition-all duration-200 group"
                        role="menuitem"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(248, 248, 248, 0.02) 0%, rgba(248, 248, 248, 0.01) 100%)',
                          border: '1px solid rgba(248, 248, 248, 0.05)',
                        }}
                      >
                        <span className="group-hover:text-blue-400 transition-colors duration-200">
                          {item.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-blue-400/50 transition-all duration-200"></div>
                          <svg
                            className="w-4 h-4 text-white/40 group-hover:text-blue-400/70 group-hover:translate-x-1 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Quick Actions with better design */}
                <div
                  className="border-t border-white/10 pt-6"
                  style={{
                    animation: isMenuOpen
                      ? `enhancedSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                      : 'none',
                    animationDelay: isMenuOpen
                      ? `${0.2 + navigation.length * 0.08 + 0.1}s`
                      : '0s',
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                >
                  <p className="text-gray-400 text-sm mb-4 text-center">
                    Быстрые действия
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIsSearchOpen(true)
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-200 border border-white/5 group"
                    >
                      <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/15 transition-all duration-200">
                        <Search size={18} />
                      </div>
                      <span className="text-sm font-medium">Поиск</span>
                    </button>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-200 border border-white/5 group"
                    >
                      <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/15 transition-all duration-200">
                        <User size={18} />
                      </div>
                      <span className="text-sm font-medium">Профиль</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-200 border border-white/5 group"
                    >
                      <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/15 transition-all duration-200">
                        <Heart size={18} />
                      </div>
                      <span className="text-sm font-medium">Избранное</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsCartOpen(true)
                        setIsMenuOpen(false)
                      }}
                      className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-all duration-200 border border-white/5 group relative"
                    >
                      <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/15 transition-all duration-200">
                        <ShoppingCart size={18} />
                        {getTotalItems() > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                            {getTotalItems()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Корзина</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main
        className="transition-all duration-300"
        style={{ paddingTop: promoBarVisible ? '104px' : '64px' }}
      >
        {children}
      </main>

      <Footer />

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <ToastContainer />
    </div>
  )
}
