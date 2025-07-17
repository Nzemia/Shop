import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { OrderFilters as OrderFiltersType } from "./useOrders";

interface OrderFiltersProps {
    filters: OrderFiltersType;
    onFiltersChange: (filters: OrderFiltersType) => void;
    onClose: () => void;
}

export default function OrderFilters({ filters, onFiltersChange, onClose }: OrderFiltersProps) {
    const [localFilters, setLocalFilters] = useState<OrderFiltersType>(filters);

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const handleClearFilters = () => {
        const clearedFilters = {};
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
        onClose();
    };

    const updateFilter = (key: keyof OrderFiltersType, value: string | undefined) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Filter Orders</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Order Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Order Status</label>
                        <Select
                            value={localFilters.status || ""}
                            onValueChange={(value) => updateFilter('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="CANCELED">Canceled</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Status</label>
                        <Select
                            value={localFilters.paymentStatus || ""}
                            onValueChange={(value) => updateFilter('paymentStatus', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All payments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All payments</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tracking Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tracking Status</label>
                        <Select
                            value={localFilters.trackingStatus || ""}
                            onValueChange={(value) => updateFilter('trackingStatus', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All tracking" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All tracking</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select
                            value={localFilters.paymentMethod || ""}
                            onValueChange={(value) => updateFilter('paymentMethod', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All methods" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All methods</SelectItem>
                                <SelectItem value="MPESA">M-Pesa</SelectItem>
                                <SelectItem value="DOOR_DELIVERY">Door Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleClearFilters}>
                        Clear All
                    </Button>
                    <Button onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}