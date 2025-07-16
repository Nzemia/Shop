import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "./useProducts";
import { productSchema, PRODUCT_CATEGORIES } from "./productSchema";
import type { ProductFormData } from "./productSchema";
import ProductImageUploader from "./ProductImageUploader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2, DollarSign, Package, Star } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  onClose: () => void;
}

export default function ProductForm({ initialData, onClose }: ProductFormProps) {
  const { createProduct, updateProduct } = useProducts();
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
      isActive: true,
      rating: undefined,
      reviews: undefined
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = form;

  const watchedValues = watch();
  const images = watch("images") || [];

  const handleImageUpload = (url: string) => {
    const currentImages = images || [];
    setValue("images", [...currentImages, url], { shouldValidate: true });
    toast.dismiss("upload-progress");
  };

  const removeImage = (url: string) => {
    setValue("images", images.filter((img: string) => img !== url), { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    try {
      const formData: ProductFormData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        images: data.images,
        isActive: data.isActive ?? true,
        rating: data.rating,
        reviews: data.reviews
      };

      if (isEditing) {
        await updateProduct(initialData.id, formData);
      } else {
        await createProduct(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    if (isDirty && !isSubmitting) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      {...register("name")}
                      id="name"
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={watchedValues.category}
                      onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{String(errors.category.message)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...register("description")}
                    id="description"
                    placeholder="Enter product description (optional)"
                    className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {errors.description && (
                      <span className="text-red-500">{String(errors.description.message)}</span>
                    )}
                    <span className="ml-auto">
                      {watchedValues.description?.length || 0}/500
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing & Inventory</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      {...register("price", { valueAsNumber: true })}
                      id="price"
                      type="number"
                      min={0.01}
                      step={0.01}
                      placeholder="0.00"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">{String(errors.price.message)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      {...register("stock", { valueAsNumber: true })}
                      id="stock"
                      type="number"
                      min={0}
                      placeholder="0"
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm">{String(errors.stock.message)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={watchedValues.isActive}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                    id="isActive"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Product is active and visible to customers
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductImageUploader
                  onUpload={handleImageUpload}
                  onRemoveImage={removeImage}
                  images={images}
                  disabled={isSubmitting}
                  maxImages={5}
                />
                {errors.images && (
                  <p className="text-red-500 text-sm mt-2">{String(errors.images.message)}</p>
                )}
              </CardContent>
            </Card>

            {/* Reviews & Rating (for editing existing products) */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Reviews & Rating</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Average Rating (0-5)</Label>
                      <Input
                        {...register("rating", { valueAsNumber: true })}
                        id="rating"
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        placeholder="0.0"
                        className={errors.rating ? "border-red-500" : ""}
                      />
                      {errors.rating && (
                        <p className="text-red-500 text-sm">{String(errors.rating.message)}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviews">Number of Reviews</Label>
                      <Input
                        {...register("reviews", { valueAsNumber: true })}
                        id="reviews"
                        type="number"
                        min={0}
                        placeholder="0"
                        className={errors.reviews ? "border-red-500" : ""}
                      />
                      {errors.reviews && (
                        <p className="text-red-500 text-sm">{String(errors.reviews.message)}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Product" : "Create Product"}</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
