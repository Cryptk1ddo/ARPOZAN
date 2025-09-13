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
import Footer from './Footer'
import PromoBar from './PromoBar'

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
  const [promoBarVisible, setPromoBarVisible] = useState(true)
  const [promoBarHeight, setPromoBarHeight] = useState(40)  // Default height for SSR
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
      const focusableElements = document.querySelectorAll('.mobile-menu-focusable')
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

  // Combined useEffect for scroll handling and promo bar logic (fixed nested useEffect)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
      // Check promo bar visibility and adjust nav position
      const dismissed = typeof window !== 'undefined' ? localStorage.getItem('promoBarDismissed') : null
      const height = dismissed ? 0 : parseInt((typeof window !== 'undefined' ? localStorage.getItem('promoBarHeight') : null) || '40')
      setPromoBarVisible(scrollTop < height && !dismissed)
    }
    window.addEventListener('scroll', handleScroll)

    // Initial check (runs once on mount)
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem('promoBarDismissed') : null
    const height = dismissed ? 0 : parseInt((typeof window !== 'undefined' ? localStorage.getItem('promoBarHeight') : null) || '40')
    setPromoBarHeight(height)
    setPromoBarVisible(window.scrollY < height && !dismissed)

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
    { name: 'Главная', href: '/' },
    { name: 'Maca', href: '/maca' },
    { name: 'Yohimbin', href: '/Yohimbin' },
    { name: 'Zinc', href: '/zinc' },
    { name: 'Long Jack', href: '/Long-jack' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <PromoBar />

      <nav 
        className={`fixed w-full z-40 bg-black/80 backdrop-blur-md transition-all duration-300 ${
          promoBarVisible ? 'top-[40px]' : 'top-0'
        }`}
        style={{
          animation: promoBarVisible ? 'promoSlideIn 0.3s ease-out forwards' : 'promoSlideOut 0.3s ease-out forwards'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between items-center h-16">
            {/* Logo - Left */}
            <Link href="/" className="text-xl font-bold gradient-text">
              ARPOZAN
            </Link>

            {/* Search, Cart and Hamburger Icons - Right */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative text-white hover:text-blue-400 transition-colors p-2"
                aria-label="Поиск"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-blue-400 transition-colors p-2"
                aria-label="Корзина"
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Hamburger Menu - Now stays in place and becomes close button */}
              <button
                onClick={handleMenuToggle}
                disabled={menuLoading}
                className="relative w-10 h-10 flex flex-col justify-center items-center text-white transition-all duration-300 group rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed z-50"
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMenuOpen}
              >
                {menuLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {/* Top line */}
                    <div className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform origin-center ${
                      isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                    }`}></div>
                    {/* Bottom line */}
                    <div className={`w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform origin-center ${
                      isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                    }`}></div>

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-20 group-active:bg-white transition-all duration-200 ease-out"></div>
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
            </div>
          </div>

          {isMenuOpen && (
            <div
              className="absolute top-full left-0 right-0 z-30 bg-gradient-to-b from-black via-black/95 to-black border-t border-white/10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Мобильная навигация"
              style={{
                animation: isMenuOpen
                  ? 'slideDownMenu 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                  : 'slideUpMenu 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isMenuOpen ? 1 : 0
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Background pattern - subtle */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-10 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-8 right-10 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Menu content */}
              <div className="relative px-4 py-6">
                {/* Navigation items */}
                <ul className="space-y-2" role="none">
                  {navigation.map((item, idx) => (
                    <li
                      key={item.name}
                      className="mobile-menu-focusable"
                      role="listitem"
                      style={{
                        animation: isMenuOpen ? `appleCascadeSlide 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none',
                        animationDelay: isMenuOpen ? `${0.1 + idx * 0.06}s` : '0s',
                        opacity: isMenuOpen ? 1 : 0,
                        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-15px)'
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between text-white text-lg font-light py-3 px-4 rounded-lg hover:bg-white/5 transition-colors"
                        role="menuitem"
                      >
                        <span>{item.name}</span>
                        <span className="ml-4 inline-flex items-center">
                          <svg height="16" viewBox="0 0 9 48" width="7" xmlns="http://www.w3.org/2000/svg"><path d="m8.1155 30.358a.6.6 0 1 1 -.831.8653l-7-6.7242a.6.6 0 0 1 -.0045-.8613l7-6.8569a.6.6 0 1 1 .84.8574l-6.5582 6.4238z"/></svg>
                        </span>
                      </a>
                    </li>
                  ))}

                  {/* Quick Actions */}
                  <li
                    className="mt-6 pt-4 border-t border-white/10"
                    style={{
                      animation: isMenuOpen ? `appleCascadeSlide 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none',
                      animationDelay: isMenuOpen ? `${0.1 + navigation.length * 0.06 + 0.1}s` : '0s',
                      opacity: isMenuOpen ? 1 : 0,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-15px)'
                    }}
                  >
                    <div className="grid grid-cols-4 gap-3">
                      <button onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-3 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                        <Search size={18} />
                        <span className="text-xs mt-1">Поиск</span>
                      </button>
                      <button onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-3 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                        <User size={18} />
                        <span className="text-xs mt-1">Профиль</span>
                      </button>
                      <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-3 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                        <Heart size={18} />
                        <span className="text-xs mt-1">Избранное</span>
                      </Link>
                      <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-3 rounded-lg bg-white/3 hover:bg-white/6 transition-colors">
                        <ShoppingCart size={18} />
                        <span className="text-xs mt-1">Корзина</span>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="transition-all duration-300" style={{ paddingTop: promoBarVisible ? '104px' : '64px' }}>
        {children}
      </main>

      <Footer />

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