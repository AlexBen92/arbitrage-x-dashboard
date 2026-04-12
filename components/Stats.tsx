import { statsConfig } from "@/lib/landingConfig";

export default function Stats() {
  return (
    <section className="py-20 md:py-32 bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            {statsConfig.title}
          </h2>
          <p className="text-lg text-gray-400">
            {statsConfig.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {statsConfig.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-crypto-card border border-crypto-border rounded-2xl p-8 text-center transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
