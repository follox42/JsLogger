#!/usr/bin/env node

// ==========================================
// demo.ts - JSLOGGER QUICK DEMO
// ==========================================

import {
  getLogger,
  basicConfig,
  Level,
  formatters,
  presets,
  utils,
  createConsoleHandler,
  createMemoryHandler,
  createJsonHandler,
  type Formatter
} from './src';

console.log('🚀 JSLogger Demo\n');

// ==========================================
// Demo 1: Basic Usage
// ==========================================

console.log('=== Demo 1: Basic Usage ===');

// Configure logging
basicConfig({
  level: Level.INFO,
  formatter: formatters.detailed
});

const log = getLogger('demo.app');
const dbLog = getLogger('demo.app.database');
const apiLog = getLogger('demo.app.api');

log.info('Application starting...');
dbLog.info('Connecting to database');
apiLog.info('Starting HTTP server on port 3000');

log.debug('This debug message won\'t show (level is INFO)');
log.warning('This is a warning message');
log.error('This is an error message');

// ==========================================
// Demo 2: Custom Formatter
// ==========================================

console.log('\n=== Demo 2: Custom Formatters ===');

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

const emojiLog = getLogger('demo.emoji');
emojiLog.addHandler(createConsoleHandler({ formatter: emojiFormatter }));

emojiLog.info('This message has emojis! 🎉');
emojiLog.warning('Be careful with this operation');
emojiLog.error('Something went wrong!');

// ==========================================
// Demo 3: JSON Structured Logging
// ==========================================

console.log('\n=== Demo 3: JSON Structured Logging ===');

const jsonLog = getLogger('demo.json');
jsonLog.addHandler(createJsonHandler({ pretty: true }));

jsonLog.info('User login event', {
  userId: 12345,
  email: 'user@example.com',
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: new Date()
});

// ==========================================
// Demo 4: Memory Handler for Testing
// ==========================================

console.log('\n=== Demo 4: Memory Handler ===');

const memoryHandler = createMemoryHandler({ maxRecords: 10 });
const testLog = getLogger('demo.test');
testLog.addHandler(memoryHandler.handler);

// Generate some test logs
testLog.info('Test message 1');
testLog.warning('Test warning');
testLog.error('Test error');
testLog.info('Test message 2');

console.log(`Memory handler captured ${memoryHandler.size()} records`);
console.log('Records:', memoryHandler.getFormattedLogs());
console.log('Stats:', memoryHandler.getStats());

// ==========================================
// Demo 5: Environment Presets
// ==========================================

console.log('\n=== Demo 5: Environment Presets ===');

// Simulate different environments
const environments = ['development', 'production', 'testing'];

environments.forEach(env => {
  console.log(`\n--- ${env.toUpperCase()} Environment ---`);
  
  // Reset and configure for environment
  const { reset } = require('./src');
  reset();
  
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
  
  const envLog = getLogger('demo.env');
  envLog.debug('Debug message (may not show)');
  envLog.info('Info message');
  envLog.warning('Warning message');
  envLog.error('Error message');
});

// ==========================================
// Demo 6: Quick Utilities
// ==========================================

console.log('\n=== Demo 6: Quick Utilities ===');

const quickLog = utils.createQuickLogger('quick', Level.DEBUG);
const colorLog = utils.createColorLogger('colorful', Level.INFO);

quickLog.debug('Quick debug message');
quickLog.info('Quick info message');

colorLog.info('Colorful info message');
colorLog.warning('Colorful warning message');

// ==========================================
// Demo 7: Real-world Example
// ==========================================

console.log('\n=== Demo 7: Real-world Example ===');

class UserService {
  private log = getLogger('demo.userservice');
  
  constructor() {
    this.log.info('UserService initialized');
  }
  
  async createUser(email: string): Promise<{ id: number; email: string } | null> {
    const requestId = Math.random().toString(36).substr(2, 9);
    const requestLog = this.log.getChild(`request.${requestId}`);
    
    requestLog.info(`Creating user with email: ${email}`);
    
    try {
      // Simulate validation
      if (!email.includes('@')) {
        requestLog.warning(`Invalid email format: ${email}`);
        return null;
      }
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const user = { id: Math.floor(Math.random() * 1000), email };
      requestLog.info(`User created successfully`, { userId: user.id });
      
      return user;
    } catch (error) {
      requestLog.error(`Failed to create user: ${error}`);
      throw error;
    }
  }
}

async function runRealWorldDemo() {
  const userService = new UserService();
  
  await userService.createUser('john@example.com');
  await userService.createUser('invalid-email');
  await userService.createUser('jane@example.com');
}

// Run the demo
runRealWorldDemo().then(() => {
  console.log('\n✅ Demo completed successfully!');
  console.log('\nTry running different examples:');
  console.log('- npm run examples');
  console.log('- npm run dev');
  console.log('- npm test');
}).catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});