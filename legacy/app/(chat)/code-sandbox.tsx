"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeSandboxProps {
  code: string;
  language: string;
}

export default function CodeSandbox({ code, language }: CodeSandboxProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border shadow-sm overflow-hidden my-4 bg-slate-900 text-slate-50">
      {/* Header with Language */}
      <div className="flex items-center justify-between p-3 bg-slate-800 text-slate-200">
        <span className="font-medium text-sm capitalize">
          {language} Example
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 gap-1 text-slate-200 hover:text-white hover:bg-slate-700"
        >
          <Copy size={14} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Code Section */}
      <div className="p-4 font-mono text-sm overflow-auto max-h-[400px]">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}
