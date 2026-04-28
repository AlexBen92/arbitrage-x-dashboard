// Polyfills for tests
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// TextEncoder/TextDecoder polyfill
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// IntersectionObserver mock
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mobile user agent mocks
const mockUserAgents = {
  iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  Android: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  iPad: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  Desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
}

Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: mockUserAgents.Desktop,
})

// Helper pour simuler différents appareils
global.setMobileUserAgent = (type = 'iPhone') => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    value: mockUserAgents[type] || mockUserAgents.Desktop,
  })
}

// Rainbow wallet mock pour les tests mobiles
global.mockRainbowWallet = {
  isRainbow: false,
  connect: jest.fn(() => Promise.resolve({ address: '0x1234567890123456789012345678901234567890' })),
  disconnect: jest.fn(),
  signTransaction: jest.fn(),
  signPersonalMessage: jest.fn(),
  signTypedData: jest.fn(),
}

// Mock window.ethereum pour desktop
global.window = global.window || {}
global.window.ethereum = {
  isMetaMask: true,
  isRainbow: false,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  chainId: '0x11155111', // Sepolia
}

// Mock pour les tests Rainbow mobile
global.enableRainbowMobileMock = () => {
  global.setMobileUserAgent('iPhone')
  global.mockRainbowWallet.isRainbow = true
  global.window.ethereum = {
    isMetaMask: false,
    isRainbow: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
    chainId: '0x11155111',
  }
}

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: key => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()
global.sessionStorage = sessionStorageMock

// Mock fetch pour les appels API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Mock pour les tests d'URL deep link Rainbow
global.mockRainbowDeepLink = (uri) => {
  global.window.location.href = `https://rnbwapp.com/link?uri=${encodeURIComponent(uri)}`
}
