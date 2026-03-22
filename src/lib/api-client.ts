import type { PreviewEnhancement, ProductDraft } from "@/lib/types";

type ValidationKind = "farm" | "product";

type ValidationResponse = {
  ok: boolean;
  kind?: ValidationKind;
  data?: unknown;
  error?: unknown;
};

type DryRunFarmImportResponse = {
  ok: boolean;
  path?: string;
  data?: unknown;
  error?: unknown;
};

type WriteFarmImportResponse = {
  ok: boolean;
  path?: string;
  data?: unknown;
  error?: unknown;
};

type DryRunProductImportResponse = {
  ok: boolean;
  path?: string;
  data?: unknown;
  error?: unknown;
};

type WriteProductImportResponse = {
  ok: boolean;
  path?: string;
  data?: unknown;
  error?: unknown;
};

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

export async function validateJson(
  kind: ValidationKind,
  jsonText: string,
): Promise<ValidationResponse> {
  return postJson<ValidationResponse>("/api/validate-json", {
    kind,
    jsonText,
  });
}

export async function dryRunFarmImport(
  jsonText: string,
): Promise<DryRunFarmImportResponse> {
  return postJson<DryRunFarmImportResponse>("/api/import-farm/dry-run", {
    jsonText,
  });
}

export async function writeFarmImport(
  jsonText: string,
): Promise<WriteFarmImportResponse> {
  return postJson<WriteFarmImportResponse>("/api/import-farm/write", {
    jsonText,
  });
}

export async function dryRunProductImport(
  jsonText: string,
): Promise<DryRunProductImportResponse> {
  return postJson<DryRunProductImportResponse>("/api/import-product/dry-run", {
    jsonText,
  });
}

export async function writeProductImport(
  jsonText: string,
): Promise<WriteProductImportResponse> {
  return postJson<WriteProductImportResponse>("/api/import-product/write", {
    jsonText,
  });
}
