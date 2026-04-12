// Landing page configuration - centralize all copy and data

export const siteConfig = {
  name: "Fantasy Bots",
  description: "Drafte tes bots. Farme le marché.",
  url: "https://fantasybots.io",
};

export const heroConfig = {
  headline: "Drafte tes bots. Farme le marché.",
  subheadline:
    "Compose ta line-up de cartes de bots et de tokens funding, suis le leaderboard et gagne des récompenses à chaque saison.",
  ctaPrimary: "Rejoindre la saison 0",
  ctaSecondary: "Voir une démo",
};

export const beforeAfterConfig = {
  title: "Avant / Après Fantasy Bots",
  without: {
    title: "Sans Fantasy Bots 🫠",
    items: [
      {
        emoji: "😵‍💫",
        text: "Staring at charts at 3 AM ??",
      },
      {
        emoji: "🤬",
        text: "Rage-quit après chaque liquidation ??",
      },
      {
        emoji: "👨‍💻",
        text: "Bots que tu n'as jamais le temps de coder ??",
      },
    ],
  },
  with: {
    title: "Avec Fantasy Bots 🚀",
    items: [
      {
        emoji: "🎯",
        text: "Tu drafte 3 cartes, tu lock ta saison ??",
      },
      {
        emoji: "📊",
        text: "Tu checkes juste le leaderboard ??",
      },
      {
        emoji: "🐦",
        text: "Tu flexes tes wins sur X ??",
      },
    ],
  },
};

export const gameModesConfig = {
  title: "Game modes",
  subtitle: "Choisis ton mode de jeu et grind les leaderboards.",
  modes: [
    {
      name: "Fantasy Bots",
      status: "available",
      description: "Draft des cartes de bots et tokens funding pour des saisons compétitives.",
      icon: "🤖",
    },
    {
      name: "Funding Wars",
      status: "coming-soon",
      description: "Prédis les taux de funding et flippe les positions des autres joueurs.",
      icon: "⚔️",
    },
    {
      name: "Vault Tranches",
      status: "coming-soon",
      description: "Allocates ta strategy dans des vaults avec tranches de risque.",
      icon: "🏦",
    },
  ],
};

export const howItWorksConfig = {
  title: "How it works",
  subtitle: "3 étapes pour commencer à farme.",
  steps: [
    {
      number: "01",
      title: "Choisis tes cartes",
      description: "Sélectionne des bots et tokens funding basés sur leurs stats historiques.",
      icon: "🎴",
    },
    {
      number: "02",
      title: "Lock ta line-up",
      description: "Valide ta composition pour la saison et suis les performances en temps réel.",
      icon: "🔒",
    },
    {
      number: "03",
      title: "Encaisse les rewards",
      description: "Les meilleurs line-ups de chaque saison gagnent des rewards et airdrops.",
      icon: "💰",
    },
  ],
};

export const demoBotsConfig = [
  {
    id: 1,
    name: "Momentum Sniper V2",
    type: "Bot",
    pnl: "+127.4%",
    score: 94,
    rarity: "legendary",
    description: "Stratégie momentum sur majors avec trailing stop dynamique.",
  },
  {
    id: 2,
    name: "Funding Farmer",
    type: "Token",
    pnl: "+43.8%",
    score: 78,
    rarity: "rare",
    description: "Capture les differentials de funding sur perps USDT.",
  },
  {
    id: 3,
    name: "Gamma Scalper",
    type: "Bot",
    pnl: "+89.2%",
    score: 87,
    rarity: "epic",
    description: "Scalping gamma sur ETH options avec delta-hedge automatique.",
  },
  {
    id: 4,
    name: "Arb Executor",
    type: "Bot",
    pnl: "+34.1%",
    score: 71,
    rarity: "rare",
    description: "DEX arbitrage multi-pool avec flashloan optimization.",
  },
  {
    id: 5,
    name: "Contrarian Bandit",
    type: "Bot",
    pnl: "+156.7%",
    score: 98,
    rarity: "legendary",
    description: "Mean-reversion sur liquidations cascade avec position sizing adaptatif.",
  },
  {
    id: 6,
    name: "Basis Yield",
    type: "Token",
    pnl: "+21.3%",
    score: 65,
    rarity: "common",
    description: "Cash-and-carry sur futures perp avec roll optimization.",
  },
];

export const statsConfig = {
  title: "Stats de la saison test",
  subtitle: "Données simulées basées sur nos modèles de backtesting.",
  stats: [
    {
      value: "1,327",
      label: "line-ups de test créées",
      icon: "🎯",
    },
    {
      value: "68%",
      label: "de line-ups positives",
      icon: "📈",
    },
    {
      value: "4 min",
      label: "temps moyen par session",
      icon: "⏱️",
    },
  ],
};

export const forWhoConfig = {
  title: "Pour qui ?",
  subtitle: "Fantasy Bots est fait pour les degens qui savent ce qu'ils veulent.",
  items: [
    {
      emoji: "💹",
      title: "Tu connais déjà les perps et le funding",
      description:
        "Pas besoin de t'expliquer ce qu'est un perp ou comment fonctionne le funding. Tu es déjà terrain.",
    },
    {
      emoji: "⏰",
      title: "Tu n'as pas le temps de tout trader toi-même",
      description:
        "Entre le job, la famille et le sleep, tu veux exposer au marché sans être collé aux charts H24.",
    },
    {
      emoji: "🎮",
      title: "Tu veux un jeu qui parle vraiment la langue crypto",
      description:
        "Pas du blabla corporate. Des vrais concepts de trading, des vrais bots, et une communauté de degens.",
    },
  ],
};

export const faqConfig = {
  title: "FAQ",
  subtitle: "Les questions que tout le monde pose.",
  faqs: [
    {
      question: "Est-ce un casino ?",
      answer:
        "Non. Fantasy Bots est un jeu de stratégie basé sur des signaux de marché réels (funding, PnL, volatilité). Pas de random RNG, pas de ponzi-nomics. Tes performances dépendent des cartes que tu choisis et de comment le marché bouge.",
    },
    {
      question: "Je dois déposer pour tester ?",
      answer:
        "Non. Tu peux générer une line-up de démo en 1 clic sans rien déposer. Pas besoin de wallet ni de KYC pour découvrir le jeu.",
    },
    {
      question: "Qui contrôle les fonds ?",
      answer:
        "Toi. Toujours. Fantasy Bots ne touche jamais à tes fonds. Le jeu est un overlay de compétition sur des stratégies qui existent déjà. Tu garde le contrôle total de ton capital.",
    },
  ],
};

export const waitlistConfig = {
  title: "Rejoindre la saison 0",
  subtitle:
    "On t'envoie les règles complètes, la date de lancement et tes rewards de early adopter.",
  placeholder: "ton@email.com",
  buttonText: "Rejoindre la saison 0",
  disclaimer: "Pas de spam. Uniquement des majs importantes sur le lancement.",
};

export const navLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Game modes", href: "#game-modes" },
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
