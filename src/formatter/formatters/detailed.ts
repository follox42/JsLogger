// ==========================================
// src/formatter/formatters/detailed.ts - DETAILED FORMATTER
// ==========================================
import { Formatter, LogRecord, FormatterConfig } from '../index.js';

/**
 * Format timestamp according to specified format
 */
function formatTimestamp(date: Date, format: FormatterConfig['timestampFormat'] = 'iso'): string {
  switch (format) {
    case 'iso':
      return date.toISOString();
    case 'locale':
      return date.toLocaleString();
    case 'short':
      return date.toISOString().replace('T', ' ').slice(0, 19);
    case 'time':
      return date.toTimeString().slice(0, 8);
    default:
      return date.toISOString();
  }
}

/**
 * Detailed formatter with timestamp
 * Format: "timestamp - LEVEL - name - message"
 */
export const detailedFormatter: Formatter = ({ timestamp, levelName, name, message }) => {
  const formattedTime = formatTimestamp(timestamp, 'iso');
  return `${formattedTime} - ${levelName} - ${name} - ${message}`;
};

/**
 * Create a configurable detailed formatter
 */
export function createDetailedFormatter(config: FormatterConfig = {}): Formatter {
  const {
    includeTimestamp = true,
    timestampFormat = 'iso',
    includeName = true,
    includeLevel = true,
    separator = ' - ',
    includeExtra = false,
  } = config;

  return (record: LogRecord): string => {
    const parts: string[] = [];

    if (includeTimestamp) {
      parts.push(formatTimestamp(record.timestamp, timestampFormat));
    }

    if (includeLevel) {
      parts.push(record.levelName);
    }

    if (includeName) {
      parts.push(record.name);
    }

    parts.push(record.message);

    if (includeExtra && record.extra) {
      const extraStr = Object.entries(record.extra)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(' ');
      if (extraStr) {
        parts.push(`[${extraStr}]`);
      }
    }

    return parts.join(separator);
  };
}