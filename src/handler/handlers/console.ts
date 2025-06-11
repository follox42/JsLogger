// ==========================================
// src/handler/handlers/console.ts - CONSOLE HANDLER
// ==========================================
import { Handler, HandlerConfig, LogRecord, basicFormatter, Level, isLevelEnabled } from '../index.js';

/**
 * Console handler configuration
 */
export interface ConsoleHandlerConfig extends HandlerConfig {
  /** Use console.error for ERROR+ levels */
  useStderr?: boolean;
  
  /** Use console.warn for WARNING level */
  useWarn?: boolean;
}

/**
 * Create a console handler function
 * 
 * @param config - Configuration options
 * @returns Handler function that outputs to console
 */
export function createConsoleHandler(config: ConsoleHandlerConfig = {}): Handler {
  // Capture configuration in closure
  const level = config.level ?? 0;
  const formatter = config.formatter ?? basicFormatter;
  const filter = config.filter;
  const useStderr = config.useStderr ?? true;
  const useWarn = config.useWarn ?? true;
  
  // Return handler function directly
  return (record: LogRecord): void => {
    // Level filtering
    if (level > 0 && !isLevelEnabled(level, record.level)) {
      return;
    }
    
    // Custom filtering
    if (filter && !filter(record)) {
      return;
    }
    
    try {
      const formatted = formatter(record);
      
      // Choose appropriate console method based on level
      if (useStderr && record.level >= Level.ERROR) {
        console.error(formatted, ...record.args);
      } else if (useWarn && record.level >= Level.WARNING) {
        console.warn(formatted, ...record.args);
      } else {
        console.log(formatted, ...record.args);
      }
    } catch (error) {
      console.error('Console handler error:', error);
    }
  };
}

