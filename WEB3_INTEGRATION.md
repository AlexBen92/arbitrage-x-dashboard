# ArbitrageX Web3 Integration

## Overview

This document describes the Web3 integration for ArbitrageX, connecting the frontend to smart contracts deployed on Sepolia testnet.

## Architecture

### Directory Structure

```
arbitrage-x-frontend/
├── app/
│   ├── dashboard/           # Dashboard page with contract interactions
│   │   └── page.tsx
│   └── layout.tsx           # Root layout with Web3 providers
├── components/
│   └── web3/                # Web3 React components
│       ├── WalletConnectButton.tsx
│       ├── NetworkStatus.tsx
│       └── ContractPanel.tsx
├── contracts/
│   └── abi/                 # Smart contract ABIs
│       ├── VolatilityOracle.json
│       ├── RiskManager.json
│       ├── CommitReveal.json
│       └── SqueethArbExecutor.json
├── lib/
│   ├── config/
│   │   └── contracts.ts     # Contract addresses and metadata
│   └── web3/
│       ├── wagmiConfig.ts   # Wagmi/RainbowKit configuration
│       ├── hooks.ts         # Custom React hooks for contracts
│       └── Providers.tsx    # Web3 providers wrapper
└── .env.example             # Environment variables template
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Web3 Library**: Wagmi v2 + Viem v2
- **Wallet Connection**: RainbowKit
- **State Management**: TanStack Query (React Query)
- **Target Network**: Sepolia Testnet

## Sepolia Contract Addresses

| Contract | Address | Description |
|----------|---------|-------------|
| VolatilityOracle | `0xD9e3c3dFe9872454F35Bd567c1A267C35FE0BbAd` | Provides on-chain volatility data |
| RiskManager | `0x82646884d0e549041c19666B091aAf9625cE976b` | Manages risk parameters |
| CommitReveal | `0x66afC814867801A3D33057545b97Cd61F2ACc4E9` | Commit-reveal scheme for intents |
| SqueethArbExecutor | `0xa7da116b72a7db4875D52a424da2963082647987` | Executes Squeeth arbitrage |

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required: WalletConnect Project ID
# Get one at: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Infura API Key (improves RPC reliability)
# Get one at: https://infura.io/
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key_here
```

### Setting Up WalletConnect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add it to `.env.local`

**Important**: The projectId is public and safe to expose in the frontend. Never add private keys or API secrets that should remain server-side.

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Visit `http://localhost:3000` for the landing page or `http://localhost:3000/dashboard` for the Web3 dashboard.

## Building for Production

```bash
npm run build
npm start
```

The build creates a static export compatible with Vercel deployment.

## Web3 Features

### Wallet Connection

- Connect via RainbowKit modal (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- Automatic network switch to Sepolia
- Display connected address and balance

### Contract Interactions

#### Read Operations (All Users)

- **VolatilityOracle**: Latest volatility data, historical values
- **RiskManager**: Max position size, risk factor, user risk level
- **CommitReveal**: Commit/reveal periods, user commitment status
- **SqueethArbExecutor**: Active status, total executions, total profit

#### Write Operations (Authenticated Users)

Prepared hooks available for:
- `useArbitrageExecution()` - Execute arbitrage transactions
- `useCommitIntent()` - Submit commit transactions
- `useCheckPositionAllowed()` - Validate position sizes

### Network Status

Real-time display of:
- Current network (Sepolia required)
- Connection status
- Wallet address
- Auto-refresh toggle

## Vercel Deployment

### Environment Variables

Add these in your Vercel project settings:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_actual_infura_key (optional)
```

### Build Configuration

The `vercel.json` is already configured:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

### Deployment Steps

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Security Notes

### Client-Side Only (Public)

- Wallet addresses
- Contract ABIs
- RPC endpoints
- WalletConnect Project ID

### Server-Side Only (Private)

- Private keys (never in frontend)
- API secrets
- Bot operation credentials
- Admin functions

### Best Practices

1. Never commit `.env.local` to git
2. Use `NEXT_PUBLIC_` prefix for client-side variables only
3. Validate all user inputs before contract calls
4. Implement proper error handling for transactions
5. Use read-only calls where possible

## Testing on Sepolia

### Getting Testnet ETH

Use any Sepolia faucet:
- https://sepoliafaucet.com
- https://www.infura.io/faucet/sepolia
- https://faucet.quicknode.com/ethereum/sepolia

### Verifying Transactions

Check transaction status on [Sepolia Etherscan](https://sepolia.etherscan.io/).

## Troubleshooting

### "Wrong network" error

- Click the network selector in RainbowKit
- Switch to Sepolia testnet

### Contract calls failing

- Ensure you have Sepolia ETH for gas
- Check Sepolia network status
- Verify contract addresses are correct

### Build fails with "No projectId found"

- Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to `.env.local`
- For testing, a placeholder is included but WalletConnect won't work

### Type errors in development

- Run `npm run build` to check for TypeScript errors
- Ensure `target: "ES2020"` in `tsconfig.json` for bigint support

## Next Steps

### Planned Features

- [ ] Transaction history display
- [ ] Real-time event listening
- [ ] Bot execution controls
- [ ] Profit/loss analytics
- [ ] Admin panel for contract management

### Bot Integration

The hooks are prepared for bot operations:
- `useArbitrageExecution()` can be called programmatically
- Server-side execution via API routes (requires private key infrastructure)
- Monitoring hooks for automated triggers

## Support

For issues or questions:
- Check the [Wagmi documentation](https://wagmi.sh/)
- Check the [RainbowKit documentation](https://www.rainbowkit.com/)
- Review contract ABIs in `contracts/abi/`
