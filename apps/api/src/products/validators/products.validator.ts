import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  category: z.string().min(2),
  variants: z.any().optional(), // Can use JSON.stringify on frontend
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()),
  isActive: z.boolean().default(true)
});

export const updateProductSchema = productSchema.partial();
