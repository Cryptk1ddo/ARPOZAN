import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('arpofan-wishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arpofan-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (!existing) {
        return [...prev, product]
      }
      return prev
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const getWishlistCount = () => {
    return wishlist.length
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
