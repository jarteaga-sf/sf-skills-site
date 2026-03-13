import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/lib/skills";

const CATEGORY_COLORS: Record<string, string> = {
  "se-specific": "bg-[#FF6900]/15 text-[#FF6900] border-[#FF6900]/30",
  foundation: "bg-sf-cloud/15 text-sf-cloud border-sf-cloud/30",
  "user-experience": "bg-[#04844B]/15 text-[#04844B] border-[#04844B]/30",
  platform: "bg-[#9050E9]/15 text-[#9050E9] border-[#9050E9]/30",
  quality: "bg-[#E3066A]/15 text-[#E3066A] border-[#E3066A]/30",
};

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skills/${skill.slug}`} className="block group">
      <div className="border border-border rounded-xl px-6 py-5 h-full bg-card/50 hover:bg-card hover:border-sf-cloud/30 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="font-semibold text-foreground group-hover:text-sf-cloud transition-colors text-base tracking-tight">
            {skill.displayName}
          </h3>
          <Badge
            variant="outline"
            className={`text-[11px] shrink-0 ${CATEGORY_COLORS[skill.category] || ""}`}
          >
            {skill.categoryLabel}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {skill.summary}
        </p>
      </div>
    </Link>
  );
}
