import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Truck, Shield, Headphones } from "lucide-react"

export function HomePage() {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="mb-4">
                        New Collection Available
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Welcome to <span className="text-primary">JengaShop</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Discover amazing products at unbeatable prices. Quality guaranteed,
                        fast delivery, and exceptional customer service.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Shop Now
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Choose JengaShop?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We're committed to providing you with the best shopping experience possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-muted-foreground">
                                Get your orders delivered quickly and safely to your doorstep.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                            <p className="text-muted-foreground">
                                Your personal information and payments are always protected.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                            <p className="text-muted-foreground">
                                Our customer support team is here to help you anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
                        <p className="text-muted-foreground">
                            Check out our most popular items
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-background rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                                <div className="space-y-2">
                                    <h3 className="font-medium">Product Name {item}</h3>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-sm text-muted-foreground">(24)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">Kshs. 1000</span>
                                        <Button size="sm">
                                            <ShoppingCart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            View All Products
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}