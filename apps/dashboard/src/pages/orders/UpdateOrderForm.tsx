import { useState } from "react";
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign
} from "lucide-react";
import { useOrders, type Order } from "./useOrders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

interface UpdateOrderFormProps {
  order: Order;
  onClose: () => void;
}

export default function UpdateOrderForm({ order, onClose }: UpdateOrderFormProps) {
  const {
    updateOrderStatus,
    markPaymentCompleted,
    markPaymentFailed,
    initiateMpesaPayment,
    queryMpesaPayment
  } = useOrders();

  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingStatus, setTrackingStatus] = useState(order.trackingStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updates: any = {};

    if (orderStatus !== order.status) updates.status = orderStatus;
    if (paymentStatus !== order.paymentStatus) updates.paymentStatus = paymentStatus;
    if (trackingStatus !== order.trackingStatus) updates.trackingStatus = trackingStatus;

    if (Object.keys(updates).length === 0) {
      toast.info("No changes to save");
      setLoading(false);
      return;
    }

    const success = await updateOrderStatus(order.id, updates);

    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const handleMarkPaymentCompleted = async () => {
    setLoading(true);
    const success = await markPaymentCompleted(order.id);
    setLoading(false);
    if (success) {
      setPaymentStatus("COMPLETED");
      setOrderStatus("PAID");
    }
  };

  const handleMarkPaymentFailed = async () => {
    setLoading(true);
    const success = await markPaymentFailed(order.id);
    setLoading(false);
    if (success) {
      setPaymentStatus("FAILED");
    }
  };

  const handleInitiateMpesa = async () => {
    setLoading(true);
    const result = await initiateMpesaPayment(order.id);
    setLoading(false);
    if (result) {
      toast.success("M-Pesa payment initiated successfully");
    }
  };

  const handleQueryMpesa = async () => {
    setLoading(true);
    const result = await queryMpesaPayment(order.id);
    setLoading(false);
    if (result) {
      toast.info(`M-Pesa Status: ${result.ResultDesc || 'Query completed'}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Update Order - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
              <CardDescription>
                Customer: {order.user.username} • {formatCurrency(order.totalAmount)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Order Status</div>
                  {getStatusBadge(order.status, 'order')}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Payment Status</div>
                  {getStatusBadge(order.paymentStatus, 'payment')}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Tracking Status</div>
                  {getStatusBadge(order.trackingStatus, 'tracking')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions for M-Pesa */}
          {order.paymentMethod === "MPESA" && order.paymentStatus === "PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  M-Pesa Payment Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleInitiateMpesa}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Initiate Payment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQueryMpesa}
                    disabled={loading}
                  >
                    Query Status
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMarkPaymentCompleted}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Paid
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleMarkPaymentFailed}
                    disabled={loading}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Mark Failed
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
                <CardDescription>
                  Change the order, payment, or tracking status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Order Status
                  </label>
                  <Select value={orderStatus} onValueChange={(value) => setOrderStatus(value as typeof orderStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payment Status
                  </label>
                  <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as typeof paymentStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tracking Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Tracking Status
                  </label>
                  <Select value={trackingStatus} onValueChange={(value) => setTrackingStatus(value as typeof trackingStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
