import { NextResponse } from "next/server";
import { z } from "zod";
import { FarmSchema, ProductSchema } from "@/lib/firestore-schemas";

const BodySchema = z.object({
  kind: z.enum(["farm", "product"]),
  jsonText: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = BodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { ok: false, error: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const { kind, jsonText } = parsedBody.data;

  try {
    const json = JSON.parse(jsonText);
    const parsed =
      kind === "farm"
        ? FarmSchema.safeParse(json)
        : ProductSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          kind,
          error: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      kind,
      data: parsed.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Invalid JSON input",
      },
      { status: 400 },
    );
  }
}
