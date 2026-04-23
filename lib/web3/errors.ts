/**
 * Contract Error Utilities
 * Parses and formats contract errors for user-friendly display
 */

export interface ContractError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'warning' | 'error' | 'critical';
  action?: string;
}

/**
 * Parses contract errors into user-friendly messages
 */
export function parseContractError(error: unknown): ContractError {
  // Base error object
  const baseError: ContractError = {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again.',
    severity: 'error',
  };

  if (!error) {
    return baseError;
  }

  // Generic Error
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // User rejected transaction
    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        code: 'USER_REJECTED',
        message: error.message,
        userMessage: 'Transaction cancelled by user.',
        severity: 'warning',
      };
    }

    // Insufficient funds
    if (message.includes('insufficient funds') || message.includes('exceeds balance')) {
      return {
        code: 'INSUFFICIENT_FUNDS',
        message: error.message,
        userMessage: 'Insufficient funds for this transaction. Please add more ETH to your wallet.',
        severity: 'error',
        action: 'Get Sepolia ETH from a faucet',
      };
    }

    // Network error
    if (message.includes('network') || message.includes('rpc') || message.includes('timeout')) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        userMessage: 'Network error. Please check your connection and try again.',
        severity: 'error',
      };
    }

    // Contract revert
    if (message.includes('revert') || message.includes('execution reverted')) {
      return {
        code: 'CONTRACT_REVERT',
        message: error.message,
        userMessage: 'Transaction failed. The contract execution reverted.',
        severity: 'error',
      };
    }

    // Gas estimation failed
    if (message.includes('gas estimation failed') || message.includes('gas required')) {
      return {
        code: 'GAS_ESTIMATION_FAILED',
        message: error.message,
        userMessage: 'Transaction would fail. Please check your inputs and try again.',
        severity: 'error',
      };
    }

    // Wrong network
    if (message.includes('chain') || message.includes('network mismatch')) {
      return {
        code: 'WRONG_NETWORK',
        message: error.message,
        userMessage: 'Please switch to Sepolia testnet to continue.',
        severity: 'warning',
        action: 'Switch network in your wallet',
      };
    }

    // Return original message if no match
    return {
      ...baseError,
      message: error.message,
      userMessage: error.message.slice(0, 200),
    };
  }

  // Contract error from wagmi/viem
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: number; message?: string; data?: unknown; shortMessage?: string };

    // Error codes from viem
    if (err.code) {
      // User rejected (code 4001)
      if (err.code === 4001) {
        return {
          code: 'USER_REJECTED',
          message: err.shortMessage || err.message || 'User rejected transaction',
          userMessage: 'Transaction cancelled.',
          severity: 'warning',
        };
      }

      // Unauthorized (code 4100)
      if (err.code === 4100) {
        return {
          code: 'UNAUTHORIZED',
          message: err.shortMessage || err.message || 'Unauthorized',
          userMessage: 'You are not authorized to perform this action.',
          severity: 'error',
        };
      }

      // Unsupported method (code 4200)
      if (err.code === 4200) {
        return {
          code: 'UNSUPPORTED_METHOD',
          message: err.shortMessage || err.message || 'Method not supported',
          userMessage: 'This action is not supported by your wallet.',
          severity: 'error',
        };
      }

      // Limit exceeded (code 4900)
      if (err.code === 4900) {
        return {
          code: 'REQUEST_LIMIT',
          message: err.shortMessage || err.message || 'Request limit exceeded',
          userMessage: 'Too many requests. Please wait a moment and try again.',
          severity: 'error',
        };
      }
    }

    return {
      ...baseError,
      message: err.shortMessage || err.message || JSON.stringify(error),
      userMessage: 'Transaction failed. Check console for details.',
    };
  }

  // String error
  if (typeof error === 'string') {
    const lower = error.toLowerCase();

    if (lower.includes('user rejected') || lower.includes('user denied')) {
      return {
        code: 'USER_REJECTED',
        message: error,
        userMessage: 'Transaction cancelled.',
        severity: 'warning',
      };
    }

    return {
      ...baseError,
      message: error,
      userMessage: error.slice(0, 200),
    };
  }

  return baseError;
}

/**
 * Gets a user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  return parseContractError(error).userMessage;
}

/**
 * Gets error severity level
 */
export function getErrorSeverity(error: unknown): ContractError['severity'] {
  return parseContractError(error).severity;
}

/**
 * Checks if error is a user rejection (should not show as error)
 */
export function isUserRejection(error: unknown): boolean {
  return parseContractError(error).code === 'USER_REJECTED';
}

/**
 * Gets recommended action for error
 */
export function getErrorAction(error: unknown): string | undefined {
  return parseContractError(error).action;
}
