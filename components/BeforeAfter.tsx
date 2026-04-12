import { beforeAfterConfig } from "@/lib/landingConfig";

export default function BeforeAfter() {
  return (
    <section className="py-20 md:py-32 bg-crypto-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{beforeAfterConfig.title}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without Fantasy Bots */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-crypto-card border border-red-500/20 rounded-3xl p-8 h-full">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">🫠</span>
                {beforeAfterConfig.without.title}
              </h3>
              <ul className="space-y-4">
                {beforeAfterConfig.without.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-gray-400"
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <span className="text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* With Fantasy Bots */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-crypto-card border border-primary-500/20 rounded-3xl p-8 h-full">
              <h3 className="text-2xl font-bold text-primary-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                {beforeAfterConfig.with.title}
              </h3>
              <ul className="space-y-4">
                {beforeAfterConfig.with.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-gray-300"
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <span className="text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
