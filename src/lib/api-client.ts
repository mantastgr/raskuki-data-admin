import type { PreviewEnhancement, ProductDraft } from "@/lib/types";

async function postJson<TResponse>(
  url: string,
  body: unknown,
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data as TResponse;
}

export async function generateDraft(text: string): Promise<ProductDraft> {
  const data = await postJson<{ draft: ProductDraft }>("/api/generate-draft", {
    text,
  });
  return data.draft;
}

export async function enhancePreview(
  draft: ProductDraft,
): Promise<PreviewEnhancement> {
  const data = await postJson<{ enhancement: PreviewEnhancement }>(
    "/api/enhance-preview",
    { draft },
  );
  return data.enhancement;
}
