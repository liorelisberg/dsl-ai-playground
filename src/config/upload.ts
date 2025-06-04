/**
 * Centralized Upload Configuration
 * Aligns frontend limits with backend capabilities (256KB)
 * Eliminates hardcoded limits scattered across components
 */

export const UPLOAD_CONFIG = {
  json: {
    // Align with backend: apps/server/src/config/environment.ts maxJsonBytes (262144)
    maxSizeBytes: 256 * 1024, // 256KB to match backend capability
    maxSizeDisplay: '256KB',
    allowedTypes: ['application/json'],
    allowedExtensions: ['.json'],
    
    // Error messages
    errorMessages: {
      sizeExceeded: 'File size exceeds 256KB limit',
      invalidType: 'Only JSON files are allowed',
      invalidFormat: 'Invalid JSON format',
      uploadFailed: 'Upload failed. Please try again.'
    },
    
    // Help text
    helpText: {
      short: 'Max 256KB • .json files only',
      detailed: 'Maximum file size: 256KB • JSON format only',
      dragDrop: 'Drag & drop JSON files here or click to browse'
    },
    
    // Future tiered limits for potential expansion
    limits: {
      schema: 10 * 1024,      // 10KB for JSON schemas
      standard: 256 * 1024,   // 256KB for data files (current)
      enterprise: 2048 * 1024 // 2MB for future enterprise features
    }
  },
  
  // Token budget considerations for JSON processing
  tokenEstimates: {
    small: { size: '1KB', tokens: 250 },
    medium: { size: '50KB', tokens: 4000 },
    large: { size: '256KB', tokens: 15000 }
  }
};

// Utility functions for upload validation
export const validateJsonFile = (file: File) => {
  const errors: string[] = [];
  
  // Size validation
  if (file.size > UPLOAD_CONFIG.json.maxSizeBytes) {
    errors.push(UPLOAD_CONFIG.json.errorMessages.sizeExceeded);
  }
  
  // Type validation
  if (!UPLOAD_CONFIG.json.allowedTypes.includes(file.type) && 
      !UPLOAD_CONFIG.json.allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
    errors.push(UPLOAD_CONFIG.json.errorMessages.invalidType);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Get appropriate limit based on file content (future expansion)
export const getJsonLimit = (content?: string): number => {
  // For now, return standard limit
  // Future: Could analyze content to determine if it's a schema vs data
  return UPLOAD_CONFIG.json.limits.standard;
}; 