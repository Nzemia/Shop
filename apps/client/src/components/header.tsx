import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, Search, ShoppingCart, User, LogOut } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/lib/auth-store"

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const { user, isAuthenticated, logout, verifyAuth } = useAuthStore()

    // Mock data - replace with actual cart state management
    const cartItemsCount = 3

    useEffect(() => {
        // Verify auth on component mount
        verifyAuth()
    }, [verifyAuth])

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/')
    }

    const navigationItems = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle search logic here
        console.log("Searching for:", searchQuery)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">J</span>
                        </div>
                        <span className="font-bold text-xl">JengaShop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-8">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4"
                            />
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Search Button - Mobile/Tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemsCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {cartItemsCount}
                                </Badge>
                            )}
                        </Button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Profile Dropdown */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                                            <AvatarFallback>
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">Hello, {user?.username}!</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" size="icon" asChild>
                                <Link to="/login">
                                    <User className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-4 mt-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Menu</h2>
                                    </div>

                                    {/* Mobile Search */}
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4"
                                        />
                                    </form>

                                    {/* Mobile Navigation */}
                                    <nav className="flex flex-col space-y-2">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* Mobile Auth Actions */}
                                    <div className="pt-4 border-t">
                                        {isAuthenticated ? (
                                            <div className="space-y-2">
                                                <div className="px-3 py-2 text-sm">
                                                    <p className="font-medium">Hello, {user?.username}!</p>
                                                    <p className="text-muted-foreground truncate">{user?.email}</p>
                                                </div>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    <User className="mr-2 h-4 w-4" />
                                                    Profile
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    Orders
                                                </Button>
                                                <Button variant="outline" className="w-full" onClick={handleLogout}>
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign out
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Button className="w-full" asChild>
                                                    <Link to="/login">Sign in</Link>
                                                </Button>
                                                <Button variant="outline" className="w-full" asChild>
                                                    <Link to="/register">Sign up</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="lg:hidden py-4 border-t">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4"
                                autoFocus
                            />
                        </form>
                    </div>
                )}
            </div>
        </header>
    )
}