"use client";

import config from "@/config/config.json";
import AOS from "aos";
import { usePathname } from "next/navigation";
import { JSX, ReactNode, useEffect } from "react";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps): JSX.Element => {
  const pathname = usePathname();

  // Sticky header logic
  const stickyNavInit = () => {
    const sticky_header = config.settings?.sticky_header;
    const header = document.querySelector(".header") as HTMLElement | null;
    let lastScrollDirection = "up";
    let lastState = "normal";
    let scrollTimer: number | null = null;
    let scrollEndTimer: number | null = null;

    const onScroll = () => {
      if (!header) return;
      const currentScroll = window.scrollY;
      const currentDirection = currentScroll > 100 ? "down" : "up";

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }
      if (!sticky_header) return;

      if (currentScroll > 150) {
        if (lastState !== "reveal") {
          lastState = "reveal";
          header.classList.add("header-reveal");
          header.classList.add("bg-white");
          header.classList.remove("bg-primary/5");
        }
      } else if (currentScroll < 50) {
        if (lastState !== "normal") {
          lastState = "normal";
          header.classList.remove("header-reveal");
          const path = window.location.pathname;
          const isBlogSinglePage =
            path.startsWith("/blog/") &&
            !path.endsWith("/blog/") &&
            !path.includes("/page/");
          if (path !== "/" && !isBlogSinglePage) {
            header.classList.add("bg-primary/5");
            header.classList.remove("bg-white");
          }
        }
      } else if (currentDirection !== lastScrollDirection) {
        lastScrollDirection = currentDirection;
      } else {
        scrollEndTimer = window.setTimeout(() => {
          const headerElement = document.querySelector(".header");
          if (!headerElement) return;
          if (window.scrollY > 100) {
            if (lastState !== "reveal") {
              lastState = "reveal";
              headerElement.classList.add("header-reveal");
              headerElement.classList.add("bg-white");
              headerElement.classList.remove("bg-primary/5");
            }
          } else {
            if (lastState !== "normal") {
              lastState = "normal";
              headerElement.classList.remove("header-reveal");
              const path = window.location.pathname;
              const isBlogSinglePage =
                path.startsWith("/blog/") &&
                !path.endsWith("/blog/") &&
                !path.includes("/page/");
              if (path !== "/" && !isBlogSinglePage) {
                headerElement.classList.add("bg-primary/5");
                headerElement.classList.remove("bg-white");
              }
            }
          }
        }, 200);
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    // Clean up
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  };

  useEffect(() => {
    window.scroll(0, 0);
    const cleanup = stickyNavInit();
    return () => {
      if (cleanup) cleanup();
    };
  }, [pathname]);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  return <>{children}</>;
};

export default Providers;
