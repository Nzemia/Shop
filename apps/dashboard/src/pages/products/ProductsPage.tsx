import { useState } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import { useProducts } from "./useProducts";
import ProductForm from "./ProductForm";

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
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Stock</th>
                <th className="text-left p-2">Active</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-b hover:bg-muted/40">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">Ksh {Number(p.price).toFixed(2)}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">{p.isActive ? "Yes" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)}>
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
