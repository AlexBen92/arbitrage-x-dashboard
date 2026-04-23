/**
 * RPC and Network Diagnostics
 * Provides visibility into network health, RPC status, and connection issues
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useAccount, useChainId, useBlockNumber, useFeeData } from 'wagmi';
import { isSupportedChain } from './wagmiConfig';
import { logger, LOG_CONTEXT } from './logger';

export interface RpcHealth {
  isHealthy: boolean;
  latency: number | null;
  lastCheck: Date;
  error: string | null;
}

export interface NetworkDiagnostics {
  isConnected: boolean;
  isSupportedNetwork: boolean;
  chainId: number;
  blockNumber: bigint | null;
  gasPrice: bigint | null;
  rpcHealth: RpcHealth;
  walletAddress: `0x${string}` | undefined;
}

/**
 * Hook for network and RPC diagnostics
 */
export function useRpcDiagnostics() {
  const publicClient = usePublicClient();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber({
    query: {
      refetchInterval: 10000,
    },
  });
  const { data: feeData } = useFeeData();

  const [rpcHealth, setRpcHealth] = useState<RpcHealth>({
    isHealthy: true,
    latency: null,
    lastCheck: new Date(),
    error: null,
  });

  // Check RPC health
  const checkRpcHealth = useCallback(async () => {
    if (!publicClient) {
      setRpcHealth({
        isHealthy: false,
        latency: null,
        lastCheck: new Date(),
        error: 'Public client not available',
      });
      return;
    }

    const start = performance.now();

    try {
      // Simple block number check to test RPC
      await publicClient.getBlockNumber();

      const latency = performance.now() - start;

      setRpcHealth({
        isHealthy: latency < 5000, // Healthy if under 5 seconds
        latency,
        lastCheck: new Date(),
        error: null,
      });
    } catch (error) {
      setRpcHealth({
        isHealthy: false,
        latency: null,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'RPC check failed',
      });
      logger.warn('RPC health check failed', LOG_CONTEXT.NETWORK, { error });
    }
  }, [publicClient]);

  // Periodic health checks
  useEffect(() => {
    checkRpcHealth();
    const interval = setInterval(checkRpcHealth, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [checkRpcHealth]);

  const diagnostics: NetworkDiagnostics = {
    isConnected,
    isSupportedNetwork: isSupportedChain(chainId),
    chainId,
    blockNumber: blockNumber || null,
    gasPrice: feeData?.gasPrice || null,
    rpcHealth,
    walletAddress: address,
  };

  return {
    diagnostics,
    checkRpcHealth,
    refresh: checkRpcHealth,
  };
}

/**
 * Hook for network status with actionable feedback
 */
export function useNetworkStatus() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { diagnostics } = useRpcDiagnostics();

  const getNetworkStatus = useCallback(() => {
    if (!isConnected) {
      return {
        status: 'disconnected' as const,
        message: 'Wallet not connected',
        action: 'Connect your wallet to continue',
        isActionable: true,
      };
    }

    if (!isSupportedChain(chainId)) {
      return {
        status: 'wrong_network' as const,
        message: `Wrong network (Chain ID: ${chainId})`,
        action: 'Switch to Sepolia testnet',
        isActionable: true,
      };
    }

    if (!diagnostics.rpcHealth.isHealthy) {
      return {
        status: 'rpc_unhealthy' as const,
        message: 'Network connection issues',
        action: 'Retrying connection...',
        isActionable: false,
      };
    }

    return {
      status: 'healthy' as const,
      message: 'Connected to Sepolia',
      action: null,
      isActionable: false,
    };
  }, [isConnected, chainId, diagnostics.rpcHealth.isHealthy]);

  return {
    address,
    isConnected,
    chain,
    chainId,
    isSupportedNetwork: isSupportedChain(chainId),
    networkStatus: getNetworkStatus(),
    diagnostics,
  };
}

/**
 * Get formatted gas price in Gwei
 */
export function formatGasPrice(gasPrice: bigint | null): string {
  if (!gasPrice) return 'N/A';
  return (Number(gasPrice) / 1e9).toFixed(2);
}

/**
 * Estimate transaction fee
 */
export function estimateFee(gasLimit: bigint, gasPrice: bigint | null): bigint {
  if (!gasPrice) return 0n;
  return gasLimit * gasPrice;
}

/**
 * Format fee to ETH
 */
export function formatFee(fee: bigint): string {
  return (Number(fee) / 1e18).toFixed(6);
}

/**
 * Connection quality indicator
 */
export function getConnectionQuality(latency: number | null): 'excellent' | 'good' | 'fair' | 'poor' {
  if (!latency) return 'poor';
  if (latency < 500) return 'excellent';
  if (latency < 1500) return 'good';
  if (latency < 3000) return 'fair';
  return 'poor';
}

/**
 * Get connection quality color
 */
export function getQualityColor(quality: ReturnType<typeof getConnectionQuality>): string {
  const colors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    fair: 'text-yellow-400',
    poor: 'text-red-400',
  };
  return colors[quality];
}
