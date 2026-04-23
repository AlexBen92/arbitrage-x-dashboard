'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get NEXT_PUBLIC_ prefixed variables only (safe for client-side)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000';
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';

// Custom Sepolia config with public RPCs
export const customSepolia = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        'https://rpc.sepolia.org',
        'https://sepolia.deth.org',
        ...(infuraApiKey ? [`https://sepolia.infura.io/v3/${infuraApiKey}`] : []),
      ],
    },
    public: {
      http: ['https://rpc.sepolia.org', 'https://sepolia.deth.org'],
    },
  },
};

export const wagmiConfig = getDefaultConfig({
  appName: 'Arbitrage X',
  projectId,
  chains: [customSepolia],
  ssr: true, // Enable for Next.js SSR
});

// Supported chains for the app
export const supportedChains = [customSepolia] as const;

// Chain IDs for easy access
export const CHAIN_IDS = {
  sepolia: customSepolia.id,
} as const;

// Helper to check if chain is supported
export const isSupportedChain = (chainId?: number): boolean => {
  if (!chainId) return false;
  return supportedChains.some((chain) => chain.id === chainId);
};
