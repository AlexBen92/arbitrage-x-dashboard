'use client';

import React, { useState } from 'react';

// === Types ===

interface BacktestMetrics {
  // Return metrics
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;

  // Risk metrics
  maxDrawdown: number;
  volatility: number;
  var95: number;
  cvar95: number;

  // Trading metrics
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;
  avgTradeDuration: string;

  // Risk-adjusted metrics
  informationRatio: number;
  beta: number;
  alpha: number;
  trackingError: number;

  // Other
  skewness: number;
  kurtosis: number;
  kellyCriterion: number;
}

interface TokenBacktest {
  id: string;
  name: string;
  symbol: string;
  type: 'cross' | 'mm' | 'beta';
  metrics: BacktestMetrics;
  equityCurve: number[];
  description: string;
  color: string;
  icon: string;
  period: string;
  riskLevel: 'Conservateur' | 'Modéré' | 'Dynamique';
  minInvestment: number;
  fees: string;
}

// === Mock Backtest Data ===

const backtestsData: TokenBacktest[] = [
  {
    id: 'cross_sdl',
    name: 'Cross SDL',
    symbol: 'CROSS_SDL',
    type: 'cross',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-purple-500 to-indigo-600',
    icon: '🔄',
    description: 'Stratégie cross-asset qui exploite les écarts de prix entre exchanges pour SDL. Arbitrage statistique avec couverture automatique.',
    riskLevel: 'Modéré',
    minInvestment: 100,
    fees: '0.1% entrée, 0% sortie',
    equityCurve: [100, 102.5, 105.3, 103.8, 107.2, 110.5, 108.9, 112.4, 115.8, 118.2],
    metrics: {
      totalReturn: 18.2,
      annualizedReturn: 8.7,
      sharpeRatio: 1.42,
      sortinoRatio: 1.89,
      calmarRatio: 0.98,
      maxDrawdown: -18.5,
      volatility: 12.3,
      var95: -2.1,
      cvar95: -3.8,
      winRate: 58.3,
      profitFactor: 1.67,
      avgWin: 2.8,
      avgLoss: -1.9,
      totalTrades: 342,
      avgTradeDuration: '4h 32m',
      informationRatio: 0.73,
      beta: 0.42,
      alpha: 3.2,
      trackingError: 8.9,
      skewness: 0.23,
      kurtosis: 2.8,
      kellyCriterion: 12.5,
    },
  },
  {
    id: 'cross_matic',
    name: 'Cross MATIC',
    symbol: 'CROSS_MATIC',
    type: 'cross',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-indigo-500 to-purple-600',
    icon: '🔀',
    description: 'Arbitrage inter-exchanges sur MATIC (Polygon). Exploite les inefficacités de prix entre CEX centralisés et DEX décentralisés.',
    riskLevel: 'Modéré',
    minInvestment: 100,
    fees: '0.1% entrée, 0% sortie',
    equityCurve: [100, 101.8, 104.2, 106.5, 105.1, 108.4, 111.2, 109.5, 113.8, 116.5],
    metrics: {
      totalReturn: 16.5,
      annualizedReturn: 7.9,
      sharpeRatio: 1.35,
      sortinoRatio: 1.78,
      calmarRatio: 0.92,
      maxDrawdown: -17.9,
      volatility: 11.8,
      var95: -1.9,
      cvar95: -3.4,
      winRate: 56.7,
      profitFactor: 1.58,
      avgWin: 2.6,
      avgLoss: -1.8,
      totalTrades: 418,
      avgTradeDuration: '3h 45m',
      informationRatio: 0.68,
      beta: 0.38,
      alpha: 2.8,
      trackingError: 8.2,
      skewness: 0.31,
      kurtosis: 3.1,
      kellyCriterion: 11.2,
    },
  },
  {
    id: 'mm_link',
    name: 'Market Making LINK',
    symbol: 'MM_LINK',
    type: 'mm',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-blue-500 to-cyan-600',
    icon: '🔗',
    description: 'Market making delta-neutre sur Chainlink. Fournit de la liquidité des deux côtés du carnet tout en couvrant l\'exposition directionnelle.',
    riskLevel: 'Conservateur',
    minInvestment: 50,
    fees: '0.05% par trade',
    equityCurve: [100, 101.2, 102.8, 104.5, 106.2, 108.1, 110.5, 112.9, 115.4, 117.8],
    metrics: {
      totalReturn: 17.8,
      annualizedReturn: 8.5,
      sharpeRatio: 2.15,
      sortinoRatio: 2.89,
      calmarRatio: 1.42,
      maxDrawdown: -12.5,
      volatility: 7.8,
      var95: -1.2,
      cvar95: -2.1,
      winRate: 72.4,
      profitFactor: 2.34,
      avgWin: 0.8,
      avgLoss: -0.5,
      totalTrades: 1847,
      avgTradeDuration: '18m',
      informationRatio: 1.12,
      beta: 0.12,
      alpha: 4.8,
      trackingError: 4.3,
      skewness: -0.15,
      kurtosis: 4.2,
      kellyCriterion: 18.7,
    },
  },
  {
    id: 'mm_avax',
    name: 'Market Making AVAX',
    symbol: 'MM_AVAX',
    type: 'mm',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-red-500 to-orange-600',
    icon: '🔺',
    description: 'Market making sur Avalanche avec spread dynamique. Ajuste le spread selon la volatilité pour maximiser les profits tout en minimisant le risque.',
    riskLevel: 'Modéré',
    minInvestment: 50,
    fees: '0.05% par trade',
    equityCurve: [100, 102.5, 105.8, 103.2, 107.5, 110.2, 112.8, 115.5, 118.2, 121.5],
    metrics: {
      totalReturn: 21.5,
      annualizedReturn: 10.3,
      sharpeRatio: 1.89,
      sortinoRatio: 2.42,
      calmarRatio: 1.18,
      maxDrawdown: -18.2,
      volatility: 10.5,
      var95: -1.6,
      cvar95: -2.9,
      winRate: 68.9,
      profitFactor: 2.12,
      avgWin: 1.1,
      avgLoss: -0.7,
      totalTrades: 1234,
      avgTradeDuration: '22m',
      informationRatio: 0.95,
      beta: 0.22,
      alpha: 5.2,
      trackingError: 6.1,
      skewness: 0.08,
      kurtosis: 3.6,
      kellyCriterion: 16.3,
    },
  },
  {
    id: 'mm_sol',
    name: 'Market Making SOL',
    symbol: 'MM_SOL',
    type: 'mm',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-pink-500 to-purple-600',
    icon: '☀️',
    description: 'Market making sur Solana avec gestion d\'inventaire conservative. Profite de la forte volatilité pour générer des spreads élevés.',
    riskLevel: 'Dynamique',
    minInvestment: 50,
    fees: '0.05% par trade',
    equityCurve: [100, 103.2, 106.5, 109.8, 107.5, 112.4, 115.8, 119.2, 122.5, 125.8],
    metrics: {
      totalReturn: 25.8,
      annualizedReturn: 12.3,
      sharpeRatio: 1.76,
      sortinoRatio: 2.28,
      calmarRatio: 1.08,
      maxDrawdown: -23.9,
      volatility: 13.8,
      var95: -2.4,
      cvar95: -4.2,
      winRate: 65.2,
      profitFactor: 2.02,
      avgWin: 1.4,
      avgLoss: -0.9,
      totalTrades: 982,
      avgTradeDuration: '15m',
      informationRatio: 0.87,
      beta: 0.35,
      alpha: 6.1,
      trackingError: 8.4,
      skewness: 0.42,
      kurtosis: 4.8,
      kellyCriterion: 14.8,
    },
  },
  {
    id: 'beta_eth',
    name: 'Beta ETH',
    symbol: 'BETA_ETH',
    type: 'beta',
    period: 'Jan 2024 - Avr 2026',
    color: 'from-cyan-500 to-blue-600',
    icon: '💎',
    description: 'Stratégie beta-neutre qui capture l\'alpha d\'ETH tout en neutralisant l\'exposition directionnelle via des perp. Profite du rendement supérieur d\'ETH.',
    riskLevel: 'Dynamique',
    minInvestment: 200,
    fees: '0.15% entrée, 0.1% sortie',
    equityCurve: [100, 104.5, 108.2, 112.5, 116.8, 121.2, 125.5, 129.8, 134.2, 138.5],
    metrics: {
      totalReturn: 38.5,
      annualizedReturn: 18.4,
      sharpeRatio: 1.92,
      sortinoRatio: 2.51,
      calmarRatio: 0.82,
      maxDrawdown: -47.0,
      volatility: 18.5,
      var95: -3.8,
      cvar95: -6.5,
      winRate: 54.8,
      profitFactor: 1.42,
      avgWin: 4.2,
      avgLoss: -3.1,
      totalTrades: 156,
      avgTradeDuration: '5j 12h',
      informationRatio: 0.62,
      beta: 0.08,
      alpha: 12.3,
      trackingError: 15.2,
      skewness: 0.68,
      kurtosis: 5.2,
      kellyCriterion: 8.9,
    },
  },
];

// === Helper Functions ===

function getRating(value: number, good: number, bad: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (value >= good) return 'excellent';
  if (value >= (good + bad) / 2) return 'good';
  if (value >= bad) return 'fair';
  return 'poor';
}

function getRatingColor(rating: string): string {
  switch (rating) {
    case 'excellent': return 'text-green-400';
    case 'good': return 'text-lime-400';
    case 'fair': return 'text-yellow-400';
    case 'poor': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Conservateur': return 'bg-green-500/20 text-green-400';
    case 'Modéré': return 'bg-yellow-500/20 text-yellow-400';
    case 'Dynamique': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

// === Components ===

interface MetricTooltipProps {
  title: string;
  value: string;
  subtitle?: string;
  rating?: 'excellent' | 'good' | 'fair' | 'poor';
  tooltip: string;
}

function MetricTooltip({ title, value, subtitle, rating, tooltip }: MetricTooltipProps) {
  return (
    <div className="group relative bg-black/30 rounded-lg p-2 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-500 truncate" title={tooltip}>{title}</p>
          <p className={`text-sm font-bold ${rating ? getRatingColor(rating) : 'text-white'} truncate`}>{value}</p>
          {subtitle && <p className="text-[10px] text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-white/20 rounded text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {tooltip}
      </div>
    </div>
  );
}

interface ComparisonTableProps {
  data: TokenBacktest[];
}

function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2 text-gray-400 font-medium whitespace-nowrap">Token</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Return total sur la période">Return</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Return annualisé">Annuel</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Ratio de Sharpe (risque ajusté)">Sharpe</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Ratio de Sortino (downside risk)">Sortino</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Calmar Ratio (Return/MaxDD)">Calmar</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Drawdown maximal">Max DD</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Volatilité annualisée">Vol</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Taux de réussite">Win Rate</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Profit Factor (gains/pertes)">PF</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Alpha (surperformance)">Alpha</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Beta (corrélation marché)">Beta</th>
              <th className="text-right p-2 text-gray-400 font-medium" title="Nombre total de trades">Trades</th>
              <th className="text-center p-2 text-gray-400 font-medium">Risque</th>
            </tr>
          </thead>
          <tbody>
            {data.map((backtest) => (
              <tr key={backtest.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{backtest.icon}</span>
                    <div>
                      <span className="text-white font-medium text-xs">{backtest.symbol}</span>
                      <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${
                        backtest.type === 'cross' ? 'bg-purple-500/20 text-purple-400' :
                        backtest.type === 'mm' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {backtest.type === 'cross' ? 'Cross' : backtest.type === 'mm' ? 'MM' : 'Beta'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-right p-2">
                  <span className={`font-bold text-xs ${backtest.metrics.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    +{backtest.metrics.totalReturn}%
                  </span>
                </td>
                <td className="text-right p-2 text-xs text-white">+{backtest.metrics.annualizedReturn}%</td>
                <td className="text-right p-2 text-xs text-white">{backtest.metrics.sharpeRatio.toFixed(2)}</td>
                <td className="text-right p-2 text-xs text-white">{backtest.metrics.sortinoRatio.toFixed(2)}</td>
                <td className="text-right p-2 text-xs text-white">{backtest.metrics.calmarRatio.toFixed(2)}</td>
                <td className="text-right p-2 text-xs text-red-400">{backtest.metrics.maxDrawdown}%</td>
                <td className="text-right p-2 text-xs text-gray-400">{backtest.metrics.volatility}%</td>
                <td className="text-right p-2 text-xs text-white">{backtest.metrics.winRate}%</td>
                <td className="text-right p-2 text-xs text-white">{backtest.metrics.profitFactor.toFixed(2)}</td>
                <td className="text-right p-2 text-xs text-green-400">+{backtest.metrics.alpha}%</td>
                <td className="text-right p-2 text-xs text-gray-400">{backtest.metrics.beta.toFixed(2)}</td>
                <td className="text-right p-2 text-xs text-gray-500">{backtest.metrics.totalTrades}</td>
                <td className="text-center p-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${getRiskColor(backtest.riskLevel)}`}>
                    {backtest.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TokenBacktestCardProps {
  backtest: TokenBacktest;
  onSelect: () => void;
}

function TokenBacktestCard({ backtest, onSelect }: TokenBacktestCardProps) {
  const m = backtest.metrics;

  return (
    <button
      onClick={onSelect}
      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 text-left transition-all w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{backtest.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">{backtest.name}</p>
          <p className="text-xs text-gray-400">{backtest.symbol}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${m.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
            +{m.totalReturn}%
          </p>
        </div>
      </div>

      {/* Risk Badge */}
      <div className="mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getRiskColor(backtest.riskLevel)}`}>
          {backtest.riskLevel}
        </span>
        <span className="text-[10px] text-gray-500 ml-2">Min: ${backtest.minInvestment}</span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <MetricTooltip
          title="Sharpe"
          value={m.sharpeRatio.toFixed(2)}
          rating={getRating(m.sharpeRatio, 2, 1)}
          tooltip="Ratio de Sharpe: rendement ajusté du risque. >2 = excellent."
        />
        <MetricTooltip
          title="Max DD"
          value={`${m.maxDrawdown}%`}
          rating={getRating(-m.maxDrawdown, -10, -30)}
          tooltip="Drawdown maximal: baisse la plus forte depuis le plus haut."
        />
        <MetricTooltip
          title="Win Rate"
          value={`${m.winRate}%`}
          rating={getRating(m.winRate, 65, 50)}
          tooltip="Taux de réussite: % de trades gagnants."
        />
        <MetricTooltip
          title="Volatilité"
          value={`${m.volatility}%`}
          rating={getRating(-m.volatility, -10, -20)}
          tooltip="Volatilité annualisée des rendements."
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="bg-black/30 rounded p-1.5 text-center">
          <p className="text-[9px] text-gray-600">Sortino</p>
          <p className="text-[10px] font-bold text-white">{m.sortinoRatio.toFixed(2)}</p>
        </div>
        <div className="bg-black/30 rounded p-1.5 text-center">
          <p className="text-[9px] text-gray-600">Profit Factor</p>
          <p className="text-[10px] font-bold text-white">{m.profitFactor.toFixed(2)}</p>
        </div>
        <div className="bg-black/30 rounded p-1.5 text-center">
          <p className="text-[9px] text-gray-600">Trades</p>
          <p className="text-[10px] font-bold text-gray-400">{m.totalTrades}</p>
        </div>
      </div>

      {/* Description truncated */}
      <p className="text-[10px] text-gray-500 line-clamp-2">{backtest.description}</p>
    </button>
  );
}

interface DetailViewProps {
  backtest: TokenBacktest;
  onBack: () => void;
}

function DetailView({ backtest, onBack }: DetailViewProps) {
  const m = backtest.metrics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 text-sm"
      >
        ← Retour aux backtests
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{backtest.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{backtest.name}</h1>
              <p className="text-gray-400 text-sm">{backtest.symbol} • {backtest.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(backtest.riskLevel)}`}>
              {backtest.riskLevel}
            </span>
            <div className="text-right">
              <p className={`text-3xl font-bold ${m.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                +{m.totalReturn}%
              </p>
              <p className="text-xs text-gray-500">Return Total</p>
            </div>
          </div>
        </div>

        {/* Description & Fees */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 mb-3">{backtest.description}</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Investissement min:</span>
              <span className="text-white font-medium">${backtest.minInvestment}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Frais:</span>
              <span className="text-white font-medium">{backtest.fees}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Durée moyenne:</span>
              <span className="text-white font-medium">{m.avgTradeDuration}</span>
            </div>
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Return Annualisé</p>
            <p className="text-xl font-bold text-green-400">+{m.annualizedReturn}%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold text-blue-400">{m.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-red-400">{m.maxDrawdown}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Win Rate</p>
            <p className="text-xl font-bold text-purple-400">{m.winRate}%</p>
          </div>
        </div>

        {/* All Metrics Grid */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">📊 Métriques Détaillées</h2>

          {/* Returns */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Rendement</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <MetricTooltip title="Total Return" value={`+${m.totalReturn}%`} subtitle={`sur ${backtest.period}`} tooltip="Rentabilité totale de la stratégie" rating={getRating(m.totalReturn, 20, 5)} />
              <MetricTooltip title="Return Annualisé" value={`+${m.annualizedReturn}%`} tooltip="Rentabilité annualisée (sur 1 an)" rating={getRating(m.annualizedReturn, 15, 3)} />
              <MetricTooltip title="Alpha" value={`+${m.alpha}%`} tooltip="Surperformance vs le marché (CAPM)" rating={getRating(m.alpha, 5, 0)} />
              <MetricTooltip title="Sharpe Ratio" value={m.sharpeRatio.toFixed(2)} tooltip="(Return - RiskFree) / Volatilité. >2 = excellent" rating={getRating(m.sharpeRatio, 2, 1)} />
              <MetricTooltip title="Sortino Ratio" value={m.sortinoRatio.toFixed(2)} tooltip="Sharpe avec seulement la volatilité négative" rating={getRating(m.sortinoRatio, 2, 1)} />
            </div>
          </div>

          {/* Risk */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Risque</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <MetricTooltip title="Max Drawdown" value={`${m.maxDrawdown}%`} tooltip="Baisse maximale historique" rating={getRating(-m.maxDrawdown, -10, -30)} />
              <MetricTooltip title="Volatilité" value={`${m.volatility}%`} tooltip="Écart-type annualisé des rendements" rating={getRating(-m.volatility, -10, -20)} />
              <MetricTooltip title="VaR 95%" value={`${m.var95}%`} tooltip="Value at Risk: perte max dans 5% pires cas" rating={getRating(-m.var95, -1, -3)} />
              <MetricTooltip title="CVaR 95%" value={`${m.cvar95}%`} tooltip="Conditional VaR: perte moyenne des 5% pires cas" rating={getRating(-m.cvar95, -2, -5)} />
              <MetricTooltip title="Beta" value={m.beta.toFixed(2)} tooltip="Corrélation au marché (0 = non corrélé)" rating={getRating(-Math.abs(m.beta), -0.2, -0.5)} />
            </div>
          </div>

          {/* Trading */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-400 mb-2">Trading</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <MetricTooltip title="Win Rate" value={`${m.winRate}%`} tooltip="% de trades gagnants" rating={getRating(m.winRate, 65, 50)} />
              <MetricTooltip title="Profit Factor" value={m.profitFactor.toFixed(2)} tooltip="Gains totaux / Pertes totales" rating={getRating(m.profitFactor, 2, 1)} />
              <MetricTooltip title="Avg Win" value={`+${m.avgWin}%`} tooltip="Gain moyen par trade" rating={getRating(m.avgWin, 2, 0.5)} />
              <MetricTooltip title="Avg Loss" value={`${m.avgLoss}%`} tooltip="Perte moyenne par trade" rating={getRating(-m.avgLoss, -0.5, -2)} />
              <MetricTooltip title="Total Trades" value={m.totalTrades.toString()} tooltip="Nombre total de trades exécutés" />
            </div>
          </div>

          {/* Risk-Adjusted */}
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Risque Ajusté</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <MetricTooltip title="Calmar Ratio" value={m.calmarRatio.toFixed(2)} tooltip="Return Annualisé / Max Drawdown" rating={getRating(m.calmarRatio, 1, 0.5)} />
              <MetricTooltip title="Information Ratio" value={m.informationRatio.toFixed(2)} tooltip="Alpha / Tracking Error" rating={getRating(m.informationRatio, 1, 0.5)} />
              <MetricTooltip title="Tracking Error" value={`${m.trackingError}%`} tooltip="Écart de suivi vs le benchmark" />
              <MetricTooltip title="Kelly Criterion" value={`${m.kellyCriterion}%`} tooltip="% optimal à risquer par trade" rating={getRating(m.kellyCriterion, 15, 5)} />
              <MetricTooltip title="Skewness" value={m.skewness.toFixed(2)} tooltip="Asymétrie des rendements (>0 = plus de gains extrêmes)" />
            </div>
          </div>
        </div>

        {/* Risk Analysis Bar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">⚠️ Analyse de Risque</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Niveau de Risque</span>
                <span className={`font-medium ${backtest.riskLevel === 'Conservateur' ? 'text-green-400' : backtest.riskLevel === 'Modéré' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {backtest.riskLevel}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${backtest.riskLevel === 'Conservateur' ? 'bg-green-500' : backtest.riskLevel === 'Modéré' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: backtest.riskLevel === 'Conservateur' ? '33%' : backtest.riskLevel === 'Modéré' ? '66%' : '100%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Volatilité</span>
                <span className="text-white">{m.volatility}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (m.volatility / 25) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Max Drawdown Historique</span>
                <span className="text-white">{m.maxDrawdown}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, (Math.abs(m.maxDrawdown) / 50) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Main Component ===

export function TokenBacktest() {
  const [selectedToken, setSelectedToken] = useState<TokenBacktest | null>(null);
  const [filter, setFilter] = useState<'all' | 'cross' | 'mm' | 'beta'>('all');

  if (selectedToken) {
    return <DetailView backtest={selectedToken} onBack={() => setSelectedToken(null)} />;
  }

  const filteredTokens = filter === 'all'
    ? backtestsData
    : backtestsData.filter(t => t.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📈 Backtests des Tokens Hedged</h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            Performances historiques simulées basées sur les paramètres de chaque stratégie.
            <span className="text-yellow-400"> ⚠️ Les performances passées ne préjugent pas des performances futures.</span>
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Return Moyen</p>
            <p className="text-2xl font-bold text-green-400">
              +{(backtestsData.reduce((s, t) => s + t.metrics.totalReturn, 0) / backtestsData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Sharpe Moyen</p>
            <p className="text-2xl font-bold text-blue-400">
              {(backtestsData.reduce((s, t) => s + t.metrics.sharpeRatio, 0) / backtestsData.length).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Max DD Moyen</p>
            <p className="text-2xl font-bold text-red-400">
              {(backtestsData.reduce((s, t) => s + t.metrics.maxDrawdown, 0) / backtestsData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Win Rate Moyen</p>
            <p className="text-2xl font-bold text-purple-400">
              {(backtestsData.reduce((s, t) => s + t.metrics.winRate, 0) / backtestsData.length).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all' as const, label: 'Tous', count: backtestsData.length },
            { key: 'cross' as const, label: 'Cross-Exchange', count: backtestsData.filter(t => t.type === 'cross').length },
            { key: 'mm' as const, label: 'Market Making', count: backtestsData.filter(t => t.type === 'mm').length },
            { key: 'beta' as const, label: 'Beta-Neutre', count: backtestsData.filter(t => t.type === 'beta').length },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.key
                  ? 'bg-white text-gray-900'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {f.label} <span className="text-opacity-50">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <ComparisonTable data={filteredTokens} />

        {/* Token Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredTokens.map((backtest) => (
            <TokenBacktestCard
              key={backtest.id}
              backtest={backtest}
              onSelect={() => setSelectedToken(backtest)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">📖 Légende des Métriques</h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-400">
            <div>
              <p className="text-white font-medium mb-1">Rendement</p>
              <ul className="space-y-1">
                <li><span className="text-green-400">Sharpe</span>: Ratio rendement/risque (&gt;2 excellent)</li>
                <li><span className="text-blue-400">Sortino</span>: Sharpe avec volatilité négative seulement</li>
                <li><span className="text-purple-400">Alpha</span>: Surperformance vs marché</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Risque</p>
              <ul className="space-y-1">
                <li><span className="text-red-400">Max DD</span>: Pire baisse historique</li>
                <li><span className="text-gray-300">Vol</span>: Volatilité annualisée</li>
                <li><span className="text-orange-400">VaR 95%</span>: Perte max dans 5% pires cas</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Trading</p>
              <ul className="space-y-1">
                <li><span className="text-lime-400">Win Rate</span>: % de trades gagnants</li>
                <li><span className="text-cyan-400">Profit Factor</span>: Gains/Pertes (&gt;2 excellent)</li>
                <li><span className="text-pink-400">Kelly</span>: % optimal à risquer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-sm text-yellow-400">
            ⚠️ <strong>Avertissement</strong>: Ces backtests utilisent des données historiques et des paramètres simulés.
            Les performances réelles peuvent différer considérablement. Ces tokens sont déployés sur Sepolia Testnet
            à des fins de démonstration uniquement. <strong>N'investissez jamais que ce que vous pouvez vous permettre de perdre.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
