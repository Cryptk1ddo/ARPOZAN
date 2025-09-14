import _ from 'lodash'

// Custom Lodash utilities for common operations
export const utils = {
  // Debounce function calls
  debounce: (func, wait = 300, options = {}) => {
    return _.debounce(func, wait, options)
  },

  // Throttle function calls
  throttle: (func, wait = 300, options = {}) => {
    return _.throttle(func, wait, options)
  },

  // Deep clone objects
  deepClone: (obj) => {
    return _.cloneDeep(obj)
  },

  // Safe get for nested object properties
  safeGet: (obj, path, defaultValue = undefined) => {
    return _.get(obj, path, defaultValue)
  },

  // Check if value is empty (null, undefined, empty string, empty array, empty object)
  isEmpty: (value) => {
    return _.isEmpty(value) || (_.isString(value) && _.trim(value) === '')
  },

  // Check if value is a number
  isNumber: (value) => {
    return _.isNumber(value) && !_.isNaN(value)
  },

  // Format currency
  formatCurrency: (amount, currency = '₽', locale = 'ru-RU') => {
    if (_.isNil(amount) || !_.isNumber(amount)) return '0 ₽'
    return new Intl.NumberFormat(locale).format(amount) + ' ' + currency
  },

  // Format number with thousand separators
  formatNumber: (num, locale = 'ru-RU') => {
    if (_.isNil(num) || !_.isNumber(num)) return '0'
    return new Intl.NumberFormat(locale).format(num)
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!_.isString(str)) return ''
    return _.capitalize(str)
  },

  // Convert to camelCase
  camelCase: (str) => {
    if (!_.isString(str)) return ''
    return _.camelCase(str)
  },

  // Convert to kebab-case
  kebabCase: (str) => {
    if (!_.isString(str)) return ''
    return _.kebabCase(str)
  },

  // Truncate text
  truncate: (str, length = 100, suffix = '...') => {
    if (!_.isString(str)) return ''
    if (str.length <= length) return str
    return _.truncate(str, { length, omission: suffix })
  },

  // Generate random ID
  generateId: (length = 8) => {
    return _.times(length, () => _.random(35).toString(36)).join('')
  },

  // Group array by property
  groupBy: (array, property) => {
    return _.groupBy(array, property)
  },

  // Sort array by property
  sortBy: (array, property, order = 'asc') => {
    const sorted = _.sortBy(array, property)
    return order === 'desc' ? _.reverse(sorted) : sorted
  },

  // Filter array by multiple conditions
  filterBy: (array, conditions) => {
    return _.filter(array, conditions)
  },

  // Find item in array
  findBy: (array, property, value) => {
    return _.find(array, [property, value])
  },

  // Remove duplicates from array
  unique: (array, property = null) => {
    if (property) {
      return _.uniqBy(array, property)
    }
    return _.uniq(array)
  },

  // Shuffle array
  shuffle: (array) => {
    return _.shuffle(array)
  },

  // Pick specific properties from object
  pickProps: (obj, props) => {
    return _.pick(obj, props)
  },

  // Omit specific properties from object
  omitProps: (obj, props) => {
    return _.omit(obj, props)
  },

  // Merge objects deeply
  mergeDeep: (target, source) => {
    return _.merge(target, source)
  },

  // Check if arrays are equal
  arraysEqual: (arr1, arr2) => {
    return _.isEqual(arr1, arr2)
  },

  // Check if objects are equal
  objectsEqual: (obj1, obj2) => {
    return _.isEqual(obj1, obj2)
  },

  // Get random item from array
  randomItem: (array) => {
    return _.sample(array)
  },

  // Get random items from array
  randomItems: (array, count = 1) => {
    return _.sampleSize(array, count)
  },

  // Chunk array into smaller arrays
  chunk: (array, size = 1) => {
    return _.chunk(array, size)
  },

  // Flatten nested arrays
  flatten: (array, depth = 1) => {
    return _.flattenDepth(array, depth)
  },

  // Create range of numbers
  range: (start, end, step = 1) => {
    return _.range(start, end, step)
  },

  // Delay execution
  delay: (func, wait = 1000) => {
    return _.delay(func, wait)
  },

  // Memoize function results
  memoize: (func, resolver = null) => {
    return _.memoize(func, resolver)
  },

  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return _.isString(email) && emailRegex.test(email)
  },

  // Validate phone number (Russian format)
  isValidPhone: (phone) => {
    const phoneRegex =
      /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
    return _.isString(phone) && phoneRegex.test(phone.replace(/\s/g, ''))
  },

  // Format phone number
  formatPhone: (phone) => {
    if (!_.isString(phone)) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
    }
    return phone
  },

  // Calculate percentage
  calculatePercentage: (value, total, decimals = 1) => {
    if (!_.isNumber(value) || !_.isNumber(total) || total === 0) return 0
    return _.round((value / total) * 100, decimals)
  },

  // Calculate discount
  calculateDiscount: (originalPrice, discountPrice) => {
    if (!_.isNumber(originalPrice) || !_.isNumber(discountPrice)) return 0
    if (originalPrice <= 0) return 0
    return _.round(((originalPrice - discountPrice) / originalPrice) * 100, 1)
  },

  // Local storage helpers
  storage: {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (error) {
        console.error('Error saving to localStorage:', error)
        return false
      }
    },

    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        return defaultValue
      }
    },

    remove: (key) => {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error('Error removing from localStorage:', error)
        return false
      }
    },

    clear: () => {
      try {
        localStorage.clear()
        return true
      } catch (error) {
        console.error('Error clearing localStorage:', error)
        return false
      }
    },
  },
}

// Export lodash as default
export default _

// Export individual functions for tree-shaking
export {
  debounce,
  throttle,
  cloneDeep,
  get,
  isEmpty,
  capitalize,
  camelCase,
  kebabCase,
  truncate,
  groupBy,
  sortBy,
  filter,
  find,
  uniq,
  uniqBy,
  shuffle,
  pick,
  omit,
  merge,
  isEqual,
  sample,
  sampleSize,
  chunk,
  flatten,
  range,
  delay,
  memoize,
} from 'lodash'
