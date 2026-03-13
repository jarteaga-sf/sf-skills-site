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
const COLLAPSIBLE_PATTERNS = /^(Scoring Rubric|Scoring Guide|Cross-Skill Integration|Dependencies)/i;

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

function parseMarkdown(md: string): string {
  let isFirstH1 = true;

  // Step 1: Extract code blocks and replace with placeholders to protect them
  const codeBlocks: string[] = [];
  const processed = md.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const escaped = escapeHtml(code);
      const rawForCopy = escapeHtml(code).replace(/"/g, "&quot;");

      let block: string;
      if (!lang && isAsciiDiagram(code)) {
        block = `<div class="diagram-block my-6 bg-secondary/30 border border-border rounded-lg p-4 overflow-x-auto"><pre class="font-mono text-[13px] leading-snug text-sf-cloud/80 whitespace-pre">${escaped}</pre></div>`;
      } else {
        const displayLang = LANG_LABELS[lang] || (lang ? lang.toUpperCase() : "Code");
        block = `<div class="terminal-window my-6 rounded-lg border border-border overflow-hidden group/code"><div class="terminal-titlebar flex items-center gap-2 px-3 py-1.5 bg-[#0c1e33] border-b border-border"><div class="flex gap-1.5"><span class="w-2 h-2 rounded-full bg-[#ff5f57]/60"></span><span class="w-2 h-2 rounded-full bg-[#febc2e]/60"></span><span class="w-2 h-2 rounded-full bg-[#28c840]/60"></span></div><span class="text-[10px] font-mono text-muted-foreground/40 ml-1">${displayLang}</span><button class="copy-code-btn ml-auto opacity-0 group-hover/code:opacity-100 transition-opacity bg-secondary/60 border border-border rounded px-1.5 py-0.5 cursor-pointer flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground" data-code="${rawForCopy}"><svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</button></div><pre class="font-mono bg-[#060f1d] px-4 py-3 overflow-x-auto m-0"><code class="text-[13px] leading-snug text-foreground/90 whitespace-pre">${escaped}</code></pre></div>`;
      }

      const index = codeBlocks.length;
      codeBlocks.push(block);
      return `<!--codeblock-${index}-->`;
    }
  );

  // Step 2: Process all other markdown (safe — no code block content to corrupt)
  let html = processed
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
        const isCollapsible = COLLAPSIBLE_PATTERNS.test(title);

        if (isCollapsible) {
          return `<details class="collapsible-section my-8 border border-border rounded-lg"><summary class="px-4 py-3 text-base font-semibold tracking-tight text-foreground cursor-pointer list-none flex items-center gap-2 hover:text-sf-cloud transition-colors"><svg class="h-4 w-4 text-muted-foreground transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>${title}</summary><div id="${id}" class="px-4 pb-4 border-t border-border pt-3">`;
        }
        if (isCallout) {
          return `<h2 id="${id}" class="callout-heading text-xl font-semibold tracking-tight text-foreground mt-12 mb-0">${title}</h2><!--callout-start-->`;
        }
        return `<div class="section-divider mt-14 mb-6"><h2 id="${id}" class="text-xl font-semibold tracking-tight text-foreground pb-2 border-b border-border">${title}</h2></div>`;
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
    // Ordered lists
    .replace(
      /^\d+\. (.+)$/gm,
      '<li class="text-foreground/80 text-[15px] leading-relaxed ml-5 mb-1.5 list-decimal">$1</li>'
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
    .replace(/^---$/gm, '<hr class="border-border my-8" />')
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

  // Wrap consecutive <li> in <ul>/<ol>
  html = html.replace(
    /(<li class="[^"]*list-disc[^"]*">[\s\S]*?<\/li>\s*)+/g,
    '<ul class="my-4">$&</ul>'
  );
  html = html.replace(
    /(<li class="[^"]*list-decimal[^"]*">[\s\S]*?<\/li>\s*)+/g,
    '<ol class="my-4">$&</ol>'
  );

  // Wrap table rows
  html = html.replace(
    /((?:<thead>[\s\S]*?<\/thead>\s*)?(?:<tr>[\s\S]*?<\/tr>\s*)+)/g,
    '<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-border rounded-lg striped-table">$&</table></div>'
  );

  // Wrap callout sections
  html = html.replace(
    /<!--callout-start-->([\s\S]*?)(?=<div class="section-divider|<hr |<details |$)/g,
    '<div class="callout-block border-l-2 border-sf-cloud/60 bg-sf-cloud/5 rounded-r-lg pl-5 pr-4 py-4 mt-4 mb-8">$1</div>'
  );

  // Close unclosed collapsible sections
  html = html.replace(
    /(<details class="collapsible-section[^>]*>[\s\S]*?<div[^>]*>)([\s\S]*?)(?=<div class="section-divider|<details class="collapsible|$)/g,
    "$1$2</div></details>"
  );

  // Step 3: Restore code blocks from placeholders
  html = html.replace(
    /<!--codeblock-(\d+)-->/g,
    (_, index) => codeBlocks[parseInt(index)]
  );

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
            document.querySelectorAll('.collapsible-section').forEach(d => {
              d.addEventListener('toggle', function() {
                const svg = this.querySelector('summary svg');
                if (this.open) svg.style.transform = 'rotate(90deg)';
                else svg.style.transform = '';
              });
            });
          `,
        }}
      />
    </>
  );
}
