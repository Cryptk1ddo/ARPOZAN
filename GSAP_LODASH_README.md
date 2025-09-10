# GSAP & Lodash Integration Guide

This project now includes GSAP (GreenSock Animation Platform) and Lodash for enhanced animations and utility functions.

## 🚀 GSAP Integration

### Installation
GSAP and Lodash are already installed via npm:
```bash
npm install gsap lodash
```

### GSAP Utilities (`lib/gsapUtils.js`)

The project includes a comprehensive GSAP utilities file with pre-built animations:

#### Basic Animations
```javascript
import { animations } from '../lib/gsapUtils'

// Fade in animation
animations.fadeIn(element, duration, delay)

// Slide animations
animations.slideInLeft(element, duration, delay)
animations.slideInRight(element, duration, delay)

// Scale animation
animations.scaleIn(element, duration, delay)

// Stagger animations for multiple elements
animations.staggerFadeIn(elements, duration, stagger)
```

#### Interactive Effects
```javascript
// Hover scale effect
animations.hoverScale(element, scale)

// Magnetic effect for buttons
animations.magneticEffect(element, strength)

// Scroll-triggered animations
animations.scrollReveal(element, triggerElement)
```

#### Advanced Features
```javascript
// Counter animation
animations.counter(element, targetValue, duration)

// Text reveal animation
animations.textReveal(element, duration)

// Parallax effect
animations.parallax(element, speed)
```

### Usage Example
```javascript
import { useEffect, useRef } from 'react'
import { animations } from '../lib/gsapUtils'

export default function MyComponent() {
  const elementRef = useRef(null)

  useEffect(() => {
    if (elementRef.current) {
      animations.fadeIn(elementRef.current, 1, 0.3)
    }
  }, [])

  return <div ref={elementRef}>Animated Element</div>
}
```

## 🔧 Lodash Integration

### Lodash Utilities (`lib/lodashUtils.js`)

The project includes a comprehensive Lodash utilities file with common operations:

#### Array Operations
```javascript
import { utils } from '../lib/lodashUtils'

// Remove duplicates
const unique = utils.unique([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]

// Shuffle array
const shuffled = utils.shuffle([1, 2, 3, 4, 5])

// Chunk array
const chunks = utils.chunk([1, 2, 3, 4, 5, 6], 2) // [[1, 2], [3, 4], [5, 6]]

// Group by property
const grouped = utils.groupBy(users, 'department')
```

#### String Operations
```javascript
// Capitalize
const capitalized = utils.capitalize('hello world') // 'Hello world'

// Camel case
const camelCase = utils.camelCase('hello world') // 'helloWorld'

// Truncate
const truncated = utils.truncate('Very long text...', 20)
```

#### Object Operations
```javascript
// Safe get for nested properties
const value = utils.safeGet(obj, 'user.profile.name', 'Default')

// Pick specific properties
const picked = utils.pickProps(obj, ['name', 'email'])

// Omit properties
const omitted = utils.omitProps(obj, ['password', 'secret'])
```

#### Utility Functions
```javascript
// Debounce
const debouncedFunc = utils.debounce(myFunction, 300)

// Throttle
const throttledFunc = utils.throttle(myFunction, 300)

// Generate random ID
const id = utils.generateId(12)

// Format currency
const price = utils.formatCurrency(1990, '₽') // '1 990 ₽'

// Validate email
const isValid = utils.isValidEmail('user@example.com')
```

#### Local Storage Helpers
```javascript
// Save to localStorage
utils.storage.set('user', { name: 'John', age: 30 })

// Get from localStorage
const user = utils.storage.get('user', { name: 'Guest' })

// Remove from localStorage
utils.storage.remove('user')

// Clear all localStorage
utils.storage.clear()
```

## 📱 Demo Page

Visit `/demo` to see GSAP and Lodash in action with:
- Animated counters
- Staggered card animations
- Scroll-triggered reveals
- Interactive hover effects
- Magnetic button effects
- Lodash utility demonstrations

## 🎯 Integration Examples

### Enhanced Cart Functionality
```javascript
const handleAddToCart = () => {
  const product = {
    id: utils.generateId(),
    name: 'Product Name',
    price: 1990,
    quantity: quantity
  }

  // Validate data using Lodash
  if (utils.isEmpty(product.name)) {
    push('Error: Invalid product data')
    return
  }

  addToCart(product)
  push(`✅ ${product.name} added to cart!`)

  // Animate button with GSAP
  const button = document.querySelector('.add-to-cart-btn')
  if (button) {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    })
  }
}
```

### Form Validation with Lodash
```javascript
const validateForm = (formData) => {
  const errors = []

  if (utils.isEmpty(formData.name)) {
    errors.push('Name is required')
  }

  if (!utils.isValidEmail(formData.email)) {
    errors.push('Invalid email format')
  }

  if (!utils.isValidPhone(formData.phone)) {
    errors.push('Invalid phone number')
  }

  return errors
}
```

### Animated List Rendering
```javascript
const AnimatedList = ({ items }) => {
  const itemRefs = useRef([])

  useEffect(() => {
    // Stagger animation for list items
    if (itemRefs.current.length > 0) {
      gsap.fromTo(itemRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [items])

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={el => itemRefs.current[index] = el}
          className="list-item"
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

## 🚀 Performance Tips

1. **Tree Shaking**: Import only the Lodash functions you need:
   ```javascript
   import { debounce, throttle, pick } from 'lodash'
   ```

2. **GSAP Plugins**: Only register plugins you use:
   ```javascript
   import { gsap } from 'gsap'
   import { ScrollTrigger } from 'gsap/ScrollTrigger'
   gsap.registerPlugin(ScrollTrigger)
   ```

3. **Animation Cleanup**: Always clean up GSAP animations in useEffect cleanup:
   ```javascript
   useEffect(() => {
     const tl = gsap.timeline()
     // ... animation code ...

     return () => {
       tl.kill() // Clean up animation
     }
   }, [])
   ```

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [Lodash Documentation](https://lodash.com/docs/)
- [GSAP Learning Center](https://greensock.com/learning/)
- [Lodash FP Guide](https://github.com/lodash/lodash/wiki/FP-Guide)

## 🎮 Try It Out

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/demo` to see the demo
3. Visit `http://localhost:3000/maca` to see GSAP animations in action
4. Check the browser console for Lodash utility examples
