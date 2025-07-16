import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { Product, ProductFormData } from "./productSchema";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (data: ProductFormData) => Promise<void>;
  updateProduct: (id: string, data: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: ProductFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        images: Array.isArray(data.images) ? data.images : []
      };

      await axios.post("/api/products", payload);
      await fetchProducts();
      toast.success("Product created successfully!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create product";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: string, data: ProductFormData): Promise<void> => {
    try {
      const payload = {
        ...data,
        images: Array.isArray(data.images) ? data.images : []
      };

      await axios.put(`/api/products/${id}`, payload);
      await fetchProducts();
      toast.success("Product updated successfully!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update product";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/products/${id}`);
      await fetchProducts();
      toast.success("Product deleted successfully!");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete product";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
