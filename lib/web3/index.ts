/**
 * Web3 Module Exports
 * Central export point for all Web3 functionality
 */

// Configuration
export { wagmiConfig, customSepolia, supportedChains, CHAIN_IDS, isSupportedChain } from './wagmiConfig';
export { CONTRACTS, NETWORKS, getContractAddress, type ContractName, type SupportedChain } from '../config/contracts';

// Hooks
export {
  useVolatilityData,
  useRiskManager,
  useCheckPositionAllowed,
  useCommitReveal,
  useSqueethExecutor,
  useArbitrageExecution,
  useCommitIntent,
  useNetworkStatus as useNetworkStatusBasic,
} from './hooks';

// Transaction Hooks
export {
  useArbitrageExecutionWithReceipt,
  useCommitIntentWithReceipt,
  useRiskManagerUpdate,
  getEtherscanUrl,
  getAddressUrl,
  type TransactionStatus,
  type TransactionState,
} from './transactions';

// Diagnostics Hooks
export {
  useRpcDiagnostics,
  useNetworkStatus,
  formatGasPrice,
  estimateFee,
  formatFee,
  getConnectionQuality,
  getQualityColor,
} from './diagnostics';

// Error Handling
export {
  parseContractError,
  getErrorMessage,
  getErrorSeverity,
  isUserRejection,
  getErrorAction,
  type ContractError,
} from './errors';

// Logging
export {
  logger,
  LogLevel,
  LOG_CONTEXT,
  type LogEntry,
} from './logger';

// Providers
export { Web3Providers } from './Providers';
