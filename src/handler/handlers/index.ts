// ==========================================
// src/handler/handlers/index.ts - CLEAN EXPORTS
// ==========================================
export type { 
  ConsoleHandlerConfig
} from './console'; 

export type { 
  FileHandlerConfig
} from './file';

export type { 
  StreamHandlerConfig,
} from './stream';

export type {
  JsonHandlerConfig
} from './json';

export type {
  MemoryHandlerConfig,
  MemoryHandlerAPI
} from './memory';

export type {
  BrowserStorageConfig,
  BrowserStorageAPI
} from './browser';

// Factory functions
export { createConsoleHandler } from './console';
export { createFileHandler } from './file';
export { createMemoryHandler } from './memory';
export { createBrowserStorageHandler } from './browser';
export { createStreamHandler } from './stream';
export { createJsonHandler } from './json';