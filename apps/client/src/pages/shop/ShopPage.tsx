import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const { products, loading } = useProducts();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shop All Products</h2>

      {loading ? (
        <div className="flex justify-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
