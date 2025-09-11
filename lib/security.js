// Input validation utilities
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  // Russian phone number validation
  const phoneRegex = /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return phoneRegex.test(phone);
}

export function validateName(name) {
  // Allow Cyrillic, Latin letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
}

export function validateAddress(address) {
  return address && address.length >= 10 && address.length <= 200;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}

export function validateCardNumber(cardNumber) {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s\-]/g, '');

  // Check if it's all digits and length is valid
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function validateExpiryDate(month, year) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expMonth < 1 || expMonth > 12) return false;
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;

  return true;
}

export function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// CSRF protection
export function generateCSRFToken() {
  if (typeof window === 'undefined') return null;

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessionStorage.setItem('csrf_token', token);
  return token;
}

export function getCSRFToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('csrf_token');
}

export function validateCSRFToken(token) {
  const storedToken = getCSRFToken();
  return storedToken && storedToken === token;
}

// Rate limiting helper
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingTime() {
    if (this.requests.length === 0) return 0;

    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest);

    return Math.max(0, timeUntilReset);
  }
}

// Content Security Policy helper
export function generateCSP() {
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.googletagmanager.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  };
}

// XSS prevention
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// SQL injection prevention (for client-side validation)
export function isSafeSQLInput(input) {
  const dangerousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(-{2}|\/\*|\*\/)/,
    /('|(\\x27)|(\\x2D))/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}
