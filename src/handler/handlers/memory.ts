// ==========================================
// src/handlers/memory.ts - MEMORY HANDLER
// ==========================================

import { Handler, HandlerConfig, LogRecord, basicFormatter, isLevelEnabled } from '../';

/**
 * Memory handler specific configuration
 */
export interface MemoryHandlerConfig extends HandlerConfig {
  /** Maximum number of records to store in memory */
  maxRecords?: number;
  
  /** Auto-clear records when reaching maxRecords (default: false = shift oldest) */
  autoClear?: boolean;
  
  /** Warn when approaching memory limit */
  warnThreshold?: number;
  
  /** Callback when memory limit is reached */
  onMemoryLimit?: (currentSize: number, maxSize: number) => void;
}

/**
 * Memory handler API interface
 */
export interface MemoryHandlerAPI {
  /** Handler function for Logger */
  handler: Handler;
  
  /** Get all stored records */
  getRecords(): LogRecord[];
  
  /** Get records filtered by level */
  getRecordsByLevel(level: number): LogRecord[];
  
  /** Get records filtered by logger name */
  getRecordsByLogger(loggerName: string): LogRecord[];
  
  /** Get records within time range */
  getRecordsByTimeRange(start: Date, end: Date): LogRecord[];
  
  /** Clear all stored records */
  clear(): void;
  
  /** Get formatted logs as strings */
  getFormattedLogs(): string[];
  
  /** Number of stored records */
  size(): number;
  
  /** Get memory usage statistics */
  getStats(): {
    size: number;
    maxRecords: number;
    oldestRecord?: Date;
    newestRecord?: Date;
    memoryUsagePercent: number;
  };
  
  /** Export records as JSON */
  exportAsJson(): string;
  
  /** Find records matching criteria */
  findRecords(predicate: (record: LogRecord) => boolean): LogRecord[];
}

/**
 * Create a memory handler with rich API (useful for testing)
 * 
 * @param config - Configuration options for memory handler
 * @returns API object with handler function and utility methods
 */
export function createMemoryHandler(config: MemoryHandlerConfig = {}): MemoryHandlerAPI {
  const level = config.level ?? 0;
  const formatter = config.formatter ?? basicFormatter;
  const filter = config.filter;
  const maxRecords = config.maxRecords ?? 1000;
  const autoClear = config.autoClear ?? false;
  const warnThreshold = config.warnThreshold ?? Math.floor(maxRecords * 0.9);
  const onMemoryLimit = config.onMemoryLimit;
  
  // State in closure
  const records: LogRecord[] = [];
  let warningIssued = false;
  
  // Helper function to handle memory management
  const manageMemory = (): void => {
    if (records.length > maxRecords) {
      if (autoClear) {
        // Clear all records when limit reached
        records.splice(0);
        if (onMemoryLimit) {
          onMemoryLimit(0, maxRecords);
        }
      } else {
        // Remove oldest record (FIFO)
        records.shift();
        if (onMemoryLimit) {
          onMemoryLimit(records.length, maxRecords);
        }
      }
      warningIssued = false; // Reset warning flag
    } else if (records.length >= warnThreshold && !warningIssued) {
      // Issue warning when approaching limit
      console.warn(`Memory handler approaching limit: ${records.length}/${maxRecords} records`);
      warningIssued = true;
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
    
    // Store record
    records.push(record);
    
    // Manage memory
    manageMemory();
  };
  
  // Return rich API
  return {
    handler,
    
    getRecords: (): LogRecord[] => [...records],
    
    getRecordsByLevel: (level: number): LogRecord[] =>
      records.filter(record => record.level >= level),
    
    getRecordsByLogger: (loggerName: string): LogRecord[] =>
      records.filter(record => record.name === loggerName || record.name.startsWith(loggerName + '.')),
    
    getRecordsByTimeRange: (start: Date, end: Date): LogRecord[] =>
      records.filter(record => record.timestamp >= start && record.timestamp <= end),
    
    clear: (): void => {
      records.splice(0);
      warningIssued = false;
    },
    
    getFormattedLogs: (): string[] =>
      records.map(record => formatter(record)),
    
    size: (): number => records.length,
    
    getStats: () => {
      const size = records.length;
      const oldestRecord = size > 0 ? records[0]?.timestamp : undefined;
      const newestRecord = size > 0 ? records[size - 1]?.timestamp : undefined;
      const memoryUsagePercent = Math.round((size / maxRecords) * 100);
      
      return {
        size,
        maxRecords,
        oldestRecord,
        newestRecord,
        memoryUsagePercent
      };
    },
    
    exportAsJson: (): string => {
      return JSON.stringify({
        metadata: {
          exportedAt: new Date().toISOString(),
          totalRecords: records.length,
          maxRecords,
          config: { level, autoClear, warnThreshold }
        },
        records: records
      }, null, 2);
    },
    
    findRecords: (predicate: (record: LogRecord) => boolean): LogRecord[] =>
      records.filter(predicate)
  };
}