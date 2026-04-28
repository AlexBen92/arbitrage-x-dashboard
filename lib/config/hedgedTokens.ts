// Hedged Tokens Configuration for Sepolia Testnet

export type HedgedTokenType = 'cross' | 'mm' | 'beta';

export interface HedgedToken {
  id: string;
  name: string;
  symbol: string;
  address: `0x${string}`;
  type: HedgedTokenType;
  description: string;
  color: string;
  icon: string;
}

export const HEDGED_TOKENS: HedgedToken[] = [
  {
    id: 'cross_sdl',
    name: 'Cross SDL',
    symbol: 'CROSS_SDL',
    address: '0x5556BD8609d33429DdCC184D1E1E3395c7Ea87e2',
    type: 'cross',
    description: 'Stratégie cross-asset sur SDL avec couverture delta neutre',
    color: 'from-purple-500 to-indigo-600',
    icon: '🔄',
  },
  {
    id: 'cross_matic',
    name: 'Cross MATIC',
    symbol: 'CROSS_MATIC',
    address: '0xD8FAc89772E1708289f5C30213b7c8D8B50A586a',
    type: 'cross',
    description: 'Stratégie cross-asset sur MATIC avec couverture delta neutre',
    color: 'from-indigo-500 to-purple-600',
    icon: '🔀',
  },
  {
    id: 'mm_link',
    name: 'Market Making LINK',
    symbol: 'MM_LINK',
    address: '0x5E553a273660d953E554A7d35384e9D870Ad8183',
    type: 'mm',
    description: 'Market making sur Chainlink avec spread dynamique',
    color: 'from-blue-500 to-cyan-600',
    icon: '🔗',
  },
  {
    id: 'mm_avax',
    name: 'Market Making AVAX',
    symbol: 'MM_AVAX',
    address: '0xF4D034D20A6b3a90a3E8891030A1198A193AFbDb',
    type: 'mm',
    description: 'Market making sur Avalanche avec spread dynamique',
    color: 'from-red-500 to-orange-600',
    icon: '🔺',
  },
  {
    id: 'mm_sol',
    name: 'Market Making SOL',
    symbol: 'MM_SOL',
    address: '0x31963530Ee8e03807dFf9933408CdA8Ec2E06394',
    type: 'mm',
    description: 'Market making sur Solana avec spread dynamique',
    color: 'from-gradient-500 to-purple-600',
    icon: '☀️',
  },
  {
    id: 'beta_eth',
    name: 'Beta ETH',
    symbol: 'BETA_ETH',
    address: '0x60a62b105c6a94B8DE53032F8CBe0dd4d7296A8c',
    type: 'beta',
    description: 'Stratégie beta sur Ethereum avec couverture dynamique',
    color: 'from-cyan-500 to-blue-600',
    icon: '💎',
  },
];

export const HEDGED_TOKENS_BY_TYPE = {
  cross: HEDGED_TOKENS.filter(t => t.type === 'cross'),
  mm: HEDGED_TOKENS.filter(t => t.type === 'mm'),
  beta: HEDGED_TOKENS.filter(t => t.type === 'beta'),
};

export const TOKEN_BY_ADDRESS = Object.fromEntries(
  HEDGED_TOKENS.map(t => [t.address.toLowerCase(), t])
);

export const TOKEN_BY_ID = Object.fromEntries(
  HEDGED_TOKENS.map(t => [t.id, t])
);

// Sepolia USDC Mock
export const SEPOLIA_USDC = {
  address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as const,
  decimals: 6,
  symbol: 'USDC',
  faucetUrl: 'https://faucet.circle.com/usdc',
};

export type TokenId = typeof HEDGED_TOKENS[number]['id'];
