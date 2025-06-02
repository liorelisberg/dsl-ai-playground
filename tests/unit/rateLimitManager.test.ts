import { IntelligentRateLimitManager, RateLimitContext } from '../../apps/server/src/services/rateLimitManager';

describe('IntelligentRateLimitManager', () => {
  let rateLimitManager: IntelligentRateLimitManager;

  beforeEach(() => {
    jest.useFakeTimers();
    rateLimitManager = new IntelligentRateLimitManager();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rate Limiting', () => {
    test('should create rate limit manager instance', () => {
      expect(rateLimitManager).toBeDefined();
    });

    test('should execute operation with rate limiting', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');
      const context: RateLimitContext = {
        tokens: 1000,
        priority: 'normal'
      };

      const result = await rateLimitManager.executeWithRateLimit(
        mockOperation,
        'test-session',
        context
      );

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    test('should handle high token requests', async () => {
      const mockOperation = jest.fn().mockResolvedValue('high-token-success');
      const context: RateLimitContext = {
        tokens: 4000, // High token count
        priority: 'high'
      };

      const result = await rateLimitManager.executeWithRateLimit(
        mockOperation,
        'test-session',
        context
      );

      expect(result).toBe('high-token-success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    test('should handle operation failures', async () => {
      const mockOperation = jest.fn()
        .mockRejectedValue(new Error('Service unavailable'));

      const context: RateLimitContext = {
        tokens: 1000,
        priority: 'normal'
      };

      await expect(
        rateLimitManager.executeWithRateLimit(
          mockOperation,
          'test-session',
          context
        )
      ).rejects.toThrow('Service unavailable');

      expect(mockOperation).toHaveBeenCalled();
    });

    test('should provide statistics', () => {
      const stats = rateLimitManager.getStatistics();
      
      expect(stats).toHaveProperty('activeSessions');
      expect(stats).toHaveProperty('queueLength');
      expect(stats).toHaveProperty('recentErrors');
      expect(stats).toHaveProperty('avgSuccessRate');
      expect(typeof stats.activeSessions).toBe('number');
      expect(typeof stats.queueLength).toBe('number');
    });

    test('should handle concurrent requests', async () => {
      const mockOperation = jest.fn().mockResolvedValue('concurrent-success');
      const context: RateLimitContext = {
        tokens: 1000,
        priority: 'normal'
      };

      const promises = Array.from({ length: 3 }, (_, i) =>
        rateLimitManager.executeWithRateLimit(
          mockOperation,
          `session-${i}`,
          context
        )
      );

      const results = await Promise.all(promises);

      expect(results).toEqual(['concurrent-success', 'concurrent-success', 'concurrent-success']);
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    test('should handle cleanup', () => {
      expect(() => {
        rateLimitManager.cleanup();
      }).not.toThrow();
    });
  });
}); 