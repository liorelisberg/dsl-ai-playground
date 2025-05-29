import { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiHealthy, setIsApiHealthy] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const healthy = await chatService.healthCheck();
      setIsApiHealthy(healthy);
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isApiHealthy };
}; 