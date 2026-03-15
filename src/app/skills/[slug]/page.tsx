import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InstallCommand } from "@/components/install-command";
import { SkillCard } from "@/components/skill-card";
import { getAllSkills, getSkillBySlug } from "@/lib/skills";
import { SkillReference } from "./skill-reference";

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
      {/* Hero zone */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-sf-navy/40 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 fade-up"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all skills
          </Link>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-4 fade-up fade-up-delay-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {skill.displayName}
            </h1>
            <Badge variant="outline" className="shrink-0 text-sm mt-1">
              {skill.categoryLabel}
            </Badge>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6 fade-up fade-up-delay-2">
            {skill.summary}
          </p>

          {/* Key capabilities highlights */}
          {skill.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 fade-up fade-up-delay-2">
              {skill.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sf-cloud/10 text-sf-cloud border border-sf-cloud/20"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* Two-column: How it works + Install */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 fade-up fade-up-delay-3">
            {/* How it works */}
            <div className="rounded-xl border border-sf-cloud/20 bg-sf-navy/50 shadow-lg shadow-black/20 p-6 card-hover">
              <p className="text-base font-semibold text-sf-cloud mb-3">
                How it works
              </p>
              <ol className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-sf-cloud/15 text-sf-cloud text-xs font-bold flex items-center justify-center">1</span>
                  <span>Install the skills into your project using the command below</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-sf-cloud/15 text-sf-cloud text-xs font-bold flex items-center justify-center">2</span>
                  <span>Tell your AI tool what you want to build in plain English</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-sf-cloud/15 text-sf-cloud text-xs font-bold flex items-center justify-center">3</span>
                  <span>The AI uses this skill to follow Salesforce best practices automatically</span>
                </li>
              </ol>
            </div>

            {/* Install */}
            <div className="rounded-xl border border-border/60 bg-secondary/30 shadow-lg shadow-black/20 p-6 flex flex-col card-hover">
              <p className="text-base font-semibold text-foreground mb-1">
                Install
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Copy and paste into your terminal:
              </p>
              <InstallCommand command="curl -sSL https://raw.githubusercontent.com/jarteaga-sf/sf-se-skills/main/install.sh | bash" />
              <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground/60">
                <span className="font-mono">{skill.name}</span>
                {skill.version && <span className="font-mono">v{skill.version}</span>}
                {skill.author && <span>by {skill.author}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full reference zone */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <SkillReference skill={skill} />
      </section>

      {/* Related skills */}
      {(() => {
        const relatedSkills = allSkills
          .filter((s) => s.category === skill.category && s.slug !== skill.slug)
          .slice(0, 3);
        if (relatedSkills.length === 0) return null;
        return (
          <section className="border-t border-border/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                More in {skill.categoryLabel}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedSkills.map((s) => (
                  <SkillCard key={s.slug} skill={s} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Prev/Next navigation */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSkill ? (
              <Link
                href={`/skills/${prevSkill.slug}`}
                className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-sf-cloud/30 shadow-md shadow-black/15 p-5 card-hover flex items-center gap-3"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-sf-cloud shrink-0 group-hover:-translate-x-0.5 transition-all" />
                <div>
                  <div className="text-xs text-muted-foreground/70 mb-0.5">Previous</div>
                  <div className="text-sm font-medium text-foreground group-hover:text-sf-cloud transition-colors">{prevSkill.displayName}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextSkill ? (
              <Link
                href={`/skills/${nextSkill.slug}`}
                className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-sf-cloud/30 shadow-md shadow-black/15 p-5 card-hover flex items-center justify-end gap-3 text-right"
              >
                <div>
                  <div className="text-xs text-muted-foreground/70 mb-0.5">Next</div>
                  <div className="text-sm font-medium text-foreground group-hover:text-sf-cloud transition-colors">{nextSkill.displayName}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-sf-cloud shrink-0 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
