// src/app/page.tsx
"use client"

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll(".fade-in-section").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <HeroSection />
      <div className="fade-in-section">
        <FeaturesSection />
      </div>
      <div className="fade-in-section">
        <HowItWorks />
      </div>
      <div className="fade-in-section">
        <TestimonialsSection />
      </div>
      <div className="fade-in-section">
        <PricingSection />
      </div>
      <div className="fade-in-section">
        <CTASection />
      </div>
    </div>
  );
};

export default Index;