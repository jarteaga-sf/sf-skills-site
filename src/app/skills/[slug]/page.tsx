import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InstallCommand } from "@/components/install-command";
import { getAllSkills, getSkillBySlug } from "@/lib/skills";
import { SkillContent } from "./skill-content";
import { TableOfContents } from "./table-of-contents";

export async function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  return {
    title: `${skill.displayName} — SF Skills`,
    description: skill.summary,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const allSkills = getAllSkills();
  const currentIndex = allSkills.findIndex((s) => s.slug === slug);
  const prevSkill = currentIndex > 0 ? allSkills[currentIndex - 1] : null;
  const nextSkill =
    currentIndex < allSkills.length - 1 ? allSkills[currentIndex + 1] : null;

  return (
    <main id="main-content" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all skills
        </Link>

        {/* Header */}
        <div className="max-w-4xl mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {skill.displayName}
            </h1>
            <Badge variant="outline" className="shrink-0 text-sm">
              {skill.categoryLabel}
            </Badge>
          </div>

          <p className="text-base text-foreground/80 leading-relaxed mb-4 max-w-2xl">
            {skill.summary}
          </p>

          {/* How it works + install in a compact row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl">
            <div className="flex-1 bg-sf-cloud/5 border border-sf-cloud/20 rounded-lg px-3 py-2.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">How it works:</span>{" "}
                Install the skills, then tell your AI tool what to build.
                It handles the Salesforce best practices automatically.
              </p>
            </div>
            <details className="group border border-border rounded-lg">
              <summary className="px-3 py-2.5 text-xs font-medium text-muted-foreground cursor-pointer list-none flex items-center gap-1.5 hover:text-foreground transition-colors whitespace-nowrap">
                <svg
                  className="h-3 w-3 transition-transform group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Install
              </summary>
              <div className="px-3 pb-3 border-t border-border pt-2">
                <InstallCommand command="curl -sSL https://raw.githubusercontent.com/jarteaga-sf/sf-se-skills/main/install.sh | bash" />
                <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground/60">
                  <span className="font-mono">{skill.name}</span>
                  {skill.version && <span className="font-mono">v{skill.version}</span>}
                  {skill.author && <span>by {skill.author}</span>}
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Reference content */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-3.5 w-3.5 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xs text-muted-foreground/60">
              Full reference — what your AI tool reads when this skill is active
            </p>
          </div>

          {/* Mobile TOC */}
          {skill.sections.length > 0 && (
            <div className="lg:hidden my-4">
              <TableOfContents sections={skill.sections} mobile />
            </div>
          )}

          <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10">
            <div className="max-w-4xl">
              <SkillContent content={skill.content} />
            </div>

            {/* Sticky TOC — desktop */}
            {skill.sections.length > 0 && (
              <aside className="hidden lg:block">
                <TableOfContents sections={skill.sections} />
              </aside>
            )}
          </div>
        </div>

        {/* Prev/Next Navigation */}
        <div className="border-t border-border mt-10 pt-6 grid grid-cols-2 gap-4 max-w-4xl">
          {prevSkill ? (
            <Link
              href={`/skills/${prevSkill.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <div className="text-xs text-muted-foreground/70 mb-0.5">Previous</div>
                <div className="font-medium">{prevSkill.displayName}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSkill ? (
            <Link
              href={`/skills/${nextSkill.slug}`}
              className="group flex items-center justify-end gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
            >
              <div>
                <div className="text-xs text-muted-foreground/70 mb-0.5">Next</div>
                <div className="font-medium">{nextSkill.displayName}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  );
}
