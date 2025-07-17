import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt?: string;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  superAdminUsers: number;
  recentUsers: number;
}

export interface UserFilters {
  role?: string;
  search?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const userData = res.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
      calculateStats(userData);
    } catch (error: any) {
      toast.error("Failed to fetch users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData: User[]) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: UserStats = {
      totalUsers: userData.length,
      adminUsers: userData.filter(user => user.role === "ADMIN").length,
      regularUsers: userData.filter(user => user.role === "USER").length,
      superAdminUsers: userData.filter(user => user.role === "SUPERADMIN").length,
      recentUsers: userData.filter(user => new Date(user.createdAt) >= sevenDaysAgo).length
    };

    setStats(stats);
  };

  const applyFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);

    let filtered = [...users];

    // Filter by role
    if (newFilters.role && newFilters.role !== "ALL") {
      filtered = filtered.filter(user => user.role === newFilters.role);
    }

    // Filter by search term
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  };

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (error: any) {
      toast.error("Failed to fetch user details");
      console.error("Fetch user error:", error);
      return null;
    }
  };

  const updateUser = async (
    id: string,
    data: { username: string; role: string }
  ) => {
    try {
      const res = await api.put(`/users/${id}`, data);
      if (res.status === 200) {
        toast.success("User updated successfully");
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
      console.error("Update user error:", error);
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await api.delete(`/users/${id}`);
      if (res.status === 204) {
        toast.success("User deleted successfully");
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error("Delete user error:", error);
      return false;
    }
  };

  const bulkUpdateRole = async (userIds: string[], newRole: string) => {
    try {
      const promises = userIds.map(id =>
        api.put(`/users/${id}`, { role: newRole })
      );

      await Promise.all(promises);
      toast.success(`Updated ${userIds.length} users successfully`);
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast.error("Failed to update users");
      console.error("Bulk update error:", error);
      return false;
    }
  };

  const bulkDelete = async (userIds: string[]) => {
    try {
      const promises = userIds.map(id => api.delete(`/users/${id}`));
      await Promise.all(promises);
      toast.success(`Deleted ${userIds.length} users successfully`);
      await fetchUsers();
      return true;
    } catch (error: any) {
      toast.error("Failed to delete users");
      console.error("Bulk delete error:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [users, filters]);

  return {
    // Data
    users: filteredUsers,
    allUsers: users,
    stats,
    filters,

    // Loading state
    loading,

    // Actions
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    bulkUpdateRole,
    bulkDelete,
    applyFilters
  };
};
