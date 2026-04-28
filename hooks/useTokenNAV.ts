// hooks/useTokenNAV.ts
// Hook for fetching token NAV and related data

import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { HEDGED_TOKEN_ABI } from '@/lib/contracts/abis'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { StrategyId } from '@/lib/contracts/addresses'

export function useTokenNAV(strategyId: StrategyId) {
  // Get address from strategy config
  const address = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  // NAV query
  const { data: navRaw, refetch: refetchNav, ...navQuery } = useReadContract({
    address,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'navPerToken',
    query: {
      enabled: !!address,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  })

  // Total supply query
  const { data: supplyRaw, refetch: refetchSupply } = useReadContract({
    address,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!address,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  })

  // Last NAV update query
  const { data: lastUpdateRaw } = useReadContract({
    address,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'lastNAVUpdate',
    query: {
      enabled: !!address,
      staleTime: 60_000,
      refetchInterval: 120_000,
    },
  })

  // Paused status
  const { data: isPaused } = useReadContract({
    address,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'paused',
    query: {
      enabled: !!address,
      staleTime: 30_000,
    },
  })

  // Strategy type
  const { data: strategyType } = useReadContract({
    address,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'strategyType',
    query: {
      enabled: !!address,
      staleTime: Infinity,
    },
  })

  // Calculate derived values
  const nav = navRaw ? Number(formatUnits(navRaw as bigint, 6)) : 1.0 // NAV uses 6 decimals
  const totalSupply = supplyRaw ? Number(formatUnits(supplyRaw as bigint, 18)) : 0
  const lastUpdate = lastUpdateRaw ? new Date(Number(lastUpdateRaw) * 1000) : null
  const isOutdated = lastUpdate ? (Date.now() - lastUpdate.getTime()) > 3600000 : false // > 1 hour

  const refetchAll = () => {
    refetchNav()
    refetchSupply()
  }

  return {
    nav,
    navRaw,
    totalSupply,
    totalSupplyRaw: supplyRaw,
    lastUpdate,
    isPaused: isPaused ?? false,
    isOutdated,
    strategyType,
    isLoading: navQuery.isLoading,
    error: navQuery.error,
    refetchNav: refetchAll,
  }
}
