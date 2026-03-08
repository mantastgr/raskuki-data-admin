export type ProductDescriptionSection =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

export type ProductDraft = {
  descriptionLt: {
    title: string;
    sections: ProductDescriptionSection[];
  };
};

export type PreviewEnhancement = {
  sectionEnhancements: Array<{
    emoji: string | null;
    insertions: Array<{
      afterSentence: number;
      emoji: string;
    }> | null;
  }>;
};

export type FarmTemplate = {
  schemaVersion: 2;
  id: string;
  title: string;
  locationNameNormalised: string;
  titleNormalised: string;
  descriptionLt: ProductDraft["descriptionLt"];
  coordinates: { latitude: number | null; longitude: number | null };
  fullAddress: string;
  postalCode: string;
  openNow: boolean;
  contact: { email: string; phone: string };
  links: Array<{ type: string; url: string }>;
  images: string[];
  productCategories: Record<string, { lt: string; en: string }>;
  services: {
    products: boolean;
    delivery: boolean;
    food: boolean;
    education: boolean;
    events: boolean;
    onSite: boolean;
  };
  openHoursStructured: Record<string, { open: string; close: string } | null>;
  searchKeywords: string[];
  averageRating: number;
  ratingCount: number;
  ratingTotal: number;
  favouritesCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  ownerUserId: string;
};

export type ProductTemplate = {
  id: string;
  farmId: string;
  name: string;
  descriptionLt: ProductDraft["descriptionLt"];
  price: {
    amount: string;
    currency: string;
    unit: string;
  };
  categoryIds: string[];
  isActive: boolean;
  updatedAt: string;
};
