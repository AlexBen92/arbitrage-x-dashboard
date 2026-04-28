"use client";

import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: "24h Volume", value: "$2,400,000", raw: 2400000, prefix: "$", suffix: "" },
  { label: "Live Strategies", value: "6", raw: 6 },
  { label: "Best Sharpe Ratio", value: "18.72", raw: 18.72 },
  { label: "Min Drawdown", value: "0.0%", raw: 0, suffix: "%" },
  { label: "Avg Monthly Return", value: "+2.2%", raw: 2.2, prefix: "+", suffix: "%" },
  { label: "Traders Active", value: "500+", raw: 500, suffix: "+" }
];

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1500 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const endTime = startTime + duration;

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(value * eased);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  // Format the number
  let formatted: string;
  if (value >= 1000000) {
    formatted = (displayValue / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    formatted = (displayValue / 1000).toFixed(1) + "K";
  } else if (Number.isInteger(value)) {
    formatted = Math.floor(displayValue).toString();
  } else {
    formatted = displayValue.toFixed(2);
  }

  return (
    <div ref={ref} className="stat-value">
      {prefix}{formatted}{suffix}
    </div>
  );
}

export default function PlatformStats() {
  return (
    <section className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            Platform Statistics
          </h2>
          <p className="text-text-secondary">
            Real-time metrics from our live Sepolia deployment
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur border border-border rounded-2xl p-6 text-center hover:bg-card/80 transition-colors"
            >
              <AnimatedNumber
                value={stat.raw}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
