import { z } from "zod";

export const productSchema = z.object({
  name: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_&()]+$/, "Product name contains invalid characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  price: z.number()
    .min(1, "Price must be at least KES 1")
    .max(999999999, "Price must be less than KES 1,000,000,000"),
  category: z.string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters"),
  stock: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock must be less than 1,000,000"),
  images: z.array(z.string().url("Invalid image URL"))
    .max(10, "Maximum 10 images allowed")
    .default([]), // Allow empty array initially
  // Match database schema fields
  availabilityStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "DISCONTINUED"]).default("IN_STOCK"),
  visibilityStatus: z.enum(["VISIBLE", "HIDDEN"]).default("VISIBLE"),
  variants: z.any().optional(), // JSON field
});

export const updateProductSchema = productSchema.partial();

export type Product = z.infer<typeof productSchema> & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFormData = z.infer<typeof productSchema>;

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
  "Food & Beverages",
  "Automotive",
  "Other"
] as const;
