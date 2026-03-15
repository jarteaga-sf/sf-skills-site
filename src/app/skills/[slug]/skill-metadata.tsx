"use client";

import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/lib/skills";

const CATEGORY_COLORS: Record<string, string> = {
  "se-specific": "bg-[#FF6900]/15 text-[#FF6900] border-[#FF6900]/30",
  foundation: "bg-sf-cloud/15 text-sf-cloud border-sf-cloud/30",
  "user-experience": "bg-[#04844B]/15 text-[#04844B] border-[#04844B]/30",
  platform: "bg-[#9050E9]/15 text-[#9050E9] border-[#9050E9]/30",
  quality: "bg-[#E3066A]/15 text-[#E3066A] border-[#E3066A]/30",
};

const COMPATIBLE_TOOLS = ["Claude Code", "Cursor", "Windsurf"];

export function SkillMetadata({ skill }: { skill: Skill }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Skill Info
      </p>

      {/* Category */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Category</p>
        <Badge
          variant="outline"
          className={`text-xs ${CATEGORY_COLORS[skill.category] || ""}`}
        >
          {skill.categoryLabel}
        </Badge>
      </div>

      {/* Version */}
      {skill.version && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Version</p>
          <p className="text-sm text-foreground font-mono">v{skill.version}</p>
        </div>
      )}

      {/* Author */}
      {skill.author && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Author</p>
          <p className="text-sm text-foreground">{skill.author}</p>
        </div>
      )}

      {/* License */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">License</p>
        <p className="text-sm text-foreground">{skill.license}</p>
      </div>

      {/* Compatible tools */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Compatible with</p>
        <div className="flex flex-wrap gap-1.5">
          {COMPATIBLE_TOOLS.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary/50 text-muted-foreground border border-border/50"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Section count */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">Sections</p>
        <p className="text-sm text-foreground">{skill.sections.length}</p>
      </div>
    </div>
  );
}
