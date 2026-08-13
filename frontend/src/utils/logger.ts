const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const

type LogLevel = keyof typeof LOG_LEVELS

const currentLevel =
  LOG_LEVELS[(import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info'] ?? LOG_LEVELS.info

function shouldLog(level: LogLevel): boolean {
  return currentLevel >= LOG_LEVELS[level]
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) console.debug(...args)
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.info(...args)
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error(...args)
  }
}
