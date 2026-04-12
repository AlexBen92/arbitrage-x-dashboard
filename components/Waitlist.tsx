"use client";

import { useState } from "react";
import { waitlistConfig } from "@/lib/landingConfig";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="waitlist" className="py-20 md:py-32 bg-crypto-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
          {waitlistConfig.title}
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          {waitlistConfig.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={waitlistConfig.placeholder}
              required
              className="flex-1 px-5 py-4 bg-crypto-card border border-crypto-border rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 rounded-full hover:from-primary-500 hover:to-accent-400 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 whitespace-nowrap"
            >
              {isSubmitted ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmé !
                </span>
              ) : (
                waitlistConfig.buttonText
              )}
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {waitlistConfig.disclaimer}
          </p>
        </form>

        {/* Early adopter badge */}
        <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-crypto-card border border-primary-500/20 rounded-full">
          <span className="text-2xl">🎁</span>
          <span className="text-sm text-gray-300">
            <span className="text-primary-400 font-semibold">Early adopters</span> reçoivent des rewards exclusifs
          </span>
        </div>
      </div>
    </section>
  );
}
