import {
    User,
    Mail,
    Calendar,
    Shield,
    Crown,
    Users
} from "lucide-react";
import type { User as UserType } from "./useUsers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

interface UserDetailsDialogProps {
    user: UserType;
    onClose: () => void;
}

export default function UserDetailsDialog({ user, onClose }: UserDetailsDialogProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPERADMIN': return <Crown className="h-4 w-4 text-purple-500" />;
            case 'ADMIN': return <Shield className="h-4 w-4 text-blue-500" />;
            default: return <Users className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<string, { variant: any; className?: string }> = {
            USER: { variant: "secondary" },
            ADMIN: { variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
            SUPERADMIN: { variant: "default", className: "bg-purple-500 hover:bg-purple-600" }
        };

        const config = variants[role] || variants.USER;

        return (
            <Badge variant={config.variant} className={config.className}>
                {role.toLowerCase()}
            </Badge>
        );
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return 'Has full system access and can manage all users and settings';
            case 'ADMIN':
                return 'Can manage users, orders, and products but has limited system settings access';
            case 'USER':
                return 'Standard user with access to place orders and manage their account';
            default:
                return 'Standard user account';
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Username:</span>
                                <span className="font-semibold">{user.username}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Email:</span>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">User ID:</span>
                                <span className="font-mono text-sm">{user.id}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Account Created:</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{formatDate(user.createdAt)}</span>
                                </div>
                            </div>

                            {user.updatedAt && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Last Updated:</span>
                                    <span className="text-sm">{formatDate(user.updatedAt)}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getRoleIcon(user.role)}
                                Role & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Current Role:</span>
                                {getRoleBadge(user.role)}
                            </div>

                            <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Role Description</h4>
                                <p className="text-sm text-muted-foreground">
                                    {getRoleDescription(user.role)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Permissions</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {user.role === 'SUPERADMIN' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Full system administration
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                User management
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Order management
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Product management
                                            </div>
                                        </>
                                    )}

                                    {user.role === 'ADMIN' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                User management
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Order management
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                Product management
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                Limited system settings
                                            </div>
                                        </>
                                    )}

                                    {user.role === 'USER' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Place orders
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                Manage account
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                View order history
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}