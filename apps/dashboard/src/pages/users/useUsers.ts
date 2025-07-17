import { useEffect, useState } from "react";
import api from "../../lib/api";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await api.get("/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateUser = async (
    id: string,
    data: { username: string; role: string }
  ) => {
    await api.put(`/users/${id}`, data);
    await fetch();
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    await fetch();
  };

  return {
    users,
    loading,
    updateUser,
    deleteUser
  };
};
