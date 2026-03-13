"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/lib/skills";

interface Props {
  skills: Skill[];
  categories: { id: string; label: string }[];
}

export function SearchSkills({ skills, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchesQuery =
        !query ||
        s.displayName.toLowerCase().includes(query.toLowerCase()) ||
        s.summary.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !activeCategory || s.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [skills, query, activeCategory]);

  return (
    <div>
      {/* Header row: title + search on same line */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            What&apos;s included
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
            {query || activeCategory ? " found" : ""}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border h-9 text-sm"
            aria-label="Search skills"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <button
          onClick={() => setActiveCategory(null)}
          aria-pressed={!activeCategory}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
            !activeCategory
              ? "bg-sf-cloud/15 text-sf-cloud border-sf-cloud/30"
              : "text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setActiveCategory(
                activeCategory === cat.id ? null : cat.id
              )
            }
            aria-pressed={activeCategory === cat.id}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? "bg-sf-cloud/15 text-sf-cloud border-sf-cloud/30"
                : "text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((skill, i) => (
          <div
            key={skill.slug}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
            style={{ animationDelay: `${i * 40}ms`, animationDuration: "350ms" }}
          >
            <SkillCard skill={skill} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-1">No skills found</p>
          <p className="text-sm">Try a different search term or clear the filter</p>
        </div>
      )}
    </div>
  );
}
