
import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
  Download
} from "lucide-react";
import { useOrders, type Order } from "./useOrders";
import UpdateOrderForm from "./UpdateOrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import OrderFilters from "./OrderFilters";
import OrderDetailsDialog from "./OrderDetailsDialog";

export default function OrdersPage() {
  const {
    orders,
    stats,
    loading,
    statsLoading,
    pagination,
    filters,
    applyFilters,
    changePage,
    fetchOrders,
    fetchStats
  } = useOrders();

  const [editing, setEditing] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ ...filters, search: searchTerm });
  };

  const handleRefresh = () => {
    fetchOrders();
    fetchStats();
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

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge variant={method === "MPESA" ? "default" : "outline"}>
        {method === "MPESA" ? "M-Pesa" : "Door Delivery"}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
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
          ))
        ) : stats ? (
          <>
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
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
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
          </>
        ) : null}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders by number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <OrderFilters
              filters={filters}
              onFiltersChange={applyFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {getPaymentMethodBadge(order.paymentMethod)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.paymentStatus, 'payment')}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(order.status, 'order')}
                          {getStatusBadge(order.trackingStatus, 'tracking')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => changePage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {editing && (
        <UpdateOrderForm
          order={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {viewingOrder && (
        <OrderDetailsDialog
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
}
