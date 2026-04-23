'use client';

import { useNetworkStatus } from '@/lib/web3/hooks';
import { useEffect } from 'react';

interface NetworkStatusProps {
  onNetworkChange?: (isSupported: boolean) => void;
}

export default function NetworkStatus({ onNetworkChange }: NetworkStatusProps) {
  const { address, isConnected, chainId, isSupportedChain, isSwitching } = useNetworkStatus();

  useEffect(() => {
    onNetworkChange?.(isSupportedChain);
  }, [isSupportedChain, onNetworkChange]);

  if (!isConnected) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        <span className="text-sm text-yellow-400">Wallet not connected</span>
      </div>
    );
  }

  if (!isSupportedChain) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm text-red-400">Unsupported network. Please switch to Sepolia.</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
      <span className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm text-green-400">
        Connected to Sepolia {isSwitching && '(switching...)'}
      </span>
    </div>
  );
}
