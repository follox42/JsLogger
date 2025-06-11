// ==========================================
// src/formatters/index.ts - FORMATTERS EXPORTS
// ==========================================

// Types
export type { Formatter, FormatterConfig } from './types';

// For internal use only
export { LogRecord } from '../core';

// Basic formatters
export {
  basicFormatter,
  simpleFormatter,
  messageOnlyFormatter,
} from './formatters/basic';

// Detailed formatters
export {
  detailedFormatter,
  createDetailedFormatter,
} from './formatters/detailed';

// JSON formatters
export {
  createJsonFormatter,
  jsonFormatter,
} from './formatters/json';

// Colorized formatters
export {
  COLORS,
  createColorizedFormatter,
  colorizedFormatter,
} from './formatters/colorized';

// Custom utilities
export {
  createTemplateFormatter,
  combineFormatters,
  createConditionalFormatter,
} from './formatters';

// Default formatters collection
export { formatters } from './formatters';