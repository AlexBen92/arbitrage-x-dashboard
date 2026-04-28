// lib/contracts/addresses.ts
// Contract addresses for ArbitrageX on Sepolia Testnet ONLY

export const SEPOLIA_CHAIN_ID = 11155111

// Owner address (for admin panel)
export const OWNER_ADDRESS = "0x5038d5Ad678b12F4B1824B8299F7f69d397cc039" as const

// Infrastructure contracts on Sepolia
export const CONTRACTS = {
  // USDC testnet official
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const,

  // 6 tokens deployed on Sepolia
  CROSS_SDL: "0x5556BD8609d33429DdCC184D1E1E3395c7Ea87e2" as const,
  CROSS_MATIC: "0xD8FAc89772E1708289f5C30213b7c8D8B50A586a" as const,
  MM_LINK: "0x5E553a273660d953E554A7d35384e9D870Ad8183" as const,
  MM_AVAX: "0xF4D034D20A6b3a90a3E8891030A1198A193AFbDb" as const,
  MM_SOL: "0x31963530Ee8e03807dFf9933408CdA8Ec2E06394" as const,
  BETA_ETH: "0x60a62b105c6a94B8DE53032F8CBe0dd4d7296A8c" as const,
} as const

// Strategy metadata
export const STRATEGIES = [
  {
    id: "CROSS_SDL",
    name: "Cross-Exchange SDL",
    symbol: "CROSS_SDL",
    address: CONTRACTS.CROSS_SDL,
    type: "cross-exchange" as const,
    asset: "SDL",
    sharpe: 18.72,
    maxDD: 0.0,
    badge: "LIVE" as const,
    description: "Arbitrage SDL price spread Binance ↔ Bybit (basis > 0.1%)",
    params: { basisThresholdBps: 10, exitBps: 10, positionSizePct: 10 },
    color: "from-purple-500 to-indigo-600",
    icon: "🔄",
  },
  {
    id: "CROSS_MATIC",
    name: "Cross-Exchange MATIC",
    symbol: "CROSS_MATIC",
    address: CONTRACTS.CROSS_MATIC,
    type: "cross-exchange" as const,
    asset: "MATIC",
    sharpe: 14.99,
    maxDD: 0.0,
    badge: "LIVE" as const,
    description: "Lower threshold (0.05%) on MATIC for a higher hit rate",
    params: { basisThresholdBps: 5, exitBps: 10, positionSizePct: 20 },
    color: "from-indigo-500 to-purple-600",
    icon: "🔀",
  },
  {
    id: "MM_LINK",
    name: "Delta-Neutral MM LINK",
    symbol: "MM_LINK",
    address: CONTRACTS.MM_LINK,
    type: "delta-neutral-mm" as const,
    asset: "LINK",
    sharpe: 14.41,
    maxDD: 3.8,
    badge: "LIVE" as const,
    description: "0.2% bid/ask spread with inventory skew hedge on LINK perp",
    params: { spreadBps: 20, skewFactor: 1.5, maxInventory: 10 },
    color: "from-blue-500 to-cyan-600",
    icon: "🔗",
  },
  {
    id: "MM_AVAX",
    name: "Delta-Neutral MM AVAX",
    symbol: "MM_AVAX",
    address: CONTRACTS.MM_AVAX,
    type: "delta-neutral-mm" as const,
    asset: "AVAX",
    sharpe: 13.69,
    maxDD: 2.6,
    badge: "LIVE" as const,
    description: "skewFactor 2.0 for faster inventory rebalancing",
    params: { spreadBps: 20, skewFactor: 2.0, maxInventory: 5 },
    color: "from-red-500 to-orange-600",
    icon: "🔺",
  },
  {
    id: "MM_SOL",
    name: "Delta-Neutral MM SOL",
    symbol: "MM_SOL",
    address: CONTRACTS.MM_SOL,
    type: "delta-neutral-mm" as const,
    asset: "SOL",
    sharpe: 13.03,
    maxDD: 3.0,
    badge: "BETA" as const,
    description: "Lower skewFactor (0.5) — tolerates wider SOL inventory swings",
    params: { spreadBps: 20, skewFactor: 0.5, maxInventory: 10 },
    color: "from-gradient-500 to-purple-600",
    icon: "☀️",
  },
  {
    id: "BETA_ETH",
    name: "Beta-Neutral ETH",
    symbol: "BETA_ETH",
    address: CONTRACTS.BETA_ETH,
    type: "beta-neutral" as const,
    asset: "ETH",
    sharpe: 11.95,
    maxDD: 6.7,
    badge: "BETA" as const,
    description: "Alpha = R_ETH − 1.4 × R_BTC, 80% hedge ratio",
    params: { hedgeRatio: 0.8, positionSizePct: 70, betaTarget: 0.0 },
    color: "from-cyan-500 to-blue-600",
    icon: "💎",
  },
] as const

// Helper to get strategy by address
export const getStrategyByAddress = (address: string) =>
  STRATEGIES.find(s => s.address.toLowerCase() === address.toLowerCase())

// Helper to get strategy by id
export const getStrategyById = (id: string) =>
  STRATEGIES.find(s => s.id === id)

// Type exports
export type StrategyId = typeof STRATEGIES[number]["id"]
export type StrategyType = typeof STRATEGIES[number]["type"]
export type BadgeType = typeof STRATEGIES[number]["badge"]
