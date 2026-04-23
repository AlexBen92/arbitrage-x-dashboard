// ArbitrageX Sepolia Contract Configuration
// This file contains public addresses and metadata for Sepolia testnet

export const NETWORKS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia.infura.io/v3/'] },
      public: { http: ['https://rpc.sepolia.org'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
} as const;

export const CONTRACTS = {
  sepolia: {
    VolatilityOracle: {
      address: '0xD9e3c3dFe9872454F35Bd567c1A267C35FE0BbAd' as const,
      name: 'Volatility Oracle',
      description: 'Provides on-chain volatility data for arbitrage calculations',
      version: '1.0.0',
    },
    RiskManager: {
      address: '0x82646884d0e549041c19666B091aAf9625cE976b' as const,
      name: 'Risk Manager',
      description: 'Manages risk parameters and position limits for arbitrage execution',
      version: '1.0.0',
    },
    CommitReveal: {
      address: '0x66afC814867801A3D33057545b97Cd61F2ACc4E9' as const,
      name: 'Commit Reveal',
      description: 'Commit-reveal scheme for secure arbitrage intent submission',
      version: '1.0.0',
    },
    SqueethArbExecutor: {
      address: '0xa7da116b72a7db4875D52a424da2963082647987' as const,
      name: 'Squeeth Arb Executor',
      description: 'Executes Squeeth-based arbitrage strategies',
      version: '1.0.0',
    },
  },
} as const;

export type SupportedChain = keyof typeof NETWORKS;
export type ContractName = keyof typeof CONTRACTS.sepolia;

// Helper to get contract address for a specific chain
export const getContractAddress = (chain: SupportedChain, contract: ContractName): string => {
  return CONTRACTS[chain][contract].address;
};

// Contract types for ABI imports
export const CONTRACT_ABI_PATHS = {
  VolatilityOracle: '/contracts/abi/VolatilityOracle.json',
  RiskManager: '/contracts/abi/RiskManager.json',
  CommitReveal: '/contracts/abi/CommitReveal.json',
  SqueethArbExecutor: '/contracts/abi/SqueethArbExecutor.json',
} as const;
