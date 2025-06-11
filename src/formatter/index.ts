// ==========================================
// src/formatters/index.ts - FORMATTERS EXPORTS
// ==========================================

// Types
export type { Formatter, FormatterConfig } from './types.js';

// For internal use only
export { LogRecord } from '../core/index.js';

// Basic formatters
export {
  basicFormatter,
  simpleFormatter,
  messageOnlyFormatter,
} from './formatters/basic.js';

// Detailed formatters
export {
  detailedFormatter,
  createDetailedFormatter,
} from './formatters/detailed.js';

// JSON formatters
export {
  createJsonFormatter,
  jsonFormatter,
} from './formatters/json.js';

// Colorized formatters
export {
  COLORS,
  createColorizedFormatter,
  colorizedFormatter,
} from './formatters/colorized.js';

// Custom utilities
export {
  createTemplateFormatter,
  combineFormatters,
  createConditionalFormatter,
} from './formatters/index.js';

// Default formatters collection
export { formatters } from './formatters/index.js';