import { useEffect, useCallback } from 'react'

export function useKeyboardNavigation(items, onSelect, isActive = false) {
  const handleKeyDown = useCallback(
    (event) => {
      if (!isActive) return

      const { key } = event
      const currentIndex = items.findIndex((item) => item.isFocused)

      switch (key) {
        case 'ArrowDown': {
          event.preventDefault()
          const nextIndex =
            currentIndex < items.length - 1 ? currentIndex + 1 : 0
          onSelect(items[nextIndex])
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : items.length - 1
          onSelect(items[prevIndex])
          break
        }
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (currentIndex >= 0) {
            onSelect(items[currentIndex], true)
          }
          break
        case 'Escape':
          event.preventDefault()
          onSelect(null)
          break
      }
    },
    [items, onSelect, isActive]
  )

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isActive])

  return handleKeyDown
}

export function useFocusTrap(containerRef, isActive = false) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus first element when trap activates
    if (firstElement) {
      firstElement.focus()
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [containerRef, isActive])
}

export function useAnnouncer() {
  const announce = useCallback((message, priority = 'polite') => {
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

  return announce
}

export const a11yProps = {
  button: (ariaLabel, isDisabled = false) => ({
    'aria-label': ariaLabel,
    'aria-disabled': isDisabled,
    disabled: isDisabled,
    tabIndex: isDisabled ? -1 : 0,
  }),

  link: (ariaLabel) => ({
    'aria-label': ariaLabel,
  }),

  input: (ariaLabel, ariaDescribedBy, isRequired = false) => ({
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-required': isRequired,
    required: isRequired,
  }),

  modal: (title, isOpen) => ({
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': title,
    'aria-hidden': !isOpen,
  }),

  listbox: (ariaLabel, expanded = false) => ({
    role: 'listbox',
    'aria-label': ariaLabel,
    'aria-expanded': expanded,
  }),

  option: (isSelected = false) => ({
    role: 'option',
    'aria-selected': isSelected,
  }),
}
