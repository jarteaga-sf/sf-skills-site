"use client";

import { useMemo } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CALLOUT_PATTERNS = /^(Core Rules|Core Principles|Key Principles|Important|Rules)/i;
const HIDDEN_SECTIONS = /^(Scoring Rubric|Scoring Guide|Cross-Skill Integration|Dependencies|Anti-Patterns)/i;

function stripHiddenSections(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let skipping = false;

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      if (HIDDEN_SECTIONS.test(h2Match[1])) {
        skipping = true;
        continue;
      } else {
        skipping = false;
      }
    }
    if (!skipping) {
      result.push(line);
    }
  }

  return result.join("\n");
}

function isAsciiDiagram(code: string): boolean {
  const lines = code.trim().split("\n");
  const boxChars = /[┌┐└┘├┤┬┴─│╔╗╚╝║═▪▫●○►◄▲▼→←↑↓]/;
  const matchCount = lines.filter((l) => boxChars.test(l)).length;
  return matchCount >= 2 || (lines.length <= 8 && matchCount >= 1);
}

const LANG_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  json: "JSON",
  xml: "XML",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  sql: "SQL",
};

function highlightCode(code: string, lang: string): string {
  let highlighted = code;

  if (lang === "html" || lang === "xml") {
    // Comments
    highlighted = highlighted.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="code-comment">$1</span>'
    );
    // Tags
    highlighted = highlighted.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="code-tag">$2</span>'
    );
    // Attributes
    highlighted = highlighted.replace(
      /\s([\w-]+)(=)/g,
      ' <span class="code-attr">$1</span>$2'
    );
    // Strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;)/g,
      '<span class="code-string">$1</span>'
    );
  } else if (lang === "css") {
    // Comments
    highlighted = highlighted.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span class="code-comment">$1</span>'
    );
    // Properties
    highlighted = highlighted.replace(
      /^(\s*)([\w-]+)(:)/gm,
      '$1<span class="code-attr">$2</span>$3'
    );
    // Values with units
    highlighted = highlighted.replace(
      /:\s*([^;{}\n]+)/g,
      ': <span class="code-string">$1</span>'
    );
    // Selectors (lines ending with {)
    highlighted = highlighted.replace(
      /^([^{}\n:]+)(\{)/gm,
      '<span class="code-tag">$1</span>$2'
    );
  } else if (["js", "javascript", "ts", "typescript"].includes(lang)) {
    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*$)/gm,
      '<span class="code-comment">$1</span>'
    );
    // Strings (single and double quoted, already escaped)
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;)/g,
      '<span class="code-string">$1</span>'
    );
    highlighted = highlighted.replace(
      /(&#39;[^&]*?&#39;|'[^']*?')/g,
      '<span class="code-string">$1</span>'
    );
    // Template literals
    highlighted = highlighted.replace(
      /(`[^`]*?`)/g,
      '<span class="code-string">$1</span>'
    );
    // Keywords
    highlighted = highlighted.replace(
      /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|new|this|async|await|get|set|of|in|true|false|null|undefined)\b/g,
      '<span class="code-keyword">$1</span>'
    );
    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="code-number">$1</span>'
    );
  } else if (["bash", "sh", "shell"].includes(lang)) {
    // Comments
    highlighted = highlighted.replace(
      /(#.*$)/gm,
      '<span class="code-comment">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;)/g,
      '<span class="code-string">$1</span>'
    );
    // Commands at start of line
    highlighted = highlighted.replace(
      /^(\s*)(curl|bash|npm|npx|cd|mkdir|echo|cat|chmod|sudo|git)\b/gm,
      '$1<span class="code-keyword">$2</span>'
    );
    // Flags
    highlighted = highlighted.replace(
      /\s(-[\w-]+)/g,
      ' <span class="code-attr">$1</span>'
    );
  } else if (lang === "json") {
    // Keys
    highlighted = highlighted.replace(
      /(&quot;[\w\s-]+&quot;)(\s*:)/g,
      '<span class="code-attr">$1</span>$2'
    );
    // String values
    highlighted = highlighted.replace(
      /(:\s*)(&quot;[^&]*?&quot;)/g,
      '$1<span class="code-string">$2</span>'
    );
    // Numbers and booleans
    highlighted = highlighted.replace(
      /(:\s*)(true|false|null|\d+\.?\d*)/g,
      '$1<span class="code-keyword">$2</span>'
    );
  }

  return highlighted;
}

function wrapSectionsInDetails(html: string): string {
  // Match h2 wrapper divs: <div class="mt-10 mb-6"><h2 id="..." class="...">...</h2></div>
  const h2Regex = /<div class="mt-10 mb-6"><h2 id="([^"]*)" class="[^"]*">([\s\S]*?)<\/h2><\/div>/g;
  const matches = [...html.matchAll(h2Regex)];

  if (matches.length === 0) return html;

  const sections: { start: number; end: number; id: string; title: string; fullMatch: string }[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const start = match.index!;
    const end = i < matches.length - 1 ? matches[i + 1].index! : html.length;
    sections.push({
      start,
      end,
      id: match[1],
      title: match[2],
      fullMatch: match[0],
    });
  }

  // Build output: content before first h2, then wrapped sections
  let result = html.substring(0, sections[0].start);

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const sectionContent = html.substring(sec.start + sec.fullMatch.length, sec.end);
    const isCallout = CALLOUT_PATTERNS.test(sec.title);
    const summaryClass = isCallout
      ? "text-lg font-semibold tracking-tight text-sf-cloud cursor-pointer select-none flex items-center gap-2 py-2"
      : "text-lg font-semibold tracking-tight text-foreground cursor-pointer select-none flex items-center gap-2 py-2";
    const openAttr = i === 0 ? " open" : "";

    result += `<details class="collapsible-section mt-10 mb-6 border-b border-border pb-2"${openAttr}><summary class="${summaryClass}" id="${sec.id}"><svg class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>${sec.title}</summary>${sectionContent}</details>`;
  }

  return result;
}

function parseMarkdown(md: string): string {
  let isFirstH1 = true;

  // Step 0: Strip hidden sections (scoring rubrics, cross-skill, etc.)
  md = stripHiddenSections(md);

  // Step 1: Extract code blocks and replace with placeholders to protect them
  const codeBlocks: string[] = [];
  const processed = md.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const escaped = escapeHtml(code);
      const rawForCopy = escapeHtml(code).replace(/"/g, "&quot;");

      let block: string;
      if (!lang && isAsciiDiagram(code)) {
        block = `<div class="diagram-block my-6 bg-secondary/30 border border-border rounded-lg p-5 overflow-auto max-h-[280px]"><pre class="font-mono text-[13px] leading-[1.6] text-sf-cloud/80 whitespace-pre">${escaped}</pre></div>`;
      } else {
        const displayLang = LANG_LABELS[lang] || (lang ? lang.toUpperCase() : "Code");
        const colorized = lang ? highlightCode(escaped, lang) : escaped;
        block = `<div class="terminal-window my-6 rounded-lg border border-border overflow-hidden group/code"><div class="terminal-titlebar flex items-center gap-2 px-3 py-1.5 bg-[#0c1e33] border-b border-border"><div class="flex gap-1.5"><span class="w-2 h-2 rounded-full bg-[#ff5f57]/60"></span><span class="w-2 h-2 rounded-full bg-[#febc2e]/60"></span><span class="w-2 h-2 rounded-full bg-[#28c840]/60"></span></div><span class="text-[10px] font-mono text-muted-foreground/40 ml-1">${displayLang}</span><button class="copy-code-btn ml-auto opacity-0 group-hover/code:opacity-100 transition-opacity bg-secondary/60 border border-border rounded px-1.5 py-0.5 cursor-pointer flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground" data-code="${rawForCopy}"><svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</button></div><pre class="font-mono bg-[#060f1d] px-4 py-3 overflow-auto max-h-[280px] m-0"><code class="text-[13px] leading-[1.7] text-foreground/80 whitespace-pre">${colorized}</code></pre></div>`;
      }

      const index = codeBlocks.length;
      codeBlocks.push(block);
      return `<!--codeblock-${index}-->`;
    }
  );

  // Step 1b: Extract ordered list blocks and replace with placeholders
  const olBlocks: string[] = [];
  let step1b = processed.replace(
    /(?:^\d+\.\s+.+$\n?)+/gm,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s+/, ""));

      const cards = items
        .map((item, i) => {
          // Process bold within the item
          const processedItem = item
            .replace(
              /\*\*([^*]+)\*\*/g,
              '<strong class="font-semibold text-foreground">$1</strong>'
            )
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(
              /`([^`]+)`/g,
              '<code class="font-mono bg-secondary/50 text-sf-cloud px-1.5 py-0.5 rounded text-[13px]">$1</code>'
            );

          // Split on — or - to separate title from description
          const emDashSplit = processedItem.split(/\s*—\s*/);
          const hasTitle = emDashSplit.length > 1;

          return `<div class="flex gap-3 p-4 rounded-lg border border-border/40 bg-secondary/20 hover:bg-secondary/30 hover:border-sf-cloud/20 transition-colors"><span class="shrink-0 w-7 h-7 rounded-full bg-sf-cloud/15 text-sf-cloud text-xs font-bold flex items-center justify-center mt-0.5">${i + 1}</span><div class="text-[15px] leading-relaxed">${hasTitle ? `<span class="text-foreground">${emDashSplit[0]}</span><span class="text-foreground/60"> — ${emDashSplit.slice(1).join(" — ")}</span>` : `<span class="text-foreground/80">${processedItem}</span>`}</div></div>`;
        })
        .join("\n");

      const gridCols =
        items.length <= 3
          ? "grid-cols-1"
          : items.length <= 6
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

      const block = `<div class="grid ${gridCols} gap-3 my-6">${cards}</div>`;
      const index = olBlocks.length;
      olBlocks.push(block);
      return `<!--olblock-${index}-->`;
    }
  );

  // Step 2: Process all other markdown (safe — no code block content to corrupt)
  let html = step1b
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="font-mono bg-secondary/50 text-sf-cloud px-1.5 py-0.5 rounded text-[13px]">$1</code>'
    )
    // Headers
    .replace(
      /^### (.+)$/gm,
      (_, title) => {
        const id = slugify(title);
        return `<h3 id="${id}" class="text-base font-semibold tracking-tight text-foreground mt-8 mb-3">${title}</h3>`;
      }
    )
    .replace(
      /^## (.+)$/gm,
      (_, title) => {
        const id = slugify(title);
        const isCallout = CALLOUT_PATTERNS.test(title);

        if (isCallout) {
          return `<div class="mt-10 mb-6"><h2 id="${id}" class="text-lg font-semibold tracking-tight text-sf-cloud pb-2 border-b border-sf-cloud/20">${title}</h2></div>`;
        }
        return `<div class="mt-10 mb-6"><h2 id="${id}" class="text-lg font-semibold tracking-tight text-foreground pb-2 border-b border-border">${title}</h2></div>`;
      }
    )
    .replace(
      /^# (.+)$/gm,
      (_, title) => {
        if (isFirstH1) {
          isFirstH1 = false;
          return "";
        }
        const id = slugify(title);
        return `<h1 id="${id}" class="text-2xl font-bold tracking-tight text-foreground mt-12 mb-5">${title}</h1>`;
      }
    )
    // Bold and italic
    .replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-semibold text-foreground">$1</strong>'
    )
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-sf-cloud hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Blockquotes
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-2 border-sf-cloud/40 pl-4 py-1 my-4 text-foreground/70 text-[15px] italic">$1</blockquote>'
    )
    // Unordered lists
    .replace(
      /^- (.+)$/gm,
      '<li class="text-foreground/80 text-[15px] leading-relaxed ml-5 mb-1.5 list-disc">$1</li>'
    )
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return "<!--separator-->";
      return `<tr>${cells.map((c) => `<td class="border border-border px-3 py-2.5 text-sm text-foreground/80">${c}</td>`).join("")}</tr>`;
    })
    // Horizontal rules
    .replace(/^---$/gm, '')
    // Paragraphs
    .replace(
      /^(?!<[hluotp]|<hr|<pre|<code|<tr|<block|<div|<det|<sum|<!-)(.+)$/gm,
      '<p class="text-foreground/80 text-[15px] leading-[1.7] mb-4">$1</p>'
    );

  // Promote table header rows
  html = html.replace(
    /<tr>([\s\S]*?)<\/tr>\s*<!--separator-->/g,
    (_, headerContent) => {
      const promoted = headerContent
        .replace(
          /<td class="[^"]*">/g,
          '<th class="border border-border px-3 py-2.5 text-sm font-medium text-foreground text-left">'
        )
        .replace(/<\/td>/g, "</th>");
      return `<thead><tr>${promoted}</tr></thead>`;
    }
  );

  html = html.replace(/<!--separator-->/g, "");

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li class="[^"]*list-disc[^"]*">[\s\S]*?<\/li>\s*)+/g,
    '<ul class="my-4">$&</ul>'
  );

  // Wrap table rows
  html = html.replace(
    /((?:<thead>[\s\S]*?<\/thead>\s*)?(?:<tr>[\s\S]*?<\/tr>\s*)+)/g,
    '<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-border rounded-lg striped-table">$&</table></div>'
  );

  // Step 3: Restore placeholders
  html = html.replace(
    /<!--codeblock-(\d+)-->/g,
    (_, index) => codeBlocks[parseInt(index)]
  );
  html = html.replace(
    /<!--olblock-(\d+)-->/g,
    (_, index) => olBlocks[parseInt(index)]
  );

  // Step 4: Wrap h2 sections in collapsible <details> elements
  html = wrapSectionsInDetails(html);

  return html;
}

export function SkillContent({ content }: { content: string }) {
  const html = useMemo(() => parseMarkdown(content), [content]);

  return (
    <>
      <div
        className="skill-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('.copy-code-btn').forEach(btn => {
              btn.addEventListener('click', function() {
                const code = this.dataset.code;
                if (!code) return;
                const decoded = code.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"');
                navigator.clipboard.writeText(decoded);
                const origHTML = this.innerHTML;
                this.innerHTML = '<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Copied';
                this.classList.add('text-green-400');
                setTimeout(() => {
                  this.innerHTML = origHTML;
                  this.classList.remove('text-green-400');
                }, 2000);
              });
            });
          `,
        }}
      />
    </>
  );
}
