'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { wagmiConfig } from './wagmiConfig';

// Get project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e10a8dca90396d988c101f1da7929e44';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 30_000,
    },
  },
});

// ConnectKit config with mobile support
const config = getDefaultConfig({
  appName: 'Arbitrage X Dashboard',
  appName: 'OpenClaw',
  appDescription: 'Plateforme de trading quantitatif et backtesting crypto',
  appUrl: 'https://arbitrage-x-frontend.vercel.app',
  appIcon: 'https://arbitrage-x-frontend.vercel.app/icon.png',
  chains: [wagmiConfig.chains[0]],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        'walletConnect',
        'injected',
        'coinbase',
        'rainbow',
      ],
    },
  ],
});

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          mode="dark"
          options={{
            initialChainId: 11155111,
            embedBuyInConnectModal: true,
            disableSiweRedirect: false,
            walletConnectCTA: 'both',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
