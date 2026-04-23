/**
 * Transaction Status and Feedback Components
 */

'use client';

import React from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { TransactionStatus } from '@/lib/web3/transactions';
import { getEtherscanUrl } from '@/lib/web3/transactions';
import { parseContractError } from '@/lib/web3/errors';

interface TransactionStatusIndicatorProps {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: Error | unknown;
  onReset?: () => void;
}

/**
 * Displays transaction status with icon and message
 */
export function TransactionStatusIndicator({ status, hash, error, onReset }: TransactionStatusIndicatorProps) {
  if (status === 'idle') return null;

  const statusConfig = {
    pending: {
      icon: Loader2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      message: 'Transaction pending...',
      animate: true,
    },
    confirming: {
      icon: Loader2,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      message: 'Confirming transaction...',
      animate: true,
    },
    success: {
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      message: 'Transaction successful!',
      animate: false,
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      message: parseContractError(error).userMessage,
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
      <Icon className={`w-5 h-5 ${config.color} ${config.animate ? 'animate-spin' : ''}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${config.color}`}>
          {config.message}
        </p>
        {hash && (status === 'confirming' || status === 'success') && (
          <a
            href={getEtherscanUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1 mt-1"
          >
            View on Etherscan
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      {onReset && (status === 'success' || status === 'error') && (
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

interface TransactionToastProps {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: unknown;
  isVisible: boolean;
  onDismiss: () => void;
}

/**
 * Toast notification for transaction status
 */
export function TransactionToast({ status, hash, error, isVisible, onDismiss }: TransactionToastProps) {
  if (!isVisible || status === 'idle') return null;

  const messages: Record<string, string> = {
    pending: 'Transaction submitted...',
    confirming: 'Waiting for confirmation...',
    success: 'Transaction confirmed!',
    error: parseContractError(error).userMessage,
  };

  const colors: Record<string, string> = {
    pending: 'bg-blue-500/90',
    confirming: 'bg-yellow-500/90',
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colors[status]} text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-slide-up`}>
      {status === 'pending' || status === 'confirming' ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : status === 'success' ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">{messages[status]}</span>
      {hash && status === 'success' && (
        <a
          href={getEtherscanUrl(hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-xs underline hover:no-underline"
        >
          View
        </a>
      )}
      <button
        onClick={onDismiss}
        className="ml-2 text-white/70 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

interface TransactionModalProps {
  isOpen: boolean;
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: unknown;
  onClose: () => void;
}

/**
 * Full modal for transaction details
 */
export function TransactionModal({ isOpen, status, hash, error, onClose }: TransactionModalProps) {
  if (!isOpen) return null;

  const parsedError = error ? parseContractError(error) : null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-crypto-card border border-crypto-border rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Transaction Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Status Icon */}
        <div className="flex flex-col items-center py-8">
          {status === 'pending' || status === 'confirming' ? (
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-16 h-16 text-green-400" />
          ) : (
            <XCircle className="w-16 h-16 text-red-400" />
          )}

          <p className="mt-4 text-lg font-medium text-white">
            {status === 'pending' && 'Transaction Submitted'}
            {status === 'confirming' && 'Confirming...'}
            {status === 'success' && 'Transaction Successful!'}
            {status === 'error' && parsedError?.userMessage || 'Transaction Failed'}
          </p>

          {hash && (status === 'confirming' || status === 'success') && (
            <a
              href={getEtherscanUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              View on Etherscan
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {parsedError?.action && status === 'error' && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">{parsedError.action}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        {status === 'success' || status === 'error' ? (
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 bg-crypto-card hover:bg-crypto-card/80 text-white rounded-xl font-medium transition-colors border border-crypto-border"
          >
            Close (transaction will continue)
          </button>
        )}
      </div>
    </div>
  );
}

interface GasEstimateProps {
  gasLimit?: bigint;
  gasPrice?: bigint;
  estimatedFee?: bigint;
}

/**
 * Display gas estimate information
 */
export function GasEstimate({ gasLimit, gasPrice, estimatedFee }: GasEstimateProps) {
  if (!gasLimit || !gasPrice) return null;

  const feeInEth = (Number(estimatedFee || gasLimit * gasPrice) / 1e18).toFixed(6);
  const gasPriceGwei = (Number(gasPrice) / 1e9).toFixed(2);

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <span>Gas: {gasLimit.toString()}</span>
      <span>Gas Price: {gasPriceGwei} Gwei</span>
      <span>Est. Fee: {feeInEth} ETH</span>
    </div>
  );
}
