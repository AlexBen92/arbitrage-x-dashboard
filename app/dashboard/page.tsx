// app/dashboard/page.tsx
// Dashboard with positions, KPIs, activity feed, wallet/network gates

'use client'

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { formatUnits, Log } from 'viem'
import { WalletButton } from '@/components/WalletButton'
import { MintModal } from '@/components/MintModal'
import { RedeemModal } from '@/components/RedeemModal'
import { useTokenNAV, useUserBalance } from '@/hooks'
import { STRATEGIES, CONTRACTS, StrategyId } from '@/lib/contracts/addresses'
import { HEDGED_TOKEN_ABI } from '@/lib/contracts/abis'

type ModalState = { type: 'mint' | 'redeem' | null; strategyId: StrategyId | null }

interface ActivityLog {
  type: 'mint' | 'redeem'
  strategyName: string
  amount: string
  usdcAmount: string
  txHash: string
  timestamp: Date
}

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount()
  const publicClient = usePublicClient({ chainId: sepolia.id })
  const [modal, setModal] = useState<ModalState>({ type: null, strategyId: null })
  const [activities, setActivities] = useState<ActivityLog[]>([])

  const isWrongNetwork = isConnected && chain?.id !== sepolia.id
  const isCorrectNetwork = isConnected && !isWrongNetwork

  // Fetch all token data for connected user
  const tokenData = STRATEGIES.map(strategy => ({
    strategy,
    navData: useTokenNAV(strategy.id as StrategyId),
    balanceData: useUserBalance(strategy.id as StrategyId, address),
  }))

  // Calculate KPIs
  const positions = tokenData.filter(t => t.balanceData.tokenBalance > 0)
  const totalValue = positions.reduce((sum, t) => sum + (t.balanceData.tokenBalance * t.navData.nav), 0)
  const activePositionsCount = positions.length
  const usdcAvailable = tokenData[0]?.balanceData.usdcBalance ?? 0

  // Fetch user activity
  useEffect(() => {
    if (!address || !publicClient) return

    const fetchActivity = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: Object.values(CONTRACTS).filter(a => typeof a === 'string' && a !== CONTRACTS.USDC) as `0x${string}`[],
          event: {
            type: 'event',
            name: 'Minted',
            inputs: [
              { type: 'address', name: 'owner', indexed: true },
              { type: 'uint256', name: 'usdcIn', indexed: false },
              { type: 'uint256', name: 'tokensMinted', indexed: false },
            ],
          },
          args: {
            owner: address as `0x${string}`,
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        })

        // Parse logs (simplified - in production use proper event parsing)
        // This is a placeholder for activity feed
      } catch (error) {
        console.error('Failed to fetch activity:', error)
      }
    }

    fetchActivity()
  }, [address, publicClient])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-400">Your positions on Sepolia Testnet</p>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Wallet Gate */}
        {!isConnected && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
              <span className="text-6xl mb-4 block">👛</span>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to view your positions and interact with strategies.
              </p>
            </div>
          </div>
        )}

        {/* Network Gate */}
        {isWrongNetwork && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-medium">
              ⚠️ Please switch to Sepolia testnet to view your dashboard.
            </p>
          </div>
        )}

        {/* KPIs */}
        {isCorrectNetwork && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <KPICard
              label="Total Value"
              value={`$${totalValue.toFixed(2)}`}
              subtext={`${activePositionsCount} active position${activePositionsCount !== 1 ? 's' : ''}`}
              color="blue"
            />
            <KPICard
              label="USDC Available"
              value={`${usdcAvailable.toFixed(2)} USDC`}
              subtext="Ready to invest"
              color="green"
            />
            <KPICard
              label="Strategies"
              value={STRATEGIES.length.toString()}
              subtext={`${positions.length} funded`}
              color="purple"
            />
          </div>
        )}

        {/* My Positions */}
        {isCorrectNetwork && positions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">My Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map(({ strategy, navData, balanceData }) => (
                <PositionCard
                  key={strategy.id}
                  strategy={strategy}
                  balance={balanceData.tokenBalance}
                  value={balanceData.tokenBalance * navData.nav}
                  nav={navData.nav}
                  lastUpdate={navData.lastUpdate}
                  onRedeem={() => setModal({ type: 'redeem', strategyId: strategy.id })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Available Strategies */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            {positions.length > 0 ? 'Available Strategies' : 'All Strategies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokenData.map(({ strategy, navData, balanceData }) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                nav={navData.nav}
                hasBalance={balanceData.tokenBalance > 0}
                onMint={() => setModal({ type: 'mint', strategyId: strategy.id })}
                isConnected={isCorrectNetwork}
              />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        {isCorrectNetwork && activities.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              {activities.slice(0, 10).map((activity, i) => (
                <ActivityRow key={i} activity={activity} />
              ))}
            </div>
          </section>
        )}
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

// === Subcomponents ===

interface KPICardProps {
  label: string
  value: string
  subtext: string
  color: 'blue' | 'green' | 'purple'
}

function KPICard({ label, value, subtext, color }: KPICardProps) {
  const colors = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{subtext}</p>
    </div>
  )
}

interface PositionCardProps {
  strategy: typeof STRATEGIES[number]
  balance: number
  value: number
  nav: number
  lastUpdate: Date | null
  onRedeem: () => void
}

function PositionCard({ strategy, balance, value, nav, lastUpdate, onRedeem }: PositionCardProps) {
  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Unknown'
    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{strategy.icon}</span>
        <div>
          <p className="font-medium text-white">{strategy.name}</p>
          <p className="text-sm text-gray-400">{strategy.asset}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Balance</span>
          <span className="text-white font-mono">{balance.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Value</span>
          <span className="text-white font-mono">${value.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">NAV</span>
          <span className="text-white font-mono">${nav.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Updated</span>
          <span className="text-gray-500 text-sm">{formatTimeAgo(lastUpdate)}</span>
        </div>
      </div>

      <button
        onClick={onRedeem}
        className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
      >
        Redeem
      </button>
    </div>
  )
}

interface StrategyCardProps {
  strategy: typeof STRATEGIES[number]
  nav: number
  hasBalance: boolean
  onMint: () => void
  isConnected: boolean
}

function StrategyCard({ strategy, nav, hasBalance, onMint, isConnected }: StrategyCardProps) {
  return (
    <div className={`bg-white/5 border ${hasBalance ? 'border-green-500/30' : 'border-white/10'} rounded-xl p-4 relative`}>
      {strategy.badge === 'LIVE' && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      )}
      {strategy.badge === 'BETA' && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
            BETA
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{strategy.icon}</span>
        <div>
          <p className="font-medium text-white">{strategy.name}</p>
          <p className="text-sm text-gray-400">{strategy.asset}</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{strategy.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Sharpe</p>
          <p className="text-white font-mono">{strategy.sharpe.toFixed(2)}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Max DD</p>
          <p className="text-white font-mono">{strategy.maxDD.toFixed(1)}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">Current NAV</span>
        <span className="text-white font-mono">${nav.toFixed(4)}</span>
      </div>

      {!hasBalance && (
        <button
          onClick={onMint}
          disabled={!isConnected}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            isConnected
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          Mint
        </button>
      )}
    </div>
  )
}

interface ActivityRowProps {
  activity: ActivityLog
}

function ActivityRow({ activity }: ActivityRowProps) {
  const etherscanUrl = `https://sepolia.etherscan.io/tx/${activity.txHash}`

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5">
      <div className="flex items-center gap-3">
        <span className="text-xl">{activity.type === 'mint' ? '📈' : '📉'}</span>
        <div>
          <p className="text-white text-sm">
            {activity.type === 'mint' ? 'Minted' : 'Redeemed'} {activity.amount} {activity.strategyName}
          </p>
          <p className="text-gray-500 text-xs">
            {activity.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-mono ${activity.type === 'mint' ? 'text-green-400' : 'text-red-400'}`}>
          {activity.type === 'mint' ? '+' : '-'}{activity.usdcAmount} USDC
        </p>
        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline"
        >
          Etherscan →
        </a>
      </div>
    </div>
  )
}
