'use client';

import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get NEXT_PUBLIC_ prefixed variables only (safe for client-side)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e10a8dca90396d988c101f1da7929e44';

// RPC URLs with fallbacks
const rpcUrls = [
  'https://rpc.sepolia.org',
  'https://sepolia.deth.org',
];

// Custom Sepolia config
export const customSepolia = {
  ...sepolia,
  rpcUrls: {
    default: { http: rpcUrls },
    public: { http: ['https://rpc.sepolia.org', 'https://sepolia.deth.org'] },
  },
};

// Create wagmi config with mobile-friendly settings
export const wagmiConfig = createConfig({
  chains: [customSepolia],
  connectors: [
    // Injected connector (MetaMask, Trust Wallet, etc.) - optimized for mobile
    injected({
      shimDisconnect: false, // Fixed: prevents Rainbow mobile issues
    }),
    // WalletConnect - for Rainbow mobile app
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  ssr: true,
  transports: {
    [customSepolia.id]: http(),
  },
});

// Supported chains
export const supportedChains = [customSepolia] as const;
export const CHAIN_IDS = { sepolia: customSepolia.id } as const;

export const isSupportedChain = (chainId?: number): boolean => {
  if (!chainId) return false;
  return supportedChains.some((chain) => chain.id === chainId);
};

// Mobile detection helpers
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Deep link helper for Rainbow mobile
export const openRainbowApp = (uri: string): void => {
  if (typeof window === 'undefined') return;

  // Universal link for iOS
  const iosLink = `https://rnbwapp.com/link?uri=${encodeURIComponent(uri)}`;
  // Deep link for Android
  const androidLink = uri;

  if (isIOS()) {
    window.location.href = iosLink;
  } else if (isAndroid()) {
    window.location.href = androidLink;
  } else {
    window.open(iosLink, '_blank');
  }
};
