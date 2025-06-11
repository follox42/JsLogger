// ==========================================
// src/formatter/formatters/basic.ts - BASIC FORMATTER
// ==========================================
import { Formatter } from '../index.js';

/**
 * Basic formatter matching Python's default format
 * Format: "LEVEL:name:message"
 */
export const basicFormatter: Formatter = ({ levelName, name, message }) => {
  return `${levelName}:${name}:${message}`;
};

/**
 * Simple formatter with just level and message
 * Format: "LEVEL: message"
 */
export const simpleFormatter: Formatter = ({ levelName, message }) => {
  return `${levelName}: ${message}`;
};

/**
 * Message-only formatter
 * Format: "message"
 */
export const messageOnlyFormatter: Formatter = ({ message }) => {
  return message;
};