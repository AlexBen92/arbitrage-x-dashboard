// components/TestnetBanner.tsx
// Testnet warning banner for Sepolia network

'use client'

export function TestnetBanner() {
  return (
    <div className="testnet-banner">
      <span className="banner-icon">⚠️</span>
      <span className="banner-text">Testnet Only — Sepolia network — No real funds</span>
      <a
        href="https://sepoliafaucet.com"
        target="_blank"
        rel="noopener noreferrer"
        className="banner-link"
      >
        Get Sepolia ETH ↗
      </a>
      <a
        href="https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
        target="_blank"
        rel="noopener noreferrer"
        className="banner-link"
      >
        Get testnet USDC ↗
      </a>
    </div>
  )
}

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('testnet-banner-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'testnet-banner-styles'
  styleEl.textContent = `
    .testnet-banner {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 0.75rem 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .banner-icon {
      font-size: 1.25rem;
    }

    .banner-text {
      color: #fbbf24;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .banner-link {
      color: #60a5fa;
      font-size: 0.875rem;
      text-decoration: none;
      transition: color 0.2s;
    }

    .banner-link:hover {
      color: #93c5fd;
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .testnet-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `
  document.head.appendChild(styleEl)
}
