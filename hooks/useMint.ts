// hooks/useMint.ts
// Hook for minting tokens (2-step flow: approve → mint)

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { HEDGED_TOKEN_ABI, USDC_ABI } from '@/lib/contracts/abis'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { StrategyId } from '@/lib/contracts/addresses'

export function useMint(strategyId: StrategyId) {
  const tokenAddress = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  // Approve USDC
  const { writeContractAsync: approveAsync, data: approveHash } = useWriteContract()
  const { isLoading: isApproving } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // Mint tokens
  const { writeContractAsync: mintAsync, data: mintHash } = useWriteContract()
  const { isLoading: isMinting, isSuccess, data: mintReceipt } =
    useWaitForTransactionReceipt({ hash: mintHash })

  // Step 1: Approve USDC spending
  const approve = async (usdcAmount: number) => {
    const amountWei = parseUnits(usdcAmount.toString(), 6) // USDC = 6 decimals

    return approveAsync({
      address: CONTRACTS.USDC,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [tokenAddress, amountWei],
    })
  }

  // Step 2: Mint tokens (requires prior approval)
  const mint = async (usdcAmount: number) => {
    const amountWei = parseUnits(usdcAmount.toString(), 6)

    return mintAsync({
      address: tokenAddress,
      abi: HEDGED_TOKEN_ABI,
      functionName: 'mint',
      args: [amountWei],
    })
  }

  // Combined flow: approve → mint
  const executeMint = async (usdcAmount: number) => {
    // First approve
    const approveTx = await approve(usdcAmount)

    // Return approval hash - caller should wait for confirmation before calling mint
    return {
      step: 'approve' as const,
      hash: approveTx,
      approve,
      mint,
    }
  }

  return {
    executeMint,
    approve,
    mint,
    isApproving,
    isMinting,
    isSuccess,
    approveHash,
    mintHash,
    mintReceipt,
  }
}
