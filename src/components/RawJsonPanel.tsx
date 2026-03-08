"use client";

import { useState } from "react";

type RawJsonPanelProps = {
  result: string;
};

export function RawJsonPanel({ result }: RawJsonPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const valueToCopy = result || "{}";
    await navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">Raw JSON</h2>
        <button
          onClick={handleCopy}
          className="rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-900 p-4 text-sm text-slate-100">
        {result || "{}"}
      </pre>
    </section>
  );
}
