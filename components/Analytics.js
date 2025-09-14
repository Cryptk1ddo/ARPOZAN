import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

export default function Analytics() {
  const router = useRouter()

  const getVisitorId = useCallback(() => {
    let visitorId = localStorage.getItem('arpofan-visitor-id')
    if (!visitorId) {
      visitorId =
        'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('arpofan-visitor-id', visitorId)
    }
    return visitorId
  }, [])

  const trackPageView = useCallback(
    (url) => {
      // Store page view data in localStorage for demo purposes
      const analyticsData = JSON.parse(
        localStorage.getItem('arpofan-analytics') || '{}'
      )
      const today = new Date().toISOString().split('T')[0]

      if (!analyticsData[today]) {
        analyticsData[today] = { pageViews: 0, uniqueVisitors: new Set() }
      }

      analyticsData[today].pageViews += 1
      analyticsData[today].uniqueVisitors.add(getVisitorId())

      localStorage.setItem('arpofan-analytics', JSON.stringify(analyticsData))

      console.log(`Page view tracked: ${url}`)
    },
    [getVisitorId]
  )

  useEffect(() => {
    // Track page views
    const handleRouteChange = (url) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        })
      }

      // Custom analytics tracking
      trackPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    // Track initial page load
    trackPageView(router.pathname)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, trackPageView])

  // Track user interactions
  useEffect(() => {
    const trackInteraction = (eventType, element, data = {}) => {
      const interactionData = {
        type: eventType,
        element: element,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        ...data,
      }

      // Store interaction data
      const interactions = JSON.parse(
        localStorage.getItem('arpofan-interactions') || '[]'
      )
      interactions.push(interactionData)

      // Keep only last 100 interactions
      if (interactions.length > 100) {
        interactions.splice(0, interactions.length - 100)
      }

      localStorage.setItem('arpofan-interactions', JSON.stringify(interactions))
    }

    // Track button clicks
    const handleButtonClick = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) {
        const element = e.target.closest('button') || e.target.closest('a')
        const text =
          element.textContent?.trim() ||
          element.getAttribute('aria-label') ||
          'Unknown'
        trackInteraction('click', text, {
          tagName: element.tagName.toLowerCase(),
          href: element.getAttribute('href'),
        })
      }
    }

    // Track form submissions
    const handleFormSubmit = (e) => {
      trackInteraction('form_submit', e.target.name || 'unknown_form')
    }

    document.addEventListener('click', handleButtonClick)
    document.addEventListener('submit', handleFormSubmit)

    return () => {
      document.removeEventListener('click', handleButtonClick)
      document.removeEventListener('submit', handleFormSubmit)
    }
  }, [])

  return null // This component doesn't render anything
}

// Hook for tracking custom events
export function useAnalytics() {
  const trackEvent = (eventName, parameters = {}) => {
    const eventData = {
      name: eventName,
      parameters,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
    }

    // Store custom event data
    const events = JSON.parse(
      localStorage.getItem('arpofan-custom-events') || '[]'
    )
    events.push(eventData)

    // Keep only last 50 custom events
    if (events.length > 50) {
      events.splice(0, events.length - 50)
    }

    localStorage.setItem('arpofan-custom-events', JSON.stringify(events))

    console.log(`Custom event tracked: ${eventName}`, parameters)
  }

  return { trackEvent }
}
