// hooks/useHedgedToken.ts
// Hook for fetching hedged token data (NAV, supply, lastUpdate, paused status)

import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { HEDGED_TOKEN_ABI } from '@/lib/contracts/abis'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { StrategyId } from '@/lib/contracts/addresses'

export function useHedgedToken(strategyId: StrategyId) {
  const tokenAddress = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  // NAV query
  const { data: navRaw } = useReadContract({
    address: tokenAddress,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'navPerToken',
    query: {
      enabled: !!tokenAddress,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  })

  // Total supply query
  const { data: totalSupplyRaw } = useReadContract({
    address: tokenAddress,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!tokenAddress,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  })

  // Last NAV update query
  const { data: lastUpdateRaw } = useReadContract({
    address: tokenAddress,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'lastNAVUpdate',
    query: {
      enabled: !!tokenAddress,
      staleTime: 60_000,
      refetchInterval: 120_000,
    },
  })

  // Paused status
  const { data: isPaused } = useReadContract({
    address: tokenAddress,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'paused',
    query: {
      enabled: !!tokenAddress,
      staleTime: 30_000,
    },
  })

  // Calculate derived values
  const nav = navRaw ? Number(formatUnits(navRaw as bigint, 18)) : 1.0
  const totalSupply = totalSupplyRaw ? Number(formatUnits(totalSupplyRaw as bigint, 18)) : 0
  const lastUpdate = lastUpdateRaw ? new Date(Number(lastUpdateRaw) * 1000) : null
  const isOutdated = lastUpdate ? (Date.now() - lastUpdate.getTime()) > 3_600_000 : false // > 1 hour

  return {
    nav,
    totalSupply,
    lastUpdate,
    isPaused: isPaused ?? false,
    isOutdated,
  }
}
