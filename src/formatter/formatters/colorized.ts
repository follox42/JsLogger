// ==========================================
// src/formatter/formatters/colorized.ts - COLORIZED FORMATTER
// ==========================================
import { Formatter, LogRecord } from '../';

/**
 * ANSI color codes
 */
export const COLORS = {
  DEBUG: '\x1b[37m',    // White
  INFO: '\x1b[36m',     // Cyan
  WARNING: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m',    // Red
  CRITICAL: '\x1b[91m', // Bright Red
  RESET: '\x1b[0m',     // Reset
  
  // Additional colors
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERLINE: '\x1b[4m',
} as const;

/**
 * Color configuration
 */
export interface ColorConfig {
  /** Enable/disable colors */
  enabled?: boolean;
  
  /** Color mapping for levels */
  levelColors?: Record<string, string>;
  
  /** Color for timestamp */
  timestampColor?: string;
  
  /** Color for logger name */
  nameColor?: string;
  
  /** Color for message */
  messageColor?: string;
}

/**
 * Check if colors should be enabled (TTY detection)
 */
function shouldEnableColors(): boolean {
  // Browser environment
  if (typeof window !== 'undefined') {
    return false; // No ANSI colors in browser console
  }
  
  // Node.js environment
  if (typeof process !== 'undefined') {
    return Boolean(process.stdout?.isTTY);
  }
  
  return false;
}

/**
 * Apply color to text
 */
function colorize(text: string, color: string, enabled: boolean = true): string {
  if (!enabled) return text;
  return `${color}${text}${COLORS.RESET}`;
}

/**
 * Create colorized formatter
 */
export function createColorizedFormatter(config: ColorConfig = {}): Formatter {
  const {
    enabled = shouldEnableColors(),
    levelColors = {
      DEBUG: COLORS.DEBUG,
      INFO: COLORS.INFO,
      WARNING: COLORS.WARNING,
      ERROR: COLORS.ERROR,
      CRITICAL: COLORS.CRITICAL,
    },
    timestampColor = COLORS.DIM,
    nameColor = COLORS.DIM,
    messageColor = '',
  } = config;

  return (record: LogRecord): string => {
    const timestamp = colorize(
      record.timestamp.toISOString(),
      timestampColor,
      enabled
    );
    
    const level = colorize(
      record.levelName,
      levelColors[record.levelName] || '',
      enabled
    );
    
    const name = colorize(record.name, nameColor, enabled);
    const message = colorize(record.message, messageColor, enabled);

    return `${timestamp} ${level} ${name} ${message}`;
  };
}

/**
 * Default colorized formatter
 */
export const colorizedFormatter = createColorizedFormatter();