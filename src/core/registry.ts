// ==========================================
// src/core/registry.ts - LOGGER REGISTRY
// ==========================================

import type { Logger } from './logger';

/**
 * Global logger registry (like Python's logging module)
 */
class LoggerRegistry {
  private loggers = new Map<string, Logger>();
  private rootLogger: Logger | null = null;

  /**
   * Get or create a logger by name
   */
  getLogger(name: string, loggerClass?: new (name: string) => Logger): Logger {
    // Return existing logger if found
    if (this.loggers.has(name)) {
      return this.loggers.get(name)!;
    }

    // Create new logger
    const LoggerClass = loggerClass || (this.getLoggerClass() as new (name: string) => Logger);
    const logger = new LoggerClass(name);
    
    this.loggers.set(name, logger);

    // Set up parent-child relationship if not root
    if (name !== 'root') {
      this.setupHierarchy(logger, name);
    } else {
      this.rootLogger = logger;
    }

    return logger;
  }

  /**
   * Setup parent-child hierarchy for a logger
   */
  private setupHierarchy(logger: Logger, name: string): void {
    const parts = name.split('.');
    
    if (parts.length > 1) {
      // Find parent logger
      const parentName = parts.slice(0, -1).join('.');
      const parent = this.getLogger(parentName);
      (logger as any)._parent = parent;
      
      // Add to parent's children
      const childName = parts[parts.length - 1];
      (parent as any)._children.set(childName, logger);
    } else {
      // Direct child of root
      if (this.rootLogger) {
        (logger as any)._parent = this.rootLogger;
        (this.rootLogger as any)._children.set(name, logger);
      }
    }
  }

  /**
   * Get the root logger
   */
  getRootLogger(): Logger | null {
    return this.rootLogger;
  }

  /**
   * Get all registered loggers
   */
  getAllLoggers(): Logger[] {
    return Array.from(this.loggers.values());
  }

  /**
   * Clear all loggers (useful for testing)
   */
  clear(): void {
    this.loggers.clear();
    this.rootLogger = null;
  }

  /**
   * Check if a logger exists
   */
  hasLogger(name: string): boolean {
    return this.loggers.has(name);
  }

  /**
   * Get logger class (can be overridden)
   */
  protected getLoggerClass(): any {
    // Import Logger class dynamically to avoid circular dependency
    const { Logger } = require('./logger');
    return Logger;
  }
}

// Global registry instance
export const registry = new LoggerRegistry();

