// ==========================================
// src/index.ts - JSLOGGER MAIN API
// ==========================================

import { registry, globalConfig, Logger, type BasicConfig } from './core/index.js';
import { Level } from './levels/index.js';

// ========== MAIN API FUNCTIONS ==========

/**
 * Get a logger instance by name (creates if doesn't exist)
 * This is the main API function like Python's logging.getLogger()
 */
export function getLogger(name?: string): Logger {
  if (!name || name === 'root') {
    return registry.getLogger('root');
  }
  return registry.getLogger(name);
}

/**
 * Configure the logging system (like Python's basicConfig)
 */
export function basicConfig(config: BasicConfig = {}): void {
  globalConfig.configure(config);
  
  // Also set level on root logger if specified
  if (config.level !== undefined) {
    const rootLogger = getLogger('root');
    rootLogger.setLevel(config.level);
  }
}

/**
 * Set level on any logger
 */
export function setLevel(loggerOrName: Logger | string, level: number): void {
  const logger = typeof loggerOrName === 'string' ? getLogger(loggerOrName) : loggerOrName;
  logger.setLevel(level);
}

/**
 * Add handler to any logger  
 */
export function addHandler(loggerOrName: Logger | string, handler: Handler): void {
  const logger = typeof loggerOrName === 'string' ? getLogger(loggerOrName) : loggerOrName;
  logger.addHandler(handler);
}

/**
 * Disable logging below a certain level globally
 */
export function disable(level: number = Level.CRITICAL): void {
  globalConfig.configure({ level: level + 1 });
}

/**
 * Reset the logging configuration (useful for testing)
 */
export function reset(): void {
  globalConfig.reset();
  registry.clear();
}

/**
 * Get information about all loggers (for debugging)
 */
export function getLoggerInfo(): Array<{
  name: string;
  level: number;
  effectiveLevel: number;
  handlers: number;
  parent: string | null;
  children: string[];
}> {
  return registry.getAllLoggers().map(logger => logger.getLoggerInfo());
}

// ========== EXPORTS ==========

// Core exports
export { Logger } from './core/index.js';
export type { BasicConfig, LogRecord } from './core/index.js';

// Level exports
export { Level } from './levels/index.js';
export type { 
  getLevelName, 
  getLevelByName, 
  parseLevel,
  getLevelForEnvironment 
} from './levels/index.js';

// Formatter exports
export type { Formatter, FormatterConfig } from './formatter/index.js';
export { 
  formatters,
  basicFormatter,
  detailedFormatter,
  jsonFormatter,
  colorizedFormatter,
  createDetailedFormatter,
  createJsonFormatter,
  createColorizedFormatter,
  createTemplateFormatter,
} from './formatter/index.js';

// Formatter imports
import { 
  formatters,
  basicFormatter,
  detailedFormatter,
  jsonFormatter,
  colorizedFormatter,
  createDetailedFormatter,
  createJsonFormatter,
  createColorizedFormatter,
  createTemplateFormatter,
} from './formatter/index.js';

// Handler exports  
export type { Handler, HandlerConfig } from './handler/index.js';
export {
  handlers,
  createJsonHandler,
  createMemoryHandler,
  createFileHandler,
  createBrowserStorageHandler,
  createStreamHandler,
  createConsoleHandler,
} from './handler/index.js';

// Handler imports  
import {
  handlers,
  createJsonHandler,
  createMemoryHandler,
  createFileHandler,
  createBrowserStorageHandler,
  createStreamHandler,
  createConsoleHandler,
} from './handler/index.js';

// Import handler type for the addHandler function
import type { Handler } from './handler/index.js';

// ========== CONVENIENCE EXPORTS ==========

/**
 * Pre-configured logger instances for quick use
 */
export const logger = getLogger('root');

/**
 * Common formatters collection
 */
export const fmt = {
  basic: basicFormatter,
  detailed: detailedFormatter,
  json: jsonFormatter,
  colorized: colorizedFormatter,
};

/**
 * Utility functions for common logging patterns
 */
export const utils = {
  /**
   * Create a logger with console handler and specific level
   */
  createQuickLogger: (name: string, level: number = Level.INFO) => {
    const log = getLogger(name);
    log.setLevel(level);
    return log;
  },

  /**
   * Create a logger with JSON formatter for structured logging
   */
  createJsonLogger: (name: string, level: number = Level.INFO) => {
    const log = getLogger(name);
    log.setLevel(level);
    log.addHandler(createConsoleHandler({ 
      formatter: jsonFormatter 
    }));
    return log;
  },

  /**
   * Create a logger with colorized output
   */
  createColorLogger: (name: string, level: number = Level.INFO) => {
    const log = getLogger(name);
    log.setLevel(level);
    log.addHandler(createConsoleHandler({ 
      formatter: colorizedFormatter 
    }));
    return log;
  },
};

// ========== QUICK START PRESET ==========

/**
 * Quick start configurations for common scenarios
 */
export const presets = {
  /**
   * Development preset: DEBUG level, colorized output
   */
  development: () => {
    basicConfig({
      level: Level.DEBUG,
      formatter: colorizedFormatter,
    });
  },

  /**
   * Production preset: ERROR level, JSON output
   */
  production: () => {
    basicConfig({
      level: Level.ERROR,
      formatter: jsonFormatter,
    });
  },

  /**
   * Testing preset: WARNING level, simple format
   */
  testing: () => {
    basicConfig({
      level: Level.WARNING,
      formatter: basicFormatter,
    });
  },

  /**
   * Minimal preset: INFO level, message only
   */
  minimal: () => {
    basicConfig({
      level: Level.INFO,
      formatter: formatters.messageOnly,
    });
  },
};

// ========== VERSION INFO ==========

export const version = '0.1.0';
export const pythonCompatible = true;

// ========== LEGACY COMPATIBILITY ==========

/**
 * Legacy aliases for backward compatibility
 */
export const getChild = (parent: string, suffix: string): Logger => {
  return getLogger(parent).getChild(suffix);
};

export const setFormatter = (loggerOrName: Logger | string, formatter: Formatter): void => {
  const logger = typeof loggerOrName === 'string' ? getLogger(loggerOrName) : loggerOrName;
  // This would need to be implemented by setting formatter on all handlers
  console.warn('setFormatter is deprecated, use handler-specific formatting');
};

// Import Formatter type for the setFormatter function  
import type { Formatter } from './formatter/index.js';

// ========== DEFAULT CONFIGURATION ==========

// Auto-configure with sensible defaults if in Node.js environment
if (typeof process !== 'undefined' && process.env) {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'development':
      presets.development();
      break;
    case 'production':
      presets.production();
      break;
    case 'test':
      presets.testing();
      break;
    default:
      // Default to INFO level with basic formatter
      basicConfig({ level: Level.INFO });
  }
} else {
  // Browser environment - default to WARNING level
  basicConfig({ level: Level.WARNING });
}