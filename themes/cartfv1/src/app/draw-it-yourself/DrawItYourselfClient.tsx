"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DiyVideo } from "@/lib/diy";

const thumbHeights: Record<string, string> = {
  large: "h-[240px]",
  medium: "h-[180px]",
  small: "h-[150px]",
};

const cardPadding: Record<string, string> = {
  large: "p-4",
  medium: "p-3.5",
  small: "p-3",
};

export default function DrawItYourselfClient({
  videos,
}: {
  videos: DiyVideo[];
}) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [modalVideo, setModalVideo] = useState<DiyVideo | null>(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (modalVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalVideo]);

  const openModal = useCallback((video: DiyVideo) => {
    setModalVideo(video);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-body text-center">
        <div className="container max-w-2xl mx-auto">
          <h1 className="font-secondary font-bold text-[clamp(40px,6vw,64px)] leading-[1.1] text-text-dark mb-4">
            Draw It Yourself
          </h1>
          <div className="flex justify-center mb-6">
            <svg
              width="180"
              height="10"
              viewBox="0 0 180 10"
              fill="none"
              className="opacity-50"
            >
              <path
                d="M3 6C25 2 50 9 90 5C130 1 155 8 177 4"
                stroke="#E8A0BF"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="font-secondary italic text-xl text-text-light mb-6">
            Real artists. Real techniques. No prompts needed.
          </p>
          <p className="text-base text-text-light max-w-[560px] mx-auto leading-relaxed">
            When a new AI art trend goes viral, talented artists show us how
            it&apos;s actually done — by hand. These are our favorites.
          </p>
        </div>
      </section>

      {/* ── Gallery Wall ── */}
      <section
        className="relative"
        style={{
          backgroundColor: "#F3F0EB",
          boxShadow: "inset 0 8px 16px rgba(0,0,0,0.03)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.07,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />

        <div
          className="container relative"
          style={{ paddingTop: "80px", paddingBottom: "120px" }}
        >
          <div ref={wallRef} className="gallery-wall">
            {videos.map((video, i) => (
              <div
                key={video.id}
                className={`wall-card ${revealed ? "wall-card-visible" : ""} ${cardPadding[video.size]}`}
                style={{
                  transitionDelay: revealed ? `${i * 120}ms` : "0ms",
                  background: "#FFFFFF",
                  borderRadius: "4px",
                  boxShadow: "2px 4px 12px rgba(0,0,0,0.12)",
                }}
                onClick={() => openModal(video)}
                role="button"
                tabIndex={0}
                aria-label={`Play: ${video.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(video);
                  }
                }}
              >
                <div className="flex justify-center -mt-5 mb-2 relative z-10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-sm"
                  >
                    <circle cx="12" cy="10" r="6" fill="#E8A0BF" />
                    <circle cx="12" cy="10" r="2.5" fill="white" opacity="0.6" />
                    <line
                      x1="12"
                      y1="16"
                      x2="12"
                      y2="23"
                      stroke="#c4899e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div
                  className={`relative overflow-hidden rounded-sm ${thumbHeights[video.size]} bg-border`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="wall-card-play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-colors hover:bg-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="#2D2D2D"
                    >
                      <polygon points="6,3 18,10 6,17" />
                    </svg>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-secondary font-bold text-text-dark text-lg leading-snug line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-sm mt-1">
                    <span className="text-text-light">by </span>
                    <span className="text-primary font-medium">
                      {video.artist}
                    </span>
                  </p>
                  <p className="text-sm text-text-light mt-2 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-body text-center">
        <div className="container max-w-xl mx-auto">
          <h2 className="font-secondary font-bold text-[clamp(22px,4vw,28px)] text-text-dark mb-4">
            More artists. More techniques. No shortcuts.
          </h2>
          <p className="text-base text-text-light mb-8">
            Explore our curated skill categories to start learning.
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #E8A0BF 0%, #9AB3D6 100%)",
            }}
          >
            Explore Skills &rarr;
          </Link>
        </div>
      </section>

      {/* ── Modal ── */}
      <div
        className={`gallery-modal-backdrop ${modalVideo ? "modal-open" : ""}`}
        onClick={() => setModalVideo(null)}
        aria-hidden={!modalVideo}
      />
      <div
        className={`gallery-modal-content ${modalVideo ? "modal-open" : ""}`}
        role="dialog"
        aria-modal={!!modalVideo}
        aria-label={modalVideo?.title}
      >
        {modalVideo && (
          <>
            <button
              onClick={() => setModalVideo(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-border/50 hover:bg-border flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#2D2D2D"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            </button>
            <div className="aspect-video rounded-xl overflow-hidden bg-border mb-6">
              <iframe
                src={`https://www.youtube.com/embed/${modalVideo.youtubeId}?autoplay=1`}
                title={modalVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <h2 className="font-secondary font-bold text-text-dark text-2xl mb-2">
              {modalVideo.title}
            </h2>
            <p className="text-sm mb-4">
              <span className="text-text-light">by </span>
              <span className="text-primary font-medium">
                {modalVideo.artist}
              </span>
            </p>
            <p className="text-text-light leading-relaxed">
              {modalVideo.description}
            </p>
            <p className="text-primary text-sm font-medium mt-4">
              Follow {modalVideo.artist} &rarr;
            </p>
          </>
        )}
      </div>
    </>
  );
}
