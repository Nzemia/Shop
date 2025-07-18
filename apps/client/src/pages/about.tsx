import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Heart } from "lucide-react"

export function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4">
                        About JengaShop
                    </Badge>
                    <h1 className="text-4xl font-bold mb-6">Our Story</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We're passionate about bringing you the best products at unbeatable prices,
                        with exceptional service that puts you first.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground">
                            To provide high-quality products and exceptional customer service,
                            making online shopping convenient, reliable, and enjoyable for everyone.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                        <p className="text-muted-foreground">
                            To become the most trusted online marketplace in Kenya,
                            known for quality products, fair prices, and outstanding customer care.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Award className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                            <p className="text-muted-foreground">
                                We carefully curate our products to ensure you receive only the best quality items.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Customer Focused</h3>
                            <p className="text-muted-foreground">
                                Your satisfaction is our priority. We're here to help every step of the way.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Trust & Integrity</h3>
                            <p className="text-muted-foreground">
                                We believe in honest business practices and building lasting relationships.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="text-center bg-muted/30 rounded-lg p-12">
                    <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We're a dedicated team of professionals committed to making your shopping experience exceptional.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        Team profiles coming soon...
                    </div>
                </div>
            </div>
        </div>
    )
}