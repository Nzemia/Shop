import { useState, useEffect } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    Eye,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Star,
    MessageSquare,
    Truck,
    CreditCard
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
    overview: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        totalUsers: number;
        revenueGrowth: number;
        ordersGrowth: number;
        usersGrowth: number;
    };
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        customerName: string;
        amount: number;
        status: string;
        createdAt: string;
    }>;
    topProducts: Array<{
        id: string;
        name: string;
        sales: number;
        revenue: number;
    }>;
    ordersByStatus: {
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
    };
    paymentMethods: {
        mpesa: number;
        doorDelivery: number;
    };
}

export default function DashboardHome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            // For now, we'll use mock data since we don't have a dashboard stats endpoint
            // In a real app, you'd call: const response = await api.get('/dashboard/stats');

            // Mock data that represents real e-commerce metrics
            const mockStats: DashboardStats = {
                overview: {
                    totalRevenue: 2847650,
                    totalOrders: 1247,
                    totalProducts: 156,
                    totalUsers: 892,
                    revenueGrowth: 12.5,
                    ordersGrowth: 8.3,
                    usersGrowth: 15.7
                },
                recentOrders: [
                    { id: '1', orderNumber: 'ORD-2024-001', customerName: 'John Doe', amount: 15750, status: 'DELIVERED', createdAt: '2024-01-15T10:30:00Z' },
                    { id: '2', orderNumber: 'ORD-2024-002', customerName: 'Jane Smith', amount: 8900, status: 'SHIPPED', createdAt: '2024-01-15T09:15:00Z' },
                    { id: '3', orderNumber: 'ORD-2024-003', customerName: 'Mike Johnson', amount: 23400, status: 'CONFIRMED', createdAt: '2024-01-15T08:45:00Z' },
                    { id: '4', orderNumber: 'ORD-2024-004', customerName: 'Sarah Wilson', amount: 12300, status: 'PENDING', createdAt: '2024-01-15T07:20:00Z' },
                    { id: '5', orderNumber: 'ORD-2024-005', customerName: 'David Brown', amount: 18750, status: 'DELIVERED', createdAt: '2024-01-14T16:30:00Z' }
                ],
                topProducts: [
                    { id: '1', name: 'Premium Headphones', sales: 89, revenue: 445000 },
                    { id: '2', name: 'Wireless Speaker', sales: 67, revenue: 335000 },
                    { id: '3', name: 'Smart Watch', sales: 54, revenue: 270000 },
                    { id: '4', name: 'Phone Case', sales: 123, revenue: 184500 },
                    { id: '5', name: 'Laptop Stand', sales: 45, revenue: 135000 }
                ],
                ordersByStatus: {
                    pending: 23,
                    confirmed: 45,
                    shipped: 67,
                    delivered: 189
                },
                paymentMethods: {
                    mpesa: 78,
                    doorDelivery: 22
                }
            };

            setStats(mockStats);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    // const formatDate = (dateString: string) => {
    //     return new Date(dateString).toLocaleDateString('en-KE', {
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; className?: string }> = {
            PENDING: { variant: "secondary" },
            CONFIRMED: { variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
            SHIPPED: { variant: "default", className: "bg-orange-500 hover:bg-orange-600" },
            DELIVERED: { variant: "default", className: "bg-green-500 hover:bg-green-600" }
        };

        const config = variants[status] || { variant: "secondary" };

        return (
            <Badge variant={config.variant} className={config.className}>
                {status.toLowerCase()}
            </Badge>
        );
    };

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
        );
    };

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? "text-green-600" : "text-red-600";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-4 bg-muted rounded w-20"></div>
                                <div className="h-4 w-4 bg-muted rounded"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening with your JengaShop today
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 days
                    </Button>
                    <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Reports
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.overview.totalRevenue)}</div>
                        <div className="flex items-center gap-1 text-xs">
                            {getGrowthIcon(stats.overview.revenueGrowth)}
                            <span className={getGrowthColor(stats.overview.revenueGrowth)}>
                                {Math.abs(stats.overview.revenueGrowth)}% from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalOrders.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-xs">
                            {getGrowthIcon(stats.overview.ordersGrowth)}
                            <span className={getGrowthColor(stats.overview.ordersGrowth)}>
                                {Math.abs(stats.overview.ordersGrowth)}% from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            Active inventory items
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
                        <div className="flex items-center gap-1 text-xs">
                            {getGrowthIcon(stats.overview.usersGrowth)}
                            <span className={getGrowthColor(stats.overview.usersGrowth)}>
                                {Math.abs(stats.overview.usersGrowth)}% from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Analytics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Order Status
                        </CardTitle>
                        <CardDescription>Current order fulfillment status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Delivered</span>
                                </div>
                                <span className="font-medium">{stats.ordersByStatus.delivered}</span>
                            </div>
                            <Progress value={(stats.ordersByStatus.delivered / (stats.ordersByStatus.delivered + stats.ordersByStatus.shipped + stats.ordersByStatus.confirmed + stats.ordersByStatus.pending)) * 100} className="h-2" />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm">Shipped</span>
                                </div>
                                <span className="font-medium">{stats.ordersByStatus.shipped}</span>
                            </div>
                            <Progress value={(stats.ordersByStatus.shipped / (stats.ordersByStatus.delivered + stats.ordersByStatus.shipped + stats.ordersByStatus.confirmed + stats.ordersByStatus.pending)) * 100} className="h-2" />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Confirmed</span>
                                </div>
                                <span className="font-medium">{stats.ordersByStatus.confirmed}</span>
                            </div>
                            <Progress value={(stats.ordersByStatus.confirmed / (stats.ordersByStatus.delivered + stats.ordersByStatus.shipped + stats.ordersByStatus.confirmed + stats.ordersByStatus.pending)) * 100} className="h-2" />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <span className="text-sm">Pending</span>
                                </div>
                                <span className="font-medium">{stats.ordersByStatus.pending}</span>
                            </div>
                            <Progress value={(stats.ordersByStatus.pending / (stats.ordersByStatus.delivered + stats.ordersByStatus.shipped + stats.ordersByStatus.confirmed + stats.ordersByStatus.pending)) * 100} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Methods
                        </CardTitle>
                        <CardDescription>Customer payment preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <span className="text-sm">M-Pesa</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">{stats.paymentMethods.mpesa}%</span>
                                </div>
                            </div>
                            <Progress value={stats.paymentMethods.mpesa} className="h-2" />

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                                    <span className="text-sm">Door Delivery</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">{stats.paymentMethods.doorDelivery}%</span>
                                </div>
                            </div>
                            <Progress value={stats.paymentMethods.doorDelivery} className="h-2" />
                        </div>

                        <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                                M-Pesa is the preferred payment method
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => navigate('/dashboard/products')}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Add New Product
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => navigate('/dashboard/orders')}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            View All Orders
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => navigate('/dashboard/users')}
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Manage Users
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => navigate('/dashboard/support')}
                        >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Support Tickets
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/orders')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <ShoppingCart className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{order.orderNumber}</p>
                                            <p className="text-xs text-muted-foreground">{order.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">{formatCurrency(order.amount)}</p>
                                        <div className="flex items-center gap-1">
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Top Products</CardTitle>
                            <CardDescription>Best performing products</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/products')}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="text-xs text-muted-foreground">Top seller</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts and Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        System Alerts
                    </CardTitle>
                    <CardDescription>Important notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">
                                    {stats.ordersByStatus.pending} orders pending confirmation
                                </p>
                                <p className="text-xs text-yellow-600">
                                    Review and confirm pending orders to improve customer satisfaction
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate('/dashboard/orders')}>
                                Review
                            </Button>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    System running smoothly
                                </p>
                                <p className="text-xs text-green-600">
                                    All services are operational and performing well
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}