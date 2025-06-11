// ==========================================
// src/handlers/stream.ts - STREAM HANDLER
// ==========================================
import { Handler, HandlerConfig, LogRecord, basicFormatter, isLevelEnabled } from '../';

/**
 * Stream handler configuration
 */
export interface StreamHandlerConfig extends HandlerConfig {
  /** Custom write function */
  write: (data: string) => void;
  
  /** Custom error handler */
  onError?: (error: Error) => void;
}

/**
 * Create a generic stream handler
 * 
 * @param config - Configuration with write function
 * @returns Handler function that writes to custom stream
 */
export function createStreamHandler(config: StreamHandlerConfig): Handler {
  const level = config.level ?? 0;
  const formatter = config.formatter ?? basicFormatter;
  const filter = config.filter;
  const write = config.write;
  const onError = config.onError;
  
  return (record: LogRecord): void => {
    // Filtering
    if (level > 0 && !isLevelEnabled(level, record.level)) {
      return;
    }
    
    if (filter && !filter(record)) {
      return;
    }
    
    try {
      const formatted = formatter(record);
      write(formatted + '\n');
    } catch (error) {
      if (onError) {
        onError(error as Error);
      } else {
        console.error('Stream handler error:', error);
      }
    }
  };
}

