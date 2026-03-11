import type { PreviewEnhancement, ProductDraft } from "@/lib/types";

type PhonePreviewProps = {
  draftForPreview: ProductDraft | null;
  enhancement: PreviewEnhancement | null;
  isAppliedPreview: boolean;
  insertEmojisInParagraph: (
    content: string,
    insertions:
      | Array<{ afterSentence: number; emoji: string }>
      | null
      | undefined,
  ) => string;
};

export function PhonePreview({
  draftForPreview,
  enhancement,
  isAppliedPreview,
  insertEmojisInParagraph,
}: PhonePreviewProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-700">Phone Preview</h2>
      <div className="max-h-96 overflow-auto rounded border bg-white p-4">
        {!draftForPreview ? (
          <p className="text-sm text-gray-500">
            Generate a draft to see formatted preview.
          </p>
        ) : (
          <article className="space-y-4">
            {draftForPreview.descriptionLt.sections.map((section, index) => {
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

              if (section.type === "heading") {
                return (
                  <h4
                    key={index}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {section.content}
                  </h4>
                );
              }

              return (
                <ul key={index} className="list-disc space-y-1 pl-5 text-gray-800">
                  {section.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            })}
          </article>
        )}
      </div>
    </section>
  );
}
