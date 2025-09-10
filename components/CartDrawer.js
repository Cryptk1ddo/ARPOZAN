import { useCart } from '../lib/CartContext'
import { useToast } from '../lib/ToastContext'
import { useRouter } from 'next/router'

export default function CartDrawer({ open, onClose }){
  const { cart, removeFromCart, clearCart, getTotal, updateQuantity } = useCart()
  const { push } = useToast()
  const router = useRouter()

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
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-gray-400">Ваша корзина пуста.</p>
              <button
                onClick={onClose}
                className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
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
                  <div className="font-bold text-yellow-400 mb-2">
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
                <div className="text-2xl font-bold text-yellow-400">{getTotal().toLocaleString()} ₽</div>
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