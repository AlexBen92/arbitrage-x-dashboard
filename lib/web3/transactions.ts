/**
 * Enhanced Transaction Hooks
 * Provides write functionality with receipt tracking, status updates, and error handling
 */

'use client';

import { useCallback, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { CONTRACTS } from '../config/contracts';
import VolatilityOracleAbi from '../../contracts/abi/VolatilityOracle.json';
import RiskManagerAbi from '../../contracts/abi/RiskManager.json';
import CommitRevealAbi from '../../contracts/abi/CommitReveal.json';
import SqueethArbExecutorAbi from '../../contracts/abi/SqueethArbExecutor.json';
import { parseContractError, isUserRejection } from './errors';
import { logger, LOG_CONTEXT } from './logger';

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  hash: `0x${string}` | undefined;
  error: Error | undefined;
  receipt: unknown;
}

/**
 * Enhanced arbitrage execution hook with full transaction lifecycle
 */
export function useArbitrageExecutionWithReceipt() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const queryClient = useQueryClient();
  const [txState, setTxState] = useState<TransactionState>({
    status: 'idle',
    hash: undefined,
    error: undefined,
    receipt: undefined,
  });

  // Wait for transaction receipt
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  // Update state based on receipt
  if (receipt && txState.status !== 'success' && hash) {
    logger.logTransaction(hash, 'success', { receipt });
    setTxState({
      status: 'success',
      hash,
      error: undefined,
      receipt,
    });
    // Invalidate queries to refresh data
    queryClient.invalidateQueries();
  }

  const executeArbitrage = useCallback(async (arbitrageParams: `0x${string}`) => {
    setTxState({ status: 'pending', hash: undefined, error: undefined, receipt: undefined });

    try {
      logger.logContractCall('SqueethArbExecutor', 'executeArbitrage', [arbitrageParams]);

      await writeContract(
        {
          address: CONTRACTS.sepolia.SqueethArbExecutor.address,
          abi: SqueethArbExecutorAbi,
          functionName: 'executeArbitrage',
          args: [arbitrageParams],
        },
        {
          onSuccess: (hash) => {
            setTxState(prev => ({ ...prev, status: 'confirming', hash }));
            logger.logTransaction(hash, 'pending');
          },
          onError: (error) => {
            if (!isUserRejection(error)) {
              logger.logContractError('SqueethArbExecutor', 'executeArbitrage', error);
            }
            setTxState({
              status: 'error',
              hash: undefined,
              error: error instanceof Error ? error : new Error(String(error)),
              receipt: undefined,
            });
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTxState({
        status: 'error',
        hash: undefined,
        error,
        receipt: undefined,
      });
      if (!isUserRejection(err)) {
        logger.logContractError('SqueethArbExecutor', 'executeArbitrage', err);
      }
      throw error;
    }
  }, [writeContract]);

  return {
    executeArbitrage,
    status: txState.status,
    hash,
    receipt,
    isLoading: isPending,
    isConfirming,
    error: txState.error || error,
    reset: () => setTxState({ status: 'idle', hash: undefined, error: undefined, receipt: undefined }),
  };
}

/**
 * Enhanced commit intent hook with receipt tracking
 */
export function useCommitIntentWithReceipt() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const queryClient = useQueryClient();
  const [txState, setTxState] = useState<TransactionState>({
    status: 'idle',
    hash: undefined,
    error: undefined,
    receipt: undefined,
  });

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  if (receipt && txState.status !== 'success' && hash) {
    logger.logTransaction(hash, 'success', { receipt });
    setTxState({
      status: 'success',
      hash,
      error: undefined,
      receipt,
    });
    queryClient.invalidateQueries();
  }

  const commit = useCallback(async (commitment: `0x${string}`) => {
    setTxState({ status: 'pending', hash: undefined, error: undefined, receipt: undefined });

    try {
      logger.logContractCall('CommitReveal', 'commit', [commitment]);

      await writeContract(
        {
          address: CONTRACTS.sepolia.CommitReveal.address,
          abi: CommitRevealAbi,
          functionName: 'commit',
          args: [commitment],
        },
        {
          onSuccess: (hash) => {
            setTxState(prev => ({ ...prev, status: 'confirming', hash }));
            logger.logTransaction(hash, 'pending');
          },
          onError: (error) => {
            if (!isUserRejection(error)) {
              logger.logContractError('CommitReveal', 'commit', error);
            }
            setTxState({
              status: 'error',
              hash: undefined,
              error: error instanceof Error ? error : new Error(String(error)),
              receipt: undefined,
            });
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTxState({
        status: 'error',
        hash: undefined,
        error,
        receipt: undefined,
      });
      if (!isUserRejection(err)) {
        logger.logContractError('CommitReveal', 'commit', err);
      }
      throw error;
    }
  }, [writeContract]);

  return {
    commit,
    status: txState.status,
    hash,
    receipt,
    isLoading: isPending,
    isConfirming,
    error: txState.error || error,
    reset: () => setTxState({ status: 'idle', hash: undefined, error: undefined, receipt: undefined }),
  };
}

/**
 * Risk manager update hook (admin only)
 */
export function useRiskManagerUpdate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const queryClient = useQueryClient();
  const [txState, setTxState] = useState<TransactionState>({
    status: 'idle',
    hash: undefined,
    error: undefined,
    receipt: undefined,
  });

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  if (receipt && txState.status !== 'success' && hash) {
    logger.logTransaction(hash, 'success', { receipt });
    setTxState({
      status: 'success',
      hash,
      error: undefined,
      receipt,
    });
    queryClient.invalidateQueries();
  }

  const setMaxPositionSize = useCallback(async (newMaxSize: bigint) => {
    setTxState({ status: 'pending', hash: undefined, error: undefined, receipt: undefined });

    try {
      logger.logContractCall('RiskManager', 'setMaxPositionSize', [newMaxSize.toString()]);

      await writeContract(
        {
          address: CONTRACTS.sepolia.RiskManager.address,
          abi: RiskManagerAbi,
          functionName: 'setMaxPositionSize',
          args: [newMaxSize],
        },
        {
          onSuccess: (hash) => {
            setTxState(prev => ({ ...prev, status: 'confirming', hash }));
            logger.logTransaction(hash, 'pending');
          },
          onError: (error) => {
            if (!isUserRejection(error)) {
              logger.logContractError('RiskManager', 'setMaxPositionSize', error);
            }
            setTxState({
              status: 'error',
              hash: undefined,
              error: error instanceof Error ? error : new Error(String(error)),
              receipt: undefined,
            });
          },
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setTxState({
        status: 'error',
        hash: undefined,
        error,
        receipt: undefined,
      });
      if (!isUserRejection(err)) {
        logger.logContractError('RiskManager', 'setMaxPositionSize', err);
      }
      throw error;
    }
  }, [writeContract]);

  return {
    setMaxPositionSize,
    status: txState.status,
    hash,
    receipt,
    isLoading: isPending,
    isConfirming,
    error: txState.error || error,
    reset: () => setTxState({ status: 'idle', hash: undefined, error: undefined, receipt: undefined }),
  };
}

/**
 * Get Etherscan URL for a transaction
 */
export function getEtherscanUrl(hash: `0x${string}`): string {
  return `https://sepolia.etherscan.io/tx/${hash}`;
}

/**
 * Get Etherscan URL for an address
 */
export function getAddressUrl(address: `0x${string}`): string {
  return `https://sepolia.etherscan.io/address/${address}`;
}
