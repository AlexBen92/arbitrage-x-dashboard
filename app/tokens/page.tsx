// app/tokens/page.tsx
// Tokens page showing all 6 strategies in a table

'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletButton } from '@/components/WalletButton'
import { MintModal } from '@/components/MintModal'
import { RedeemModal } from '@/components/RedeemModal'
import { TestnetBanner } from '@/components/TestnetBanner'
import { useTokenNAV, useUserBalance } from '@/hooks'
import { STRATEGIES, StrategyId } from '@/lib/contracts/addresses'

type ModalState = { type: 'mint' | 'redeem' | null; strategyId: StrategyId | null }

export default function TokensPage() {
  const { address, isConnected, chain } = useAccount()
  const [modal, setModal] = useState<ModalState>({ type: null, strategyId: null })

  const isWrongNetwork = isConnected && chain?.id !== 11155111

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Hedged Tokens</h1>
            <p className="text-sm text-gray-400">Sepolia Testnet Strategies</p>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Testnet Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <TestnetBanner />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-400">Testnet only — Sepolia network</p>
              <p className="text-sm text-gray-300">No real funds involved. For testing purposes only.</p>
            </div>
          </div>
        </div>

        {/* Network Warning */}
        {isWrongNetwork && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-medium">
              ⚠️ Please switch to Sepolia testnet to interact with tokens.
            </p>
          </div>
        )}

        {/* Tokens Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Token</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                  <th className="text-right p-4 text-gray-400 font-medium">NAV (live)</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Supply</th>
                  {isConnected && !isWrongNetwork && (
                    <th className="text-right p-4 text-gray-400 font-medium">Your Balance</th>
                  )}
                  <th className="text-right p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {STRATEGIES.map((strategy) => (
                  <TokenRow
                    key={strategy.id}
                    strategy={strategy}
                    userAddress={address}
                    isConnected={isConnected && !isWrongNetwork}
                    onOpenMint={() => setModal({ type: 'mint', strategyId: strategy.id })}
                    onOpenRedeem={() => setModal({ type: 'redeem', strategyId: strategy.id })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <span>LIVE — Production ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>BETA — Testing phase</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal.type === 'mint' && modal.strategyId && (
        <MintModal
          strategyId={modal.strategyId}
          onClose={() => setModal({ type: null, strategyId: null })}
        />
      )}
      {modal.type === 'redeem' && modal.strategyId && (
        <RedeemModal
          strategyId={modal.strategyId}
          onClose={() => setModal({ type: null, strategyId: null })}
        />
      )}
    </div>
  )
}

interface TokenRowProps {
  strategy: typeof STRATEGIES[number]
  userAddress?: `0x${string}`
  isConnected: boolean
  onOpenMint: () => void
  onOpenRedeem: () => void
}

function TokenRow({ strategy, userAddress, isConnected, onOpenMint, onOpenRedeem }: TokenRowProps) {
  const { nav, totalSupply, lastUpdate, isPaused, isOutdated } = useTokenNAV(strategy.id as StrategyId)
  const { tokenBalance, usdcBalance } = useUserBalance(strategy.id as StrategyId, userAddress)

  const canMint = isConnected && !isPaused && usdcBalance > 0
  const canRedeem = isConnected && tokenBalance > 0

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Unknown'
    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      {/* Token */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{strategy.icon}</span>
          <div>
            <p className="font-medium text-white">{strategy.name}</p>
            <p className="text-sm text-gray-400">{strategy.asset}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          strategy.type === 'cross-exchange' ? 'bg-purple-500/20 text-purple-400' :
          strategy.type === 'delta-neutral-mm' ? 'bg-blue-500/20 text-blue-400' :
          'bg-cyan-500/20 text-cyan-400'
        }`}>
          {strategy.type === 'cross-exchange' ? 'Cross-X' :
           strategy.type === 'delta-neutral-mm' ? 'MM' :
           'Beta'}
        </span>
      </td>

      {/* NAV */}
      <td className="p-4 text-right">
        <div className="font-mono text-white">${nav.toFixed(4)}</div>
        {isOutdated && (
          <span className="text-xs text-red-400">Outdated</span>
        )}
        <div className="text-xs text-gray-500">{formatTimeAgo(lastUpdate)}</div>
      </td>

      {/* Supply */}
      <td className="p-4 text-right font-mono text-gray-300">
        {totalSupply.toFixed(2)}
      </td>

      {/* Your Balance */}
      {isConnected && (
        <td className="p-4 text-right">
          <div className="font-mono text-white">{tokenBalance.toFixed(4)}</div>
          <div className="text-xs text-gray-500">≈ ${(tokenBalance * nav).toFixed(2)}</div>
        </td>
      )}

      {/* Status */}
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            strategy.badge === 'LIVE' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
          }`}>
            {strategy.badge}
          </span>
          {isPaused && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
              PAUSED
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onOpenMint}
            disabled={!canMint}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              canMint
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            Mint
          </button>
          <button
            onClick={onOpenRedeem}
            disabled={!canRedeem}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              canRedeem
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            Redeem
          </button>
        </div>
      </td>
    </tr>
  )
}
