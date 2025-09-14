import { useCart } from '../lib/CartContext'
import { useToast } from '../lib/ToastContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, X, ShoppingCart as CartIcon } from 'lucide-react'
import { useState } from 'react'

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    removeFromCart,
    clearCart,
    getTotal,
    updateQuantity,
    addToCart,
  } = useCart()
  const { push } = useToast()
  const router = useRouter()
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Available products for empty cart suggestions
  const availableProducts = [
    {
      id: 'zinc',
      name: 'Цинк пиколинат',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Поддержка тестостерона и иммунитета',
      image: '/assets/imgs/Zinc-product-imgs/Zinc-Product.png',
      href: '/zinc',
    },
    {
      id: 'maca',
      name: 'Мака перуанская',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Природная энергия и выносливость',
      image: '/assets/imgs/Maca-product-imgs/Maca-Product.png',
      href: '/maca',
    },
    {
      id: 'yohimbin-new',
      name: 'Йохимбин Premium',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Сжигание жира и повышение энергии',
      image: '/assets/imgs/Yohimbin-product-imgs/Yohimbe-Product.png',
      href: '/Yohimbin',
    },
    {
      id: 'long-jack',
      name: 'Тонгкат Али',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Натуральный тестостерон бустер',
      image: '/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Product.png',
      href: '/Long-jack',
    },
  ]

  const handleClearCart = () => {
    if (
      cart.length > 0 &&
      window.confirm('Вы уверены, что хотите очистить корзину?')
    ) {
      clearCart()
      push('Корзина очищена')
    }
  }

  const handleUpdateQuantity = (itemId, itemName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      push(`${itemName} удален из корзины`)
    } else {
      updateQuantity(itemId, newQuantity)
      push(`${itemName} количество обновлено: ${newQuantity}`)
    }
  }

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId)
    push(`${itemName} удален из корзины`)
  }

  const handleCheckout = () => {
    onClose?.()
    router.push('/checkout')
  }

  const handleAddProductToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      plan: 'one-time',
    }
    addToCart(cartProduct)
    push(`✅ ${product.name} добавлен в корзину!`)
  }

  // Touch handlers for mobile swipe
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

    // Close cart on left swipe
    if (isLeftSwipe) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Cart Modal - Mobile Top Slide Style */}
      <aside
        className={`fixed inset-x-0 top-0 md:right-0 md:left-auto md:w-[420px] bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-xl border-b md:border-l border-white/10 shadow-2xl transform transition-all duration-400 ease-out ${
          open
            ? 'translate-y-0 md:translate-x-0'
            : '-translate-y-full md:translate-x-full'
        }`}
        style={{
          minHeight: 'calc(100vh - 0px)',
          maxHeight: 'calc(100vh - 0px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: open
            ? 'enhancedMenuEnter 0.35s cubic-bezier(0.23, 1, 0.32, 1) forwards'
            : 'enhancedMenuExit 0.25s cubic-bezier(0.23, 1, 0.32, 1) forwards',
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
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-gray-300/40 to-white/40 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '4.5s' }}
          ></div>
        </div>

        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 relative z-10">
          <button
            onClick={onClose}
            className="flex items-center space-x-3 text-white/60 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95 md:hidden"
            style={{
              animation: open
                ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                : 'none',
              animationDelay: '0.08s',
              opacity: 0,
            }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Назад</span>
          </button>

          <h3
            className="gradient-text font-bold text-lg flex items-center space-x-2"
            style={{
              animation: open
                ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                : 'none',
              animationDelay: '0.12s',
              opacity: 0,
            }}
          >
            <CartIcon size={20} />
            <span>Корзина {cart.length > 0 && `(${cart.length})`}</span>
          </h3>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                className="text-sm text-gray-400 hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-white/5 active:scale-95"
                onClick={handleClearCart}
                style={{
                  animation: open
                    ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                    : 'none',
                  animationDelay: '0.16s',
                  opacity: 0,
                }}
              >
                Очистить
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 hidden md:block"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div
          className="p-6 space-y-4 relative z-10"
          style={{
            animation: open
              ? `enhancedSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards`
              : 'none',
            animationDelay: '0.2s',
            opacity: 0,
            transform: 'translateX(-20px)',
          }}
        >
          {cart.length === 0 ? (
            <div className="text-center py-8">
              {/* Empty cart with enhanced styling */}
              <div
                className="mb-6"
                style={{
                  animation: open
                    ? `enhancedFadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                    : 'none',
                  animationDelay: '0.25s',
                  opacity: 0,
                }}
              >
                <div className="w-16 h-16 bg-white/8 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                  <CartIcon size={24} className="text-white/30" />
                </div>
                <p className="text-white/60 mb-4 text-lg font-light">
                  Ваша корзина пуста
                </p>
                <p className="text-sm text-white/40 mb-6">
                  Рекомендуемые продукты:
                </p>
              </div>

              {/* Simplified product recommendations */}
              <div className="space-y-3">
                {availableProducts.slice(0, 3).map((product, idx) => (
                  <div
                    key={product.id}
                    className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-200 hover:bg-white/8 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      animation: open
                        ? `enhancedSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                        : 'none',
                      animationDelay: `${0.3 + idx * 0.06}s`,
                      opacity: 0,
                      transform: 'translateX(-15px)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1 group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-white/60 text-xs mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">
                            {product.price.toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddProductToCart(product)}
                        className="ml-4 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mt-6 text-white/60 hover:text-white transition-colors text-sm p-2 rounded-lg hover:bg-white/5"
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            /* Cart items */
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/8 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    animation: open
                      ? `enhancedSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                      : 'none',
                    animationDelay: `${0.28 + idx * 0.06}s`,
                    opacity: 0,
                    transform: 'translateX(-15px)',
                  }}
                >
                  <div className="flex-1">
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-sm text-white/60">
                      {item.plan === 'subscription'
                        ? 'Подписка'
                        : 'Разовая покупка'}{' '}
                      • {item.price.toLocaleString()} ₽
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white mb-2">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.name,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-white/10 rounded-lg min-w-[40px] text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.name,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="text-xs text-red-400 hover:text-red-300 ml-3 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div
            className="border-t border-white/10 p-6 relative z-10"
            style={{
              animation: open
                ? `enhancedSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards`
                : 'none',
              animationDelay: '0.35s',
              opacity: 0,
              transform: 'translateY(20px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/60">Итого</div>
                <div className="text-2xl font-bold gradient-text">
                  {getTotal().toLocaleString()} ₽
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="glow-button px-6 py-3 text-black font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Перейти к оплате
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
