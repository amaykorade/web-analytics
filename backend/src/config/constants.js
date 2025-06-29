// Server configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  HOST: '0.0.0.0'
};

// CORS configuration
export const CORS_CONFIG = {
  CACHE_DURATION: 10000, // 10 seconds
  STATIC_ALLOWED_ORIGINS: [
    'https://www.webmeter.in',
    'https://webmeter.in',
    'https://backend.webmeter.in',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ]
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

// WebSocket configuration
export const WEBSOCKET_CONFIG = {
  METHODS: ['GET', 'POST'],
  ROOM_PREFIX: {
    DASHBOARD: 'dashboard-'
  }
};

// Real-time data configuration
export const REALTIME_CONFIG = {
  MAX_NAVIGATION_PATHS: 10,
  MAX_PAGE_POPULARITY: 10,
  MAX_SECONDARY_PAGES: 6,
  MAX_MAIN_FLOW_PAGES: 4
};

// Session configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: true
}; 