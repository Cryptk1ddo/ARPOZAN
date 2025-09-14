import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Animation utilities for common effects
export const animations = {
  // Fade in animation
  fadeIn: (element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
    )
  },

  // Slide in from left
  slideInLeft: (element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
    )
  },

  // Slide in from right
  slideInRight: (element, duration = 1, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration, delay, ease: 'power2.out' }
    )
  },

  // Scale animation
  scaleIn: (element, duration = 0.8, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' }
    )
  },

  // Stagger animation for multiple elements
  staggerFadeIn: (elements, duration = 0.8, stagger = 0.1) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
    )
  },

  // Hover animation
  hoverScale: (element, scale = 1.05) => {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, { scale, duration: 0.3, ease: 'power2.out' })

    element.addEventListener('mouseenter', () => tl.play())
    element.addEventListener('mouseleave', () => tl.reverse())

    return tl
  },

  // Scroll-triggered animations
  scrollReveal: (element, triggerElement = element) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  },

  // Counter animation
  counter: (element, targetValue, duration = 2) => {
    const startValue = { value: 0 }
    return gsap.to(startValue, {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(startValue.value)
      },
    })
  },

  // Text reveal animation
  textReveal: (element, duration = 1.5) => {
    const text = element.textContent
    element.textContent = ''

    const tl = gsap.timeline()
    tl.to(element, {
      duration,
      text: text,
      ease: 'none',
    })

    return tl
  },

  // Parallax effect
  parallax: (element, speed = 0.5) => {
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  },

  // Magnetic effect for buttons
  magneticEffect: (element, strength = 0.3) => {
    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  },
}

// Page transition utilities
export const pageTransitions = {
  // Fade out current page
  fadeOut: (element, callback) => {
    return gsap.to(element, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: callback,
    })
  },

  // Slide transition
  slideTransition: (element, direction = 'left', callback) => {
    const xValue = direction === 'left' ? -100 : 100
    return gsap.to(element, {
      x: xValue,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: callback,
    })
  },
}

// Loading animation
export const loadingAnimation = {
  dots: (container) => {
    const dots = container.querySelectorAll('.dot')
    return gsap
      .timeline({ repeat: -1 })
      .to(dots[0], { scale: 1.5, duration: 0.3 })
      .to(dots[1], { scale: 1.5, duration: 0.3 }, '-=0.1')
      .to(dots[2], { scale: 1.5, duration: 0.3 }, '-=0.1')
      .to(dots, { scale: 1, duration: 0.3 }, '+=0.2')
  },

  spinner: (element) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1,
    })
  },
}

export default gsap
