'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';

// === Types ===

interface PowerPerpMetrics {
  ethPrice: number;
  ethPriceChange: number;
  squeethPrice: number;
  squeethIndex: number;
  theoreticalPrice: number;
  impliedVol: number;
  realizedVol: number;
  variance: number;
  fundingRate: number;
  markup: number;
  markupBps: number;
  opportunityScore: 'high' | 'medium' | 'low' | 'none';
}

interface Position {
  id: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

// === Mock Data Generator ===

function generateMockMetrics(): PowerPerpMetrics {
  const ethPrice = 3000 + Math.random() * 500;
  const ethChange = (Math.random() - 0.5) * 10;
  const vol = 0.5 + Math.random() * 0.3;
  const variance = vol * vol;
  const fundingPeriod = 1 / 24 / 365; // 1 hour in years
  const theoreticalPrice = 2 * variance * fundingPeriod;
  const markup = (Math.random() - 0.3) * theoreticalPrice * 0.5;
  const squeethPrice = theoreticalPrice + markup;

  return {
    ethPrice,
    ethPriceChange: ethChange,
    squeethPrice,
    squeethIndex: Math.pow(ethPrice / 3000, 2),
    theoreticalPrice,
    impliedVol: vol + (markup > 0 ? 0.05 : -0.02),
    realizedVol: vol,
    variance,
    fundingRate: 2 * (variance - variance) * fundingPeriod * 100,
    markup,
    markupBps: (markup / theoreticalPrice) * 10000,
    opportunityScore: Math.abs(markup) > theoreticalPrice * 0.2 ? 'high' :
                     Math.abs(markup) > theoreticalPrice * 0.1 ? 'medium' :
                     Math.abs(markup) > theoreticalPrice * 0.05 ? 'low' : 'none',
  };
}

function generateMockPositions(): Position[] {
  return [
    {
      id: '1',
      type: 'long',
      size: 1.5,
      entryPrice: 0.000042,
      currentPrice: 0.000045,
      pnl: 0.0000045,
      pnlPercent: 7.14,
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      type: 'short',
      size: 2.0,
      entryPrice: 0.000038,
      currentPrice: 0.000037,
      pnl: 0.000002,
      pnlPercent: 2.63,
      timestamp: Date.now() - 7200000,
    },
  ];
}

// === Components ===

export function PowerPerpDashboard() {
  const [metrics, setMetrics] = useState<PowerPerpMetrics>(generateMockMetrics());
  const [positions, setPositions] = useState<Position[]>(generateMockPositions());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(generateMockMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        autoRefresh={autoRefresh}
        onToggleRefresh={() => setAutoRefresh(!autoRefresh)}
        isConnected={isConnected}
      />

      {/* Opportunity Alert */}
      {metrics.opportunityScore !== 'none' && (
        <OpportunityAlert score={metrics.opportunityScore} metrics={metrics} />
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ETHPriceCard price={metrics.ethPrice} change={metrics.ethPriceChange} />
        <SqueethPriceCard price={metrics.squeethPrice} index={metrics.squeethIndex} />
        <VarianceCard implied={metrics.impliedVol} realized={metrics.realizedVol} />
        <MarkupCard markup={metrics.markup} bps={metrics.markupBps} score={metrics.opportunityScore} />
      </div>

      {/* Pricing Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PriceComparison metrics={metrics} />
        <FundingAnalysis metrics={metrics} />
        <OpportunityGauge score={metrics.opportunityScore} />
      </div>

      {/* Positions */}
      {isConnected && (
        <PositionsPanel positions={positions} />
      )}

      {/* Trade Execution */}
      {isConnected && (
        <TradeExecutionPanel metrics={metrics} />
      )}
    </div>
  );
}

// === Header Component ===

interface DashboardHeaderProps {
  autoRefresh: boolean;
  onToggleRefresh: () => void;
  isConnected: boolean;
}

function DashboardHeader({ autoRefresh, onToggleRefresh, isConnected }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Power Perpetual Arbitrage</h1>
        <p className="text-sm text-gray-400 mt-1">ETH² / Squeeth arbitrage opportunities</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-crypto-card rounded-lg border border-crypto-border">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        <button
          onClick={onToggleRefresh}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            autoRefresh
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}
        >
          <span className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`}>
            🔄
          </span>
          <span className="text-sm font-medium">{autoRefresh ? 'Live' : 'Paused'}</span>
        </button>
      </div>
    </div>
  );
}

// === Opportunity Alert ===

interface OpportunityAlertProps {
  score: 'high' | 'medium' | 'low' | 'none';
  metrics: PowerPerpMetrics;
}

function OpportunityAlert({ score, metrics }: OpportunityAlertProps) {
  if (score === 'none') return null;

  const configs = {
    high: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: '🔥',
      title: 'HIGH OPPORTUNITY',
    },
    medium: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: '⚡',
      title: 'Opportunity Detected',
    },
    low: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: '👁️',
      title: 'Monitoring',
    },
  };

  const config = configs[score];
  const action = metrics.markup > 0 ? 'Short Squeeth' : 'Long Squeeth';

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <p className={`font-semibold ${config.text}`}>{config.title}</p>
          <p className="text-sm text-gray-400">
            {action} - Spread: {metrics.markupBps.toFixed(0)} bps
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
        View Trade
      </button>
    </div>
  );
}

// === Metric Cards ===

interface ETHPriceCardProps {
  price: number;
  change: number;
}

function ETHPriceCard({ price, change }: ETHPriceCardProps) {
  return (
    <div className="p-4 bg-crypto-card rounded-xl border border-crypto-border hover:border-crypto-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">ETH Price</span>
        <span className="text-xl">Ξ</span>
      </div>
      <p className="text-2xl font-bold text-white">${price.toFixed(2)}</p>
      <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}% (24h)
      </p>
    </div>
  );
}

interface SqueethPriceCardProps {
  price: number;
  index: number;
}

function SqueethPriceCard({ price, index }: SqueethPriceCardProps) {
  return (
    <div className="p-4 bg-crypto-card rounded-xl border border-crypto-border hover:border-purple-500/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">ETH² Price</span>
        <span className="text-xl">📈</span>
      </div>
      <p className="text-2xl font-bold text-white">{price.toFixed(6)}</p>
      <p className="text-sm text-gray-400 mt-1">
        Index: {index.toFixed(4)}
      </p>
    </div>
  );
}

interface VarianceCardProps {
  implied: number;
  realized: number;
}

function VarianceCard({ implied, realized }: VarianceCardProps) {
  const diff = ((implied - realized) / realized) * 100;

  return (
    <div className="p-4 bg-crypto-card rounded-xl border border-crypto-border hover:border-blue-500/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">Volatility</span>
        <span className="text-xl">📊</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">{(implied * 100).toFixed(0)}%</p>
        <p className={`text-sm ${diff >= 0 ? 'text-red-400' : 'text-green-400'}`}>
          iv
        </p>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Realized: {(realized * 100).toFixed(0)}% ({diff >= 0 ? '+' : ''}{diff.toFixed(0)}%)
      </p>
    </div>
  );
}

interface MarkupCardProps {
  markup: number;
  bps: number;
  score: 'high' | 'medium' | 'low' | 'none';
}

function MarkupCard({ markup, bps, score }: MarkupCardProps) {
  const isPositive = markup >= 0;

  return (
    <div className={`p-4 rounded-xl border transition-colors ${
      score === 'high' ? 'bg-green-500/10 border-green-500/30' :
      score === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
      'bg-crypto-card border-crypto-border'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">Markup</span>
        <span className="text-xl">{score === 'high' ? '💰' : '📏'}</span>
      </div>
      <p className={`text-2xl font-bold ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
        {isPositive ? '+' : ''}{markup.toFixed(6)}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        {bps.toFixed(0)} bps vs fair value
      </p>
    </div>
  );
}

// === Analysis Panels ===

interface PriceComparisonProps {
  metrics: PowerPerpMetrics;
}

function PriceComparison({ metrics }: PriceComparisonProps) {
  const fairValue = metrics.theoreticalPrice;
  const marketPrice = metrics.squeethPrice;
  const premium = ((marketPrice - fairValue) / fairValue) * 100;

  return (
    <div className="p-5 bg-crypto-card rounded-xl border border-crypto-border">
      <h3 className="text-lg font-semibold text-white mb-4">Price Analysis</h3>

      <div className="space-y-4">
        {/* Fair Value vs Market */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Fair Value (Theoretical)</span>
            <span className="text-white font-mono">{fairValue.toFixed(6)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '50%' }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Market Price</span>
            <span className="text-white font-mono">{marketPrice.toFixed(6)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${premium > 0 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${50 + premium / 2}%` }}
            />
          </div>
        </div>

        {/* Premium */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Premium</span>
            <span className={`font-semibold ${premium > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {premium > 0 ? '+' : ''}{premium.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {premium > 0 ? 'Squeeth trading above fair value - short opportunity' : 'Squeeth trading below - long opportunity'}
          </p>
        </div>

        {/* Pricing Formula */}
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-2">Pricing Formula:</p>
          <p className="text-xs font-mono text-gray-400 bg-black/30 p-2 rounded">
            V = 2 × σ² × τ
          </p>
          <p className="text-xs text-gray-500 mt-2">
            σ² = {metrics.variance.toFixed(4)} | τ = 1h | V = {fairValue.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FundingAnalysisProps {
  metrics: PowerPerpMetrics;
}

function FundingAnalysis({ metrics }: FundingAnalysisProps) {
  return (
    <div className="p-5 bg-crypto-card rounded-xl border border-crypto-border">
      <h3 className="text-lg font-semibold text-white mb-4">Funding Analysis</h3>

      <div className="space-y-4">
        {/* Funding Rate */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Current Funding Rate</span>
          <span className={`text-lg font-semibold ${metrics.fundingRate >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.fundingRate >= 0 ? '+' : ''}{metrics.fundingRate.toFixed(4)}%
          </span>
        </div>

        {/* Interpretation */}
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-sm text-gray-300">
            {metrics.fundingRate > 0
              ? 'Longs pay shorts (realized vol > implied vol)'
              : metrics.fundingRate < 0
              ? 'Shorts pay longs (implied vol > realized vol)'
              : 'Funding balanced'}
          </p>
        </div>

        {/* Annualized Projection */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Annualized Funding (Projection)</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-black/30 rounded">
              <p className="text-xs text-gray-500">Daily</p>
              <p className="text-sm font-mono text-white">{(metrics.fundingRate * 24).toFixed(2)}%</p>
            </div>
            <div className="p-2 bg-black/30 rounded">
              <p className="text-xs text-gray-500">Yearly</p>
              <p className="text-sm font-mono text-white">{(metrics.fundingRate * 24 * 365).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Vega Sensitivity */}
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-1">Vega (1% vol change)</p>
          <p className="text-sm font-mono text-white">
            ≈ {(2 * metrics.impliedVol * (1 / 24 / 365) * 100).toFixed(6)} price change
          </p>
        </div>
      </div>
    </div>
  );
}

interface OpportunityGaugeProps {
  score: 'high' | 'medium' | 'low' | 'none';
}

function OpportunityGauge({ score }: OpportunityGaugeProps) {
  const scores = { high: 100, medium: 66, low: 33, none: 0 };
  const value = scores[score];

  const colors = {
    high: 'from-green-500 to-emerald-400',
    medium: 'from-yellow-500 to-orange-400',
    low: 'from-blue-500 to-cyan-400',
    none: 'from-gray-600 to-gray-500',
  };

  return (
    <div className="p-5 bg-crypto-card rounded-xl border border-crypto-border">
      <h3 className="text-lg font-semibold text-white mb-4">Opportunity Score</h3>

      <div className="flex flex-col items-center">
        {/* Gauge */}
        <div className="relative w-40 h-20 overflow-hidden">
          <div className="absolute inset-0 rounded-t-full bg-gray-700" />
          <div
            className={`absolute inset-0 rounded-t-full bg-gradient-to-r ${colors[score]} transition-all duration-500`}
            style={{ clipPath: `inset(0 ${100 - value / 2}% 0 0)` }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-crypto-card rounded-t-full" />
        </div>

        {/* Score Label */}
        <div className="mt-4 text-center">
          <p className={`text-3xl font-bold ${
            score === 'high' ? 'text-green-400' :
            score === 'medium' ? 'text-yellow-400' :
            score === 'low' ? 'text-blue-400' :
            'text-gray-400'
          }`}>
            {score.toUpperCase()}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {score === 'high' ? 'Execute trade recommended' :
             score === 'medium' ? 'Consider position' :
             score === 'low' ? 'Monitor conditions' :
             'No active opportunity'}
          </p>
        </div>

        {/* Criteria */}
        <div className="mt-4 w-full space-y-2">
          {[
            { label: 'Spread vs fair value', met: score !== 'none' },
            { label: 'Volatility divergence', met: score === 'high' || score === 'medium' },
            { label: 'Liquidity sufficient', met: true },
          ].map((criterion, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${criterion.met ? 'bg-green-500' : 'bg-gray-600'}`} />
              <span className="text-xs text-gray-400">{criterion.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === Positions Panel ===

interface PositionsPanelProps {
  positions: Position[];
}

function PositionsPanel({ positions }: PositionsPanelProps) {
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="p-5 bg-crypto-card rounded-xl border border-crypto-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Positions</h3>
        <span className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          PnL: {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(6)} ETH
        </span>
      </div>

      {positions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No active positions</p>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      )}
    </div>
  );
}

interface PositionCardProps {
  position: Position;
}

function PositionCard({ position }: PositionCardProps) {
  const isLong = position.type === 'long';

  return (
    <div className="p-4 bg-black/30 rounded-lg border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${isLong ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isLong ? 'LONG' : 'SHORT'}
          </span>
          <span className="text-sm text-gray-400">{position.size} ETH²</span>
        </div>
        <span className={`text-sm font-semibold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Entry</p>
          <p className="font-mono text-white">{position.entryPrice.toFixed(6)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Current</p>
          <p className="font-mono text-white">{position.currentPrice.toFixed(6)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">PnL</p>
          <p className={`font-mono ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(6)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors">
          Hedge
        </button>
        <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

// === Trade Execution Panel ===

interface TradeExecutionPanelProps {
  metrics: PowerPerpMetrics;
}

function TradeExecutionPanel({ metrics }: TradeExecutionPanelProps) {
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [size, setSize] = useState('1.0');
  const [slippage, setSlippage] = useState('0.5');

  const recommendedAction = metrics.markup > 0 ? 'short' : 'long';

  return (
    <div className="p-5 bg-crypto-card rounded-xl border border-crypto-border">
      <h3 className="text-lg font-semibold text-white mb-4">Execute Trade</h3>

      {/* Recommendation */}
      {metrics.opportunityScore !== 'none' && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">
            💡 Recommendation: <span className="font-semibold">{recommendedAction.toUpperCase()}</span> Squeeth
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Current {recommendedAction === 'short' ? 'premium' : 'discount'}: {metrics.markupBps.toFixed(0)} bps
          </p>
        </div>
      )}

      {/* Trade Type Selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Trade Type</p>
        <div className="flex gap-2">
          <button
            onClick={() => setTradeType('long')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              tradeType === 'long'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Long ETH²
          </button>
          <button
            onClick={() => setTradeType('short')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              tradeType === 'short'
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Short ETH²
          </button>
        </div>
      </div>

      {/* Size Input */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Position Size (ETH²)</p>
        <div className="relative">
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-crypto-accent"
            step="0.1"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">ETH²</span>
        </div>
      </div>

      {/* Slippage */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Max Slippage</p>
        <div className="flex gap-2">
          {['0.1', '0.5', '1.0', '3.0'].map((s) => (
            <button
              key={s}
              onClick={() => setSlippage(s)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                slippage === s
                  ? 'bg-crypto-accent text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Trade Summary */}
      <div className="mb-4 p-3 bg-black/30 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. Price</span>
          <span className="font-mono text-white">{metrics.squeethPrice.toFixed(6)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. Cost</span>
          <span className="font-mono text-white">{(parseFloat(size) * metrics.squeethPrice).toFixed(4)} ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Max Slippage</span>
          <span className="font-mono text-white">{slippage}%</span>
        </div>
      </div>

      {/* Execute Button */}
      <button className="w-full py-4 bg-gradient-to-r from-crypto-accent to-crypto-accent-dark text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
        Execute {tradeType.toUpperCase()} Position
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Gas fees will be calculated before execution
      </p>
    </div>
  );
}
