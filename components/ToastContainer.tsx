// components/ToastContainer.tsx
// Container for displaying transaction toasts

'use client'

import { useEffect, useState } from 'react'
import { TxToast, toastManager, Toast } from './TxToast'

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts)
    return unsubscribe
  }, [])

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <TxToast
          key={toast.id}
          status={toast.status}
          type={toast.type}
          hash={toast.hash}
          error={toast.error}
          strategyName={toast.strategyName}
          amount={toast.amount}
          onClose={() => toastManager.remove(toast.id)}
        />
      ))}
    </div>
  )
}

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('toast-container-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'toast-container-styles'
  styleEl.textContent = `
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 1000;
      pointer-events: none;
    }

    .toast-container > * {
      pointer-events: auto;
    }

    @media (max-width: 640px) {
      .toast-container {
        right: 1rem;
        left: 1rem;
        bottom: 1rem;
      }
    }
  `
  document.head.appendChild(styleEl)
}
