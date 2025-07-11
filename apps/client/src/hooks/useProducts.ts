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
