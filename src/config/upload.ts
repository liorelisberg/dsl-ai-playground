/**
 * Centralized Upload Configuration
 * JSON validation and compression utilities for Full and Compressed modes only
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
      invalidFormat: 'Invalid JSON format - please check syntax',
      uploadFailed: 'Upload failed. Please try again.',
      compressionFailed: 'Failed to compress JSON data'
    },
    
    // Help text
    helpText: {
      short: 'Max 256KB • .json files only',
      detailed: 'Maximum file size: 256KB • JSON format only',
      dragDrop: 'Drag & drop JSON files here or click to browse'
    },
    
    // Future tiered limits for potential expansion
    limits: {
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

// Enhanced JSON validation with comprehensive checks
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

  // Additional validations (will be enhanced in validateJsonContent)
  return {
    isValid: errors.length === 0,
    errors,
    warnings: [] as string[]
  };
};

// Comprehensive JSON content validation
export const validateJsonContent = async (content: string): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedJson?: unknown;
  metadata: {
    size: number;
    topLevelKeys: string[];
    depth: number;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedTokens: number;
  };
}> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let parsedJson: unknown;

  try {
    // Parse JSON
    parsedJson = JSON.parse(content);
  } catch {
    errors.push(UPLOAD_CONFIG.json.errorMessages.invalidFormat);
    return {
      isValid: false,
      errors,
      warnings,
      metadata: {
        size: content.length,
        topLevelKeys: [],
        depth: 0,
        complexity: 'simple',
        estimatedTokens: Math.ceil(content.length / 4)
      }
    };
  }

  // Analyze JSON structure
  const metadata = analyzeJsonStructure(parsedJson, content.length);

  // Validation checks
  if (metadata.depth > 10) {
    warnings.push('JSON has deep nesting (>10 levels) - may impact processing');
  }

  if (metadata.estimatedTokens > 15000) {
    warnings.push('Large JSON may exceed token limits in some contexts');
  }

  if (metadata.complexity === 'complex' && metadata.size > 100 * 1024) {
    warnings.push('Complex structure + large size may impact performance');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    parsedJson,
    metadata
  };
};

// Analyze JSON structure for metadata
const analyzeJsonStructure = (json: unknown, contentSize: number) => {
  const getDepth = (obj: unknown, currentDepth = 0): number => {
    if (typeof obj !== 'object' || obj === null) return currentDepth;
    
    if (Array.isArray(obj)) {
      return Math.max(...obj.map(item => getDepth(item, currentDepth + 1)));
    }
    
    const values = Object.values(obj as Record<string, unknown>);
    if (values.length === 0) return currentDepth + 1;
    
    return Math.max(...values.map(value => getDepth(value, currentDepth + 1)));
  };

  const getComplexity = (obj: unknown): 'simple' | 'moderate' | 'complex' => {
    const depth = getDepth(obj);
    const size = contentSize;
    
    if (depth <= 3 && size < 10 * 1024) return 'simple';
    if (depth <= 6 && size < 100 * 1024) return 'moderate';
    return 'complex';
  };

  const topLevelKeys = typeof json === 'object' && json !== null && !Array.isArray(json)
    ? Object.keys(json as Record<string, unknown>)
    : [];

  return {
    size: contentSize,
    topLevelKeys,
    depth: getDepth(json),
    complexity: getComplexity(json),
    estimatedTokens: Math.ceil(contentSize / 4) // Rough estimate: 4 chars = 1 token
  };
};

// Standard JSON compression with structured optimization
export const compressJson = (json: unknown, mode: 'minimal' | 'structured' = 'structured'): {
  compressed: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  maintainsStructure: boolean;
} => {
  const original = JSON.stringify(json, null, 2);
  const originalSize = original.length;
  
  let compressed: string;
  
  if (mode === 'structured') {
    // Structured compression: Remove whitespace, optimize structure while preserving readability
    compressed = JSON.stringify(json, null, 0);
  } else {
    // Minimal compression: Just remove all whitespace
    compressed = JSON.stringify(json);
  }
  
  const compressedSize = compressed.length;
  const compressionRatio = originalSize > 0 ? compressedSize / originalSize : 1;

  return {
    compressed,
    originalSize,
    compressedSize,
    compressionRatio,
    maintainsStructure: true
  };
};

// Enhanced attachment registry for message-specific validation
const attachmentRegistry = new Map<string, {
  filename: string;
  messageId: string;
  timestamp: number;
  isConsumed: boolean;
}>();

// Validate attachment for current message only with enhanced checks
export const validateMessageAttachment = (
  attachmentId: string, 
  currentMessageId: string
): { isValid: boolean; error?: string } => {
  // Basic validation
  if (!attachmentId || !currentMessageId) {
    return { isValid: false, error: 'Missing attachment or message ID' };
  }

  // Check if attachment exists in registry
  const attachment = attachmentRegistry.get(attachmentId);
  if (!attachment) {
    // For backwards compatibility, register if not found
    attachmentRegistry.set(attachmentId, {
      filename: attachmentId,
      messageId: currentMessageId,
      timestamp: Date.now(),
      isConsumed: false
    });
    return { isValid: true };
  }

  // Check if attachment is already consumed
  if (attachment.isConsumed) {
    return { 
      isValid: false, 
      error: `JSON file "${attachmentId}" has already been used in a previous message` 
    };
  }

  // Check if attachment belongs to current message
  if (attachment.messageId !== currentMessageId) {
    return { 
      isValid: false, 
      error: `JSON file "${attachmentId}" is attached to a different message` 
    };
  }

  // Check if attachment is too old (5 minutes max)
  const maxAge = 5 * 60 * 1000; // 5 minutes
  if (Date.now() - attachment.timestamp > maxAge) {
    return { 
      isValid: false, 
      error: `JSON file "${attachmentId}" attachment has expired. Please re-upload.` 
    };
  }

  return { isValid: true };
};

// Register new attachment
export const registerAttachment = (
  filename: string, 
  messageId: string
): void => {
  attachmentRegistry.set(filename, {
    filename,
    messageId,
    timestamp: Date.now(),
    isConsumed: false
  });
};

// Mark attachment as consumed after message is sent
export const consumeAttachment = (filename: string): void => {
  const attachment = attachmentRegistry.get(filename);
  if (attachment) {
    attachment.isConsumed = true;
  }
};

// Clean up old attachments (called periodically)
export const cleanupAttachments = (): void => {
  const maxAge = 10 * 60 * 1000; // 10 minutes
  const now = Date.now();
  
  for (const [key, attachment] of attachmentRegistry.entries()) {
    if (now - attachment.timestamp > maxAge) {
      attachmentRegistry.delete(key);
    }
  }
};

// Estimate tokenization for different JSON processing modes
export const estimateTokenization = (content: string, mode: 'full' | 'compressed') => {
  const baseTokens = Math.ceil(content.length / 4);
  
  switch (mode) {
    case 'full':
      return {
        tokens: baseTokens,
        overhead: 0,
        description: 'Full JSON content'
      };
    case 'compressed':
      return {
        tokens: Math.ceil(baseTokens * 0.8), // Compression saves ~20%
        overhead: 5, // Minimal overhead
        description: 'Compressed JSON'
      };
    default:
      return {
        tokens: baseTokens,
        overhead: 0,
        description: 'Unknown mode'
      };
  }
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
export const getJsonLimit = (_content?: string): number => { // eslint-disable-line @typescript-eslint/no-unused-vars
  // For now, return standard limit
  // Future: Could analyze content to determine file type and appropriate limits
  return UPLOAD_CONFIG.json.limits.standard;
}; 