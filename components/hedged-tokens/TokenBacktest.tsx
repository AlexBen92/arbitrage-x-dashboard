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
  var95: number; // Value at Risk 95%
  cvar95: number; // Conditional VaR

  // Trading metrics
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;

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
}

// === Mock Backtest Data ===

const backtestsData: TokenBacktest[] = [
  {
    id: 'cross_sdl',
    name: 'Cross SDL',
    symbol: 'CROSS_SDL',
    type: 'cross',
    period: 'Jan 2024 - Apr 2026',
    color: 'from-purple-500 to-indigo-600',
    icon: '🔄',
    description: 'Stratégie cross-asset qui exploite les écarts de prix entre exchanges pour SDL (Scaleton), un token de liquidité décentralisée.',
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
    period: 'Jan 2024 - Apr 2026',
    color: 'from-indigo-500 to-purple-600',
    icon: '🔀',
    description: 'Arbitrage inter-exchanges sur MATIC (Polygon), exploitant les inefficacités de prix entre CEX et DEX.',
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
    period: 'Jan 2024 - Apr 2026',
    color: 'from-blue-500 to-cyan-600',
    icon: '🔗',
    description: 'Market making delta-neutre sur Chainlink. Fournit de la liquidité des deux côtés du carnet d\'ordres tout en couvrant l\'exposition directionnelle.',
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
    period: 'Jan 2024 - Apr 2026',
    color: 'from-red-500 to-orange-600',
    icon: '🔺',
    description: 'Market making sur Avalanche avec spread dynamique. Ajuste le spread en fonction de la volatilité pour maximiser les profits tout en minimisant le risque d\'inventaire.',
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
    period: 'Jan 2024 - Apr 2026',
    color: 'from-pink-500 to-purple-600',
    icon: '☀️',
    description: 'Market making sur Solana avec gestion d\'inventaire conservative. Profite de la forte volatilité de SOL pour générer des spreads plus élevés.',
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
    period: 'Jan 2024 - Apr 2026',
    color: 'from-cyan-500 to-blue-600',
    icon: '💎',
    description: 'Stratégie beta-neutre qui capture l\'alpha d\'ETH tout en neutralisant l\'exposition directionnelle via des futures ou des perp. Profite du rendement supérieur d\'ETH vs le marché.',
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

// === Components ===

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  tooltip?: string;
}

function MetricCard({ title, value, subtitle, rating, tooltip }: MetricCardProps) {
  return (
    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{title}</span>
        {tooltip && <span className="text-gray-600 text-xs" title={tooltip}>ℹ️</span>}
      </div>
      <div className={`text-lg font-bold ${getRatingColor(rating)}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
}

interface ExplanationSectionProps {
  backtest: TokenBacktest;
}

function ExplanationSection({ backtest }: ExplanationSectionProps) {
  const explanations: Record<string, { title: string; content: string[] }> = {
    cross: {
      title: '🔄 Comprendre la Stratégie Cross-Exchange',
      content: [
        '**Le principe**: Acheter un token sur un exchange où le prix est bas, le vendre simultanément sur un exchange où le prix est haut.',
        '**Exemple concret**: SDL coute $1.00 sur Binance mais $1.02 sur Uniswap. Tu achètes 1000 SDL sur Binance ($1000) et vends sur Uniswap ($1020) = **$20 de profit garanti**.',
        '**Pourquoi ça marche**: Les prix ne sont pas synchronisés parfaits entre exchanges. Des inefficacités temporaires apparaissent constamment.',
        '**Les risques**: Slippage, frais de transaction, délai de transfert, liquidité insuffisante.',
        '**Notre avantage**: Algorithme optimisé qui détecte les opportunités en millisecondes et exécute les deux côtés quasi-simultanément.',
      ],
    },
    mm: {
      title: '📊 Comprendre le Market Making',
      content: [
        '**Le principe**: Placer des ordres d\'achat et de vente simultanés pour gagner le spread (la différence entre les deux prix).',
        '**Exemple concret**: Tu places un ordre d\'achat à $99.50 et un ordre de vente à $100.50. Spread de $1. Si les deux sont exécutés, tu gagnes $1 moins les frais.',
        '**Delta-neutre**: Si le marché monte, tes positions short perdent mais tes longs gagnent (et inversement). L\'exposition nette est proche de zéro.',
        '**Pourquoi ça marche**: Les market makers fournissent une liquidité essentielle et sont rémunérés via le spread.',
        '**Notre avantage**: Algorithme qui ajuste le spread dynamiquement selon la volatilité et gère l\'inventaire pour rester delta-neutre.',
      ],
    },
    beta: {
      title: '💎 Comprendre la Stratégie Beta-Neutre',
      content: [
        '**Le principe**: Capturer le "alpha" (performance supérieure) d\'un actif tout en neutralisant son "beta" (corrélation au marché).',
        '**Exemple concret**: Tu penses qu\'ETH va surperformer le marché. Tu achètes ETH pour $1000 et vends des futures ETH pour $1000. Si ETH monte de 10%, ton long gagne $100 mais ton short perd une valeur liée au marché.',
        '**Pourquoi ça marche**: Certains actifs ont historiquement surperformé (alpha positif) mais sont corrélés au marché. En neutralisant le beta, on isole l\'alpha.',
        '**Les risques**: Corrélations instables, coûts de financement des shorts, tracking error.',
        '**Notre avantage**: Modèle statistique avancé qui calcule le beta en temps réel et ajuste le ratio de couverture dynamiquement.',
      ],
    },
  };

  const typeExplanation = explanations[backtest.type];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">{typeExplanation.title}</h3>
      <div className="space-y-3">
        {typeExplanation.content.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-blue-400 font-bold">•</span>
            <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface MetricsGridProps {
  metrics: BacktestMetrics;
}

function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Return Metrics */}
      <MetricCard
        title="Return Total"
        value={`+${metrics.totalReturn}%`}
        subtitle="Sur la période"
        rating={getRating(metrics.totalReturn, 20, 5)}
        tooltip="Rentabilité totale de la stratégie sur la période de backtest"
      />
      <MetricCard
        title="Return Annualisé"
        value={`+${metrics.annualizedReturn}%`}
        subtitle="Par an"
        rating={getRating(metrics.annualizedReturn, 15, 3)}
        tooltip="Rentabilité annualisée (convertie sur une base annuelle)"
      />
      <MetricCard
        title="Sharpe Ratio"
        value={metrics.sharpeRatio.toFixed(2)}
        subtitle="Risque ajusté"
        rating={getRating(metrics.sharpeRatio, 2, 1)}
        tooltip="Ratio de Sharpe: (Return - Risk Free) / Volatilité. >2 = excellent"
      />
      <MetricCard
        title="Max Drawdown"
        value={`${metrics.maxDrawdown}%`}
        subtitle="Perte max"
        rating={getRating(-metrics.maxDrawdown, -10, -30)}
        tooltip="Baisse maximale historique depuis le plus haut. Plus c'est bas, mieux c'est."
      />

      {/* Risk Metrics */}
      <MetricCard
        title="Volatilité"
        value={`${metrics.volatility}%`}
        subtitle="Écart-type"
        rating={getRating(-metrics.volatility, -10, -20)}
        tooltip="Volatilité annualisée des rendements. Plus bas = plus stable."
      />
      <MetricCard
        title="Win Rate"
        value={`${metrics.winRate}%`}
        subtitle="Trades gagnants"
        rating={getRating(metrics.winRate, 65, 50)}
        tooltip="Pourcentage de trades profitables"
      />
      <MetricCard
        title="Profit Factor"
        value={metrics.profitFactor.toFixed(2)}
        subtitle="Gains / Pertes"
        rating={getRating(metrics.profitFactor, 2, 1)}
        tooltip="Ratio profits totaux / pertes totales. >2 = excellent."
      />
      <MetricCard
        title="Sortino Ratio"
        value={metrics.sortinoRatio.toFixed(2)}
        subtitle="Risque downside"
        rating={getRating(metrics.sortinoRatio, 2, 1)}
        tooltip="Similar au Sharpe mais ne pénalise que la volatilité négative."
      />

      {/* Advanced Metrics */}
      <MetricCard
        title="Alpha"
        value={`+${metrics.alpha}%`}
        subtitle="Surperformance"
        rating={getRating(metrics.alpha, 5, 0)}
        tooltip="Performance ajustée au risque (CAPM). Alpha positif = bat le marché."
      />
      <MetricCard
        title="Beta"
        value={metrics.beta.toFixed(2)}
        subtitle="Sensibilité marché"
        rating={getRating(-Math.abs(metrics.beta - 0), -0.2, -0.5)}
        tooltip="Corrélation au marché. 0 = non corrélé, 1 = suit le marché."
      />
      <MetricCard
        title="VaR 95%"
        value={`${metrics.var95}%`}
        subtitle="Pire cas 5%"
        rating={getRating(-metrics.var95, -1, -3)}
        tooltip="Value at Risk: perte maximale attendue dans 5% des pires cas."
      />
      <MetricCard
        title="Calmar Ratio"
        value={metrics.calmarRatio.toFixed(2)}
        subtitle="Return / DD"
        rating={getRating(metrics.calmarRatio, 1, 0.5)}
        tooltip="Ratio Return annualisé / Max Drawdown. Plus élevé = meilleur."
      />

      {/* Trading Stats */}
      <MetricCard
        title="Total Trades"
        value={metrics.totalTrades.toString()}
        subtitle="Sur la période"
        rating="fair"
      />
      <MetricCard
        title="Avg Win"
        value={`+${metrics.avgWin}%`}
        subtitle="Gain moyen"
        rating={getRating(metrics.avgWin, 2, 0.5)}
      />
      <MetricCard
        title="Avg Loss"
        value={`${metrics.avgLoss}%`}
        subtitle="Perte moyenne"
        rating={getRating(-metrics.avgLoss, -0.5, -2)}
      />
      <MetricCard
        title="Kelly %"
        value={`${metrics.kellyCriterion}%`}
        subtitle="Taille optimale"
        rating={getRating(metrics.kellyCriterion, 15, 5)}
        tooltip="Kelly Criterion: % du capital à risquer pour maximiser la croissance long-terme."
      />
    </div>
  );
}

interface EquityChartProps {
  data: number[];
  color: string;
}

function EquityChart({ data, color }: EquityChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-black/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Courbe d'Equity</span>
        <span className="text-xs text-gray-500">{data.length} périodes</span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#gradient-${color})`}
          stroke="#3b82f6"
          strokeWidth="2"
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{data[0].toFixed(0)}</span>
        <span>Période</span>
        <span className="text-green-400">+{((data[data.length - 1] / data[0] - 1) * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

interface TokenBacktestCardProps {
  backtest: TokenBacktest;
  onSelect: () => void;
}

function TokenBacktestCard({ backtest, onSelect }: TokenBacktestCardProps) {
  return (
    <button
      onClick={onSelect}
      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 text-left transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{backtest.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-white">{backtest.name}</p>
          <p className="text-sm text-gray-400">{backtest.symbol}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${backtest.metrics.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
            +{backtest.metrics.totalReturn}%
          </p>
          <p className="text-xs text-gray-500">{backtest.period}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-black/30 rounded p-2 text-center">
          <p className="text-xs text-gray-500">Sharpe</p>
          <p className="text-sm font-bold text-white">{backtest.metrics.sharpeRatio.toFixed(2)}</p>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <p className="text-xs text-gray-500">Max DD</p>
          <p className="text-sm font-bold text-red-400">{backtest.metrics.maxDrawdown}%</p>
        </div>
        <div className="bg-black/30 rounded p-2 text-center">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="text-sm font-bold text-white">{backtest.metrics.winRate}%</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2">{backtest.description}</p>
    </button>
  );
}

// === Main Component ===

export function TokenBacktest() {
  const [selectedToken, setSelectedToken] = useState<TokenBacktest | null>(null);

  if (selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
        <button
          onClick={() => setSelectedToken(null)}
          className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← Retour aux tokens
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{selectedToken.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{selectedToken.name}</h1>
              <p className="text-gray-400">{selectedToken.symbol} • {selectedToken.period}</p>
            </div>
            <div className="ml-auto text-right">
              <p className={`text-4xl font-bold ${selectedToken.metrics.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                +{selectedToken.metrics.totalReturn}%
              </p>
              <p className="text-sm text-gray-400">Return Total</p>
            </div>
          </div>

          {/* Explanation */}
          <ExplanationSection backtest={selectedToken} />

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Annualisé</p>
              <p className="text-2xl font-bold text-green-400">+{selectedToken.metrics.annualizedReturn}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-blue-400">{selectedToken.metrics.sharpeRatio.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-400">{selectedToken.metrics.maxDrawdown}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-purple-400">{selectedToken.metrics.winRate}%</p>
            </div>
          </div>

          {/* Equity Chart */}
          <div className="mb-6">
            <EquityChart data={selectedToken.equityCurve} color={selectedToken.color} />
          </div>

          {/* All Metrics */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 Métriques Détaillées</h2>
            <MetricsGrid metrics={selectedToken.metrics} />
          </div>

          {/* Risk Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">⚠️ Analyse de Risque</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Profil de Risque</p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className={`bg-gradient-to-r ${selectedToken.color} h-3 rounded-full`}
                    style={{ width: `${Math.min(100, (selectedToken.metrics.volatility / 25) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Volatilité: {selectedToken.metrics.volatility}% ({selectedToken.metrics.volatility < 10 ? 'Faible' : selectedToken.metrics.volatility < 15 ? 'Modérée' : 'Élevée'})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Perte Maximale Historique</p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${Math.min(100, (Math.abs(selectedToken.metrics.maxDrawdown) / 50) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Max DD: {selectedToken.metrics.maxDrawdown}% ({Math.abs(selectedToken.metrics.maxDrawdown) < 15 ? 'Acceptable' : Math.abs(selectedToken.metrics.maxDrawdown) < 25 ? 'Élevé' : 'Très élevé'})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📈 Backtests des Tokens Hedged</h1>
          <p className="text-gray-400">
            Performances historiques simulées basées sur les paramètres de chaque stratégie.
            <span className="text-yellow-400"> ⚠️ Les performances passées ne préjugent pas des performances futures.</span>
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'Tous', count: backtestsData.length },
            { key: 'cross', label: 'Cross-Exchange', count: backtestsData.filter(t => t.type === 'cross').length },
            { key: 'mm', label: 'Market Making', count: backtestsData.filter(t => t.type === 'mm').length },
            { key: 'beta', label: 'Beta-Neutre', count: backtestsData.filter(t => t.type === 'beta').length },
          ].map((filter) => (
            <button
              key={filter.key}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium whitespace-nowrap transition-all"
            >
              {filter.label} <span className="text-gray-500">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">Token</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Return</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Sharpe</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Max DD</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Win Rate</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Volatilité</th>
                </tr>
              </thead>
              <tbody>
                {backtestsData.map((backtest) => (
                  <tr key={backtest.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{backtest.icon}</span>
                        <span className="text-white font-medium">{backtest.symbol}</span>
                      </div>
                    </td>
                    <td className="text-right p-3">
                      <span className={`font-bold ${backtest.metrics.totalReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        +{backtest.metrics.totalReturn}%
                      </span>
                    </td>
                    <td className="text-right p-3 text-white">{backtest.metrics.sharpeRatio.toFixed(2)}</td>
                    <td className="text-right p-3 text-red-400">{backtest.metrics.maxDrawdown}%</td>
                    <td className="text-right p-3 text-white">{backtest.metrics.winRate}%</td>
                    <td className="text-right p-3 text-gray-400">{backtest.metrics.volatility}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Token Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backtestsData.map((backtest) => (
            <TokenBacktestCard
              key={backtest.id}
              backtest={backtest}
              onSelect={() => setSelectedToken(backtest)}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-sm text-yellow-400">
            ⚠️ <strong>Avertissement</strong>: Ces backtests utilisent des données historiques et des paramètres simulés.
            Les performances réelles peuvent différer considérablement. Ces tokens sont déployés sur Sepolia Testnet
            à des fins de démonstration uniquement. Ne investissez jamais que ce que vous pouvez vous permettre de perdre.
          </p>
        </div>
      </div>
    </div>
  );
}
