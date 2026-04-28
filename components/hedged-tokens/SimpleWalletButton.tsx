'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useChainId, useSwitchChain } from 'wagmi';

export function SimpleWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleConnect = async (connector: typeof connectors[0]) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleSwitchToSepolia = async () => {
    try {
      await switchChain({ chainId: 11155111 });
    } catch (error) {
      console.error('Switch chain error:', error);
    }
  };

  const isWrongNetwork = chainId !== 11155111;

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            // Try injected first (MetaMask, Rainbow browser extension)
            const injected = connectors.find(c => c.id === 'injected');
            if (injected) {
              handleConnect(injected);
            }
          }}
          disabled={isPending}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
          {isPending ? 'Connexion...' : '🔌 Connecter Wallet'}
        </button>

        {/* Dropdown for other options */}
        <details className="absolute top-full mt-2 right-0 z-50">
          <summary className="cursor-pointer"></summary>
          <div className="bg-gray-900 border border-white/20 rounded-lg p-2 min-w-[200px] shadow-xl">
            <p className="text-xs text-gray-500 px-2 py-1 mb-2">Autres options:</p>
            {connectors.map((connector) => (
              connector.id !== 'injected' && (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={isPending}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {connector.name}
                </button>
              )
            ))}
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Network warning */}
      {isWrongNetwork && (
        <button
          onClick={handleSwitchToSepolia}
          className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 rounded-lg text-xs font-medium transition-all"
        >
          ⚠️ Switch to Sepolia
        </button>
      )}

      {/* Connected state */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-gray-300 hidden sm:block">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
