"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function InstallCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={`group flex items-center gap-3 w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 font-mono text-sm hover:border-sf-cloud/40 transition-colors cursor-pointer text-left ${className || ""}`}
    >
      <span className="text-sf-cloud shrink-0">$</span>
      <span className="text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0">{command}</span>
      <span className="shrink-0 border-l border-border pl-3">
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </span>
    </button>
  );
}
