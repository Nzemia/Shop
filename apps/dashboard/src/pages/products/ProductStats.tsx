import { Package, Eye, EyeOff, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKES } from "../../lib/currency";
import type { Product } from "./productSchema";

interface ProductStatsProps {
    products: Product[];
}

export default function ProductStats({ products }: ProductStatsProps) {
    const totalProducts = products.length;
    const visibleProducts = products.filter(p => p.visibilityStatus === "VISIBLE").length;
    const inStockProducts = products.filter(p => p.availabilityStatus === "IN_STOCK").length;
    const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.availabilityStatus === "OUT_OF_STOCK").length;

    // Calculate total value and average price with proper number handling
    const totalValue = products.reduce((sum, p) => {
        const price = typeof p.price === 'number' && !isNaN(p.price) ? p.price : 0;
        const stock = typeof p.stock === 'number' && !isNaN(p.stock) ? p.stock : 0;
        return sum + (price * stock);
    }, 0);

    const averagePrice = totalProducts > 0
        ? products.reduce((sum, p) => {
            const price = typeof p.price === 'number' && !isNaN(p.price) ? p.price : 0;
            return sum + price;
        }, 0) / totalProducts
        : 0;

    const stats = [
        {
            title: "Total Products",
            value: totalProducts.toString(),
            icon: Package,
            description: "All products in inventory",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Visible Products",
            value: visibleProducts.toString(),
            icon: Eye,
            description: "Currently visible to customers",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "In Stock",
            value: inStockProducts.toString(),
            icon: Package,
            description: "Products available for sale",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Low Stock Alert",
            value: lowStockProducts.toString(),
            icon: AlertCircle,
            description: "Products with less than 10 units",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Out of Stock",
            value: outOfStockProducts.toString(),
            icon: EyeOff,
            description: "Products that need restocking",
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
        {
            title: "Total Inventory Value",
            value: formatKES(totalValue),
            icon: TrendingUp,
            description: "Total value of all stock in KES",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Average Price",
            value: formatKES(averagePrice),
            icon: TrendingUp,
            description: "Average product price in KES",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}