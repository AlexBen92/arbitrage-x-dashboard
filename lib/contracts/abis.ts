// lib/contracts/abis.ts
// Contract ABIs for ArbitrageX Hedged Tokens

// Base ABI — common to all HedgedToken contracts
export const HEDGED_TOKEN_ABI = [
  // ERC-20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",

  // NAV & Interactions
  "function navPerToken() view returns (uint256)",
  "function mint(uint256 usdcAmount) returns (uint256 tokensOut)",
  "function redeem(uint256 tokenAmount) returns (uint256 usdcOut)",
  "function getTokensForUSDC(uint256 usdcAmount) view returns (uint256)",
  "function getUSDCForTokens(uint256 tokenAmount) view returns (uint256)",

  // Strategy Info
  "function strategyType() view returns (string)",
  "function lastNAVUpdate() view returns (uint256)",
  "function paused() view returns (bool)",

  // Owner only
  "function updateNAV() external",
  "function pause() external",
  "function unpause() external",

  // Events
  "event Mint(address indexed user, uint256 usdcIn, uint256 tokensOut)",
  "event Redeem(address indexed user, uint256 tokensIn, uint256 usdcOut)",
  "event NAVUpdated(uint256 newNAV, uint256 timestamp)",
] as const

// Cross-Exchange specific functions
export const CROSS_EXCHANGE_ABI = [
  ...HEDGED_TOKEN_ABI,
  "function basisThresholdBps() view returns (uint256)",
  "function exitBps() view returns (uint256)",
  "function positionSizePct() view returns (uint256)",
] as const

// Delta-Neutral Market Making specific functions
export const DELTA_NEUTRAL_MM_ABI = [
  ...HEDGED_TOKEN_ABI,
  "function spreadBps() view returns (uint256)",
  "function skewFactor() view returns (uint256)",
  "function maxInventory() view returns (uint256)",
  "function currentInventory() view returns (int256)",
] as const

// Beta-Neutral specific functions
export const BETA_NEUTRAL_ABI = [
  ...HEDGED_TOKEN_ABI,
  "function hedgeRatio() view returns (uint256)",
  "function betaTarget() view returns (uint256)",
  "function positionSizePct() view returns (uint256)",
  "function currentBeta() view returns (uint256)",
  "function currentAlpha() view returns (int256)",
] as const

// USDC ABI (ERC-20 subset we use)
export const USDC_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
] as const

// Event ABIs for log fetching
export const MINT_EVENT = {
  type: "event",
  name: "Mint",
  inputs: [
    { type: "address", name: "user", indexed: true },
    { type: "uint256", name: "usdcIn", indexed: false },
    { type: "uint256", name: "tokensOut", indexed: false },
  ],
} as const

export const REDEEM_EVENT = {
  type: "event",
  name: "Redeem",
  inputs: [
    { type: "address", name: "user", indexed: true },
    { type: "uint256", name: "tokensIn", indexed: false },
    { type: "uint256", name: "usdcOut", indexed: false },
  ],
} as const

export const NAV_UPDATED_EVENT = {
  type: "event",
  name: "NAVUpdated",
  inputs: [
    { type: "uint256", name: "newNAV", indexed: false },
    { type: "uint256", name: "timestamp", indexed: false },
  ],
} as const
