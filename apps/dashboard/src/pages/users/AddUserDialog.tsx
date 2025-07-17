import { useState } from "react";
import {
    UserPlus,
    Mail,
    User,
    Shield,
    Crown,
    Users,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import api from "../../lib/api";

interface AddUserDialogProps {
    open: boolean;
    onClose: () => void;
    onUserAdded: () => void;
}

export default function AddUserDialog({ open, onClose, onUserAdded }: AddUserDialogProps) {
    const { canPromoteUsers } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER' as 'USER' | 'ADMIN' | 'SUPERADMIN'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        // Check if user can assign the selected role
        if ((formData.role === 'ADMIN' || formData.role === 'SUPERADMIN') && !canPromoteUsers) {
            toast.error("You don't have permission to create admin users");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            if (response.status === 201) {
                toast.success("User created successfully");
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    role: 'USER'
                });
                onUserAdded();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create user");
            console.error("Create user error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
                {getRoleIcon(role)}
                <span className="ml-1">{role.toLowerCase()}</span>
            </Badge>
        );
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return 'Full system access and can manage all users and settings';
            case 'ADMIN':
                return 'Can manage users, orders, and products with limited system settings access';
            case 'USER':
                return 'Standard user with access to place orders and manage their account';
            default:
                return 'Standard user account';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Add New User
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                            <CardDescription>
                                Enter the basic information for the new user account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Username *
                                </Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Enter password (min. 6 characters)"
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Assignment</CardTitle>
                            <CardDescription>
                                Set the user's role and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Role Field */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Role
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                User
                                            </div>
                                        </SelectItem>
                                        {canPromoteUsers && (
                                            <>
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
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Role Preview */}
                            <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium">Selected Role:</span>
                                    {getRoleBadge(formData.role)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {getRoleDescription(formData.role)}
                                </p>
                            </div>

                            {!canPromoteUsers && (
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <Shield className="h-4 w-4 inline mr-1" />
                                        You can only create regular users. Contact a Super Admin to create admin accounts.
                                    </p>
                                </div>
                            )}
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
                                    Creating User...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Create User
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}