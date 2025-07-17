import { useState } from "react";
import { Trash2, Eye, EyeOff, Download, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import type { Product } from "./productSchema";

interface BulkActionsProps {
    selectedProducts: string[];
    products: Product[];
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onBulkDelete: (ids: string[]) => Promise<void>;
    onBulkStatusChange: (ids: string[], status: string) => Promise<void>;
}

export default function BulkActions({
    selectedProducts,
    products,
    onSelectAll,
    onDeselectAll,
    onBulkDelete,
    onBulkStatusChange
}: BulkActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const selectedCount = selectedProducts.length;
    const totalCount = products.length;
    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

    const handleBulkDelete = async () => {
        try {
            setIsLoading(true);
            await onBulkDelete(selectedProducts);
            toast.success(`${selectedCount} products deleted successfully`);
        } catch (error) {
            toast.error("Failed to delete products");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkStatusChange = async (status: "VISIBLE" | "HIDDEN") => {
        try {
            setIsLoading(true);
            await onBulkStatusChange(selectedProducts, status);
            toast.success(`${selectedCount} products ${status === "VISIBLE" ? 'made visible' : 'hidden'} successfully`);
        } catch (error) {
            toast.error("Failed to update product status");
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        const selectedProductData = products.filter(p => selectedProducts.includes(p.id));

        const csvHeaders = [
            'ID',
            'Name',
            'Category',
            'Price (KES)',
            'Stock',
            'Availability Status',
            'Visibility Status'
        ];

        const csvData = selectedProductData.map(product => [
            product.id,
            `"${product.name}"`,
            product.category,
            product.price,
            product.stock,
            product.availabilityStatus,
            product.visibilityStatus
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${selectedCount} products to CSV`);
    };

    if (selectedCount === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={isAllSelected ? onDeselectAll : onSelectAll}
                    className="p-1"
                >
                    {isAllSelected ? (
                        <CheckSquare className="h-4 w-4" />
                    ) : isPartiallySelected ? (
                        <Square className="h-4 w-4 fill-current" />
                    ) : (
                        <Square className="h-4 w-4" />
                    )}
                </Button>

                <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                        {selectedCount} selected
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        of {totalCount} products
                    </span>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    disabled={isLoading}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange("VISIBLE")}
                    disabled={isLoading}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Make Visible
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange("HIDDEN")}
                    disabled={isLoading}
                >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isLoading}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete ({selectedCount})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Selected Products</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete {selectedCount} selected products?
                                This action cannot be undone and will permanently remove these products from your inventory.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete {selectedCount} Products
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}