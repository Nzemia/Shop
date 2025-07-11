import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "./useProducts";
import { productSchema } from "./productSchema";

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
    formState: { errors }
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

  const onSubmit = async (data: FormData) => {
    if (initialData) {
      await updateProduct(initialData.id, data);
    } else {
      await createProduct(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background w-full max-w-lg rounded-xl p-6 shadow-lg space-y-4"
      >
        <h2 className="text-lg font-bold">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>

        <input
          {...register("name")}
          placeholder="Name"
          className="w-full input"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full input"
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}

        <input
          {...register("price", { valueAsNumber: true })}
          type="number"
          placeholder="Price"
          className="w-full input"
        />
        {errors.price && (
          <p className="text-red-500 text-xs">{errors.price.message}</p>
        )}

        <input
          {...register("category")}
          placeholder="Category"
          className="w-full input"
        />
        {errors.category && (
          <p className="text-red-500 text-xs">{errors.category.message}</p>
        )}

        <input
          {...register("stock", { valueAsNumber: true })}
          type="number"
          placeholder="Stock"
          className="w-full input"
        />
        {errors.stock && (
          <p className="text-red-500 text-xs">{errors.stock.message}</p>
        )}

        <input
          {...register("images")}
          placeholder="Comma-separated image URLs"
          className="w-full input"
        />
        {errors.images && (
          <p className="text-red-500 text-xs">{errors.images.message}</p>
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} />
          Active
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-muted">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
