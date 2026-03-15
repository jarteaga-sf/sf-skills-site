import { getAllSkills, getCategories } from "@/lib/skills";
import { SearchSkills } from "@/components/search-skills";
import { InstallCommand } from "@/components/install-command";

const ASCII_ART = `███████╗███████╗    ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██╔════╝    ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╗      ███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔══╝      ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║         ███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝         ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`;

const AGENTS: { name: string; logo: string; invert?: boolean }[] = [
  { name: "Claude Code", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg" },
  { name: "Cursor", logo: "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/brand-logo-9.svg" },
  { name: "Windsurf", logo: "https://exafunction.github.io/public/brand/windsurf-black-symbol.svg", invert: true },
];

export default function Home() {
  const skills = getAllSkills();
  const categories = getCategories();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-sf-navy/40 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <pre className="hidden md:block font-mono text-[8px] md:text-[10px] leading-tight text-sf-cloud/60 mb-6 select-none fade-up" aria-hidden="true">
            {ASCII_ART}
          </pre>
          <h2 className="md:hidden text-xl font-bold tracking-tight text-sf-cloud mb-6 fade-up">
            SF Skills
          </h2>

          {/* Heading + subtitle + install */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 fade-up fade-up-delay-1">
            Build Salesforce apps faster with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-4 leading-relaxed fade-up fade-up-delay-2">
            Skills teach your AI coding tool how to build Salesforce
            components the right way. Install once, then just describe
            what you want.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 fade-up fade-up-delay-3">
            <div className="flex-1 max-w-xl">
              <InstallCommand command="curl -sSL https://raw.githubusercontent.com/jarteaga-sf/sf-se-skills/main/install.sh | bash" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground/50">Works with</span>
              {AGENTS.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground/70"
                  title={agent.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.logo}
                    alt={agent.name}
                    className="h-4 w-4"
                    style={agent.invert ? { filter: "brightness(0) invert(1)", opacity: 0.7 } : { opacity: 0.7 }}
                  />
                  <span>{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What are skills — expandable callout */}
          <details className="group mt-2 rounded-lg border border-sf-cloud/15 bg-sf-navy/30 max-w-2xl fade-up fade-up-delay-4">
            <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none hover:bg-sf-navy/50 rounded-lg transition-colors">
              <svg
                className="h-4 w-4 text-sf-cloud shrink-0 transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm font-medium text-sf-cloud">What are skills?</span>
              <span className="text-xs text-muted-foreground/50 ml-1">— learn how AI + skills work together</span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed space-y-2 border-t border-sf-cloud/10 mx-4">
              <p>
                When you use an AI coding tool (like Claude Code, Cursor, or Windsurf), it can write code for you — but it doesn&apos;t always know Salesforce best practices.
                <strong className="text-foreground"> Skills fix that.</strong> They&apos;re small instruction files your AI reads behind the scenes to build components the right way.
              </p>
              <p>
                You don&apos;t need to read or understand them. Just install, describe what you want, and the AI handles the rest.{" "}
                <a
                  href="https://jarteaga-sf.github.io/claude-code-guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sf-cloud hover:underline"
                >
                  New to vibe coding? Start here &rarr;
                </a>
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Skills Library */}
      <section id="skills-library" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <SearchSkills skills={skills} categories={categories} />
      </section>
    </main>
  );
}
