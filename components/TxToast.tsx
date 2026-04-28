// components/TxToast.tsx
// Transaction toast notifications with pending, success, and error states
// Includes confetti animation for successful mints

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type TxStatus = 'pending' | 'success' | 'error'
export type TxType = 'approve' | 'mint' | 'redeem' | 'update_nav' | 'pause' | 'unpause'

export interface Toast {
  id: string
  status: TxStatus
  type: TxType
  hash?: `0x${string}`
  error?: string
  strategyName?: string
  amount?: string
}

interface TxToastProps {
  status: TxStatus
  type: TxType
  hash?: `0x${string}`
  error?: string
  strategyName?: string
  amount?: string
  onClose?: () => void
}

export function TxToast({
  status,
  type,
  hash,
  error,
  strategyName,
  amount,
  onClose,
}: TxToastProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (status === 'success' && type === 'mint') {
      triggerConfetti()
    }
  }, [status, type])

  if (!mounted) return null

  const etherscanUrl = hash
    ? `https://sepolia.etherscan.io/tx/${hash}`
    : undefined

  const getContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          color: 'bg-orange-500/10 border-orange-500/30',
          title: getPendingTitle(type),
          subtitle: getPendingSubtitle(type),
        }
      case 'success':
        return {
          icon: '✅',
          color: 'bg-green-500/10 border-green-500/30',
          title: getSuccessTitle(type),
          subtitle: getSuccessSubtitle(type, strategyName, amount),
        }
      case 'error':
        return {
          icon: '❌',
          color: 'bg-red-500/10 border-red-500/30',
          title: 'Transaction Failed',
          subtitle: getErrorMessage(error),
        }
    }
  }

  const content = getContent()

  return (
    <div className={`tx-toast ${content.color}`}>
      <div className="tx-toast-content">
        <span className="tx-toast-icon">{content.icon}</span>
        <div className="tx-toast-text">
          <p className="tx-toast-title">{content.title}</p>
          <p className="tx-toast-subtitle">{content.subtitle}</p>
          {etherscanUrl && (
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-toast-link"
            >
              View on Etherscan →
            </a>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="tx-toast-close">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

// Helper functions for messages
function getPendingTitle(type: TxType): string {
  switch (type) {
    case 'approve':
      return 'Approving USDC...'
    case 'mint':
      return 'Minting tokens...'
    case 'redeem':
      return 'Redeeming tokens...'
    case 'update_nav':
      return 'Updating NAV...'
    case 'pause':
      return 'Pausing strategy...'
    case 'unpause':
      return 'Unpausing strategy...'
  }
}

function getPendingSubtitle(type: TxType): string {
  switch (type) {
    case 'approve':
      return 'Confirm in your wallet to allow spending'
    case 'mint':
      return 'Confirm the mint transaction'
    case 'redeem':
      return 'Confirm the redeem transaction'
    case 'update_nav':
      return 'Updating strategy NAV with latest data'
    case 'pause':
      return 'Pausing new deposits and redemptions'
    case 'unpause':
      return 'Resuming normal operations'
  }
}

function getSuccessTitle(type: TxType): string {
  switch (type) {
    case 'approve':
      return 'USDC Approved'
    case 'mint':
      return 'Tokens Minted!'
    case 'redeem':
      return 'Tokens Redeemed!'
    case 'update_nav':
      return 'NAV Updated'
    case 'pause':
      return 'Strategy Paused'
    case 'unpause':
      return 'Strategy Unpaused'
  }
}

function getSuccessSubtitle(
  type: TxType,
  strategyName?: string,
  amount?: string
): string {
  switch (type) {
    case 'approve':
      return 'Ready to mint tokens'
    case 'mint':
      return strategyName && amount
        ? `Minted ${amount} ${strategyName}`
        : 'Tokens successfully minted'
    case 'redeem':
      return strategyName && amount
        ? `Redeemed for ${amount} USDC`
        : 'Tokens successfully redeemed'
    case 'update_nav':
      return 'Strategy NAV updated successfully'
    case 'pause':
      return 'Strategy paused - no new operations'
    case 'unpause':
      return 'Strategy resumed - operations active'
  }
}

function getErrorMessage(error?: string): string {
  if (!error) return 'Transaction failed. Please try again.'

  // Parse common errors
  if (error.includes('insufficient funds')) {
    return 'Insufficient balance to complete transaction'
  }
  if (error.includes('user rejected')) {
    return 'Transaction rejected in wallet'
  }
  if (error.includes('execution reverted')) {
    return 'Contract execution failed'
  }
  if (error.includes('allowance')) {
    return 'Insufficient allowance. Please approve USDC first.'
  }

  // Return a readable version of the error
  return error.length > 100
    ? error.slice(0, 100) + '...'
    : error
}

// Confetti effect
function triggerConfetti() {
  const colors = ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444']

  for (let i = 0; i < 50; i++) {
    createConfettiParticle(colors)
  }
}

function createConfettiParticle(colors: string[]) {
  const particle = document.createElement('div')
  particle.style.cssText = `
    position: fixed;
    width: ${Math.random() * 10 + 5}px;
    height: ${Math.random() * 10 + 5}px;
    background: ${colors[Math.floor(Math.random() * colors.length)]};
    left: ${Math.random() * 100}vw;
    top: -20px;
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    pointer-events: none;
    z-index: 9999;
    animation: fall ${Math.random() * 2 + 2}s linear forwards;
  `
  document.body.appendChild(particle)

  setTimeout(() => particle.remove(), 4000)
}

// Inject confetti animation
if (typeof document !== 'undefined' && !document.getElementById('tx-toast-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'tx-toast-styles'
  styleEl.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }

    .tx-toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      border-radius: 0.75rem;
      border: 1px solid;
      padding: 1rem;
      max-width: 400px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .tx-toast-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .tx-toast-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .tx-toast-text {
      flex: 1;
      min-width: 0;
    }

    .tx-toast-title {
      color: white;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }

    .tx-toast-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.75rem;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .tx-toast-link {
      color: #60a5fa;
      font-size: 0.75rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .tx-toast-link:hover {
      text-decoration: underline;
    }

    .tx-toast-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 0.25rem;
      font-size: 0.875rem;
      line-height: 1;
    }

    .tx-toast-close:hover {
      color: white;
    }

    @media (max-width: 640px) {
      .tx-toast {
        right: 1rem;
        left: 1rem;
        bottom: 1rem;
      }
    }
  `
  document.head.appendChild(styleEl)
}

// Toast manager for multiple toasts
class ToastManager {
  private toasts: Toast[] = []
  private listeners: Set<(toasts: Toast[]) => void> = new Set()

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  add(toast: Omit<Toast, 'id'>): string {
    const id = Math.random().toString(36).slice(2)
    this.toasts = [...this.toasts, { ...toast, id }]
    this.notify()
    return id
  }

  update(id: string, updates: Partial<Toast>): void {
    this.toasts = this.toasts.map(t => t.id === id ? { ...t, ...updates } : t)
    this.notify()
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  getToasts() {
    return [...this.toasts]
  }
}

export const toastManager = new ToastManager()

// Convenience functions
export function showTxToast(props: Omit<Toast, 'id'>) {
  return toastManager.add(props)
}

export function updateTxToast(id: string, updates: Partial<Toast>) {
  toastManager.update(id, updates)
}

export function hideTxToast(id: string) {
  toastManager.remove(id)
}
