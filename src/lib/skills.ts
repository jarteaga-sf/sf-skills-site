import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Skill {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  summary: string;
  category: string;
  categoryLabel: string;
  license: string;
  author?: string;
  version?: string;
  content: string;
  sections: string[];
  highlights: string[];
}

// Plain-language names and summaries for non-developers
const SKILL_META: Record<
  string,
  { displayName: string; summary: string }
> = {
  "sf-lwc-design": {
    displayName: "Design System",
    summary:
      "Makes your components look like they belong in Salesforce. Handles colors, spacing, and fonts automatically.",
  },
  "sf-lwc-styling": {
    displayName: "Styling & CSS",
    summary:
      "Ready-made styles for cards, badges, tables, forms, and more. Like a recipe book for making things look good.",
  },
  "sf-lwc-theming": {
    displayName: "Branding & Themes",
    summary:
      "Customize colors and branding to match your company. Supports light mode, dark mode, and multi-brand setups.",
  },
  "sf-lwc-ux": {
    displayName: "User Experience",
    summary:
      "Makes your app feel polished with loading states, empty screens, error messages, and keyboard support.",
  },
  "sf-lwc-content": {
    displayName: "UI Writing & Labels",
    summary:
      "Writes button labels, error messages, help text, and empty state copy for you. Gets the tone right every time.",
  },
  "sf-lwc-motion": {
    displayName: "Animations",
    summary:
      "Adds smooth transitions, fade-ins, and subtle animations that make your components feel alive.",
  },
  "sf-lwc-page-composition": {
    displayName: "Page Layouts",
    summary:
      "Build components that work in Salesforce App Builder. Drag-and-drop ready with proper configuration.",
  },
  "sf-lwc-experience": {
    displayName: "External Sites",
    summary:
      "Build customer-facing websites and portals with Experience Cloud. Handles branding, navigation, and SEO.",
  },
  "sf-lwc-mobile": {
    displayName: "Mobile Design",
    summary:
      "Makes your components work great on phones and tablets. Touch-friendly buttons, responsive layouts, and offline support.",
  },
  "sf-lwc-dataviz": {
    displayName: "Charts & Dashboards",
    summary:
      "Build metric cards, KPI displays, progress bars, and sparklines. Turn data into something people actually understand.",
  },
  "sf-lwc-review": {
    displayName: "Quality Review",
    summary:
      "Audits your components and gives you a score with specific things to fix. Like a code review checklist, automated.",
  },
  "sf-se-demo-scripts": {
    displayName: "Demo Scripts",
    summary:
      "Generates demo flows, talk tracks, and sample data for customer presentations. Industry templates included.",
  },
};

const CATEGORY_MAP: Record<string, { category: string; label: string }> = {
  "sf-se-demo-scripts": { category: "se-specific", label: "Demos & Presentations" },
  "sf-lwc-design": { category: "foundation", label: "Look & Feel" },
  "sf-lwc-styling": { category: "foundation", label: "Look & Feel" },
  "sf-lwc-theming": { category: "foundation", label: "Look & Feel" },
  "sf-lwc-ux": { category: "user-experience", label: "User Experience" },
  "sf-lwc-content": { category: "user-experience", label: "User Experience" },
  "sf-lwc-motion": { category: "user-experience", label: "User Experience" },
  "sf-lwc-page-composition": {
    category: "platform",
    label: "Salesforce Platform",
  },
  "sf-lwc-experience": {
    category: "platform",
    label: "Salesforce Platform",
  },
  "sf-lwc-mobile": { category: "platform", label: "Salesforce Platform" },
  "sf-lwc-dataviz": { category: "quality", label: "Data & Quality" },
  "sf-lwc-review": { category: "quality", label: "Data & Quality" },
};

const SKILLS_DIR = path.join(process.cwd(), "content", "skills");

const HIDDEN_SECTION_NAMES = /^(Scoring Rubric|Scoring Guide|Cross-Skill Integration|Dependencies|Anti-Patterns)/i;

function extractHighlights(content: string): string[] {
  const lines = content.split("\n");
  let inSection = false;
  const highlights: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      if (/^(Core Rules|Core Principles|Key Principles)$/i.test(h2Match[1])) {
        inSection = true;
        continue;
      } else if (inSection) {
        break;
      }
    }
    if (inSection) {
      const itemMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
      if (itemMatch) {
        highlights.push(itemMatch[1]);
      }
    }
  }

  return highlights.slice(0, 5);
}

function extractSections(content: string): string[] {
  const matches = content.match(/^## (.+)$/gm);
  if (!matches) return [];
  return matches
    .map((m) => m.replace(/^## /, ""))
    .filter((s) => !HIDDEN_SECTION_NAMES.test(s));
}

export function getAllSkills(): Skill[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];

  const dirs = fs.readdirSync(SKILLS_DIR).filter((d) => {
    const fullPath = path.join(SKILLS_DIR, d);
    return fs.statSync(fullPath).isDirectory();
  });

  return dirs
    .map((dir) => {
      const filePath = path.join(SKILLS_DIR, dir, "SKILL.md");
      if (!fs.existsSync(filePath)) return null;

      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const cat = CATEGORY_MAP[dir] || {
        category: "other",
        label: "Other",
      };

      const meta = SKILL_META[dir];

      return {
        slug: dir,
        name: data.name || dir,
        displayName: meta?.displayName || data.name || dir,
        description: data.description || "",
        summary: meta?.summary || data.description || "",
        category: cat.category,
        categoryLabel: cat.label,
        license: data.license || "MIT",
        author: data.metadata?.author,
        version: data.metadata?.version,
        content,
        sections: extractSections(content),
        highlights: extractHighlights(content),
      } as Skill;
    })
    .filter(Boolean) as Skill[];
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return getAllSkills().find((s) => s.slug === slug);
}

export function getCategories(): { id: string; label: string }[] {
  const skills = getAllSkills();
  const seen = new Map<string, string>();
  for (const s of skills) {
    if (!seen.has(s.category)) {
      seen.set(s.category, s.categoryLabel);
    }
  }
  return Array.from(seen, ([id, label]) => ({ id, label }));
}
