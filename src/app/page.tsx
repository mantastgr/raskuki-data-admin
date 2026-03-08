"use client";

import { useState } from "react";

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult(JSON.stringify(data, null, 2));
        return;
      }

      setResult(JSON.stringify(data.draft, null, 2));
    } catch (err) {
      setResult(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Raskuki Data Admin</h1>
      <p className="text-sm text-gray-600">
        Paste text and generate a product draft JSON.
      </p>

      <textarea
        className="w-full min-h-48 rounded border p-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste farmer/product text here..."
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Draft"}
      </button>

      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-900 p-4 text-sm text-slate-100">
        {result || "{}"}
      </pre>
    </main>
  );
}
