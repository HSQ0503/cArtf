"use client";

import Logo from "@/components/Logo";
import NavDropDown from "@/components/NavDropDown";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export interface ChildNavigationLink {
  name: string;
  url: string;
}

export interface NavigationLink {
  name: string;
  url: string;
  hasChildren?: boolean;
  children?: ChildNavigationLink[];
}

const Header = () => {
  const { main }: { main: NavigationLink[] } = menu;
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`header z-20 ${
        config.settings.sticky_header ? "sticky" : ""
      } top-0 w-full transition-all duration-500 ${
        isHome ? "header-home bg-transparent absolute" : "bg-body border-b border-border"
      }`}
    >
      <nav className="navbar mx-auto container">
        <div className="order-0 flex items-center">
          {isHome ? (
            <Link href="/" className="navbar-brand inline-block group">
              <span className="font-secondary text-[1.75rem] tracking-tight select-none text-text-dark/90 relative inline-block">
                <span className="font-light">c</span>
                <span className="font-bold text-text-dark">A</span>
                <span className="font-light">rtf</span>
                <span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full w-full bg-primary/30 group-hover:bg-primary/50 transition-all duration-300" />
              </span>
            </Link>
          ) : (
            <Logo />
          )}
        </div>

        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          htmlFor="nav-toggle"
          className="order-3 cursor-pointer flex items-center lg:hidden lg:order-1 text-text-dark"
        >
          <svg
            id="show-button"
            className="h-5 fill-current block"
            viewBox="0 0 20 20"
          >
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
          </svg>
          <svg
            id="hide-button"
            className="h-5 fill-current hidden"
            viewBox="0 0 20 20"
          >
            <title>Menu Close</title>
            <polygon
              points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
              transform="rotate(45 10 10)"
            />
          </svg>
        </label>

        <ul id="nav-menu" className="navbar-nav">
          {main.map((menu, i) => (
            <React.Fragment key={i}>
              {menu.hasChildren ? (
                <NavDropDown menu={menu} pathname={pathname} />
              ) : (
                <li className="nav-item">
                  <a
                    href={menu.url}
                    className={`nav-link text-sm ${
                      pathname === `${menu.url}/` || pathname === menu.url
                        ? "active"
                        : ""
                    }`}
                  >
                    {menu.name}
                  </a>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          <Link
            href="/explore"
            className="btn btn-solid relative overflow-hidden group hidden lg:inline-block px-6 py-3"
          >
            <span className="relative z-10">Explore Tutorials</span>
            <div className="absolute w-full h-full -right-full -bottom-full rounded-full group-hover:-right-1 group-hover:-bottom-1 group-hover:w-[150%] group-hover:h-[150%] transition-all duration-[550ms] bg-primary" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
