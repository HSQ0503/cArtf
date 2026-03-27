"use client";

import React, { useEffect, useState } from "react";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const header = document.querySelector(".header");

    if (isOpen) {
      header && header.classList.replace("z-30", "z-10");
    } else {
      header && header.classList.replace("z-10", "z-30");
    }

    return () => {
      header && header.classList.replace("z-10", "z-30");
    };
  }, [isOpen]);

  const openVideo = () => {
    setIsOpen(true);
  };

  const closeVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div onClick={openVideo} className="relative w-fit mx-auto">
        {/* Ripple animations */}
        <span className="absolute inset-0 rounded-full bg-secondary/30 animate-ripple"></span>
        <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ripple animation-delay-1000"></span>

        <svg
          width="106"
          height="106"
          viewBox="0 0 106 106"
          fill="none"
          className="cursor-pointer text-body mx-auto relative z-10 group-hover:scale-105 transition-transform duration-300"
        >
          <circle cx="53" cy="53" r="53" fill="white"></circle>
          <path
            d="M49.8569 63.8798C48.5248 64.7124 46.7969 63.7547 46.7969 62.1838V45.336C46.7969 43.7652 48.5248 42.8075 49.8569 43.64L63.3351 52.0639C64.5884 52.8473 64.5884 54.6726 63.3351 55.4559L49.8569 63.8798Z"
            fill="var(--color-secondary)"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] transition-opacity duration-500 ease-in-out opacity-100"
          onClick={closeVideo}
        >
          <div className="relative w-[80%] max-w-3xl transition-all duration-500 ease-in-out transform scale-100 opacity-100">
            <iframe
              width="100%"
              height="500"
              src={url}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
