// ==========================================
// src/core/logrecord.ts - LOG RECORD CORE
// ==========================================

/**
 * Log record containing all information about a log event
 * Similar to Python's LogRecord class
 */
export interface LogRecord {
  /** Logger name that created this record */
  name: string;
  
  /** Numeric log level */
  level: number;
  
  /** String representation of log level */
  levelName: string;
  
  /** The log message */
  message: string;
  
  /** Timestamp when log was created */
  timestamp: Date;
  
  /** Additional arguments passed to log method */
  args: any[];
  
  /** Optional metadata */
  extra?: Record<string, any>;
  
  /** Exception information if logging an error */
  exc_info?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Create a new LogRecord instance
 */
export function createLogRecord(
  name: string,
  level: number,
  levelName: string,
  message: string,
  args: any[] = [],
  extra?: Record<string, any>
): LogRecord {
  const record: LogRecord = {
    name,
    level,
    levelName,
    message,
    timestamp: new Date(),
    args,
  };

  if (extra) {
    record.extra = extra;
  }

  // Extract exception info if args contain Error
  const errorArg = args.find(arg => arg instanceof Error);
  if (errorArg) {
    record.exc_info = {
      name: errorArg.name,
      message: errorArg.message,
      stack: errorArg.stack,
    };
  }

  return record;
}

/**
 * Clone a LogRecord with optional overrides
 */
export function cloneLogRecord(
  record: LogRecord,
  overrides: Partial<LogRecord> = {}
): LogRecord {
  return {
    ...record,
    ...overrides,
    args: [...record.args],
    extra: record.extra ? { ...record.extra } : undefined,
    exc_info: record.exc_info ? { ...record.exc_info } : undefined,
  };
}

/**
 * Check if a LogRecord has exception information
 */
export function hasException(record: LogRecord): boolean {
  return Boolean(record.exc_info);
}

/**
 * Get formatted exception string from LogRecord
 */
export function getExceptionString(record: LogRecord): string | null {
  if (!record.exc_info) {
    return null;
  }

  const { name, message, stack } = record.exc_info;
  return stack || `${name}: ${message}`;
}