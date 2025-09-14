import { useEffect, useCallback } from 'react'

export function usePerformanceMonitor() {
  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.fetchStart

        console.log('Performance Metrics:', {
          'Page Load Time': `${loadTime}ms`,
          'DOM Content Loaded': `${domContentLoaded}ms`,
          'First Paint': getPaintTime('first-paint'),
          'First Contentful Paint': getPaintTime('first-contentful-paint'),
        })

        // You can send this data to analytics service
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'page_load_performance', {
            load_time: loadTime,
            dom_content_loaded: domContentLoaded,
          })
        }
      }
    }
  }, [])

  const getPaintTime = (name) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const paintEntries = performance.getEntriesByType('paint')
      const entry = paintEntries.find((entry) => entry.name === name)
      return entry ? `${entry.startTime}ms` : 'Not available'
    }
    return 'Not available'
  }

  const measureComponentRender = useCallback((componentName, startTime) => {
    const endTime = performance.now()
    const renderTime = endTime - startTime

    console.log(`${componentName} render time: ${renderTime}ms`)

    // Track slow renders
    if (renderTime > 16.67) {
      // More than one frame at 60fps
      console.warn(`${componentName} is rendering slowly: ${renderTime}ms`)
    }

    return renderTime
  }, [])

  useEffect(() => {
    // Measure page load on mount
    measurePageLoad()

    // Monitor for long tasks
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Long task > 50ms
            console.warn('Long task detected:', {
              duration: `${entry.duration}ms`,
              startTime: entry.startTime,
            })
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })

      return () => observer.disconnect()
    }
  }, [measurePageLoad])

  return { measureComponentRender, measurePageLoad }
}

export function useWebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Web Vitals tracking
      import('web-vitals')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log)
          getFID(console.log)
          getFCP(console.log)
          getLCP(console.log)
          getTTFB(console.log)
        })
        .catch((err) => {
          console.warn('Web Vitals not available:', err)
        })
    }
  }, [])
}

export function withPerformanceTracking(WrappedComponent, componentName) {
  return function PerformanceTrackedComponent(props) {
    const startTime = performance.now()

    useEffect(() => {
      const renderTime = performance.now() - startTime
      console.log(`${componentName} mounted in ${renderTime}ms`)
    })

    return <WrappedComponent {...props} />
  }
}
