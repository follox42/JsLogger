"use strict";
// ==========================================
// examples/index.ts - JSLOGGER EXAMPLES
// ==========================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.example1_basicUsage = example1_basicUsage;
exports.example2_customFormatters = example2_customFormatters;
exports.example3_multipleHandlers = example3_multipleHandlers;
exports.example4_hierarchicalLoggers = example4_hierarchicalLoggers;
exports.example5_environmentConfig = example5_environmentConfig;
exports.example6_advancedMemoryHandler = example6_advancedMemoryHandler;
exports.example7_performanceFiltering = example7_performanceFiltering;
exports.example8_quickStartUtilities = example8_quickStartUtilities;
exports.example9_realWorldPattern = example9_realWorldPattern;
exports.example10_testingPattern = example10_testingPattern;
exports.runAllExamples = runAllExamples;
const src_1 = require("../src");
// ==========================================
// 🚀 EXAMPLE 1: Basic Usage
// ==========================================
function example1_basicUsage() {
    console.log('\n=== Example 1: Basic Usage ===');
    // Configure once at app startup
    (0, src_1.basicConfig)({
        level: src_1.Level.INFO,
        formatter: src_1.formatters.basic
    });
    // Get loggers anywhere in your app
    const log = (0, src_1.getLogger)('app.main');
    const dbLog = (0, src_1.getLogger)('app.database');
    const apiLog = (0, src_1.getLogger)('app.api');
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
function example2_customFormatters() {
    console.log('\n=== Example 2: Custom Formatters ===');
    // Create a custom emoji formatter
    const emojiFormatter = ({ levelName, name, message, timestamp }) => {
        const emojis = {
            'DEBUG': '🐛',
            'INFO': '📝',
            'WARNING': '⚠️',
            'ERROR': '❌',
            'CRITICAL': '💥'
        };
        const emoji = emojis[levelName] || '📝';
        const time = timestamp.toTimeString().slice(0, 8);
        return `${time} ${emoji} [${name}] ${message}`;
    };
    // Use different formatters for different loggers
    const basicLog = (0, src_1.getLogger)('basic');
    const emojiLog = (0, src_1.getLogger)('emoji');
    const jsonLog = (0, src_1.getLogger)('json');
    basicLog.addHandler((0, src_1.createConsoleHandler)({ formatter: src_1.formatters.basic }));
    emojiLog.addHandler((0, src_1.createConsoleHandler)({ formatter: emojiFormatter }));
    jsonLog.addHandler((0, src_1.createConsoleHandler)({ formatter: src_1.formatters.json }));
    basicLog.info('Basic format message');
    emojiLog.info('Emoji format message');
    jsonLog.info('JSON format message');
}
// ==========================================
// 🔧 EXAMPLE 3: Multiple Handlers
// ==========================================
function example3_multipleHandlers() {
    console.log('\n=== Example 3: Multiple Handlers ===');
    const log = (0, src_1.getLogger)('multi-handler');
    // Create memory handler for testing
    const memoryHandler = (0, src_1.createMemoryHandler)({ maxRecords: 100 });
    // Create JSON handler for structured logging  
    const jsonHandler = (0, src_1.createJsonHandler)({ pretty: true });
    // Add multiple handlers
    log.addHandler((0, src_1.createConsoleHandler)({ formatter: src_1.formatters.detailed }));
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
function example4_hierarchicalLoggers() {
    console.log('\n=== Example 4: Hierarchical Loggers ===');
    // Create parent logger
    const appLog = (0, src_1.getLogger)('myapp');
    appLog.setLevel(src_1.Level.DEBUG);
    appLog.addHandler((0, src_1.createConsoleHandler)({
        formatter: src_1.formatters.detailed
    }));
    // Create child loggers - they inherit from parent
    const dbLog = (0, src_1.getLogger)('myapp.database');
    const authLog = (0, src_1.getLogger)('myapp.auth');
    const apiLog = (0, src_1.getLogger)('myapp.api.routes');
    // Child loggers inherit level and handlers from parent
    appLog.info('App starting');
    dbLog.debug('Connecting to database...');
    authLog.info('Auth module loaded');
    apiLog.debug('Setting up routes');
    // Override level for specific child
    authLog.setLevel(src_1.Level.WARNING);
    authLog.debug('This won\'t show - auth level is WARNING');
    authLog.warning('Invalid login attempt');
}
// ==========================================
// 🌍 EXAMPLE 5: Environment-based Configuration
// ==========================================
function example5_environmentConfig() {
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
                src_1.presets.development();
                break;
            case 'production':
                src_1.presets.production();
                break;
            case 'testing':
                src_1.presets.testing();
                break;
        }
        const log = (0, src_1.getLogger)('app');
        log.debug('Debug message');
        log.info('Info message');
        log.warning('Warning message');
        log.error('Error message');
    });
}
// ==========================================
// 💾 EXAMPLE 6: Advanced Memory Handler
// ==========================================
function example6_advancedMemoryHandler() {
    console.log('\n=== Example 6: Advanced Memory Handler ===');
    const memoryHandler = (0, src_1.createMemoryHandler)({
        maxRecords: 5,
        level: src_1.Level.INFO,
        warnThreshold: 3
    });
    const log = (0, src_1.getLogger)('memory-test');
    log.addHandler(memoryHandler.handler);
    // Generate some logs
    for (let i = 1; i <= 7; i++) {
        log.info(`Message ${i}`);
    }
    console.log('Memory handler stats:', memoryHandler.getStats());
    console.log('Records by level INFO+:', memoryHandler.getRecordsByLevel(src_1.Level.INFO).length);
    console.log('Formatted logs:');
    memoryHandler.getFormattedLogs().forEach(log => console.log('  ', log));
    // Export as JSON
    console.log('\nExported JSON:');
    console.log(memoryHandler.exportAsJson());
}
// ==========================================
// ⚡ EXAMPLE 7: Performance Filtering
// ==========================================
function example7_performanceFiltering() {
    console.log('\n=== Example 7: Performance Filtering ===');
    // Create handler with custom filter
    const performanceFilter = (record) => {
        // Only log errors and performance-related messages
        return record.level >= src_1.Level.ERROR || record.message.includes('performance');
    };
    const log = (0, src_1.getLogger)('performance');
    log.addHandler((0, src_1.createConsoleHandler)({
        filter: performanceFilter,
        formatter: src_1.formatters.detailed
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
function example8_quickStartUtilities() {
    console.log('\n=== Example 8: Quick Start Utilities ===');
    // Quick logger creation
    const quickLog = src_1.utils.createQuickLogger('quick', src_1.Level.DEBUG);
    const jsonLog = src_1.utils.createJsonLogger('structured', src_1.Level.INFO);
    const colorLog = src_1.utils.createColorLogger('colorful', src_1.Level.INFO);
    quickLog.debug('Quick debug message');
    jsonLog.info('Structured info message');
    colorLog.warning('Colorful warning message');
}
// ==========================================
// 🎯 EXAMPLE 9: Real-world Application Pattern
// ==========================================
function example9_realWorldPattern() {
    console.log('\n=== Example 9: Real-world Application Pattern ===');
    // Application setup
    class Application {
        constructor() {
            this.log = (0, src_1.getLogger)('app');
            this.dbLog = (0, src_1.getLogger)('app.database');
            this.apiLog = (0, src_1.getLogger)('app.api');
            // Configure logging once
            (0, src_1.basicConfig)({
                level: src_1.Level.INFO,
                formatter: src_1.formatters.detailed
            });
            this.log.info('Application initialized');
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.log.info('Starting application...');
                try {
                    yield this.connectDatabase();
                    yield this.startApiServer();
                    this.log.info('Application started successfully');
                }
                catch (error) {
                    this.log.error('Failed to start application', error);
                    throw error;
                }
            });
        }
        connectDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                this.dbLog.info('Connecting to database...');
                // Simulate async operation
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.dbLog.info('Database connected');
            });
        }
        startApiServer() {
            return __awaiter(this, void 0, void 0, function* () {
                this.apiLog.info('Starting API server...');
                // Simulate async operation
                yield new Promise(resolve => setTimeout(resolve, 50));
                this.apiLog.info('API server listening on port 3000');
            });
        }
        handleRequest(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                const requestLog = this.apiLog.getChild('request');
                requestLog.info(`Processing request for user ${userId}`);
                try {
                    // Simulate request processing
                    yield new Promise(resolve => setTimeout(resolve, 10));
                    requestLog.info(`Request completed for user ${userId}`);
                }
                catch (error) {
                    requestLog.error(`Request failed for user ${userId}`, error);
                    throw error;
                }
            });
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
function example10_testingPattern() {
    console.log('\n=== Example 10: Testing Pattern ===');
    // Testing function
    function testUserLogin(username, password) {
        const log = (0, src_1.getLogger)('auth.login');
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
    const memoryHandler = (0, src_1.createMemoryHandler)();
    const log = (0, src_1.getLogger)('auth.login');
    log.addHandler(memoryHandler.handler);
    // Run tests
    testUserLogin('john', 'correct');
    testUserLogin('jane', 'wrong');
    testUserLogin('blocked', 'correct');
    // Verify logs
    const records = memoryHandler.getRecords();
    console.log(`Test generated ${records.length} log records:`);
    const warnings = memoryHandler.getRecordsByLevel(src_1.Level.WARNING);
    const errors = memoryHandler.getRecordsByLevel(src_1.Level.ERROR);
    console.log(`- ${warnings.length} warnings`);
    console.log(`- ${errors.length} errors`);
    // Assert specific logs
    const hasInvalidPasswordLog = records.some(r => r.message.includes('Invalid password for user: jane'));
    const hasBlockedUserLog = records.some(r => r.message.includes('Blocked user attempted login: blocked'));
    console.log(`✓ Invalid password logged: ${hasInvalidPasswordLog}`);
    console.log(`✓ Blocked user logged: ${hasBlockedUserLog}`);
}
// ==========================================
// 🏃 RUN ALL EXAMPLES
// ==========================================
function runAllExamples() {
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
    }
    catch (error) {
        console.error('❌ Example failed:', error);
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
}
