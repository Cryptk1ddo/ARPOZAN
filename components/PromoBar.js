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
    // Handle scroll visibility
    const handleScroll = () => {
      const scrollTop = window.scrollY
      // Show only when at the very top (within 10px of top)
      setIsVisible(scrollTop <= 10)
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white transition-transform duration-300 ease-in-out border-b border-white/10 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ height: '40px' }}
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
