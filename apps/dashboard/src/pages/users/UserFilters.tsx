import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { UserFilters as UserFiltersType } from "./useUsers";

interface UserFiltersProps {
    filters: UserFiltersType;
    onFiltersChange: (filters: UserFiltersType) => void;
    onClose: () => void;
}

export default function UserFilters({ filters, onFiltersChange, onClose }: UserFiltersProps) {
    const [localFilters, setLocalFilters] = useState<UserFiltersType>(filters);

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

    const updateFilter = (key: keyof UserFiltersType, value: string | undefined) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Filter Users</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Select
                            value={localFilters.role || ""}
                            onValueChange={(value) => updateFilter('role', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All roles</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
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