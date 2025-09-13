import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PromoBar() {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const promoRef = useRef(null)

  // Array of 3 different promos (removed codes)
  const promos = [
    {
      message: "СКИДКА 15% НА ПЕРВЫЙ ЗАКАЗ!",
      emoji: "🎉"
    },
    {
      message: "БЕСПЛАТНАЯ ДОСТАВКА ОТ 3000₽",
      emoji: "🚚"
    },
    {
      message: "КОМПЛЕКС + ЗИНКА В ПОДАРОК",
      emoji: "🎁"
    }
  ]

  useEffect(() => {
    // Auto-rotate promos every 5 seconds
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promos.length)
    }, 5000)

    // Store height in localStorage for Layout component
    if (promoRef.current) {
      localStorage.setItem('promoBarHeight', '40')
    }

    return () => clearInterval(interval)
  }, [promos.length])

  useEffect(() => {
    // Handle scroll visibility with enhanced sync
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const newVisibility = scrollTop <= 10
      
      // Only update if visibility actually changes to prevent unnecessary re-renders
      if (newVisibility !== isVisible) {
        setIsVisible(newVisibility)
        
        // Dispatch custom event for nav bar sync
        window.dispatchEvent(new CustomEvent('promoBarVisibilityChange', {
          detail: { visible: newVisibility, height: 40 }
        }))
      }
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promos.length)
  }

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promos.length) % promos.length)
  }

  const currentPromo = promos[currentPromoIndex]

  return (
    <div
      ref={promoRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white transition-all duration-300 ease-out border-b border-white/10 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ 
        height: '40px',
        boxShadow: isVisible 
          ? '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(248, 248, 248, 0.05)' 
          : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Navigation buttons */}
          <button
            onClick={prevPromo}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Предыдущий промо"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Promo content */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center space-x-3 transition-all duration-700 ease-in-out">
              <div className="flex items-center space-x-2 transform transition-all duration-500 ease-out">
                <span className="text-base transition-all duration-300 ease-in-out transform hover:scale-110">{currentPromo.emoji}</span>
                <span className="font-bold text-sm transition-all duration-500 ease-in-out">
                  {currentPromo.message}
                </span>
              </div>
            </div>
          </div>

          {/* Next button only */}
          <button
            onClick={nextPromo}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Следующий промо"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
