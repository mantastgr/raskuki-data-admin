import { NextResponse } from "next/server";
import { z } from "zod";
import { FarmSchema } from "@/lib/firestore-schemas";
import { db } from "@/lib/firebase-admin";

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
    const parsedFarm = FarmSchema.safeParse(json);

    if (!parsedFarm.success) {
      return NextResponse.json(
        { ok: false, error: parsedFarm.error.flatten() },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();
    const farm = parsedFarm.data;
    const normalizedFarm = {
      ...farm,
      createdAt: farm.createdAt.startsWith("TODO") ? nowIso : farm.createdAt,
      updatedAt: nowIso,
    };

    const locationRef = db
      .collection("locations")
      .doc(normalizedFarm.locationNameNormalised);
    const farmRef = locationRef.collection("farms").doc(normalizedFarm.id);

    await locationRef.set(
      {
        locationNameNormalised: normalizedFarm.locationNameNormalised,
        schemaVersion: 2,
      },
      { merge: true },
    );

    await farmRef.set(normalizedFarm);

    return NextResponse.json({
      ok: true,
      path: `/locations/${normalizedFarm.locationNameNormalised}/farms/${normalizedFarm.id}`,
      data: normalizedFarm,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Write failed",
      },
      { status: 500 },
    );
  }
}
