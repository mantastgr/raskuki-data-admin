type ProductDescriptionSection =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

export type ProductDraft = {
  descriptionLt: {
    title: string;
    sections: ProductDescriptionSection[];
  };
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

export function buildFarmTemplate(draft: ProductDraft): FarmTemplate {
  return {
    schemaVersion: 2,
    id: "TODO",
    title: "TODO",
    locationNameNormalised: "TODO",
    titleNormalised: "TODO",
    descriptionLt: draft.descriptionLt,
    coordinates: { latitude: null, longitude: null },
    fullAddress: "TODO",
    postalCode: "TODO",
    openNow: false,
    contact: { email: "TODO", phone: "TODO" },
    links: [
      { type: "eshop", url: "TODO" },
      { type: "facebook", url: "TODO" },
      { type: "instagram", url: "TODO" },
      { type: "website", url: "TODO" },
      { type: "youtube", url: "TODO" },
    ],
    images: [],
    productCategories: {},
    services: {
      products: true,
      delivery: false,
      food: false,
      education: false,
      events: false,
      onSite: false,
    },
    openHoursStructured: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    searchKeywords: [],
    averageRating: 0,
    ratingCount: 0,
    ratingTotal: 0,
    favouritesCount: 0,
    createdAt: "TODO",
    updatedAt: "TODO",
    createdBy: "TODO",
    ownerUserId: "TODO",
  };
}
