// ==========================================
// src/handler/handlers/browser.ts - BROWSER STORAGE HANDLER
// ==========================================
import { Handler, HandlerConfig, LogRecord, basicFormatter, isLevelEnabled } from '../';

/**
 * Browser storage handler configuration
 */
export interface BrowserStorageConfig extends HandlerConfig {
  /** Storage key prefix */
  keyPrefix?: string;
  
  /** Maximum number of log entries */
  maxEntries?: number;
  
  /** Storage type */
  storageType?: 'localStorage' | 'sessionStorage';
}

/**
 * Browser storage handler API
 */
export interface BrowserStorageAPI {
  /** Handler function for Logger */
  handler: Handler;
  
  /** Get all stored logs */
  getStoredLogs(): any[];
  
  /** Clear all stored logs */
  clearLogs(): void;
  
  /** Number of stored logs */
  size(): number;
}

/**
 * Create a browser storage handler (browser only)
 * 
 * @param config - Configuration options
 * @returns API object with handler function and utility methods
 */
export function createBrowserStorageHandler(config: BrowserStorageConfig = {}): BrowserStorageAPI {
  const level = config.level ?? 0;
  const formatter = config.formatter ?? basicFormatter;
  const filter = config.filter;
  const keyPrefix = config.keyPrefix ?? 'jslogger_';
  const maxEntries = config.maxEntries ?? 100;
  const storageType = config.storageType ?? 'localStorage';
  
  // Check browser environment
  if (typeof window === 'undefined') {
    throw new Error('createBrowserStorageHandler is only available in browser environment');
  }
  
  const storage = window[storageType];
  
  // Helper to cleanup old entries
  const cleanupOldEntries = (): void => {
    const keys = Object.keys(storage)
      .filter(key => key.startsWith(keyPrefix))
      .sort();
    
    while (keys.length > maxEntries) {
      const oldestKey = keys.shift();
      if (oldestKey) {
        storage.removeItem(oldestKey);
      }
    }
  };
  
  // Main handler function
  const handler: Handler = (record: LogRecord): void => {
    // Filtering
    if (level > 0 && !isLevelEnabled(level, record.level)) {
      return;
    }
    
    if (filter && !filter(record)) {
      return;
    }
    
    try {
      const key = `${keyPrefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const logEntry = {
        ...record,
        formatted: formatter(record),
      };
      
      storage.setItem(key, JSON.stringify(logEntry));
      cleanupOldEntries();
    } catch (error) {
      // Storage quota exceeded or other error
      console.error('Browser storage handler error:', error);
    }
  };
  
  // Return rich API
  return {
    handler,
    
    getStoredLogs: (): any[] => {
      const logs: any[] = [];
      const keys = Object.keys(storage)
        .filter(key => key.startsWith(keyPrefix))
        .sort();
      
      for (const key of keys) {
        try {
          const logEntry = JSON.parse(storage.getItem(key) || '{}');
          logs.push(logEntry);
        } catch (error) {
          // Invalid JSON, skip
        }
      }
      
      return logs;
    },
    
    clearLogs: (): void => {
      const keys = Object.keys(storage)
        .filter(key => key.startsWith(keyPrefix));
      
      keys.forEach(key => storage.removeItem(key));
    },
    
    size: (): number => {
      return Object.keys(storage)
        .filter(key => key.startsWith(keyPrefix)).length;
    }
  };
}

