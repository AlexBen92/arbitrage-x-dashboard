import { gameModesConfig } from "@/lib/landingConfig";

export default function GameModes() {
  return (
    <section id="game-modes" className="py-20 md:py-32 bg-crypto-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            {gameModesConfig.title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {gameModesConfig.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {gameModesConfig.modes.map((mode) => (
            <div
              key={mode.name}
              className="relative group card-glow"
            >
              <div className="relative bg-crypto-card border border-crypto-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary-500/30">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      mode.status === "available"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {mode.status === "available" ? "Available" : "Coming soon"}
                  </span>
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{mode.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {mode.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {mode.description}
                </p>

                {/* Hover effect for available mode */}
                {mode.status === "available" && (
                  <div className="mt-4 pt-4 border-t border-crypto-border">
                    <a
                      href="#demo"
                      className="text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors"
                    >
                      Essayer maintenant →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
