// ==========================================
// src/handlers/index.ts - CLEAN HANDLERS EXPORTS
// ==========================================

// Internal dependencies (re-exported for convenience)
export { LogRecord } from '../core';
export { Level, isLevelEnabled } from '../levels';
export { basicFormatter } from '../formatter';

// ========== BASE TYPES IMPORTS ==========
import type { Handler, HandlerConfig } from './types';

// ========== BASE TYPES EXPORTS ==========
export type { Handler, HandlerConfig } from './types';

// ========== HANDLER CONFIGS ==========
export type { ConsoleHandlerConfig } from './handlers';
export type { FileHandlerConfig } from './handlers';
export type { MemoryHandlerConfig } from './handlers';
export type { BrowserStorageConfig } from './handlers';
export type { StreamHandlerConfig } from './handlers';
export type { JsonHandlerConfig } from './handlers';

// ========== HANDLER APIS ==========
export type { MemoryHandlerAPI } from './handlers';
export type { BrowserStorageAPI } from './handlers';

// ========== FACTORY FUNCTIONS IMPORTS ==========
import { createConsoleHandler } from './handlers';
import { createFileHandler } from './handlers';
import { createMemoryHandler } from './handlers';
import { createBrowserStorageHandler } from './handlers';
import { createStreamHandler } from './handlers';
import { createJsonHandler } from './handlers';

// ========== FACTORY FUNCTIONS EXPORTS ==========
export { createConsoleHandler } from './handlers';
export { createFileHandler } from './handlers';
export { createMemoryHandler } from './handlers';
export { createBrowserStorageHandler } from './handlers';
export { createStreamHandler } from './handlers';
export { createJsonHandler } from './handlers';


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