'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

export function SimpleWalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleSwitchToSepolia = async () => {
    try {
      await switchChain({ chainId: 11155111 });
    } catch (error) {
      console.error('Switch chain error:', error);
    }
  };

  const isWrongNetwork = chainId !== 11155111;

  return (
    <div className="flex items-center gap-3">
      {/* Network warning */}
      {isWrongNetwork && isConnected && (
        <button
          onClick={handleSwitchToSepolia}
          className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 rounded-lg text-xs font-medium transition-all"
        >
          ⚠️ Switch to Sepolia
        </button>
      )}

      {/* ConnectKit Button - Mobile friendly with Rainbow support */}
      <ConnectKitButton />
    </div>
  );
}
