"use client";

import { useAccount } from 'wagmi';
import Image from 'next/image';

const strategies = [
  {
    id: "CROSS_SOL",
    name: "Cross-Exchange SOL",
    type: "Cross-Exchange Arbitrage",
    badge: "LIVE",
    badgeColor: "green",
    sharpe: 18.72,
    maxDD: 0.0,
    asset: "SOL",
    description: "Exploits SOL price spread between Binance & Bybit (>0.1% threshold)",
    apy: "+3.2% avg/month"
  },
  {
    id: "CROSS_MATIC",
    name: "Cross-Exchange MATIC",
    type: "Cross-Exchange Arbitrage",
    badge: "LIVE",
    badgeColor: "green",
    sharpe: 14.99,
    maxDD: 0.0,
    asset: "MATIC",
    description: "Lower threshold (0.05%) on MATIC for higher hit rate",
    apy: "+2.8% avg/month"
  },
  {
    id: "MM_LINK",
    name: "Delta-Neutral MM LINK",
    type: "Market Making",
    badge: "LIVE",
    badgeColor: "green",
    sharpe: 14.41,
    maxDD: 3.8,
    asset: "LINK",
    description: "0.2% bid/ask spread with inventory skew hedge on LINK",
    apy: "+2.1% avg/month"
  },
  {
    id: "MM_AVAX",
    name: "Delta-Neutral MM AVAX",
    type: "Market Making",
    badge: "LIVE",
    badgeColor: "green",
    sharpe: 13.69,
    maxDD: 2.6,
    asset: "AVAX",
    description: "Aggressive skew factor (2.0) for faster inventory rebalancing",
    apy: "+1.9% avg/month"
  },
  {
    id: "MM_SOL",
    name: "Delta-Neutral MM SOL",
    type: "Market Making",
    badge: "BETA",
    badgeColor: "orange",
    sharpe: 13.03,
    maxDD: 3.0,
    asset: "SOL",
    description: "Lower skew (0.5) to tolerate wider SOL swing reversions",
    apy: "+1.7% avg/month"
  },
  {
    id: "BETA_AVAX",
    name: "Beta-Neutral AVAX",
    type: "Beta-Neutral",
    badge: "BETA",
    badgeColor: "orange",
    sharpe: 11.95,
    maxDD: 6.7,
    asset: "AVAX",
    description: "Alpha = Return_AVAX - 1.4 × Return_BTC, 80% hedge ratio",
    apy: "+1.5% avg/month"
  }
];

const assetIcons: Record<string, string> = {
  SOL: "https://cdn.simpleicons.org/solana",
  MATIC: "https://cdn.simpleicons.org/polYGON",
  LINK: "https://cdn.simpleicons.org/chainlink",
  AVAX: "https://cdn.simpleicons.org/avalanche",
};

function SharpeBar({ value }: { value: number }) {
  const percentage = Math.min((value / 20) * 100, 100);
  const color = value >= 15 ? 'bg-green-500' : value >= 10 ? 'bg-emerald-400' : 'bg-yellow-400';

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">Sharpe Ratio</span>
        <span className="font-mono text-text-primary font-semibold">{value.toFixed(2)}</span>
      </div>
      <div className="sharpe-bar">
        <div
          className={`sharpe-bar-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MaxDD({ value }: { value: number }) {
  const color = value < 3 ? 'text-green-400' : value < 7 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">Max Drawdown</span>
        <span className={`font-mono font-semibold ${color}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="sharpe-bar">
        <div
          className={`sharpe-bar-fill ${value < 3 ? 'bg-green-500' : value < 7 ? 'bg-orange-500' : 'bg-red-500'}`}
          style={{ width: `${Math.min(value, 10) * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function Strategies() {
  const { isConnected } = useAccount();

  return (
    <section id="strategies" className="py-24 bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Live Strategies
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            6 market-neutral strategies deployed on Sepolia.
            Track performance in real-time, mint tokens, and earn alpha.
          </p>
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="strategy-card">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center">
                    <Image
                      src={assetIcons[strategy.asset]}
                      alt={strategy.asset}
                      width={24}
                      height={24}
                      className="opacity-80"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{strategy.name}</h3>
                    <p className="text-xs text-text-secondary">{strategy.type}</p>
                  </div>
                </div>
                <span className={`badge-${strategy.badgeColor.toLowerCase()}`}>
                  {strategy.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-4 min-h-[40px]">
                {strategy.description}
              </p>

              {/* Metrics */}
              <SharpeBar value={strategy.sharpe} />
              <MaxDD value={strategy.maxDD} />

              {/* APY */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Avg Monthly Return</span>
                  <span className="text-sm font-semibold text-green-400">{strategy.apy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <a
                  href="/backtest"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-text-primary bg-bg-secondary hover:bg-bg-border border border-border rounded-lg transition-colors"
                >
                  Backtest
                </a>
                {isConnected ? (
                  <a
                    href="/dashboard"
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg transition-all"
                  >
                    Deploy
                  </a>
                ) : (
                  <button className="flex-1 px-4 py-2.5 text-sm font-medium text-text-muted bg-bg-secondary border border-border rounded-lg cursor-not-allowed">
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
