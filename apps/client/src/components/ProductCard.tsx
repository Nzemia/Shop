import { Link } from "react-router-dom";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <img
        src={product.images?.[0] || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm">{product.category}</p>
        <p className="font-bold text-primary">
          Ksh {Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
