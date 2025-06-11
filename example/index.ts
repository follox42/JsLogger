// ==========================================
// examples/index.ts - JSLOGGER EXAMPLES
// ==========================================

import { 
  getLogger, 
  basicConfig, 
  Level, 
  formatters, 
  handlers,
  presets,
  utils,
  createConsoleHandler,
  createMemoryHandler,
  createJsonHandler,
  type Formatter,
  type Handler
} from '../src';

// ==========================================
// 🚀 EXAMPLE 1: Basic Usage
// ==========================================

export function example1_basicUsage() {
  console.log('\n=== Example 1: Basic Usage ===');
  
  // Configure once at app startup
  basicConfig({ 
    level: Level.INFO,
    formatter: formatters.basic
  });
  
  // Get loggers anywhere in your app
  const log = getLogger('app.main');
  const dbLog = getLogger('app.database');
  const apiLog = getLogger('app.api');
  
  // Log at different levels
  log.debug('This won\'t show (level is INFO)');
  log.info('Application starting...');
  log.warning('This is a warning');
  log.error('Something went wrong!');
  
  dbLog.info('Connected to database');
  apiLog.info('API server started on port 3000');
}

// ==========================================
// 🎨 EXAMPLE 2: Custom Formatters
// ==========================================

export function example2_customFormatters() {
  console.log('\n=== Example 2: Custom Formatters ===');
  
  // Create a custom emoji formatter
  const emojiFormatter: Formatter = ({ levelName, name, message, timestamp }) => {
    const emojis = {
      'DEBUG': '🐛',
      'INFO': '📝',
      'WARNING': '⚠️',
      'ERROR': '❌',
      'CRITICAL': '💥'
    };
    
    const emoji = emojis[levelName as keyof typeof emojis] || '📝';
    const time = timestamp.toTimeString().slice(0, 8);
    
    return `${time} ${emoji} [${name}] ${message}`;
  };
  
  // Use different formatters for different loggers
  const basicLog = getLogger('basic');
  const emojiLog = getLogger('emoji');
  const jsonLog = getLogger('json');
  
  basicLog.addHandler(createConsoleHandler({ formatter: formatters.basic }));
  emojiLog.addHandler(createConsoleHandler({ formatter: emojiFormatter }));
  jsonLog.addHandler(createConsoleHandler({ formatter: formatters.json }));
  
  basicLog.info('Basic format message');
  emojiLog.info('Emoji format message');
  jsonLog.info('JSON format message');
}

// ==========================================
// 🔧 EXAMPLE 3: Multiple Handlers
// ==========================================

export function example3_multipleHandlers() {
  console.log('\n=== Example 3: Multiple Handlers ===');
  
  const log = getLogger('multi-handler');
  
  // Create memory handler for testing
  const memoryHandler = createMemoryHandler({ maxRecords: 100 });
  
  // Create JSON handler for structured logging  
  const jsonHandler = createJsonHandler({ pretty: true });
  
  // Add multiple handlers
  log.addHandler(createConsoleHandler({ formatter: formatters.detailed }));
  log.addHandler(memoryHandler.handler);
  log.addHandler(jsonHandler);
  
  log.info('This message goes to console, memory, and JSON output');
  log.error('Error message with context', { userId: 123, action: 'login' });
  
  // Check memory handler
  console.log('Memory handler has', memoryHandler.size(), 'records');
  console.log('Latest record:', memoryHandler.getRecords()[0]);
}

// ==========================================
// 🏗️ EXAMPLE 4: Hierarchical Loggers
// ==========================================

export function example4_hierarchicalLoggers() {
  console.log('\n=== Example 4: Hierarchical Loggers ===');
  
  // Create parent logger
  const appLog = getLogger('myapp');
  appLog.setLevel(Level.DEBUG);
  appLog.addHandler(createConsoleHandler({ 
    formatter: formatters.detailed 
  }));
  
  // Create child loggers - they inherit from parent
  const dbLog = getLogger('myapp.database');
  const authLog = getLogger('myapp.auth');
  const apiLog = getLogger('myapp.api.routes');
  
  // Child loggers inherit level and handlers from parent
  appLog.info('App starting');
  dbLog.debug('Connecting to database...');
  authLog.info('Auth module loaded');
  apiLog.debug('Setting up routes');
  
  // Override level for specific child
  authLog.setLevel(Level.WARNING);
  authLog.debug('This won\'t show - auth level is WARNING');
  authLog.warning('Invalid login attempt');
}

// ==========================================
// 🌍 EXAMPLE 5: Environment-based Configuration
// ==========================================

export function example5_environmentConfig() {
  console.log('\n=== Example 5: Environment Configuration ===');
  
  // Simulate different environments
  const environments = ['development', 'production', 'testing'];
  
  environments.forEach(env => {
    console.log(`\n--- ${env.toUpperCase()} Environment ---`);
    
    // Reset configuration
    const { reset } = require('../src');
    reset();
    
    // Configure based on environment
    switch (env) {
      case 'development':
        presets.development();
        break;
      case 'production':
        presets.production();
        break;
      case 'testing':
        presets.testing();
        break;
    }
    
    const log = getLogger('app');
    log.debug('Debug message');
    log.info('Info message');
    log.warning('Warning message');
    log.error('Error message');
  });
}

// ==========================================
// 💾 EXAMPLE 6: Advanced Memory Handler
// ==========================================

export function example6_advancedMemoryHandler() {
  console.log('\n=== Example 6: Advanced Memory Handler ===');
  
  const memoryHandler = createMemoryHandler({ 
    maxRecords: 5,
    level: Level.INFO,
    warnThreshold: 3
  });
  
  const log = getLogger('memory-test');
  log.addHandler(memoryHandler.handler);
  
  // Generate some logs
  for (let i = 1; i <= 7; i++) {
    log.info(`Message ${i}`);
  }
  
  console.log('Memory handler stats:', memoryHandler.getStats());
  console.log('Records by level INFO+:', memoryHandler.getRecordsByLevel(Level.INFO).length);
  console.log('Formatted logs:');
  memoryHandler.getFormattedLogs().forEach(log => console.log('  ', log));
  
  // Export as JSON
  console.log('\nExported JSON:');
  console.log(memoryHandler.exportAsJson());
}

// ==========================================
// ⚡ EXAMPLE 7: Performance Filtering
// ==========================================

export function example7_performanceFiltering() {
  console.log('\n=== Example 7: Performance Filtering ===');
  
  // Create handler with custom filter
  const performanceFilter = (record: any) => {
    // Only log errors and performance-related messages
    return record.level >= Level.ERROR || record.message.includes('performance');
  };
  
  const log = getLogger('performance');
  log.addHandler(createConsoleHandler({ 
    filter: performanceFilter,
    formatter: formatters.detailed
  }));
  
  log.debug('Regular debug message'); // Filtered out
  log.info('Regular info message'); // Filtered out
  log.info('Performance: Operation took 150ms'); // Shows up
  log.warning('Regular warning'); // Filtered out
  log.error('Critical error occurred'); // Shows up
}

// ==========================================
// 🚀 EXAMPLE 8: Quick Start Utilities
// ==========================================

export function example8_quickStartUtilities() {
  console.log('\n=== Example 8: Quick Start Utilities ===');
  
  // Quick logger creation
  const quickLog = utils.createQuickLogger('quick', Level.DEBUG);
  const jsonLog = utils.createJsonLogger('structured', Level.INFO);
  const colorLog = utils.createColorLogger('colorful', Level.INFO);
  
  quickLog.debug('Quick debug message');
  jsonLog.info('Structured info message');
  colorLog.warning('Colorful warning message');
}

// ==========================================
// 🎯 EXAMPLE 9: Real-world Application Pattern
// ==========================================

export function example9_realWorldPattern() {
  console.log('\n=== Example 9: Real-world Application Pattern ===');
  
  // Application setup
  class Application {
    private log = getLogger('app');
    private dbLog = getLogger('app.database');
    private apiLog = getLogger('app.api');
    
    constructor() {
      // Configure logging once
      basicConfig({
        level: Level.INFO,
        formatter: formatters.detailed
      });
      
      this.log.info('Application initialized');
    }
    
    async start() {
      this.log.info('Starting application...');
      
      try {
        await this.connectDatabase();
        await this.startApiServer();
        this.log.info('Application started successfully');
      } catch (error) {
        this.log.error('Failed to start application', error);
        throw error;
      }
    }
    
    private async connectDatabase() {
      this.dbLog.info('Connecting to database...');
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      this.dbLog.info('Database connected');
    }
    
    private async startApiServer() {
      this.apiLog.info('Starting API server...');
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));
      this.apiLog.info('API server listening on port 3000');
    }
    
    async handleRequest(userId: number) {
      const requestLog = this.apiLog.getChild('request');
      
      requestLog.info(`Processing request for user ${userId}`);
      
      try {
        // Simulate request processing
        await new Promise(resolve => setTimeout(resolve, 10));
        requestLog.info(`Request completed for user ${userId}`);
      } catch (error) {
        requestLog.error(`Request failed for user ${userId}`, error);
        throw error;
      }
    }
  }
  
  // Usage
  const app = new Application();
  app.start().then(() => {
    // Simulate some requests
    app.handleRequest(123);
    app.handleRequest(456);
  });
}

// ==========================================
// 🧪 EXAMPLE 10: Testing with Memory Handler
// ==========================================

export function example10_testingPattern() {
  console.log('\n=== Example 10: Testing Pattern ===');
  
  // Testing function
  function testUserLogin(username: string, password: string) {
    const log = getLogger('auth.login');
    
    log.info(`Login attempt for user: ${username}`);
    
    if (password === 'wrong') {
      log.warning(`Invalid password for user: ${username}`);
      return false;
    }
    
    if (username === 'blocked') {
      log.error(`Blocked user attempted login: ${username}`);
      return false;
    }
    
    log.info(`Successful login for user: ${username}`);
    return true;
  }
  
  // Test setup with memory handler
  const memoryHandler = createMemoryHandler();
  const log = getLogger('auth.login');
  log.addHandler(memoryHandler.handler);
  
  // Run tests
  testUserLogin('john', 'correct');
  testUserLogin('jane', 'wrong');
  testUserLogin('blocked', 'correct');
  
  // Verify logs
  const records = memoryHandler.getRecords();
  console.log(`Test generated ${records.length} log records:`);
  
  const warnings = memoryHandler.getRecordsByLevel(Level.WARNING);
  const errors = memoryHandler.getRecordsByLevel(Level.ERROR);
  
  console.log(`- ${warnings.length} warnings`);
  console.log(`- ${errors.length} errors`);
  
  // Assert specific logs
  const hasInvalidPasswordLog = records.some(r => 
    r.message.includes('Invalid password for user: jane')
  );
  const hasBlockedUserLog = records.some(r => 
    r.message.includes('Blocked user attempted login: blocked')
  );
  
  console.log(`✓ Invalid password logged: ${hasInvalidPasswordLog}`);
  console.log(`✓ Blocked user logged: ${hasBlockedUserLog}`);
}

// ==========================================
// 🏃 RUN ALL EXAMPLES
// ==========================================

export function runAllExamples() {
  console.log('🚀 JSLogger Examples Demo\n');
  
  try {
    example1_basicUsage();
    example2_customFormatters();
    example3_multipleHandlers();
    example4_hierarchicalLoggers();
    example5_environmentConfig();
    example6_advancedMemoryHandler();
    example7_performanceFiltering();
    example8_quickStartUtilities();
    example9_realWorldPattern();
    example10_testingPattern();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}