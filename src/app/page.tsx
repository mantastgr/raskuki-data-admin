"use client";

import { useState } from "react";

type ProductDescriptionSection =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

type ProductDraft = {
  descriptionLt: {
    title: string;
    sections: ProductDescriptionSection[];
  };
};

type PreviewEnhancement = {
  sectionEnhancements: Array<{
    emoji: string | null;
    insertions: Array<{
      afterSentence: number;
      emoji: string;
    }> | null;
  }>;
};

function insertEmojisInParagraph(
  content: string,
  insertions:
    | Array<{ afterSentence: number; emoji: string }>
    | null
    | undefined,
): string {
  if (!insertions || insertions.length === 0) {
    return content;
  }

  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return content;
  }

  const insertionsBySentence = new Map<number, string[]>();
  for (const item of insertions) {
    if (item.afterSentence < 1 || item.afterSentence > sentences.length) {
      continue;
    }
    const existing = insertionsBySentence.get(item.afterSentence) ?? [];
    existing.push(item.emoji);
    insertionsBySentence.set(item.afterSentence, existing);
  }

  return sentences
    .map((sentence, i) => {
      const sentenceIndex = i + 1;
      const emojis = insertionsBySentence.get(sentenceIndex);
      return emojis && emojis.length > 0
        ? `${sentence} ${emojis.join(" ")}`
        : sentence;
    })
    .join(" ");
}

function applyEnhancementToDraft(
  baseDraft: ProductDraft,
  ai: PreviewEnhancement,
): ProductDraft {
  return {
    descriptionLt: {
      ...baseDraft.descriptionLt,
      sections: baseDraft.descriptionLt.sections.map((section, index) => {
        const sectionEnhancement = ai.sectionEnhancements[index];

        if (!sectionEnhancement) {
          return section;
        }

        if (section.type === "paragraph") {
          const withMidInsertions = insertEmojisInParagraph(
            section.content,
            sectionEnhancement.insertions,
          );

          const withLeadingEmoji = sectionEnhancement.emoji
            ? `${sectionEnhancement.emoji} ${withMidInsertions}`
            : withMidInsertions;

          return { type: "paragraph", content: withLeadingEmoji };
        }

        if (section.type === "list") {
          if (!sectionEnhancement.emoji) {
            return section;
          }

          return {
            type: "list",
            items: section.items.map((item, itemIndex) =>
              itemIndex === 0 ? `${sectionEnhancement.emoji} ${item}` : item,
            ),
          };
        }

        return section;
      }),
    },
  };
}
export default function HomePage() {
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

      setDraft(data.draft as ProductDraft);
      setResult(JSON.stringify(data.draft, null, 2));
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
      const res = await fetch("/api/enhance-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setEnhancement(data.enhancement);
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
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-medium">Input formatting tips</p>
        <p>Blank line = new paragraph</p>
        <p>
          <code>- item</code>, <code>* item</code>, or <code>1. item</code> =
          list item
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Draft"}
      </button>

      <button
        onClick={handleEnhance}
        disabled={!draft || enhancing}
        className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {enhancing ? "Enhancing..." : "Enhance Preview (AI)"}
      </button>

      <button
        onClick={handleApplyEnhancementToJson}
        disabled={!draft || !enhancement}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Apply AI To JSON
      </button>

      <button
        onClick={handleResetToOriginal}
        disabled={!draft || !appliedDraft}
        className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Reset To Original
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-gray-700">Raw JSON</h2>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-900 p-4 text-sm text-slate-100">
            {result || "{}"}
          </pre>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-gray-700">Phone Preview</h2>
          <div className="max-h-96 overflow-auto rounded border bg-white p-4">
            {!draftForPreview ? (
              <p className="text-sm text-gray-500">
                Generate a draft to see formatted preview.
              </p>
            ) : (
              <article className="space-y-4">
                {draftForPreview.descriptionLt.sections.map(
                  (section, index) => {
                    const sectionEnhancement =
                      enhancement?.sectionEnhancements?.[index];

                    if (section.type === "paragraph") {
                      return (
                        <p
                          key={index}
                          className="whitespace-pre-wrap break-words leading-7 text-gray-800"
                        >
                          {isAppliedPreview
                            ? section.content
                            : `${sectionEnhancement?.emoji ? `${sectionEnhancement.emoji} ` : ""}${insertEmojisInParagraph(
                                section.content,
                                sectionEnhancement?.insertions,
                              )}`}
                        </p>
                      );
                    }

                    return (
                      <ul
                        key={index}
                        className="list-disc space-y-1 pl-5 text-gray-800"
                      >
                        {section.items.map((item, itemIndex) => (
                          <li
                            key={`${index}-${itemIndex}`}
                            className="break-words"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  },
                )}
              </article>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
