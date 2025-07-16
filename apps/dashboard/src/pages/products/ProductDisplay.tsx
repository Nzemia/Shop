interface ProductDisplayProps {
  name: string;
  images: string[];
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function ProductDisplay({ name, images, price, category, rating, reviews }: ProductDisplayProps) {
  return (
    <div className="rounded-lg shadow-md bg-white p-4 flex flex-col gap-2 hover:shadow-lg transition">
      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={name}
            className="object-cover w-full h-48 rounded"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <span className="text-primary font-bold text-xl">${price.toFixed(2)}</span>
        <span className="text-sm text-gray-500">{category}</span>
        {rating !== undefined && (
          <span className="text-yellow-500 text-sm">Rating: {rating} ⭐ ({reviews ?? 0} reviews)</span>
        )}
      </div>
    </div>
  );
}
