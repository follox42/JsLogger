// ==========================================
// src/handlers/index.ts - CLEAN HANDLERS EXPORTS
// ==========================================

// Internal dependencies (re-exported for convenience)
export { LogRecord } from '../core/index.js';
export { Level, isLevelEnabled } from '../levels/index.js';
export { basicFormatter } from '../formatter/index.js';

// ========== BASE TYPES IMPORTS ==========
import type { Handler, HandlerConfig } from './types.js';

// ========== BASE TYPES EXPORTS ==========
export type { Handler, HandlerConfig } from './types.js';

// ========== HANDLER CONFIGS ==========
export type { ConsoleHandlerConfig } from './handlers/index.js';
export type { FileHandlerConfig } from './handlers/index.js';
export type { MemoryHandlerConfig } from './handlers/index.js';
export type { BrowserStorageConfig } from './handlers/index.js';
export type { StreamHandlerConfig } from './handlers/index.js';
export type { JsonHandlerConfig } from './handlers/index.js';

// ========== HANDLER APIS ==========
export type { MemoryHandlerAPI } from './handlers/index.js';
export type { BrowserStorageAPI } from './handlers/index.js';

// ========== FACTORY FUNCTIONS IMPORTS ==========
import { createConsoleHandler } from './handlers/index.js';
import { createFileHandler } from './handlers/index.js';
import { createMemoryHandler } from './handlers/index.js';
import { createBrowserStorageHandler } from './handlers/index.js';
import { createStreamHandler } from './handlers/index.js';
import { createJsonHandler } from './handlers/index.js';

// ========== FACTORY FUNCTIONS EXPORTS ==========
export { createConsoleHandler } from './handlers/index.js';
export { createFileHandler } from './handlers/index.js';
export { createMemoryHandler } from './handlers/index.js';
export { createBrowserStorageHandler } from './handlers/index.js';
export { createStreamHandler } from './handlers/index.js';
export { createJsonHandler } from './handlers/index.js';


// ========== HANDLERS COLLECTION ==========

/**
 * Clean handlers collection - no anti-patterns!
 * All factory functions return Handler (functions) or APIs with handler functions
 */
export const handlers = {
  /**
   * Console handler with configuration
   * @returns Handler function that outputs to console
   */
  console: createConsoleHandler,
  
  /**
   * File handler for Node.js environments
   * @returns Handler function that writes to file
   */
  file: createFileHandler,
  
  /**
   * Memory handler for testing with rich API
   * @returns API object with handler function and utility methods
   */
  memory: createMemoryHandler,
  
  /**
   * Browser storage handler with rich API
   * @returns API object with handler function and utility methods
   */
  browserStorage: createBrowserStorageHandler,
  
  /**
   * Stream handler for custom outputs
   * @returns Handler function that writes to custom stream
   */
  stream: createStreamHandler,
  
  /**
   * JSON handler for structured logging
   * @returns Handler function that outputs JSON
   */
  json: createJsonHandler,
  
  /**
   * Custom inline handler wrapper
   * @param handlerFn - Custom handler function
   * @returns Same handler function (passthrough)
   */
  custom: (handlerFn: Handler): Handler => handlerFn,
} as const;

// ========== CONVENIENCE EXPORTS ==========

/**
 * Default handlers for quick setup
 */
export const defaultHandlers = {
  /**
   * Default console handler (INFO level, basic formatter)
   */
  console: () => createConsoleHandler({ level: 20 }), // Level.INFO
  
  /**
   * Default JSON handler (INFO level, compact)
   */
  json: () => createJsonHandler({ level: 20, pretty: false }),
  
  /**
   * Default memory handler for testing (1000 records max)
   */
  memory: () => createMemoryHandler({ maxRecords: 1000 }),
} as const;