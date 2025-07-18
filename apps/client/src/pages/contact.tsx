import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4">
                        Get In Touch
                    </Badge>
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                            First Name
                                        </label>
                                        <Input id="firstName" placeholder="John" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <Input id="lastName" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                        Subject
                                    </label>
                                    <Input id="subject" placeholder="How can we help?" />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Email</h3>
                                        <p className="text-muted-foreground">support@jengashop.com</p>
                                        <p className="text-muted-foreground">sales@jengashop.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Phone</h3>
                                        <p className="text-muted-foreground">+254 700 000 000</p>
                                        <p className="text-muted-foreground">+254 711 111 111</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Address</h3>
                                        <p className="text-muted-foreground">
                                            123 Business Street<br />
                                            Nairobi, Kenya<br />
                                            00100
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-muted/30 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">How long does shipping take?</p>
                                    <p className="text-muted-foreground">Standard shipping takes 3-5 business days.</p>
                                </div>
                                <div>
                                    <p className="font-medium">What's your return policy?</p>
                                    <p className="text-muted-foreground">30-day returns on most items.</p>
                                </div>
                                <div>
                                    <p className="font-medium">Do you offer international shipping?</p>
                                    <p className="text-muted-foreground">Currently shipping within Kenya only.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}