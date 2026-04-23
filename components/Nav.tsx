"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig, navLinks, waitlistConfig } from "@/lib/landingConfig";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-crypto-darker/90 backdrop-blur-md border-b border-crypto-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl md:text-2xl font-bold gradient-text">
              {siteConfig.name}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-400 ${
                  link.disabled ? "text-gray-600 cursor-not-allowed" : "text-gray-300"
                }`}
              >
                {link.name}
                {link.disabled && (
                  <span className="ml-1 text-xs text-gray-600">(soon)</span>
                )}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-300 hover:text-primary-400 transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <a
              href="#waitlist"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 rounded-full hover:from-primary-500 hover:to-accent-400 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              {waitlistConfig.buttonText}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
