import {
    Package,
    User,
    MapPin,
    Phone,
    Truck,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react";
import type { Order } from "./useOrders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsDialogProps {
    order: Order;
    onClose: () => void;
}

export default function OrderDetailsDialog({ order, onClose }: OrderDetailsDialogProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string, type: 'payment' | 'tracking') => {
        if (type === 'payment') {
            switch (status) {
                case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
                case 'FAILED': return <AlertCircle className="h-4 w-4 text-red-500" />;
                case 'PENDING': return <Clock className="h-4 w-4 text-yellow-500" />;
                default: return <Clock className="h-4 w-4 text-gray-500" />;
            }
        } else {
            switch (status) {
                case 'DELIVERED': return <CheckCircle className="h-4 w-4 text-green-500" />;
                case 'SHIPPED': return <Truck className="h-4 w-4 text-blue-500" />;
                case 'CONFIRMED': return <Package className="h-4 w-4 text-orange-500" />;
                case 'PENDING': return <Clock className="h-4 w-4 text-yellow-500" />;
                default: return <Clock className="h-4 w-4 text-gray-500" />;
            }
        }
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

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Details - {order.orderNumber}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Order Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Order Number:</span>
                                <span className="font-mono">{order.orderNumber}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Amount:</span>
                                <span className="font-semibold text-lg">{formatCurrency(order.totalAmount)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Order Status:</span>
                                {getStatusBadge(order.status, 'order')}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Status:</span>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.paymentStatus, 'payment')}
                                    {getStatusBadge(order.paymentStatus, 'payment')}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Tracking Status:</span>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.trackingStatus, 'tracking')}
                                    {getStatusBadge(order.trackingStatus, 'tracking')}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Method:</span>
                                <Badge variant={order.paymentMethod === "MPESA" ? "default" : "outline"}>
                                    {order.paymentMethod === "MPESA" ? "M-Pesa" : "Door Delivery"}
                                </Badge>
                            </div>

                            {order.mpesaTransactionId && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">M-Pesa ID:</span>
                                    <span className="font-mono text-sm">{order.mpesaTransactionId}</span>
                                </div>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Created:</span>
                                <span className="text-sm">{formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Last Updated:</span>
                                <span className="text-sm">{formatDate(order.updatedAt)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Name:</span>
                                <span>{order.user.username}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Email:</span>
                                <span>{order.user.email}</span>
                            </div>

                            {order.phoneNumber && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Phone:</span>
                                    <span>{order.phoneNumber}</span>
                                </div>
                            )}

                            <Separator />

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm font-medium">Shipping Address</span>
                                </div>
                                <div className="bg-muted p-3 rounded-md space-y-1">
                                    <div className="font-medium">{order.shippingAddress.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.shippingAddress.address}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {order.shippingAddress.city}, {order.shippingAddress.county}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {order.shippingAddress.phone}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>
                                {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} in this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        {item.product.images.length > 0 && (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{formatCurrency(item.price)}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Total: {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Refund Information */}
                    {order.isRefundRequested && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-600">
                                    <AlertCircle className="h-4 w-4" />
                                    Refund Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm">
                                        <strong>Reason:</strong> {order.refundReason}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}