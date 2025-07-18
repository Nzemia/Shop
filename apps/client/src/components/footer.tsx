import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Press", href: "/press" },
            { name: "Blog", href: "/blog" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Contact Us", href: "/contact" },
            { name: "Shipping Info", href: "/shipping" },
            { name: "Returns", href: "/returns" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
            { name: "Refund Policy", href: "/refunds" },
        ],
    }

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" },
    ]

    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">J</span>
                            </div>
                            <span className="font-bold text-xl">JengaShop</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Your trusted online marketplace for quality products at great prices.
                            Shop with confidence and enjoy fast, reliable delivery.
                        </p>
                        <div className="flex space-x-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon
                                return (
                                    <Button
                                        key={social.name}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        asChild
                                    >
                                        <a
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">
                            Subscribe to our newsletter for the latest updates and offers.
                        </p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-9"
                            />
                            <Button type="submit" className="w-full h-9">
                                Subscribe
                            </Button>
                        </form>

                        <div className="space-y-2 pt-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>support@jengashop.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+254 700 000 000</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-muted-foreground">
                            © {currentYear} JengaShop. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end space-x-6">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}