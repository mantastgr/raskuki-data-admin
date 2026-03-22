import { NextResponse } from "next/server";
import { z } from "zod";
import { ProductSchema } from "@/lib/firestore-schemas";

const BodySchema = z.object({
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

  try {
    const json = JSON.parse(parsedBody.data.jsonText);
    const parsedProduct = ProductSchema.safeParse(json);

    if (!parsedProduct.success) {
      return NextResponse.json(
        { ok: false, error: parsedProduct.error.flatten() },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();
    const product = parsedProduct.data;
    const normalizedProduct = {
      ...product,
      updatedAt: product.updatedAt.startsWith("TODO")
        ? nowIso
        : product.updatedAt,
    };

    return NextResponse.json({
      ok: true,
      path: `/locations/${normalizedProduct.locationNameNormalised}/farms/${normalizedProduct.farmId}/products/${normalizedProduct.id}`,
      data: normalizedProduct,
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
