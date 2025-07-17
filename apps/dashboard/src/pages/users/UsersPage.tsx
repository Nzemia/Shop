import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  UserCheck,
  Crown,
  RefreshCw,
  Download,
  MoreHorizontal,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { useUsers, type User } from "./useUsers";
import { useAuth } from "../../lib/auth";
import EditUserForm from "./EditUserForm";
import UserDetailsDialog from "./UserDetailsDialog";
import UserFilters from "./UserFilters";
import BulkActionsDialog from "./BulkActionsDialog";
import AddUserDialog from "./AddUserDialog";
import AccessDeniedPage from "../errors/AccessDeniedPage";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Checkbox } from "../../components/ui/checkbox";

export default function UsersPage() {
  const { canManageUsers } = useAuth();
  const {
    users,
    stats,
    loading,
    filters,
    applyFilters,
    fetchUsers,
    deleteUser
  } = useUsers();

  // Check if user has permission to access this page
  if (!canManageUsers) {
    return <AccessDeniedPage requiredRole="ADMIN" message="You need administrator privileges to manage users." />;
  }

  const [editing, setEditing] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ ...filters, search: searchTerm });
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const success = await deleteUser(user.id);
    if (success) {
      setUserToDelete(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { variant: any; icon: any; className?: string }> = {
      USER: { variant: "secondary", icon: Users },
      ADMIN: { variant: "default", icon: Shield, className: "bg-blue-500 hover:bg-blue-600" },
      SUPERADMIN: { variant: "default", icon: Crown, className: "bg-purple-500 hover:bg-purple-600" }
    };

    const config = variants[role] || variants.USER;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {role.toLowerCase()}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
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
          <Button size="sm" onClick={() => setShowAddUser(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
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
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentUsers} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.regularUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.regularUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.adminUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.superAdminUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Highest privileges
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
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {selectedUsers.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowBulkActions(true)}
                  className="shrink-0"
                >
                  Actions ({selectedUsers.length})
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <UserFilters
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditing(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setUserToDelete(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {editing && (
        <EditUserForm
          user={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {viewingUser && (
        <UserDetailsDialog
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {showBulkActions && (
        <BulkActionsDialog
          selectedUsers={selectedUsers}
          onClose={() => {
            setShowBulkActions(false);
            setSelectedUsers([]);
          }}
        />
      )}

      <AddUserDialog
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onUserAdded={fetchUsers}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.username}</strong>?
              This action cannot be undone and will permanently remove the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
