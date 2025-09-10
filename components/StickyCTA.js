import { useState, useEffect } from 'react'
import { useCart } from '../lib/CartContext'

export default function StickyCTA({ product, onAddToCart }) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('one-time')
  const { addToCart } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const ctaElement = document.getElementById('main-cta')
    if (ctaElement) {
      observer.observe(ctaElement)
    }

    return () => {
      if (ctaElement) {
        observer.unobserve(ctaElement)
      }
    }
  }, [])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: selectedPlan === 'subscription' ? product.subscriptionPrice : product.oneTimePrice,
        quantity: 1,
        plan: selectedPlan
      })
      onAddToCart?.()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <h3 className="font-semibold">{product?.name}</h3>
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => setSelectedPlan('one-time')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedPlan === 'one-time'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {product?.oneTimePrice}₽
                </button>
                <button
                  onClick={() => setSelectedPlan('subscription')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedPlan === 'subscription'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {product?.subscriptionPrice}₽/мес
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="glow-button bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 fade-in"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  )
}
