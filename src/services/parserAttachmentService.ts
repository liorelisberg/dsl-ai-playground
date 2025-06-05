/**
 * Parser Attachment Service
 * Handles temporary attachment creation, metadata generation, and cleanup
 * for parser-to-chat communication
 */

import { JsonMetadata } from '@/components/DSLTutor/JsonUpload';
import { getInputSizeBytes, formatFileSize, tryParseJson } from '@/lib/parserContentAnalysis';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AttachmentMetadata {
  filename: string;
  sizeBytes: number;
  type: 'json' | 'text';
  messageId: string;
  timestamp: string;
  isParserGenerated: boolean;
}

export interface TempAttachment {
  data: unknown;
  metadata: AttachmentMetadata;
  cleanup: () => void;
}

export interface ParserAttachmentResult {
  attachmentMetadata: AttachmentMetadata;
  jsonMetadata: JsonMetadata;
  success: boolean;
  error?: string;
}

// ============================================================================
// STORAGE & REGISTRY
// ============================================================================

// Temporary storage for parser-generated attachments
const tempAttachmentStorage = new Map<string, {
  data: unknown;
  metadata: AttachmentMetadata;
  timestamp: number;
}>();

// Registry to track attachment cleanup
const attachmentRegistry = new Map<string, {
  messageId: string;
  filename: string;
  createdAt: number;
  isConsumed: boolean;
}>();

// Cleanup interval (5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// ============================================================================
// CORE ATTACHMENT FUNCTIONS
// ============================================================================

/**
 * Create a temporary attachment for parser input data
 */
export const createTempAttachment = async (
  data: unknown,
  filename: string,
  messageId: string
): Promise<TempAttachment> => {
  const timestamp = new Date().toISOString();
  const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const sizeBytes = getInputSizeBytes(dataString);
  
  // Determine attachment type
  const type: 'json' | 'text' = tryParseJson(dataString) !== null ? 'json' : 'text';
  
  const metadata: AttachmentMetadata = {
    filename,
    sizeBytes,
    type,
    messageId,
    timestamp,
    isParserGenerated: true
  };
  
  // Store temporarily
  const storageKey = `${messageId}-${filename}`;
  tempAttachmentStorage.set(storageKey, {
    data,
    metadata,
    timestamp: Date.now()
  });
  
  // Register for cleanup tracking
  attachmentRegistry.set(filename, {
    messageId,
    filename,
    createdAt: Date.now(),
    isConsumed: false
  });
  
  // Create cleanup function
  const cleanup = () => {
    tempAttachmentStorage.delete(storageKey);
    const registration = attachmentRegistry.get(filename);
    if (registration) {
      registration.isConsumed = true;
    }
  };
  
  return {
    data,
    metadata,
    cleanup
  };
};

/**
 * Attach parser input to a message and create necessary metadata
 */
export const attachInputToMessage = async (
  input: string,
  messageId: string
): Promise<ParserAttachmentResult> => {
  try {
    const timestamp = Date.now();
    const filename = `parser-input-${timestamp}.json`;
    
    // Parse input data
    let inputData: unknown;
    let dataType: 'json' | 'text';
    
    try {
      inputData = JSON.parse(input);
      dataType = 'json';
    } catch {
      inputData = input;
      dataType = 'text';
      // For text data, change extension to .txt
      const textFilename = `parser-input-${timestamp}.txt`;
      return await processAttachment(inputData, textFilename, messageId, dataType);
    }
    
    return await processAttachment(inputData, filename, messageId, dataType);
    
  } catch (error) {
    return {
      attachmentMetadata: {} as AttachmentMetadata,
      jsonMetadata: {} as JsonMetadata,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create attachment'
    };
  }
};

/**
 * Process attachment creation with metadata generation
 */
const processAttachment = async (
  data: unknown,
  filename: string,
  messageId: string,
  type: 'json' | 'text'
): Promise<ParserAttachmentResult> => {
  const tempAttachment = await createTempAttachment(data, filename, messageId);
  
  // Create JsonMetadata for compatibility with existing chat system
  const jsonMetadata: JsonMetadata = {
    filename,
    sizeBytes: tempAttachment.metadata.sizeBytes,
    topLevelKeys: type === 'json' && typeof data === 'object' && data !== null 
      ? Object.keys(data as Record<string, unknown>)
      : [],
    uploadTime: tempAttachment.metadata.timestamp,
    complexity: determineComplexity(data),
    estimatedTokens: Math.ceil(tempAttachment.metadata.sizeBytes / 4), // ~4 chars per token
    depth: type === 'json' ? calculateObjectDepth(data) : 1
  };
  
  return {
    attachmentMetadata: tempAttachment.metadata,
    jsonMetadata,
    success: true
  };
};

/**
 * Retrieve temporary attachment data
 */
export const getTempAttachment = (messageId: string, filename: string): unknown | null => {
  const storageKey = `${messageId}-${filename}`;
  const stored = tempAttachmentStorage.get(storageKey);
  return stored?.data || null;
};

/**
 * Check if attachment exists for message
 */
export const hasAttachment = (messageId: string, filename: string): boolean => {
  const storageKey = `${messageId}-${filename}`;
  return tempAttachmentStorage.has(storageKey);
};

// ============================================================================
// CLEANUP & MANAGEMENT
// ============================================================================

/**
 * Clean up temporary attachments for a specific message
 */
export const cleanupTempAttachments = (messageId: string): void => {
  // Find all attachments for this message
  const keysToDelete: string[] = [];
  
  tempAttachmentStorage.forEach((_, key) => {
    if (key.startsWith(`${messageId}-`)) {
      keysToDelete.push(key);
    }
  });
  
  // Remove from storage
  keysToDelete.forEach(key => {
    tempAttachmentStorage.delete(key);
  });
  
  // Mark as consumed in registry
  attachmentRegistry.forEach((registration) => {
    if (registration.messageId === messageId) {
      registration.isConsumed = true;
    }
  });
};

/**
 * Clean up expired attachments (older than 5 minutes)
 */
export const cleanupExpiredAttachments = (): void => {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  tempAttachmentStorage.forEach((stored, key) => {
    if (now - stored.timestamp > CLEANUP_INTERVAL) {
      expiredKeys.push(key);
    }
  });
  
  expiredKeys.forEach(key => {
    tempAttachmentStorage.delete(key);
  });
  
  // Clean up registry entries
  const expiredFilenames: string[] = [];
  attachmentRegistry.forEach((registration, filename) => {
    if (now - registration.createdAt > CLEANUP_INTERVAL) {
      expiredFilenames.push(filename);
    }
  });
  
  expiredFilenames.forEach(filename => {
    attachmentRegistry.delete(filename);
  });
};

/**
 * Get storage statistics for debugging
 */
export const getStorageStats = (): {
  tempAttachments: number;
  registeredAttachments: number;
  totalSizeBytes: number;
} => {
  let totalSize = 0;
  
  tempAttachmentStorage.forEach((stored) => {
    totalSize += stored.metadata.sizeBytes;
  });
  
  return {
    tempAttachments: tempAttachmentStorage.size,
    registeredAttachments: attachmentRegistry.size,
    totalSizeBytes: totalSize
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine complexity of data structure
 */
const determineComplexity = (data: unknown): 'simple' | 'moderate' | 'complex' => {
  if (typeof data !== 'object' || data === null) {
    return 'simple';
  }
  
  const jsonString = JSON.stringify(data);
  const size = jsonString.length;
  
  if (size < 1000) return 'simple';
  if (size < 10000) return 'moderate';
  return 'complex';
};

/**
 * Calculate object depth for JSON structures
 */
const calculateObjectDepth = (obj: unknown, currentDepth = 0): number => {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }
  
  if (Array.isArray(obj)) {
    return Math.max(...obj.map(item => calculateObjectDepth(item, currentDepth + 1)));
  }
  
  const depths = Object.values(obj as Record<string, unknown>)
    .map(value => calculateObjectDepth(value, currentDepth + 1));
  
  return depths.length > 0 ? Math.max(...depths) : currentDepth + 1;
};

/**
 * Generate user-friendly attachment summary
 */
export const generateAttachmentSummary = (metadata: AttachmentMetadata): string => {
  const { filename, sizeBytes, type } = metadata;
  return `${filename} (${type.toUpperCase()}, ${formatFileSize(sizeBytes)})`;
};

/**
 * Validate attachment before creation
 */
export const validateAttachmentData = (data: unknown, maxSize: number): {
  isValid: boolean;
  error?: string;
  sizeBytes: number;
} => {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const sizeBytes = getInputSizeBytes(dataString);
  
  if (sizeBytes > maxSize) {
    return {
      isValid: false,
      error: `Data size (${formatFileSize(sizeBytes)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`,
      sizeBytes
    };
  }
  
  return {
    isValid: true,
    sizeBytes
  };
};

// ============================================================================
// INITIALIZATION & AUTO-CLEANUP
// ============================================================================

// Set up automatic cleanup interval
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredAttachments, CLEANUP_INTERVAL);
}

// Export cleanup function for manual cleanup
export { cleanupExpiredAttachments as runCleanup }; 