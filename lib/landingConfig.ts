// Landing page configuration - centralize all copy and data

export const siteConfig = {
  name: "Arbitrage X",
  description: "Deploy Arbitrage Bots. Capture Alpha 24/7.",
  url: "https://arbitrage-x-frontend.vercel.app",
};

export const heroConfig = {
  headline: "Deploy Arbitrage Bots. Capture Alpha 24/7.",
  subheadline: "6 market-neutral strategies running on Sepolia. Zero directional risk. Institutional-grade execution.",
  ctaPrimary: "Launch Dashboard",
  ctaSecondary: "View Strategies",
};

export const faqConfig = {
  title: "FAQ",
  subtitle: "Common questions about our platform.",
  faqs: [
    {
      question: "What is Arbitrage X?",
      answer: "Arbitrage X is a platform for deploying market-neutral trading strategies on Sepolia testnet. Mint synthetic strategy tokens that track bot performance in real-time.",
    },
    {
      question: "What are the risks?",
      answer: "Strategies are market-neutral but carry smart contract risk, oracle risk, and slippage. Only deploy USDC you can afford to lose. Past performance doesn't guarantee future results.",
    },
    {
      question: "How do I get started?",
      answer: "Connect your wallet, get USDC testnet from the faucet, choose a strategy, and mint tokens. Your token's NAV updates hourly based on bot performance.",
    },
    {
      question: "Is this mainnet?",
      answer: "Currently on Sepolia testnet for testing. Mainnet deployment coming after security audits.",
    },
  ],
};

export const navLinks = [
  { name: "Strategies", href: "#strategies" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Backtest", href: "/backtest" },
  { name: "Dashboard", href: "/dashboard" },
];

export const footerLinks = [
  { name: "Backtest", href: "/backtest" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Terms", href: "#" },
  { name: "Privacy", href: "#" },
];
