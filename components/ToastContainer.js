import { useToast } from '../lib/ToastContext'

export default function ToastContainer() {
  const { toasts } = useToast()
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-0 bottom-6 flex items-end justify-center pointer-events-none z-50"
    >
      <div className="space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto bg-black/80 text-white px-4 py-2 rounded shadow toast-item"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
