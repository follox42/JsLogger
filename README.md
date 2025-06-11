# JsLogger

> **Python‑style logging for TypeScript – familiar API, typed ergonomics.**

[![npm version](https://badge.fury.io/js/%40follox42%2Fjslogger.svg)](https://badge.fury.io/js/%40follox42%2Fjslogger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JsLogger brings the elegant simplicity of Python's `logging` module to the TypeScript ecosystem. If you've ever missed writing `logging.getLogger('my.module')` in JavaScript, this package is for you.

## Why JsLogger?

Coming from Python, I found myself missing the intuitive hierarchical logging system where you could simply write `getLogger('app.database')` and have it automatically inherit configuration from parent loggers. Most JavaScript logging libraries felt either too complex or too simplistic compared to Python's elegant approach.

JsLogger bridges that gap by providing:

- **Familiar Python-style API** - `getLogger()`, hierarchical names, child loggers
- **Full TypeScript support** - Typed levels, interfaces, and intelligent autocompletion
- **Structured logging** - Every log is a rich `LogRecord` object with metadata
- **Flexible output** - Console, files, JSON, memory, or custom handlers
- **Zero dependencies** - Lightweight and tree-shakable

## Quick Start

```bash
npm install @follox42/jslogger
```

```typescript
import { basicConfig, getLogger, Level } from "@follox42/jslogger";

// Configure once at app startup
basicConfig({
  level: Level.INFO,
  formatter: "detailed",
});

// Use anywhere in your app
const log = getLogger("app.main");
const dbLog = getLogger("app.database");

log.info("Application starting...");
dbLog.warning("Connection pool nearly full", { poolSize: 95 });
log.error("Authentication failed", { userId: 123, attempt: 3 });
```

Output:

```
2025-06-11T10:30:45.123Z - INFO - app.main - Application starting...
2025-06-11T10:30:45.456Z - WARNING - app.database - Connection pool nearly full
2025-06-11T10:30:45.789Z - ERROR - app.main - Authentication failed
```

## Core Concepts

### Hierarchical Loggers

JsLogger uses dot-separated names to create logger hierarchies, just like Python:

```typescript
const appLog = getLogger("myapp"); // Parent logger
const dbLog = getLogger("myapp.database"); // Child inherits from parent
const apiLog = getLogger("myapp.api.auth"); // Grandchild inherits from both
```

Child loggers automatically inherit configuration from their parents unless explicitly overridden.

### Log Levels

JsLogger provides five standard levels (matching Python exactly):

```typescript
import { Level } from "@follox42/jslogger";

log.debug("Detailed diagnostic info"); // Level.DEBUG (10)
log.info("General information"); // Level.INFO (20)
log.warning("Something unexpected"); // Level.WARNING (30)
log.error("Error occurred"); // Level.ERROR (40)
log.critical("Serious error occurred"); // Level.CRITICAL (50)
```

### LogRecord Objects

Every log event creates a structured `LogRecord` containing:

```typescript
interface LogRecord {
  name: string; // Logger name
  level: number; // Numeric level
  levelName: string; // Level name (INFO, ERROR, etc.)
  message: string; // Log message
  timestamp: Date; // When the log occurred
  args: any[]; // Additional arguments
  extra?: object; // Structured metadata
  exc_info?: object; // Exception details if present
}
```

## Advanced Usage

### Custom Formatters

Create formatters to control log output appearance:

```typescript
import {
  createDetailedFormatter,
  createJsonFormatter,
} from "@follox42/jslogger";

// Detailed formatter with custom timestamp
const customFormatter = createDetailedFormatter({
  timestampFormat: "locale",
  includeExtra: true,
  separator: " | ",
});

// JSON formatter for structured logging
const jsonFormatter = createJsonFormatter({
  pretty: true,
  includeAll: true,
});

basicConfig({ formatter: customFormatter });
```

### Multiple Handlers

Send logs to different destinations:

```typescript
import {
  createConsoleHandler,
  createFileHandler,
  createJsonHandler,
} from "@follox42/jslogger";

const log = getLogger("myapp");

// Console for development
log.addHandler(
  createConsoleHandler({
    level: Level.DEBUG,
    formatter: "colorized",
  })
);

// File for production (Node.js only)
log.addHandler(
  createFileHandler("./app.log", {
    level: Level.INFO,
    formatter: "detailed",
  })
);

// JSON for log aggregation
log.addHandler(
  createJsonHandler({
    level: Level.WARNING,
    pretty: false,
  })
);
```

### Environment-based Configuration

Quick presets for different environments:

```typescript
import { presets } from "@follox42/jslogger";

// Development: DEBUG level, colorized output
presets.development();

// Production: ERROR level, JSON output
presets.production();

// Testing: WARNING level, simple format
presets.testing();
```

### Testing with Memory Handler

Capture logs in memory for testing:

```typescript
import { createMemoryHandler } from "@follox42/jslogger";

const memoryHandler = createMemoryHandler({ maxRecords: 100 });
const log = getLogger("test");
log.addHandler(memoryHandler.handler);

// Run your code
log.info("Test message");
log.error("Test error");

// Verify logs in tests
const records = memoryHandler.getRecords();
expect(records).toHaveLength(2);
expect(records[0].message).toBe("Test message");

// Get formatted logs
const formatted = memoryHandler.getFormattedLogs();
console.log(formatted); // Array of formatted log strings
```

## API Reference

### Main Functions

#### `basicConfig(config)`

Configure the logging system globally.

```typescript
interface BasicConfig {
  level?: number; // Minimum level to log
  formatter?: Formatter; // Default formatter
  handlers?: Handler[]; // Default handlers
}
```

#### `getLogger(name?)`

Get or create a logger instance.

```typescript
const logger = getLogger("my.component");
```

#### `setLevel(logger, level)`

Set the minimum level for a logger.

```typescript
setLevel(logger, Level.DEBUG);
// or
logger.setLevel(Level.DEBUG);
```

### Formatters

| Formatter            | Description      | Example Output                                                     |
| -------------------- | ---------------- | ------------------------------------------------------------------ |
| `basicFormatter`     | Simple format    | `INFO:app.main:Application started`                                |
| `detailedFormatter`  | With timestamp   | `2025-06-11T10:30:45.123Z - INFO - app.main - Application started` |
| `jsonFormatter`      | JSON structure   | `{"timestamp":"2025-06-11T10:30:45.123Z","level":"INFO",...}`      |
| `colorizedFormatter` | Colorized output | <span style="color: cyan">INFO</span> app.main Application started |

### Handlers

| Handler                         | Environment | Description                          |
| ------------------------------- | ----------- | ------------------------------------ |
| `createConsoleHandler()`        | Universal   | Output to console                    |
| `createFileHandler()`           | Node.js     | Write to file                        |
| `createJsonHandler()`           | Universal   | Structured JSON output               |
| `createMemoryHandler()`         | Universal   | Store in memory (testing)            |
| `createBrowserStorageHandler()` | Browser     | Store in localStorage/sessionStorage |

## Browser Support

JsLogger works in all modern browsers and Node.js environments. In browsers, some handlers like `createFileHandler()` are not available, but you can use `createBrowserStorageHandler()` for persistence.

## Performance

JsLogger is designed for minimal performance impact:

- **Zero-cost abstractions** - Disabled log levels are completely skipped
- **Lazy evaluation** - Expensive operations only run when needed
- **Tree-shakable** - Import only what you use
- **No dependencies** - Lightweight bundle size

## Migration from Other Libraries

### From `console.log`

```typescript
// Before
console.log("User logged in:", userId);
console.error("Database error:", error);

// After
const log = getLogger("auth");
log.info("User logged in", { userId });
log.error("Database error", error);
```

### From Winston

```typescript
// Before (Winston)
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// After (JsLogger)
import { basicConfig, getLogger } from "@follox42/jslogger";
basicConfig({ level: Level.INFO, formatter: "json" });
const logger = getLogger("app");
```

## Contributing

This is my first npm package, and I'm eager to learn and improve! If you find bugs, have suggestions, or want to contribute features:

1. **Issues** - Report bugs or request features on GitHub
2. **Pull Requests** - Contributions are welcome (please include tests)
3. **Feedback** - Let me know how you're using JsLogger and what could be better

## Roadmap

Future versions might include:

- Plugin system for custom extensions
- Integration with monitoring services (Datadog, New Relic)
- Performance monitoring and metrics
- WebSocket and database handlers
- Advanced filtering and sampling

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Inspired by Python's excellent `logging` module and the need for similar elegance in the TypeScript ecosystem. Thanks to the JavaScript community for the wealth of knowledge and open source examples that made this possible.

---

**Questions or feedback?** Open an issue on GitHub or reach out - I'd love to hear how you're using JsLogger!
