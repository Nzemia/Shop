import { Badge } from "@/components/ui/badge"

export function ProductsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                    Coming Soon
                </Badge>
                <h1 className="text-4xl font-bold mb-4">Products</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our product catalog is being prepared. Check back soon for amazing deals and quality products.
                </p>
            </div>
        </div>
    )
}