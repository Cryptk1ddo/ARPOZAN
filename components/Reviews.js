import { useState, useEffect } from 'react'
import { Star, Quote, Plus, ThumbsUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../lib/ToastContext'

const initialReviews = [
  {
    id: 1,
    name: 'Алексей П.',
    rating: 5,
    text: 'Энергии стало в разы больше, тренировки проходят легче, а восстановление быстрее. Это то, что я искал.',
    product: 'Мака перуанская',
    date: '2024-01-15',
    verified: true,
    helpful: 24
  },
  {
    id: 2,
    name: 'Михаил В.',
    rating: 5,
    text: 'Работаю в IT, постоянные дедлайны. С этим комплексом голова стала яснее, и к вечеру остаются силы на семью.',
    product: 'Йохимбин Premium',
    date: '2024-01-12',
    verified: true,
    helpful: 18
  },
  {
    id: 3,
    name: 'Игорь С.',
    rating: 5,
    text: 'Либидо вернулось на уровень 20-летнего. Жена довольна, я тоже. Спасибо, ребята!',
    product: 'Цинк пиколинат',
    date: '2024-01-10',
    verified: true,
    helpful: 31
  }
]

export default function Reviews({ productId, limit = null }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: '',
    product: ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const { user, isAuthenticated } = useAuth()
  const { push } = useToast()

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem(`reviews-${productId}`)
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews)
        setReviews([...initialReviews, ...parsed])
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
    }
  }, [productId])

  const handleSubmitReview = (e) => {
    e.preventDefault()

    if (!isAuthenticated()) {
      push('Пожалуйста, войдите в аккаунт, чтобы оставить отзыв')
      return
    }

    if (!newReview.text.trim()) {
      push('Пожалуйста, напишите текст отзыва')
      return
    }

    const review = {
      id: Date.now(),
      name: user.name,
      rating: newReview.rating,
      text: newReview.text,
      product: newReview.product || 'Общий отзыв',
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0
    }

    const updatedReviews = [review, ...reviews]
    setReviews(updatedReviews)

    // Save to localStorage
    const customReviews = updatedReviews.filter(r => !initialReviews.find(ir => ir.id === r.id))
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(customReviews))

    setNewReview({ rating: 5, text: '', product: '' })
    setShowReviewForm(false)
    push('✅ Спасибо за ваш отзыв!')
  }

  const handleHelpful = (reviewId) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const displayedReviews = limit ? sortedReviews.slice(0, limit) : sortedReviews
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Отзывы клиентов</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-600'
                  }`}
                />
              ))}
              <span className="text-white ml-2">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">({reviews.length} отзывов)</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="highest">Высокий рейтинг</option>
            <option value="lowest">Низкий рейтинг</option>
            <option value="helpful">Полезные</option>
          </select>

          {isAuthenticated() && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Написать отзыв</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Написать отзыв</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Рейтинг</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= newReview.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-600 hover:text-yellow-500'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Продукт (необязательно)</label>
                <select
                  value={newReview.product}
                  onChange={(e) => setNewReview(prev => ({ ...prev, product: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="">Общий отзыв</option>
                  <option value="Мака перуанская">Мака перуанская</option>
                  <option value="Йохимбин Premium">Йохимбин Premium</option>
                  <option value="Цинк пиколинат">Цинк пиколинат</option>
                  <option value="Тонгкат Али">Тонгкат Али</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Ваш отзыв</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Расскажите о вашем опыте использования продукта..."
                  rows={4}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg transition-colors"
                >
                  Опубликовать
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{review.name}</span>
                    {review.verified && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                        Проверенный покупатель
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= review.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
              {review.product && (
                <span className="text-yellow-500 text-sm font-medium">
                  {review.product}
                </span>
              )}
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 text-gray-600" size={20} />
              <p className="text-gray-300 pl-6">{review.text}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <ThumbsUp size={16} />
                <span className="text-sm">Полезно ({review.helpful})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {limit && reviews.length > limit && (
        <div className="text-center">
          <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
            Показать все отзывы ({reviews.length})
          </button>
        </div>
      )}
    </div>
  )
}
