// ==========================================
// src/handlers/file.ts - FILE HANDLER
// ==========================================
import { Handler, HandlerConfig, LogRecord, basicFormatter, Level, isLevelEnabled } from '../index.js';

/**
 * File handler configuration
 */
export interface FileHandlerConfig extends HandlerConfig {
  /** File encoding */
  encoding?: BufferEncoding;
  
  /** Write mode */
  mode?: 'append' | 'write';
  
  /** Auto-flush for errors */
  autoFlush?: boolean;
}

/**
 * Create a file handler function (Node.js only)
 * 
 * @param filename - Path to log file
 * @param config - Configuration options
 * @returns Handler function that writes to file
 */
export function createFileHandler(filename: string, config: FileHandlerConfig = {}): Handler {
  const level = config.level ?? 0;
  const formatter = config.formatter ?? basicFormatter;
  const filter = config.filter;
  const encoding = config.encoding ?? 'utf8';
  const mode = config.mode ?? 'append';
  const autoFlush = config.autoFlush ?? true;
  
  // Check Node.js environment
  if (typeof process === 'undefined' || typeof require === 'undefined') {
    throw new Error('createFileHandler is only available in Node.js environment');
  }
  
  // Initialize write stream once
  let writeStream: any;
  try {
    const fs = require('fs');
    const flags = mode === 'append' ? 'a' : 'w';
    
    writeStream = fs.createWriteStream(filename, {
      flags,
      encoding,
      autoClose: true,
    });
    
    writeStream.on('error', (error: Error) => {
      console.error('File handler stream error:', error);
    });
  } catch (error) {
    throw new Error(`Failed to create file handler: ${error}`);
  }
  
  // Return handler function
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
      const line = formatted + '\n';
      
      writeStream.write(line, encoding);
      
      // Auto-flush for critical errors
      if (autoFlush && record.level >= Level.ERROR) {
        writeStream.flush?.();
      }
    } catch (error) {
      console.error('File handler error:', error);
    }
  };
}