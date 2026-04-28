// components/WalletButton.tsx
// Wallet connection button with 4 states: disconnected, connecting, wrong network, connected

'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [showModal, setShowModal] = useState(false)

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id

  // État 1 : Non connecté
  if (!isConnected) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="btn-connect"
        >
          Connect Wallet
        </button>
        {showModal && (
          <WalletModal
            connectors={connectors}
            onConnect={async (connector) => {
              await connect({ connector })
              setShowModal(false)
            }}
            onClose={() => setShowModal(false)}
            isPending={isPending}
          />
        )}
      </>
    )
  }

  // État 2 : Mauvais réseau (pas Sepolia)
  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="btn-wrong-network"
      >
        ⚠ Switch to Sepolia
      </button>
    )
  }

  // État 3 : Connecté sur Sepolia ✅
  return (
    <div className="wallet-pill">
      <span className="dot-live" />
      <span className="wallet-address font-mono">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <span className="network-badge">Sepolia</span>
      <button
        onClick={() => disconnect()}
        className="btn-disconnect"
        aria-label="Disconnect wallet"
      >
        ✕
      </button>
    </div>
  )
}

// WalletModal : affiche les connecteurs disponibles
import type { Connector } from 'wagmi'

interface WalletModalProps {
  connectors: readonly Connector[]
  onConnect: (connector: Connector) => Promise<void>
  onClose: () => void
  isPending: boolean
}

function WalletModal({ connectors, onConnect, onClose, isPending }: WalletModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Connect your wallet</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <p className="modal-subtitle">
          Your wallet = your account on Arbitrage X Testnet.
          <br />
          No email, no password.
        </p>

        <div className="connector-list">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => onConnect(connector)}
              disabled={isPending}
              className="connector-btn"
            >
              {connector.name}
              {isPending && ' — connecting...'}
            </button>
          ))}
        </div>

        <div className="faucet-section">
          <p className="faucet-hint">
            Need Sepolia ETH? →{' '}
            <a
              href="https://sepoliafaucet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="faucet-link"
            >
              sepoliafaucet.com →
            </a>
          </p>
          <p className="faucet-hint">
            Need Sepolia USDC? →{' '}
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACTS.USDC}`}
              target="_blank"
              rel="noopener noreferrer"
              className="faucet-link"
            >
              Mint USDC testnet →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Import contract addresses for faucet link
import { CONTRACTS } from '@/lib/contracts/addresses'

// Styles - inject via CSS classes
const styles = `
.btn-connect {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-connect:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-wrong-network {
  background: #f59e0b;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.wallet-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dot-live {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

.wallet-address {
  color: white;
  font-size: 0.875rem;
}

.network-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-disconnect {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  transition: color 0.2s;
}

.btn-disconnect:hover {
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.modal-close:hover {
  color: white;
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.connector-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.connector-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.connector-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.connector-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.faucet-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.faucet-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.faucet-link {
  color: #60a5fa;
  text-decoration: none;
  transition: color 0.2s;
}

.faucet-link:hover {
  color: #93c5fd;
  text-decoration: underline;
}
`

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('wallet-button-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'wallet-button-styles'
  styleEl.textContent = styles
  document.head.appendChild(styleEl)
}
