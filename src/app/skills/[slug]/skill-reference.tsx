"use client";

import { SkillContent } from "./skill-content";
import { SkillMetadata } from "./skill-metadata";
import { TableOfContents } from "./table-of-contents";
import type { Skill } from "@/lib/skills";

export function SkillReference({ skill }: { skill: Skill }) {
  return (
    <div>
      {/* Section label */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm text-muted-foreground/60">
            Full reference — what your AI tool reads when this skill is active
          </p>
        </div>
        <div className="flex-1 border-t border-border/50" />
      </div>

      {/* Mobile: metadata + TOC */}
      <div className="lg:hidden space-y-4 mb-6">
        <SkillMetadata skill={skill} />
        {skill.sections.length > 0 && (
          <TableOfContents sections={skill.sections} mobile />
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        <div className="max-w-4xl">
          <SkillContent content={skill.content} />
        </div>

        {/* Sticky sidebar — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <SkillMetadata skill={skill} />
            {skill.sections.length > 0 && (
              <TableOfContents sections={skill.sections} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
