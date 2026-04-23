'use client';

import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// Get NEXT_PUBLIC_ prefixed variables only (safe for client-side)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e10a8dca90396d988c101f1da7929e44';
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';

// RPC URLs with fallbacks
const rpcUrls = [
  'https://rpc.sepolia.org',
  'https://sepolia.deth.org',
  ...(infuraApiKey ? [`https://sepolia.infura.io/v3/${infuraApiKey}`] : []),
];

// Custom Sepolia config
export const customSepolia = {
  ...sepolia,
  rpcUrls: {
    default: { http: rpcUrls },
    public: { http: ['https://rpc.sepolia.org', 'https://sepolia.deth.org'] },
  },
};

// Create wagmi config with proper connectors
export const wagmiConfig = createConfig({
  chains: [customSepolia],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: false, // Use RainbowKit's modal instead
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Arbitrage X',
      appLogoUrl: 'https://arbitrage-x-psi.vercel.app/icon-192.png',
    }),
  ],
  ssr: true,
  transports: {
    [customSepolia.id]: http(),
  },
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
