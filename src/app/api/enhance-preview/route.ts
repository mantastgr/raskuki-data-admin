import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SectionSchema = z.union([
  z.object({ type: z.literal("paragraph"), content: z.string() }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
]);

const DraftSchema = z.object({
  descriptionLt: z.object({
    title: z.string(),
    sections: z.array(SectionSchema),
  }),
});

const BodySchema = z.object({ draft: DraftSchema });

const AiOutSchema = z.object({
  sectionEnhancements: z.array(
    z.object({
      emoji: z.string().nullable(),
      insertions: z
        .array(
          z.object({
            afterSentence: z.number().int().positive(),
            emoji: z.string(),
          }),
        )
        .nullable(),
    }),
  ),
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const draft = parsed.data.draft;

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You suggest ONLY mellow emoji and line-break positions for readability. Never rewrite or alter content meaning.",
        },
        {
          role: "user",
          content: JSON.stringify({
            sections: draft.descriptionLt.sections,
            rules: [
              "0-1 emoji per section",
              "Use mellow emojis only (nature/farm/community style)",
              "For paragraph sections, optionally return 0-2 emoji insertion points in insertions",
              "Each insertion item: { afterSentence: number, emoji: string } where sentence index starts at 1",
              "Do not rewrite text",
            ],
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "enhancement",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              sectionEnhancements: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    emoji: { type: ["string", "null"] },
                    insertions: {
                      type: ["array", "null"],
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          afterSentence: { type: "integer", minimum: 1 },
                          emoji: { type: "string" },
                        },
                        required: ["afterSentence", "emoji"],
                      },
                    },
                  },
                  required: ["emoji", "insertions"],
                },
              },
            },
            required: ["sectionEnhancements"],
          },
        },
      },
    });

    const outputText = response.output_text?.trim();
    if (!outputText) {
      return NextResponse.json(
        {
          error: "Enhance preview failed",
          details: "OpenAI returned an empty response.",
        },
        { status: 500 },
      );
    }

    const ai = AiOutSchema.parse(JSON.parse(outputText));
    return NextResponse.json({ enhancement: ai });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Enhance preview failed", details },
      { status: 500 },
    );
  }
}
