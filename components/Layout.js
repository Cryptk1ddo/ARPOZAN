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
      <PromoBar />

      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md transition-all duration-300">
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

              {/* Hamburger Menu */}
              <button
                onClick={handleMenuToggle}
                disabled={menuLoading}
                className="relative w-10 h-10 flex flex-col justify-center items-center text-white transition-all duration-300 group rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="fixed inset-0 z-[9999]"
              role="dialog"
              aria-modal="true"
              aria-label="Мобильная навигация"
            >
              {/* Backdrop with premium fade */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsMenuOpen(false)
                  }
                }}
                style={{
                  animation: isMenuOpen ? 'fadeInBackdrop 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'fadeOutBackdrop 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              />

              {/* Mobile Menu - Full Screen (Apple-style globalnav) */}
              <div
                className="absolute inset-0 h-screen min-h-screen bg-gradient-to-b from-black via-black/95 to-black overflow-hidden"
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                aria-label="Menu"
                style={{
                  animation: isMenuOpen
                    ? 'slideDownFullScreen 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : 'slideUpFullScreen 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
                  ['--r-globalnav-flyout-rate']: '450.5ms'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Background pattern - Full screen (kept) */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-32 left-20 w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* Globalnav content wrapper */}
                <div className="globalnav-content flex flex-col h-full relative overflow-y-auto">
                  {/* Menuback - left top back button */}
                  <div className="globalnav-item globalnav-menuback flex items-center h-16 px-4">
                    <button
                      aria-label="Main menu"
                      className="globalnav-menuback-button mobile-menu-focusable text-white/80 hover:text-white transition-all duration-300 p-2 rounded-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="globalnav-chevron-icon inline-block align-middle">
                        {/* Chevron SVG (left) */}
                        <svg height="24" viewBox="0 0 9 48" width="8" xmlns="http://www.w3.org/2000/svg"><path d="m1.5618 24.0621 6.5581-6.4238c.2368-.2319.2407-.6118.0088-.8486-.2324-.2373-.6123-.2407-.8486-.0088l-7 6.8569c-.1157.1138-.1807.2695-.1802.4316.001.1621.0674.3174.1846.4297l7 6.7241c.1162.1118.2661.1675.4155.1675.1577 0 .3149-.062.4326-.1846.2295-.2388.2222-.6187-.0171-.8481z"/></svg>
                      </span>
                    </button>

                    {/* Keep close button on right inside same header (for muscle-memory) */}
                    <div className="ml-auto">
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-menu-focusable text-white/80 hover:text-white transition-all duration-300 p-2"
                        aria-label="Закрыть меню"
                      >
                        <div className="w-5 h-5 flex flex-col justify-center items-center">
                          <div className="w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform origin-center rotate-45 translate-y-0.5"></div>
                          <div className="w-5 h-0.5 bg-current transition-all duration-300 ease-in-out transform origin-center -rotate-45 -translate-y-0.5"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* List container (matches globalnav-list semantic) */}
                  <ul id="globalnav-list" className="globalnav-list px-4 pt-2 pb-8 space-y-4" role="none">
                    {navigation.map((item, idx) => (
                      <li
                        key={item.name}
                        className="globalnav-item globalnav-item-menu"
                        role="listitem"
                        style={{
                          ['--r-globalnav-flyout-item-number']: idx,
                          animation: isMenuOpen ? `appleCascadeSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none',
                          animationDelay: isMenuOpen ? `${0.1 + idx * 0.08}s` : '0s',
                          opacity: isMenuOpen ? 1 : 0,
                          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                        }}
                      >
                        <a
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="globalnav-link flex items-center justify-between text-white text-2xl font-light py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
                          role="menuitem"
                        >
                          <span className="globalnav-link-text">{item.name}</span>
                          <span className="globalnav-link-chevron ml-4 inline-flex items-center">
                            <svg height="18" viewBox="0 0 9 48" width="8" xmlns="http://www.w3.org/2000/svg"><path d="m8.1155 30.358a.6.6 0 1 1 -.831.8653l-7-6.7242a.6.6 0 0 1 -.0045-.8613l7-6.8569a.6.6 0 1 1 .84.8574l-6.5582 6.4238z"/></svg>
                          </span>
                        </a>
                      </li>
                    ))}

                    {/* Optional group: Quick Actions */}
                    <li className="globalnav-item" role="listitem">
                      <div
                        className="mt-6 grid grid-cols-4 gap-4 px-1"
                        style={{
                          animation: isMenuOpen ? `appleCascadeSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none',
                          animationDelay: isMenuOpen ? `${0.1 + navigation.length * 0.08 + 0.1}s` : '0s',
                          opacity: isMenuOpen ? 1 : 0,
                          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                        }}
                      >
                        <button onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-lg bg-white/3 hover:bg-white/6">
                          <Search size={20} />
                          <span className="text-xs mt-2">Поиск</span>
                        </button>
                        <button onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-lg bg-white/3 hover:bg-white/6">
                          <User size={20} />
                          <span className="text-xs mt-2">Профиль</span>
                        </button>
                        <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-lg bg-white/3 hover:bg-white/6">
                          <Heart size={20} />
                          <span className="text-xs mt-2">Избранное</span>
                        </Link>
                        <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="mobile-menu-focusable flex flex-col items-center text-white/90 py-4 rounded-lg bg-white/3 hover:bg-white/6">
                          <ShoppingCart size={20} />
                          <span className="text-xs mt-2">Корзина</span>
                        </button>
                      </div>
                    </li>
                  </ul>

                  {/* Footer area */}
                  <div className="pb-12 pt-6 px-6 text-center text-white/60 text-sm">
                    © 2025 ARPOZAN
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="transition-all duration-300" style={{ paddingTop: promoBarVisible ? `${64 + promoBarHeight}px` : '64px' }}>
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