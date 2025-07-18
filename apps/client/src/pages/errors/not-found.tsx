import { Link } from "react-router-dom"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md mx-auto text-center px-4">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                        <Search className="h-16 w-16 text-muted-foreground" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
                    <p className="text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for.
                        It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="flex space-x-2">
                        <Input
                            type="search"
                            placeholder="Search for products..."
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        Popular Pages
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link
                            to="/products"
                            className="text-primary hover:underline"
                        >
                            Products
                        </Link>
                        <Link
                            to="/about"
                            className="text-primary hover:underline"
                        >
                            About Us
                        </Link>
                        <Link
                            to="/contact"
                            className="text-primary hover:underline"
                        >
                            Contact
                        </Link>
                        <Link
                            to="/help"
                            className="text-primary hover:underline"
                        >
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}