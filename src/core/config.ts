// ==========================================
// src/core/config.ts - GLOBAL CONFIGURATION
// ==========================================

import type { Handler } from '../handler/types.js';
import { Level } from '../levels/index.js';
import { basicFormatter, Formatter } from '../formatter/index.js';
import { createConsoleHandler } from '../handler/index.js';

/**
 * Global logging configuration
 */
export interface BasicConfig {
  /** Global minimum level */
  level?: number;
  
  /** Global formatter */
  formatter?: Formatter;
  
  /** Global handlers */
  handlers?: Handler[];
  
  /** Force reconfiguration */
  force?: boolean;
}

/**
 * Global configuration state
 */
class LoggingConfig {
  private _configured = false;
  private _level = Level.WARNING;
  private _formatter = basicFormatter;
  private _handlers: Handler[] = [createConsoleHandler()];

  get configured(): boolean {
    return this._configured;
  }

  get level(): number {
    return this._level;
  }

  get formatter(): Formatter {
    return this._formatter;
  }

  get handlers(): Handler[] {
    return [...this._handlers];
  }

  /**
   * Configure global logging settings
   */
  configure(config: BasicConfig = {}): void {
    // Prevent multiple configurations unless forced
    if (this._configured && !config.force) {
      return;
    }

    if (config.level !== undefined) {
      this._level = config.level;
    }

    if (config.formatter) {
      this._formatter = config.formatter;
    }

    if (config.handlers) {
      this._handlers = [...config.handlers];
    }

    this._configured = true;
  }

  /**
   * Reset configuration
   */
  reset(): void {
    this._configured = false;
    this._level = Level.WARNING;
    this._formatter = basicFormatter;
    this._handlers = [createConsoleHandler()];
  }
}

// Global config instance
export const globalConfig = new LoggingConfig();