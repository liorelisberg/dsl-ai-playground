import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiHealthy, setIsApiHealthy] = useState(false); // Start as false for better UX
  const wasHealthyRef = useRef(false);
  const isApiHealthyRef = useRef(false); // Ref to track current API health status

  // Keep ref in sync with state
  useEffect(() => {
    isApiHealthyRef.current = isApiHealthy;
  }, [isApiHealthy]);

  useEffect(() => {
    let checkCount = 0;
    const maxFastChecks = 3;

    const checkConnection = async () => {
      try {
        const healthy = await chatService.healthCheck();
        setIsApiHealthy(healthy);
        
        // Show success notification when connection is restored
        if (healthy && !wasHealthyRef.current) {
          console.log('✅ AI service connected successfully');
        }
        
        wasHealthyRef.current = healthy;
        checkCount++;
      } catch (error) {
        console.warn('Health check failed:', error);
        setIsApiHealthy(false);
        wasHealthyRef.current = false;
      }
    };

    // Check immediately
    checkConnection();

    // Fast checks for the first few attempts (every 2 seconds)
    const fastInterval = setInterval(() => {
      if (checkCount < maxFastChecks && !isApiHealthyRef.current) {
        checkConnection();
      } else {
        clearInterval(fastInterval);
      }
    }, 2000);

    // Regular checks every 30 seconds
    const regularInterval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Immediately check API health when coming back online
      checkConnection();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(fastInterval);
      clearInterval(regularInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array - effect only runs once

  return { isOnline, isApiHealthy };
}; 