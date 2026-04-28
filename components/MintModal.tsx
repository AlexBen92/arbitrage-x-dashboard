// components/MintModal.tsx
// Modal for minting tokens with 2-step approval flow

'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useMint, useUserBalance, useTokenNAV } from '@/hooks'
import { showTxToast, updateTxToast, hideTxToast } from './TxToast'
import { STRATEGIES, StrategyId } from '@/lib/contracts/addresses'

interface MintModalProps {
  strategyId: StrategyId
  onClose: () => void
}

export function MintModal({ strategyId, onClose }: MintModalProps) {
  const { address } = useAccount()
  const [amount, setAmount] = useState('100')
  const [step, setStep] = useState<'input' | 'approving' | 'minting'>('input')

  const strategy = STRATEGIES.find(s => s.id === strategyId)!
  const { nav } = useTokenNAV(strategyId)
  const { usdcBalance, isApproved, refetch: refetchBalance } = useUserBalance(strategyId, address)
  const { executeMint, approve, mint, isApproving, isMinting, approveHash, mintHash } = useMint(strategyId)

  const amountNum = parseFloat(amount) || 0
  const estimatedTokens = nav > 0 ? amountNum / nav : 0
  const hasEnoughBalance = usdcBalance >= amountNum

  // Update step based on transaction status
  useEffect(() => {
    if (isApproving) setStep('approving')
    else if (isMinting) setStep('minting')
    else setStep('input')
  }, [isApproving, isMinting])

  // Handle mint flow
  const handleMint = async () => {
    if (!hasEnoughBalance || amountNum <= 0) return

    try {
      // Check if we need to approve
      if (!isApproved) {
        setStep('approving')
        const toastId = showTxToast({
          status: 'pending',
          type: 'approve',
        })

        await approve(amountNum)

        updateTxToast(toastId, {
          status: 'success',
          type: 'approve',
          hash: approveHash,
        })

        // Wait a bit for approval to propagate, then mint
        setTimeout(async () => {
          await refetchBalance()
          doMint(amountNum)
        }, 2000)
      } else {
        doMint(amountNum)
      }
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'approve',
        error: error.message,
      })
      setStep('input')
    }
  }

  const doMint = async (usdcAmount: number) => {
    try {
      setStep('minting')
      const toastId = showTxToast({
        status: 'pending',
        type: 'mint',
        strategyName: strategy.asset,
      })

      await mint(usdcAmount)

      updateTxToast(toastId, {
        status: 'success',
        type: 'mint',
        hash: mintHash,
        strategyName: strategy.asset,
        amount: estimatedTokens.toFixed(2),
      })

      // Close modal after successful mint
      setTimeout(() => {
        onClose()
        refetchBalance()
      }, 1500)
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'mint',
        error: error.message,
      })
      setStep('input')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-mint" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{strategy.icon}</span>
            <div>
              <p className="modal-title">Mint {strategy.name}</p>
              <p className="modal-subtitle-compact">{strategy.asset}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {/* Progress Steps */}
        <div className="mint-progress">
          <div className={`progress-step ${!isApproved ? 'active' : 'complete'}`}>
            <span className="progress-number">1</span>
            <span className="progress-label">Approve USDC</span>
          </div>
          <div className={`progress-line ${isApproved ? 'complete' : ''}`} />
          <div className={`progress-step ${isApproved ? 'active' : ''}`}>
            <span className="progress-number">2</span>
            <span className="progress-label">Mint Tokens</span>
          </div>
        </div>

        {/* NAV Info */}
        <div className="info-box">
          <div className="info-row">
            <span className="info-label">Current NAV</span>
            <span className="info-value">${nav.toFixed(4)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Your Balance</span>
            <span className="info-value">{usdcBalance.toFixed(2)} USDC</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="input-section">
          <label className="input-label">Amount USDC to invest</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              placeholder="100"
              disabled={step !== 'input'}
            />
            <span className="input-suffix">USDC</span>
          </div>

          {/* Quick amounts */}
          <div className="quick-amounts">
            {[50, 100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="quick-amount-btn"
                disabled={step !== 'input'}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="summary-box">
          <div className="summary-row">
            <span className="summary-label">You will receive (est.)</span>
            <span className="summary-value highlight">
              ≈ {estimatedTokens.toFixed(2)} {strategy.asset}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">At current NAV</span>
            <span className="summary-value">${nav.toFixed(4)}</span>
          </div>
        </div>

        {/* Warning */}
        {!hasEnoughBalance && (
          <div className="warning-box">
            ⚠️ Insufficient USDC balance. Get testnet USDC from the faucet.
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleMint}
          disabled={!hasEnoughBalance || amountNum <= 0 || step !== 'input'}
          className={`action-button ${
            !hasEnoughBalance || amountNum <= 0 ? 'disabled' : ''
          }`}
        >
          {step === 'approving' && '🔄 Approving USDC...'}
          {step === 'minting' && '⏳ Minting tokens...'}
          {step === 'input' && (!isApproved ? '① Approve USDC' : '② Mint Tokens')}
        </button>

        {/* Info */}
        <p className="info-text">
          Gas fees: ~$0.01-0.05 on Sepolia • Powered by Arbitrage X
        </p>
      </div>
    </div>
  )
}

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('mint-modal-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'mint-modal-styles'
  styleEl.textContent = `
    .modal-mint {
      max-width: 480px !important;
    }

    .modal-title {
      color: white;
      font-weight: 600;
      font-size: 1.125rem;
      margin: 0;
    }

    .modal-subtitle-compact {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      margin: 0;
    }

    .mint-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .progress-step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.875rem;
    }

    .progress-step.active {
      color: white;
    }

    .progress-step.complete {
      color: #10b981;
    }

    .progress-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .progress-step.active .progress-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .progress-step.complete .progress-number {
      background: #10b981;
    }

    .progress-line {
      flex: 1;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
    }

    .progress-line.complete {
      background: #10b981;
    }

    .info-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }

    .info-value {
      color: white;
      font-weight: 500;
    }

    .input-section {
      margin-bottom: 1rem;
    }

    .input-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .input-wrapper {
      position: relative;
      margin-bottom: 0.75rem;
    }

    .amount-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem 3rem 1rem 1rem;
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .amount-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .amount-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-suffix {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.875rem;
    }

    .quick-amounts {
      display: flex;
      gap: 0.5rem;
    }

    .quick-amount-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-amount-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .quick-amount-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .summary-box {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .summary-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }

    .summary-value {
      color: white;
      font-weight: 500;
      font-family: monospace;
    }

    .summary-value.highlight {
      color: #10b981;
      font-size: 1rem;
    }

    .warning-box {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin-bottom: 1rem;
      color: #fbbf24;
      font-size: 0.875rem;
    }

    .action-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 0.75rem;
    }

    .action-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .action-button:disabled,
    .action-button.disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.4);
      cursor: not-allowed;
    }

    .info-text {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.75rem;
      text-align: center;
      margin: 0;
    }
  `
  document.head.appendChild(styleEl)
}
