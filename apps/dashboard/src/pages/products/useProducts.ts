import { useEffect, useState } from "react";
import axios from "axios";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get("/api/products");
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const createProduct = async (data: any) => {
    await axios.post("/api/products", {
      ...data,
      images: typeof data.images === "string" ? data.images.split(",") : []
    });
    await fetch();
  };

  const updateProduct = async (id: string, data: any) => {
    await axios.put(`/api/products/${id}`, {
      ...data,
      images: typeof data.images === "string" ? data.images.split(",") : []
    });
    await fetch();
  };

  const deleteProduct = async (id: string) => {
    await axios.delete(`/api/products/${id}`);
    await fetch();
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
