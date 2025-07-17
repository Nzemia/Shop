import { useState, useMemo } from "react";
import {
    Loader2,
    Pencil,
    Plus,
    Trash2,
    Search,
    Eye,
    EyeOff,
    Package,
    AlertCircle,
    CheckSquare,
    Square
} from "lucide-react";
import { useProducts } from "./useProducts";
import ProductForm from "./ProductForm";
import ProductStats from "./ProductStats";
import BulkActions from "./BulkActions";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { formatKES } from "../../lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product } from "./productSchema";

export default function ProductsPage() {
    const { products, loading, error, deleteProduct, updateProduct } = useProducts();
    const [editing, setEditing] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    // Get unique categories for filter
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        return uniqueCategories.sort();
    }, [products]);

    // Filter products based on search and filters
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "visible" && product.visibilityStatus === "VISIBLE") ||
                (statusFilter === "hidden" && product.visibilityStatus === "HIDDEN");

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchTerm, categoryFilter, statusFilter]);

    // Pagination
    const {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToPage,
        canGoNext,
        canGoPrevious,
        getPageNumbers
    } = usePagination({
        totalItems: filteredProducts.length,
        itemsPerPage: 10
    });

    // Get current page products
    const currentProducts = useMemo(() => {
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, startIndex, endIndex]);

    // Bulk selection handlers
    const handleSelectProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        setSelectedProducts(currentProducts.map(p => p.id));
    };

    const handleDeselectAll = () => {
        setSelectedProducts([]);
    };

    const handleBulkDelete = async (ids: string[]) => {
        for (const id of ids) {
            await deleteProduct(id);
        }
        setSelectedProducts([]);
    };

    const handleBulkStatusChange = async (ids: string[], visibilityStatus: "VISIBLE" | "HIDDEN") => {
        for (const id of ids) {
            const product = products.find(p => p.id === id);
            if (product) {
                await updateProduct(id, { ...product, visibilityStatus });
            }
        }
        setSelectedProducts([]);
    };

    const handleDelete = async (product: Product) => {
        try {
            await deleteProduct(product.id);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const getStockStatus = (stock: number, availabilityStatus: string) => {
        if (availabilityStatus === "OUT_OF_STOCK") return { label: "Out of Stock", variant: "destructive" as const };
        if (availabilityStatus === "DISCONTINUED") return { label: "Discontinued", variant: "secondary" as const };
        if (stock < 10) return { label: "Low Stock", variant: "secondary" as const };
        return { label: "In Stock", variant: "default" as const };
    };

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center space-y-4 pt-6">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Error Loading Products</h3>
                            <p className="text-sm text-muted-foreground mt-1">{error}</p>
                        </div>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product inventory and details
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditing(null);
                        setOpen(true);
                    }}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Enhanced Stats */}
            <ProductStats products={products} />

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="visible">Visible</SelectItem>
                                <SelectItem value="hidden">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions */}
            <BulkActions
                selectedProducts={selectedProducts}
                products={currentProducts}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkDelete={handleBulkDelete}
                onBulkStatusChange={(ids, status) => handleBulkStatusChange(ids, status as "VISIBLE" | "HIDDEN")}
            />

            {/* Products Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Loading products...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No products found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Get started by adding your first product"}
                            </p>
                            {!searchTerm && categoryFilter === "all" && statusFilter === "all" && (
                                <Button
                                    onClick={() => {
                                        setEditing(null);
                                        setOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Product
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={selectedProducts.length === currentProducts.length ? handleDeselectAll : handleSelectAll}
                                                className="p-1"
                                            >
                                                {selectedProducts.length === currentProducts.length && currentProducts.length > 0 ? (
                                                    <CheckSquare className="h-4 w-4" />
                                                ) : selectedProducts.length > 0 ? (
                                                    <Square className="h-4 w-4 fill-current" />
                                                ) : (
                                                    <Square className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-[100px]">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price (KES)</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentProducts.map((product) => {
                                        const stockStatus = getStockStatus(product.stock, product.availabilityStatus);
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSelectProduct(product.id)}
                                                        className="p-1"
                                                    >
                                                        {selectedProducts.includes(product.id) ? (
                                                            <CheckSquare className="h-4 w-4" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        {product.description && (
                                                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                                {product.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{product.category}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatKES(product.price)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col space-y-1">
                                                        <span className="font-medium">{product.stock}</span>
                                                        <Badge variant={stockStatus.variant} className="text-xs">
                                                            {stockStatus.label}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={product.availabilityStatus === "IN_STOCK" ? "default" : "secondary"}
                                                    >
                                                        {product.availabilityStatus.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {product.visibilityStatus === "VISIBLE" ? (
                                                            <Eye className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        )}
                                                        <span className={product.visibilityStatus === "VISIBLE" ? "text-green-600" : "text-gray-400"}>
                                                            {product.visibilityStatus}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditing(product);
                                                                setOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete "{product.name}"? This action cannot be undone and will permanently remove the product from your inventory.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(product)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete Product
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                getPageNumbers={getPageNumbers}
                totalItems={filteredProducts.length}
                itemsPerPage={10}
                startIndex={startIndex}
                endIndex={endIndex}
            />

            {/* Product Form Modal */}
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