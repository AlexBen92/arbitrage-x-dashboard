// app/admin/page.tsx
// Admin panel for owner to update NAV and pause/unpause strategies

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { WalletButton } from '@/components/WalletButton'
import { TestnetBanner } from '@/components/TestnetBanner'
import { showTxToast, hideTxToast } from '@/components/TxToast'
import { useTokenNAV } from '@/hooks'
import { STRATEGIES, OWNER_ADDRESS, CONTRACTS, StrategyId } from '@/lib/contracts/addresses'
import { HEDGED_TOKEN_ABI } from '@/lib/contracts/abis'

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  // Redirect if not owner
  useEffect(() => {
    if (isConnected && address?.toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
      router.push('/dashboard')
    }
  }, [isConnected, address, router])

  const isOwner = address?.toLowerCase() === OWNER_ADDRESS.toLowerCase()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400">Owner controls for Sepolia Testnet</p>
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
        {/* Access Control */}
        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <span className="text-4xl mb-4 block">🔐</span>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Owner Access Required</h2>
            <p className="text-gray-300">
              Connect with the owner wallet ({OWNER_ADDRESS.slice(0, 8)}...{OWNER_ADDRESS.slice(-6)}) to access this panel.
            </p>
          </div>
        )}

        {isConnected && !isOwner && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <span className="text-4xl mb-4 block">🚫</span>
            <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-gray-300">
              This panel is only accessible by the contract owner. Your connected wallet is not authorized.
            </p>
          </div>
        )}

        {/* Admin Controls */}
        {isOwner && (
          <>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-400">Owner Access Confirmed</p>
                  <p className="text-sm text-gray-300">You can update NAV and pause/unpause strategies.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {STRATEGIES.map((strategy) => (
                <AdminStrategyCard key={strategy.id} strategyId={strategy.id as StrategyId} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// === Admin Strategy Card ===

interface AdminStrategyCardProps {
  strategyId: StrategyId
}

function AdminStrategyCard({ strategyId }: AdminStrategyCardProps) {
  const { nav, lastUpdate, isPaused, isOutdated, refetchNav } = useTokenNAV(strategyId)
  const address = CONTRACTS[strategyId as keyof typeof CONTRACTS] as `0x${string}`

  // Write contract hooks
  const { writeContractAsync: updateNAVAsync, data: updateHash, isPending: isUpdating } = useWriteContract()
  const { writeContractAsync: pauseAsync, data: pauseHash, isPending: isPausing } = useWriteContract()
  const { writeContractAsync: unpauseAsync, data: unpauseHash, isPending: isUnpausing } = useWriteContract()

  // Wait for transaction receipts
  useWaitForTransactionReceipt({ hash: updateHash })
  useWaitForTransactionReceipt({ hash: pauseHash })
  useWaitForTransactionReceipt({ hash: unpauseHash })

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Unknown'
    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ago`
    return `${hours}h ago`
  }

  const handleUpdateNAV = async () => {
    try {
      const toastId = showTxToast({
        status: 'pending',
        type: 'update_nav',
      })

      await updateNAVAsync({
        address,
        abi: HEDGED_TOKEN_ABI,
        functionName: 'updateNAV',
      })

      showTxToast({
        status: 'success',
        type: 'update_nav',
        hash: updateHash,
      })

      // Refetch after successful update
      setTimeout(() => refetchNav(), 2000)
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'update_nav',
        error: error.message,
      })
    }
  }

  const handlePause = async () => {
    try {
      const toastId = showTxToast({
        status: 'pending',
        type: 'pause',
      })

      await pauseAsync({
        address,
        abi: HEDGED_TOKEN_ABI,
        functionName: 'pause',
      })

      showTxToast({
        status: 'success',
        type: 'pause',
        hash: pauseHash,
      })

      setTimeout(() => refetchNav(), 2000)
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'pause',
        error: error.message,
      })
    }
  }

  const handleUnpause = async () => {
    try {
      const toastId = showTxToast({
        status: 'pending',
        type: 'unpause',
      })

      await unpauseAsync({
        address,
        abi: HEDGED_TOKEN_ABI,
        functionName: 'unpause',
      })

      showTxToast({
        status: 'success',
        type: 'unpause',
        hash: unpauseHash,
      })

      setTimeout(() => refetchNav(), 2000)
    } catch (error: any) {
      showTxToast({
        status: 'error',
        type: 'unpause',
        error: error.message,
      })
    }
  }

  const etherscanUrl = `https://sepolia.etherscan.io/address/${address}`

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{strategyId.replace('_', ' ')}</h3>
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline"
          >
            {address.slice(0, 10)}...{address.slice(-8)} →
          </a>
        </div>
        <div className="flex items-center gap-2">
          {isPaused && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
              PAUSED
            </span>
          )}
          {isOutdated && (
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
              ⚠ OUTDATED
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Current NAV</p>
          <p className="text-xl font-mono text-white">${nav.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Updated</p>
          <p className="text-sm text-gray-300">{formatTimeAgo(lastUpdate)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleUpdateNAV}
          disabled={isUpdating}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            isUpdating
              ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          }`}
        >
          {isUpdating ? '⏳ Updating...' : '🔄 Update NAV'}
        </button>

        <div className="flex gap-3">
          {!isPaused ? (
            <button
              onClick={handlePause}
              disabled={isPausing}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isPausing
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
              }`}
            >
              {isPausing ? '⏳ Pausing...' : '⏸ Pause'}
            </button>
          ) : (
            <button
              onClick={handleUnpause}
              disabled={isUnpausing}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isUnpausing
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isUnpausing ? '⏳ Unpausing...' : '▶️ Unpause'}
            </button>
          )}
        </div>
      </div>

      {/* Transaction Links */}
      {(updateHash || pauseHash || unpauseHash) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Recent Transactions:</p>
          <div className="space-y-1">
            {updateHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${updateHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:underline"
              >
                NAV Update →
              </a>
            )}
            {pauseHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${pauseHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:underline"
              >
                Pause →
              </a>
            )}
            {unpauseHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${unpauseHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:underline"
              >
                Unpause →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
