import type { ProductDraft, ProductTemplate } from "@/lib/types";

export function buildProductTemplate(draft: ProductDraft): ProductTemplate {
  return {
    schemaVersion: 2,
    id: "TODO",
    farmId: "TODO",
    locationNameNormalised: "TODO",
    name: "TODO",
    descriptionLt: {
      title: "",
      sections: draft.descriptionLt.sections,
    },
    price: {
      amount: 0,
      currency: "EUR",
      unit: "vnt",
    },
    priceOptions: [],
    categoryIds: [],
    isActive: true,
    updatedAt: "TODO_ISO_TIMESTAMP",
    seasonality: {
      isSeasonal: false,
      months: [],
    },
  };
}
