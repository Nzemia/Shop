import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "./useProducts";
import { productSchema } from "./productSchema";
import ProductImageUploader from "./ProductImageUploader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.input<typeof productSchema>;

export default function ProductForm({
  initialData,
  onClose
}: {
  initialData?: any;
  onClose: () => void;
}) {
  const { createProduct, updateProduct } = useProducts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
      isActive: true
    }
  });

  const images = watch("images") || [];

  const handleImageUpload = (url: string) => {
    setValue("images", [...images, url], { shouldValidate: true });
  };

  const removeImage = (url: string) => {
    setValue("images", images.filter((img: string) => img !== url), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData) {
        await updateProduct(initialData.id, data);
        toast.success("Product updated");
      } else {
        await createProduct(data);
        toast.success("Product created");
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-lg rounded-xl p-8 shadow-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold mb-2">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input {...register("name")}
            id="name"
            placeholder="Product name"
            className={errors.name ? "border-red-500" : ""}
            autoFocus
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            {...register("description")}
            id="description"
            placeholder="Description (optional)"
            className="w-full min-h-[64px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              {...register("price", { valueAsNumber: true })}
              id="price"
              type="number"
              min={0}
              step={0.01}
              placeholder="Price"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              {...register("category")}
              id="category"
              placeholder="Category"
              className={errors.category ? "border-red-500" : ""}
            />
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              {...register("stock", { valueAsNumber: true })}
              id="stock"
              type="number"
              min={0}
              placeholder="Stock"
              className={errors.stock ? "border-red-500" : ""}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2 flex items-center gap-2 mt-6 md:mt-0">
            <Label htmlFor="isActive" className="mr-2">Active</Label>
            <input
              {...register("isActive")}
              id="isActive"
              type="checkbox"
              className="w-5 h-5 accent-primary"
            />
          </div>
        </div>

        <ProductImageUploader onUpload={handleImageUpload} disabled={isSubmitting} />
        {errors.images && (
          <p className="text-red-500 text-xs mb-2">{errors.images.message as string}</p>
        )}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-2">
            {images.map((img: string, i: number) => (
              <div key={i} className="relative group w-20 h-20">
                <img
                  src={img}
                  alt={`Product image ${i+1}`}
                  className="object-cover w-20 h-20 rounded shadow border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full px-1 py-0.5 text-xs text-red-600 shadow group-hover:opacity-100 opacity-0 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
