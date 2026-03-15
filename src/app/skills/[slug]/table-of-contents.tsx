"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface Props {
  sections: string[];
  mobile?: boolean;
}

export function TableOfContents({ sections, mobile }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const headings = sections.map((s) => document.getElementById(slugify(s)));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const links = sections.map((section) => {
    const id = slugify(section);
    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={() => setIsOpen(false)}
        className={`block text-sm leading-snug py-2 border-l-2 pl-3 transition-colors ${
          activeId === id
            ? "border-sf-cloud text-sf-cloud"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30"
        }`}
      >
        {section}
      </a>
    );
  });

  if (mobile) {
    return (
      <div className="border border-border rounded-lg bg-card/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground cursor-pointer"
        >
          Jump to a section
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="px-4 pb-3 border-t border-border pt-2">
            {links}
          </div>
        )}
      </div>
    );
  }

  return (
    <nav>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Sections
      </p>
      {links}
    </nav>
  );
}
