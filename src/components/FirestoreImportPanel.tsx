"use client";

import { useState } from "react";
import {
  dryRunFarmImport,
  dryRunProductImport,
  validateJson,
  writeFarmImport,
  writeProductImport,
} from "@/lib/api-client";

type ImportKind = "farm" | "product";

export function FirestoreImportPanel() {
  const [kind, setKind] = useState<ImportKind>("farm");
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function handleValidate() {
    setLoading(true);
    setResult("");

    try {
      const data = await validateJson(kind, jsonText);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        JSON.stringify({ ok: false, error: String(error) }, null, 2),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDryRunFarmImport() {
    if (kind !== "farm") return;

    setLoading(true);
    setResult("");

    try {
      const data = await dryRunFarmImport(jsonText);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        JSON.stringify({ ok: false, error: String(error) }, null, 2),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleWriteFarmImport() {
    if (kind !== "farm") return;

    setLoading(true);
    setResult("");

    try {
      const data = await writeFarmImport(jsonText);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        JSON.stringify({ ok: false, error: String(error) }, null, 2),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDryRunProductImport() {
    if (kind !== "product") return;

    setLoading(true);
    setResult("");

    try {
      const data = await dryRunProductImport(jsonText);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        JSON.stringify({ ok: false, error: String(error) }, null, 2),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleWriteProductImport() {
    if (kind !== "product") return;

    setLoading(true);
    setResult("");

    try {
      const data = await writeProductImport(jsonText);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        JSON.stringify({ ok: false, error: String(error) }, null, 2),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded border border-slate-200 p-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Firestore Import</h2>
        <p className="text-sm text-gray-600">
          Paste your finished farm or product JSON and validate it before write
          logic is added.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setKind("farm")}
          className={`rounded px-4 py-2 text-sm ${
            kind === "farm"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Farm JSON
        </button>
        <button
          onClick={() => setKind("product")}
          className={`rounded px-4 py-2 text-sm ${
            kind === "product"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Product JSON
        </button>
      </div>

      <textarea
        className="min-h-56 w-full rounded border p-3"
        value={jsonText}
        onChange={e => setJsonText(e.target.value)}
        placeholder={`Paste ${kind} JSON here...`}
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleValidate}
          disabled={loading || !jsonText.trim()}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Working..." : "Validate JSON"}
        </button>

        <button
          onClick={handleDryRunFarmImport}
          disabled={loading || !jsonText.trim() || kind !== "farm"}
          className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Working..." : "Dry Run Farm Import"}
        </button>

        <button
          onClick={handleWriteFarmImport}
          disabled={loading || !jsonText.trim() || kind !== "farm"}
          className="rounded bg-rose-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Working..." : "Write Farm to Firestore"}
        </button>

        <button
          onClick={handleDryRunProductImport}
          disabled={loading || !jsonText.trim() || kind !== "product"}
          className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Working..." : "Dry Run Product Import"}
        </button>

        <button
          onClick={handleWriteProductImport}
          disabled={loading || !jsonText.trim() || kind !== "product"}
          className="rounded bg-rose-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Working..." : "Write Product to Firestore"}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Validation Result</h3>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-900 p-4 text-sm text-slate-100">
          {result || "{}"}
        </pre>
      </div>
    </section>
  );
}
