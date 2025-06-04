export interface ResilienceContext {
  wasFallback: boolean;
  delayTime?: number;
  retryCount?: number;
  apiStress: 'low' | 'medium' | 'high';
  model?: string;
}

export interface ApiStressMetrics {
  recentFallbacks: number;
  avgResponseTime: number;
  errorRate: number;
  queueLength: number;
}

export class UserFeedbackManager {
  
  /**
   * Generate appropriate user feedback message based on resilience context
   */
  generateResilienceMessage(context: ResilienceContext): string | null {
    // No message needed for normal operations
    if (!context.wasFallback && 
        (!context.delayTime || context.delayTime < 3000) && 
        context.apiStress === 'low' &&
        (!context.retryCount || context.retryCount === 0)) {
      return null;
    }

    const messages: string[] = [];

    // Fallback model notification
    if (context.wasFallback) {
      const modelName = context.model === 'gemini-1.5-flash' ? 'Gemini 1.5 Flash' : 'alternate model';
      messages.push(`*Using ${modelName} due to high demand - response quality maintained.*`);
    }

    // Retry notification
    if (context.retryCount && context.retryCount > 0) {
      messages.push(`*Request succeeded after ${context.retryCount} ${context.retryCount === 1 ? 'retry' : 'retries'}.*`);
    }

    // Rate limiting notification
    if (context.delayTime && context.delayTime > 3000) {
      const delaySeconds = Math.round(context.delayTime / 1000);
      messages.push(`*Brief processing delay due to system optimization (${delaySeconds}s).*`);
    }

    // High stress period guidance
    if (context.apiStress === 'high') {
      messages.push(`*💡 During peak usage, consider spacing requests by 3-5 seconds for optimal performance.*`);
    } else if (context.apiStress === 'medium') {
      messages.push(`*ℹ️ System experiencing moderate load - responses may take slightly longer.*`);
    }

    return messages.length > 0 ? messages.join('\n\n') : null;
  }

  /**
   * Wrap response with feedback message while maintaining conversation flow
   */
  wrapResponseWithFeedback(originalResponse: string, feedbackMessage: string | null): string {
    if (!feedbackMessage) {
      return originalResponse;
    }

    // Add feedback at the end with clear separation
    return `${originalResponse}\n\n---\n\n${feedbackMessage}`;
  }

  /**
   * Detect API stress level based on system metrics
   */
  detectApiStressLevel(metrics: ApiStressMetrics): 'low' | 'medium' | 'high' {
    // High stress indicators
    if (metrics.recentFallbacks > 5 || 
        metrics.errorRate > 0.15 || 
        metrics.queueLength > 10 ||
        metrics.avgResponseTime > 15000) {
      return 'high';
    }
    
    // Medium stress indicators
    if (metrics.recentFallbacks > 2 || 
        metrics.errorRate > 0.05 || 
        metrics.queueLength > 3 ||
        metrics.avgResponseTime > 10000) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Generate error guidance message for users
   */
  generateErrorGuidance(error: unknown): string {
    const errorType = this.categorizeError(error);
    
    switch (errorType) {
      case 'rate_limit':
        return `The system is experiencing high demand. Please wait 30-60 seconds before trying again. ` +
               `During peak hours, spacing requests by 3-5 seconds helps ensure optimal performance.`;
      
      case 'service_unavailable':
        return `The AI service is temporarily overloaded. This is usually brief - please try again in a moment. ` +
               `The system will automatically use backup models when available.`;
      
      case 'timeout':
        return `The request took longer than expected to process. This can happen with complex queries during high traffic. ` +
               `Try breaking complex requests into smaller parts or waiting a moment before retrying.`;
      
      case 'quota':
        return `API usage limits have been reached. The system will automatically reset limits shortly. ` +
               `Consider reducing request frequency if this happens frequently.`;
      
      default:
        return `A temporary service issue occurred. The system includes automatic recovery mechanisms, ` +
               `so trying again in a moment usually resolves the issue.`;
    }
  }

  /**
   * Generate status update for long delays
   */
  generateDelayStatusMessage(delayTime: number, reason: string): string {
    const seconds = Math.round(delayTime / 1000);
    
    if (seconds < 5) {
      return `*Processing your request...*`;
    } else if (seconds < 15) {
      return `*Taking a bit longer due to ${reason} (${seconds}s)*`;
    } else {
      return `*Extended processing time due to ${reason} (${seconds}s) - your request is still being handled*`;
    }
  }

  /**
   * Generate helpful tips based on usage patterns
   */
  generateOptimizationTips(context: {
    frequentRetries: boolean;
    highTokenUsage: boolean;
    rapidRequests: boolean;
  }): string | null {
    const tips: string[] = [];

    if (context.frequentRetries) {
      tips.push(`💡 **Tip**: If you're experiencing frequent delays, try breaking complex questions into smaller parts.`);
    }

    if (context.highTokenUsage) {
      tips.push(`💡 **Tip**: Large requests may take longer during peak hours. Consider asking more focused questions.`);
    }

    if (context.rapidRequests) {
      tips.push(`💡 **Tip**: Spacing your requests by 2-3 seconds can help avoid rate limiting and improve response times.`);
    }

    return tips.length > 0 ? tips.join('\n\n') : null;
  }

  /**
   * Check if user should receive performance guidance
   */
  shouldShowPerformanceGuidance(sessionHistory: {
    recentErrors: number;
    avgDelayTime: number;
    requestFrequency: number;
  }): boolean {
    return sessionHistory.recentErrors > 2 ||
           sessionHistory.avgDelayTime > 8000 ||
           sessionHistory.requestFrequency > 0.5; // More than 1 request per 2 seconds
  }

  /**
   * Categorize error for appropriate user guidance
   */
  private categorizeError(error: unknown): string {
    const errorObj = error as { status?: number; message?: string };
    if (errorObj.status === 429 || (errorObj.message?.includes('rate limit') ?? false)) {
      return 'rate_limit';
    }
    if (errorObj.status === 503 || (errorObj.message?.includes('overloaded') ?? false)) {
      return 'service_unavailable';
    }
    if (errorObj.message?.includes('timeout') ?? false) {
      return 'timeout';
    }
    if ((errorObj.message?.includes('quota') ?? false) || (errorObj.message?.includes('limit') ?? false)) {
      return 'quota';
    }
    return 'unknown';
  }

  /**
   * Generate system status summary for monitoring/debugging
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateSystemStatusSummary(metrics: ApiStressMetrics, context: ResilienceContext): string {
    const status = this.detectApiStressLevel(metrics);
    
    return `System Status: ${status.toUpperCase()} | ` +
           `Fallbacks: ${metrics.recentFallbacks} | ` +
           `Error Rate: ${(metrics.errorRate * 100).toFixed(1)}% | ` +
           `Avg Response: ${metrics.avgResponseTime}ms | ` +
           `Queue: ${metrics.queueLength}`;
  }
} 