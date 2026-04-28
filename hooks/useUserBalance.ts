// hooks/useUserBalance.ts
// Hook for fetching user's token and USDC balances

import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { HEDGED_TOKEN_ABI, USDC_ABI } from '@/lib/contracts/abis'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { StrategyId } from '@/lib/contracts/addresses'

export function useUserBalance(
  strategyId: StrategyId,
  userAddress?: `0x${string}`
) {
  const tokenAddress = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  // Token balance query
  const { data: tokenBalRaw, refetch: refetchToken, ...tokenQuery } = useReadContract({
    address: tokenAddress,
    abi: HEDGED_TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
      staleTime: 10_000,
      refetchInterval: 15_000,
    },
  })

  // USDC balance query
  const { data: usdcBalRaw, refetch: refetchUsdc } = useReadContract({
    address: CONTRACTS.USDC,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      staleTime: 10_000,
      refetchInterval: 15_000,
    },
  })

  // USDC allowance query
  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDC,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, tokenAddress] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
      staleTime: 10_000,
    },
  })

  const tokenBalance = tokenBalRaw ? Number(formatUnits(tokenBalRaw as bigint, 18)) : 0
  const usdcBalance = usdcBalRaw ? Number(formatUnits(usdcBalRaw as bigint, 6)) : 0
  const allowance = allowanceRaw as bigint | undefined
  const isApproved = allowance !== undefined && allowance > 0n

  const refetch = () => {
    refetchToken()
    refetchUsdc()
    refetchAllowance()
  }

  return {
    tokenBalance,
    tokenBalanceRaw: tokenBalRaw,
    usdcBalance,
    usdcBalanceRaw: usdcBalRaw,
    allowance,
    isApproved,
    isLoading: tokenQuery.isLoading,
    refetch,
  }
}
