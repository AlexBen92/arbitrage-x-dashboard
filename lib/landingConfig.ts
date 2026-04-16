// Landing page configuration - centralize all copy and data

export const siteConfig = {
  name: "Arbitrage X",
  description: "Automated arbitrage trading for crypto markets.",
  url: "https://arbitragex.io",
};

export const heroConfig = {
  headline: "Automated Arbitrage. Captured Profits.",
  subheadline:
    "Deploy automated arbitrage bots across DEXs and CEXs. Capture price differences 24/7 with institutional-grade execution.",
  ctaPrimary: "Start Trading",
  ctaSecondary: "View Demo",
};

export const beforeAfterConfig = {
  title: "Before / After Arbitrage X",
  without: {
    title: "Without Arbitrage X 🫠",
    items: [
      {
        emoji: "😵‍💫",
        text: "Staring at charts at 3 AM ??",
      },
      {
        emoji: "🤬",
        text: "Missing arb opportunities by seconds ??",
      },
      {
        emoji: "👨‍💻",
        text: "Bots you never have time to code ??",
      },
    ],
  },
  with: {
    title: "With Arbitrage X 🚀",
    items: [
      {
        emoji: "🎯",
        text: "Deploy bots in one click ??",
      },
      {
        emoji: "📊",
        text: "Track profits in real-time ??",
      },
      {
        emoji: "🐦",
        text: "Flex your gains on X ??",
      },
    ],
  },
};

export const gameModesConfig = {
  title: "Arbitrage Strategies",
  subtitle: "Choose your strategy and maximize returns.",
  modes: [
    {
      name: "DEX Arbitrage",
      status: "available",
      description: "Exploit price differences across decentralized exchanges with flashloan execution.",
      icon: "⚡",
    },
    {
      name: "CEX Arbitrage",
      status: "coming-soon",
      description: "Cross-exchange arbitrage with automated fund transfers and smart routing.",
      icon: "🔄",
    },
    {
      name: "Triangular Arbitrage",
      status: "coming-soon",
      description: "Capture intra-exchange opportunities across multiple trading pairs.",
      icon: "🔺",
    },
  ],
};

export const howItWorksConfig = {
  title: "How it works",
  subtitle: "3 steps to start capturing arbitrage.",
  steps: [
    {
      number: "01",
      title: "Connect your exchanges",
      description: "Link your API keys to enable automated trading across multiple platforms.",
      icon: "🔗",
    },
    {
      number: "02",
      title: "Deploy your bots",
      description: "Choose from pre-built strategies or customize your own arbitrage parameters.",
      icon: "🚀",
    },
    {
      number: "03",
      title: "Collect profits",
      description: "Watch your bots execute trades 24/7 and withdraw profits at any time.",
      icon: "💰",
    },
  ],
};

export const demoBotsConfig = [
  {
    id: 1,
    name: "Flashloan Executor",
    type: "DEX Bot",
    pnl: "+2.4%",
    score: 94,
    rarity: "legendary",
    description: "Instant arbitrage across Uniswap, Curve and Sushiswap with flashloan optimization.",
  },
  {
    id: 2,
    name: "Funding Rate Arb",
    type: "CEX Bot",
    pnl: "+1.8%",
    score: 78,
    rarity: "rare",
    description: "Capture funding rate differentials between Binance and Bybit perpetual futures.",
  },
  {
    id: 3,
    name: "Triangular Hunter",
    type: "Multi Bot",
    pnl: "+0.9%",
    score: 87,
    rarity: "epic",
    description: "BTC-ETH-USDT triangular arbitrage with slippage-aware execution.",
  },
  {
    id: 4,
    name: "Cross-Exchange Bridge",
    type: "CEX Bot",
    pnl: "+1.1%",
    score: 71,
    rarity: "rare",
    description: "Automated transfers and arbitrage between Coinbase and Kraken.",
  },
  {
    id: 5,
    name: "Liquidation Sniper",
    type: "DEX Bot",
    pnl: "+5.7%",
    score: 98,
    rarity: "legendary",
    description: "Capture liquidation opportunities across Aave, Compound and Maker protocols.",
  },
  {
    id: 6,
    name: "Basis Trade",
    type: "Futures Bot",
    pnl: "+0.3%",
    score: 65,
    rarity: "common",
    description: "Cash-and-carry arbitrage with automatic futures rollover optimization.",
  },
];

export const statsConfig = {
  title: "Platform Statistics",
  subtitle: "Real-time performance metrics from our live trading bots.",
  stats: [
    {
      value: "24/7",
      label: "automated execution",
      icon: "⚡",
    },
    {
      value: "< 50ms",
      label: "average execution time",
      icon: "⏱️",
    },
    {
      value: "99.9%",
      label: "uptime guarantee",
      icon: "📈",
    },
  ],
};

export const forWhoConfig = {
  title: "Who is this for?",
  subtitle: "Arbitrage X is built for traders who want automated profits.",
  items: [
    {
      emoji: "💹",
      title: "You understand arbitrage opportunities",
      description:
        "You know price differences exist and want to capture them automatically without manual execution.",
    },
    {
      emoji: "⏰",
      title: "You can't monitor markets 24/7",
      description:
        "Arbitrage opportunities appear at any time. Let bots capture them while you sleep, work, or live your life.",
    },
    {
      emoji: "🎮",
      title: "You want institutional-grade tools",
      description:
        "Access the same level of automation used by market makers and hedge funds, simplified for everyone.",
    },
  ],
};

export const faqConfig = {
  title: "FAQ",
  subtitle: "Common questions about arbitrage trading.",
  faqs: [
    {
      question: "Is arbitrage trading risky?",
      answer:
        "Arbitrage is generally lower risk than directional trading since you're capturing price differences rather than predicting market direction. However, technical risks like slippage, failed transactions, and exchange downtime still exist.",
    },
    {
      question: "What capital do I need to start?",
      answer:
        "You can start with as little as $500 for DEX arbitrage. For CEX arbitrage, we recommend $2,000+ to account for withdrawal fees and minimum transfer amounts.",
    },
    {
      question: "Who controls the funds?",
      answer:
        "You do. Always. Arbitrage X never touches your funds. Bots execute trades using your API keys with withdrawal permissions disabled for maximum security.",
    },
  ],
};

export const waitlistConfig = {
  title: "Get Early Access",
  subtitle:
    "Join our waiting list for exclusive access, lower fees, and priority support.",
  placeholder: "your@email.com",
  buttonText: "Join Waitlist",
  disclaimer: "No spam. Only important updates about launches and features.",
};

export const navLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Strategies", href: "#game-modes" },
  { name: "Docs", href: "#", disabled: true },
];

export const footerLinks = [
  { name: "Docs (soon)", href: "#" },
  { name: "Discord (soon)", href: "#" },
  { name: "Terms / Risks", href: "#" },
];

export const rarityColors = {
  common: "from-gray-600 to-gray-700",
  rare: "from-blue-600 to-blue-700",
  epic: "from-purple-600 to-purple-700",
  legendary: "from-amber-500 to-orange-600",
};
