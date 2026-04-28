"use client";

import { useState } from "react";
import { faqConfig } from "@/lib/landingConfig";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-bg-secondary/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            {faqConfig.title}
          </h2>
          <p className="text-lg text-text-secondary">
            {faqConfig.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqConfig.faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-card/80 transition-colors"
              >
                <span className="text-lg font-semibold text-text-primary pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
