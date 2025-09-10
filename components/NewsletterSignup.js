import { useState } from 'react'
import { Mail, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../lib/ToastContext'

export default function NewsletterSignup({ variant = 'inline' }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { push } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      push('Пожалуйста, введите корректный email адрес')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store email in localStorage for demo
      const subscribers = JSON.parse(localStorage.getItem('arpofan-newsletter') || '[]')
      if (!subscribers.includes(email)) {
        subscribers.push(email)
        localStorage.setItem('arpofan-newsletter', JSON.stringify(subscribers))
      }

      setIsSubscribed(true)
      setEmail('')
      push('✅ Спасибо за подписку! Вы будете получать наши обновления.')

      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      push('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 backdrop-blur-md rounded-lg p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Подпишитесь на новости</h3>
              <p className="text-gray-400">
                Получайте эксклюзивные скидки, новые продукты и полезные советы по мужскому здоровью
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email адрес"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Подписка...' : 'Подписаться'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Inline variant
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">Подпишитесь на новости</h3>
          <p className="text-gray-400">
            Получайте эксклюзивные скидки и полезные советы по мужскому здоровью
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-64">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email адрес"
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                />
                <span>Подписка...</span>
              </>
            ) : isSubscribed ? (
              <>
                <Check size={18} />
                <span>Готово!</span>
              </>
            ) : (
              <span>Подписаться</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
