// ==========================================
// src/api.ts - MAIN API FUNCTIONS
// ==========================================

import { registry, globalConfig, Logger, type BasicConfig } from './core';
import { Level } from './levels';
import type { Handler } from './handler';

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