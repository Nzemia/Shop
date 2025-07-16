import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional()
});

export const updateProductSchema = productSchema.partial();

export type Product = z.infer<typeof productSchema> & {
  id: string;
};

export type ProductFormData = z.infer<typeof productSchema>;
