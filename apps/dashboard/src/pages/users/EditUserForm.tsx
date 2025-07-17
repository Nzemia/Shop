import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Crown,
  Users,
  Loader2,
  Save
} from "lucide-react";
import { useUsers, type User as UserType } from "./useUsers";
import { useAuth } from "../../lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface EditUserFormProps {
  user: UserType;
  onClose: () => void;
}

export default function EditUserForm({ user, onClose }: EditUserFormProps) {
  const { updateUser } = useUsers();
  const { canPromoteUsers } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await updateUser(user.id, { username, role });

    setLoading(false);
    if (success) {
      onClose();
    }
  };

  const getRoleIcon = (roleValue: string) => {
    switch (roleValue) {
      case 'SUPERADMIN': return <Crown className="h-4 w-4 text-purple-500" />;
      case 'ADMIN': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (roleValue: string) => {
    const variants: Record<string, { variant: any; className?: string }> = {
      USER: { variant: "secondary" },
      ADMIN: { variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
      SUPERADMIN: { variant: "default", className: "bg-purple-500 hover:bg-purple-600" }
    };

    const config = variants[roleValue] || variants.USER;

    return (
      <Badge variant={config.variant} className={config.className}>
        {getRoleIcon(roleValue)}
        <span className="ml-1">{roleValue.toLowerCase()}</span>
      </Badge>
    );
  };

  const getRoleDescription = (roleValue: string) => {
    switch (roleValue) {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User - {user.username}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current User Information</CardTitle>
              <CardDescription>
                User ID: {user.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email:</span>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Role:</span>
                {getRoleBadge(user.role)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Member Since:</span>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Update User Details</CardTitle>
              <CardDescription>
                Modify the user's username and role permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as typeof role)}
                  disabled={!canPromoteUsers}
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

              {!canPromoteUsers && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Only Super Administrators can change user roles.
                  </p>
                </div>
              )}

              {/* Role Preview */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">New Role:</span>
                  {getRoleBadge(role)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(role)}
                </p>
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
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
