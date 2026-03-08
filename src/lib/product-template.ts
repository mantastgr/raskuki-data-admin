import type { ProductDraft, ProductTemplate } from "@/lib/types";

export function buildProductTemplate(draft: ProductDraft): ProductTemplate {
  return {
    id: "TODO",
    farmId: "TODO",
    name: "TODO",
    descriptionLt: {
      title: "",
      sections: draft.descriptionLt.sections,
    },
    price: {
      amount: "TODO",
      currency: "EUR",
      unit: "vnt",
    },
    categoryIds: [],
    isActive: true,
    updatedAt: "TODO",
  };
}
