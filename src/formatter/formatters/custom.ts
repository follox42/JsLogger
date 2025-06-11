// ==========================================
// src/formatter/formatters/custom.ts - CUSTOM UTILITIES
// ==========================================
import { Formatter, LogRecord } from '../index.js';

/**
 * Template formatter using string templates
 */
export function createTemplateFormatter(template: string): Formatter {
  return (record: LogRecord): string => {
    return template
      .replace(/\{timestamp\}/g, record.timestamp.toISOString())
      .replace(/\{level\}/g, record.levelName)
      .replace(/\{name\}/g, record.name)
      .replace(/\{message\}/g, record.message)
      .replace(/\{level_num\}/g, record.level.toString());
  };
}

/**
 * Combine multiple formatters
 */
export function combineFormatters(...formatters: Formatter[]): Formatter {
  return (record: LogRecord): string => {
    return formatters.map(formatter => formatter(record)).join(' | ');
  };
}

/**
 * Create conditional formatter
 */
export function createConditionalFormatter(
  condition: (record: LogRecord) => boolean,
  trueFormatter: Formatter,
  falseFormatter: Formatter
): Formatter {
  return (record: LogRecord): string => {
    return condition(record) ? trueFormatter(record) : falseFormatter(record);
  };
}