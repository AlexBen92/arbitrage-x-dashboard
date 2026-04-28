// components/RedeemModal.tsx
// Modal for redeeming tokens

'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRedeem, useUserBalance, useTokenNAV } from '@/hooks'
import { showTxToast, hideTxToast } from './TxToast'
import { STRATEGIES, StrategyId } from '@/lib/contracts/addresses'

interface RedeemModalProps {
  strategyId: StrategyId
  onClose: () => void
}

export function RedeemModal({ strategyId, onClose }: RedeemModalProps) {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')

  const strategy = STRATEGIES.find(s => s.id === strategyId)!
  const { nav } = useTokenNAV(strategyId)
  const { tokenBalance, refetch } = useUserBalance(strategyId, address)
  const { executeRedeem, isRedeeming, redeemHash } = useRedeem(strategyId)

  const maxAmount = tokenBalance
  const amountNum = parseFloat(amount) || 0
  const estimatedUsdc = nav > 0 ? amountNum * nav : 0
  const isValidAmount = amountNum > 0 && amountNum <= maxAmount

  const handleMax = () => {
    setAmount(maxAmount.toFixed(6))
  }

  const handleRedeem = async () => {
    if (!isValidAmount) return

    try {
      const toastId = showTxToast({
        status: 'pending',
        type: 'redeem',
        strategyName: strategy.asset,
      })

      await executeRedeem(amountNum)

      showTxToast({
        status: 'success',
        type: 'redeem',
        hash: redeemHash,
        strategyName: strategy.asset,
        amount: estimatedUsdc.toFixed(2),
      })

      // Close modal after successful redeem
      setTimeout(() => {
        onClose()
        refetch()
      }, 1500)
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'redeem',
        error: error.message,
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-redeem" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{strategy.icon}</span>
            <div>
              <p className="modal-title">Redeem {strategy.name}</p>
              <p className="modal-subtitle-compact">{strategy.asset}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {/* Balance Info */}
        <div className="info-box">
          <div className="info-row">
            <span className="info-label">Your Balance</span>
            <span className="info-value">{maxAmount.toFixed(4)} {strategy.asset}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current NAV</span>
            <span className="info-value">${nav.toFixed(4)}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="input-section">
          <div className="input-header">
            <label className="input-label">Amount to redeem</label>
            <button onClick={handleMax} className="max-button">
              MAX
            </button>
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              placeholder="0.00"
              disabled={isRedeeming}
            />
            <span className="input-suffix">{strategy.asset}</span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max={maxAmount || 1}
            step={maxAmount ? maxAmount / 100 : 0.01}
            value={amountNum}
            onChange={(e) => setAmount(parseFloat(e.target.value).toFixed(6))}
            className="amount-slider"
            disabled={isRedeeming}
          />
        </div>

        {/* Summary */}
        <div className="summary-box">
          <div className="summary-row">
            <span className="summary-label">You will receive (est.)</span>
            <span className="summary-value highlight">
              ≈ {estimatedUsdc.toFixed(2)} USDC
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Redeeming</span>
            <span className="summary-value">{amountNum.toFixed(4)} {strategy.asset}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">At NAV</span>
            <span className="summary-value">${nav.toFixed(4)}</span>
          </div>
        </div>

        {/* Warning */}
        {amountNum > maxAmount && (
          <div className="warning-box">
            ⚠️ Amount exceeds your balance
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRedeem}
          disabled={!isValidAmount || isRedeeming}
          className={`action-button ${
            !isValidAmount ? 'disabled' : ''
          }`}
        >
          {isRedeeming ? '⏳ Redeeming...' : `Redeem for ≈ ${estimatedUsdc.toFixed(2)} USDC`}
        </button>

        {/* Info */}
        <p className="info-text">
          Gas fees: ~$0.01-0.05 on Sepolia • Tokens burned immediately
        </p>
      </div>
    </div>
  )
}

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('redeem-modal-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'redeem-modal-styles'
  styleEl.textContent = `
    .modal-redeem {
      max-width: 480px !important;
    }

    .input-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .max-button {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .max-button:hover {
      background: rgba(16, 185, 129, 0.3);
    }

    .amount-slider {
      width: 100%;
      margin-top: 1rem;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.1);
      outline: none;
    }

    .amount-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
    }

    .amount-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      border: none;
    }

    .amount-slider:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
  document.head.appendChild(styleEl)
}
