'use client';

import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { parseUnits, formatUnits } from 'viem';
import HedgedTokenAbi from '../../contracts/abi/HedgedToken.json';
import UsdcAbi from '../../contracts/abi/USDC.json';
import { HEDGED_TOKENS, SEPOLIA_USDC, type HedgedToken, type TokenId } from '../config/hedgedTokens';

// === Read Hooks ===

export function useTokenNAV(tokenId: TokenId) {
  const token = HEDGED_TOKENS.find(t => t.id === tokenId);
  const { address } = useAccount();

  const navQuery = useReadContract({
    address: token?.address,
    abi: HedgedTokenAbi,
    functionName: 'navPerToken',
    query: {
      enabled: !!token,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  });

  const strategyQuery = useReadContract({
    address: token?.address,
    abi: HedgedTokenAbi,
    functionName: 'strategyName',
    query: {
      enabled: !!token,
      staleTime: 300_000,
    },
  });

  const balanceQuery = useReadContract({
    address: token?.address,
    abi: HedgedTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!token && !!address,
      staleTime: 10_000,
      refetchInterval: 15_000,
    },
  });

  const totalSupplyQuery = useReadContract({
    address: token?.address,
    abi: HedgedTokenAbi,
    functionName: 'totalSupply',
    query: {
      enabled: !!token,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  });

  return {
    token,
    nav: navQuery.data ? Number(formatUnits(navQuery.data as bigint, 6)) : 1,
    navRaw: navQuery.data as bigint | undefined,
    strategyName: strategyQuery.data as string | undefined,
    balance: balanceQuery.data ? Number(formatUnits(balanceQuery.data as bigint, 18)) : 0,
    balanceRaw: balanceQuery.data as bigint | undefined,
    totalSupply: totalSupplyQuery.data ? Number(formatUnits(totalSupplyQuery.data as bigint, 18)) : 0,
    isLoading: navQuery.isLoading,
    error: navQuery.error,
    refetch: () => {
      navQuery.refetch();
      balanceQuery.refetch();
      totalSupplyQuery.refetch();
    },
  };
}

export function useAllTokensNAV() {
  const tokens = HEDGED_TOKENS.map(token => useTokenNAV(token.id as TokenId));

  return {
    tokens: HEDGED_TOKENS,
    tokenData: tokens,
    isLoading: tokens.some(t => t.isLoading),
    refetchAll: () => tokens.forEach(t => t.refetch()),
  };
}

export function useUSDCBalance() {
  const { address } = useAccount();

  const balanceQuery = useReadContract({
    address: SEPOLIA_USDC.address,
    abi: UsdcAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 10_000,
      refetchInterval: 15_000,
    },
  });

  return {
    balance: balanceQuery.data ? Number(formatUnits(balanceQuery.data as bigint, SEPOLIA_USDC.decimals)) : 0,
    balanceRaw: balanceQuery.data as bigint | undefined,
    isLoading: balanceQuery.isLoading,
    refetch: () => balanceQuery.refetch(),
  };
}

export function useTokenAllowance(tokenId: TokenId) {
  const token = HEDGED_TOKENS.find(t => t.id === tokenId);
  const { address } = useAccount();

  const allowanceQuery = useReadContract({
    address: SEPOLIA_USDC.address,
    abi: UsdcAbi,
    functionName: 'allowance',
    args: address && token ? [address, token.address] : undefined,
    query: {
      enabled: !!address && !!token,
      staleTime: 10_000,
    },
  });

  return {
    allowance: allowanceQuery.data as bigint | undefined,
    isApproved: (allowanceQuery.data as bigint | undefined) !== undefined && (allowanceQuery.data as bigint) > 0n,
    isLoading: allowanceQuery.isLoading,
    refetch: () => allowanceQuery.refetch(),
  };
}

// === Write Hooks ===

export function useApproveUSDC(tokenId: TokenId) {
  const token = HEDGED_TOKENS.find(t => t.id === tokenId);
  const { writeContract, isPending, error, data } = useWriteContract();
  const queryClient = useQueryClient();

  const approve = async (amount: number = Number.MAX_SAFE_INTEGER) => {
    if (!token) throw new Error('Token not found');

    const amountRaw = parseUnits(amount.toString(), SEPOLIA_USDC.decimals);

    return writeContract(
      {
        address: SEPOLIA_USDC.address,
        abi: UsdcAbi,
        functionName: 'approve',
        args: [token.address, amountRaw],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return {
    approve,
    isPending,
    error,
    hash: data,
  };
}

export function useMintTokens(tokenId: TokenId) {
  const token = HEDGED_TOKENS.find(t => t.id === tokenId);
  const { writeContract, isPending, error, data } = useWriteContract();
  const queryClient = useQueryClient();

  const mint = async (usdcAmount: number) => {
    if (!token) throw new Error('Token not found');

    const amountRaw = parseUnits(usdcAmount.toString(), SEPOLIA_USDC.decimals);

    return writeContract(
      {
        address: token.address,
        abi: HedgedTokenAbi,
        functionName: 'mint',
        args: [amountRaw],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return {
    mint,
    isPending,
    error,
    hash: data,
  };
}

export function useRedeemTokens(tokenId: TokenId) {
  const token = HEDGED_TOKENS.find(t => t.id === tokenId);
  const { writeContract, isPending, error, data } = useWriteContract();
  const queryClient = useQueryClient();

  const redeem = async (tokenAmount: number) => {
    if (!token) throw new Error('Token not found');

    const amountRaw = parseUnits(tokenAmount.toString(), 18);

    return writeContract(
      {
        address: token.address,
        abi: HedgedTokenAbi,
        functionName: 'redeem',
        args: [amountRaw],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
      }
    );
  };

  return {
    redeem,
    isPending,
    error,
    hash: data,
  };
}

// === Combined Mint Hook (handles approve + mint) ===

export function useMintWithApproval(tokenId: TokenId) {
  const { approve, isPending: isApproving, hash: approveHash } = useApproveUSDC(tokenId);
  const { mint, isPending: isMinting, hash: mintHash } = useMintTokens(tokenId);
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(tokenId);

  const mintWithApproval = async (usdcAmount: number) => {
    // Check allowance first
    await refetchAllowance();

    const amountRaw = parseUnits(usdcAmount.toString(), SEPOLIA_USDC.decimals);
    const needsApproval = !allowance || allowance < amountRaw;

    if (needsApproval) {
      await approve();
      // Wait for approval transaction to be mined
      // In production, you'd want to wait for transaction receipt
    }

    return mint(usdcAmount);
  };

  return {
    mintWithApproval,
    isPending: isApproving || isMinting,
    isApproving,
    isMinting,
    approveHash,
    mintHash,
  };
}
