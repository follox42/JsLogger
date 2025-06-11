// ==========================================
// src/handlers/json.ts - JSON HANDLER
// ==========================================
import { Handler, HandlerConfig, LogRecord, isLevelEnabled } from '../index.js';

/**
 * JSON handler configuration
 */
export interface JsonHandlerConfig extends HandlerConfig {
  /** Pretty print JSON */
  pretty?: boolean;
  
  /** Include all record fields */
  includeAll?: boolean;
  
  /** Custom field mapping */
  fieldMapping?: Record<string, string>;
}

/**
 * Create a JSON handler for structured logging
 * 
 * @param config - Configuration options
 * @returns Handler function that outputs JSON
 */
export function createJsonHandler(config: JsonHandlerConfig = {}): Handler {
  const level = config.level ?? 0;
  const filter = config.filter;
  const pretty = config.pretty ?? false;
  const includeAll = config.includeAll ?? false;
  const fieldMapping = config.fieldMapping ?? {};
  
  return (record: LogRecord): void => {
    // Filtering
    if (level > 0 && !isLevelEnabled(level, record.level)) {
      return;
    }
    
    if (filter && !filter(record)) {
      return;
    }
    
    try {
      const data: Record<string, any> = {
        timestamp: record.timestamp.toISOString(),
        level: record.levelName,
        logger: record.name,
        message: record.message,
      };
      
      // Add extra fields if present
      if (record.extra) {
        Object.assign(data, record.extra);
      }
      
      // Add exception info if present
      if (record.exc_info) {
        data.exception = record.exc_info;
      }
      
      // Include all record fields if requested
      if (includeAll) {
        data.level_num = record.level;
        data.args = record.args;
      }
      
      // Apply field mapping
      const mappedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        const mappedKey = fieldMapping[key] || key;
        mappedData[mappedKey] = value;
      }
      
      const json = JSON.stringify(mappedData, null, pretty ? 2 : undefined);
      console.log(json);
    } catch (error) {
      console.error('JSON handler error:', error);
    }
  };
}