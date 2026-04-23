'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetworkStatus } from '@/lib/web3/hooks';

export default function WalletConnectButton() {
  const { isSupportedChain, chainId } = useNetworkStatus();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 rounded-full hover:from-primary-500 hover:to-accent-400 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || !isSupportedChain) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="px-4 py-2 text-sm font-medium bg-red-500/20 border border-red-500/50 text-red-400 rounded-full hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-crypto-card/80 border border-crypto-border rounded-lg hover:bg-crypto-card transition-all duration-300"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 16, height: 16 }} />
                        )}
                      </div>
                    )}
                    <span className="text-gray-300">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-crypto-card/80 border border-crypto-border rounded-lg hover:bg-crypto-card transition-all duration-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-300">
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
