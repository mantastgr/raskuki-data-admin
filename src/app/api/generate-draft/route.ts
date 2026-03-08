import { NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(1, "Text is required"),
});

type ProductDescriptionSection =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

function textToSections(text: string): ProductDescriptionSection[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const listItems = lines
    .filter((l) => l.startsWith("- ") || l.startsWith("* "))
    .map((l) => l.replace(/^[-*]\s+/, "").trim());

  const paragraphLines = lines.filter(
    (l) => !l.startsWith("- ") && !l.startsWith("* "),
  );

  const sections: ProductDescriptionSection[] = [];
  if (paragraphLines.length > 0) {
    sections.push({ type: "paragraph", content: paragraphLines.join(" ") });
  }
  if (listItems.length > 0) {
    sections.push({ type: "list", items: listItems });
  }
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
  const firstLine =
    text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? "Draft title";

  const draft = {
    descriptionLt: {
      title: firstLine.slice(0, 120),
      sections: textToSections(text),
    },
  };

  return NextResponse.json({ draft });
}
