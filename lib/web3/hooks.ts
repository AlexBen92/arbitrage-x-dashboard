'use client';

import { useReadContract, useWriteContract, useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { CONTRACTS } from '../config/contracts';
import VolatilityOracleAbi from '../../contracts/abi/VolatilityOracle.json';
import RiskManagerAbi from '../../contracts/abi/RiskManager.json';
import CommitRevealAbi from '../../contracts/abi/CommitReveal.json';
import SqueethArbExecutorAbi from '../../contracts/abi/SqueethArbExecutor.json';
import { isSupportedChain } from './wagmiConfig';

// === Volatility Oracle Hooks ===

export function useVolatilityData(assetAddress?: `0x${string}`) {
  const chainId = useChainId();
  const isSupported = isSupportedChain(chainId);

  const volatilityQuery = useReadContract({
    address: CONTRACTS.sepolia.VolatilityOracle.address,
    abi: VolatilityOracleAbi,
    functionName: 'getVolatility',
    args: assetAddress ? [assetAddress] : undefined,
    chainId,
    query: {
      enabled: isSupported && !!assetAddress,
      staleTime: 30_000, // 30 seconds
      refetchInterval: 60_000, // Refetch every minute
    },
  });

  const latestVolatilityQuery = useReadContract({
    address: CONTRACTS.sepolia.VolatilityOracle.address,
    abi: VolatilityOracleAbi,
    functionName: 'latestVolatility',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  });

  return {
    volatility: volatilityQuery.data,
    latestVolatility: latestVolatilityQuery.data,
    isLoading: volatilityQuery.isLoading || latestVolatilityQuery.isLoading,
    error: volatilityQuery.error || latestVolatilityQuery.error,
    refetch: () => {
      volatilityQuery.refetch();
      latestVolatilityQuery.refetch();
    },
  };
}

// === Risk Manager Hooks ===

export function useRiskManager() {
  const chainId = useChainId();
  const isSupported = isSupportedChain(chainId);
  const { address } = useAccount();

  const maxPositionSizeQuery = useReadContract({
    address: CONTRACTS.sepolia.RiskManager.address,
    abi: RiskManagerAbi,
    functionName: 'maxPositionSize',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 60_000,
    },
  });

  const riskFactorQuery = useReadContract({
    address: CONTRACTS.sepolia.RiskManager.address,
    abi: RiskManagerAbi,
    functionName: 'riskFactor',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 60_000,
    },
  });

  const userRiskLevelQuery = useReadContract({
    address: CONTRACTS.sepolia.RiskManager.address,
    abi: RiskManagerAbi,
    functionName: 'getUserRiskLevel',
    args: address ? [address] : undefined,
    chainId,
    query: {
      enabled: isSupported && !!address,
      staleTime: 60_000,
    },
  });

  return {
    maxPositionSize: maxPositionSizeQuery.data,
    riskFactor: riskFactorQuery.data,
    userRiskLevel: userRiskLevelQuery.data,
    isLoading: maxPositionSizeQuery.isLoading || riskFactorQuery.isLoading,
    error: maxPositionSizeQuery.error || riskFactorQuery.error,
  };
}

export function useCheckPositionAllowed(amount: bigint) {
  const chainId = useChainId();
  const isSupported = isSupportedChain(chainId);

  return useReadContract({
    address: CONTRACTS.sepolia.RiskManager.address,
    abi: RiskManagerAbi,
    functionName: 'checkPositionAllowed',
    args: [amount],
    chainId,
    query: {
      enabled: isSupported && amount > 0n,
      staleTime: 10_000,
    },
  });
}

// === Commit Reveal Hooks ===

export function useCommitReveal() {
  const chainId = useChainId();
  const isSupported = isSupportedChain(chainId);
  const { address } = useAccount();

  const commitPeriodEndQuery = useReadContract({
    address: CONTRACTS.sepolia.CommitReveal.address,
    abi: CommitRevealAbi,
    functionName: 'commitPeriodEnd',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
    },
  });

  const revealPeriodEndQuery = useReadContract({
    address: CONTRACTS.sepolia.CommitReveal.address,
    abi: CommitRevealAbi,
    functionName: 'revealPeriodEnd',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
    },
  });

  const hasCommittedQuery = useReadContract({
    address: CONTRACTS.sepolia.CommitReveal.address,
    abi: CommitRevealAbi,
    functionName: 'getUserCommitment',
    args: address ? [address] : undefined,
    chainId,
    query: {
      enabled: isSupported && !!address,
      staleTime: 30_000,
    },
  });

  return {
    commitPeriodEnd: commitPeriodEndQuery.data,
    revealPeriodEnd: revealPeriodEndQuery.data,
    userCommitment: hasCommittedQuery.data,
    hasCommitted: hasCommittedQuery.data && hasCommittedQuery.data !== '0x0',
    isLoading: commitPeriodEndQuery.isLoading || revealPeriodEndQuery.isLoading,
    error: commitPeriodEndQuery.error || revealPeriodEndQuery.error,
  };
}

// === Squeeth Arb Executor Hooks ===

export function useSqueethExecutor() {
  const chainId = useChainId();
  const isSupported = isSupportedChain(chainId);

  const isActiveQuery = useReadContract({
    address: CONTRACTS.sepolia.SqueethArbExecutor.address,
    abi: SqueethArbExecutorAbi,
    functionName: 'isExecutorActive',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
      refetchInterval: 30_000,
    },
  });

  const totalExecutionsQuery = useReadContract({
    address: CONTRACTS.sepolia.SqueethArbExecutor.address,
    abi: SqueethArbExecutorAbi,
    functionName: 'totalExecutions',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  });

  const totalProfitQuery = useReadContract({
    address: CONTRACTS.sepolia.SqueethArbExecutor.address,
    abi: SqueethArbExecutorAbi,
    functionName: 'totalProfit',
    chainId,
    query: {
      enabled: isSupported,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  });

  return {
    isActive: isActiveQuery.data ?? false,
    totalExecutions: totalExecutionsQuery.data ?? 0n,
    totalProfit: totalProfitQuery.data ?? 0n,
    isLoading: isActiveQuery.isLoading || totalExecutionsQuery.isLoading,
    error: isActiveQuery.error || totalExecutionsQuery.error,
  };
}

// === Write Hooks ===

export function useArbitrageExecution() {
  const { writeContract, isPending, error, data } = useWriteContract();
  const queryClient = useQueryClient();

  const executeArbitrage = async (arbitrageParams: `0x${string}`) => {
    return writeContract(
      {
        address: CONTRACTS.sepolia.SqueethArbExecutor.address,
        abi: SqueethArbExecutorAbi,
        functionName: 'executeArbitrage',
        args: [arbitrageParams],
      },
      {
        onSuccess: () => {
          // Refetch all contract queries
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return {
    executeArbitrage,
    isPending,
    error,
    hash: data,
  };
}

export function useCommitIntent() {
  const { writeContract, isPending, error, data } = useWriteContract();
  const queryClient = useQueryClient();

  const commit = async (commitment: `0x${string}`) => {
    return writeContract(
      {
        address: CONTRACTS.sepolia.CommitReveal.address,
        abi: CommitRevealAbi,
        functionName: 'commit',
        args: [commitment],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return {
    commit,
    isPending,
    error,
    hash: data,
  };
}

// === Network Status Hook ===

export function useNetworkStatus() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useChainId();

  return {
    address,
    isConnected,
    chain,
    chainId,
    isSupportedChain: isSupportedChain(chainId),
    switchChain,
    isSwitching,
  };
}
