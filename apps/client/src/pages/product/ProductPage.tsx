import { useParams } from "react-router-dom";
import { useCart } from "../../store/cartStore";
import { useState } from "react";
import { useProduct } from "../../hooks/useProducts";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(id!);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: qty
    });
    alert("Added to cart!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 mt-10">
      <img
        src={product.images?.[0] || "https://via.placeholder.com/400"}
        alt={product.name}
        className="w-full rounded-lg object-cover h-96"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">{product.category}</p>
        <p className="text-primary text-xl font-semibold">
          Ksh {Number(product.price).toFixed(2)}
        </p>
        <p>{product.description}</p>

        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="input w-20"
          />
          <button className="btn-primary" onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
