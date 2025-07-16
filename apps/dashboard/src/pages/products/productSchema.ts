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
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price must be less than $1,000,000"),
  category: z.string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters"),
  stock: z.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock must be less than 1,000,000"),
  images: z.array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
  isActive: z.boolean().default(true),
  rating: z.number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  reviews: z.number()
    .int("Reviews must be a whole number")
    .min(0, "Reviews cannot be negative")
    .optional()
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
