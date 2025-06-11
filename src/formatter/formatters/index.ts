// ==========================================
// src/formatter/formatters/index.ts - FORMATTERS PROFILS EXPORTS
// ==========================================
import { basicFormatter } from './basic.js';
import { simpleFormatter } from './basic.js';
import { messageOnlyFormatter } from './basic.js';
import { detailedFormatter } from './detailed.js';
import { colorizedFormatter } from './colorized.js';
import { jsonFormatter } from './json.js';

// Basic formatters
export {
  basicFormatter,
  simpleFormatter,
  messageOnlyFormatter,
} from './basic.js';

// Detailed formatters
export {
  detailedFormatter,
  createDetailedFormatter,
} from './detailed.js';

// JSON formatters
export {
  createJsonFormatter,
  jsonFormatter,
} from './json.js';

// Colorized formatters
export {
  COLORS,
  createColorizedFormatter,
  colorizedFormatter,
} from './colorized.js';

// Custom utilities
export {
  createTemplateFormatter,
  combineFormatters,
  createConditionalFormatter,
} from './custom.js';

// Default formatters collection
export const formatters = {
  basic: basicFormatter,
  simple: simpleFormatter,
  messageOnly: messageOnlyFormatter,
  detailed: detailedFormatter,
  json: jsonFormatter,
  colorized: colorizedFormatter,
};