// ==========================================
// src/handler/handlers/index.ts - CLEAN EXPORTS
// ==========================================
export type { 
  ConsoleHandlerConfig
} from './console.js'; 

export type { 
  FileHandlerConfig
} from './file.js';

export type { 
  StreamHandlerConfig,
} from './stream.js';

export type {
  JsonHandlerConfig
} from './json.js';

export type {
  MemoryHandlerConfig,
  MemoryHandlerAPI
} from './memory.js';

export type {
  BrowserStorageConfig,
  BrowserStorageAPI
} from './browser.js';

// Factory functions
export { createConsoleHandler } from './console.js';
export { createFileHandler } from './file.js';
export { createMemoryHandler } from './memory.js';
export { createBrowserStorageHandler } from './browser.js';
export { createStreamHandler } from './stream.js';
export { createJsonHandler } from './json.js';