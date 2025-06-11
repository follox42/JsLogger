// ==========================================
// src/formatters/types.ts - FORMATTER TYPES
// ==========================================

import type { LogRecord } from '../core/logrecord';

/**
 * Formatter function type
 */
export type Formatter = (record: LogRecord) => string;

/**
 * Formatter configuration options
 */
export interface FormatterConfig {
  /** Include timestamp in output */
  includeTimestamp?: boolean;
  
  /** Timestamp format */
  timestampFormat?: 'iso' | 'locale' | 'short' | 'time';
  
  /** Include logger name */
  includeName?: boolean;
  
  /** Include log level */
  includeLevel?: boolean;
  
  /** Field separator */
  separator?: string;
  
  /** Include extra fields */
  includeExtra?: boolean;
}