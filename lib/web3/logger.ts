/**
 * Frontend Logger for ArbitrageX
 * Structured logging compatible with Vercel Analytics and error tracking
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  private formatMessage(entry: LogEntry): string {
    const context = entry.context ? `[${entry.context}]` : '';
    return `${context} ${entry.message}`;
  }

  private log(entry: Omit<LogEntry, 'timestamp'>) {
    const formattedEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // Console output in development
    if (this.isDevelopment) {
      const message = this.formatMessage(formattedEntry);
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(message, formattedEntry.data || '');
          break;
        case LogLevel.INFO:
          console.info(message, formattedEntry.data || '');
          break;
        case LogLevel.WARN:
          console.warn(message, formattedEntry.data || '');
          break;
        case LogLevel.ERROR:
          console.error(message, formattedEntry.error || formattedEntry.data || '');
          break;
      }
    }

    // In production, send to error tracking service
    // This is a placeholder for services like Sentry, LogRocket, or Vercel Analytics
    if (!this.isDevelopment && (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN)) {
      this.sendToTracking(formattedEntry);
    }
  }

  private sendToTracking(entry: LogEntry) {
    // Placeholder for error tracking integration
    // Example: Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.data })
    // Example: Vercel Analytics.track('error', { message: entry.message, context: entry.context })

    // Store in sessionStorage for debugging
    try {
      const errorLog = JSON.parse(sessionStorage.getItem('arbitragex_errors') || '[]');
      errorLog.push({
        ...entry,
        // Only keep last 50 errors
        slice: -50,
      });
      sessionStorage.setItem('arbitragex_errors', JSON.stringify(errorLog.slice(-50)));
    } catch {
      // Ignore sessionStorage errors
    }
  }

  debug(message: string, context?: string, data?: Record<string, unknown>) {
    this.log({ level: LogLevel.DEBUG, message, context, data });
  }

  info(message: string, context?: string, data?: Record<string, unknown>) {
    this.log({ level: LogLevel.INFO, message, context, data });
  }

  warn(message: string, context?: string, data?: Record<string, unknown>) {
    this.log({ level: LogLevel.WARN, message, context, data });
  }

  error(message: string, context?: string, error?: Error, data?: Record<string, unknown>) {
    this.log({
      level: LogLevel.ERROR,
      message,
      context,
      data,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }

  // Web3 specific logging
  logContractCall(contractName: string, functionName: string, args?: unknown[]) {
    this.info(`Contract call: ${functionName}`, contractName, { args });
  }

  logContractError(contractName: string, functionName: string, error: unknown) {
    this.error(
      `Contract error: ${functionName}`,
      contractName,
      error instanceof Error ? error : undefined,
      { error }
    );
  }

  logTransaction(hash: string, type: 'pending' | 'success' | 'error', data?: Record<string, unknown>) {
    this.info(`Transaction ${type}`, 'Transaction', { hash, ...data });
  }

  logWalletEvent(event: 'connect' | 'disconnect' | 'account_change' | 'network_change', data?: Record<string, unknown>) {
    this.info(`Wallet ${event}`, 'Wallet', data);
  }

  // Get recent errors for debugging
  getRecentErrors(): LogEntry[] {
    try {
      return JSON.parse(sessionStorage.getItem('arbitragex_errors') || '[]');
    } catch {
      return [];
    }
  }

  // Clear error log
  clearErrors() {
    sessionStorage.removeItem('arbitragex_errors');
  }
}

// Singleton instance
export const logger = new Logger();

// Context constants for consistent logging
export const LOG_CONTEXT = {
  CONTRACT: 'Contract',
  WALLET: 'Wallet',
  NETWORK: 'Network',
  TRANSACTION: 'Transaction',
  VALIDATION: 'Validation',
  UI: 'UI',
} as const;
