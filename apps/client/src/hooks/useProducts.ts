import { useEffect, useState } from "react";
import axios from "axios";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
};
