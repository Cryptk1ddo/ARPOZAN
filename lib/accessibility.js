import React, { useEffect, useCallback } from 'react'

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event, handlers) => {
    const {
      onEnter,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onTab,
    } = handlers

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault()
          onEnter(event)
        }
        break
      case 'Escape':
        if (onEscape) {
          event.preventDefault()
          onEscape(event)
        }
        break
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault()
          onArrowUp(event)
        }
        break
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault()
          onArrowDown(event)
        }
        break
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault()
          onArrowLeft(event)
        }
        break
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault()
          onArrowRight(event)
        }
        break
      case 'Tab':
        if (onTab) {
          onTab(event)
        }
        break
    }
  }, [])

  return { handleKeyDown }
}

export function useFocusTrap(containerRef, isActive = true) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Find and click the close button, or trigger close handler
        const closeButton = container.querySelector(
          '[data-close], .close-button, [aria-label="Close"]'
        )
        if (closeButton) {
          closeButton.click()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    container.addEventListener('keydown', handleEscape)

    // Focus first element when trap activates
    if (firstElement) {
      firstElement.focus()
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      container.removeEventListener('keydown', handleEscape)
    }
  }, [containerRef, isActive])
}

export function useAnnouncer() {
  const announce = useCallback((message, priority = 'polite') => {
    if (typeof window === 'undefined') return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'

    document.body.appendChild(announcement)
    announcement.textContent = message

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return { announce }
}

export function useReducedMotion() {
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const [reducedMotion, setReducedMotion] = React.useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReducedMotion(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [prefersReducedMotion])

  return reducedMotion
}

// Utility function to generate unique IDs for accessibility
let idCounter = 0
export function useId(prefix = 'id') {
  const [id] = React.useState(() => `${prefix}-${++idCounter}`)
  return id
}

// Skip link component for better navigation
export function SkipLink({ href, children }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-500 text-black px-4 py-2 rounded-md font-semibold z-50"
    >
      {children}
    </a>
  )
}
