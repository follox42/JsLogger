// ==========================================
// src/core/logger.ts - LOGGER CLASS
// ==========================================

import { createLogRecord, type LogRecord, registry, globalConfig } from './';
import { Level, getLevelName, getEffectiveLevel, isLevelEnabled } from '../levels';
import { Handler } from '../handler';

/**
 * Logger class matching Python's Logger behavior
 */
export class Logger {
  private _name: string;
  private _level: number | null = null;
  private _handlers: Handler[] = [];
  private _parent: Logger | null = null;
  private _children = new Map<string, Logger>();
  private _disabled = false;

  constructor(name: string) {
    this._name = name;
  }

  // ========== Properties ==========

  get name(): string {
    return this._name;
  }

  get level(): number {
    // If level is set on this logger, use it
    if (this._level !== null) {
      return this._level;
    }
    
    // Otherwise, inherit from parent
    if (this._parent) {
      return this._parent.level;
    }
    
    // Finally, use global config
    return globalConfig.level;
  }

  get effectiveLevel(): number {
    return getEffectiveLevel(this.level);
  }

  get parent(): Logger | null {
    return this._parent;
  }

  get handlers(): Handler[] {
    return [...this._handlers];
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  // ========== Configuration Methods ==========

  /**
   * Set the level for this logger
   */
  setLevel(level: number): void {
    this._level = level;
  }

  /**
   * Add a handler to this logger
   */
  addHandler(handler: Handler): void {
    this._handlers.push(handler);
  }

  /**
   * Remove a handler from this logger
   */
  removeHandler(handler: Handler): void {
    const index = this._handlers.indexOf(handler);
    if (index > -1) {
      this._handlers.splice(index, 1);
    }
  }

  /**
   * Remove all handlers
   */
  removeAllHandlers(): void {
    this._handlers = [];
  }

  // ========== Logging Methods ==========

  /**
   * Check if this logger will process a logging event at the given level
   */
  isEnabledFor(level: number): boolean {
    if (this._disabled) {
      return false;
    }
    return isLevelEnabled(this.effectiveLevel, level);
  }

  /**
   * Internal method to emit a log record
   */
  private _log(level: number, message: string, ...args: any[]): void {
    if (!this.isEnabledFor(level)) {
      return;
    }

    const levelName = getLevelName(level);
    const record = createLogRecord(this._name, level, levelName, message, args);

    this.handle(record);
  }

  /**
   * Handle a log record by passing it to all applicable handlers
   */
  handle(record: LogRecord): void {
    if (this._disabled) {
      return;
    }

    // Use logger's own handlers if any, otherwise use global handlers
    const handlersToUse = this._handlers.length > 0 ? this._handlers : globalConfig.handlers;
    
    for (const handler of handlersToUse) {
      try {
        handler(record);
      } catch (error) {
        // Prevent logging errors from breaking the application
        this.handleError(error, record);
      }
    }

    // Propagate to parent logger if no handlers on this logger
    if (this._parent && this._handlers.length === 0) {
      this._parent.handle(record);
    }
  }

  /**
   * Handle errors during logging
   */
  private handleError(error: any, record: LogRecord): void {
    // Use console.error to avoid infinite loops
    console.error('Error in log handler:', error);
  }

  // ========== Public Logging Methods ==========

  debug(message: string, ...args: any[]): void {
    this._log(Level.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this._log(Level.INFO, message, ...args);
  }

  warning(message: string, ...args: any[]): void {
    this._log(Level.WARNING, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.warning(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this._log(Level.ERROR, message, ...args);
  }

  critical(message: string, ...args: any[]): void {
    this._log(Level.CRITICAL, message, ...args);
  }

  fatal(message: string, ...args: any[]): void {
    this.critical(message, ...args);
  }

  /**
   * Log with explicit level
   */
  log(level: number, message: string, ...args: any[]): void {
    this._log(level, message, ...args);
  }

  // ========== Hierarchy Methods ==========

  /**
   * Get a child logger (like Python's getChild)
   */
  getChild(suffix: string): Logger {
    const childName = `${this._name}.${suffix}`;
    return registry.getLogger(childName);
  }

  /**
   * Get all child loggers
   */
  getChildren(): Logger[] {
    return Array.from(this._children.values());
  }

  /**
   * Check if this logger has a specific child
   */
  hasChild(name: string): boolean {
    return this._children.has(name);
  }

  // ========== Utility Methods ==========

  /**
   * Create a new logger with additional context
   */
  withContext(context: Record<string, any>): Logger {
    // This could be implemented to create a logger wrapper
    // that adds context to all log records
    return this; // Simplified for now
  }

  /**
   * Get logger information for debugging
   */
  getLoggerInfo(): {
    name: string;
    level: number;
    effectiveLevel: number;
    handlers: number;
    parent: string | null;
    children: string[];
    disabled: boolean;
  } {
    return {
      name: this._name,
      level: this._level ?? -1,
      effectiveLevel: this.effectiveLevel,
      handlers: this._handlers.length,
      parent: this._parent?.name ?? null,
      children: Array.from(this._children.keys()),
      disabled: this._disabled,
    };
  }
}
