import { NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(1, "Text is required"),
});

type ProductDescriptionSection =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

const LIST_ITEM_REGEX = /^(?:[-*]|\d+\.)\s+(.+)$/;

function textToSections(text: string): ProductDescriptionSection[] {
  const sections: ProductDescriptionSection[] = [];
  const paragraphLines: string[] = [];
  const listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    sections.push({ type: "paragraph", content: paragraphLines.join(" ") });
    paragraphLines.length = 0;
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    sections.push({ type: "list", items: [...listItems] });
    listItems.length = 0;
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();

    // Blank lines split section groups.
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const listMatch = line.match(LIST_ITEM_REGEX);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return sections;
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const text = parsed.data.text;

  const draft = {
    descriptionLt: {
      title: "",
      sections: textToSections(text),
    },
  };

  return NextResponse.json({ draft });
}
