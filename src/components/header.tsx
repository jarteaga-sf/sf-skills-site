import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-sf-cloud"
          >
            <path
              d="M18.5 10.2c-.1-3.3-2.8-6-6.1-6-2.4 0-4.5 1.4-5.5 3.5-.4-.1-.8-.2-1.2-.2C3.1 7.5 1 9.6 1 12.2s2.1 4.7 4.7 4.7h12.6c2.2 0 4-1.8 4-4 0-2.1-1.6-3.8-3.8-4v-.7z"
              fill="currentColor"
            />
          </svg>
          <span className="font-bold text-foreground group-hover:text-sf-cloud transition-colors">
            SF Skills
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-[15px]">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skills
          </Link>
          <Link
            href="/#skills-library"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
          >
            Search
          </Link>
          <a
            href="https://github.com/jarteaga-sf/sf-se-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
