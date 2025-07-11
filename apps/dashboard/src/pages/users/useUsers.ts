import { useEffect, useState } from "react";
import axios from "axios";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get("/api/users");
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
    await axios.put(`/api/users/${id}`, data);
    await fetch();
  };

  const deleteUser = async (id: string) => {
    await axios.delete(`/api/users/${id}`);
    await fetch();
  };

  return {
    users,
    loading,
    updateUser,
    deleteUser
  };
};
