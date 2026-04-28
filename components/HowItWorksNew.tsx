export default function HowItWorksNew() {
  const steps = [
    {
      number: "01",
      title: "Connect your wallet",
      description: "Your wallet is your account. No email, no password. Just connect MetaMask or any WalletConnect wallet.",
      icon: "👛"
    },
    {
      number: "02",
      title: "Choose a strategy",
      description: "Pick from 6 market-neutral strategies. Review Sharpe ratios, drawdown, and backtest results.",
      icon: "📊"
    },
    {
      number: "03",
      title: "Mint & earn",
      description: "Mint synthetic strategy tokens with USDC. Your token's NAV reflects real bot performance, updated every hour.",
      icon: "💰"
    }
  ];

  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Start earning alpha in minutes. No complex setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 text-6xl font-bold text-white/5 font-display">
                {step.number}
              </div>

              {/* Card */}
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-3xl mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>

                {/* Connector (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
