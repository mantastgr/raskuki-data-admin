"use client";

import { useState } from "react";
import { ActionButtons } from "@/components/ActionButtons";
import { DescriptionInput } from "@/components/DescriptionInput";
import { PhonePreview } from "@/components/PhonePreview";
import { RawJsonPanel } from "@/components/RawJsonPanel";
import { enhancePreview, generateDraft } from "@/lib/api-client";
import {
  applyEnhancementToDraft,
  insertEmojisInParagraph,
} from "@/lib/description";
import { buildFarmTemplate } from "@/lib/farm-template";
import { buildProductTemplate } from "@/lib/product-template";
import type {
  FarmTemplate,
  PreviewEnhancement,
  ProductDraft,
  ProductTemplate,
} from "@/lib/types";

type GeneratorMode = "farm" | "product";
export default function HomePage() {
  const [mode, setMode] = useState<GeneratorMode>("farm");
  const [appliedDraft, setAppliedDraft] = useState<ProductDraft | null>(null);

  const [enhancement, setEnhancement] = useState<PreviewEnhancement | null>(
    null,
  );

  const [enhancing, setEnhancing] = useState(false);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const draftForPreview = appliedDraft ?? draft;
  const isAppliedPreview = Boolean(appliedDraft);

  async function handleGenerate() {
    setAppliedDraft(null);
    setEnhancement(null);
    setLoading(true);
    setResult("");
    setDraft(null);

    try {
      const generatedDraft = await generateDraft(text);
      setDraft(generatedDraft);
      setResult(JSON.stringify(generatedDraft, null, 2));
    } catch (err) {
      setResult(JSON.stringify({ error: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  async function handleEnhance() {
    if (!draft) return;
    setEnhancing(true);
    try {
      const nextEnhancement = await enhancePreview(draft);
      setEnhancement(nextEnhancement);
    } catch (e) {
      setResult(JSON.stringify({ error: String(e) }, null, 2));
    } finally {
      setEnhancing(false);
    }
  }

  function handleApplyEnhancementToJson() {
    if (!draft || !enhancement) return;
    const nextDraft = applyEnhancementToDraft(draft, enhancement);
    setAppliedDraft(nextDraft);
    setResult(JSON.stringify(nextDraft, null, 2));
  }

  function handleResetToOriginal() {
    if (!draft) return;
    setAppliedDraft(null);
    setResult(JSON.stringify(draft, null, 2));
  }

  function handleBuildTemplateJson() {
    const sourceDraft = appliedDraft ?? draft;
    if (!sourceDraft) return;

    if (mode === "farm") {
      const template: FarmTemplate = buildFarmTemplate(sourceDraft);
      setResult(JSON.stringify(template, null, 2));
      return;
    }

    const template: ProductTemplate = buildProductTemplate(sourceDraft);
    setResult(JSON.stringify(template, null, 2));
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Raskuki Data Admin</h1>
      <p className="text-sm text-gray-600">
        Paste text and generate structured description JSON.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("farm")}
          className={`rounded px-4 py-2 text-sm ${
            mode === "farm"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Farm Mode
        </button>
        <button
          onClick={() => setMode("product")}
          className={`rounded px-4 py-2 text-sm ${
            mode === "product"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Product Mode
        </button>
      </div>

      <DescriptionInput text={text} onChange={setText} />

      <ActionButtons
        loading={loading}
        text={text}
        hasDraft={Boolean(draft)}
        enhancing={enhancing}
        hasEnhancement={Boolean(enhancement)}
        hasAppliedDraft={Boolean(appliedDraft)}
        onGenerate={handleGenerate}
        onEnhance={handleEnhance}
        onApplyAiToJson={handleApplyEnhancementToJson}
        onResetToOriginal={handleResetToOriginal}
        onBuildTemplateJson={handleBuildTemplateJson}
        buildTemplateLabel={
          mode === "farm"
            ? "Build Farm Template JSON"
            : "Build Product Template JSON"
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <RawJsonPanel result={result} />

        <PhonePreview
          draftForPreview={draftForPreview}
          enhancement={enhancement}
          isAppliedPreview={isAppliedPreview}
          insertEmojisInParagraph={insertEmojisInParagraph}
        />
      </div>
    </main>
  );
}
