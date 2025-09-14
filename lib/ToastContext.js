import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((msg, opts = { duration: 3000 }) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      opts.duration
    )
  }, [])
  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
