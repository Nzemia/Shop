import {
    Package,
    DollarSign,
    Clock,
    CheckCircle,
    Truck,
    CreditCard,
    Calendar
} from "lucide-react";
import { useOrders } from "./useOrders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

export default function OrdersDashboard() {
    const { stats, recentOrders, statsLoading } = useOrders();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string, type: 'payment' | 'tracking' | 'order') => {
        const variants: Record<string, { variant: any; className?: string }> = {
            // Payment statuses
            PENDING: { variant: "secondary" },
            COMPLETED: { variant: "default", className: "bg-green-500 hover:bg-green-600" },
            FAILED: { variant: "destructive" },
            REFUNDED: { variant: "outline" },

            // Tracking statuses
            CONFIRMED: { variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
            SHIPPED: { variant: "default", className: "bg-orange-500 hover:bg-orange-600" },
            DELIVERED: { variant: "default", className: "bg-green-500 hover:bg-green-600" },

            // Order statuses
            PAID: { variant: "default", className: "bg-green-500 hover:bg-green-600" },
            CANCELED: { variant: "destructive" }
        };

        const config = variants[status] || { variant: "secondary" };

        return (
            <Badge variant={config.variant} className={config.className}>
                {status.toLowerCase()}
            </Badge>
        );
    };

    if (statsLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1" />
                                <Skeleton className="h-3 w-24" />
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
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats.overview.todayOrders} today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.overview.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(stats.overview.thisMonthRevenue)} this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tracking.pending}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.tracking.confirmed} confirmed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tracking.delivered}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.payments.completed} paid orders
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Order Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Order Tracking
                        </CardTitle>
                        <CardDescription>Current status of all orders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Pending</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.tracking.pending}</span>
                                <Badge variant="secondary">pending</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Confirmed</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.tracking.confirmed}</span>
                                <Badge variant="default" className="bg-blue-500">confirmed</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Shipped</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.tracking.shipped}</span>
                                <Badge variant="default" className="bg-orange-500">shipped</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Delivered</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.tracking.delivered}</span>
                                <Badge variant="default" className="bg-green-500">delivered</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Canceled</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.tracking.canceled}</span>
                                <Badge variant="destructive">canceled</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Status
                        </CardTitle>
                        <CardDescription>Payment processing overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Pending</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.payments.pending}</span>
                                <Badge variant="secondary">pending</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Completed</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.payments.completed}</span>
                                <Badge variant="default" className="bg-green-500">completed</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Failed</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.payments.failed}</span>
                                <Badge variant="destructive">failed</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Payment Methods
                        </CardTitle>
                        <CardDescription>Preferred payment options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">M-Pesa</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.paymentMethods.mpesa}</span>
                                <Badge variant="default">M-Pesa</Badge>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Door Delivery</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{stats.paymentMethods.doorDelivery}</span>
                                <Badge variant="outline">Door Delivery</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Recent Orders
                    </CardTitle>
                    <CardDescription>Latest 5 orders placed</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="font-medium">{order.orderNumber}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {order.user.username} • {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                                    {getStatusBadge(order.paymentStatus, 'payment')}
                                    {getStatusBadge(order.trackingStatus, 'tracking')}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}