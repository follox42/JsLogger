// ==========================================
// src/formatter/formatters/json.ts - JSON FORMATTER
// ==========================================
import { Formatter, LogRecord } from '../index.js';

/**
 * JSON formatter configuration
 */
export interface JsonFormatterConfig {
  /** Pretty print JSON */
  pretty?: boolean;
  
  /** Include all fields */
  includeAll?: boolean;
  
  /** Custom field mapping */
  fieldMapping?: Record<string, string>;
}

/**
 * JSON formatter for structured logging
 */
export function createJsonFormatter(config: JsonFormatterConfig = {}): Formatter {
  const { pretty = false, includeAll = false, fieldMapping = {} } = config;

  return (record: LogRecord): string => {
    const logData: Record<string, any> = {
      timestamp: record.timestamp.toISOString(),
      level: record.levelName,
      logger: record.name,
      message: record.message,
    };

    // Add extra fields if present
    if (record.extra) {
      Object.assign(logData, record.extra);
    }

    // Add exception info if present
    if (record.exc_info) {
      logData.exception = record.exc_info;
    }

    // Include all record fields if requested
    if (includeAll) {
      logData.level_num = record.level;
      logData.args = record.args;
    }

    // Apply field mapping
    const mappedData: Record<string, any> = {};
    for (const [key, value] of Object.entries(logData)) {
      const mappedKey = fieldMapping[key] || key;
      mappedData[mappedKey] = value;
    }

    return JSON.stringify(mappedData, null, pretty ? 2 : undefined);
  };
}

/**
 * Simple JSON formatter
 */
export const jsonFormatter = createJsonFormatter();