import { Heart } from 'lucide-react'
import { useWishlist } from '../lib/WishlistContext'
import { motion } from 'framer-motion'

export default function WishlistButton({ product, className = '' }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.button
      onClick={handleToggleWishlist}
      className={`p-2 rounded-full transition-all duration-200 ${className} ${
        isWishlisted
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isWishlisted ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <motion.div
        animate={{ scale: isWishlisted ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={20}
          fill={isWishlisted ? 'currentColor' : 'none'}
          className={isWishlisted ? 'text-red-400' : ''}
        />
      </motion.div>
    </motion.button>
  )
}
