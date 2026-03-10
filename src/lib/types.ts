export const LINK_TYPES = [
  "eshop",
  "facebook",
  "instagram",
  "website",
  "youtube",
] as const;

export type LinkType = (typeof LINK_TYPES)[number];

export const SERVICE_KEYS = [
  "products",
  "delivery",
  "food",
  "education",
  "events",
  "onSite",
] as const;

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
  farmTypes: Array<{ id: string; lt: string; en: string }>;
  locationNameNormalised: string;
  titleNormalised: string;
  descriptionLt: ProductDraft["descriptionLt"];
  coordinates: { latitude: number | null; longitude: number | null };
  fullAddress: string;
  postalCode: string;
  openNow: boolean;
  contact: { email: string; phone: string };
  links: Array<{ type: LinkType; url: string }>;
  images: string[];
  productCategories: Record<string, { lt: string; en: string }>;
  services: {
    products: boolean;
    delivery: boolean;
    food: boolean;
    education: boolean;
    events: boolean;
    onSite: boolean;
    partnerships: boolean;
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
  schemaVersion: 2;
  id: string;
  farmId: string;
  locationNameNormalised: string;
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
  seasonality: {
    isSeasonal: false;
    months: [];
  };
};
