import { forWhoConfig } from "@/lib/landingConfig";

export default function ForWho() {
  return (
    <section className="py-20 md:py-32 bg-crypto-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            {forWhoConfig.title}
          </h2>
          <p className="text-lg text-gray-400">
            {forWhoConfig.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {forWhoConfig.items.map((item, index) => (
            <div
              key={index}
              className="bg-crypto-card border border-crypto-border rounded-2xl p-8 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
