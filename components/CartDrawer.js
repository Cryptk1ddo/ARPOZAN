import { useCart } from '../lib/CartContext'
import { useToast } from '../lib/ToastContext'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, clearCart, getTotal, updateQuantity, addToCart } = useCart()
  const { push } = useToast()
  const router = useRouter()

  // Available products for empty cart suggestions
  const availableProducts = [
    {
      id: 'zinc',
      name: 'Цинк пиколинат',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Поддержка тестостерона и иммунитета',
      image: '/assets/imgs/Zinc-product-imgs/Zinc-Product.png',
      href: '/zinc'
    },
    {
      id: 'maca',
      name: 'Мака перуанская',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Природная энергия и выносливость',
      image: '/assets/imgs/Maca-product-imgs/Maca-Product.png',
      href: '/maca'
    },
    {
      id: 'yohimbin-new',
      name: 'Йохимбин Premium',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Сжигание жира и повышение энергии',
      image: '/assets/imgs/Yohimbin-product-imgs/Yohimbe-Product.png',
      href: '/Yohimbin'
    },
    {
      id: 'long-jack',
      name: 'Тонгкат Али',
      price: 1990,
      subscriptionPrice: 2691,
      description: 'Натуральный тестостерон бустер',
      image: '/assets/imgs/Tongkat-Ali-product-imgs/Tongkat-Ali-Product.png',
      href: '/Long-jack'
    }
  ]

  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('Вы уверены, что хотите очистить корзину?')) {
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
      plan: 'one-time'
    }
    addToCart(cartProduct)
    push(`✅ ${product.name} добавлен в корзину!`)
  }

  return (
    <div className={`fixed inset-0 z-50 transition-opacity ${open ? 'visible opacity-100' : 'invisible opacity-0'}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <aside className={`absolute right-0 top-0 h-full w-full md:w-[420px] bg-black p-6 overflow-auto transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Корзина</h3>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button className="text-sm text-gray-400 hover:text-red-400 transition-colors" onClick={handleClearCart}>
                Очистить
              </button>
            )}
            <button onClick={onClose} className="text-xl hover:text-gray-400 transition-colors">✕</button>
          </div>
        </div>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-400 mb-6">Ваша корзина пуста.</p>
              <p className="text-sm text-gray-500 mb-6">Рекомендуемые продукты:</p>

              <div className="space-y-3 sm:space-y-4">
                {availableProducts.map(product => (
                  <Link key={product.id} href={product.href} className="block">
                    <div className="group bg-black/30 border border-white/10 hover:border-white/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] active:transition-transform">
                      {/* Mobile Layout - Extra Small to Small (320px - 640px) */}
                      <div className="block sm:hidden p-3">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-sm sm:text-base mb-1 group-hover:text-gray-200 transition-colors leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-xs mb-2 leading-relaxed">{product.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm sm:text-base">{product.price.toLocaleString()} ₽</span>
                              <span className="text-gray-500 line-through text-xs">{product.subscriptionPrice.toLocaleString()} ₽</span>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddProductToCart(product)
                          }}
                          className="w-full bg-white hover:bg-gray-200 active:bg-gray-300 text-black font-bold py-3 px-4 rounded-md transition-colors text-sm touch-manipulation"
                        >
                          Добавить в корзину
                        </button>
                      </div>

                      {/* Tablet Layout - Small to Medium (640px - 1024px) */}
                      <div className="hidden sm:flex md:hidden items-center gap-4 p-4">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base mb-1 group-hover:text-gray-200 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-white font-bold text-base">{product.price.toLocaleString()} ₽</span>
                            <span className="text-gray-500 line-through text-sm">{product.subscriptionPrice.toLocaleString()} ₽</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddProductToCart(product)
                            }}
                            className="w-full bg-white hover:bg-gray-200 active:bg-gray-300 text-black font-bold py-2.5 px-4 rounded-md transition-colors text-sm touch-manipulation"
                          >
                            Добавить в корзину
                          </button>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Desktop Layout - Large and up (1024px+) */}
                      <div className="hidden md:flex items-center justify-between p-4">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-gray-200 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-lg">{product.price.toLocaleString()} ₽</span>
                            <span className="text-gray-500 line-through text-sm">{product.subscriptionPrice.toLocaleString()} ₽</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddProductToCart(product)
                        }}
                        className="hidden md:block w-full bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 transition-colors text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        Добавить в корзину
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mt-6 text-white hover:text-gray-300 transition-colors text-sm"
              >
                Продолжить покупки
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-black/50 p-4 rounded-lg">
                <div className="flex-1">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    {item.plan === 'subscription' ? 'Подписка' : 'Разовая покупка'} • {item.price.toLocaleString()} ₽
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white mb-2">
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="px-3 py-1 bg-black/70 hover:bg-black/80 rounded transition-colors"
                      onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-black/70 rounded min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 bg-black/70 hover:bg-black/80 rounded transition-colors"
                      onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="text-xs text-red-400 hover:text-red-300 ml-3 transition-colors"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400">Итого</div>
                <div className="text-2xl font-bold text-white">{getTotal().toLocaleString()} ₽</div>
              </div>
              <button
                onClick={handleCheckout}
                className="glow-button px-6 py-3"
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