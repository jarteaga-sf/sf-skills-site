import { getAllSkills, getCategories } from "@/lib/skills";
import { SearchSkills } from "@/components/search-skills";
import { InstallCommand } from "@/components/install-command";

const ASCII_ART = `███████╗███████╗    ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██╔════╝    ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╗      ███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔══╝      ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║         ███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝         ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`;

const AGENTS = [
  { name: "Claude Code" },
  { name: "Cursor" },
  { name: "Windsurf" },
];

export default function Home() {
  const skills = getAllSkills();
  const categories = getCategories();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero — compact split layout */}
      <section className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <pre className="hidden md:block font-mono text-[7px] md:text-[9px] leading-tight text-sf-cloud/60 mb-6 overflow-x-auto">
            {ASCII_ART}
          </pre>
          <h2 className="md:hidden text-xl font-bold tracking-tight text-sf-cloud mb-4">
            SF Skills
          </h2>

          <div className="md:grid md:grid-cols-[1fr_auto] md:gap-12 md:items-start">
            {/* Left — messaging */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground max-w-xl mb-2">
                Build Salesforce apps faster with AI
              </h1>
              <p className="text-base text-muted-foreground max-w-lg mb-4 leading-relaxed">
                Skills teach your AI coding tool how to build Salesforce
                components the right way. Install once, then just describe
                what you want.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Works with</span>
                  {AGENTS.map((agent) => (
                    <span
                      key={agent.name}
                      className="text-xs text-muted-foreground/80 border border-border rounded-full px-2 py-0.5"
                    >
                      {agent.name}
                    </span>
                  ))}
                </div>
              </div>
              <details className="group mb-2 md:mb-0">
                <summary className="text-xs text-muted-foreground cursor-pointer list-none inline-flex items-center gap-1 hover:text-foreground transition-colors">
                  <svg
                    className="h-3 w-3 transition-transform group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  What are skills?
                </summary>
                <div className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    Skills are small instruction files that live in your project.
                    Your AI tool reads them and learns how to build Salesforce
                    components correctly — the right colors, spacing, patterns,
                    and best practices.
                  </p>
                  <p>
                    Think of them like recipes. You don&apos;t need to read
                    them yourself — just install and start describing what
                    you want in plain English.
                  </p>
                </div>
              </details>
            </div>

            {/* Right — install */}
            <div className="mt-4 md:mt-0 md:w-[380px]">
              <p className="text-xs text-muted-foreground mb-1.5">
                Copy and paste into your terminal:
              </p>
              <InstallCommand command="curl -sSL https://raw.githubusercontent.com/jarteaga-sf/sf-se-skills/main/install.sh | bash" />
              <details className="group mt-1.5">
                <summary className="text-[11px] text-muted-foreground/60 cursor-pointer list-none inline-flex items-center gap-1 hover:text-muted-foreground transition-colors">
                  <svg
                    className="h-2.5 w-2.5 transition-transform group-open:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  New to the terminal?
                </summary>
                <p className="mt-1.5 text-[11px] text-muted-foreground/60 leading-relaxed">
                  On Mac: press Cmd+Space, type &quot;Terminal&quot;, hit Enter.
                  On Windows: search for &quot;PowerShell&quot;.
                  Then paste the command above and press Enter.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Library */}
      <section id="skills-library" className="max-w-6xl mx-auto px-4 py-8">
        <SearchSkills skills={skills} categories={categories} />
      </section>
    </main>
  );
}
