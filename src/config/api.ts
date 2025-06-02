export const API_CONFIG = {
  BASE_URL: '', // Use relative URLs - Vercel proxies to backend via vercel.json
  ENDPOINTS: {
    CHAT: '/api/chat/semantic',
    CHAT_STATUS: '/api/chat/semantic/status',
    CHAT_METRICS: '/api/chat/semantic/session',
    HEALTH: '/health'
  },
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
}; 