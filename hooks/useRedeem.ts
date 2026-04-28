// hooks/useRedeem.ts
// Hook for redeeming tokens

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { HEDGED_TOKEN_ABI } from '@/lib/contracts/abis'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { StrategyId } from '@/lib/contracts/addresses'

export function useRedeem(strategyId: StrategyId) {
  const tokenAddress = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  const { writeContractAsync: redeemAsync, data: redeemHash } = useWriteContract()
  const { isLoading: isRedeeming, isSuccess } =
    useWaitForTransactionReceipt({ hash: redeemHash })

  const executeRedeem = async (tokenAmount: number) => {
    const amountWei = parseUnits(tokenAmount.toString(), 18) // Tokens use 18 decimals

    return redeemAsync({
      address: tokenAddress,
      abi: HEDGED_TOKEN_ABI,
      functionName: 'redeem',
      args: [amountWei],
    })
  }

  return {
    executeRedeem,
    isRedeeming,
    isSuccess,
    redeemHash,
  }
}
