// ==========================================
// src/formatter/formatters/index.ts - FORMATTERS PROFILS EXPORTS
// ==========================================
import { basicFormatter } from './basic';
import { simpleFormatter } from './basic';
import { messageOnlyFormatter } from './basic';
import { detailedFormatter } from './detailed';
import { colorizedFormatter } from './colorized';
import { jsonFormatter } from './json';

// Basic formatters
export {
  basicFormatter,
  simpleFormatter,
  messageOnlyFormatter,
} from './basic';

// Detailed formatters
export {
  detailedFormatter,
  createDetailedFormatter,
} from './detailed';

// JSON formatters
export {
  createJsonFormatter,
  jsonFormatter,
} from './json';

// Colorized formatters
export {
  COLORS,
  createColorizedFormatter,
  colorizedFormatter,
} from './colorized';

// Custom utilities
export {
  createTemplateFormatter,
  combineFormatters,
  createConditionalFormatter,
} from './custom';

// Default formatters collection
export const formatters = {
  basic: basicFormatter,
  simple: simpleFormatter,
  messageOnly: messageOnlyFormatter,
  detailed: detailedFormatter,
  json: jsonFormatter,
  colorized: colorizedFormatter,
};