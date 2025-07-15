import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().min(2),
  variants: z.any().optional(),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()),
  availabilityStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "DISCONTINUED"]).default("IN_STOCK"),
  visibilityStatus: z.enum(["VISIBLE", "HIDDEN"]).default("VISIBLE")
});

export const updateProductSchema = productSchema.partial();
