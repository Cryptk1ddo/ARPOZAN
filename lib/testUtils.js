import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock utilities for testing
export const mockCartContext = {
  cart: [],
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  getTotal: jest.fn(() => 0),
  getTotalItems: jest.fn(() => 0)
};

export const mockToastContext = {
  showToast: jest.fn(),
  hideToast: jest.fn()
};

export const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false
};

export const mockWishlistContext = {
  wishlist: [],
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  isInWishlist: jest.fn(() => false)
};

// Custom render function with providers
export function renderWithProviders(component, options = {}) {
  const {
    cart = mockCartContext,
    toast = mockToastContext,
    auth = mockAuthContext,
    wishlist = mockWishlistContext
  } = options;

  // For now, just render without providers since they may not be available in test environment
  return render(component, options);
}

// Test utilities
export const createMockProduct = (overrides = {}) => ({
  id: 'test-product-1',
  name: 'Test Product',
  price: 1000,
  img: '/test-image.jpg',
  description: 'Test description',
  quantity: 1,
  ...overrides
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

// Form testing helpers
export const fillForm = async (formData) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'));
    fireEvent.change(input, { target: { value } });
  }
};

export const submitForm = async (buttonText = /submit|send|save/i) => {
  const submitButton = screen.getByRole('button', { name: buttonText });
  fireEvent.click(submitButton);
};

// Async testing helpers
export const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

export const waitForError = (errorMessage) =>
  waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

// Mock API responses
export const mockApiResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data))
});

export const mockApiError = (message, status = 500) => ({
  ok: false,
  status,
  json: () => Promise.reject(new Error(message)),
  text: () => Promise.reject(new Error(message))
});

// Local storage mocks
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  return localStorageMock;
};

// Intersection Observer mock
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });

  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Performance API mock
export const mockPerformance = () => {
  const mockPerformance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => [])
  };

  Object.defineProperty(window, 'performance', {
    value: mockPerformance,
    writable: true
  });

  return mockPerformance;
};

// Custom matchers
export const toBeVisible = () => ({
  name: 'toBeVisible',
  fn: (element) => {
    const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
    return {
      pass: isVisible,
      message: () => `Expected element to be visible, but it ${isVisible ? 'is' : 'is not'}`
    };
  }
});

export const toHaveFocus = () => ({
  name: 'toHaveFocus',
  fn: (element) => {
    const hasFocus = document.activeElement === element;
    return {
      pass: hasFocus,
      message: () => `Expected element to have focus, but it ${hasFocus ? 'does' : 'does not'}`
    };
  }
});

// Accessibility testing helpers
export const checkAccessibility = async (container) => {
  const results = {
    imagesWithoutAlt: [],
    buttonsWithoutAriaLabel: [],
    inputsWithoutLabel: [],
    linksWithoutHref: []
  };

  // Check images
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      results.imagesWithoutAlt.push(img);
    }
  });

  // Check buttons
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      results.buttonsWithoutAriaLabel.push(button);
    }
  });

  // Check inputs
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = container.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      results.inputsWithoutLabel.push(input);
    }
  });

  // Check links
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('href')) {
      results.linksWithoutHref.push(link);
    }
  });

  return results;
};
