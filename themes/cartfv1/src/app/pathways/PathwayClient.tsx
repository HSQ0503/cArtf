"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

type Step = {
  number: string;
  title: string;
  description: string;
  videoId: string;
};

export default function PathwayClient({ steps }: { steps: Step[] }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLElement>(null);

  // Sticky progress bar visibility — appears after scrolling past hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Progress bar fill + current step tracker
  useEffect(() => {
    const handleScroll = () => {
      const container = stepsContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const containerHeight = container.offsetHeight;
      const scrolled = window.scrollY - containerTop;
      const pct = Math.min(Math.max(scrolled / (containerHeight - window.innerHeight), 0), 1);
      setProgress(pct * 100);

      // Which step are we on?
      const viewCenter = window.scrollY + window.innerHeight * 0.4;
      let active = 1;
      stepRefs.current.forEach((el, i) => {
        if (el && el.offsetTop + containerTop <= viewCenter) {
          active = i + 1;
        }
      });
      setCurrentStep(active);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-triggered reveal for step sections
  const revealObserver = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      node.classList.add("pathway-revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("pathway-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
  }, []);

  // Connector reveal
  const connectorObserver = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      node.classList.add("connector-revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("connector-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
  }, []);

  // CTA reveal
  const ctaObserverCb = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      node.classList.add("pathway-revealed");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("pathway-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
  }, []);

  // Load lite-youtube web component
  useEffect(() => {
    import("@justinribeiro/lite-youtube");
  }, []);

  return (
    <div className="pathway-page">
      {/* ══════════════════════════════════════
          Hero / Intro
          ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: "100vh", minHeight: "600px" }}
      >
        {/* Gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #F4C2D7 0%, #E8A0BF 20%, #d4a0c8 40%, #b8aad2 55%, #9AB3D6 75%, #7B9ACC 100%)",
          }}
        />
        {/* Watercolor blooms */}
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(300px, 50vw, 600px)",
            height: "clamp(300px, 50vw, 600px)",
            top: "-10%",
            left: "-10%",
            background: "radial-gradient(ellipse, rgba(244,194,215,0.55) 0%, transparent 70%)",
            animation: "blobDrift1 35s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(250px, 40vw, 500px)",
            height: "clamp(250px, 40vw, 500px)",
            top: "15%",
            right: "-8%",
            background: "radial-gradient(ellipse, rgba(123,154,204,0.5) 0%, transparent 70%)",
            animation: "blobDrift2 30s ease-in-out infinite",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute rounded-full will-change-transform hidden md:block"
          style={{
            width: "350px",
            height: "350px",
            bottom: "10%",
            left: "30%",
            background: "radial-gradient(ellipse, rgba(201,168,212,0.4) 0%, transparent 70%)",
            animation: "blobDrift3 40s ease-in-out infinite",
            filter: "blur(55px)",
          }}
        />
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.07,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.12) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-[700px]">
          <h1
            className="font-secondary text-[42px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.1] mb-6 text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.1)]"
            data-aos="hero-reveal"
            data-aos-delay="100"
          >
            Your Learning Path
          </h1>
          <p
            className="font-secondary text-[18px] sm:text-[20px] text-white/85 leading-relaxed mb-4"
            data-aos="fade-up-sm"
            data-aos-delay="200"
          >
            A step-by-step journey from blank canvas to complete portrait.
          </p>
          <p
            className="text-[13px] tracking-[0.3em] uppercase text-white/60 font-primary font-medium"
            data-aos="fade-up-sm"
            data-aos-delay="300"
          >
            10 steps &middot; ~4 hours of content
          </p>

          {/* Decorative brush stroke */}
          <div className="flex justify-center mt-8" data-aos="fade-up-sm" data-aos-delay="350">
            <svg width="100" height="6" viewBox="0 0 100 6" fill="none" className="opacity-40">
              <path
                d="M2 3C15 1 30 5 50 3C70 1 85 5 98 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ strokeDasharray: 200, animation: "brushReveal 1.5s ease-out 0.8s both" }}
              />
            </svg>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 hero-scroll-hint hidden md:flex">
          <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-primary">
            Scroll
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 via-primary/30 to-transparent scroll-line" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          Sticky Progress Bar
          ══════════════════════════════════════ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-opacity duration-300"
        style={{ opacity: showBar ? 1 : 0, pointerEvents: showBar ? "auto" : "none" }}
      >
        <div className="w-full h-[3px] bg-border/30">
          <div
            className="h-full transition-[width] duration-150 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #B88DA4, #8E9FBF)",
            }}
          />
        </div>
        <div className="container mx-auto px-6">
          <span className="text-[11px] text-text-light font-primary tracking-wide">
            Step {currentStep} of {steps.length}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Step Sections
          ══════════════════════════════════════ */}
      <div ref={stepsContainerRef}>
        {steps.map((step, i) => (
          <div key={step.number}>
            {/* Step section */}
            <section
              ref={(el) => {
                stepRefs.current[i] = el;
                revealObserver(el);
              }}
              className="pathway-step relative overflow-hidden"
              style={{
                minHeight: "80vh",
                background: i % 2 === 0 ? "#FAFAF8" : "#F5F3F0",
                padding: "clamp(60px, 8vw, 120px) 0",
              }}
            >
              <div className="container mx-auto px-6 relative flex flex-col items-center">
                {/* Ghost step number */}
                <span
                  className="pathway-number select-none font-secondary font-bold leading-none pointer-events-none"
                  style={{
                    fontSize: "clamp(80px, 12vw, 160px)",
                    color: "rgba(184, 141, 164, 0.08)",
                  }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* YouTube embed */}
                <div className="pathway-video w-full mt-6 md:mt-8" style={{ maxWidth: "800px" }}>
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      aspectRatio: "16/9",
                    }}
                  >
                    {/* @ts-ignore */}
                    <lite-youtube
                      videoid={step.videoId}
                      videotitle={step.title}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h2
                  className="pathway-title font-secondary font-bold text-[24px] sm:text-[28px] md:text-[32px] text-center mt-8 md:mt-10"
                  style={{ color: "#2D2D2D" }}
                >
                  {step.title}
                </h2>

                {/* Description */}
                <p
                  className="pathway-desc font-secondary font-normal text-[16px] md:text-[18px] text-center mt-3 leading-relaxed"
                  style={{ color: "#6B6B6B", maxWidth: "600px" }}
                >
                  {step.description}
                </p>
              </div>
            </section>

            {/* Connector between steps (not after last) */}
            {i < steps.length - 1 && (
              <div
                ref={(el) => {
                  connectorRefs.current[i] = el;
                  connectorObserver(el);
                }}
                className="pathway-connector flex flex-col items-center py-2"
                style={{ background: i % 2 === 0 ? "#F5F3F0" : "#FAFAF8" }}
              >
                <div className="w-[2px] h-[28px] bg-primary/20" />
                <div
                  className="w-2 h-2 rounded-full my-1"
                  style={{
                    background: "linear-gradient(135deg, #B88DA4, #8E9FBF)",
                  }}
                />
                <div className="w-[2px] h-[28px] bg-primary/20" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          Completion / CTA
          ══════════════════════════════════════ */}
      <section
        ref={(el) => {
          ctaRef.current = el;
          ctaObserverCb(el);
        }}
        className="pathway-step relative overflow-hidden flex items-center justify-center"
        style={{ minHeight: "65vh" }}
      >
        {/* Gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #F4C2D7 0%, #E8A0BF 20%, #d4a0c8 40%, #b8aad2 55%, #9AB3D6 75%, #7B9ACC 100%)",
          }}
        />
        {/* Blooms */}
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(250px, 40vw, 500px)",
            height: "clamp(250px, 40vw, 500px)",
            top: "-15%",
            right: "10%",
            background: "radial-gradient(ellipse, rgba(244,194,215,0.45) 0%, transparent 70%)",
            animation: "blobDrift2 30s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full will-change-transform hidden md:block"
          style={{
            width: "300px",
            height: "300px",
            bottom: "5%",
            left: "15%",
            background: "radial-gradient(ellipse, rgba(123,154,204,0.35) 0%, transparent 70%)",
            animation: "blobDrift3 35s ease-in-out infinite",
            filter: "blur(55px)",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.07,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.12) 100%)",
          }}
        />

        <div className="relative z-10 text-center px-6">
          <h2 className="pathway-title font-secondary text-[36px] sm:text-[44px] md:text-[48px] font-bold italic text-white leading-tight mb-4 [text-shadow:0_2px_20px_rgba(0,0,0,0.1)]">
            You&rsquo;ve got this.
          </h2>
          <p className="pathway-desc font-secondary text-[18px] sm:text-[20px] text-white/85 leading-relaxed mb-10">
            Now pick a category and start practicing.
          </p>
          <div className="pathway-desc flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/"
              className="relative overflow-hidden group btn px-8 py-4 bg-white text-text-dark font-semibold rounded-full border-0 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
            >
              <span className="relative z-10">Explore Skills &rarr;</span>
            </Link>
            <Link
              href="/draw-it-yourself"
              className="relative overflow-hidden group btn px-8 py-4 bg-transparent text-white font-semibold rounded-full border border-white/50 cursor-pointer transition-all duration-300 hover:bg-white/15 hover:border-white/70"
            >
              <span className="relative z-10">Draw It Yourself &rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
