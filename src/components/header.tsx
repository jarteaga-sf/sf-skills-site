"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      setAtTop(y < 10);
      setHidden(y > lastY && y > 60);
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`border-b backdrop-blur-md sticky z-50 transition-all duration-300 ${
        hidden
          ? "-top-16 opacity-0"
          : "top-0 opacity-100"
      } ${
        atTop
          ? "border-border/50 bg-transparent shadow-none"
          : "border-border/50 bg-background/80 shadow-md shadow-black/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Salesforce"
          >
            <path
              d="M10.006 5.415a4.195 4.195 0 0 1 3.045 -1.306c1.56 0 2.954 0.9 3.69 2.205 0.63 -0.3 1.35 -0.45 2.1 -0.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22 -5.176 5.22c-0.345 0 -0.69 -0.044 -1.02 -0.104a3.75 3.75 0 0 1 -3.3 1.95c-0.6 0 -1.155 -0.15 -1.65 -0.375A4.314 4.314 0 0 1 8.88 20.4a4.302 4.302 0 0 1 -4.05 -2.82c-0.27 0.062 -0.54 0.076 -0.825 0.076 -2.204 0 -4.005 -1.8 -4.005 -4.05 0 -1.5 0.811 -2.805 2.01 -3.51 -0.255 -0.57 -0.39 -1.2 -0.39 -1.846 0 -2.58 2.1 -4.65 4.65 -4.65 1.53 0 2.85 0.705 3.72 1.8"
              fill="#00A1E0"
            />
          </svg>
          <span className="font-bold text-foreground group-hover:text-sf-cloud transition-colors">
            SF Skills
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-[15px]">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/#skills-library"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
          >
            Search
          </Link>
          <a
            href="https://github.com/jarteaga-sf/sf-se-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
