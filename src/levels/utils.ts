// ==========================================
// src/levels/utils.ts - LEVEL UTILITIES
// ==========================================
import { Level, isValidLevel, getLevelByName } from './levels';

/**
 * Level configuration for different environments
 */
export const LEVEL_CONFIGS = {
  development: Level.DEBUG,
  testing: Level.WARNING,
  staging: Level.INFO,
  production: Level.ERROR,
} as const;

/**
 * Get level for current environment
 */
export function getLevelForEnvironment(env?: string): number {
  const environment = env || process?.env?.NODE_ENV || 'development';
  return LEVEL_CONFIGS[environment as keyof typeof LEVEL_CONFIGS] || Level.INFO;
}

/**
 * Parse level from string or number
 */
export function parseLevel(level: string | number): number {
  if (typeof level === 'number') {
    return isValidLevel(level) ? level : Level.INFO;
  }
  
  const parsed = getLevelByName(level);
  return parsed !== null ? parsed : Level.INFO;
}