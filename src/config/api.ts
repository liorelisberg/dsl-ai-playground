export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    CHAT: '/api/chat/semantic',
    CHAT_STATUS: '/api/chat/semantic/status',
    CHAT_METRICS: '/api/chat/semantic/session',
    HEALTH: '/health'
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
}; 