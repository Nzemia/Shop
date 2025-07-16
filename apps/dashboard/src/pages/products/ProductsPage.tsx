import { useState } from "react";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useProducts } from "./useProducts";
import ProductForm from "./ProductForm";
import ProductDisplay from "./ProductDisplay";

export default function ProductsPage() {
  const { products, loading, deleteProduct } = useProducts();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products?.map((p) => (
            <div key={p.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                  className="bg-white rounded-full p-1 shadow hover:bg-primary hover:text-white transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={async () => {
                    await deleteProduct(p.id);
                    window.setTimeout(() => {
                      // Wait for state update
                      import("sonner").then(({ toast }) => toast.success("Product deleted"));
                    }, 100);
                  }}
                  className="bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
              <ProductDisplay
                name={p.name}
                images={p.images}
                price={p.price}
                category={p.category}
                rating={p.rating}
                reviews={p.reviews}
              />
            </div>
          ))}
        </div>
      )}

      {open && (
        <ProductForm
          initialData={editing}
          onClose={() => {
            setEditing(null);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
