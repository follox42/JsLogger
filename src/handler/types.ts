// ==========================================
// src/handler/types.ts - HANDLER TYPES
// ==========================================

import type { LogRecord } from '../core/logrecord.js';
import type { Formatter } from '../formatter/index.js';

/**
 * Handler is ALWAYS a simple function
 */
export type Handler = (record: LogRecord) => void;

/**
 * Base configuration for all handlers
 */
export interface HandlerConfig {
  /** Minimum level to handle */
  level?: number;
  
  /** Formatter to use */
  formatter?: Formatter;
  
  /** Custom filter function */
  filter?: (record: LogRecord) => boolean;
}