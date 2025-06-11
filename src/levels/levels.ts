// ==========================================
// src/levels/levels.ts - LOG LEVELS
// ==========================================

/**
 * Log levels matching Python's logging module exactly
 */
export enum Level {
  NOTSET = 0,
  DEBUG = 10,
  INFO = 20,
  WARNING = 30,
  WARN = WARNING,     // Alias for WARNING
  ERROR = 40,
  CRITICAL = 50,
  FATAL = CRITICAL,    // Alias for CRITICAL
}

/**
 * Level names mapping (like Python)
 */
export const LEVEL_TO_NAMES: Record<number, string> = {
  [Level.NOTSET]: 'NOTSET',
  [Level.DEBUG]: 'DEBUG',
  [Level.INFO]: 'INFO',
  [Level.WARNING]: 'WARNING',
  [Level.ERROR]: 'ERROR',
  [Level.CRITICAL]: 'CRITICAL',
};

/**
 * Reverse mapping for name to level
 */
export const NAME_TO_LEVEL: Record<string, number> = {
  'NOTSET': Level.NOTSET,
  'DEBUG': Level.DEBUG,
  'INFO': Level.INFO,
  'WARNING': Level.WARNING,
  'WARN': Level.WARNING,
  'ERROR': Level.ERROR,
  'CRITICAL': Level.CRITICAL,
  'FATAL': Level.CRITICAL,
};

/**
 * Get level name from numeric level
 */
export function getLevelName(level: number): string {
  return LEVEL_TO_NAMES[level] || `Level ${level}`;
}

/**
 * Get numeric level from name (case insensitive)
 */
export function getLevelByName(name: string): number | null {
  const upperName = name.toUpperCase();
  return NAME_TO_LEVEL[upperName] ?? null;
}

/**
 * Check if a level is valid
 */
export function isValidLevel(level: number): boolean {
  return typeof level === 'number' && level >= 0;
}

/**
 * Get effective level (resolves NOTSET to a concrete level)
 */
export function getEffectiveLevel(level: number, fallback: number = Level.WARNING): number {
  return level === Level.NOTSET ? fallback : level;
}

/**
 * Compare two levels
 */
export function isLevelEnabled(currentLevel: number, requiredLevel: number): boolean {
  return currentLevel <= requiredLevel;
}