import { howItWorksConfig } from "@/lib/landingConfig";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-crypto-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            {howItWorksConfig.title}
          </h2>
          <p className="text-lg text-gray-400">
            {howItWorksConfig.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksConfig.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 text-6xl font-bold text-primary-500/10">
                {step.number}
              </div>

              <div className="relative bg-crypto-card border border-crypto-border rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
