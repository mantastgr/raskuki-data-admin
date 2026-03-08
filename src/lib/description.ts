import type { PreviewEnhancement, ProductDraft } from "@/lib/types";

export function insertEmojisInParagraph(
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

export function applyEnhancementToDraft(
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
