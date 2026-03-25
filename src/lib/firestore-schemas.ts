import { z } from "zod";
import { LINK_TYPES } from "@/lib/types";

const DescriptionSectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("paragraph"),
    content: z.string().min(1),
  }),
  z.object({
    type: z.literal("heading"),
    content: z.string().min(1),
  }),
  z.object({
    type: z.literal("list"),
    items: z.array(z.string().min(1)).min(1),
  }),
]);

const DescriptionLtSchema = z.object({
  title: z.string(),
  sections: z.array(DescriptionSectionSchema).min(1),
});

const LinkTypeSchema = z.enum(LINK_TYPES);

const FarmTypeSchema = z.object({
  id: z.string().min(1),
  lt: z.string().min(1),
  en: z.string().min(1),
});

const ServicesSchema = z.object({
  products: z.boolean(),
  delivery: z.boolean(),
  food: z.boolean(),
  education: z.boolean(),
  events: z.boolean(),
  onSite: z.boolean(),
  partnerships: z.boolean(),
});

const OpenHoursDaySchema = z
  .object({
    open: z.string().min(1),
    close: z.string().min(1),
  })
  .nullable();

const OpenHoursStructuredSchema = z.object({
  monday: OpenHoursDaySchema,
  tuesday: OpenHoursDaySchema,
  wednesday: OpenHoursDaySchema,
  thursday: OpenHoursDaySchema,
  friday: OpenHoursDaySchema,
  saturday: OpenHoursDaySchema,
  sunday: OpenHoursDaySchema,
});

export const FarmSchema = z.object({
  schemaVersion: z.literal(2),
  id: z.string().min(1),
  title: z.string().min(1),
  farmTypes: z.array(FarmTypeSchema),
  locationNameNormalised: z.string().min(1),
  titleNormalised: z.string().min(1),
  descriptionLt: DescriptionLtSchema,
  coordinates: z.object({
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
  fullAddress: z.string(),
  postalCode: z.string(),
  openNow: z.boolean(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
  }),
  links: z.array(
    z.object({
      type: LinkTypeSchema,
      url: z.string(),
    }),
  ),
  images: z.array(z.string()),
  productCategories: z.record(
    z.string(),
    z.object({
      lt: z.string().min(1),
      en: z.string().min(1),
    }),
  ),
  services: ServicesSchema,
  openHoursStructured: OpenHoursStructuredSchema,
  searchKeywords: z.array(z.string()),
  averageRating: z.number(),
  ratingCount: z.number().int().nonnegative(),
  ratingTotal: z.number().nonnegative(),
  favouritesCount: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  createdBy: z.string().min(1),
  ownerUserId: z.string().min(1),
});

export const ProductSchema = z.object({
  schemaVersion: z.literal(2),
  id: z.string().min(1),
  farmId: z.string().min(1),
  locationNameNormalised: z.string().min(1),
  name: z.string().min(1),
  descriptionLt: DescriptionLtSchema,
  price: z.object({
    amount: z.number().nonnegative(),
    currency: z.string().min(1),
    unit: z.string().min(1),
  }),
  priceOptions: z.array(
    z.object({
      amount: z.number().nonnegative(),
      currency: z.string().min(1),
      quantity: z.number().positive(),
      quantityUnit: z.string().min(1),
    }),
  ),
  categoryIds: z.array(z.string().min(1)),
  isActive: z.boolean(),
  updatedAt: z.string().min(1),
  seasonality: z.object({
    isSeasonal: z.boolean(),
    months: z.array(z.number().int().min(1).max(12)),
  }),
});

export type FirestoreFarm = z.infer<typeof FarmSchema>;
export type FirestoreProduct = z.infer<typeof ProductSchema>;
