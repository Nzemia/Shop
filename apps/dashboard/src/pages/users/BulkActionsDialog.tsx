import { useState } from "react";
import {
    Users,
    Shield,
    Crown,
    Trash2,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { useUsers } from "./useUsers";
import { useAuth } from "../../lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

interface BulkActionsDialogProps {
    selectedUsers: string[];
    onClose: () => void;
}

export default function BulkActionsDialog({ selectedUsers, onClose }: BulkActionsDialogProps) {
    const { bulkUpdateRole, bulkDelete, allUsers } = useUsers();
    const { canPromoteUsers } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const selectedUserDetails = allUsers.filter(user => selectedUsers.includes(user.id));

    const handleBulkRoleUpdate = async () => {
        if (!selectedRole) return;

        setLoading(true);
        const success = await bulkUpdateRole(selectedUsers, selectedRole);
        setLoading(false);

        if (success) {
            onClose();
        }
    };

    const handleBulkDelete = async () => {
        setLoading(true);
        const success = await bulkDelete(selectedUsers);
        setLoading(false);

        if (success) {
            setShowDeleteConfirm(false);
            onClose();
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPERADMIN': return <Crown className="h-3 w-3 text-purple-500" />;
            case 'ADMIN': return <Shield className="h-3 w-3 text-blue-500" />;
            default: return <Users className="h-3 w-3 text-gray-500" />;
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
                {getRoleIcon(role)}
                <span className="ml-1">{role.toLowerCase()}</span>
            </Badge>
        );
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Bulk Actions ({selectedUsers.length} users)
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Selected Users Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Selected Users</CardTitle>
                                <CardDescription>
                                    {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected for bulk actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {selectedUserDetails.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                            {getRoleBadge(user.role)}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bulk Role Update */}
                        {canPromoteUsers ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Update Roles
                                    </CardTitle>
                                    <CardDescription>
                                        Change the role for all selected users
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">New Role</label>
                                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select new role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        User
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        Admin
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="SUPERADMIN">
                                                    <div className="flex items-center gap-2">
                                                        <Crown className="h-4 w-4" />
                                                        Super Admin
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        onClick={handleBulkRoleUpdate}
                                        disabled={!selectedRole || loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Updating Roles...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="h-4 w-4 mr-2" />
                                                Update {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-yellow-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                                        <Shield className="h-4 w-4" />
                                        Role Management Restricted
                                    </CardTitle>
                                    <CardDescription>
                                        Only Super Administrators can change user roles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <Crown className="h-4 w-4 inline mr-1" />
                                            You need Super Administrator privileges to modify user roles.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Separator />

                        {/* Bulk Delete */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Users
                                </CardTitle>
                                <CardDescription>
                                    Permanently delete all selected users. This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Multiple Users
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}</strong>?
                            This action cannot be undone and will permanently remove all selected user accounts.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Users'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}