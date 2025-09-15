import '../styles/globals.css'
import '../styles/admin.css'
import { CartProvider } from '../lib/CartContext'
import { ToastProvider } from '../lib/ToastContext'
import { WishlistProvider } from '../lib/WishlistContext'
import { AuthProvider } from '../lib/AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
