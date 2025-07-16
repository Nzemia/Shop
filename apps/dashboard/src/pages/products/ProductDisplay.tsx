import { Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductDisplayProps {
  name: string;
  images: string[];
  price: number;
  category: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  isActive?: boolean;
}

export default function ProductDisplay({
  name,
  images,
  price,
  category,
  rating,
  reviews,
  stock,
  isActive = true
}: ProductDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const getStockBadge = () => {
    if (stock === undefined) return null;

    if (stock === 0) {
      return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge variant="secondary" className="text-xs">Low Stock</Badge>;
    }
    return <Badge variant="default" className="text-xs">In Stock</Badge>;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!isActive && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
            {getStockBadge()}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 leading-tight">
              {name}
            </h3>
            <Badge variant="outline" className="text-xs mt-1">
              {category}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            {stock !== undefined && (
              <span className="text-sm text-muted-foreground">
                Stock: {stock}
              </span>
            )}
          </div>

          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center justify-between">
              {renderStars(rating)}
              {reviews !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {reviews} reviews
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
